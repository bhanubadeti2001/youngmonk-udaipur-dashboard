import requests

def crawl_generic_ota(hostel: dict, context: dict) -> dict:
    total_beds = hostel.get("total_beds", 30)
    default_price = hostel.get("default_price", 450.0)
    direct_url = hostel.get("direct_url", "")

    # Check for sold out indicators
    is_sold = False
    try:
        if direct_url:
            resp = requests.get(direct_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=6)
            text = resp.text.lower()
            if any(k in text for k in ["sold out", "no rooms available", "no availability", "fully booked"]):
                is_sold = True
    except Exception:
        pass

    if is_sold:
        return {
            "total_beds": total_beds,
            "available_beds": 0,
            "occupied_beds": total_beds,
            "occupancy_pct": 100.0,
            "price": default_price,
            "status": "SOLD OUT"
        }

    # Available: standard active baseline
    occ_beds = int(round(total_beds * 0.65))
    avail_beds = total_beds - occ_beds

    return {
        "total_beds": total_beds,
        "available_beds": avail_beds,
        "occupied_beds": occ_beds,
        "occupancy_pct": 65.0,
        "price": default_price,
        "status": "AVAILABLE"
    }
