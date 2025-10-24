// Enhanced API aligned with SDD specifications and Data Architecture requirements

// Authentication & Authorization (SDD: OAuth2/JWT)
export type AuthResponse = {
  token: string;
  user: { email: string; role: string };
  expires_in: number;
};

// Score Summary (SDD: Enhanced dashboard metrics)
export type ScoreSummary = {
  totals: { customers: number; churn_rate: number; high: number; medium: number; low: number };
  by_segment: Array<{ segment: string; customers: number; churn_rate: number }>;
  by_branch: Array<{ branch_id: string; customers: number; churn_rate: number }>;
};

// Alert System (SDD: Enhanced alerting with status tracking)
export type AlertItem = {
  id: string;
  customer_id: string;
  risk: 'High' | 'Medium' | 'Low';
  reason: string;
  segment: string;
  branch_id: string;
  created_at: string;
  status: 'New' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
};

// Customer Score (SDD: GET /api/v1/score/{customer_id})
export type ScoreDetail = {
  customer_id: string;
  score: number;
  risk: 'High' | 'Medium' | 'Low';
  as_of: string;
  top_drivers: Array<{ feature: string; impact: number }>;
  recommendations: Array<{ action: string; rationale?: string }>;
};

// Model Status (SDD: GET /api/v1/model/status)
export type ModelStatus = {
  model_version: string;
  auc: number;
  trained_on: string;
  drift: number;
  data_freshness_hours: number;
};

// Batch Scoring (SDD: POST /api/v1/score/batch)
export type BatchJobResponse = {
  job_id: string;
  status: 'started' | 'running' | 'completed' | 'failed';
  estimated_completion: string;
};

// Data Quality Metrics (Data Architecture compliance)
export type DataQualityMetrics = {
  overall_score: number;
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  validity: number;
};

// Export Response (SDD: Enhanced export with audit trail)
export type ExportResponse = {
  file_id: string;
  download_url: string;
  expires_at: string;
  audit_id: string;
};

// Audit Log (Data Architecture: Audit trail requirements)
export type AuditLog = {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
};

// Data Lineage (Data Architecture: Lineage tracking)
export type DataLineage = {
  customer_id: string;
  sources: string[];
  last_updated: string;
  transformations: string[];
  data_owner: string;
};

// Real data will be loaded from customerDatabase
let realSummary: ScoreSummary | null = null;

const mockAlerts: AlertItem[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `A${1000 + i}`,
  customer_id: `C${1000 + i}`,
  risk: 'High',
  reason: i % 2 ? 'No transactions in 30 days' : 'Multiple complaints',
  segment: i % 3 === 0 ? 'retail' : 'sme',
  branch_id: i % 2 ? 'BR01' : 'BR02',
  created_at: new Date(Date.now() - i * 3600_000).toISOString(),
}));

const mockModel: ModelStatus = {
  model_version: 'v1.2.0',
  auc: 0.87,
  trained_on: '2025-09-15',
  drift: 0.03,
  data_freshness_hours: 6,
};

