import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from feature_engineering import FeatureEngineer

def create_preprocessor():
    numeric_features = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak', 'heart_rate_ratio', 'bp_chol_ratio']
    categorical_features = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'ca', 'thal', 'age_group']
    binary_features = ['st_depression_flag']

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        # we can drop 'first' if we wanted but keep all for explainability if preferred,
        # handle_unknown='ignore' requires drop=None
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    binary_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent'))
    ])

    column_transformer = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features),
            ('bin', binary_transformer, binary_features)
        ],
        remainder='drop'
    )
    
    # The full preprocessing pipeline starts with Feature Engineering, then ColumnTransformer
    preprocessor = Pipeline(steps=[
        ('feature_engineering', FeatureEngineer()),
        ('column_transformer', column_transformer)
    ])

    return preprocessor
