"""
Orchestrates: raw CSV bytes -> validate_and_clean -> Supabase insert.
This is the single entrypoint the /upload route calls.
"""
import pandas as pd
from io import BytesIO
from app.config.loader import IndustryConfig
from app.ingestion.validators import validate_and_clean
from app.db.supabase_client import insert_rows


TABLE_MAP = {
    "sales": "sales",
    "inventory": "inventory",
}


def process_upload(file_bytes: bytes, dataset: str, business_id: str, config: IndustryConfig) -> dict:
    df = pd.read_csv(BytesIO(file_bytes))
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    rows_received = len(df)
    cleaned, issues = validate_and_clean(df, dataset, config)

    if not cleaned.empty:
        cleaned = cleaned.copy()
        cleaned["business_id"] = business_id
        if "date" in cleaned.columns:
            cleaned["date"] = cleaned["date"].dt.strftime("%Y-%m-%d")
        if "expiry_date" in cleaned.columns:
            cleaned["expiry_date"] = cleaned["expiry_date"].dt.strftime("%Y-%m-%d")
        table = TABLE_MAP.get(dataset, dataset)
        insert_rows(table, cleaned.to_dict(orient="records"))

    return {
        "rows_received": rows_received,
        "rows_inserted": len(cleaned),
        "rows_rejected": rows_received - len(cleaned),
        "issues": issues,
    }
