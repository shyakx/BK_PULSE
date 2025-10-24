# Methodology - BK Pulse Customer Churn Prediction

## Executive Summary

BK Pulse employs machine learning to predict customer churn at Bank of Kigali, enabling proactive retention strategies. This document outlines the technical methodology, data requirements, model selection, and implementation approach.

---

## 1. Problem Definition

### Business Context

**Challenge:** Customer retention in Rwanda's rapidly digitalizing financial sector

**Impact:**
- Customer churn affects revenue and growth
- Acquisition costs exceed retention costs
- Digital competition increases churn risk
- Proactive retention more effective than reactive

**Solution:** ML-based predictive system for early churn identification

### Success Metrics

- **Accuracy:** > 70% overall prediction accuracy
- **Recall:** > 75% for churning customers (minimize false negatives)
- **ROC-AUC:** > 0.80 for discrimination capability
- **Business Impact:** 20%+ reduction in churn rate through targeted interventions

---

## 2. Data Requirements

### Customer Features

#### Demographic Features
- **Age:** Customer age in years
- **Gender:** Male/Female
- **Location:** Geographic location (Kigali, Musanze, Rubavu, Huye, Rusizi)

#### Account Features
- **Account Balance:** Current account balance (RWF)
- **Account Age:** Months since account opening
- **Number of Products:** Count of bank products used
- **Has Credit Card:** Binary indicator
- **Has Mobile Banking:** Binary indicator

#### Transaction Features
- **Average Monthly Transactions:** Mean transaction count per month
- **Total Transaction Amount:** Cumulative transaction value
- **Transaction Frequency:** Number of transactions in period

#### Engagement Features
- **Days Since Last Login:** Time since last digital banking access
- **Customer Service Calls:** Number of support calls
- **Complaints Filed:** Number of formal complaints

#### Target Variable
- **Churn:** Binary indicator (0 = retained, 1 = churned)

### Data Quality Requirements

- **Completeness:** < 10% missing values per feature
- **Accuracy:** Data validated against source systems
- **Timeliness:** Updated at least weekly
- **Consistency:** Standardized formats and definitions

---

## 3. Data Preprocessing Pipeline

### 3.1 Missing Value Handling

**Strategy:** Multiple approaches based on feature type

```python
# Numerical features: Median imputation
df[numerical_col].fillna(df[numerical_col].median())

# Categorical features: Mode imputation
df[categorical_col].fillna(df[categorical_col].mode()[0])
```

**Rationale:** Median robust to outliers; mode preserves distribution

### 3.2 Outlier Detection and Treatment

**Method:** Z-score based capping (threshold = 3)

```python
z_score = (value - mean) / std
if abs(z_score) > 3:
    value = mean ± 3 * std  # Cap at threshold
```

**Features Applied To:**
- Account balance
- Transaction amounts
- Service call counts

### 3.3 Feature Engineering

#### Derived Features

1. **Balance Per Product**
   ```python
   balance_per_product = account_balance / (number_of_products + 1)
   ```
   *Rationale:* Measures account value relative to engagement

2. **Engagement Score** (0-3 scale)
   ```python
   if days_since_last_login < 30: score = 3
   elif days_since_last_login < 90: score = 2
   elif days_since_last_login < 180: score = 1
   else: score = 0
   ```
   *Rationale:* Quantifies customer activity level

3. **Transaction Intensity**
   ```python
   transaction_intensity = avg_monthly_transactions / (account_age_months + 1)
   ```
   *Rationale:* Normalizes activity by account tenure

4. **Complaint Ratio**
   ```python
   complaint_ratio = complaints_filed / (customer_service_calls + 1)
   ```
   *Rationale:* Measures severity of dissatisfaction

5. **Digital Products**
   ```python
   digital_products = has_mobile_banking + has_credit_card
   ```
   *Rationale:* Aggregates digital adoption

### 3.4 Encoding Categorical Variables

**Method:** Label Encoding (default)

```python
label_encoder = LabelEncoder()
df['gender'] = label_encoder.fit_transform(df['gender'])
```

**Alternative:** One-Hot Encoding (configurable)

**Rationale:** Label encoding sufficient for tree-based models; one-hot for linear models

### 3.5 Feature Scaling

**Method:** StandardScaler (default)

