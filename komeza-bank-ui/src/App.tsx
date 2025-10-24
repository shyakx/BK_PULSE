// @ts-nocheck
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import ModelManagement from './pages/admin/ModelManagement.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';
import Settings from './pages/admin/Settings.jsx';
import KnowledgeBaseAdmin from './pages/admin/KnowledgeBaseAdmin.jsx';

// Manager Pages
import ExecutiveDashboard from './pages/manager/ExecutiveDashboard.jsx';
import SegmentationAnalytics from './pages/manager/SegmentationAnalytics.jsx';
import CampaignApprovals from './pages/manager/CampaignApprovals.jsx';
import CustomerOverview from './pages/manager/CustomerOverview.jsx';
import ReportsVisualization from './pages/manager/ReportsVisualization.jsx';
import ModelInsights from './pages/manager/ModelInsights.jsx';

// Analyst Pages
import CustomerSegments from './pages/analyst/CustomerSegments.jsx';
import BulkPredictions from './pages/analyst/BulkPredictions.jsx';
import CampaignManagement from './pages/analyst/CampaignManagement.jsx';
import AnalyticsInsights from './pages/analyst/AnalyticsInsights.jsx';
import KnowledgeBase from './pages/analyst/KnowledgeBase.jsx';
import Reports from './pages/analyst/Reports.jsx';

// Officer Pages
import Customers from './pages/officer/Customers.jsx';
import CustomerDetails from './pages/officer/CustomerDetails.jsx';
import CampaignExecution from './pages/officer/CampaignExecution.jsx';
import Predictions from './pages/officer/Predictions.jsx';
import PerformanceMetrics from './pages/officer/PerformanceMetrics.jsx';
import OfficerKnowledgeBase from './pages/officer/KnowledgeBase.jsx';
import AlertsRecommendations from './pages/officer/AlertsRecommendations.jsx';
import AnalyticsDashboard from './pages/officer/AnalyticsDashboard.jsx';

// Legacy Pages (for backward compatibility)
import OfficerDashboard from './pages/OfficerDashboard.jsx';
import CallQueue from './pages/CallQueue.jsx';
import InteractionLog from './pages/InteractionLog.jsx';
import PerformanceTracker from './pages/PerformanceTracker.jsx';
import KnowledgeHub from './pages/KnowledgeHub.jsx';
import ChurnPrediction from './pages/ChurnPrediction.jsx';
import EarlyWarningSystem from './pages/EarlyWarningSystem.jsx';
import CustomerSegmentation from './pages/CustomerSegmentation.jsx';
import CustomerLifetimeValue from './pages/CustomerLifetimeValue.jsx';
import TaskAssignmentEngine from './pages/TaskAssignmentEngine.jsx';
import CustomerInteractionWorkflow from './pages/CustomerInteractionWorkflow.jsx';
import KPITracking from './pages/KPITracking.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import BonusCalculator from './pages/BonusCalculator.jsx';

import { useAuth } from './context/AuthContext.jsx';
import { SidebarProvider } from './components/LayoutWrapper.jsx';

