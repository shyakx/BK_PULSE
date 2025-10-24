import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const AnalyticsDashboard = () => {
  const { isCollapsed } = useSidebar();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock analytics data
        const mockAnalytics = {
          overview: {
            totalCustomers: 250,
            highRiskCustomers: 45,
            retentionRate: 88.5,
            conversionRate: 72.3,
            satisfactionScore: 8.7,
            callsCompleted: 180,
            callsPending: 20,
            revenueRetained: 15000000,
            revenueLost: 2000000
          },
          trends: {
            retention: [85, 87, 88, 88.5],
            conversion: [68, 70, 71, 72.3],
            satisfaction: [8.2, 8.4, 8.6, 8.7],
            calls: [150, 160, 170, 180]
          },
          segments: [
            {
              name: 'Corporate',
              customers: 50,
              retentionRate: 92,
              conversionRate: 78,
              satisfactionScore: 9.1,
              revenue: 8000000,
              riskLevel: 'Low'
            },
            {
              name: 'SME',
              customers: 120,
              retentionRate: 85,
              conversionRate: 70,
              satisfactionScore: 8.5,
              revenue: 5000000,
              riskLevel: 'Medium'
            },
            {
              name: 'Retail',
              customers: 80,
              retentionRate: 90,
              conversionRate: 75,
              satisfactionScore: 8.8,
              revenue: 2000000,
              riskLevel: 'Low'
            }
          ],
          topCustomers: [
            {
              id: 'CUST001',
              name: 'Rwanda Development Bank',
              segment: 'Corporate',
              churnProbability: 15,
              revenue: 2000000,
              lastContact: '2024-01-20',
              status: 'Retained'
            },
            {
              id: 'CUST002',
              name: 'Kigali Business Center',
              segment: 'SME',
              churnProbability: 25,
              revenue: 1500000,
              lastContact: '2024-01-18',
              status: 'At Risk'
            },
            {
              id: 'CUST003',
              name: 'Tech Solutions Ltd',
              segment: 'SME',
              churnProbability: 35,
              revenue: 1200000,
              lastContact: '2024-01-15',
              status: 'At Risk'
            }
          ],
          performance: {
            daily: {
              calls: 8,
              conversions: 6,
              retention: 5,
              satisfaction: 8.5
            },
            weekly: {
              calls: 45,
              conversions: 32,
              retention: 28,
              satisfaction: 8.6
            },
            monthly: {
              calls: 180,
              conversions: 130,
              retention: 115,
              satisfaction: 8.7
            }
          },
          goals: {
            calls: { target: 200, current: 180, progress: 90 },
            retention: { target: 85, current: 88.5, progress: 104 },
            conversion: { target: 70, current: 72.3, progress: 103 },
            satisfaction: { target: 8.5, current: 8.7, progress: 102 }
          }
        };
        
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedPeriod]);

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-100 text-green-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'High': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Retained': return 'bg-green-100 text-green-600';
      case 'At Risk': return 'bg-yellow-100 text-yellow-600';
      case 'Churned': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading analytics...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Your personal performance analytics and insights</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <Button variant="outline" size="sm">
                📊 Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overview.totalCustomers}</p>
                    <p className="text-sm text-gray-500 mt-1">{analytics.overview.highRiskCustomers} high risk</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">👥</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Retention Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overview.retentionRate}%</p>
                    <p className="text-sm text-gray-500 mt-1">Target: 85%</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">🎯</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overview.conversionRate}%</p>
                    <p className="text-sm text-gray-500 mt-1">Target: 70%</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">💼</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Satisfaction Score</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overview.satisfactionScore}/10</p>
                    <p className="text-sm text-gray-500 mt-1">Target: 8.5</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">⭐</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Performance Trends</Card.Title>
              <Card.Description>Your performance over the last 4 periods</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Retention Rate</h4>
                  <div className="space-y-2">
                    {analytics.trends.retention.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period {index + 1}</span>
                        <span className="font-medium text-green-600">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Conversion Rate</h4>
                  <div className="space-y-2">
                    {analytics.trends.conversion.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period {index + 1}</span>
                        <span className="font-medium text-purple-600">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Satisfaction Score</h4>
                  <div className="space-y-2">
                    {analytics.trends.satisfaction.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period {index + 1}</span>
                        <span className="font-medium text-orange-600">{value}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Calls Completed</h4>
                  <div className="space-y-2">
                    {analytics.trends.calls.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period {index + 1}</span>
                        <span className="font-medium text-blue-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Segment Performance */}
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Segment Performance</Card.Title>
              <Card.Description>Performance breakdown by customer segment</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {analytics.segments.map((segment, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{segment.name}</h3>
                        <span className="text-sm text-gray-600">({segment.customers} customers)</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(segment.riskLevel)}`}>
                          {segment.riskLevel} Risk
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="font-medium text-gray-900">{(segment.revenue / 1000000).toFixed(1)}M RWF</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Retention Rate</p>
                        <p className="text-lg font-bold text-green-600">{segment.retentionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                        <p className="text-lg font-bold text-purple-600">{segment.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Satisfaction Score</p>
                        <p className="text-lg font-bold text-orange-600">{segment.satisfactionScore}/10</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Top Customers */}
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Top Customers</Card.Title>
              <Card.Description>Your highest value and most at-risk customers</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {analytics.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{customer.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{customer.id}</span>
                          <span>{customer.segment}</span>
                          <span>Churn: {customer.churnProbability}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="font-medium text-gray-900">{(customer.revenue / 1000000).toFixed(1)}M RWF</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last Contact</p>
                        <p className="font-medium text-gray-900">{customer.lastContact}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Goals Progress */}
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Goals Progress</Card.Title>
              <Card.Description>Your progress towards monthly targets</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(analytics.goals).map(([key, goal]) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 capitalize">{key}</h4>
                      <span className={`text-sm font-medium ${getProgressColor(goal.progress)}`}>
                        {goal.progress}%
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current</span>
                        <span className="font-medium">{goal.current}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Target</span>
                        <span className="font-medium">{goal.target}</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.progress >= 100 ? 'bg-green-500' : 
                          goal.progress >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Revenue Impact */}
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Revenue Impact</Card.Title>
              <Card.Description>Financial impact of your retention efforts</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {(analytics.overview.revenueRetained / 1000000).toFixed(1)}M RWF
                  </div>
                  <p className="text-sm text-gray-600">Revenue Retained</p>
                  <p className="text-xs text-gray-500 mt-1">Through successful retention efforts</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {(analytics.overview.revenueLost / 1000000).toFixed(1)}M RWF
                  </div>
                  <p className="text-sm text-gray-600">Revenue Lost</p>
                  <p className="text-xs text-gray-500 mt-1">From customers who churned</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {((analytics.overview.revenueRetained - analytics.overview.revenueLost) / 1000000).toFixed(1)}M RWF
                  </div>
                  <p className="text-sm text-gray-600">Net Revenue Impact</p>
                  <p className="text-xs text-gray-500 mt-1">Positive impact from retention efforts</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading analytics...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
