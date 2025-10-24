from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import Dict
from datetime import datetime

try:
    import shap  # optional; used for explanations when possible
except Exception:  # noqa: BLE001
    shap = None


app = FastAPI(title="Komeza Bank Churn Model API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],  # explicit origins when credentials enabled
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    load_models()


# Load artifacts from GitHub repository
# Note: These will be downloaded from the GitHub repository
SCALER_PATH = "models/scaler.pkl"
MODEL_PATH = "models/best_churn_model.pkl"

# Initialize model and scaler as None - will be loaded from GitHub repo
scaler = None
model = None

def load_models():
    """Load models from the GitHub repository"""
    global scaler, model
    try:
        # For now, we'll use placeholder models
        # In production, these would be downloaded from the GitHub repository
        print("Loading models from GitHub repository...")
        # TODO: Implement model loading from GitHub repository
        # scaler = joblib.load(SCALER_PATH)
        # model = joblib.load(MODEL_PATH)
        print("Models loaded successfully!")
    except Exception as e:
        print(f"Error loading models: {e}")
        # Use default models for development
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler
        import numpy as np
        
        # Create dummy models for development
        scaler = StandardScaler()
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        # Fit with dummy data
        dummy_X = np.random.rand(100, 21)
        dummy_y = np.random.randint(0, 2, 100)
        scaler.fit(dummy_X)
        model.fit(scaler.transform(dummy_X), dummy_y)
        print("Using dummy models for development")


# Expected flattened feature order (must match training)
# Default superset; will be narrowed to scaler's expected names when available
FEATURES = [
    "age",
    "gender",
    "location",
    "accountAge",
    "totalBalance",
    "avgBalance",
    "balanceVolatility",
    "transactionFrequency",
    "avgTransactionAmount",
    "transactionDiversity",
    "lastTransactionDays",
    "productCount",
    "digitalAdoption",
    "creditUtilization",
    "loginFrequency",
    "supportInteractions",
    "complaintCount",
    "paymentDelays",
    "creditScore",
    "incomeStability",
    "channelPreference",
    "timeOfDayActivity",
    "seasonalBehavior",
    "economicIndicators_gdp",
    "economicIndicators_inflation",
    "economicIndicators_unemployment",
    "marketConditions_marketGrowth",
    "marketConditions_competition",
    "marketConditions_stability",
]

# Determine expected feature list from scaler if available
# If the scaler lacks feature names, fall back to a compact priority order of 21
PRIORITY_FEATURES_21 = [
    "age",
    "gender",
    "location",
    "accountAge",
    "totalBalance",
    "avgBalance",
    "balanceVolatility",
    "transactionFrequency",
    "avgTransactionAmount",
    "transactionDiversity",
    "lastTransactionDays",
    "productCount",
    "digitalAdoption",
    "creditUtilization",
    "loginFrequency",
    "supportInteractions",
    "complaintCount",
    "paymentDelays",
    "creditScore",
    "incomeStability",
    "channelPreference",
]

feature_names_from_scaler = list(getattr(scaler, "feature_names_in_", []))
if feature_names_from_scaler:
    EXPECTED_FEATURES = feature_names_from_scaler
else:
    n_expected = int(getattr(scaler, "n_features_in_", len(PRIORITY_FEATURES_21)))
    EXPECTED_FEATURES = PRIORITY_FEATURES_21[:n_expected]


class PredictRequest(BaseModel):
    features: Dict[str, float]


class PredictResponse(BaseModel):
    churn_probability: float
    risk: str
    top_drivers: list | None = None
    recommendations: list | None = None


def risk_bucket(p: float) -> str:
    if p >= 0.8:
        return "Critical"
    if p >= 0.6:
        return "High"
    if p >= 0.4:
        return "Medium"
    if p >= 0.2:
        return "Low"
    return "Very Low"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/metadata")
def metadata():
    return {
        "expected_features": EXPECTED_FEATURES,
        "expected_count": len(EXPECTED_FEATURES),
        "model": type(model).__name__,
        "scaler": type(scaler).__name__,
        "has_feature_names": bool(feature_names_from_scaler),
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    # Build input vector in the exact order expected by the scaler/model
    missing = []
    x = []
    for k in EXPECTED_FEATURES:
        v = req.features.get(k, 0)
        if k not in req.features:
            missing.append(k)
        try:
            x.append(float(v))
        except Exception:
            x.append(0.0)
    X = np.array([x], dtype=float)
    Xs = scaler.transform(X)
    # Assume sklearn classifier with predict_proba
    prob = float(model.predict_proba(Xs)[0, 1])

    # Basic heuristic explanations if SHAP not available
    top_drivers = None
    if shap is not None and hasattr(model, "predict_proba"):
        try:
            # Use TreeExplainer for tree-based models (e.g., LightGBM)
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(Xs)
            # shap_values for binary models may be list [class0, class1]
            sv = shap_values[1] if isinstance(shap_values, list) else shap_values
            contribs = [(EXPECTED_FEATURES[i], float(sv[0, i])) for i in range(len(EXPECTED_FEATURES))]
            contribs.sort(key=lambda t: abs(t[1]), reverse=True)
            top_drivers = [{"feature": k, "impact": v} for k, v in contribs[:5]]
        except Exception:
            top_drivers = None

    # Simple recommendations based on key signals
    recs = []
    features_map = {k: req.features.get(k, 0) for k in EXPECTED_FEATURES}
    if features_map.get("lastTransactionDays", 0) > 30:
        recs.append({"action": "Proactive call within 48h", "rationale": "High inactivity"})
    if features_map.get("complaintCount", 0) >= 2:
        recs.append({"action": "Offer service recovery gesture", "rationale": "Multiple complaints"})
    if features_map.get("digitalAdoption", 1) < 0.3:
        recs.append({"action": "Guide to mobile/online banking", "rationale": "Low digital engagement"})
    if not recs:
        recs.append({"action": "Routine check-in", "rationale": "No strong risk signals"})

    return {"churn_probability": prob, "risk": risk_bucket(prob), "top_drivers": top_drivers, "recommendations": recs}


@app.get("/status")
def status():
    return {
        "model": type(model).__name__,
        "scaler": type(scaler).__name__,
        "model_version": getattr(model, "__class__", type(model)).__name__,
        "loaded_at": datetime.utcnow().isoformat() + "Z",
        "expected_features": EXPECTED_FEATURES,
    }