// Enhanced API implementation aligned with SDD specifications
export const api = {
  // Authentication (SDD: OAuth2/JWT)
  async authenticate(email: string, password: string): Promise<AuthResponse> {
    await delay(500);
    return {
      token: `jwt_${Date.now()}`,
      user: { email, role: 'agent' },
      expires_in: 3600
    };
  },

  // Score Summary (SDD: Enhanced dashboard metrics)
  async getScoreSummary(): Promise<ScoreSummary> {
    await delay(200);
    
    // Load real data if not already loaded
    if (!realSummary) {
      try {
        const { getCustomerStats } = await import('./customerDatabase.js');
        const stats = await getCustomerStats();
        
        realSummary = {
          totals: {
            customers: stats.total,
            churn_rate: stats.averageChurnProbability,
            high: stats.byRisk.high,
            medium: stats.byRisk.medium,
            low: stats.byRisk.low
          },
          by_segment: Object.entries(stats.bySegment).map(([segment, count]) => ({
            segment: segment.toLowerCase(),
            customers: count,
            churn_rate: stats.averageChurnProbability
          })),
          by_branch: [
            { branch_id: 'BR01', customers: Math.floor(stats.total * 0.3), churn_rate: stats.averageChurnProbability },
            { branch_id: 'BR02', customers: Math.floor(stats.total * 0.25), churn_rate: stats.averageChurnProbability },
            { branch_id: 'BR03', customers: Math.floor(stats.total * 0.25), churn_rate: stats.averageChurnProbability },
            { branch_id: 'BR04', customers: Math.floor(stats.total * 0.2), churn_rate: stats.averageChurnProbability }
          ]
        };
      } catch (error) {
        console.error('Failed to load real data, using fallback:', error);
        // Fallback to mock data if real data fails
        realSummary = {
          totals: { customers: 13000, churn_rate: 0.032, high: 1247, medium: 3456, low: 8297 },
          by_segment: [
            { segment: 'retail', customers: 8560, churn_rate: 0.035 },
            { segment: 'sme', customers: 2340, churn_rate: 0.028 },
            { segment: 'corporate', customers: 1570, churn_rate: 0.018 },
          ],
          by_branch: [
            { branch_id: 'BR01', customers: 1200, churn_rate: 0.031 },
            { branch_id: 'BR02', customers: 980, churn_rate: 0.029 },
          ],
        };
      }
    }
    
    return realSummary;
  },

  // Alerts (SDD: Enhanced alerting with status tracking)
  async getAlerts(limit = 10, risk?: string): Promise<AlertItem[]> {
    await delay(150);
    let filteredAlerts = mockAlerts.slice(0, limit);
    if (risk) {
      filteredAlerts = filteredAlerts.filter(alert => alert.risk.toLowerCase() === risk.toLowerCase());
    }
    return filteredAlerts;
  },

  // Model Status (SDD: GET /api/v1/model/status)
  async getModelStatus(): Promise<ModelStatus> {
    await delay(120);
    return mockModel;
  },

  // Customer Score (SDD: GET /api/v1/score/{customer_id})
  async getScore(customerId: string): Promise<ScoreDetail> {
    await delay(180);
    return {
      customer_id: customerId,
      score: 0.78,
      risk: 'High',
      as_of: new Date().toISOString().slice(0, 10),
      top_drivers: [
        { feature: 'days_since_last_txn', impact: 0.22 },
        { feature: 'digital_logins_3mo', impact: -0.15 },
        { feature: 'complaints_count_6mo', impact: 0.11 },
      ],
      recommendations: [
        { action: 'Proactive call within 48h', rationale: 'High inactivity' },
        { action: 'Offer fee waiver for next month' },
      ],
    };
  },

  // Batch Scoring (SDD: POST /api/v1/score/batch)
  async triggerBatchScoring(segment: string, date: string): Promise<BatchJobResponse> {
    await delay(1000);
    return {
      job_id: `job_${Date.now()}`,
      status: 'started',
      estimated_completion: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };
  },

  // Data Quality Metrics (Data Architecture compliance)
  async getDataQualityMetrics(): Promise<DataQualityMetrics> {
    await delay(300);
    return {
      overall_score: 0.87,
      completeness: 0.92,
      accuracy: 0.89,
      consistency: 0.85,
      timeliness: 0.88,
      validity: 0.91
    };
  },

  // Export (SDD: Enhanced export with audit trail)
  async exportView(format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<ExportResponse> {
    await delay(1000);
    return {
      file_id: `export_${Date.now()}`,
      download_url: `/downloads/export_${Date.now()}.${format}`,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      audit_id: `audit_${Date.now()}`
    };
  },

  // Feedback (SDD: POST /api/v1/feedback)
  async sendFeedback(customerId: string, action: string, outcomeDate: string): Promise<void> {
    await delay(120);
    console.log(`Feedback recorded: ${customerId} - ${action} - ${outcomeDate}`);
  },

  // Audit Log (Data Architecture: Audit trail requirements)
  async getAuditLog(userId: string, dateRange: { start: string, end: string }): Promise<AuditLog[]> {
    await delay(400);
    return Array.from({ length: 10 }, (_, i) => ({
      id: `audit_${Date.now()}_${i}`,
      user_id: userId,
      action: ['view', 'export', 'score', 'feedback'][i % 4],
      resource: `customer_${1000 + i}`,
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      ip_address: `192.168.1.${100 + i}`,
      user_agent: 'BK-Pulse-Platform/1.0'
    }));
  },

  // Data Lineage (Data Architecture: Lineage tracking)
  async getDataLineage(customerId: string): Promise<DataLineage> {
    await delay(300);
    return {
      customer_id: customerId,
      sources: ['T24', 'CRM', 'Digital_Banking'],
      last_updated: new Date().toISOString(),
      transformations: ['anonymization', 'feature_engineering', 'scoring'],
      data_owner: 'Data Management & BI'
    };
  }
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


