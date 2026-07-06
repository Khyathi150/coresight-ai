"""
Thin wrapper around the Supabase Python client.
All engines (ingestion, kpi, forecasting, anomaly, copilot) read/write
through this module — nothing talks to Postgres directly.
"""
import os
from functools import lru_cache
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()


@lru_cache()
def get_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL / SUPABASE_KEY missing. Copy .env.example to .env "
            "and fill in your free Supabase project credentials."
        )
    return create_client(url, key)


def insert_rows(table: str, rows: list[dict]):
    if not rows:
        return
    client = get_client()
    client.table(table).insert(rows).execute()


def fetch_rows(table: str, business_id: str, order_by: str | None = None) -> list[dict]:
    client = get_client()
    q = client.table(table).select("*").eq("business_id", business_id)
    if order_by:
        q = q.order(order_by)
    return q.execute().data