function App() {
  const { isAuthenticated, user } = useAuth();
  
  // Type assertion for user
  const typedUser = user as any;

  // Role-based dashboard routing
  const getDashboardRoute = () => {
    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    
    // Route users to appropriate dashboard based on role
    switch (typedUser?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ExecutiveDashboard />;
      case 'analyst':
        return <CustomerSegments />;
      case 'officer':
        return <Customers />;
      default:
        return <Customers />; // Default to officer dashboard
    }
  };

  // Role-based route protection
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(typedUser?.role)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="App">
        <SidebarProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={isAuthenticated ? getDashboardRoute() : <Login />} />
            
            {/* Protected routes with role-based dashboards */}
            <Route path="/" element={isAuthenticated ? getDashboardRoute() : <Navigate to="/login" replace />} />
            <Route path="/dashboard" element={isAuthenticated ? getDashboardRoute() : <Navigate to="/login" replace />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/models" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ModelManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/admin/knowledge" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <KnowledgeBaseAdmin />
              </ProtectedRoute>
            } />
            
            {/* Manager Routes */}
            <Route path="/manager/dashboard" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ExecutiveDashboard />
              </ProtectedRoute>
            } />
            <Route path="/manager/segmentation" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <SegmentationAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/manager/approvals" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <CampaignApprovals />
              </ProtectedRoute>
            } />
            <Route path="/manager/customers" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <CustomerOverview />
              </ProtectedRoute>
            } />
            <Route path="/manager/reports" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ReportsVisualization />
              </ProtectedRoute>
            } />
            <Route path="/manager/insights" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ModelInsights />
              </ProtectedRoute>
            } />
            
            {/* Analyst Routes */}
            <Route path="/analyst/segments" element={
              <ProtectedRoute allowedRoles={['analyst']}>
                <CustomerSegments />
              </ProtectedRoute>
            } />
            <Route path="/analyst/predictions" element={
              <ProtectedRoute allowedRoles={['analyst']}>
                <BulkPredictions />
              </ProtectedRoute>
            } />
            <Route path="/analyst/campaigns" element={
              <ProtectedRoute allowedRoles={['analyst']}>
                <CampaignManagement />
              </ProtectedRoute>
            } />
            <Route path="/analyst/analytics" element={
              <ProtectedRoute allowedRoles={['analyst']}>
                <AnalyticsInsights />
              </ProtectedRoute>
            } />
            <Route path="/analyst/knowledge" element={
              <ProtectedRoute allowedRoles={['analyst']}>
                <KnowledgeBase />
              </ProtectedRoute>
            } />
            <Route path="/analyst/reports" element={
              <ProtectedRoute allowedRoles={['analyst']}>
                <Reports />
              </ProtectedRoute>
            } />
            
            {/* Officer Routes */}
            <Route path="/officer/customers" element={
              <ProtectedRoute allowedRoles={['officer']}>
                <Customers />
              </ProtectedRoute>
            } />
            <Route path="/officer/customer-details" element={
              <ProtectedRoute allowedRoles={['officer']}>
                <CustomerDetails />
              </ProtectedRoute>
            } />
            <Route path="/officer/campaigns" element={
              <ProtectedRoute allowedRoles={['officer']}>
                <CampaignExecution />
              </ProtectedRoute>
            } />
            <Route path="/officer/predictions" element={
              <ProtectedRoute allowedRoles={['officer']}>
                <Predictions />
              </ProtectedRoute>
            } />
            <Route path="/officer/performance" element={
              <ProtectedRoute allowedRoles={['officer']}>
                <PerformanceMetrics />
              </ProtectedRoute>
            } />
            <Route path="/officer/knowledge" element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerKnowledgeBase />
              </ProtectedRoute>
            } />
            <Route path="/officer/alerts" element={
              <ProtectedRoute allowedRoles={['officer']}>
                <AlertsRecommendations />
              </ProtectedRoute>
            } />
            <Route path="/officer/analytics" element={
              <ProtectedRoute allowedRoles={['officer']}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            
            {/* Legacy Routes (for backward compatibility) */}
            <Route path="/officer-dashboard" element={isAuthenticated ? <OfficerDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/call-queue" element={isAuthenticated ? <CallQueue /> : <Navigate to="/login" replace />} />
            <Route path="/interaction-log" element={isAuthenticated ? <InteractionLog /> : <Navigate to="/login" replace />} />
            <Route path="/performance-tracker" element={isAuthenticated ? <PerformanceTracker /> : <Navigate to="/login" replace />} />
            <Route path="/knowledge-hub" element={isAuthenticated ? <KnowledgeHub /> : <Navigate to="/login" replace />} />
            
            {/* Core Churn Prediction Routes - Available to all authenticated users */}
            <Route path="/churn-prediction" element={isAuthenticated ? <ChurnPrediction /> : <Navigate to="/login" replace />} />
            {/* Public demo alias for setup/testing (no auth) */}
            <Route path="/churn" element={<ChurnPrediction />} />
            <Route path="/early-warning-system" element={isAuthenticated ? <EarlyWarningSystem /> : <Navigate to="/login" replace />} />
            <Route path="/customer-segmentation" element={isAuthenticated ? <CustomerSegmentation /> : <Navigate to="/login" replace />} />
            <Route path="/customer-lifetime-value" element={isAuthenticated ? <CustomerLifetimeValue /> : <Navigate to="/login" replace />} />
            <Route path="/task-assignment" element={isAuthenticated ? <TaskAssignmentEngine /> : <Navigate to="/login" replace />} />
            <Route path="/customer-interaction-workflow" element={isAuthenticated ? <CustomerInteractionWorkflow /> : <Navigate to="/login" replace />} />
            
            {/* Management Routes - Available to all authenticated users */}
            <Route path="/kpi-tracking" element={isAuthenticated ? <KPITracking /> : <Navigate to="/login" replace />} />
            <Route path="/leaderboard" element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" replace />} />
            <Route path="/bonus-calculator" element={isAuthenticated ? <BonusCalculator /> : <Navigate to="/login" replace />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SidebarProvider>
      </div>
    </Router>
  );
}

export default App;