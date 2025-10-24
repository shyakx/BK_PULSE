"""
Configuration loader utility.
"""

import yaml
import os
from typing import Dict, Any


def load_config(config_path: str = "config.yaml") -> Dict[str, Any]:
    """
    Load configuration from YAML file.
    
    Args:
        config_path: Path to configuration file
    
    Returns:
        Configuration dictionary
    """
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    return config


def get_data_path(config: Dict[str, Any], data_type: str = 'raw') -> str:
    """
    Get data path from configuration.
    
    Args:
        config: Configuration dictionary
        data_type: Type of data ('raw', 'processed', 'model')
    
    Returns:
        Path to data file
    """
    if data_type == 'raw':
        return config.get('data', {}).get('raw_data_path', 'data/raw/customer_data.csv')
    elif data_type == 'processed':
        return config.get('data', {}).get('processed_data_path', 'data/processed/processed_data.pkl')
    elif data_type == 'model':
        return config.get('data', {}).get('model_path', 'data/models/churn_model.joblib')
    elif data_type == 'scaler':
        return config.get('data', {}).get('scaler_path', 'data/models/scaler.joblib')
    else:
        raise ValueError(f"Unknown data type: {data_type}")
