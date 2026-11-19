from datetime import datetime, timedelta
import pytz

IST = pytz.timezone("Asia/Kolkata")

SCHEDULED_SLOTS = [
    "01:00 AM", "06:00 AM", "08:00 AM", "10:00 AM",
    "12:00 PM", "02:00 PM", "05:00 PM", "08:00 PM",
    "11:00 PM"
]

def get_current_slot(dt: datetime) -> str:
    hour = dt.hour
    if hour < 4:
        return "01:00 AM"   # 1:00 AM Post-Midnight Trigger (Night Inventory Reset)
    elif hour < 7:
        return "06:00 AM"
    elif hour < 9:
        return "08:00 AM"
    elif hour < 11:
        return "10:00 AM"
    elif hour < 14:
        return "12:00 PM"
    elif hour < 16:
        return "02:00 PM"   # 2:00 PM Afternoon Check-in Velocity
    elif hour < 19:
        return "05:00 PM"   # 5:00 PM Evening Rush Trigger
    elif hour < 22:
        return "08:00 PM"
    else:
        return "11:00 PM"   # 11:00 PM Late Night Audit Trigger

def get_tracking_context(days_ahead_checkin: int = 1, length_of_stay: int = 1) -> dict:
    now_ist = datetime.now(IST)
    checkin_dt = now_ist + timedelta(days=days_ahead_checkin)
    checkout_dt = checkin_dt + timedelta(days=length_of_stay)

    return {
        "report_date": now_ist.strftime("%Y-%m-%d"),
        "report_time": now_ist.strftime("%H:%M:%S"),
        "slot": get_current_slot(now_ist),
        "checkin_date": checkin_dt.strftime("%Y-%m-%d"),
        "checkout_date": checkout_dt.strftime("%Y-%m-%d"),
        "timestamp_ist": now_ist.strftime("%Y-%m-%d %H:%M:%S"),
        "timezone": "Asia/Kolkata"
    }
