// Script to update existing database schema programmatically
import { Pool } from 'pg';

// Database connection using your existing configuration
const pool = new Pool({
  host: 'localhost',
  port: 5434,
  database: 'bk-pulse',
  user: 'postgres',
  password: '0123',
});

async function updateSchema() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Updating database schema for churn prediction system...\n');
    
    // 1. Update customers table to include all churn prediction fields
    console.log('📝 Adding churn prediction columns to customers table...');
    
    const alterColumns = [
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_id VARCHAR(50) UNIQUE",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS gender VARCHAR(10)",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS age INTEGER",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS location VARCHAR(100)",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_segment VARCHAR(50)",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_balance DECIMAL(15,2) DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS average_balance DECIMAL(15,2) DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS tenure_months INTEGER DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS product_count INTEGER DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS has_credit_card BOOLEAN DEFAULT FALSE",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'Active'",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_open_date DATE",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_transaction_date DATE",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS transaction_frequency INTEGER DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS average_transaction_amount DECIMAL(15,2) DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS mobile_banking_usage INTEGER DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS branch_visits INTEGER DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS complaint_history INTEGER DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_age_months INTEGER DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS days_since_last_transaction INTEGER DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS activity_score DECIMAL(5,2) DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS churn_probability DECIMAL(5,4) DEFAULT 0",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS churn_flag BOOLEAN DEFAULT FALSE",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS branch VARCHAR(20)",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'RWF'",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS nationality VARCHAR(50) DEFAULT 'Rwandan'",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_type VARCHAR(50) DEFAULT 'Current'",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'Low'",
      "ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    ];
    
    for (const sql of alterColumns) {
      try {
        await client.query(sql);
        console.log(`   ✅ ${sql.split(' ')[5]} column added/updated`);
      } catch (error) {
        console.log(`   ⚠️  ${sql.split(' ')[5]} column: ${error.message}`);
      }
    }
    
    // 2. Create customer_interactions table
    console.log('\n📝 Creating customer_interactions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS customer_interactions (
        id SERIAL PRIMARY KEY,
        customer_id VARCHAR(50) NOT NULL,
        interaction_type VARCHAR(50) NOT NULL,
        notes TEXT,
        outcome VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ customer_interactions table created');
    
    // 3. Create churn_predictions table
    console.log('\n📝 Creating churn_predictions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS churn_predictions (
        id SERIAL PRIMARY KEY,
        customer_id VARCHAR(50) NOT NULL,
        prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        churn_probability DECIMAL(5,4) NOT NULL,
        risk_level VARCHAR(20) NOT NULL,
        model_version VARCHAR(20),
        features JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ churn_predictions table created');
    
    // 4. Create retention_campaigns table
    console.log('\n📝 Creating retention_campaigns table...');
    await client.query(`
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
      )
    `);
    console.log('   ✅ retention_campaigns table created');
    
    // 5. Create indexes
    console.log('\n📝 Creating performance indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id)',
      'CREATE INDEX IF NOT EXISTS idx_customers_segment ON customers(customer_segment)',
      'CREATE INDEX IF NOT EXISTS idx_customers_churn_probability ON customers(churn_probability)',
      'CREATE INDEX IF NOT EXISTS idx_customers_risk_level ON customers(risk_level)',
      'CREATE INDEX IF NOT EXISTS idx_interactions_customer_id ON customer_interactions(customer_id)',
      'CREATE INDEX IF NOT EXISTS idx_predictions_customer_id ON churn_predictions(customer_id)'
    ];
    
    for (const sql of indexes) {
      await client.query(sql);
    }
    console.log('   ✅ Performance indexes created');
    
    // 6. Create views
    console.log('\n📝 Creating database views...');
    await client.query(`
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
      ORDER BY churn_probability DESC
    `);
    
    await client.query(`
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
      GROUP BY customer_segment
    `);
    console.log('   ✅ Database views created');
    
    // 7. Create trigger function
    console.log('\n📝 Creating trigger function...');
    await client.query(`
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
      $$ LANGUAGE plpgsql
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS trigger_update_risk_level ON customers;
      CREATE TRIGGER trigger_update_risk_level
        BEFORE UPDATE ON customers
        FOR EACH ROW
        EXECUTE FUNCTION update_risk_level()
    `);
    console.log('   ✅ Trigger function created');
    
    // 8. Update existing data
    console.log('\n📝 Updating existing customer data...');
    await client.query(`
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
      WHERE customer_id IS NULL
    `);
    console.log('   ✅ Existing customer data updated');
    
    // 9. Show final structure
    console.log('\n📊 Final customers table structure:');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'customers' 
      ORDER BY ordinal_position
    `);
    
    result.rows.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.column_name.padEnd(25)} ${col.data_type} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    console.log('\n✅ Database schema updated successfully!');
    console.log('\n🎯 Next steps:');
    console.log('1. Run the CSV migration script to import your 200k customers');
    console.log('2. Test the application with real database data');
    console.log('3. Verify all features work with PostgreSQL');
    
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the schema update
updateSchema()
  .then(() => {
    console.log('\n🎉 Schema update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Schema update failed:', error);
    process.exit(1);
  });
