// BK Pulse System Integration Service
// Handles integration with Recommender Engine, CRM, and Telephony systems

import { config } from '../config/environment.js';

class SystemIntegrationService {
  constructor() {
    // Use environment configuration with safe defaults
    this.baseURL = config.apiUrl;
    this.recommenderURL = config.recommenderUrl;
    this.crmURL = config.crmUrl;
    this.telephonyURL = config.telephonyUrl;
  }

  // ==================== RECOMMENDER ENGINE INTEGRATION ====================
  
  /**
   * Retrieve qualified leads from the Recommender Engine
   * @param {Object} filters - Filter criteria for leads
   * @returns {Promise<Array>} Array of qualified leads
   */
  async getQualifiedLeads(filters = {}) {
    try {
      const response = await fetch(`${this.recommenderURL}/leads/qualified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          filters: {
            segment: filters.segment || 'all',
            priority: filters.priority || 'all',
            risk_level: filters.riskLevel || 'all',
            last_contact: filters.lastContact || '30d',
            ...filters
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Recommender Engine error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.leads || [];
    } catch (error) {
      console.error('Failed to retrieve qualified leads:', error);
      // Return mock data for development
      return this.getMockQualifiedLeads();
    }
  }

  /**
   * Get AI recommendations for specific customer
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} AI recommendations
   */
  async getCustomerRecommendations(customerId) {
    try {
      const response = await fetch(`${this.recommenderURL}/recommendations/${customerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Recommendation error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get customer recommendations:', error);
      return this.getMockRecommendations(customerId);
    }
  }

  // ==================== CRM INTEGRATION ====================
  
  /**
   * Display customer information from CRM
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Customer information
   */
  async getCustomerInfo(customerId) {
    try {
      const response = await fetch(`${this.crmURL}/customers/${customerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`CRM error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return this.getMockCustomerInfo(customerId);
    }
  }

  /**
   * Record customer interaction in CRM
   * @param {Object} interaction - Interaction data
   * @returns {Promise<Object>} Recorded interaction
   */
  async recordInteraction(interaction) {
    try {
      const response = await fetch(`${this.crmURL}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          customer_id: interaction.customerId,
          agent_id: interaction.agentId,
          interaction_type: interaction.type,
          outcome: interaction.outcome,
          notes: interaction.notes,
          timestamp: new Date().toISOString(),
          duration: interaction.duration,
          products_discussed: interaction.products || [],
          next_action: interaction.nextAction
        })
      });

      if (!response.ok) {
        throw new Error(`CRM interaction error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to record interaction:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get assigned sales tasks for agent
   * @param {string} agentId - Agent ID
   * @returns {Promise<Array>} Assigned tasks
   */
  async getAssignedTasks(agentId) {
    try {
      const response = await fetch(`${this.crmURL}/tasks/agent/${agentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`CRM tasks error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get assigned tasks:', error);
      return this.getMockTasks(agentId);
    }
  }

  // ==================== TELEPHONY INTEGRATION ====================
  
  /**
   * Initiate call to client
   * @param {string} phoneNumber - Client phone number
   * @param {string} agentId - Agent ID
   * @returns {Promise<Object>} Call initiation result
   */
  async initiateCall(phoneNumber, agentId) {
    try {
      const response = await fetch(`${this.telephonyURL}/calls/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          agent_id: agentId,
          call_type: 'retention',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Telephony error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to initiate call:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get call metrics for agent
   * @param {string} agentId - Agent ID
   * @param {string} period - Time period (today, week, month)
   * @returns {Promise<Object>} Call metrics
   */
  async getCallMetrics(agentId, period = 'today') {
    try {
      const response = await fetch(`${this.telephonyURL}/metrics/${agentId}?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Telephony metrics error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get call metrics:', error);
      return this.getMockCallMetrics(agentId, period);
    }
  }

  /**
   * End call and record metrics
   * @param {string} callId - Call ID
   * @param {Object} callData - Call data
   * @returns {Promise<Object>} Call end result
   */
  async endCall(callId, callData) {
    try {
      const response = await fetch(`${this.telephonyURL}/calls/${callId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          duration: callData.duration,
          outcome: callData.outcome,
          notes: callData.notes,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Telephony end call error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to end call:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== MOCK DATA FOR DEVELOPMENT ====================
  
  getMockQualifiedLeads() {
    return [
      {
        id: 'LEAD-001',
        customer_id: 'CUST-001234',
        customer_name: 'Marie Uwimana',
        phone: '+250 789 456 789',
        segment: 'Gold',
        risk_score: 85,
        priority: 'High',
        reason: 'Churn Risk - High Balance',
        recommended_action: 'Offer Aguka investment plan',
        last_contact: '2024-01-10',
        next_best_time: '14:30'
      },
      {
        id: 'LEAD-002',
        customer_id: 'CUST-001235',
        customer_name: 'Francine Mutoni',
        phone: '+250 788 234 567',
        segment: 'Silver',
        risk_score: 65,
        priority: 'Medium',
        reason: 'Product Cross-sell Opportunity',
        recommended_action: 'Offer Tekana savings plan',
        last_contact: '2024-01-12',
        next_best_time: '15:00'
      }
    ];
  }

  getMockRecommendations(customerId) {
    return {
      customer_id: customerId,
      recommendations: [
        {
          type: 'Product',
          product: 'Aguka Investment Plan',
          confidence: 0.85,
          reason: 'High savings balance detected'
        },
        {
          type: 'Timing',
          best_time: '14:30',
          reason: 'Customer preference data'
        },
        {
          type: 'Approach',
          strategy: 'Personalized service focus',
          reason: 'Previous interaction history'
        }
      ]
    };
  }

  getMockCustomerInfo(customerId) {
    return {
      id: customerId,
      name: 'Marie Uwimana',
      phone: '+250 789 456 789',
      email: 'marie.uwimana@email.com',
      segment: 'Gold',
      total_balance: 2500000,
      products: ['Savings Account', 'Current Account'],
      last_interaction: '2024-01-10',
      risk_score: 85,
      notes: 'High-value customer, interested in investment products'
    };
  }

  getMockTasks(agentId) {
    return [
      {
        id: 'TASK-001',
        customer_id: 'CUST-001234',
        customer_name: 'Marie Uwimana',
        task_type: 'Retention Call',
        priority: 'High',
        due_date: '2024-01-15',
        status: 'Pending',
        description: 'Follow up on Aguka investment offer'
      },
      {
        id: 'TASK-002',
        customer_id: 'CUST-001235',
        customer_name: 'Francine Mutoni',
        task_type: 'Cross-sell',
        priority: 'Medium',
        due_date: '2024-01-16',
        status: 'Pending',
        description: 'Present Tekana savings plan'
      }
    ];
  }

  getMockCallMetrics(agentId, period) {
    return {
      agent_id: agentId,
      period: period,
      total_calls: 23,
      connected_calls: 18,
      successful_calls: 15,
      average_duration: '4:32',
      conversion_rate: 0.83,
      customer_satisfaction: 4.2
    };
  }

  // ==================== UTILITY METHODS ====================
  
  getAuthToken() {
    return localStorage.getItem('bk_pulse_auth_token') || 'mock-token';
  }

  setAuthToken(token) {
    localStorage.setItem('bk_pulse_auth_token', token);
  }

  clearAuthToken() {
    localStorage.removeItem('bk_pulse_auth_token');
  }
}

// Export singleton instance
export const systemIntegration = new SystemIntegrationService();
export default systemIntegration;
