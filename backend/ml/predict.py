import joblib
import pandas as pd
import os

def load_pipeline():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, 'models', 'heart_disease_svm_pipeline.joblib')
    return joblib.load(model_path)

def predict_single_patient(pipeline, patient_dict):
    df = pd.DataFrame([patient_dict])
    pred = pipeline.predict(df)[0]
    prob = pipeline.predict_proba(df)[0]
    return int(pred), prob.tolist()
