"""
Pure, deterministic KPI computation over sales/inventory data.
No LLM involved here — this is the "compute" half of compute-then-narrate.
"""
import pandas as pd
from app.db.supabase_client import fetch_rows


def _sales_df(business_id: str) -> pd.DataFrame:
    rows = fetch_rows("sales", business_id)
    df = pd.DataFrame(rows)
    if df.empty:
        return df
    df["date"] = pd.to_datetime(df["date"])
    df["revenue"] = df["quantity"] * df["unit_price"]
    df["cost"] = df["quantity"] * df["cost_price"]
    df["profit"] = df["revenue"] - df["cost"]
    return df


def compute_daily_kpis(business_id: str) -> pd.DataFrame:
    df = _sales_df(business_id)
    if df.empty:
        return pd.DataFrame(columns=["date", "revenue", "profit", "average_order_value", "orders"])

    daily = df.groupby(df["date"].dt.date).agg(
        revenue=("revenue", "sum"),
        profit=("profit", "sum"),
        orders=("quantity", "count"),
    ).reset_index()
    daily["average_order_value"] = (daily["revenue"] / daily["orders"]).round(2)
    daily["date"] = daily["date"].astype(str)
    return daily.sort_values("date")


def top_and_worst_products(business_id: str, n: int = 5) -> tuple[list[dict], list[dict]]:
    df = _sales_df(business_id)
    product_col = "product" if "product" in df.columns else "dish"
    if df.empty or product_col not in df.columns:
        return [], []

    grouped = df.groupby(product_col).agg(
        revenue=("revenue", "sum"),
        units_sold=("quantity", "sum"),
    ).reset_index().sort_values("revenue", ascending=False)

    top = grouped.head(n).to_dict(orient="records")
    worst = grouped.tail(n).to_dict(orient="records")
    return top, worst


def inventory_health(business_id: str) -> dict:
    rows = fetch_rows("inventory", business_id)
    df = pd.DataFrame(rows)
    if df.empty:
        return {"low_stock": [], "expiring_soon": []}

    low_stock = df[df["stock_qty"] < df["reorder_level"]].to_dict(orient="records")

    expiring = []
    if "expiry_date" in df.columns:
        df["expiry_date"] = pd.to_datetime(df["expiry_date"], errors="coerce")
        soon = df[df["expiry_date"] <= (pd.Timestamp.now() + pd.Timedelta(days=5))]
        expiring = soon.to_dict(orient="records")

    return {"low_stock": low_stock, "expiring_soon": expiring}

def compute_hourly_kpis(business_id: str) -> pd.DataFrame:
    df = _sales_df(business_id)

    if df.empty:
        return pd.DataFrame()

    today = df["date"].dt.date.max()
    df = df[df["date"].dt.date == today]

    hourly = df.groupby(df["date"].dt.hour).agg(
        revenue=("revenue", "sum"),
        profit=("profit", "sum"),
        orders=("quantity", "count"),
    ).reset_index()

    hourly.rename(columns={"date": "hour"}, inplace=True)

    return hourly

def compute_weekly_kpis(business_id: str) -> pd.DataFrame:
    df = _sales_df(business_id)

    if df.empty:
        return pd.DataFrame()

    df["week"] = df["date"].dt.to_period("W").astype(str)

    weekly = df.groupby("week").agg(
        revenue=("revenue", "sum"),
        profit=("profit", "sum"),
        orders=("quantity", "count"),
    ).reset_index()

    return weekly

def compute_monthly_kpis(business_id: str) -> pd.DataFrame:
    df = _sales_df(business_id)

    if df.empty:
        return pd.DataFrame()

    df["month"] = df["date"].dt.to_period("M").astype(str)

    monthly = df.groupby("month").agg(
        revenue=("revenue", "sum"),
        profit=("profit", "sum"),
        orders=("quantity", "count"),
    ).reset_index()

    return monthly

