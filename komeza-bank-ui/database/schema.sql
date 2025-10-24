-- KOMEZA BANK Database Schema
-- PostgreSQL Database for Customer Churn Prediction System

-- Create database (run this separately if needed)
-- CREATE DATABASE komeza_bank;

-- Connect to the database
-- \c komeza_bank;

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10),
    age INTEGER,
    location VARCHAR(100),
    customer_segment VARCHAR(50),
    account_balance DECIMAL(15,2) DEFAULT 0,
    average_balance DECIMAL(15,2) DEFAULT 0,
    tenure_months INTEGER DEFAULT 0,
    product_count INTEGER DEFAULT 0,
    has_credit_card BOOLEAN DEFAULT FALSE,
    account_status VARCHAR(20) DEFAULT 'Active',
    account_open_date DATE,
    last_transaction_date DATE,
    transaction_frequency INTEGER DEFAULT 0,
    average_transaction_amount DECIMAL(15,2) DEFAULT 0,
    mobile_banking_usage INTEGER DEFAULT 0,
    branch_visits INTEGER DEFAULT 0,
    complaint_history INTEGER DEFAULT 0,
    account_age_months INTEGER DEFAULT 0,
    days_since_last_transaction INTEGER DEFAULT 0,
    activity_score DECIMAL(5,2) DEFAULT 0,
    churn_probability DECIMAL(5,4) DEFAULT 0,
    churn_flag BOOLEAN DEFAULT FALSE,
    branch VARCHAR(20),
    currency VARCHAR(3) DEFAULT 'RWF',
    nationality VARCHAR(50) DEFAULT 'Rwandan',
    account_type VARCHAR(50) DEFAULT 'Current',
    risk_level VARCHAR(20) DEFAULT 'Low',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create customer interactions table
CREATE TABLE IF NOT EXISTS customer_interactions (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'call', 'email', 'meeting', 'sms'
    notes TEXT,
    outcome VARCHAR(50), -- 'retained', 'churned', 'product_sold', 'follow_up_required'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Create churn predictions table (for audit trail)
CREATE TABLE IF NOT EXISTS churn_predictions (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    churn_probability DECIMAL(5,4) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    model_version VARCHAR(20),
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Create retention campaigns table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON customers(customer_segment);
CREATE INDEX IF NOT EXISTS idx_customers_churn_probability ON customers(churn_probability);
CREATE INDEX IF NOT EXISTS idx_customers_risk_level ON customers(risk_level);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

CREATE INDEX IF NOT EXISTS idx_interactions_customer_id ON customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON customer_interactions(created_at);

CREATE INDEX IF NOT EXISTS idx_predictions_customer_id ON churn_predictions(customer_id);
CREATE INDEX IF NOT EXISTS idx_predictions_date ON churn_predictions(prediction_date);

-- Create views for common queries
CREATE OR REPLACE VIEW high_risk_customers AS
SELECT 
    customer_id,
    customer_name,
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

-- Create function to update risk level based on churn probability
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

-- Create trigger to automatically update risk level
CREATE TRIGGER trigger_update_risk_level
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_risk_level();

-- Insert sample data (optional - for testing)
-- You can uncomment this section to insert some test data
/*
INSERT INTO customers (
    customer_id, customer_name, gender, age, location, customer_segment,
    account_balance, churn_probability, risk_level
) VALUES 
('C1001', 'Jean Baptiste', 'Male', 35, 'Kigali', 'Retail', 2500000, 0.85, 'High'),
('C1002', 'Marie Claire', 'Female', 28, 'Kigali', 'Retail', 850000, 0.45, 'Medium'),
('C1003', 'Peter Nkurunziza', 'Male', 42, 'Musanze', 'SME', 1500000, 0.25, 'Low');
*/

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
