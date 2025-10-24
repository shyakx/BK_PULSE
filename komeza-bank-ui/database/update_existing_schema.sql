-- Update existing database schema for churn prediction system
-- This script modifies your existing tables and adds missing columns

-- 1. Update customers table to include all churn prediction fields
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS customer_id VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS location VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_segment VARCHAR(50),
ADD COLUMN IF NOT EXISTS account_balance DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_balance DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tenure_months INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS product_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_credit_card BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS account_open_date DATE,
ADD COLUMN IF NOT EXISTS last_transaction_date DATE,
ADD COLUMN IF NOT EXISTS transaction_frequency INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_transaction_amount DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS mobile_banking_usage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS branch_visits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS complaint_history INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_age_months INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS days_since_last_transaction INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS activity_score DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS churn_probability DECIMAL(5,4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS churn_flag BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS branch VARCHAR(20),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'RWF',
ADD COLUMN IF NOT EXISTS nationality VARCHAR(50) DEFAULT 'Rwandan',
ADD COLUMN IF NOT EXISTS account_type VARCHAR(50) DEFAULT 'Current',
ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'Low',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. Create customer_interactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS customer_interactions (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'call', 'email', 'meeting', 'sms'
    notes TEXT,
    outcome VARCHAR(50), -- 'retained', 'churned', 'product_sold', 'follow_up_required'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create churn_predictions table for audit trail
CREATE TABLE IF NOT EXISTS churn_predictions (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    churn_probability DECIMAL(5,4) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    model_version VARCHAR(20),
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create retention_campaigns table
CREATE TABLE IF NOT EXISTS retention_campaigns (
    id SERIAL PRIMARY KEY,
    campaign_name VARCHAR(255) NOT NULL,
    target_segment VARCHAR(50),
    target_customers INTEGER,
    budget DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'Active',
    success_rate DECIMAL(5,2),
    revenue_retained DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON customers(customer_segment);
CREATE INDEX IF NOT EXISTS idx_customers_churn_probability ON customers(churn_probability);
CREATE INDEX IF NOT EXISTS idx_customers_risk_level ON customers(risk_level);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

CREATE INDEX IF NOT EXISTS idx_interactions_customer_id ON customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON customer_interactions(created_at);

CREATE INDEX IF NOT EXISTS idx_predictions_customer_id ON churn_predictions(customer_id);
CREATE INDEX IF NOT EXISTS idx_predictions_date ON churn_predictions(prediction_date);

-- 6. Create views for common queries
CREATE OR REPLACE VIEW high_risk_customers AS
SELECT 
    customer_id,
    full_name as customer_name,
    customer_segment,
    churn_probability,
    risk_level,
    account_balance,
    last_transaction_date,
    created_at
FROM customers 
WHERE churn_probability > 0.6
ORDER BY churn_probability DESC;

CREATE OR REPLACE VIEW customer_segment_stats AS
SELECT 
    customer_segment,
    COUNT(*) as total_customers,
    AVG(churn_probability) as avg_churn_probability,
    SUM(account_balance) as total_balance,
    COUNT(CASE WHEN risk_level = 'High' THEN 1 END) as high_risk_count,
    COUNT(CASE WHEN risk_level = 'Medium' THEN 1 END) as medium_risk_count,
    COUNT(CASE WHEN risk_level = 'Low' THEN 1 END) as low_risk_count
FROM customers 
GROUP BY customer_segment;

-- 7. Create function to update risk level based on churn probability
CREATE OR REPLACE FUNCTION update_risk_level()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.churn_probability >= 0.7 THEN
        NEW.risk_level := 'High';
    ELSIF NEW.churn_probability >= 0.4 THEN
        NEW.risk_level := 'Medium';
    ELSE
        NEW.risk_level := 'Low';
    END IF;
    
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to automatically update risk level
DROP TRIGGER IF EXISTS trigger_update_risk_level ON customers;
CREATE TRIGGER trigger_update_risk_level
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_risk_level();

-- 9. Update existing customers table to use new column names
-- Map existing columns to new structure
UPDATE customers 
SET 
    customer_id = 'C' || id::text,
    customer_segment = segment,
    churn_probability = COALESCE(churn_risk, 0),
    risk_level = CASE 
        WHEN churn_risk >= 0.7 THEN 'High'
        WHEN churn_risk >= 0.4 THEN 'Medium'
        ELSE 'Low'
    END
WHERE customer_id IS NULL;

-- 10. Show final table structure
SELECT 
    'customers' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;
