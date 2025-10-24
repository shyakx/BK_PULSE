// Script to verify CSV migration to PostgreSQL
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5434,
  database: 'bk-pulse',
  user: 'postgres',
  password: '0123',
});

async function verifyMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verifying CSV migration to PostgreSQL...\n');
    
    // Check total customers
    const totalResult = await client.query('SELECT COUNT(*) as total FROM customers');
    console.log(`📊 Total customers in database: ${totalResult.rows[0].total}`);
    
    // Check customers with churn data
    const churnResult = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN churn_probability > 0 THEN 1 END) as with_churn_data,
        AVG(churn_probability) as avg_churn_probability,
        COUNT(CASE WHEN churn_probability >= 0.7 THEN 1 END) as high_risk,
        COUNT(CASE WHEN churn_probability >= 0.4 AND churn_probability < 0.7 THEN 1 END) as medium_risk,
        COUNT(CASE WHEN churn_probability < 0.4 THEN 1 END) as low_risk
      FROM customers
    `);
    
    const stats = churnResult.rows[0];
    console.log(`📈 Churn statistics:`);
    console.log(`   - Customers with churn data: ${stats.with_churn_data}`);
    console.log(`   - Average churn probability: ${(parseFloat(stats.avg_churn_probability) * 100).toFixed(2)}%`);
    console.log(`   - High risk customers: ${stats.high_risk}`);
    console.log(`   - Medium risk customers: ${stats.medium_risk}`);
    console.log(`   - Low risk customers: ${stats.low_risk}`);
    
    // Check segments
    const segmentResult = await client.query(`
      SELECT 
        customer_segment,
        COUNT(*) as count,
        AVG(churn_probability) as avg_churn
      FROM customers 
      WHERE customer_segment IS NOT NULL
      GROUP BY customer_segment
      ORDER BY count DESC
    `);
    
    console.log(`\n📋 Customer segments:`);
    segmentResult.rows.forEach(row => {
      console.log(`   - ${row.customer_segment}: ${row.count} customers (avg churn: ${(parseFloat(row.avg_churn) * 100).toFixed(1)}%)`);
    });
    
    // Check sample customers
    const sampleResult = await client.query(`
      SELECT 
        customer_id,
        full_name,
        customer_segment,
        churn_probability,
        risk_level,
        account_balance
      FROM customers 
      WHERE churn_probability > 0.8
      ORDER BY churn_probability DESC
      LIMIT 5
    `);
    
    console.log(`\n🎯 Top 5 high-risk customers:`);
    sampleResult.rows.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.full_name} (${customer.customer_id})`);
      console.log(`      Segment: ${customer.customer_segment}`);
      console.log(`      Churn Probability: ${(parseFloat(customer.churn_probability) * 100).toFixed(1)}%`);
      console.log(`      Risk Level: ${customer.risk_level}`);
      console.log(`      Account Balance: ${parseFloat(customer.account_balance).toLocaleString()} RWF`);
    });
    
    // Check if views work
    const viewResult = await client.query('SELECT COUNT(*) as count FROM high_risk_customers');
    console.log(`\n📊 High-risk customers view: ${viewResult.rows[0].count} customers`);
    
    console.log('\n✅ Migration verification completed!');
    console.log('\n🎯 Your database is now ready for the churn prediction system!');
    
  } catch (error) {
    console.error('❌ Error verifying migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run verification
verifyMigration()
  .then(() => {
    console.log('\n🎉 Database is ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Verification failed:', error);
    process.exit(1);
  });
