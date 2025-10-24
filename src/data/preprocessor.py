"""
Data preprocessing and feature engineering for churn prediction.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from typing import Tuple, List, Optional
import joblib
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataPreprocessor:
    """Preprocess and engineer features for churn prediction."""
    
    def __init__(self, config: dict):
        """
        Initialize DataPreprocessor.
        
        Args:
            config: Configuration dictionary containing preprocessing parameters
        """
        self.config = config
        self.scaler = None
        self.label_encoders = {}
        self.feature_names = None
    
    def handle_missing_values(self, df: pd.DataFrame, strategy: str = 'median') -> pd.DataFrame:
        """
        Handle missing values in the dataset.
        
        Args:
            df: Input DataFrame
            strategy: Strategy to handle missing values ('median', 'mean', 'drop', 'forward_fill')
        
        Returns:
            DataFrame with missing values handled
        """
        df = df.copy()
        
        if strategy == 'drop':
            df = df.dropna()
        elif strategy == 'median':
            for col in df.select_dtypes(include=[np.number]).columns:
                df[col] = df[col].fillna(df[col].median())
        elif strategy == 'mean':
            for col in df.select_dtypes(include=[np.number]).columns:
                df[col] = df[col].fillna(df[col].mean())
        elif strategy == 'forward_fill':
            df = df.fillna(method='ffill')
        
        # Fill categorical missing values with mode
        for col in df.select_dtypes(include=['object']).columns:
            df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown')
        
        logger.info(f"Missing values handled using strategy: {strategy}")
        return df
    
    def handle_outliers(self, df: pd.DataFrame, threshold: float = 3.0) -> pd.DataFrame:
        """
        Detect and handle outliers using Z-score method.
        
        Args:
            df: Input DataFrame
            threshold: Z-score threshold for outlier detection
        
        Returns:
            DataFrame with outliers handled
        """
        df = df.copy()
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            if col not in ['churn', 'customer_id']:
                z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
                # Cap outliers at threshold
                upper_limit = df[col].mean() + threshold * df[col].std()
                lower_limit = df[col].mean() - threshold * df[col].std()
                df[col] = df[col].clip(lower=lower_limit, upper=upper_limit)
        
        logger.info(f"Outliers handled with threshold: {threshold}")
        return df
    
    def encode_categorical_features(self, df: pd.DataFrame, encoding: str = 'label') -> pd.DataFrame:
        """
        Encode categorical features.
        
        Args:
            df: Input DataFrame
            encoding: Encoding strategy ('label' or 'onehot')
        
        Returns:
            DataFrame with encoded categorical features
        """
        df = df.copy()
        categorical_cols = df.select_dtypes(include=['object']).columns
        categorical_cols = [col for col in categorical_cols if col != 'customer_id']
        
        if encoding == 'label':
            for col in categorical_cols:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    df[col] = self.label_encoders[col].fit_transform(df[col].astype(str))
                else:
                    df[col] = self.label_encoders[col].transform(df[col].astype(str))
        
        elif encoding == 'onehot':
            df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
        
        logger.info(f"Categorical features encoded using: {encoding}")
        return df
    
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create derived features for better prediction.
        
        Args:
            df: Input DataFrame
        
        Returns:
            DataFrame with engineered features
        """
        df = df.copy()
        
        # Balance-based features
        if 'account_balance' in df.columns:
            df['balance_per_product'] = df['account_balance'] / (df['number_of_products'] + 1)
            df['is_high_balance'] = (df['account_balance'] > df['account_balance'].quantile(0.75)).astype(int)
        
        # Activity-based features
        if 'avg_monthly_transactions' in df.columns and 'account_age_months' in df.columns:
            df['transaction_intensity'] = df['avg_monthly_transactions'] / (df['account_age_months'] + 1)
        
        # Engagement score
        if 'days_since_last_login' in df.columns:
            df['engagement_score'] = np.where(df['days_since_last_login'] < 30, 3,
                                             np.where(df['days_since_last_login'] < 90, 2,
                                                     np.where(df['days_since_last_login'] < 180, 1, 0)))
        
        # Service interaction ratio
        if 'customer_service_calls' in df.columns and 'complaints_filed' in df.columns:
            df['complaint_ratio'] = df['complaints_filed'] / (df['customer_service_calls'] + 1)
        
        # Digital adoption
        if 'has_mobile_banking' in df.columns and 'has_credit_card' in df.columns:
            df['digital_products'] = df['has_mobile_banking'] + df['has_credit_card']
        
        logger.info("Feature engineering completed")
        return df
    
    def scale_features(self, df: pd.DataFrame, scaling: str = 'standard', 
                      fit: bool = True) -> pd.DataFrame:
        """
        Scale numerical features.
        
        Args:
            df: Input DataFrame
            scaling: Scaling method ('standard', 'minmax', 'robust')
            fit: Whether to fit the scaler (True for training, False for inference)
        
        Returns:
            DataFrame with scaled features
        """
        df = df.copy()
        
        # Identify columns to scale (exclude target and ID)
        cols_to_scale = [col for col in df.select_dtypes(include=[np.number]).columns 
                        if col not in ['churn', 'customer_id']]
        
        if fit:
            if scaling == 'standard':
                self.scaler = StandardScaler()
            elif scaling == 'minmax':
                self.scaler = MinMaxScaler()
            elif scaling == 'robust':
                self.scaler = RobustScaler()
            
            df[cols_to_scale] = self.scaler.fit_transform(df[cols_to_scale])
        else:
            if self.scaler is None:
                raise ValueError("Scaler not fitted. Set fit=True first.")
            df[cols_to_scale] = self.scaler.transform(df[cols_to_scale])
        
        logger.info(f"Features scaled using: {scaling}")
        return df
    
    def preprocess(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        """
        Complete preprocessing pipeline.
        
        Args:
            df: Input DataFrame
            fit: Whether this is training data (fit transformers) or test data
        
        Returns:
            Preprocessed DataFrame
        """
        logger.info("Starting preprocessing pipeline...")
        
        # Handle missing values
        df = self.handle_missing_values(
            df, 
            strategy=self.config.get('preprocessing', {}).get('handle_missing', 'median')
        )
        
        # Handle outliers (only during training)
        if fit and self.config.get('preprocessing', {}).get('outlier_detection', True):
            df = self.handle_outliers(
                df,
                threshold=self.config.get('preprocessing', {}).get('outlier_threshold', 3)
            )
        
        # Engineer features
        df = self.engineer_features(df)
        
        # Encode categorical features
        df = self.encode_categorical_features(
            df,
            encoding=self.config.get('preprocessing', {}).get('encoding', 'label')
        )
        
        # Scale features
        df = self.scale_features(
            df,
            scaling=self.config.get('preprocessing', {}).get('scaling', 'standard'),
            fit=fit
        )
        
        if fit:
            self.feature_names = [col for col in df.columns if col not in ['churn', 'customer_id']]
        
        logger.info("Preprocessing pipeline completed")
        return df
    
    def split_data(self, df: pd.DataFrame, test_size: float = 0.2, 
                   random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
        """
        Split data into training and testing sets.
        
        Args:
            df: Preprocessed DataFrame
            test_size: Proportion of data to use for testing
            random_state: Random seed for reproducibility
        
        Returns:
            X_train, X_test, y_train, y_test
        """
        if 'churn' not in df.columns:
            raise ValueError("Target column 'churn' not found in DataFrame")
        
        # Remove customer_id if present
        feature_cols = [col for col in df.columns if col not in ['churn', 'customer_id']]
        
        X = df[feature_cols]
        y = df['churn']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        logger.info(f"Data split: Train size={X_train.shape[0]}, Test size={X_test.shape[0]}")
        logger.info(f"Train churn rate: {y_train.mean():.2%}")
        logger.info(f"Test churn rate: {y_test.mean():.2%}")
        
        return X_train, X_test, y_train, y_test
    
    def save_preprocessor(self, path: str):
        """Save preprocessor artifacts."""
        joblib.dump({
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_names': self.feature_names,
            'config': self.config
        }, path)
        logger.info(f"Preprocessor saved to {path}")
    
    def load_preprocessor(self, path: str):
        """Load preprocessor artifacts."""
        artifacts = joblib.load(path)
        self.scaler = artifacts['scaler']
        self.label_encoders = artifacts['label_encoders']
        self.feature_names = artifacts['feature_names']
        self.config = artifacts['config']
        logger.info(f"Preprocessor loaded from {path}")
