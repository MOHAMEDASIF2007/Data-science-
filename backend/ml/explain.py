import json
from sklearn.inspection import permutation_importance

def compute_and_save_feature_importance(model, X_test, y_test, filepath='../models/feature_importance.json'):
    result = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=42, n_jobs=-1)
    
    importances = []
    for i in result.importances_mean.argsort()[::-1]:
        importances.append({
            'feature': X_test.columns[i],
            'importance_mean': float(result.importances_mean[i]),
            'importance_std': float(result.importances_std[i])
        })
        
    with open(filepath, 'w') as f:
        json.dump(importances, f, indent=4)
        
    return importances
