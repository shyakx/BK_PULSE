import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate, NavLink } from 'react-router-dom'
import { useSidebar } from './LayoutWrapper.jsx'

const Sidebar = ({ onCollapseChange }) => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Role-based navigation for churn prediction and retention workflows
  const getNavigationItems = (role) => {
    const allItems = {
      // Admin Pages
      admin_dashboard: { path: '/admin/dashboard', name: 'Dashboard', icon: '🏠', desc: 'System overview & health' },
      user_management: { path: '/admin/users', name: 'User Management', icon: '👥', desc: 'Manage users & roles' },
      model_management: { path: '/admin/models', name: 'Model Management', icon: '🤖', desc: 'ML models & performance' },
      admin_reports: { path: '/admin/reports', name: 'Reports & Analytics', icon: '📊', desc: 'System-wide KPIs' },
      settings: { path: '/admin/settings', name: 'Settings', icon: '⚙️', desc: 'System configuration' },
      knowledge_admin: { path: '/admin/knowledge', name: 'Knowledge Base Admin', icon: '📚', desc: 'Manage training content' },

      // HOD/Manager Pages
      executive_dashboard: { path: '/manager/dashboard', name: 'Executive Dashboard', icon: '📈', desc: 'Portfolio & revenue insights' },
      segmentation_analytics: { path: '/manager/segmentation', name: 'Segmentation & Analytics', icon: '👥', desc: 'Cohort & campaign analysis' },
      campaign_approvals: { path: '/manager/approvals', name: 'Campaign Approvals', icon: '✅', desc: 'Review & approve campaigns' },
      customer_overview: { path: '/manager/customers', name: 'Customer Overview', icon: '👤', desc: 'High-risk customer summary' },
      reports_visualization: { path: '/manager/reports', name: 'Reports & Visualization', icon: '📊', desc: 'Power BI dashboards' },
      model_insights: { path: '/manager/insights', name: 'Model Insights', icon: '🔍', desc: 'Feature importance & accuracy' },

      // Retention Analyst Pages
      customer_segments: { path: '/analyst/segments', name: 'Customer Segments', icon: '👥', desc: 'Segment analysis & trends' },
      bulk_predictions: { path: '/analyst/predictions', name: 'Bulk Predictions', icon: '🎯', desc: 'Multi-customer predictions' },
      campaign_management: { path: '/analyst/campaigns', name: 'Campaign Management', icon: '📢', desc: 'Create & track campaigns' },
      analytics_insights: { path: '/analyst/analytics', name: 'Analytics & Insights', icon: '📊', desc: 'Churn drivers & trends' },
      knowledge_base: { path: '/analyst/knowledge', name: 'Knowledge Base', icon: '📚', desc: 'Scripts & best practices' },
      analyst_reports: { path: '/analyst/reports', name: 'Reports', icon: '📋', desc: 'Exportable dashboards' },

      // Retention Officer Pages
      customers: { path: '/officer/customers', name: 'Customers', icon: '👤', desc: 'Customer database & search' },
      customer_details: { path: '/officer/customer-details', name: 'Customer Details', icon: '📋', desc: 'Full customer profiles' },
      campaign_execution: { path: '/officer/campaigns', name: 'Campaign Execution', icon: '📢', desc: 'Log interactions & outcomes' },
      predictions: { path: '/officer/predictions', name: 'Predictions', icon: '🎯', desc: 'Single-customer predictions' },
      performance_metrics: { path: '/officer/performance', name: 'Performance Metrics', icon: '📊', desc: 'Personal KPIs & goals' },
      officer_knowledge: { path: '/officer/knowledge', name: 'Knowledge Base', icon: '📚', desc: 'Scripts & training' },
      alerts_recommendations: { path: '/officer/alerts', name: 'Alerts & Recommendations', icon: '🔔', desc: 'Action suggestions' },
      analytics_dashboard: { path: '/officer/analytics', name: 'Analytics Dashboard', icon: '📈', desc: 'Personal performance view' }
    };

    // Role-based access control
    const rolePermissions = {
      admin: [
        'admin_dashboard', 'user_management', 'model_management', 'admin_reports', 'settings', 'knowledge_admin'
      ],
      manager: [
        'executive_dashboard', 'segmentation_analytics', 'campaign_approvals', 'customer_overview', 
        'reports_visualization', 'model_insights'
      ],
      analyst: [
        'customer_segments', 'bulk_predictions', 'campaign_management', 'analytics_insights', 
        'knowledge_base', 'analyst_reports'
      ],
      officer: [
        'customers', 'customer_details', 'campaign_execution', 'predictions', 'performance_metrics',
        'officer_knowledge', 'alerts_recommendations', 'analytics_dashboard'
      ]
    };

    // Get allowed items for the user's role
    const allowedItems = rolePermissions[role] || rolePermissions.officer;
    
    // Return filtered navigation items
    return allowedItems.map(itemKey => allItems[itemKey]).filter(Boolean);
  }

  const navigationItems = getNavigationItems(user?.role)

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-primary-700 text-white h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 z-40`}>
      <div className="h-16 flex items-center px-4 border-b border-white/10">
        <img src="/logo.png" alt="BK" className="h-8 w-8 mr-2" />
        {!isCollapsed && <span className="font-bold">BK Pulse</span>}
        <button 
          onClick={toggleSidebar}
          className="ml-auto p-1 hover:bg-white/10 rounded"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-white/70 truncate">{user?.department || 'Department'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed User Avatar */}
      {isCollapsed && (
        <div className="p-4 border-b border-white/10 flex justify-center">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 pb-8 overflow-y-auto sidebar-scroll">
        {/* Quick Stats for HOD */}
        {!isCollapsed && user?.role === 'hod' && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-white/70 mb-2">Retention KPIs</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="text-green-400 font-bold">94.2%</div>
                <div className="text-white/60">Retention Rate</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">23</div>
                <div className="text-white/60">Aguka Sales</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats for Senior Manager */}
        {!isCollapsed && user?.role === 'senior_manager' && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-white/70 mb-2">Team Status</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="text-green-400 font-bold">12/15</div>
                <div className="text-white/60">Active Officers</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">89</div>
                <div className="text-white/60">Calls Today</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats for Data Analyst */}
        {!isCollapsed && user?.role === 'data_analyst' && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-white/70 mb-2">Model Status</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="text-green-400 font-bold">98.5%</div>
                <div className="text-white/60">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">2.1k</div>
                <div className="text-white/60">Predictions</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Grid */}
        <div className={isCollapsed ? "space-y-2" : "grid grid-cols-2 gap-2"}>
          {navigationItems.map((item, index) => {
            if (item.disabled) {
              return (
                <div
                  key={index}
                  className={`group relative ${isCollapsed ? 'p-2' : 'p-3'} rounded-lg bg-white/5 border border-white/10 cursor-not-allowed opacity-60`}
                  title={item.desc}
                >
                  <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'flex-col items-center'} text-center`}>
                    <span className={`${isCollapsed ? 'text-xl' : 'text-2xl'} ${isCollapsed ? '' : 'mb-1'}`}>{item.icon}</span>
                    {!isCollapsed && <span className="text-xs font-medium leading-tight">{item.name}</span>}
                  </div>
                </div>
              )
            }

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `group relative ${isCollapsed ? 'p-2' : 'p-3'} rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-white text-primary-700 shadow-lg' 
                      : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                  }`
                }
                title={item.desc}
              >
                <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'flex-col items-center'} text-center`}>
                  <span className={`${isCollapsed ? 'text-xl' : 'text-2xl'} ${isCollapsed ? '' : 'mb-1'} group-hover:scale-110 transition-transform duration-200`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-xs font-medium leading-tight">
                      {item.name}
                    </span>
                  )}
                </div>
                
                {/* Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.desc}
                  </div>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Quick Actions for Retention Officers */}
        {!isCollapsed && user?.role === 'officer' && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-white/70 mb-2">Today's Focus</div>
            <div className="space-y-1">
              <button className="w-full text-left text-xs text-white/80 hover:text-white hover:bg-white/10 px-2 py-1 rounded">
                🚨 High Risk Customers (7)
              </button>
              <button className="w-full text-left text-xs text-white/80 hover:text-white hover:bg-white/10 px-2 py-1 rounded">
                📞 Calls Completed (23/45)
              </button>
              <button className="w-full text-left text-xs text-white/80 hover:text-white hover:bg-white/10 px-2 py-1 rounded">
                💰 BK Capital Sales (3)
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions for Senior Managers */}
        {!isCollapsed && user?.role === 'senior_manager' && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-white/70 mb-2">Campaign Status</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/80">Active Campaigns</span>
                <span className="text-green-400">3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/80">Team Performance</span>
                <span className="text-blue-400">87%</span>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="w-full px-3 py-2 rounded-md bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/90 text-sm transition-all duration-200">
          Logout
        </button>
      </div>
    </aside>
  )
}

export { Sidebar };
export default Sidebar;


