// Script to analyze existing database tables and show their structure
import { Pool } from 'pg';

// Database connection using your existing configuration
const pool = new Pool({
  host: 'localhost',
  port: 5434,
  database: 'bk-pulse',
  user: 'postgres',
  password: '0123',
});

async function analyzeExistingTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Analyzing existing database tables...\n');
    
    // Get all table names
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Found tables:', tablesResult.rows.map(row => row.table_name).join(', '));
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Analyze each table
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      console.log(`📊 Table: ${tableName.toUpperCase()}`);
      console.log('-'.repeat(50));
      
      // Get column information
      const columnsResult = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [tableName]);
      
      if (columnsResult.rows.length === 0) {
        console.log('   No columns found\n');
        continue;
      }
      
      // Display columns
      columnsResult.rows.forEach((col, index) => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const maxLength = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        const defaultValue = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        
        console.log(`   ${index + 1}. ${col.column_name.padEnd(25)} ${col.data_type}${maxLength} ${nullable}${defaultValue}`);
      });
      
      // Get row count
      const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`   📈 Rows: ${countResult.rows[0].count}`);
      
      // Get sample data (first 3 rows)
      if (parseInt(countResult.rows[0].count) > 0) {
        console.log('   📝 Sample data:');
        const sampleResult = await client.query(`SELECT * FROM ${tableName} LIMIT 3`);
        sampleResult.rows.forEach((row, index) => {
          console.log(`      Row ${index + 1}:`, Object.keys(row).slice(0, 5).map(key => `${key}=${row[key]}`).join(', '));
        });
      }
      
      console.log('\n' + '='.repeat(80) + '\n');
    }
    
    // Check if we need to create additional tables for churn prediction
    console.log('🎯 CHURN PREDICTION SYSTEM REQUIREMENTS:');
    console.log('We need these tables for the churn prediction system:');
    console.log('1. customers - Main customer data with churn predictions');
    console.log('2. customer_interactions - Customer touchpoints and outcomes');
    console.log('3. churn_predictions - Audit trail for predictions');
    console.log('4. retention_campaigns - Campaign management');
    
    console.log('\n📋 RECOMMENDED ACTIONS:');
    console.log('1. Check if existing "customers" table has churn-related columns');
    console.log('2. Add missing columns if needed');
    console.log('3. Create additional tables for interactions and campaigns');
    console.log('4. Migrate CSV data to the customers table');
    
  } catch (error) {
    console.error('❌ Error analyzing tables:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the analysis
analyzeExistingTables()
  .then(() => {
    console.log('✅ Analysis completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
