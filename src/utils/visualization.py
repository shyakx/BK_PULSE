"""
Visualization utilities for model analysis.
"""

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from sklearn.metrics import confusion_matrix, roc_curve, auc
from typing import Optional
import os


def plot_confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray, 
                         save_path: Optional[str] = None):
    """
    Plot confusion matrix.
    
    Args:
        y_true: True labels
        y_pred: Predicted labels
        save_path: Path to save the plot (optional)
    """
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['No Churn', 'Churn'],
                yticklabels=['No Churn', 'Churn'])
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()


def plot_roc_curve(y_true: np.ndarray, y_proba: np.ndarray,
                  save_path: Optional[str] = None):
    """
    Plot ROC curve.
    
    Args:
        y_true: True labels
        y_proba: Predicted probabilities
        save_path: Path to save the plot (optional)
    """
    fpr, tpr, _ = roc_curve(y_true, y_proba)
    roc_auc = auc(fpr, tpr)
    
    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, color='darkorange', lw=2, 
             label=f'ROC curve (AUC = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--', label='Random')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (ROC) Curve')
    plt.legend(loc="lower right")
    plt.grid(alpha=0.3)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()


def plot_feature_importance(importance_df: pd.DataFrame, top_n: int = 15,
                           save_path: Optional[str] = None):
    """
    Plot feature importance.
    
    Args:
        importance_df: DataFrame with 'feature' and 'importance' columns
        top_n: Number of top features to display
        save_path: Path to save the plot (optional)
    """
    top_features = importance_df.head(top_n)
    
    plt.figure(figsize=(10, 8))
    plt.barh(range(len(top_features)), top_features['importance'])
    plt.yticks(range(len(top_features)), top_features['feature'])
    plt.xlabel('Importance')
    plt.title(f'Top {top_n} Feature Importances')
    plt.gca().invert_yaxis()
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()


def plot_churn_distribution(df: pd.DataFrame, save_path: Optional[str] = None):
    """
    Plot churn distribution.
    
    Args:
        df: DataFrame with 'churn' column
        save_path: Path to save the plot (optional)
    """
    churn_counts = df['churn'].value_counts()
    
    plt.figure(figsize=(8, 6))
    plt.bar(['No Churn', 'Churn'], churn_counts.values, color=['green', 'red'])
    plt.ylabel('Count')
    plt.title('Customer Churn Distribution')
    plt.grid(axis='y', alpha=0.3)
    
    # Add percentage labels
    total = len(df)
    for i, v in enumerate(churn_counts.values):
        plt.text(i, v + total*0.01, f'{v} ({v/total*100:.1f}%)', 
                ha='center', va='bottom')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()


def plot_training_history(history: dict, save_path: Optional[str] = None):
    """
    Plot training history (for models that support it).
    
    Args:
        history: Dictionary with training metrics over epochs
        save_path: Path to save the plot (optional)
    """
    fig, axes = plt.subplots(1, 2, figsize=(15, 5))
    
    # Loss plot
    if 'loss' in history:
        axes[0].plot(history['loss'], label='Training Loss')
        if 'val_loss' in history:
            axes[0].plot(history['val_loss'], label='Validation Loss')
        axes[0].set_xlabel('Epoch')
        axes[0].set_ylabel('Loss')
        axes[0].set_title('Model Loss')
        axes[0].legend()
        axes[0].grid(alpha=0.3)
    
    # Accuracy plot
    if 'accuracy' in history:
        axes[1].plot(history['accuracy'], label='Training Accuracy')
        if 'val_accuracy' in history:
            axes[1].plot(history['val_accuracy'], label='Validation Accuracy')
        axes[1].set_xlabel('Epoch')
        axes[1].set_ylabel('Accuracy')
        axes[1].set_title('Model Accuracy')
        axes[1].legend()
        axes[1].grid(alpha=0.3)
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()
