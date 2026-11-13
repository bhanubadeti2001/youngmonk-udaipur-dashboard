import secrets
import re

def generate_tracking_id(hostel_id: str, slot: str, report_date: str) -> str:
    clean_date = report_date.replace("-", "")
    clean_slot = re.sub(r"[:\s]", "", slot).upper()
    hostel_code = re.sub(r"[^A-Za-z0-9]", "", hostel_id)[:6].upper()
    rand_hex = secrets.token_hex(2).upper()
    return f"TRK-{clean_date}-{clean_slot}-{hostel_code}-{rand_hex}"
