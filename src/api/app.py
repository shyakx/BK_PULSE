"""
Flask API for BK Pulse Churn Prediction Service.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import logging
import os
import sys

# Add parent directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from src.utils.config_loader import load_config
from src.data.preprocessor import DataPreprocessor

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for model and preprocessor
model = None
preprocessor = None
config = None


def load_artifacts():
    """Load model and preprocessor artifacts."""
    global model, preprocessor, config
    
    try:
        config = load_config()
        
        # Load model
        model_path = config.get('data', {}).get('model_path', 'data/models/churn_model.joblib')
        if os.path.exists(model_path):
            model_artifacts = joblib.load(model_path)
            model = model_artifacts['model']
            logger.info("Model loaded successfully")
        else:
            logger.warning(f"Model not found at {model_path}")
        
        # Load preprocessor
        scaler_path = config.get('data', {}).get('scaler_path', 'data/models/scaler.joblib')
        if os.path.exists(scaler_path):
            preprocessor = DataPreprocessor(config)
            preprocessor.load_preprocessor(scaler_path)
            logger.info("Preprocessor loaded successfully")
        else:
            logger.warning(f"Preprocessor not found at {scaler_path}")
    
    except Exception as e:
        logger.error(f"Error loading artifacts: {str(e)}")


@app.route('/')
def home():
    """Health check endpoint."""
    return jsonify({
        'status': 'running',
        'service': 'BK Pulse - Customer Churn Prediction',
        'version': '1.0.0',
        'model_loaded': model is not None,
        'preprocessor_loaded': preprocessor is not None
    })


@app.route('/health')
def health():
    """Health check endpoint."""
    return jsonify({'status': 'healthy'})


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict churn for a single customer or batch of customers.
    
    Expected JSON format:
    {
        "customer_id": "CUS001234",
        "age": 35,
        "gender": "M",
        "location": "Kigali",
        "account_balance": 250000,
        "account_age_months": 24,
        "number_of_products": 2,
        "has_credit_card": 1,
        "has_mobile_banking": 1,
        "avg_monthly_transactions": 15,
        "total_transaction_amount": 500000,
        "transaction_frequency": 20,
        "days_since_last_login": 5,
        "customer_service_calls": 1,
        "complaints_filed": 0
    }
    """
    if model is None or preprocessor is None:
        return jsonify({'error': 'Model or preprocessor not loaded'}), 500
    
    try:
        data = request.get_json()
        
        # Handle single customer or batch
        if isinstance(data, dict):
            df = pd.DataFrame([data])
        elif isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            return jsonify({'error': 'Invalid input format'}), 400
        
        # Store customer IDs if present
        customer_ids = df['customer_id'].tolist() if 'customer_id' in df.columns else None
        
        # Preprocess data
        df_processed = preprocessor.preprocess(df, fit=False)
        
        # Remove customer_id and churn if present
        feature_cols = [col for col in df_processed.columns 
                       if col not in ['churn', 'customer_id']]
        X = df_processed[feature_cols]
        
        # Make predictions
        predictions = model.predict(X)
        probabilities = model.predict_proba(X)[:, 1]
        
        # Prepare response
        results = []
        for i in range(len(predictions)):
            result = {
                'customer_id': customer_ids[i] if customer_ids else None,
                'churn_prediction': int(predictions[i]),
                'churn_probability': float(probabilities[i]),
                'risk_level': 'High' if probabilities[i] > 0.7 else 'Medium' if probabilities[i] > 0.4 else 'Low'
            }
            results.append(result)
        
        return jsonify({
            'success': True,
            'predictions': results if len(results) > 1 else results[0]
        })
    
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """
    Predict churn for a batch of customers from CSV.
    
    Expects a CSV file upload with customer data.
    """
    if model is None or preprocessor is None:
        return jsonify({'error': 'Model or preprocessor not loaded'}), 500
    
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        df = pd.read_csv(file)
        
        # Store customer IDs
        customer_ids = df['customer_id'].tolist() if 'customer_id' in df.columns else list(range(len(df)))
        
        # Preprocess data
        df_processed = preprocessor.preprocess(df, fit=False)
        
        # Remove customer_id and churn if present
        feature_cols = [col for col in df_processed.columns 
                       if col not in ['churn', 'customer_id']]
        X = df_processed[feature_cols]
        
        # Make predictions
        predictions = model.predict(X)
        probabilities = model.predict_proba(X)[:, 1]
        
        # Create results DataFrame
        results_df = pd.DataFrame({
            'customer_id': customer_ids,
            'churn_prediction': predictions,
            'churn_probability': probabilities,
            'risk_level': ['High' if p > 0.7 else 'Medium' if p > 0.4 else 'Low' 
                          for p in probabilities]
        })
        
        return jsonify({
            'success': True,
            'total_customers': len(results_df),
            'high_risk_count': (results_df['risk_level'] == 'High').sum(),
            'medium_risk_count': (results_df['risk_level'] == 'Medium').sum(),
            'low_risk_count': (results_df['risk_level'] == 'Low').sum(),
            'predictions': results_df.to_dict('records')
        })
    
    except Exception as e:
        logger.error(f"Error during batch prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/model_info')
def model_info():
    """Get information about the loaded model."""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        info = {
            'model_type': type(model).__name__,
            'features': preprocessor.feature_names if preprocessor else None,
            'n_features': len(preprocessor.feature_names) if preprocessor and preprocessor.feature_names else None
        }
        
        # Add feature importances if available
        if hasattr(model, 'feature_importances_'):
            importance_dict = dict(zip(
                preprocessor.feature_names,
                model.feature_importances_.tolist()
            ))
            # Sort by importance
            importance_dict = dict(sorted(importance_dict.items(), 
                                        key=lambda x: x[1], reverse=True))
            info['feature_importances'] = importance_dict
        
        return jsonify(info)
    
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Load artifacts on startup
    load_artifacts()
    
    # Get API configuration
    if config:
        host = config.get('api', {}).get('host', '0.0.0.0')
        port = config.get('api', {}).get('port', 5000)
        debug = config.get('api', {}).get('debug', False)
    else:
        host, port, debug = '0.0.0.0', 5000, False
    
    app.run(host=host, port=port, debug=debug)