```python
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

**Formula:**
```
X_scaled = (X - μ) / σ
```

**Alternatives:**
- MinMaxScaler: [0, 1] range normalization
- RobustScaler: Uses median and IQR (robust to outliers)

---

## 4. Class Imbalance Handling

### Problem
Typical churn rates: 10-30% → imbalanced dataset

### Solution: SMOTE (Synthetic Minority Over-sampling Technique)

**How it works:**
1. Select minority class samples
2. Find k-nearest neighbors (k=5)
3. Generate synthetic samples along line segments
4. Balance class distribution to 50:50

```python
from imblearn.over_sampling import SMOTE
smote = SMOTE(random_state=42)
X_balanced, y_balanced = smote.fit_resample(X, y)
```

**Benefits:**
- Improves recall on minority class
- Prevents model bias toward majority class
- More robust than simple oversampling

---

## 5. Model Selection

### Algorithms Implemented

#### 5.1 XGBoost (Default - Recommended)

**Type:** Gradient Boosted Decision Trees

**Advantages:**
- Excellent performance on tabular data
- Handles missing values internally
- Feature importance available
- Regularization prevents overfitting

**Parameters:**
```yaml
n_estimators: 100
max_depth: 6
learning_rate: 0.1
subsample: 0.8
colsample_bytree: 0.8
```

**Use Case:** Best overall performance, production-ready

#### 5.2 LightGBM

**Type:** Gradient Boosted Decision Trees (leaf-wise growth)

**Advantages:**
- Faster training than XGBoost
- Lower memory usage
- Good for large datasets

**Parameters:**
```yaml
n_estimators: 100
max_depth: 6
learning_rate: 0.1
num_leaves: 31
```

**Use Case:** Large-scale deployments, fast retraining

#### 5.3 Random Forest

**Type:** Ensemble of Decision Trees

**Advantages:**
- Robust and stable
- Less prone to overfitting
- Good baseline model

**Parameters:**
```yaml
n_estimators: 100
max_depth: 10
min_samples_split: 5
```

**Use Case:** Baseline comparison, interpretability

#### 5.4 Logistic Regression

**Type:** Linear Classification

**Advantages:**
- Fast training and prediction
- Highly interpretable
- Works well with scaled features

**Use Case:** Quick prototyping, explainability requirements

---

## 6. Model Training and Validation

### 6.1 Train-Test Split

**Ratio:** 80% training, 20% testing

**Stratification:** Maintains churn rate distribution

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
```

### 6.2 Cross-Validation

**Method:** 5-Fold Stratified K-Fold

**Purpose:**
- Reduce variance in performance estimates
- Validate model generalization
- Tune hyperparameters

**Metric:** ROC-AUC (robust to class imbalance)

### 6.3 Threshold Optimization

**Problem:** Default threshold (0.5) may not be optimal

**Solution:** Find threshold maximizing F1 score

```python
for threshold in [0.3, 0.35, 0.4, ..., 0.65, 0.7]:
    y_pred = (y_proba >= threshold).astype(int)
    f1 = f1_score(y_true, y_pred)
    # Select threshold with highest F1
```

**Rationale:** Balances precision and recall for business needs

---

## 7. Model Evaluation

### 7.1 Performance Metrics

#### Primary Metrics

1. **Accuracy**
   ```
   Accuracy = (TP + TN) / (TP + TN + FP + FN)
   ```
   *Target:* > 70%

2. **Precision**
   ```
   Precision = TP / (TP + FP)
   ```
   *Target:* > 60% (minimize false alarms)

3. **Recall (Sensitivity)**
   ```
   Recall = TP / (TP + FN)
   ```
   *Target:* > 75% (catch churning customers)

4. **F1 Score**
   ```
   F1 = 2 * (Precision * Recall) / (Precision + Recall)
   ```
   *Target:* > 65%

5. **ROC-AUC**
   ```
   Area Under ROC Curve
   ```
   *Target:* > 0.80

#### Confusion Matrix

```
                Predicted
                No    Yes
Actual  No     TN    FP
        Yes    FN    TP
```

**Business Interpretation:**
- **TN:** Correctly identified loyal customers
- **TP:** Correctly identified churning customers (saved!)
- **FP:** False alarms (unnecessary interventions)
- **FN:** Missed churners (critical to minimize)

### 7.2 Feature Importance Analysis

**Purpose:** Understand key churn drivers

**Method:** Model-specific feature importance

