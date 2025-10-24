# BK PULSE - Customer Churn Prediction System

[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🎯 Mission Capstone Project - ALU Rwanda

Customer retention is a strategic challenge for commercial banks, especially as Rwanda's financial sector rapidly digitizes. Bank of Kigali (BK) faces churn due to changing customer expectations and digital competition. While loyalty programs exist, predictive analytics enables proactive retention.

**BK Pulse** is a machine learning-based customer churn prediction system tailored for Bank of Kigali to enable proactive customer retention strategies.

---

## 🌟 Features

- **Advanced ML Models**: Support for XGBoost, LightGBM, Random Forest, and Logistic Regression
- **Data Preprocessing**: Comprehensive pipeline with feature engineering and scaling
- **Imbalanced Data Handling**: SMOTE-based oversampling for better minority class prediction
- **REST API**: Flask-based API for real-time predictions
- **Batch Processing**: Efficient prediction for large customer datasets
- **Model Interpretability**: Feature importance analysis and visualization
- **Configuration-driven**: Easy customization through YAML configuration

---

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Usage](#usage)
  - [Training](#training)
  - [Prediction](#prediction)
  - [API Usage](#api-usage)
- [Configuration](#configuration)
- [Model Performance](#model-performance)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Virtual environment (recommended)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/shyakx/BK_PULSE.git
   cd BK_PULSE
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create necessary directories**
   ```bash
   mkdir -p data/raw data/processed data/models logs
   ```

---

## 🎬 Quick Start

### 1. Train the Model with Sample Data

```bash
python train.py --sample-data
```

This will:
- Generate synthetic customer data (1000 samples)
- Preprocess and engineer features
- Train an XGBoost model
- Evaluate performance on test set
- Save model and preprocessor artifacts

### 2. Make Predictions

**Single Customer Prediction:**
```bash
python predict.py
```

**Batch Prediction:**
```bash
python predict.py --batch --input data/raw/customer_data.csv --output predictions.csv
```

### 3. Start the API Server

```bash
python src/api/app.py
```

The API will be available at `http://localhost:5000`

---

## 📁 Project Structure

```
BK_PULSE/
├── src/
│   ├── data/
│   │   ├── data_loader.py      # Data loading and validation
│   │   └── preprocessor.py     # Feature engineering and preprocessing
│   ├── models/
│   │   └── churn_model.py      # ML model implementations
│   ├── utils/
│   │   ├── config_loader.py    # Configuration management
│   │   ├── logger.py           # Logging utilities
│   │   └── visualization.py    # Plotting and visualization
│   └── api/
│       └── app.py              # Flask REST API
├── notebooks/
│   └── (Jupyter notebooks for exploration and analysis)
├── tests/
│   └── (Unit and integration tests)
├── data/
│   ├── raw/                    # Raw data files
│   ├── processed/              # Processed data
│   └── models/                 # Saved models and artifacts
├── logs/                       # Application logs
├── train.py                    # Training script
├── predict.py                  # Prediction script
├── config.yaml                 # Configuration file
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

---

## 💻 Usage

### Training

Train a model with custom configuration:

```bash
python train.py --config config.yaml
```

Train with sample data:

```bash
python train.py --sample-data
```

The training script will:
1. Load/generate customer data
2. Validate and preprocess data
3. Split into train/test sets
4. Train the model with cross-validation
5. Optimize classification threshold
6. Evaluate on test set
7. Save model and artifacts

### Prediction

**Single Customer Example:**

```python
from predict import predict_single
from src.utils.config_loader import load_config

config = load_config('config.yaml')

customer_data = {
    'customer_id': 'CUS000001',
    'age': 35,
    'gender': 'M',
    'location': 'Kigali',
    'account_balance': 250000,
    'account_age_months': 24,
    'number_of_products': 2,
    'has_credit_card': 1,
    'has_mobile_banking': 1,
    'avg_monthly_transactions': 15,
    'total_transaction_amount': 500000,
    'transaction_frequency': 20,
    'days_since_last_login': 5,
    'customer_service_calls': 1,
    'complaints_filed': 0
}

result = predict_single(
    customer_data,
    config['data']['model_path'],
    config['data']['scaler_path'],
    config
)

print(f"Churn Probability: {result['churn_probability']:.2%}")
print(f"Risk Level: {result['risk_level']}")
print(f"Recommendation: {result['recommendation']}")
```

**Batch Prediction:**

```bash
python predict.py --batch --input data/customers.csv --output predictions.csv
```

### API Usage

#### Start the API Server

```bash
python src/api/app.py
```

#### API Endpoints

**1. Health Check**
```bash
curl http://localhost:5000/health
```

**2. Single Customer Prediction**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUS000001",
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
  }'
```

**3. Batch Prediction**
```bash
curl -X POST http://localhost:5000/batch_predict \
  -F "file=@data/customers.csv"
```

**4. Model Information**
```bash
curl http://localhost:5000/model_info
```

---

## ⚙️ Configuration

Edit `config.yaml` to customize the system:

```yaml
# Model selection
model:
  algorithm: "xgboost"  # xgboost, lightgbm, random_forest, logistic_regression
  test_size: 0.2
  handle_imbalance: true

# Preprocessing options
preprocessing:
  handle_missing: "median"  # median, mean, drop, forward_fill
  encoding: "label"         # label, onehot
  scaling: "standard"       # standard, minmax, robust
  outlier_detection: true
  outlier_threshold: 3

# API settings
api:
  host: "0.0.0.0"
  port: 5000
  debug: false
```

---

## 📊 Model Performance

Using XGBoost on sample data (1000 customers):

| Metric    | Score  |
|-----------|--------|
| Accuracy  | ~0.85  |
| Precision | ~0.82  |
| Recall    | ~0.78  |
| F1 Score  | ~0.80  |
| ROC AUC   | ~0.90  |

**Key Features for Churn Prediction:**
1. Days since last login
2. Customer service calls
3. Complaints filed
4. Account balance
5. Transaction frequency

---

## 🎓 Use Cases

### For Bank Managers
- Identify high-risk customers for targeted retention campaigns
- Prioritize customer service interventions
- Allocate retention budgets effectively

### For Marketing Teams
- Design personalized retention offers
- Segment customers by risk level
- Track retention campaign effectiveness

### For Data Scientists
- Feature importance analysis
- Model performance monitoring
- A/B testing of retention strategies

---

## 🧪 Testing

Run tests:
```bash
pytest tests/
```

Run with coverage:
```bash
pytest --cov=src tests/
```

---

## 🤝 Contributing

This is a capstone project for ALU Rwanda. For questions or suggestions:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📝 License

This project is part of a Mission Capstone at ALU Rwanda.

---

## 👥 Authors

**ALU Rwanda Mission Capstone Team**

---

## 🙏 Acknowledgments

- Bank of Kigali for the problem statement
- ALU Rwanda for academic support
- Rwanda's financial sector for inspiration

---

## 📞 Contact

For questions or collaboration opportunities, please open an issue on GitHub.

---

## 🔮 Future Enhancements

- [ ] Deep learning models (LSTM, Transformer)
- [ ] Real-time streaming predictions
- [ ] Customer segmentation analysis
- [ ] Retention strategy recommendation engine
- [ ] Dashboard for monitoring and alerts
- [ ] Integration with banking systems
- [ ] Mobile app for field agents

---

**Built with ❤️ for Bank of Kigali and Rwanda's financial sector**