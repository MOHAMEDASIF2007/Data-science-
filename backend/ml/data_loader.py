import pandas as pd
import numpy as np

def load_data(filepath: str) -> pd.DataFrame:
    column_names = [
        "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", 
        "thalach", "exang", "oldpeak", "slope", "ca", "thal", "num"
    ]
    df = pd.read_csv(filepath, names=column_names, na_values="?")
    return df

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    # 1. Target Binarization
    # num = 0 -> No Heart Disease (0)
    # num = 1,2,3,4 -> Heart Disease Present (1)
    if 'num' in df.columns:
        df['heart_disease'] = df['num'].apply(lambda x: 1 if x > 0 else 0)
        df = df.drop(columns=['num'])
        
    # 2. Duplicate Removal
    df = df.drop_duplicates()
    
    # 3. Missing values and outliers will be handled via the pipeline/transformers 
    # to avoid data leakage.
    return df
