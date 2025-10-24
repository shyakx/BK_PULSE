"""
Tests for churn prediction model.
"""

import pytest
import pandas as pd
import numpy as np
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.data.data_loader import DataLoader
from src.data.preprocessor import DataPreprocessor
from src.models.churn_model import ChurnPredictor


class TestChurnPredictor:
    """Test ChurnPredictor class."""
    
    @pytest.fixture
    def config(self):
        """Create test configuration."""
        return {
            'model': {
                'algorithm': 'logistic_regression',
                'random_state': 42,
                'test_size': 0.2,
                'handle_imbalance': False
            },
            'training': {
                'cross_validation_folds': 3,
                'scoring_metric': 'roc_auc',
                'optimize_threshold': True
            },
            'preprocessing': {
                'handle_missing': 'median',
                'encoding': 'label',
                'scaling': 'standard',
                'outlier_detection': False
            }
        }
    
    @pytest.fixture
    def prepared_data(self, config):
        """Prepare data for testing."""
        loader = DataLoader('dummy.csv')
        df = loader.generate_sample_data(n_samples=200)
        
        preprocessor = DataPreprocessor(config)
        df_processed = preprocessor.preprocess(df, fit=True)
        
        X_train, X_test, y_train, y_test = preprocessor.split_data(
            df_processed, test_size=0.2, random_state=42
        )
        
        return X_train, X_test, y_train, y_test
    
    def test_model_creation(self, config):
        """Test model creation."""
        predictor = ChurnPredictor(config)
        predictor._create_model()
        
        assert predictor.model is not None
    
    def test_training(self, config, prepared_data):
        """Test model training."""
        X_train, X_test, y_train, y_test = prepared_data
        
        predictor = ChurnPredictor(config)
        metrics = predictor.train(X_train, y_train)
        
        assert 'cv_mean_score' in metrics
        assert 'cv_std_score' in metrics
        assert 0 <= metrics['cv_mean_score'] <= 1
    
    def test_prediction(self, config, prepared_data):
        """Test prediction."""
        X_train, X_test, y_train, y_test = prepared_data
        
        predictor = ChurnPredictor(config)
        predictor.train(X_train, y_train)
        
        predictions = predictor.predict(X_test)
        
        assert len(predictions) == len(X_test)
        assert all(pred in [0, 1] for pred in predictions)
    
    def test_predict_proba(self, config, prepared_data):
        """Test probability prediction."""
        X_train, X_test, y_train, y_test = prepared_data
        
        predictor = ChurnPredictor(config)
        predictor.train(X_train, y_train)
        
        probabilities = predictor.predict_proba(X_test)
        
        assert len(probabilities) == len(X_test)
        assert all(0 <= prob <= 1 for prob in probabilities)
    
    def test_evaluation(self, config, prepared_data):
        """Test model evaluation."""
        X_train, X_test, y_train, y_test = prepared_data
        
        predictor = ChurnPredictor(config)
        predictor.train(X_train, y_train)
        
        metrics = predictor.evaluate(X_test, y_test)
        
        assert 'accuracy' in metrics
        assert 'precision' in metrics
        assert 'recall' in metrics
        assert 'f1_score' in metrics
        assert 'roc_auc' in metrics
        assert 0 <= metrics['accuracy'] <= 1
    
    def test_optimize_threshold(self, config, prepared_data):
        """Test threshold optimization."""
        X_train, X_test, y_train, y_test = prepared_data
        
        predictor = ChurnPredictor(config)
        predictor.train(X_train, y_train)
        
        threshold = predictor.optimize_threshold(X_test, y_test)
        
        assert 0 < threshold < 1
        assert predictor.best_threshold == threshold
