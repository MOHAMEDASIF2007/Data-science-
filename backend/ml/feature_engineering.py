import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin

class FeatureEngineer(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
        
    def fit(self, X, y=None):
        return self
        
    def transform(self, X, y=None):
        # We assume X is a DataFrame
        X_out = X.copy()
        
        # heart_rate_ratio: thalach / age
        X_out['heart_rate_ratio'] = X_out['thalach'] / X_out['age']
        
        # bp_chol_ratio: trestbps / chol
        # Handle 0 cholesterol to avoid division by zero
        X_out['bp_chol_ratio'] = np.where(X_out['chol'] == 0, 0, X_out['trestbps'] / X_out['chol'])
        
        # st_depression_flag: oldpeak > 1
        X_out['st_depression_flag'] = (X_out['oldpeak'] > 1.0).astype(int)
        
        # age_group: young < 40, middle 40-59, senior 60+
        conditions = [
            (X_out['age'] < 40),
            (X_out['age'] >= 40) & (X_out['age'] < 60),
            (X_out['age'] >= 60)
        ]
        choices = ['young', 'middle', 'senior']
        X_out['age_group'] = np.select(conditions, choices, default='middle')
        
        return X_out
