import json
import joblib
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score, roc_curve

def evaluate_and_save_metrics(model, X_test, y_test, filepath='../models/model_metrics.json'):
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None
    
    metrics = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'precision': float(precision_score(y_test, y_pred, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred, zero_division=0)),
        'f1_score': float(f1_score(y_test, y_pred, zero_division=0))
    }
    
    cm = confusion_matrix(y_test, y_pred)
    metrics['confusion_matrix'] = {
        'tn': int(cm[0, 0]),
        'fp': int(cm[0, 1]),
        'fn': int(cm[1, 0]),
        'tp': int(cm[1, 1])
    }
    
    if y_prob is not None:
        metrics['roc_auc'] = float(roc_auc_score(y_test, y_prob))
        fpr, tpr, thresholds = roc_curve(y_test, y_prob)
        metrics['roc_curve'] = {
            'fpr': fpr.tolist(),
            'tpr': tpr.tolist(),
            'thresholds': thresholds.tolist()
        }
        
    with open(filepath, 'w') as f:
        json.dump(metrics, f, indent=4)
        
    return metrics
