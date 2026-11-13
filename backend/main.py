import os
import logging
from typing import Optional
from fastapi import FastAPI, Depends, Request, Response, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from auth import require_auth, verify_access_key, create_session, validate_session, revoke_session, DEFAULT_ACCESS_TOKEN
from dashboard_service import dashboard_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("main")

app = FastAPI(
    title="Udaipur Hostel Availability Dashboard API",
    description="Enterprise API powering the Udaipur Hostel Competitor Monitoring Dashboard",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuthRequest(BaseModel):
    token: str

@app.post("/api/auth/login")
async def login(auth_req: AuthRequest, response: Response):
    if verify_access_key(auth_req.token):
        session_token = create_session()
        response.set_cookie(
            key="udaipur_session",
            value=session_token,
            max_age=7 * 24 * 3600,
            httponly=True,
            samesite="lax",
            secure=False  # Set True in production HTTPS
        )
        return {
            "success": True,
            "session_token": session_token,
            "message": "Authenticated successfully"
        }
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"success": False, "message": "Invalid access key"}
    )

@app.get("/api/auth/verify")
async def verify(request: Request):
    auth_header = request.headers.get("Authorization", "")
    token = ""
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
    if not token:
        token = request.cookies.get("udaipur_session", "")

    if validate_session(token) or verify_access_key(token):
        return {"authenticated": True}
    return JSONResponse(status_code=401, content={"authenticated": False})

@app.post("/api/auth/logout")
async def logout(request: Request, response: Response):
    cookie_token = request.cookies.get("udaipur_session", "")
    if cookie_token:
        revoke_session(cookie_token)
    response.delete_cookie("udaipur_session")
    return {"success": True, "message": "Logged out successfully"}

# -------------------------------------------------------------
# Protected Dashboard Endpoints
# -------------------------------------------------------------

@app.get("/api/dashboard/overview", dependencies=[Depends(require_auth)])
async def get_overview():
    return dashboard_service.get_overview()

@app.get("/api/hostels", dependencies=[Depends(require_auth)])
async def get_hostels():
    return dashboard_service.get_latest_hostels()

@app.get("/api/categories", dependencies=[Depends(require_auth)])
async def get_categories():
    return dashboard_service.get_category_analysis()

@app.get("/api/prices", dependencies=[Depends(require_auth)])
async def get_prices():
    return dashboard_service.get_price_comparison()

@app.get("/api/timeslots", dependencies=[Depends(require_auth)])
async def get_timeslots():
    return dashboard_service.get_timeslot_analysis()

@app.get("/api/weekly-availability", dependencies=[Depends(require_auth)])
async def get_weekly_availability(start_date: Optional[str] = Query(None)):
    return dashboard_service.get_weekly_availability(start_date_str=start_date)

@app.get("/api/monthly-analysis", dependencies=[Depends(require_auth)])
async def get_monthly_analysis(month: Optional[str] = Query(None)):
    return dashboard_service.get_monthly_analysis(month_str=month)

@app.get("/api/export/monthly-csv", dependencies=[Depends(require_auth)])
async def export_monthly_csv(month: Optional[str] = Query(None)):
    csv_str = dashboard_service.generate_monthly_csv(month_str=month)
    target_month = month or "current_month"
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=Young_Monk_Udaipur_Monthly_Audit_{target_month}.csv"
        }
    )

@app.get("/api/history", dependencies=[Depends(require_auth)])
async def get_history(
    filter: str = Query("today", alias="filter"),
    start_date: Optional[str] = Query(None, alias="start_date"),
    end_date: Optional[str] = Query(None, alias="end_date")
):
    return dashboard_service.get_historical_reports(
        filter_type=filter,
        custom_start=start_date,
        custom_end=end_date
    )

@app.get("/api/system-status", dependencies=[Depends(require_auth)])
async def get_system_status():
    return dashboard_service.get_system_status()

# -------------------------------------------------------------
# Protected Direct Link Handler: /access?token=...
# -------------------------------------------------------------
@app.get("/access")
async def direct_access(token: str = Query("")):
    if verify_access_key(token):
        session_token = create_session()
        response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
        response.set_cookie(
            key="udaipur_session",
            value=session_token,
            max_age=7 * 24 * 3600,
            httponly=True,
            samesite="lax",
            secure=False
        )
        return response
    return RedirectResponse(url="/login?error=invalid_key", status_code=status.HTTP_302_FOUND)

# -------------------------------------------------------------
# SPA Frontend Mounting
# -------------------------------------------------------------
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"detail": "Not found"})
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
