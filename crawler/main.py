import os
import sys
import logging
from typing import List, Dict, Any

from date_manager import get_tracking_context
from tracking_id import generate_tracking_id
from hostel_crawlers.zostel import crawl_zostel
from hostel_crawlers.hosteller import crawl_hosteller
from hostel_crawlers.stayflexi import crawl_young_monk
from hostel_crawlers.moustache import crawl_moustache
from hostel_crawlers.generic_ota import crawl_generic_ota

# Import Google Sheets Service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from sheets_service import sheets_client, SPREADSHEET_ID

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("crawler_main")

HOSTELS = [
    {"id": "zostel-udaipur", "name": "Zostel Udaipur", "category": "A", "total_beds": 42, "crawler": "zostel", "direct_url": "https://www.zostel.com/destination/udaipur/stay/udaipur-udph705"},
    {"id": "the-hosteller-udaipur", "name": "The Hosteller Udaipur", "category": "A", "total_beds": 29, "crawler": "hosteller", "direct_url": "https://www.thehosteller.com/hostels/the-hosteller-udaipur/"},
    {"id": "gostops-udaipur", "name": "goSTOPS Udaipur", "category": "A", "total_beds": 44, "crawler": "generic", "default_price": 200.0, "direct_url": "https://gostops.com/stay/Udaipur"},
    {"id": "moustache-udaipur", "name": "Moustache Udaipur", "category": "A", "total_beds": 74, "crawler": "moustache", "direct_url": "https://w9r26vf4lk.execute-api.ap-south-1.amazonaws.com"},
    {"id": "young-monk-udaipur", "name": "Young Monk Hostel Udaipur", "category": "B", "total_beds": 43, "crawler": "stayflexi", "direct_url": "https://bookingengine.stayflexi.com/?hotel_id=33313"},
    {"id": "hostel-funky", "name": "Hostel Funky", "category": "B", "total_beds": 24, "crawler": "generic", "default_price": 400.0, "direct_url": "https://www.hostelworld.com/st/hostels/p/hostel-funky-bunky-udaipur"},
    {"id": "bunky-bunkyard", "name": "Bunky Bunkyard Hostel", "category": "B", "total_beds": 28, "crawler": "generic", "default_price": 450.0, "direct_url": "https://www.bunkyardhostel.com/"},
    {"id": "dream-yard", "name": "Dream Yard", "category": "C", "total_beds": 32, "crawler": "generic", "default_price": 450.0, "direct_url": "https://www.hostelworld.com/st/hostels/p/dreamyard-udaipur"},
    {"id": "multiple-stories", "name": "Multiple Stories", "category": "C", "total_beds": 22, "crawler": "generic", "default_price": 450.0, "direct_url": "https://www.booking.com/hotel/in/multiple-stories-udaipur.html"},
    {"id": "hype-hostel", "name": "Hype Hostel", "category": "C", "total_beds": 26, "crawler": "generic", "default_price": 399.0, "direct_url": "https://www.booking.com/hotel/in/old-skool-udaipur-20-meter-from-lake.html"},
    {"id": "turtle-hostel", "name": "Turtle Hostel", "category": "C", "total_beds": 20, "crawler": "generic", "default_price": 350.0, "direct_url": "https://www.booking.com/hotel/in/hostel-turtle-by-the-lake-10-meter-from-lake-pichola.html"},
]

def insert_top_with_gap(sheet_title: str, rows: List[List[Any]], num_cols: int = 16):
    if not sheets_client.service or not rows:
        return
    try:
        # 1. Fetch metadata to get sheetId
        meta = sheets_client.service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
        sheet_id = None
        for s in meta.get("sheets", []):
            if s.get("properties", {}).get("title") == sheet_title:
                sheet_id = s.get("properties", {}).get("sheetId")
                break
        
        if sheet_id is None:
            logger.warning(f"Sheet {sheet_title} not found")
            return

        blank_row = ["" for _ in range(num_cols)]
        to_insert = rows + [blank_row]
        count = len(to_insert)

        # 2. Insert blank rows at index 1 (Row 2 in 1-based index)
        body = {
            "requests": [{
                "insertDimension": {
                    "range": {
                        "sheetId": sheet_id,
                        "dimension": "ROWS",
                        "startIndex": 1,
                        "endIndex": 1 + count
                    },
                    "inheritFromBefore": False
                }
            }]
        }
        sheets_client.service.spreadsheets().batchUpdate(
            spreadsheetId=SPREADSHEET_ID,
            body=body
        ).execute()

        # 3. Write data to A2
        end_col_char = chr(ord('A') + num_cols - 1)
        range_target = f"{sheet_title}!A2:{end_col_char}{1 + count}"
        sheets_client.service.spreadsheets().values().update(
            spreadsheetId=SPREADSHEET_ID,
            range=range_target,
            valueInputOption="USER_ENTERED",
            body={"values": to_insert}
        ).execute()
        logger.info(f"Successfully inserted {len(rows)} records at Row 2 of '{sheet_title}' with spacer gap.")
    except Exception as e:
        logger.error(f"Error inserting at top of {sheet_title}: {e}")

def run_crawler_cycle():
    context = get_tracking_context()
    logger.info("=====================================================")
    logger.info(f" Starting Automated Udaipur Hostel Crawler Execution")
    logger.info(f" Report Date: {context['report_date']} | Slot: {context['slot']}")
    logger.info(f" Check-in: {context['checkin_date']} -> Check-out: {context['checkout_date']}")
    logger.info("=====================================================")

    raw_rows = []
    cat_a_rows = []
    cat_b_rows = []
    cat_c_rows = []

    for h in HOSTELS:
        tracking_id = generate_tracking_id(h["id"], context["slot"], context["report_date"])
        logger.info(f"Crawling [{h['category']}] {h['name']}...")

        metrics = {}
        if h["crawler"] == "zostel":
            metrics = crawl_zostel(context)
        elif h["crawler"] == "hosteller":
            metrics = crawl_hosteller(context)
        elif h["crawler"] == "stayflexi":
            metrics = crawl_young_monk(context)
        elif h["crawler"] == "moustache":
            metrics = crawl_moustache(context)
        else:
            metrics = crawl_generic_ota(h, context)

        row = [
            tracking_id,
            context["report_date"],
            context["slot"],
            h["category"],
            h["name"],
            metrics.get("total_beds"),
            metrics.get("available_beds"),
            metrics.get("occupied_beds"),
            metrics.get("occupancy_pct"),
            metrics.get("price"),
            "INR",
            context["checkin_date"],
            context["checkout_date"],
            h.get("direct_url", ""),
            metrics.get("status", "AVAILABLE"),
            context["timestamp_ist"]
        ]

        raw_rows.append(row)
        if h["category"] == "A":
            cat_a_rows.append(row)
        elif h["category"] == "B":
            cat_b_rows.append(row)
        elif h["category"] == "C":
            cat_c_rows.append(row)

    # Insert top with gap in Raw_Data and Category tabs
    insert_top_with_gap("Raw_Data", raw_rows, 16)
    insert_top_with_gap("Category_A", cat_a_rows, 16)
    insert_top_with_gap("Category_B", cat_b_rows, 16)
    insert_top_with_gap("Category_C", cat_c_rows, 16)

    logger.info("Crawler cycle completed successfully.")

if __name__ == "__main__":
    run_crawler_cycle()
