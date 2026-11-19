import json
import re
import requests
import logging
from bs4 import BeautifulSoup

logger = logging.getLogger("crawler.zostel")


def crawl_zostel(context: dict, hostel_config: dict = None) -> dict:
    """
    Crawl Zostel properties by extracting real price and availability data
    from the HTML page. Supports both Udaipur and Hyderabad.
    """
    checkin = context["checkin_date"]
    checkout = context["checkout_date"]

    # Determine which Zostel property to crawl
    if hostel_config and "direct_url" in hostel_config:
        base_url = hostel_config["direct_url"].split("?")[0]
        total_beds_known = hostel_config.get("total_beds", 42)
        default_price = hostel_config.get("default_price", 899.0)
    else:
        base_url = "https://www.zostel.com/destination/udaipur/stay/udaipur-udph705"
        total_beds_known = 42
        default_price = 899.0

    url = f"{base_url}?checkin={checkin}&checkout={checkout}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }

    try:
        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code == 200:
            html_text = resp.text
            soup = BeautifulSoup(html_text, "html.parser")

            # --- Strategy 1: Parse LD+JSON structured data ---
            dorm_avail = 0
            lowest_price = None
            found_dorm = False

            scripts = soup.find_all("script", type="application/ld+json")
            for s in scripts:
                try:
                    data = json.loads(s.string)
                    items = data if isinstance(data, list) else [data]
                    for item in items:
                        rooms = item.get("containsPlace", [])
                        if not rooms and item.get("@type") == "HotelRoom":
                            rooms = [item]
                        for r in rooms:
                            name = r.get("name", "")
                            if re.search(r"dorm|bed", name, re.I) and not re.search(r"private|double|twin|deluxe", name, re.I):
                                found_dorm = True
                                bed_m = re.search(r"(\d+)\s*Bed", name, re.I)
                                beds = int(bed_m.group(1)) if bed_m else 6
                                is_sold = (r.get("offers", {}).get("availability") == "https://schema.org/SoldOut")
                                if not is_sold:
                                    dorm_avail += beds
                                price = r.get("offers", {}).get("priceSpecification", {}).get("price")
                                if price and (lowest_price is None or float(price) < lowest_price):
                                    lowest_price = float(price)
                except Exception:
                    continue

            # --- Strategy 2: Extract prices from raw HTML regex ---
            if lowest_price is None:
                # Find all price values in the HTML (Zostel embeds them in JS/HTML)
                all_prices = re.findall(r'"price"\s*:\s*(\d+)', html_text)
                dorm_prices = [int(p) for p in all_prices if 200 <= int(p) <= 2000]  # Dorm range
                if dorm_prices:
                    lowest_price = float(min(dorm_prices))
                    logger.info(f"Zostel price from regex: {lowest_price} (all dorm-range: {sorted(set(dorm_prices))})")

            # --- Strategy 3: Check sold-out indicators ---
            is_fully_sold = False
            if "SoldOut" in html_text and dorm_avail == 0 and not found_dorm:
                is_fully_sold = True
            # Also check for "sold out" text patterns
            sold_patterns = re.findall(r'sold\s*out', html_text, re.I)
            if len(sold_patterns) > 3 and dorm_avail == 0:
                is_fully_sold = True

            if is_fully_sold:
                return {
                    "total_beds": total_beds_known,
                    "available_beds": 0,
                    "occupied_beds": total_beds_known,
                    "occupancy_pct": 100.0,
                    "price": lowest_price or default_price,
                    "status": "SOLD OUT"
                }

            if found_dorm:
                occ_beds = max(0, total_beds_known - dorm_avail)
                occ_pct = round((occ_beds / total_beds_known) * 100, 1)
                return {
                    "total_beds": total_beds_known,
                    "available_beds": dorm_avail,
                    "occupied_beds": occ_beds,
                    "occupancy_pct": occ_pct,
                    "price": lowest_price or default_price,
                    "status": "SOLD OUT" if dorm_avail == 0 else ("LIMITED AVAILABILITY" if dorm_avail <= 4 else "AVAILABLE")
                }

            # LD+JSON didn't have rooms but we got price from regex
            # Zostel is JS-rendered so we can't get exact bed availability from HTML
            # Return price with unknown availability marker
            if lowest_price:
                return {
                    "total_beds": total_beds_known,
                    "available_beds": None,  # Unknown - will be filled by dashboard_service fallback
                    "occupied_beds": None,
                    "occupancy_pct": None,
                    "price": lowest_price,
                    "status": "AVAILABLE"
                }

    except Exception as e:
        logger.error(f"Zostel crawl error for {url}: {e}")

    # Complete fallback - return with actual price if extracted, otherwise default
    return {
        "total_beds": total_beds_known,
        "available_beds": None,
        "occupied_beds": None,
        "occupancy_pct": None,
        "price": default_price,
        "status": "AVAILABLE"
    }
