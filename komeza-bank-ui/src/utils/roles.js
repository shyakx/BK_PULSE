// BK Pulse Retention Department Role Management System
// Focused on Bank of Kigali Retention Department operations

export const ROLES = {
  HOD: 'hod',                    // Head of Department (Retention)
  SENIOR_MANAGER: 'senior_manager', // Senior Manager (Retention Supervisors)
  DATA_ANALYST: 'data_analyst',   // Data Analyst (Retention Analytics Unit)
  OFFICER: 'officer'             // Retention Contact Center Officers
};

export const ROLE_PERMISSIONS = {
  [ROLES.HOD]: {
    name: 'Head of Department (Retention)',
    description: 'Strategic oversight, performance monitoring, and reporting for retention department',
    permissions: [
      'view_department_dashboard',
      'view_branch_performance',
      'view_product_penetration',
      'manage_targets',
      'view_reports_insights',
      'export_executive_data',
      'view_retention_kpis'
    ],
    dashboard: '/hod-dashboard',
    pages: [
      { path: '/hod-dashboard', name: 'Department Dashboard', icon: 'dashboard' },
      { path: '/branch-team-performance', name: 'Branch & Team Performance', icon: 'chart' },
      { path: '/product-penetration', name: 'Product Penetration', icon: 'trend' },
      { path: '/target-management', name: 'Target Management', icon: 'target' },
      { path: '/reports-insights', name: 'Reports & Insights', icon: 'report' }
    ],
    dataAccess: {
      level: 'organization_level',
      piiAccess: true,
      exportAccess: true,
      adminAccess: false
    }
  },

  [ROLES.SENIOR_MANAGER]: {
    name: 'Senior Manager (Retention)',
    description: 'Team coordination, campaign execution, and quality control for retention operations',
    permissions: [
      'view_operational_dashboard',
      'manage_campaigns',
      'view_customer_segmentation',
      'view_team_performance',
      'view_quality_assurance',
      'export_team_data'
    ],
    dashboard: '/senior-manager-dashboard',
    pages: [
      { path: '/senior-manager-dashboard', name: 'Operational Dashboard', icon: 'dashboard' },
      { path: '/campaign-management', name: 'Campaign Management', icon: 'campaign' },
      { path: '/customer-segmentation', name: 'Customer Segmentation', icon: 'users' },
      { path: '/team-performance-tracker', name: 'Team Performance', icon: 'chart' },
      { path: '/quality-assurance', name: 'Quality Assurance', icon: 'quality' }
    ],
    dataAccess: {
      level: 'team_level',
      piiAccess: true,
      exportAccess: true,
      adminAccess: false
    }
  },

  [ROLES.DATA_ANALYST]: {
    name: 'Data Analyst (Retention Analytics)',
    description: 'Data processing, model monitoring, and insight generation for retention analytics',
    permissions: [
      'view_data_monitoring',
      'view_model_performance',
      'view_customer_insights',
      'view_product_conversion',
      'view_kpi_reporting',
      'export_analytics_data'
    ],
    dashboard: '/analyst-dashboard',
    pages: [
      { path: '/analyst-dashboard', name: 'Data Monitoring', icon: 'dashboard' },
      { path: '/model-performance', name: 'Model Performance', icon: 'health' },
      { path: '/customer-insights', name: 'Customer Insights', icon: 'insight' },
      { path: '/product-conversion', name: 'Product Conversion', icon: 'conversion' },
      { path: '/kpi-reporting', name: 'KPI Reporting', icon: 'report' }
    ],
    dataAccess: {
      level: 'system_level',
      piiAccess: false,
      exportAccess: true,
      adminAccess: false
    }
  },

  [ROLES.OFFICER]: {
    name: 'Retention Contact Center Officer',
    description: 'Customer engagement, retention calls, and product promotion',
    permissions: [
      'view_customer_360',
      'view_call_queue',
      'log_interactions',
      'view_performance_tracker',
      'view_knowledge_hub',
      'update_customer_status'
    ],
    dashboard: '/officer-dashboard',
    pages: [
      { path: '/officer-dashboard', name: 'Customer 360°', icon: 'customer' },
      { path: '/call-queue', name: 'Call Queue & Tasks', icon: 'phone' },
      { path: '/interaction-log', name: 'Interaction Log', icon: 'log' },
      { path: '/performance-tracker', name: 'Performance Tracker', icon: 'chart' },
      { path: '/knowledge-hub', name: 'Knowledge Hub', icon: 'book' }
    ],
    dataAccess: {
      level: 'customer_level',
      piiAccess: true,
      exportAccess: false,
      adminAccess: false
    }
  }
};

