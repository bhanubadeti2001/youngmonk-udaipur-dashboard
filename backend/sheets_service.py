import os
import json
import logging
from typing import List, Dict, Any, Optional
from google.oauth2 import service_account
from googleapiclient.discovery import build
import pytz
from datetime import datetime

logger = logging.getLogger("sheets_service")

SPREADSHEET_ID = os.getenv("SPREADSHEET_ID", "1PiDruAwIELMPwgiVJ6TxTIqKqJeaw_LmTAyCNyEvLNM")
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

class SheetsService:
    def __init__(self):
        self.service = None
        self._init_service()

    def _init_service(self):
        try:
            creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
            # Check local path if not set
            if not creds_path or not os.path.exists(creds_path):
                curr_dir = os.path.dirname(os.path.abspath(__file__))
                local_path = os.path.join(curr_dir, "service_account.json")
                if os.path.exists(local_path):
                    creds_path = local_path

            json_content = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "")
            
            if creds_path and os.path.exists(creds_path):
                creds = service_account.Credentials.from_service_account_file(
                    creds_path, scopes=SCOPES
                )
            elif json_content:
                info = json.loads(json_content)
                creds = service_account.Credentials.from_service_account_info(
                    info, scopes=SCOPES
                )
            else:
                logger.warning("No service account credentials found. Using mock/cached mode.")
                return

            self.service = build("sheets", "v4", credentials=creds)
            logger.info("Successfully connected to Google Sheets API")
        except Exception as e:
            logger.error(f"Error initializing Google Sheets client: {e}")
            self.service = None

    def read_range(self, range_name: str) -> List[List[Any]]:
        if not self.service:
            logger.warning("Service not available, returning empty list")
            return []
        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=SPREADSHEET_ID,
                range=range_name
            ).execute()
            return result.get("values", [])
        except Exception as e:
            logger.error(f"Failed to read range {range_name}: {e}")
            return []

    def get_raw_data(self) -> List[List[Any]]:
        # Tries Raw_Data first, then fallback to MASTER_DATA
        data = self.read_range("Raw_Data!A:P")
        if not data:
            data = self.read_range("MASTER_DATA!A:P")
        return data

    def get_daily_summary(self) -> List[List[Any]]:
        return self.read_range("Daily_Summary!A:I")

    def get_price_comparison(self) -> List[List[Any]]:
        return self.read_range("Price_Comparison!A:F")

    def get_properties(self) -> List[List[Any]]:
        return self.read_range("Properties!A:E")

sheets_client = SheetsService()
