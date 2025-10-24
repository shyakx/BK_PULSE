"""
Tests for data loader module.
"""

import pytest
import pandas as pd
import numpy as np
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.data.data_loader import DataLoader


class TestDataLoader:
    """Test DataLoader class."""
    
    def test_generate_sample_data(self, tmp_path):
        """Test sample data generation."""
        loader = DataLoader('dummy_path.csv')
        df = loader.generate_sample_data(n_samples=100)
        
        assert len(df) == 100
        assert 'churn' in df.columns
        assert 'customer_id' in df.columns
        assert df['churn'].isin([0, 1]).all()
        
    def test_sample_data_columns(self):
        """Test that sample data has required columns."""
        loader = DataLoader('dummy_path.csv')
        df = loader.generate_sample_data(n_samples=50)
        
        expected_cols = [
            'customer_id', 'age', 'gender', 'location', 'account_balance',
            'account_age_months', 'number_of_products', 'has_credit_card',
            'has_mobile_banking', 'avg_monthly_transactions', 
            'total_transaction_amount', 'transaction_frequency',
            'days_since_last_login', 'customer_service_calls',
            'complaints_filed', 'churn'
        ]
        
        for col in expected_cols:
            assert col in df.columns
    
    def test_data_types(self):
        """Test data types of generated data."""
        loader = DataLoader('dummy_path.csv')
        df = loader.generate_sample_data(n_samples=50)
        
        assert df['age'].dtype in [np.int32, np.int64]
        assert df['churn'].dtype in [np.int32, np.int64]
        assert df['gender'].dtype == object
        assert df['account_balance'].dtype in [np.float32, np.float64]
    
    def test_validate_data(self):
        """Test data validation."""
        loader = DataLoader('dummy_path.csv')
        loader.generate_sample_data(n_samples=50)
        
        validation = loader.validate_data()
        
        assert 'shape' in validation
        assert 'columns' in validation
        assert 'missing_values' in validation
        assert 'duplicates' in validation
        assert validation['shape'][0] == 50
    
    def test_get_data_summary(self):
        """Test data summary statistics."""
        loader = DataLoader('dummy_path.csv')
        loader.generate_sample_data(n_samples=50)
        
        summary = loader.get_data_summary()
        
        assert isinstance(summary, pd.DataFrame)
        assert 'age' in summary.columns
        assert 'mean' in summary.index
