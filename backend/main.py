import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml.predict import load_pipeline, predict_single_patient

app = FastAPI(title="UyirNadi - Heart Disease Risk Intelligence API")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    # Add your Vercel deployment URL here:
    # "https://your-uyirnadi-project.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    age: float
    sex: int
    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalach: float
    exang: int
    oldpeak: float
    slope: int
    ca: float
    thal: float

base_dir = os.path.dirname(os.path.abspath(__file__))
import sys
sys.path.append(os.path.join(base_dir, 'ml'))

def get_data():
    pipeline, feature_importance_data, metrics_data, eda_data = None, None, None, None
    try:
        pipeline = load_pipeline()
        with open(os.path.join(base_dir, 'models', 'feature_importance.json'), 'r') as f:
            feature_importance_data = json.load(f)
        with open(os.path.join(base_dir, 'models', 'model_metrics.json'), 'r') as f:
            metrics_data = json.load(f, parse_constant=lambda x: None if x in ('Infinity', '-Infinity', 'NaN') else x)
        with open(os.path.join(base_dir, 'reports', 'eda_summary.json'), 'r') as f:
            eda_data = json.load(f)
        with open(os.path.join(base_dir, 'models', 'feature_metadata.json'), 'r') as f:
            feature_metadata = json.load(f)
    except Exception as e:
        print(f"Startup error: {e}")
    return pipeline, feature_importance_data, metrics_data, eda_data, feature_metadata

pipeline, feature_importance_data, metrics_data, eda_data, feature_metadata = get_data()

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "model_loaded": pipeline is not None}

@app.get("/api/model-info")
def model_info():
    if not pipeline:
        raise HTTPException(status_code=500, detail="Model not loaded")
    return {
        "architecture": "SVM (SVC)",
        "kernel": "RBF",
        "preprocessing": "StandardScaler + categorical encoding + feature engineering",
        "training_split": "80% Training, 20% Testing",
        "features": len(feature_importance_data) if feature_importance_data else 0
    }

@app.get("/api/metrics")
def get_metrics():
    if not metrics_data:
        raise HTTPException(status_code=500, detail="Metrics not loaded")
    return metrics_data

@app.get("/api/feature-importance")
def get_feature_importance():
    if not feature_importance_data:
        raise HTTPException(status_code=500, detail="Feature importance not loaded")
    return feature_importance_data

@app.get("/api/eda-summary")
def get_eda_summary():
    if not eda_data:
        raise HTTPException(status_code=500, detail="EDA data not loaded")
    return eda_data

@app.get("/api/feature-metadata")
def get_feature_metadata_api():
    if not feature_metadata:
        raise HTTPException(status_code=500, detail="Feature metadata not loaded")
    return feature_metadata

@app.post("/api/predict")
def predict(patient: PatientData):
    if not pipeline:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    patient_dict = patient.dict()
    pred_class, probs = predict_single_patient(pipeline, patient_dict)
    
    top_factors = []
    
    # Dynamically generate explanation using global importance and dataset correlation
    if feature_importance_data and eda_data and 'correlation' in eda_data:
        sorted_features = sorted(feature_importance_data, key=lambda x: x['importance_mean'], reverse=True)
        top_5 = sorted_features[:5]
        
        target_corr = eda_data['correlation'].get('heart_disease', {})
        
        for feat in top_5:
            # feature names in importance might have prefixes from pipeline (e.g., 'num__age')
            raw_feat = feat['feature'].split('__')[-1]
            if raw_feat in patient_dict and raw_feat in feature_metadata:
                val = patient_dict[raw_feat]
                mean_val = feature_metadata[raw_feat]['mean']
                corr = target_corr.get(raw_feat, 0)
                
                # Determine direction of contribution based on correlation
                if (val > mean_val and corr > 0) or (val < mean_val and corr < 0):
                    direction = "Higher contribution toward predicted class" if pred_class == 1 else "Lower contribution toward predicted class"
                else:
                    direction = "Lower contribution toward predicted class" if pred_class == 1 else "Higher contribution toward predicted class"
                
                influence_pct = (feat['importance_mean'] / sorted_features[0]['importance_mean']) * 100 if sorted_features[0]['importance_mean'] > 0 else 0
                
                top_factors.append({
                    "name": raw_feat,
                    "value": val,
                    "relative_influence": f"{influence_pct:.1f}%",
                    "direction": direction
                })

    if not top_factors:
        top_factors = [{"name": "Combined clinical profile factors", "value": "N/A", "relative_influence": "100%", "direction": "Model baseline"}]
        
    prob_disease = probs[1]
    prob_no_disease = probs[0]
    
    confidence = "High" if max(prob_disease, prob_no_disease) > 0.7 else "Moderate"

    if pred_class == 1:
        prediction_text = "Heart Disease Present"
        recommendation = "Model indicates elevated heart-disease risk based on the provided measurements. Consider discussing these findings with a qualified healthcare professional."
    else:
        prediction_text = "No Heart Disease Detected"
        recommendation = "Model did not identify elevated heart-disease risk from the provided measurements. This result does not rule out disease or replace professional medical evaluation."

    return {
        "prediction": prediction_text,
        "predicted_class": pred_class,
        "probability_no_disease": prob_no_disease,
        "probability_disease": prob_disease,
        "model_confidence": confidence,
        "top_factors": top_factors,
        "recommendation": recommendation,
        "disclaimer": "This system is a machine-learning decision-support prototype and is not a substitute for professional medical diagnosis."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
