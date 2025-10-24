# Quick Start Guide - BK Pulse

Get up and running with the BK Pulse customer churn prediction system in minutes!

## Prerequisites

- Python 3.8 or higher
- pip package manager
- 5-10 minutes of your time

## Installation

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/shyakx/BK_PULSE.git
cd BK_PULSE

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Train Your First Model

Train a model using synthetic data (perfect for testing):

```bash
python train.py --sample-data
```

This will:
- Generate 1000 synthetic customer records
- Train an XGBoost model
- Save the model to `data/models/churn_model.joblib`
- Display performance metrics

**Expected output:**
```
Accuracy:  ~0.67
Precision: ~0.32
Recall:    ~0.56
F1 Score:  ~0.41
ROC AUC:   ~0.65
```

### 3. Make Predictions

#### Option A: Single Customer Prediction

```bash
python predict.py
```

This runs a demo prediction on a sample high-risk customer.

#### Option B: Batch Prediction

Create a CSV file with customer data:

```bash
python predict.py --batch --input data/raw/customer_data.csv --output predictions.csv
```

### 4. Start the API Server

```bash
python src/api/app.py
```

The API will be available at `http://localhost:5000`

#### Test the API:

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Predict Churn:**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUS000123",
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

**Expected response:**
```json
{
  "success": true,
  "predictions": {
    "customer_id": "CUS000123",
    "churn_prediction": 0,
    "churn_probability": 0.016,
    "risk_level": "Low"
  }
}
```

## Understanding the Output

### Risk Levels

- **Low Risk** (< 40% churn probability): Continue standard engagement
- **Medium Risk** (40-70% churn probability): Proactive engagement needed
- **High Risk** (> 70% churn probability): Immediate intervention required

### Recommendations

The system provides actionable recommendations:

- **High Risk**: Immediate personal contact with retention offers
- **Medium Risk**: Personalized engagement within 2 weeks
- **Low Risk**: Standard monitoring and cross-sell opportunities

## Next Steps

### Explore the Jupyter Notebook

```bash
jupyter notebook notebooks/01_BK_Pulse_Demo.ipynb
```

This interactive notebook walks you through:
- Data exploration
- Model training
- Feature importance analysis
- Making predictions
- Visualizations

### Customize Configuration

Edit `config.yaml` to:
- Change ML algorithm (xgboost, lightgbm, random_forest)
- Adjust model parameters
- Modify preprocessing options
- Configure API settings

Example:
```yaml
model:
  algorithm: "lightgbm"  # Try LightGBM instead
  handle_imbalance: true
```

Then retrain:
```bash
python train.py --sample-data
```

### Run Tests

Verify everything works:

```bash
pytest tests/ -v
```

## Common Issues

### Issue: ModuleNotFoundError

**Solution:** Make sure you activated the virtual environment and installed dependencies:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Model not found

**Solution:** Train the model first:
```bash
python train.py --sample-data
```

### Issue: API connection refused

**Solution:** Make sure the API is running:
```bash
python src/api/app.py
```

## Using Real Data

To use your own customer data:

1. Prepare a CSV file with these columns:
   - customer_id
   - age, gender, location
   - account_balance, account_age_months, number_of_products
   - has_credit_card, has_mobile_banking
   - avg_monthly_transactions, total_transaction_amount, transaction_frequency
   - days_since_last_login, customer_service_calls, complaints_filed
   - churn (0 or 1 for training data)

2. Update `config.yaml`:
   ```yaml
   data:
     raw_data_path: "path/to/your/data.csv"
   ```

3. Train:
   ```bash
   python train.py
   ```

## Getting Help

- 📖 Read the full [README.md](README.md)
- 🐛 Report issues on [GitHub Issues](https://github.com/shyakx/BK_PULSE/issues)
- 💡 Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines

## What's Next?

Now that you have BK Pulse running:

1. ✅ Train on real Bank of Kigali customer data
2. ✅ Integrate with existing banking systems
3. ✅ Set up automated daily predictions
4. ✅ Create dashboards for monitoring
5. ✅ Deploy to production environment

**Happy Predicting! 🎯**

---

*BK Pulse - Proactive Customer Retention for Bank of Kigali*  
*Mission Capstone Project - ALU Rwanda*
