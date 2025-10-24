// Script to populate segment and churn_risk columns from existing data
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5434,
  database: 'bk-pulse',
  user: 'postgres',
  password: '0123',
});

async function populateSegmentAndChurnRisk() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Populating segment and churn_risk columns...\n');
    
    // Check current status
    const statusResult = await client.query(`
      SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN segment IS NULL THEN 1 END) as null_segment,
        COUNT(CASE WHEN churn_risk IS NULL THEN 1 END) as null_churn_risk,
        COUNT(CASE WHEN customer_segment IS NOT NULL THEN 1 END) as has_customer_segment,
        COUNT(CASE WHEN churn_probability IS NOT NULL THEN 1 END) as has_churn_probability
      FROM customers
    `);
    
    const status = statusResult.rows[0];
    console.log('📊 Current status:');
    console.log(`   - Total customers: ${status.total_customers}`);
    console.log(`   - Null segment: ${status.null_segment}`);
    console.log(`   - Null churn_risk: ${status.null_churn_risk}`);
    console.log(`   - Has customer_segment: ${status.has_customer_segment}`);
    console.log(`   - Has churn_probability: ${status.has_churn_probability}`);
    
    if (status.null_segment == 0 && status.null_churn_risk == 0) {
      console.log('✅ All segment and churn_risk columns are already populated!');
      return;
    }
    
    // Update segment column from customer_segment
    console.log('\n📝 Updating segment column from customer_segment...');
    const segmentResult = await client.query(`
      UPDATE customers 
      SET segment = customer_segment
      WHERE segment IS NULL AND customer_segment IS NOT NULL
    `);
    console.log(`✅ Updated ${segmentResult.rowCount} segment values`);
    
    // Update churn_risk column from churn_probability
    console.log('\n📝 Updating churn_risk column from churn_probability...');
    const churnResult = await client.query(`
      UPDATE customers 
      SET churn_risk = churn_probability
      WHERE churn_risk IS NULL AND churn_probability IS NOT NULL
    `);
    console.log(`✅ Updated ${churnResult.rowCount} churn_risk values`);
    
    // Verify the results
    console.log('\n🔍 Verifying updated data...');
    
    const verifyResult = await client.query(`
      SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN segment IS NOT NULL THEN 1 END) as with_segment,
        COUNT(CASE WHEN churn_risk IS NOT NULL THEN 1 END) as with_churn_risk,
        COUNT(CASE WHEN segment IS NULL THEN 1 END) as null_segment,
        COUNT(CASE WHEN churn_risk IS NULL THEN 1 END) as null_churn_risk
      FROM customers
    `);
    
    const segmentStats = await client.query(`
      SELECT 
        segment,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customers), 2) as percentage,
        ROUND(AVG(churn_risk), 4) as avg_churn_risk
      FROM customers 
      WHERE segment IS NOT NULL
      GROUP BY segment
      ORDER BY count DESC
    `);
    
    const riskStats = await client.query(`
      SELECT 
        CASE 
          WHEN churn_risk >= 0.7 THEN 'High'
          WHEN churn_risk >= 0.4 THEN 'Medium'
          ELSE 'Low'
        END as risk_level,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customers), 2) as percentage
      FROM customers 
      WHERE churn_risk IS NOT NULL
      GROUP BY 
        CASE 
          WHEN churn_risk >= 0.7 THEN 'High'
          WHEN churn_risk >= 0.4 THEN 'Medium'
          ELSE 'Low'
        END
      ORDER BY count DESC
    `);
    
    const verify = verifyResult.rows[0];
    console.log(`📊 Final status:`);
    console.log(`   - Total customers: ${verify.total_customers}`);
    console.log(`   - With segment: ${verify.with_segment} (${Math.round(verify.with_segment/verify.total_customers*100)}%)`);
    console.log(`   - With churn_risk: ${verify.with_churn_risk} (${Math.round(verify.with_churn_risk/verify.total_customers*100)}%)`);
    console.log(`   - Null segment: ${verify.null_segment}`);
    console.log(`   - Null churn_risk: ${verify.null_churn_risk}`);
    
    console.log(`\n📋 Segment distribution:`);
    segmentStats.rows.forEach(row => {
      console.log(`   - ${row.segment}: ${row.count} customers (${row.percentage}%) - Avg churn: ${(parseFloat(row.avg_churn_risk) * 100).toFixed(1)}%`);
    });
    
    console.log(`\n📊 Risk level distribution:`);
    riskStats.rows.forEach(row => {
      console.log(`   - ${row.risk_level}: ${row.count} customers (${row.percentage}%)`);
    });
    
    // Show sample customers
    const sampleResult = await client.query(`
      SELECT 
        customer_id,
        full_name,
        segment,
        churn_risk,
        CASE 
          WHEN churn_risk >= 0.7 THEN 'High'
          WHEN churn_risk >= 0.4 THEN 'Medium'
          ELSE 'Low'
        END as risk_level,
        account_balance
      FROM customers 
      WHERE segment IS NOT NULL AND churn_risk IS NOT NULL
      ORDER BY churn_risk DESC
      LIMIT 5
    `);
    
    console.log(`\n🎯 Top 5 high-risk customers:`);
    sampleResult.rows.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.full_name} (${customer.customer_id})`);
      console.log(`      Segment: ${customer.segment}`);
      console.log(`      Churn Risk: ${(parseFloat(customer.churn_risk) * 100).toFixed(1)}%`);
      console.log(`      Risk Level: ${customer.risk_level}`);
      console.log(`      Balance: ${parseFloat(customer.account_balance).toLocaleString()} RWF`);
    });
    
    console.log('\n✅ Segment and churn_risk population completed successfully!');
    
  } catch (error) {
    console.error('❌ Error populating segment and churn_risk:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the population script
populateSegmentAndChurnRisk()
  .then(() => {
    console.log('\n🎉 All segment and churn_risk data is now complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Population failed:', error);
    process.exit(1);
  });
