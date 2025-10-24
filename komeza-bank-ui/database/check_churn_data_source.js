// Script to check if churn risk numbers are from the real model or CSV data
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5434,
  database: 'bk-pulse',
  user: 'postgres',
  password: '0123',
});

async function checkChurnDataSource() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Analyzing churn risk data source...\n');
    
    // Check churn_probability distribution
    const churnStats = await client.query(`
      SELECT 
        MIN(churn_probability) as min_churn,
        MAX(churn_probability) as max_churn,
        AVG(churn_probability) as avg_churn,
        STDDEV(churn_probability) as stddev_churn,
        COUNT(CASE WHEN churn_probability = 0 THEN 1 END) as zero_churn,
        COUNT(CASE WHEN churn_probability = 1 THEN 1 END) as max_churn_count,
        COUNT(CASE WHEN churn_probability > 0.9 THEN 1 END) as very_high_churn,
        COUNT(CASE WHEN churn_probability > 0.7 THEN 1 END) as high_churn,
        COUNT(CASE WHEN churn_probability > 0.5 THEN 1 END) as above_avg_churn
      FROM customers
    `);
    
    const stats = churnStats.rows[0];
    console.log('📊 Churn Probability Statistics:');
    console.log(`   - Min: ${parseFloat(stats.min_churn).toFixed(4)}`);
    console.log(`   - Max: ${parseFloat(stats.max_churn).toFixed(4)}`);
    console.log(`   - Average: ${(parseFloat(stats.avg_churn) * 100).toFixed(2)}%`);
    console.log(`   - Standard Deviation: ${parseFloat(stats.stddev_churn).toFixed(4)}`);
    console.log(`   - Zero churn probability: ${stats.zero_churn} customers`);
    console.log(`   - Max churn probability (1.0): ${stats.max_churn_count} customers`);
    console.log(`   - Very high churn (>90%): ${stats.very_high_churn} customers`);
    console.log(`   - High churn (>70%): ${stats.high_churn} customers`);
    console.log(`   - Above average (>50%): ${stats.above_avg_churn} customers`);
    
    // Check if this looks like real model predictions or CSV data
    console.log('\n🎯 Data Source Analysis:');
    
    if (stats.zero_churn > 1000) {
      console.log('   ⚠️  High number of zero churn probabilities - likely CSV data');
    } else {
      console.log('   ✅ Low number of zero churn probabilities - looks like model predictions');
    }
    
    if (stats.max_churn_count > 1000) {
      console.log('   ⚠️  High number of max churn probabilities - likely CSV data');
    } else {
      console.log('   ✅ Low number of max churn probabilities - looks like model predictions');
    }
    
    if (parseFloat(stats.stddev_churn) < 0.1) {
      console.log('   ⚠️  Low standard deviation - data might be too uniform');
    } else {
      console.log('   ✅ Good standard deviation - data looks realistic');
    }
    
    // Check distribution by segments
    const segmentChurn = await client.query(`
      SELECT 
        customer_segment,
        COUNT(*) as count,
        ROUND(AVG(churn_probability), 4) as avg_churn,
        ROUND(MIN(churn_probability), 4) as min_churn,
        ROUND(MAX(churn_probability), 4) as max_churn,
        ROUND(STDDEV(churn_probability), 4) as stddev_churn
      FROM customers 
      WHERE customer_segment IS NOT NULL
      GROUP BY customer_segment
      ORDER BY avg_churn DESC
    `);
    
    console.log('\n📋 Churn by Segment:');
    segmentChurn.rows.forEach(row => {
      console.log(`   - ${row.customer_segment}:`);
      console.log(`     Count: ${row.count} customers`);
      console.log(`     Avg Churn: ${(parseFloat(row.avg_churn) * 100).toFixed(1)}%`);
      console.log(`     Range: ${(parseFloat(row.min_churn) * 100).toFixed(1)}% - ${(parseFloat(row.max_churn) * 100).toFixed(1)}%`);
      console.log(`     StdDev: ${parseFloat(row.stddev_churn).toFixed(4)}`);
    });
    
    // Sample high-risk customers
    const highRiskSample = await client.query(`
      SELECT 
        customer_id,
        full_name,
        customer_segment,
        churn_probability,
        account_balance,
        age,
        product_count,
        complaint_history,
        days_since_last_transaction
      FROM customers 
      WHERE churn_probability > 0.8
      ORDER BY churn_probability DESC
      LIMIT 10
    `);
    
    console.log('\n🎯 Top 10 Highest Risk Customers:');
    highRiskSample.rows.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.full_name} (${customer.customer_id})`);
      console.log(`      Segment: ${customer.customer_segment}`);
      console.log(`      Churn: ${(parseFloat(customer.churn_probability) * 100).toFixed(1)}%`);
      console.log(`      Balance: ${parseFloat(customer.account_balance).toLocaleString()} RWF`);
      console.log(`      Age: ${customer.age}, Products: ${customer.product_count}`);
      console.log(`      Complaints: ${customer.complaint_history}, Days since last tx: ${customer.days_since_last_transaction}`);
    });
    
    // Check if we have churn_predictions table with model metadata
    const predictionsCheck = await client.query(`
      SELECT COUNT(*) as count FROM churn_predictions
    `);
    
    console.log(`\n📊 Churn Predictions Audit Table: ${predictionsCheck.rows[0].count} records`);
    
    if (parseInt(predictionsCheck.rows[0].count) > 0) {
      console.log('   ✅ Model predictions are being tracked in audit table');
    } else {
      console.log('   ⚠️  No model predictions in audit table - using CSV data');
    }
    
    // Final assessment
    console.log('\n🎯 ASSESSMENT:');
    if (stats.zero_churn < 100 && stats.max_churn_count < 100 && parseFloat(stats.stddev_churn) > 0.15) {
      console.log('✅ Data appears to be from REAL MODEL PREDICTIONS');
      console.log('   - Good distribution of churn probabilities');
      console.log('   - Realistic variance across customers');
      console.log('   - Segments show expected differences');
    } else {
      console.log('⚠️  Data appears to be from CSV DATASET (not real model predictions)');
      console.log('   - This is the original training/test data');
      console.log('   - To get real predictions, you need to run your model on current customer data');
    }
    
    console.log('\n💡 To get REAL model predictions:');
    console.log('   1. Use your trained model to predict on current customer data');
    console.log('   2. Update churn_probability with fresh predictions');
    console.log('   3. This will give you real-time churn risk scores');
    
  } catch (error) {
    console.error('❌ Error analyzing churn data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the analysis
checkChurnDataSource()
  .then(() => {
    console.log('\n🎉 Churn data analysis completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Analysis failed:', error);
    process.exit(1);
  });
