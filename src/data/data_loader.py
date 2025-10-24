"""
Data loading and initial processing for BK Pulse.
"""

import pandas as pd
import numpy as np
from typing import Tuple, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataLoader:
    """Load and perform initial validation on customer data."""
    
    def __init__(self, data_path: str):
        """
        Initialize DataLoader.
        
        Args:
            data_path: Path to the raw data file (CSV or Excel)
        """
        self.data_path = data_path
        self.df = None
    
    def load_data(self) -> pd.DataFrame:
        """
        Load data from file.
        
        Returns:
            DataFrame containing the raw data
        """
        try:
            if self.data_path.endswith('.csv'):
                self.df = pd.read_csv(self.data_path)
            elif self.data_path.endswith(('.xlsx', '.xls')):
                self.df = pd.read_excel(self.data_path)
            else:
                raise ValueError(f"Unsupported file format: {self.data_path}")
            
            logger.info(f"Data loaded successfully. Shape: {self.df.shape}")
            return self.df
        
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise
    
    def validate_data(self) -> dict:
        """
        Perform basic data validation.
        
        Returns:
            Dictionary with validation results
        """
        if self.df is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        validation_results = {
            'shape': self.df.shape,
            'columns': list(self.df.columns),
            'missing_values': self.df.isnull().sum().to_dict(),
            'duplicates': self.df.duplicated().sum(),
            'data_types': self.df.dtypes.to_dict()
        }
        
        logger.info(f"Data validation complete. Shape: {validation_results['shape']}")
        logger.info(f"Missing values found: {sum(validation_results['missing_values'].values())}")
        logger.info(f"Duplicate rows: {validation_results['duplicates']}")
        
        return validation_results
    
    def get_data_summary(self) -> pd.DataFrame:
        """
        Get statistical summary of the data.
        
        Returns:
            DataFrame with summary statistics
        """
        if self.df is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        return self.df.describe(include='all')
    
    def generate_sample_data(self, n_samples: int = 1000, save_path: Optional[str] = None) -> pd.DataFrame:
        """
        Generate synthetic customer data for demonstration purposes.
        
        Args:
            n_samples: Number of samples to generate
            save_path: Optional path to save the generated data
        
        Returns:
            DataFrame with synthetic customer data
        """
        np.random.seed(42)
        
        # Generate synthetic customer data
        data = {
            'customer_id': [f'CUS{str(i).zfill(6)}' for i in range(1, n_samples + 1)],
            'age': np.random.randint(18, 75, n_samples),
            'gender': np.random.choice(['M', 'F'], n_samples),
            'location': np.random.choice(['Kigali', 'Musanze', 'Rubavu', 'Huye', 'Rusizi'], n_samples),
            'account_balance': np.random.exponential(500000, n_samples),
            'account_age_months': np.random.randint(1, 120, n_samples),
            'number_of_products': np.random.randint(1, 5, n_samples),
            'has_credit_card': np.random.choice([0, 1], n_samples),
            'has_mobile_banking': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
            'avg_monthly_transactions': np.random.randint(0, 100, n_samples),
            'total_transaction_amount': np.random.exponential(1000000, n_samples),
            'transaction_frequency': np.random.randint(0, 50, n_samples),
            'days_since_last_login': np.random.randint(0, 365, n_samples),
            'customer_service_calls': np.random.poisson(2, n_samples),
            'complaints_filed': np.random.poisson(0.5, n_samples),
        }
        
        # Generate churn labels (more realistic probabilities based on features)
        churn_prob = np.zeros(n_samples)
        churn_prob += (data['days_since_last_login'] > 180) * 0.3
        churn_prob += (data['account_balance'] < 50000) * 0.2
        churn_prob += (data['customer_service_calls'] > 5) * 0.2
        churn_prob += (data['complaints_filed'] > 2) * 0.15
        churn_prob += (data['transaction_frequency'] < 5) * 0.15
        churn_prob = np.clip(churn_prob, 0, 0.9)
        
        data['churn'] = (np.random.random(n_samples) < churn_prob).astype(int)
        
        self.df = pd.DataFrame(data)
        
        logger.info(f"Generated {n_samples} synthetic customer records")
        logger.info(f"Churn rate: {self.df['churn'].mean():.2%}")
        
        if save_path:
            self.df.to_csv(save_path, index=False)
            logger.info(f"Sample data saved to {save_path}")
        
        return self.df
