import re
import json
import requests
import logging

logger = logging.getLogger("crawler.hosteller")


def crawl_hosteller(context: dict, hostel_config: dict = None) -> dict:
    """
    Crawl The Hosteller properties and extract REAL basePrice and availability.
    Supports both Udaipur and Hyderabad HITEC City.
    """
    # Determine which property to crawl
    if hostel_config and "direct_url" in hostel_config:
        url = hostel_config["direct_url"]
        total_beds = hostel_config.get("total_beds", 29)
        default_price = hostel_config.get("default_price", 1423.0)
    else:
        url = "https://www.thehosteller.com/hostels/the-hosteller-udaipur/"
        total_beds = 29
        default_price = 1423.0

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    price = default_price
    status = "AVAILABLE"
    available_beds = None

    try:
        resp = requests.get(url, headers=headers, timeout=12)
        if resp.status_code == 200:
            text = resp.text

            # Check sold-out indicators
            text_lower = text.lower()
            if "sold out" in text_lower or "no rooms available" in text_lower or "fully booked" in text_lower:
                return {
                    "total_beds": total_beds,
                    "available_beds": 0,
                    "occupied_beds": total_beds,
                    "occupancy_pct": 100.0,
                    "price": price,
                    "status": "SOLD OUT"
                }

            # Extract basePrice (The Hosteller embeds this in their page JS/JSON)
            base_price_matches = re.findall(r'"basePrice"\s*:\s*(\d+)', text)
            if base_price_matches:
                # Take the lowest basePrice (usually the dorm bed)
                prices = [int(p) for p in base_price_matches]
                price = float(min(prices))
                logger.info(f"Hosteller LIVE basePrice: {price} (all: {prices})")

            # Try to extract room availability from JSON data embedded in page
            # Look for room inventory data
            room_matches = re.findall(r'"roomType"\s*:\s*"([^"]+)"[^}]*"available"\s*:\s*(\d+)', text)
            if room_matches:
                for room_type, avail in room_matches:
                    if any(k in room_type.lower() for k in ['dorm', 'bed', 'bunk', 'mixed']):
                        available_beds = (available_beds or 0) + int(avail)
                        logger.info(f"Hosteller dorm availability: {room_type} = {avail}")

            # Try alternative: look for inventory/availability JSON
            avail_matches = re.findall(r'"availableRooms"\s*:\s*(\d+)', text)
            if avail_matches and available_beds is None:
                available_beds = sum(int(a) for a in avail_matches)

            # Check for "Only X left" type patterns
            left_match = re.search(r'only\s+(\d+)\s+(?:bed|room|spot)', text_lower)
            if left_match and available_beds is None:
                available_beds = int(left_match.group(1))

    except Exception as e:
        logger.error(f"Hosteller crawl error for {url}: {e}")

    # Build result with real data
    if available_beds is not None:
        occupied_beds = max(0, total_beds - available_beds)
        occupancy_pct = round((occupied_beds / total_beds) * 100, 1) if total_beds > 0 else 0.0
        if available_beds == 0:
            status = "SOLD OUT"
        elif available_beds <= 4:
            status = "LIMITED AVAILABILITY"
    else:
        # Can't determine exact availability from HTML (JS-rendered)
        # Return None so dashboard_service uses Google Sheets data or catalog fallback
        occupied_beds = None
        occupancy_pct = None

    result = {
        "total_beds": total_beds,
        "available_beds": available_beds,
        "occupied_beds": occupied_beds,
        "occupancy_pct": occupancy_pct,
        "price": price,
        "status": status
    }
    logger.info(f"Hosteller result: {result}")
    return result