// Role-based access control functions
export const hasPermission = (userRole, permission) => {
  const roleConfig = ROLE_PERMISSIONS[userRole];
  return roleConfig?.permissions?.includes(permission) || false;
};

export const canAccessData = (userRole, dataLevel) => {
  const roleConfig = ROLE_PERMISSIONS[userRole];
  const accessLevels = {
    'customer_level': 1,
    'team_level': 2,
    'branch_level': 3,
    'system_level': 4,
    'organization_level': 5,
    'full_access': 6
  };
  
  const userLevel = accessLevels[roleConfig?.dataAccess?.level] || 0;
  const requiredLevel = accessLevels[dataLevel] || 0;
  
  return userLevel >= requiredLevel;
};

export const canAccessPII = (userRole) => {
  const roleConfig = ROLE_PERMISSIONS[userRole];
  return roleConfig?.dataAccess?.piiAccess || false;
};

export const canExportData = (userRole) => {
  const roleConfig = ROLE_PERMISSIONS[userRole];
  return roleConfig?.dataAccess?.exportAccess || false;
};

export const getRoleConfig = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || null;
};

export const getRolePages = (userRole) => {
  const roleConfig = ROLE_PERMISSIONS[userRole];
  return roleConfig?.pages || [];
};

export const getRoleDashboard = (userRole) => {
  const roleConfig = ROLE_PERMISSIONS[userRole];
  return roleConfig?.dashboard || '/dashboard';
};

// Compliance and audit functions for Retention Department
export const getRoleAuditLevel = (userRole) => {
  const auditLevels = {
    [ROLES.HOD]: 'executive',
    [ROLES.SENIOR_MANAGER]: 'enhanced',
    [ROLES.DATA_ANALYST]: 'enhanced',
    [ROLES.OFFICER]: 'standard'
  };
  
  return auditLevels[userRole] || 'standard';
};

export const getRoleDataRetention = (userRole) => {
  const retentionPolicies = {
    [ROLES.HOD]: '3_years',
    [ROLES.SENIOR_MANAGER]: '2_years',
    [ROLES.DATA_ANALYST]: '2_years',
    [ROLES.OFFICER]: '1_year'
  };
  
  return retentionPolicies[userRole] || '1_year';
};

// Role-based feature flags for Retention Department
export const getRoleFeatures = (userRole) => {
  const features = {
    [ROLES.HOD]: {
      realTimeAlerts: true,
      customerScoring: true,
      taskManagement: false,
      feedbackCollection: false,
      reporting: true,
      analytics: true,
      admin: false,
      retentionKPIs: true,
      branchPerformance: true,
      productPenetration: true,
      targetManagement: true
    },
    [ROLES.SENIOR_MANAGER]: {
      realTimeAlerts: true,
      customerScoring: true,
      taskManagement: true,
      feedbackCollection: true,
      reporting: true,
      analytics: true,
      admin: false,
      campaignManagement: true,
      teamPerformance: true,
      qualityAssurance: true,
      customerSegmentation: true
    },
    [ROLES.DATA_ANALYST]: {
      realTimeAlerts: false,
      customerScoring: true,
      taskManagement: false,
      feedbackCollection: false,
      reporting: true,
      analytics: true,
      admin: false,
      modelMonitoring: true,
      dataQuality: true,
      customerInsights: true,
      productConversion: true
    },
    [ROLES.OFFICER]: {
      realTimeAlerts: true,
      customerScoring: true,
      taskManagement: true,
      feedbackCollection: true,
      reporting: false,
      analytics: false,
      admin: false,
      customer360: true,
      callQueue: true,
      interactionLogging: true,
      performanceTracking: true,
      knowledgeHub: true
    }
  };
  
  return features[userRole] || features[ROLES.OFFICER];
};
