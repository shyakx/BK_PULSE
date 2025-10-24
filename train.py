"""
Training script for BK Pulse churn prediction model.
"""

import os
import sys
import argparse
import pandas as pd

from src.utils.config_loader import load_config
from src.data.data_loader import DataLoader
from src.data.preprocessor import DataPreprocessor
from src.models.churn_model import ChurnPredictor
from src.utils.logger import setup_logger

logger = setup_logger('train', 'logs/training.log')


def main(config_path: str = 'config.yaml', use_sample_data: bool = False):
    """
    Main training pipeline.
    
    Args:
        config_path: Path to configuration file
        use_sample_data: Whether to generate and use sample data
    """
    logger.info("=" * 60)
    logger.info("Starting BK Pulse Training Pipeline")
    logger.info("=" * 60)
    
    # Load configuration
    logger.info(f"Loading configuration from {config_path}")
    config = load_config(config_path)
    
    # Ensure directories exist
    os.makedirs('data/raw', exist_ok=True)
    os.makedirs('data/processed', exist_ok=True)
    os.makedirs('data/models', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Load or generate data
    data_path = config['data']['raw_data_path']
    loader = DataLoader(data_path)
    
    if use_sample_data or not os.path.exists(data_path):
        logger.info("Generating sample customer data...")
        df = loader.generate_sample_data(n_samples=1000, save_path=data_path)
    else:
        logger.info(f"Loading data from {data_path}")
        df = loader.load_data()
    
    # Validate data
    logger.info("Validating data...")
    validation_results = loader.validate_data()
    
    # Initialize preprocessor
    logger.info("Initializing data preprocessor...")
    preprocessor = DataPreprocessor(config)
    
    # Preprocess data
    logger.info("Preprocessing data...")
    df_processed = preprocessor.preprocess(df, fit=True)
    
    # Split data
    logger.info("Splitting data into train and test sets...")
    X_train, X_test, y_train, y_test = preprocessor.split_data(
        df_processed,
        test_size=config['model']['test_size'],
        random_state=config['model']['random_state']
    )
    
    # Save preprocessor
    scaler_path = config['data']['scaler_path']
    logger.info(f"Saving preprocessor to {scaler_path}")
    preprocessor.save_preprocessor(scaler_path)
    
    # Initialize model
    logger.info(f"Initializing {config['model']['algorithm']} model...")
    model = ChurnPredictor(config)
    
    # Train model
    logger.info("Training model...")
    train_metrics = model.train(X_train, y_train, X_test, y_test)
    logger.info(f"Training metrics: {train_metrics}")
    
    # Optimize threshold
    if config['training']['optimize_threshold']:
        logger.info("Optimizing classification threshold...")
        best_threshold = model.optimize_threshold(X_test, y_test)
        logger.info(f"Best threshold: {best_threshold:.2f}")
    
    # Evaluate model
    logger.info("Evaluating model on test set...")
    eval_metrics = model.evaluate(X_test, y_test)
    
    # Display results
    logger.info("\n" + "=" * 60)
    logger.info("FINAL MODEL PERFORMANCE")
    logger.info("=" * 60)
    logger.info(f"Algorithm: {config['model']['algorithm']}")
    logger.info(f"Test Set Size: {len(X_test)}")
    logger.info(f"Accuracy:  {eval_metrics['accuracy']:.4f}")
    logger.info(f"Precision: {eval_metrics['precision']:.4f}")
    logger.info(f"Recall:    {eval_metrics['recall']:.4f}")
    logger.info(f"F1 Score:  {eval_metrics['f1_score']:.4f}")
    logger.info(f"ROC AUC:   {eval_metrics['roc_auc']:.4f}")
    logger.info("\nConfusion Matrix:")
    logger.info(eval_metrics['confusion_matrix'])
    logger.info("\nClassification Report:")
    logger.info(eval_metrics['classification_report'])
    logger.info("=" * 60)
    
    # Feature importance
    logger.info("\nFeature Importance:")
    importance_df = model.get_feature_importance()
    if not importance_df.empty:
        logger.info("\nTop 10 Features:")
        for idx, row in importance_df.head(10).iterrows():
            logger.info(f"  {row['feature']}: {row['importance']:.4f}")
    
    # Save model
    model_path = config['data']['model_path']
    logger.info(f"\nSaving model to {model_path}")
    model.save_model(model_path)
    
    logger.info("\n" + "=" * 60)
    logger.info("Training pipeline completed successfully!")
    logger.info("=" * 60)
    
    return model, preprocessor, eval_metrics


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train BK Pulse churn prediction model')
    parser.add_argument('--config', type=str, default='config.yaml',
                       help='Path to configuration file')
    parser.add_argument('--sample-data', action='store_true',
                       help='Generate and use sample data for training')
    
    args = parser.parse_args()
    
    main(config_path=args.config, use_sample_data=args.sample_data)
