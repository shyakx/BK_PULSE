// Script to populate missing email, phone, and segment data with realistic values
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5434,
  database: 'bk-pulse',
  user: 'postgres',
  password: '0123',
});

// Realistic email domains for Rwanda
const EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'rwandatel.rw', 'mtn.rw', 'airtel.rw', 'kigali.rw',
  'umutara.rw', 'butare.rw', 'gisenyi.rw', 'ruhengeri.rw'
];

// Phone number prefixes for Rwanda
const PHONE_PREFIXES = ['+250788', '+250789', '+250780', '+250781', '+250782', '+250783'];

// Customer segments with realistic distribution
const SEGMENT_DISTRIBUTION = {
  'Retail': 0.72,      // 72% - Most customers are retail
  'SME': 0.18,         // 18% - Small and medium enterprises
  'Corporate': 0.07,   // 7% - Large corporations
  'Institutional': 0.03 // 3% - Government and institutions
};

// Generate realistic email based on customer name and ID
function generateEmail(fullName, customerId) {
  const name = fullName.toLowerCase().replace(/\s+/g, '');
  const domain = EMAIL_DOMAINS[parseInt(customerId) % EMAIL_DOMAINS.length];
  return `${name}${customerId.slice(-3)}@${domain}`;
}

// Generate realistic phone number based on customer ID
function generatePhone(customerId) {
  const prefix = PHONE_PREFIXES[parseInt(customerId) % PHONE_PREFIXES.length];
  const suffix = String(parseInt(customerId) % 1000000).padStart(6, '0');
  return `${prefix}${suffix}`;
}

// Generate realistic segment based on customer data
function generateSegment(customerId, accountBalance, productCount) {
  const random = (parseInt(customerId) % 100) / 100;
  
  // Higher balance customers more likely to be Corporate/Institutional
  if (accountBalance > 50000000 && random < 0.15) {
    return random < 0.05 ? 'Institutional' : 'Corporate';
  }
  
  // More products = more likely to be SME
  if (productCount > 3 && random < 0.25) {
    return 'SME';
  }
  
  // Default distribution
  let cumulative = 0;
  for (const [segment, probability] of Object.entries(SEGMENT_DISTRIBUTION)) {
    cumulative += probability;
    if (random <= cumulative) {
      return segment;
    }
  }
  
  return 'Retail'; // Fallback
}

async function populateMissingData() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Populating missing customer data...\n');
    
    // Get all customers with missing data
    const customersResult = await client.query(`
      SELECT 
        id,
        customer_id,
        full_name,
        account_balance,
        product_count,
        email,
        phone,
        customer_segment
      FROM customers 
      WHERE email IS NULL OR phone IS NULL OR customer_segment IS NULL
      ORDER BY id
    `);
    
    console.log(`📊 Found ${customersResult.rows.length} customers with missing data`);
    
    if (customersResult.rows.length === 0) {
      console.log('✅ All customers already have complete data!');
      return;
    }
    
    // Process customers in batches
    const batchSize = 1000;
    let processed = 0;
    
    for (let i = 0; i < customersResult.rows.length; i += batchSize) {
      const batch = customersResult.rows.slice(i, i + batchSize);
      
      console.log(`📝 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(customersResult.rows.length/batchSize)}...`);
      
      for (const customer of batch) {
        const email = customer.email || generateEmail(customer.full_name, customer.customer_id);
        const phone = customer.phone || generatePhone(customer.customer_id);
        const segment = customer.customer_segment || generateSegment(
          customer.customer_id, 
          customer.account_balance, 
          customer.product_count
        );
        
        await client.query(`
          UPDATE customers 
          SET 
            email = $1,
            phone = $2,
            customer_segment = $3,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $4
        `, [email, phone, segment, customer.id]);
      }
      
      processed += batch.length;
      console.log(`   ✅ Updated ${processed}/${customersResult.rows.length} customers (${Math.round(processed/customersResult.rows.length*100)}%)`);
    }
    
    // Verify the results
    console.log('\n🔍 Verifying updated data...');
    
    const statsResult = await client.query(`
      SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as with_email,
        COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as with_phone,
        COUNT(CASE WHEN customer_segment IS NOT NULL THEN 1 END) as with_segment
      FROM customers
    `);
    
    const segmentStats = await client.query(`
      SELECT 
        customer_segment,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customers), 2) as percentage
      FROM customers 
      WHERE customer_segment IS NOT NULL
      GROUP BY customer_segment
      ORDER BY count DESC
    `);
    
    const stats = statsResult.rows[0];
    console.log(`📊 Data completeness:`);
    console.log(`   - Total customers: ${stats.total_customers}`);
    console.log(`   - With email: ${stats.with_email} (${Math.round(stats.with_email/stats.total_customers*100)}%)`);
    console.log(`   - With phone: ${stats.with_phone} (${Math.round(stats.with_phone/stats.total_customers*100)}%)`);
    console.log(`   - With segment: ${stats.with_segment} (${Math.round(stats.with_segment/stats.total_customers*100)}%)`);
    
    console.log(`\n📋 Customer segments:`);
    segmentStats.rows.forEach(row => {
      console.log(`   - ${row.customer_segment}: ${row.count} customers (${row.percentage}%)`);
    });
    
    // Show sample customers
    const sampleResult = await client.query(`
      SELECT 
        customer_id,
        full_name,
        email,
        phone,
        customer_segment,
        account_balance
      FROM customers 
      WHERE email IS NOT NULL AND phone IS NOT NULL AND customer_segment IS NOT NULL
      ORDER BY RANDOM()
      LIMIT 5
    `);
    
    console.log(`\n🎯 Sample customers with complete data:`);
    sampleResult.rows.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.full_name} (${customer.customer_id})`);
      console.log(`      Email: ${customer.email}`);
      console.log(`      Phone: ${customer.phone}`);
      console.log(`      Segment: ${customer.customer_segment}`);
      console.log(`      Balance: ${parseFloat(customer.account_balance).toLocaleString()} RWF`);
    });
    
    console.log('\n✅ Customer data population completed successfully!');
    
  } catch (error) {
    console.error('❌ Error populating missing data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the population script
populateMissingData()
  .then(() => {
    console.log('\n🎉 All customer data is now complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Population failed:', error);
    process.exit(1);
  });
