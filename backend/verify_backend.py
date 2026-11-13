from dashboard_service import dashboard_service
import json

ov = dashboard_service.get_overview()
print("OVERVIEW KPI:")
print(json.dumps(ov, indent=2))

hostels = dashboard_service.get_latest_hostels()
print(f"\nALL {len(hostels)} HOSTELS:")
for h in hostels:
    print(f"[{h['category']}] {h['hostel_name']:28} | Beds: {h['available_beds']}/{h['total_beds']} ({h['occupancy_pct']}%) | INR {h['price']} | {h['status']}")

prices = dashboard_service.get_price_comparison()
print(f"\nPRICE COMPARISON ({len(prices)} Hostels):")
for p in prices:
    print(f"[{p['category']}] {p['hostel_name']:28} | INR {p['price']} | {p['flag']}")
