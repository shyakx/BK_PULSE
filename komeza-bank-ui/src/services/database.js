// PostgreSQL Database Service
import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
  host: process.env.VITE_DB_HOST || 'localhost',
  port: process.env.VITE_DB_PORT || 5434,
  database: process.env.VITE_DB_NAME || 'bk-pulse',
  user: process.env.VITE_DB_USER || 'postgres',
  password: process.env.VITE_DB_PASSWORD || 'password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Customer database operations
export class CustomerDatabase {
  
  // Get customer by ID
  static async getCustomerById(customerId) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT * FROM customers WHERE customer_id = $1',
        [customerId]
      );
      client.release();
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching customer by ID:', error);
      throw error;
    }
  }

  // Search customers by name or ID
  static async searchCustomers(query, limit = 10) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        `SELECT * FROM customers 
         WHERE customer_name ILIKE $1 OR customer_id ILIKE $1 
         ORDER BY churn_probability DESC 
         LIMIT $2`,
        [`%${query}%`, limit]
      );
      client.release();
      return result.rows;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  // Get customers by segment
  static async getCustomersBySegment(segment, limit = 50) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT * FROM customers WHERE customer_segment = $1 ORDER BY churn_probability DESC LIMIT $2',
        [segment, limit]
      );
      client.release();
      return result.rows;
    } catch (error) {
      console.error('Error fetching customers by segment:', error);
      throw error;
    }
  }

  // Get high-risk customers
  static async getHighRiskCustomers(limit = 20) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT * FROM customers WHERE churn_probability > 0.6 ORDER BY churn_probability DESC LIMIT $1',
        [limit]
      );
      client.release();
      return result.rows;
    } catch (error) {
      console.error('Error fetching high-risk customers:', error);
      throw error;
    }
  }

  // Get customer statistics
  static async getCustomerStats() {
    try {
      const client = await pool.connect();
      
      // Get total customers and average churn probability
      const totalResult = await client.query(`
        SELECT 
          COUNT(*) as total,
          AVG(churn_probability) as average_churn_probability,
          SUM(account_balance) as total_balance
        FROM customers
      `);

      // Get customers by segment
      const segmentResult = await client.query(`
        SELECT 
          customer_segment,
          COUNT(*) as count
        FROM customers 
        GROUP BY customer_segment
      `);

      // Get customers by risk level
      const riskResult = await client.query(`
        SELECT 
          CASE 
            WHEN churn_probability >= 0.7 THEN 'high'
            WHEN churn_probability >= 0.4 THEN 'medium'
            ELSE 'low'
          END as risk_level,
          COUNT(*) as count
        FROM customers 
        GROUP BY 
          CASE 
            WHEN churn_probability >= 0.7 THEN 'high'
            WHEN churn_probability >= 0.4 THEN 'medium'
            ELSE 'low'
          END
      `);

      client.release();

      const stats = {
        total: parseInt(totalResult.rows[0].total),
        averageChurnProbability: parseFloat(totalResult.rows[0].average_churn_probability),
        totalBalance: parseFloat(totalResult.rows[0].total_balance),
        bySegment: {},
        byRisk: { high: 0, medium: 0, low: 0 }
      };

      // Process segment data
      segmentResult.rows.forEach(row => {
        stats.bySegment[row.customer_segment] = parseInt(row.count);
      });

      // Process risk data
      riskResult.rows.forEach(row => {
        stats.byRisk[row.risk_level] = parseInt(row.count);
      });

      return stats;
    } catch (error) {
      console.error('Error fetching customer statistics:', error);
      throw error;
    }
  }

  // Get customers with pagination
  static async getCustomers(page = 1, limit = 50, filters = {}) {
    try {
      const client = await pool.connect();
      const offset = (page - 1) * limit;
      
      let whereClause = 'WHERE 1=1';
      const params = [];
      let paramCount = 0;

      if (filters.segment) {
        paramCount++;
        whereClause += ` AND customer_segment = $${paramCount}`;
        params.push(filters.segment);
      }

      if (filters.riskLevel) {
        paramCount++;
        if (filters.riskLevel === 'high') {
          whereClause += ` AND churn_probability >= 0.7`;
        } else if (filters.riskLevel === 'medium') {
          whereClause += ` AND churn_probability >= 0.4 AND churn_probability < 0.7`;
        } else if (filters.riskLevel === 'low') {
          whereClause += ` AND churn_probability < 0.4`;
        }
      }

      if (filters.search) {
        paramCount++;
        whereClause += ` AND (customer_name ILIKE $${paramCount} OR customer_id ILIKE $${paramCount})`;
        params.push(`%${filters.search}%`);
      }

      paramCount++;
      params.push(limit);
      paramCount++;
      params.push(offset);

      const result = await client.query(`
        SELECT * FROM customers 
        ${whereClause}
        ORDER BY churn_probability DESC 
        LIMIT $${paramCount - 1} OFFSET $${paramCount}
      `, params);

      // Get total count for pagination
      const countResult = await client.query(`
        SELECT COUNT(*) as total FROM customers ${whereClause}
      `, params.slice(0, -2)); // Remove limit and offset params

      client.release();

      return {
        customers: result.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
      };
    } catch (error) {
      console.error('Error fetching customers with pagination:', error);
      throw error;
    }
  }

  // Update customer churn prediction
  static async updateChurnPrediction(customerId, churnProbability, riskLevel) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE customers SET churn_probability = $1, risk_level = $2, updated_at = NOW() WHERE customer_id = $3 RETURNING *',
        [churnProbability, riskLevel, customerId]
      );
      client.release();
      return result.rows[0];
    } catch (error) {
      console.error('Error updating churn prediction:', error);
      throw error;
    }
  }

  // Add customer interaction
  static async addInteraction(customerId, interactionType, notes, outcome) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO customer_interactions (customer_id, interaction_type, notes, outcome, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [customerId, interactionType, notes, outcome]
      );
      client.release();
      return result.rows[0];
    } catch (error) {
      console.error('Error adding customer interaction:', error);
      throw error;
    }
  }

  // Get customer interactions
  static async getCustomerInteractions(customerId, limit = 10) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT * FROM customer_interactions WHERE customer_id = $1 ORDER BY created_at DESC LIMIT $2',
        [customerId, limit]
      );
      client.release();
      return result.rows;
    } catch (error) {
      console.error('Error fetching customer interactions:', error);
      throw error;
    }
  }
}

// Close the pool when the application shuts down
process.on('SIGINT', () => {
  pool.end();
});

export default pool;