**Top Expected Features:**
1. Days since last login (engagement)
2. Customer service calls (satisfaction)
3. Complaints filed (dissatisfaction)
4. Account balance (value)
5. Transaction frequency (activity)

**Action:** Focus retention efforts on these areas

---

## 8. Risk Segmentation

### Three-Tier Risk Classification

#### High Risk (Probability > 70%)
- **Count:** ~10-15% of customers
- **Action:** Immediate personal intervention
- **Strategy:** VIP treatment, special offers, relationship manager contact
- **Timeline:** Within 24-48 hours

#### Medium Risk (Probability 40-70%)
- **Count:** ~20-30% of customers
- **Action:** Proactive engagement
- **Strategy:** Personalized emails, service improvements, loyalty rewards
- **Timeline:** Within 2 weeks

#### Low Risk (Probability < 40%)
- **Count:** ~55-70% of customers
- **Action:** Standard monitoring
- **Strategy:** Continue excellent service, cross-sell opportunities
- **Timeline:** Regular business cycle

### Retention ROI Calculation

```
ROI = (Customers_Saved * CLV - Intervention_Cost) / Intervention_Cost

Where:
- CLV = Customer Lifetime Value
- Intervention_Cost = Cost of retention campaign
```

---

## 9. Implementation Architecture

### System Components

```
┌─────────────────┐
│  Data Sources   │
│  (Bank Systems) │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Data Pipeline   │
│ (ETL Process)   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Preprocessing   │
│   & Features    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  ML Model       │
│  (XGBoost)      │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  API Service    │
│  (Flask REST)   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Business Apps   │
│ & Dashboards    │
└─────────────────┘
```

### API Endpoints

1. `/predict` - Single customer prediction
2. `/batch_predict` - Batch processing
3. `/model_info` - Model metadata and features
4. `/health` - System health check

---

## 10. Continuous Improvement

### Model Monitoring

**Track:**
- Prediction accuracy over time
- Feature drift detection
- Performance degradation

**Alerts:**
- Accuracy drops > 5%
- Significant feature distribution changes
- Error rate increases

### Retraining Strategy

**Frequency:** Weekly or monthly

**Triggers:**
- Scheduled (e.g., every Monday)
- Performance degradation detected
- New data volume threshold reached

**Process:**
1. Collect new data
2. Validate data quality
3. Retrain model
4. Evaluate on holdout set
5. Compare to current model
6. Deploy if superior

### A/B Testing

**Method:** Deploy multiple model versions

**Compare:**
- Prediction accuracy
- Business impact (actual churn reduction)
- Computational efficiency

**Decision:** Promote best-performing model

---

## 11. Limitations and Future Work

### Current Limitations

1. **Data Availability:** Relies on synthetic data for demo
2. **Feature Set:** Limited to available customer attributes
3. **External Factors:** Doesn't account for economic conditions
4. **Temporal Dynamics:** Static snapshot vs. time series

### Future Enhancements

1. **Deep Learning:** LSTM/Transformers for sequential patterns
2. **Real-time Streaming:** Continuous prediction updates
3. **Explainability:** SHAP values for individual predictions
4. **Causal Inference:** Why customers churn, not just who
5. **Recommendation Engine:** Personalized retention strategies
6. **Customer Segmentation:** Cluster-specific models

---

## 12. Ethical Considerations

### Privacy and Security

- **Data Protection:** Comply with Rwanda's data protection laws
- **Anonymization:** Remove PII where possible
- **Access Control:** Restrict model and prediction access
- **Audit Trail:** Log all predictions and model updates

### Fairness and Bias

- **Monitor:** Check for bias across demographic groups
- **Balance:** Ensure equitable treatment of all customers
- **Transparency:** Explain model decisions when requested
- **Human Oversight:** Human review for high-stakes decisions

---

## Conclusion

BK Pulse provides Bank of Kigali with a robust, scalable ML solution for customer churn prediction. The methodology combines proven techniques with Rwanda-specific context, enabling proactive retention strategies that enhance customer loyalty and business performance.

**Key Success Factors:**
1. High-quality data collection and maintenance
2. Regular model retraining with new data
3. Integration with existing bank systems
4. Staff training on system usage
5. Continuous monitoring and improvement

---

*BK Pulse Technical Methodology*  
*Mission Capstone Project - ALU Rwanda*  
*Bank of Kigali Customer Retention Initiative*
