import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const AdminReports = () => {
  const { isCollapsed } = useSidebar();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock reports data
        const mockReports = {
          systemKPIs: {
            totalPredictions: 12500,
            avgAccuracy: 87.5,
            systemUptime: 99.8,
            activeUsers: 45,
            modelRetrains: 3
          },
          retentionMetrics: {
            portfolioChurnRate: 12.5,
            retentionRate: 87.5,
            customersRetained: 1250,
            revenueRetained: 45000000,
            costPerRetention: 15000
          },
          campaignEffectiveness: [
            {
              campaign: 'High Risk Retention',
              targetCustomers: 500,
              contacts: 450,
              retentionRate: 78.5,
              roi: 320
            },
            {
              campaign: 'Product Cross-sell',
              targetCustomers: 300,
              contacts: 280,
              retentionRate: 65.2,
              roi: 180
            },
            {
              campaign: 'Digital Engagement',
              targetCustomers: 200,
              contacts: 190,
              retentionRate: 82.1,
              roi: 250
            }
          ],
          userPerformance: [
            {
              user: 'Alice Mukamana',
              role: 'Officer',
              predictions: 150,
              accuracy: 89.2,
              retentionRate: 85.5,
              satisfaction: 8.5
            },
            {
              user: 'John Nkurunziza',
              role: 'Analyst',
              predictions: 200,
              accuracy: 87.8,
              retentionRate: 82.1,
              satisfaction: 8.2
            },
            {
              user: 'Grace Uwimana',
              role: 'Manager',
              predictions: 100,
              accuracy: 91.5,
              retentionRate: 88.9,
              satisfaction: 9.1
            }
          ],
          systemHealth: {
            modelDrift: 0.05,
            dataQuality: 94.2,
            apiResponseTime: 1.2,
            errorRate: 0.8,
            securityIncidents: 0
          }
        };
        
        setReports(mockReports);
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [timeframe]);

  const getPerformanceColor = (value, threshold) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!reports) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading reports...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600">System-wide KPIs and performance metrics</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Button variant="outline" size="sm">
                📊 Export Report
              </Button>
              <Button variant="primary" size="sm">
                📈 Generate Dashboard
              </Button>
            </div>
          </div>

          {/* System KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Predictions</p>
                    <p className="text-2xl font-bold text-blue-900">{reports.systemKPIs.totalPredictions.toLocaleString()}</p>
                    <p className="text-xs text-blue-700">This {timeframe}</p>
                  </div>
                  <div className="text-3xl">🎯</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Avg Accuracy</p>
                    <p className="text-2xl font-bold text-green-900">{reports.systemKPIs.avgAccuracy}%</p>
                    <p className="text-xs text-green-700">Model performance</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">System Uptime</p>
                    <p className="text-2xl font-bold text-purple-900">{reports.systemKPIs.systemUptime}%</p>
                    <p className="text-xs text-purple-700">Last 30 days</p>
                  </div>
                  <div className="text-3xl">⚡</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Active Users</p>
                    <p className="text-2xl font-bold text-orange-900">{reports.systemKPIs.activeUsers}</p>
                    <p className="text-xs text-orange-700">Currently online</p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Model Retrains</p>
                    <p className="text-2xl font-bold text-red-900">{reports.systemKPIs.modelRetrains}</p>
                    <p className="text-xs text-red-700">This {timeframe}</p>
                  </div>
                  <div className="text-3xl">🔄</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Retention Metrics */}
          <Card>
            <Card.Header>
              <Card.Title>Retention Performance</Card.Title>
              <Card.Description>Key retention metrics and business impact</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Portfolio Churn Rate</h4>
                  <p className={`text-2xl font-bold ${getPerformanceColor(reports.retentionMetrics.portfolioChurnRate, 15)}`}>
                    {reports.retentionMetrics.portfolioChurnRate}%
                  </p>
                  <p className="text-xs text-gray-500">Target: &lt;15%</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Retention Rate</h4>
                  <p className={`text-2xl font-bold ${getPerformanceColor(reports.retentionMetrics.retentionRate, 85)}`}>
                    {reports.retentionMetrics.retentionRate}%
                  </p>
                  <p className="text-xs text-gray-500">Target: &gt;85%</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Customers Retained</h4>
                  <p className="text-2xl font-bold text-gray-900">{reports.retentionMetrics.customersRetained.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">This {timeframe}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Revenue Retained</h4>
                  <p className="text-2xl font-bold text-gray-900">{reports.retentionMetrics.revenueRetained.toLocaleString()} RWF</p>
                  <p className="text-xs text-gray-500">This {timeframe}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Cost per Retention</h4>
                  <p className="text-2xl font-bold text-gray-900">{reports.retentionMetrics.costPerRetention.toLocaleString()} RWF</p>
                  <p className="text-xs text-gray-500">Average cost</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Campaign Effectiveness */}
          <Card>
            <Card.Header>
              <Card.Title>Campaign Effectiveness</Card.Title>
              <Card.Description>Performance of retention campaigns</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {reports.campaignEffectiveness.map((campaign, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{campaign.campaign}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                        ROI: {campaign.roi}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Target Customers</p>
                        <p className="text-lg font-semibold text-gray-900">{campaign.targetCustomers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contacts Made</p>
                        <p className="text-lg font-semibold text-gray-900">{campaign.contacts}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Retention Rate</p>
                        <p className="text-lg font-semibold text-gray-900">{campaign.retentionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ROI</p>
                        <p className="text-lg font-semibold text-gray-900">{campaign.roi}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* User Performance */}
          <Card>
            <Card.Header>
              <Card.Title>User Performance</Card.Title>
              <Card.Description>Individual user performance metrics</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {reports.userPerformance.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {user.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{user.user}</h4>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Predictions</p>
                        <p className="font-semibold">{user.predictions}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Accuracy</p>
                        <p className="font-semibold">{user.accuracy}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Retention</p>
                        <p className="font-semibold">{user.retentionRate}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Satisfaction</p>
                        <p className="font-semibold">{user.satisfaction}/10</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* System Health */}
          <Card>
            <Card.Header>
              <Card.Title>System Health Metrics</Card.Title>
              <Card.Description>Technical system performance indicators</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Model Drift</h4>
                  <p className={`text-2xl font-bold ${getPerformanceColor(reports.systemHealth.modelDrift, 0.1)}`}>
                    {reports.systemHealth.modelDrift}
                  </p>
                  <p className="text-xs text-gray-500">Target: &lt;0.1</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Data Quality</h4>
                  <p className={`text-2xl font-bold ${getPerformanceColor(reports.systemHealth.dataQuality, 90)}`}>
                    {reports.systemHealth.dataQuality}%
                  </p>
                  <p className="text-xs text-gray-500">Target: &gt;90%</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">API Response</h4>
                  <p className={`text-2xl font-bold ${getPerformanceColor(reports.systemHealth.apiResponseTime, 2)}`}>
                    {reports.systemHealth.apiResponseTime}s
                  </p>
                  <p className="text-xs text-gray-500">Target: &lt;2s</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Error Rate</h4>
                  <p className={`text-2xl font-bold ${getPerformanceColor(reports.systemHealth.errorRate, 1)}`}>
                    {reports.systemHealth.errorRate}%
                  </p>
                  <p className="text-xs text-gray-500">Target: &lt;1%</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Security</h4>
                  <p className="text-2xl font-bold text-green-600">{reports.systemHealth.securityIncidents}</p>
                  <p className="text-xs text-gray-500">Incidents</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading reports...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
