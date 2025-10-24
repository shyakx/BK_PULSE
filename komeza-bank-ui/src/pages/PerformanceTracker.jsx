import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const PerformanceTracker = () => {
  const { isCollapsed } = useSidebar();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    const loadPerformance = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock performance data
        const mockPerformance = {
          officer: 'Alice Mukamana',
          period: 'This Week',
          callsCompleted: 45,
          customersRetained: 38,
          productsSold: 12,
          churnPrevented: 42,
          satisfactionScore: 8.2,
          targetCalls: 50,
          targetRetention: 40,
          targetSales: 15,
          kpis: [
            {
              name: 'Calls Completed',
              current: 45,
              target: 50,
              percentage: 90,
              trend: '+5%',
              color: 'blue'
            },
            {
              name: 'Retention Rate',
              current: 84,
              target: 80,
              percentage: 105,
              trend: '+3%',
              color: 'green'
            },
            {
              name: 'Sales Conversion',
              current: 27,
              target: 30,
              percentage: 90,
              trend: '+2%',
              color: 'purple'
            },
            {
              name: 'Customer Satisfaction',
              current: 8.2,
              target: 8.0,
              percentage: 103,
              trend: '+0.3',
              color: 'orange'
            }
          ],
          recentActivity: [
            {
              id: 1,
              type: 'Call',
              customer: 'Jean Baptiste',
              outcome: 'Customer Retained',
              timestamp: '2024-01-22 14:30',
              satisfaction: 8
            },
            {
              id: 2,
              type: 'Sale',
              customer: 'Marie Claire',
              outcome: 'Investment Product Sold',
              timestamp: '2024-01-22 11:15',
              satisfaction: 9
            },
            {
              id: 3,
              type: 'Call',
              customer: 'Peter Nkurunziza',
              outcome: 'Follow-up Completed',
              timestamp: '2024-01-21 16:45',
              satisfaction: 7
            }
          ],
          achievements: [
            {
              id: 1,
              title: 'Retention Champion',
              description: 'Highest retention rate this month',
              icon: '🏆',
              date: '2024-01-20'
            },
            {
              id: 2,
              title: 'Sales Star',
              description: 'Exceeded sales target by 20%',
              icon: '⭐',
              date: '2024-01-18'
            },
            {
              id: 3,
              title: 'Customer Favorite',
              description: 'Highest satisfaction score',
              icon: '❤️',
              date: '2024-01-15'
            }
          ]
        };
        
        setPerformance(mockPerformance);
      } catch (error) {
        console.error('Failed to load performance:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, [timeframe]);

  const getKpiColor = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrendColor = (trend) => {
    return trend.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  if (!performance) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading performance data...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Performance Tracker</h1>
              <p className="text-gray-600">{performance.officer} - {performance.period}</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              <Button variant="outline" size="sm">
                📊 Export Report
              </Button>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Calls Completed</p>
                    <p className="text-2xl font-bold text-blue-900">{performance.callsCompleted}</p>
                    <p className="text-xs text-blue-700">Target: {performance.targetCalls}</p>
                  </div>
                  <div className="text-3xl">📞</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Customers Retained</p>
                    <p className="text-2xl font-bold text-green-900">{performance.customersRetained}</p>
                    <p className="text-xs text-green-700">Target: {performance.targetRetention}</p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Products Sold</p>
                    <p className="text-2xl font-bold text-purple-900">{performance.productsSold}</p>
                    <p className="text-xs text-purple-700">Target: {performance.targetSales}</p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Satisfaction Score</p>
                    <p className="text-2xl font-bold text-orange-900">{performance.satisfactionScore}</p>
                    <p className="text-xs text-orange-700">Target: 8.0</p>
                  </div>
                  <div className="text-3xl">😊</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* KPI Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>KPI Performance</Card.Title>
                <Card.Description>Detailed breakdown of key performance indicators</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {performance.kpis.map((kpi, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getKpiColor(kpi.color)}`}>
                          {kpi.percentage}%
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{kpi.current}</span>
                          <span>{kpi.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              kpi.color === 'blue' ? 'bg-blue-500' :
                              kpi.color === 'green' ? 'bg-green-500' :
                              kpi.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${Math.min(kpi.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Trend:</span>
                        <span className={`font-medium ${getTrendColor(kpi.trend)}`}>
                          {kpi.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Recent Activity</Card.Title>
                <Card.Description>Your latest customer interactions</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {performance.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">
                        {activity.type === 'Call' ? '📞' : '💰'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.customer}</h4>
                        <p className="text-sm text-gray-600">{activity.outcome}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{activity.satisfaction}/10</p>
                        <p className="text-xs text-gray-500">Satisfaction</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Achievements */}
          <Card>
            <Card.Header>
              <Card.Title>Achievements & Recognition</Card.Title>
              <Card.Description>Your recent accomplishments and milestones</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {performance.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500">{achievement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Action Items */}
          <Card>
            <Card.Header>
              <Card.Title>Performance Insights</Card.Title>
              <Card.Description>Recommendations to improve your performance</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🎯 Focus Areas</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Increase call volume to meet daily targets</li>
                    <li>• Focus on high-value customer retention</li>
                    <li>• Improve product knowledge for better sales</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">💡 Opportunities</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Leverage your high satisfaction scores</li>
                    <li>• Cross-sell to existing retained customers</li>
                    <li>• Share best practices with team</li>
                  </ul>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTracker;