"""
Inference script for BK Pulse churn prediction.
"""

import os
import sys
import argparse
import pandas as pd
import joblib

from src.utils.config_loader import load_config
from src.data.preprocessor import DataPreprocessor
from src.utils.logger import setup_logger

logger = setup_logger('predict', 'logs/prediction.log')


def predict_single(customer_data: dict, model_path: str, scaler_path: str, config: dict):
    """
    Predict churn for a single customer.
    
    Args:
        customer_data: Dictionary with customer features
        model_path: Path to trained model
        scaler_path: Path to preprocessor
        config: Configuration dictionary
    
    Returns:
        Prediction result dictionary
    """
    # Load model
    model_artifacts = joblib.load(model_path)
    model = model_artifacts['model']
    best_threshold = model_artifacts.get('best_threshold', 0.5)
    
    # Load preprocessor
    preprocessor = DataPreprocessor(config)
    preprocessor.load_preprocessor(scaler_path)
    
    # Convert to DataFrame
    df = pd.DataFrame([customer_data])
    
    # Preprocess
    df_processed = preprocessor.preprocess(df, fit=False)
    
    # Remove non-feature columns
    feature_cols = [col for col in df_processed.columns 
                   if col not in ['churn', 'customer_id']]
    X = df_processed[feature_cols]
    
    # Predict
    proba = model.predict_proba(X)[0, 1]
    prediction = int(proba >= best_threshold)
    
    result = {
        'customer_id': customer_data.get('customer_id', 'N/A'),
        'churn_prediction': prediction,
        'churn_probability': proba,
        'risk_level': 'High' if proba > 0.7 else 'Medium' if proba > 0.4 else 'Low',
        'recommendation': get_recommendation(proba, customer_data)
    }
    
    return result


def predict_batch(data_path: str, model_path: str, scaler_path: str, 
                 config: dict, output_path: str = None):
    """
    Predict churn for multiple customers from CSV file.
    
    Args:
        data_path: Path to input CSV file
        model_path: Path to trained model
        scaler_path: Path to preprocessor
        config: Configuration dictionary
        output_path: Path to save predictions (optional)
    
    Returns:
        DataFrame with predictions
    """
    # Load data
    df = pd.read_csv(data_path)
    logger.info(f"Loaded {len(df)} customers from {data_path}")
    
    # Store customer IDs
    customer_ids = df['customer_id'].tolist() if 'customer_id' in df.columns else list(range(len(df)))
    
    # Load model
    model_artifacts = joblib.load(model_path)
    model = model_artifacts['model']
    best_threshold = model_artifacts.get('best_threshold', 0.5)
    
    # Load preprocessor
    preprocessor = DataPreprocessor(config)
    preprocessor.load_preprocessor(scaler_path)
    
    # Preprocess
    df_processed = preprocessor.preprocess(df, fit=False)
    
    # Remove non-feature columns
    feature_cols = [col for col in df_processed.columns 
                   if col not in ['churn', 'customer_id']]
    X = df_processed[feature_cols]
    
    # Predict
    probabilities = model.predict_proba(X)[:, 1]
    predictions = (probabilities >= best_threshold).astype(int)
    
    # Create results DataFrame
    results_df = pd.DataFrame({
        'customer_id': customer_ids,
        'churn_prediction': predictions,
        'churn_probability': probabilities,
        'risk_level': ['High' if p > 0.7 else 'Medium' if p > 0.4 else 'Low' 
                      for p in probabilities]
    })
    
    # Summary statistics
    logger.info("\nPrediction Summary:")
    logger.info(f"Total customers: {len(results_df)}")
    logger.info(f"Predicted to churn: {predictions.sum()} ({predictions.mean():.2%})")
    logger.info(f"High risk: {(results_df['risk_level'] == 'High').sum()}")
    logger.info(f"Medium risk: {(results_df['risk_level'] == 'Medium').sum()}")
    logger.info(f"Low risk: {(results_df['risk_level'] == 'Low').sum()}")
    
    # Save results
    if output_path:
        results_df.to_csv(output_path, index=False)
        logger.info(f"\nPredictions saved to {output_path}")
    
    return results_df


def get_recommendation(churn_probability: float, customer_data: dict) -> str:
    """
    Get retention recommendation based on churn probability and customer data.
    
    Args:
        churn_probability: Predicted churn probability
        customer_data: Customer feature dictionary
    
    Returns:
        Recommendation string
    """
    if churn_probability > 0.7:
        return "URGENT: Contact customer immediately with retention offer. Consider VIP treatment."
    elif churn_probability > 0.4:
        return "Monitor closely. Engage with personalized offers and improve service quality."
    else:
        return "Low risk. Continue standard engagement and satisfaction monitoring."


def main(args):
    """Main prediction function."""
    logger.info("=" * 60)
    logger.info("Starting BK Pulse Prediction")
    logger.info("=" * 60)
    
    # Load configuration
    config = load_config(args.config)
    
    model_path = config['data']['model_path']
    scaler_path = config['data']['scaler_path']
    
    # Check if model exists
    if not os.path.exists(model_path):
        logger.error(f"Model not found at {model_path}")
        logger.error("Please train the model first using train.py")
        return
    
    if args.batch:
        # Batch prediction
        logger.info(f"Running batch prediction on {args.input}")
        results = predict_batch(args.input, model_path, scaler_path, config, args.output)
        
        # Display top high-risk customers
        high_risk = results[results['risk_level'] == 'High'].sort_values(
            'churn_probability', ascending=False
        )
        
        if len(high_risk) > 0:
            logger.info("\nTop 10 High-Risk Customers:")
            for idx, row in high_risk.head(10).iterrows():
                logger.info(f"  {row['customer_id']}: {row['churn_probability']:.2%} probability")
    
    else:
        # Single prediction - example
        logger.info("Running single customer prediction example...")
        
        example_customer = {
            'customer_id': 'CUS000001',
            'age': 45,
            'gender': 'M',
            'location': 'Kigali',
            'account_balance': 50000,
            'account_age_months': 36,
            'number_of_products': 1,
            'has_credit_card': 0,
            'has_mobile_banking': 0,
            'avg_monthly_transactions': 5,
            'total_transaction_amount': 200000,
            'transaction_frequency': 8,
            'days_since_last_login': 200,
            'customer_service_calls': 6,
            'complaints_filed': 3
        }
        
        result = predict_single(example_customer, model_path, scaler_path, config)
        
        logger.info("\nPrediction Result:")
        logger.info(f"Customer ID: {result['customer_id']}")
        logger.info(f"Churn Prediction: {'Yes' if result['churn_prediction'] else 'No'}")
        logger.info(f"Churn Probability: {result['churn_probability']:.2%}")
        logger.info(f"Risk Level: {result['risk_level']}")
        logger.info(f"Recommendation: {result['recommendation']}")
    
    logger.info("\n" + "=" * 60)
    logger.info("Prediction completed!")
    logger.info("=" * 60)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Predict customer churn')
    parser.add_argument('--config', type=str, default='config.yaml',
                       help='Path to configuration file')
    parser.add_argument('--batch', action='store_true',
                       help='Run batch prediction')
    parser.add_argument('--input', type=str,
                       help='Path to input CSV file for batch prediction')
    parser.add_argument('--output', type=str,
                       help='Path to save prediction results')
    
    args = parser.parse_args()
    
    if args.batch and not args.input:
        parser.error("--batch requires --input")
    
    main(args)
