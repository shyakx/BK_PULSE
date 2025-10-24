import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const AdminDashboard = () => {
  const { isCollapsed } = useSidebar();
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSystemHealth = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock system health data
        const mockSystemHealth = {
          modelHealth: {
            status: 'Healthy',
            accuracy: 87.5,
            lastRetrained: '2024-01-20',
            driftDetected: false,
            performance: 'Good'
          },
          systemMetrics: {
            uptime: 99.8,
            activeUsers: 45,
            totalPredictions: 1250,
            avgResponseTime: 1.2
          },
          alerts: [
            {
              id: 1,
              type: 'Model Performance',
              message: 'Model accuracy dropped below 85% threshold',
              severity: 'High',
              timestamp: '2024-01-22 14:30',
              status: 'Active'
            },
            {
              id: 2,
              type: 'System Health',
              message: 'Database connection timeout detected',
              severity: 'Medium',
              timestamp: '2024-01-22 12:15',
              status: 'Resolved'
            }
          ],
          userActivity: [
            {
              user: 'Alice Mukamana',
              role: 'Retention Officer',
              lastActivity: '2 minutes ago',
              status: 'Active'
            },
            {
              user: 'John Nkurunziza',
              role: 'Analyst',
              lastActivity: '5 minutes ago',
              status: 'Active'
            },
            {
              user: 'Grace Uwimana',
              role: 'Manager',
              lastActivity: '10 minutes ago',
              status: 'Active'
            }
          ],
          retrainingTriggers: [
            {
              metric: 'Accuracy Drop',
              threshold: 85,
              current: 87.5,
              status: 'Monitoring'
            },
            {
              metric: 'Data Drift',
              threshold: 0.1,
              current: 0.05,
              status: 'Normal'
            }
          ]
        };
        
        setSystemHealth(mockSystemHealth);
      } catch (error) {
        console.error('Failed to load system health:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSystemHealth();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-green-100 text-green-600';
      case 'Warning': return 'bg-yellow-100 text-yellow-600';
      case 'Critical': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!systemHealth) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading system health...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">System-wide overview and health monitoring</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                🔄 Refresh Data
              </Button>
              <Button variant="primary" size="sm">
                ⚙️ System Settings
              </Button>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Model Health</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{systemHealth.modelHealth.status}</p>
                    <p className="text-sm text-gray-500 mt-1">Accuracy: {systemHealth.modelHealth.accuracy}%</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">🤖</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">System Uptime</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{systemHealth.systemMetrics.uptime}%</p>
                    <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">⚡</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{systemHealth.systemMetrics.activeUsers}</p>
                    <p className="text-sm text-gray-500 mt-1">Currently online</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">👥</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Predictions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{systemHealth.systemMetrics.totalPredictions.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Today</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">🎯</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Model Health & Retraining Triggers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="corporate" shadow="medium">
              <Card.Header variant="corporate">
                <Card.Title variant="corporate">Model Health Status</Card.Title>
                <Card.Description variant="corporate">Current model performance and health metrics</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">Overall Status</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(systemHealth.modelHealth.status)}`}>
                      {systemHealth.modelHealth.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <p className="text-sm font-medium text-slate-600 mb-1">Accuracy</p>
                      <p className="text-2xl font-bold text-slate-900">{systemHealth.modelHealth.accuracy}%</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <p className="text-sm font-medium text-slate-600 mb-1">Performance</p>
                      <p className="text-2xl font-bold text-slate-900">{systemHealth.modelHealth.performance}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-600 mb-2">Last Retrained</p>
                    <p className="text-lg font-semibold text-slate-900 mb-1">{systemHealth.modelHealth.lastRetrained}</p>
                    <p className="text-sm text-slate-500">
                      Drift Detected: {systemHealth.modelHealth.driftDetected ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="executive" shadow="medium">
              <Card.Header variant="executive">
                <Card.Title variant="executive">Retraining Triggers</Card.Title>
                <Card.Description variant="executive">Automated model retraining conditions</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {systemHealth.retrainingTriggers.map((trigger, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{trigger.metric}</h4>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          trigger.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {trigger.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="font-medium">Threshold: {trigger.threshold}</span>
                        <span className="font-medium">Current: {trigger.current}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* System Alerts */}
          <Card variant="danger" shadow="medium">
            <Card.Header variant="danger">
              <Card.Title variant="danger">System Alerts</Card.Title>
              <Card.Description variant="danger">Recent system alerts and notifications</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {systemHealth.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${
                        alert.severity === 'High' ? 'bg-red-500' : 
                        alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{alert.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        alert.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* User Activity */}
          <Card variant="primary" shadow="medium">
            <Card.Header variant="primary">
              <Card.Title variant="primary">Recent User Activity</Card.Title>
              <Card.Description variant="primary">Currently active users and their activities</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {systemHealth.userActivity.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {user.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.user}</h4>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user.lastActivity}</p>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading system health...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
