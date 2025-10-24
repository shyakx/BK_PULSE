"""
Machine learning models for customer churn prediction.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)
from sklearn.model_selection import cross_val_score
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import lightgbm as lgb
import joblib
import logging
from typing import Dict, Tuple, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ChurnPredictor:
    """Customer churn prediction model."""
    
    def __init__(self, config: dict):
        """
        Initialize ChurnPredictor.
        
        Args:
            config: Configuration dictionary containing model parameters
        """
        self.config = config
        self.model = None
        self.algorithm = config.get('model', {}).get('algorithm', 'xgboost')
        self.best_threshold = 0.5
    
    def _create_model(self):
        """Create model based on specified algorithm."""
        model_config = self.config.get('model', {})
        
        if self.algorithm == 'xgboost':
            params = model_config.get('xgboost', {})
            self.model = xgb.XGBClassifier(
                n_estimators=params.get('n_estimators', 100),
                max_depth=params.get('max_depth', 6),
                learning_rate=params.get('learning_rate', 0.1),
                subsample=params.get('subsample', 0.8),
                colsample_bytree=params.get('colsample_bytree', 0.8),
                min_child_weight=params.get('min_child_weight', 1),
                scale_pos_weight=params.get('scale_pos_weight', 1),
                random_state=model_config.get('random_state', 42),
                use_label_encoder=False,
                eval_metric='logloss'
            )
        
        elif self.algorithm == 'lightgbm':
            params = model_config.get('lightgbm', {})
            self.model = lgb.LGBMClassifier(
                n_estimators=params.get('n_estimators', 100),
                max_depth=params.get('max_depth', 6),
                learning_rate=params.get('learning_rate', 0.1),
                num_leaves=params.get('num_leaves', 31),
                min_child_samples=params.get('min_child_samples', 20),
                random_state=model_config.get('random_state', 42)
            )
        
        elif self.algorithm == 'random_forest':
            params = model_config.get('random_forest', {})
            self.model = RandomForestClassifier(
                n_estimators=params.get('n_estimators', 100),
                max_depth=params.get('max_depth', 10),
                min_samples_split=params.get('min_samples_split', 5),
                min_samples_leaf=params.get('min_samples_leaf', 2),
                random_state=model_config.get('random_state', 42)
            )
        
        elif self.algorithm == 'logistic_regression':
            self.model = LogisticRegression(
                random_state=model_config.get('random_state', 42),
                max_iter=1000
            )
        
        else:
            raise ValueError(f"Unsupported algorithm: {self.algorithm}")
        
        logger.info(f"Model created: {self.algorithm}")
    
    def handle_imbalance(self, X: pd.DataFrame, y: pd.Series) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Handle class imbalance using SMOTE.
        
        Args:
            X: Feature matrix
            y: Target vector
        
        Returns:
            Resampled X and y
        """
        original_ratio = y.mean()
        smote = SMOTE(random_state=self.config.get('model', {}).get('random_state', 42))
        X_resampled, y_resampled = smote.fit_resample(X, y)
        
        logger.info(f"Original churn rate: {original_ratio:.2%}")
        logger.info(f"After SMOTE: {y_resampled.mean():.2%}")
        logger.info(f"Original size: {len(y)}, After SMOTE: {len(y_resampled)}")
        
        return X_resampled, y_resampled
    
    def train(self, X_train: pd.DataFrame, y_train: pd.Series,
              X_val: Optional[pd.DataFrame] = None, 
              y_val: Optional[pd.Series] = None) -> Dict:
        """
        Train the churn prediction model.
        
        Args:
            X_train: Training features
            y_train: Training target
            X_val: Validation features (optional)
            y_val: Validation target (optional)
        
        Returns:
            Dictionary with training metrics
        """
        logger.info("Starting model training...")
        
        # Create model
        self._create_model()
        
        # Handle class imbalance if configured
        if self.config.get('model', {}).get('handle_imbalance', True):
            X_train_balanced, y_train_balanced = self.handle_imbalance(X_train, y_train)
        else:
            X_train_balanced, y_train_balanced = X_train, y_train
        
        # Train model
        if self.algorithm in ['xgboost', 'lightgbm'] and X_val is not None:
            self.model.fit(
                X_train_balanced, y_train_balanced,
                eval_set=[(X_val, y_val)],
                verbose=False
            )
        else:
            self.model.fit(X_train_balanced, y_train_balanced)
        
        # Cross-validation score
        cv_folds = self.config.get('training', {}).get('cross_validation_folds', 5)
        cv_scores = cross_val_score(
            self.model, X_train_balanced, y_train_balanced,
            cv=cv_folds,
            scoring=self.config.get('training', {}).get('scoring_metric', 'roc_auc')
        )
        
        metrics = {
            'cv_mean_score': cv_scores.mean(),
            'cv_std_score': cv_scores.std()
        }
        
        logger.info(f"Training completed. CV Score: {metrics['cv_mean_score']:.4f} (+/- {metrics['cv_std_score']:.4f})")
        
        return metrics
    
    def optimize_threshold(self, X_val: pd.DataFrame, y_val: pd.Series) -> float:
        """
        Optimize classification threshold for best F1 score.
        
        Args:
            X_val: Validation features
            y_val: Validation target
        
        Returns:
            Optimal threshold
        """
        y_proba = self.model.predict_proba(X_val)[:, 1]
        
        best_f1 = 0
        best_threshold = 0.5
        
        for threshold in np.arange(0.3, 0.7, 0.05):
            y_pred = (y_proba >= threshold).astype(int)
            f1 = f1_score(y_val, y_pred)
            
            if f1 > best_f1:
                best_f1 = f1
                best_threshold = threshold
        
        self.best_threshold = best_threshold
        logger.info(f"Optimal threshold: {self.best_threshold:.2f} (F1: {best_f1:.4f})")
        
        return self.best_threshold
    
    def evaluate(self, X_test: pd.DataFrame, y_test: pd.Series) -> Dict:
        """
        Evaluate model performance.
        
        Args:
            X_test: Test features
            y_test: Test target
        
        Returns:
            Dictionary with evaluation metrics
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Predictions
        y_proba = self.model.predict_proba(X_test)[:, 1]
        y_pred = (y_proba >= self.best_threshold).astype(int)
        
        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1_score': f1_score(y_test, y_pred),
            'roc_auc': roc_auc_score(y_test, y_proba),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'classification_report': classification_report(y_test, y_pred)
        }
        
        logger.info("Model Evaluation Results:")
        logger.info(f"  Accuracy:  {metrics['accuracy']:.4f}")
        logger.info(f"  Precision: {metrics['precision']:.4f}")
        logger.info(f"  Recall:    {metrics['recall']:.4f}")
        logger.info(f"  F1 Score:  {metrics['f1_score']:.4f}")
        logger.info(f"  ROC AUC:   {metrics['roc_auc']:.4f}")
        
        return metrics
    
    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """
        Predict churn for new customers.
        
        Args:
            X: Feature matrix
        
        Returns:
            Array of predictions (0 or 1)
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        y_proba = self.model.predict_proba(X)[:, 1]
        y_pred = (y_proba >= self.best_threshold).astype(int)
        
        return y_pred
    
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """
        Predict churn probability for new customers.
        
        Args:
            X: Feature matrix
        
        Returns:
            Array of churn probabilities
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        return self.model.predict_proba(X)[:, 1]
    
    def get_feature_importance(self) -> pd.DataFrame:
        """
        Get feature importance scores.
        
        Returns:
            DataFrame with feature names and importance scores
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        if hasattr(self.model, 'feature_importances_'):
            importance_df = pd.DataFrame({
                'feature': self.model.feature_names_in_ if hasattr(self.model, 'feature_names_in_') else range(len(self.model.feature_importances_)),
                'importance': self.model.feature_importances_
            })
            importance_df = importance_df.sort_values('importance', ascending=False)
            return importance_df
        else:
            logger.warning("Model does not support feature importance")
            return pd.DataFrame()
    
    def save_model(self, path: str):
        """Save trained model."""
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        joblib.dump({
            'model': self.model,
            'algorithm': self.algorithm,
            'best_threshold': self.best_threshold,
            'config': self.config
        }, path)
        logger.info(f"Model saved to {path}")
    
    def load_model(self, path: str):
        """Load trained model."""
        artifacts = joblib.load(path)
        self.model = artifacts['model']
        self.algorithm = artifacts['algorithm']
        self.best_threshold = artifacts.get('best_threshold', 0.5)
        self.config = artifacts['config']
        logger.info(f"Model loaded from {path}")
