import requests
import logging

logger = logging.getLogger("crawler.moustache")


def crawl_moustache(context: dict) -> dict:
    """
    Crawl Moustache Udaipur via their API.
    Extracts real min_price. Availability is not exposed via API.
    """
    url = "https://w9r26vf4lk.execute-api.ap-south-1.amazonaws.com/v1/api/v1/properties/2829bd3f-3d70-4514-b43f-5204a78367c2"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json"
    }

    price = 299.0
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            min_p = data.get("data", {}).get("min_price")
            if min_p:
                price = float(min_p)
                logger.info(f"Moustache LIVE price: {price}")
    except Exception as e:
        logger.error(f"Moustache API error: {e}")

    # Moustache API does not expose real-time bed availability
    # Return None for availability fields so dashboard uses sheet data
    return {
        "total_beds": 74,
        "available_beds": None,
        "occupied_beds": None,
        "occupancy_pct": None,
        "price": price,
        "status": "AVAILABLE"
    }
