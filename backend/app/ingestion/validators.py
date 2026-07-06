"""
Validates an uploaded CSV against the active industry's required columns,
before anything touches the database. Returns cleaned rows + a list of
human-readable issues so the upload response can explain rejections.
"""
import pandas as pd
from app.config.loader import IndustryConfig


def validate_and_clean(df: pd.DataFrame, dataset: str, config: IndustryConfig) -> tuple[pd.DataFrame, list[str]]:
    issues: list[str] = []
    required = config.required_columns.get(dataset, [])

    missing = [c for c in required if c not in df.columns]
    if missing:
        issues.append(f"Missing required columns for '{dataset}': {missing}")
        return pd.DataFrame(), issues

    before = len(df)
    df = df.dropna(subset=required)
    dropped_na = before - len(df)
    if dropped_na:
        issues.append(f"Dropped {dropped_na} rows with missing values in required fields")

    before = len(df)
    df = df.drop_duplicates()
    dropped_dupes = before - len(df)
    if dropped_dupes:
        issues.append(f"Removed {dropped_dupes} duplicate rows")

    for col in ("date", "expiry_date"):
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")
            invalid = df[col].isna().sum()
            if invalid:
                issues.append(f"{invalid} rows had unparseable '{col}' values and were dropped")
                df = df.dropna(subset=[col])

    for col in ("quantity", "unit_price", "cost_price", "stock_qty", "reorder_level"):
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    if any(c in df.columns for c in ("product", "dish", "branch", "category")):
        for c in ("product", "dish", "branch", "category"):
            if c in df.columns:
                df[c] = df[c].astype(str).str.strip().str.title()

    return df, issues
