"""
Tests for preprocessor module.
"""

import pytest
import pandas as pd
import numpy as np
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.data.data_loader import DataLoader
from src.data.preprocessor import DataPreprocessor


class TestDataPreprocessor:
    """Test DataPreprocessor class."""
    
    @pytest.fixture
    def sample_data(self):
        """Create sample data for testing."""
        loader = DataLoader('dummy.csv')
        return loader.generate_sample_data(n_samples=100)
    
    @pytest.fixture
    def config(self):
        """Create test configuration."""
        return {
            'preprocessing': {
                'handle_missing': 'median',
                'encoding': 'label',
                'scaling': 'standard',
                'outlier_detection': True,
                'outlier_threshold': 3
            }
        }
    
    def test_handle_missing_values(self, sample_data, config):
        """Test missing value handling."""
        preprocessor = DataPreprocessor(config)
        
        # Introduce missing values
        df = sample_data.copy()
        df.loc[0:5, 'age'] = np.nan
        
        df_clean = preprocessor.handle_missing_values(df, strategy='median')
        
        assert df_clean['age'].isnull().sum() == 0
    
    def test_encode_categorical(self, sample_data, config):
        """Test categorical encoding."""
        preprocessor = DataPreprocessor(config)
        df_encoded = preprocessor.encode_categorical_features(sample_data)
        
        # Check that categorical columns are now numeric
        assert df_encoded['gender'].dtype in [np.int32, np.int64]
        assert df_encoded['location'].dtype in [np.int32, np.int64]
    
    def test_engineer_features(self, sample_data, config):
        """Test feature engineering."""
        preprocessor = DataPreprocessor(config)
        df_engineered = preprocessor.engineer_features(sample_data)
        
        # Check new features exist
        assert 'balance_per_product' in df_engineered.columns
        assert 'engagement_score' in df_engineered.columns
        assert 'digital_products' in df_engineered.columns
    
    def test_scale_features(self, sample_data, config):
        """Test feature scaling."""
        preprocessor = DataPreprocessor(config)
        
        # Encode first
        df_encoded = preprocessor.encode_categorical_features(sample_data)
        
        # Scale
        df_scaled = preprocessor.scale_features(df_encoded, scaling='standard', fit=True)
        
        # Check that scaler was fitted
        assert preprocessor.scaler is not None
        
        # Check that numeric columns are scaled (mean ~0, std ~1)
        numeric_cols = df_scaled.select_dtypes(include=[np.number]).columns
        numeric_cols = [col for col in numeric_cols if col not in ['churn', 'customer_id']]
        
        if len(numeric_cols) > 0:
            assert abs(df_scaled[numeric_cols].mean().mean()) < 1  # Mean close to 0
    
    def test_split_data(self, sample_data, config):
        """Test data splitting."""
        preprocessor = DataPreprocessor(config)
        df_processed = preprocessor.preprocess(sample_data, fit=True)
        
        X_train, X_test, y_train, y_test = preprocessor.split_data(df_processed, test_size=0.2)
        
        assert len(X_train) == 80
        assert len(X_test) == 20
        assert len(y_train) == 80
        assert len(y_test) == 20
        assert 'churn' not in X_train.columns
        assert 'churn' not in X_test.columns
