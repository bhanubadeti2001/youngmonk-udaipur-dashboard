# Udaipur Hostel Availability – Automated Web Dashboard

An enterprise-grade, cloud-native competitor intelligence and availability monitoring platform for the Udaipur backpacking and hostel ecosystem.

---

## 1. System Architecture

```
[Playwright / Python Crawler] ──(Every 2 Hours)──> [Google Sheets API]
                                                           │
                                                           ▼
                                                    [MASTER / RAW_DATA]
                                                           │
                                                           ▼
                                               [Python FastAPI Backend]
                                                           │
                                                    (Protected Auth)
                                                           │
                                                           ▼
                                             [React + Tailwind Dashboard]
                                                           │
                                                    (Auto-Sync 60s)
                                                           │
                                                           ▼
                                              [Client Web Browser (URL)]
```

---

## 2. Key Features

- **Separate Web Dashboard:** High-performance React SPA with Tailwind CSS, Recharts, and Lucide icons. Never exposes Google Sheets credentials or raw spreadsheets to clients.
- **ACRU Executive Design Aesthetic:**
  - Navy Blue: `#24364B`
  - Soft Green: `#79B85A`
  - Light Grey: `#F3F5F7`
  - Minimal cards, crisp typography, and 10-second readability.
- **7 Dedicated Navigation Modules:**
  1. **Overview:** 6 KPI Cards (Total Hostels, Available Hostels, Sold Out Hostels, Verified Available Beds, Lowest Available Price, Last Successful Update).
  2. **Live Availability:** 12-column professional table with real-time badges (`AVAILABLE`, `LIMITED AVAILABILITY`, `SOLD OUT`, `UNKNOWN`, `DATA ERROR`).
  3. **Category Analysis:** Segmented performance for Category A (Major Chains), Category B (Mid-Scale), and Category C (Boutique & Budget).
  4. **Price Comparison:** Ascending rate curve (INR), cheapest available hostel highlighter, and market variance ranking.
  5. **Time Slot Analysis:** 10 scheduled daily windows (12 AM, 6 AM, 8 AM, 10 AM, 12 PM, 2 PM, 4 PM, 6 PM, 8 PM, 10 PM) monitoring velocity.
  6. **Historical Reports:** Time-filtered audit log (Today, Yesterday, Last 7 Days, Last 30 Days, Custom Range) with one-click CSV export.
  7. **System Status:** Live cloud health, sheets connection status, and crawler scheduler heartbeat.
- **Automated Synchronization:** Polls every 60 seconds with live countdown indicator and instant manual refresh.
- **Protected Client Link:** Secure link exchange flow (`/access?token=...`) establishing an authenticated session without exposing permanent secrets in URLs.

---

## 3. Monitored Competitors (11 Hostels)

- **Category A (Major Chains):**
  - Zostel Udaipur (42 Beds)
  - The Hosteller Udaipur (29 Beds)
  - goSTOPS Udaipur (44 Beds)
  - Moustache Udaipur (74 Beds)
- **Category B (Mid-Scale):**
  - Young Monk Hostel Udaipur (43 Beds)
  - Hostel Funky (24 Beds)
  - Bunky Bunkyard Hostel (28 Beds)
- **Category C (Boutique & Budget):**
  - Dream Yard (32 Beds)
  - Multiple Stories (22 Beds)
  - Hype Hostel (26 Beds)
  - Turtle Hostel (20 Beds)

---

## 4. Protected Client Access Link

Clients can open the dashboard using the secure direct link:
```
https://<YOUR-CLOUD-RUN-URL>/access?token=udaipur-hostel-key-2026
```

Or open the dashboard URL and enter the access key:
```
udaipur-hostel-key-2026
```

---

## 5. Local Development & Verification

### Install Backend & Crawler:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Install Frontend:
```bash
cd frontend
npm install
npm run build
```

---

## 6. Google Cloud Run Deployment

Deploy with one command using Google Cloud Build:
```bash
gcloud builds submit --config=cloudbuild.yaml
```

Or deploy directly via container:
```bash
gcloud run deploy udaipur-hostel-dashboard \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```
