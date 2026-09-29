import os
import json
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline

from data_loader import load_data, clean_data
from preprocessing import create_preprocessor
from evaluate import evaluate_and_save_metrics
from explain import compute_and_save_feature_importance

def generate_feature_metadata(X_train, filepath):
    metadata = {}
    for col in X_train.columns:
        metadata[col] = {
            'min': float(X_train[col].min()),
            'max': float(X_train[col].max()),
            'mean': float(X_train[col].mean()),
            'median': float(X_train[col].median()),
            'unique_values': [float(x) for x in X_train[col].dropna().unique()] if X_train[col].nunique() < 10 else None
        }
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(metadata, f, indent=4)

def generate_eda_summary(df, filepath):
    import numpy as np
    
    missing = df.isnull().sum().to_dict()
    target_dist = df['heart_disease'].value_counts().to_dict()
    
    # Helper for histograms
    def get_hist(col, bins=10):
        counts, edges = np.histogram(df[col].dropna(), bins=bins)
        return {f"{edges[i]:.1f}-{edges[i+1]:.1f}": int(counts[i]) for i in range(len(counts))}
        
    def get_hist_by_target(col, bins=10):
        counts_all, edges = np.histogram(df[col].dropna(), bins=bins)
        hist = []
        for i in range(len(counts_all)):
            range_str = f"{edges[i]:.1f}-{edges[i+1]:.1f}"
            mask = (df[col] >= edges[i]) & (df[col] <= edges[i+1])
            counts_0 = int(mask[df['heart_disease'] == 0].sum())
            counts_1 = int(mask[df['heart_disease'] == 1].sum())
            hist.append({'range': range_str, '0': counts_0, '1': counts_1})
        return hist
        
    def get_val_counts(col):
        return {str(k): int(v) for k, v in df[col].value_counts().to_dict().items()}
        
    def get_val_counts_by_target(col):
        res = []
        for val in sorted(df[col].dropna().unique()):
            counts_0 = int((df[df['heart_disease'] == 0][col] == val).sum())
            counts_1 = int((df[df['heart_disease'] == 1][col] == val).sum())
            res.append({'value': str(val), '0': counts_0, '1': counts_1})
        return res

    # Compute correlation
    corr = df.corr()
    corr_dict = {col: corr[col].to_dict() for col in corr.columns}
    
    # Outlier Analysis using IQR
    outliers = {}
    continuous = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
    for col in continuous:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        outlier_count = int(((df[col] < lower_bound) | (df[col] > upper_bound)).sum())
        outliers[col] = {
            'lower_bound': float(lower_bound),
            'upper_bound': float(upper_bound),
            'count': outlier_count
        }
    
    summary = {
        'num_rows': int(len(df)),
        'num_cols': int(len(df.columns)),
        'missing_values': {str(k): int(v) for k, v in missing.items()},
        'target_distribution': {str(k): int(v) for k, v in target_dist.items()},
        'correlation': corr_dict,
        
        # Distributions
        'age_distribution': get_hist('age', 8),
        'sex_distribution': get_val_counts('sex'),
        'cp_distribution': get_val_counts('cp'),
        'chol_distribution': get_hist('chol', 10),
        'trestbps_distribution': get_hist('trestbps', 10),
        'thalach_distribution': get_hist('thalach', 10),
        'exang_distribution': get_val_counts('exang'),
        'oldpeak_distribution': get_hist('oldpeak', 10),
        'restecg_distribution': get_val_counts('restecg'),
        
        # Vs Heart Disease
        'age_vs_target': get_hist_by_target('age', 8),
        'cp_vs_target': get_val_counts_by_target('cp'),
        'chol_vs_target': get_hist_by_target('chol', 10),
        'trestbps_vs_target': get_hist_by_target('trestbps', 10),
        'thalach_vs_target': get_hist_by_target('thalach', 10),
        'oldpeak_vs_target': get_hist_by_target('oldpeak', 10),
        'exang_vs_target': get_val_counts_by_target('exang'),
        
        # Outliers
        'outliers': outliers
    }
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(summary, f, indent=4)
        
def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'processed.cleveland.data')
    
    df = load_data(data_path)
    df = clean_data(df)
    
    generate_eda_summary(df, os.path.join(base_dir, 'reports', 'eda_summary.json'))
    
    X = df.drop(columns=['heart_disease'])
    y = df['heart_disease']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    metadata_path = os.path.join(base_dir, 'models', 'feature_metadata.json')
    generate_feature_metadata(X_train, metadata_path)
    
    preprocessor = create_preprocessor()
    
    svm_model = SVC(
        kernel="rbf",
        probability=True,
        class_weight="balanced",
        random_state=42
    )
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', svm_model)
    ])
    
    print("Training SVM model...")
    pipeline.fit(X_train, y_train)
    
    metrics_path = os.path.join(base_dir, 'models', 'model_metrics.json')
    metrics = evaluate_and_save_metrics(pipeline, X_test, y_test, metrics_path)
    print(f"Accuracy: {metrics['accuracy']:.4f}, F1: {metrics['f1_score']:.4f}")
    
    importance_path = os.path.join(base_dir, 'models', 'feature_importance.json')
    compute_and_save_feature_importance(pipeline, X_test, y_test, importance_path)
    print("Feature importance saved.")
    
    model_path = os.path.join(base_dir, 'models', 'heart_disease_svm_pipeline.joblib')
    joblib.dump(pipeline, model_path)
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    main()
