import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const KPITracking = () => {
  const { isCollapsed } = useSidebar();
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('week');
  const [selectedTeam, setSelectedTeam] = useState('all');

  useEffect(() => {
    const loadKpiData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock KPI data
        const mockKpiData = {
          teamPerformance: [
            {
              team: 'Retention Team A',
              officers: 8,
              callsCompleted: 320,
              customersRetained: 285,
              productsSold: 45,
              satisfactionScore: 8.4,
              targetAchievement: 95
            },
            {
              team: 'Retention Team B',
              officers: 6,
              callsCompleted: 280,
              customersRetained: 245,
              productsSold: 38,
              satisfactionScore: 8.1,
              targetAchievement: 88
            },
            {
              team: 'Retention Team C',
              officers: 7,
              callsCompleted: 295,
              customersRetained: 268,
              productsSold: 42,
              satisfactionScore: 8.6,
              targetAchievement: 92
            }
          ],
          individualPerformance: [
            {
              name: 'Alice Mukamana',
              team: 'Retention Team A',
              callsCompleted: 45,
              customersRetained: 38,
              productsSold: 12,
              satisfactionScore: 8.2,
              rank: 1,
              trend: '+5%'
            },
            {
              name: 'John Nkurunziza',
              team: 'Retention Team A',
              callsCompleted: 42,
              customersRetained: 35,
              productsSold: 10,
              satisfactionScore: 8.0,
              rank: 2,
              trend: '+3%'
            },
            {
              name: 'Grace Uwimana',
              team: 'Retention Team B',
              callsCompleted: 48,
              customersRetained: 40,
              productsSold: 8,
              satisfactionScore: 8.5,
              rank: 3,
              trend: '+7%'
            }
          ],
          kpiMetrics: [
            {
              name: 'Overall Retention Rate',
              current: 89.2,
              target: 85.0,
              trend: '+2.1%',
              color: 'green'
            },
            {
              name: 'Average Call Duration',
              current: 18.5,
              target: 20.0,
              trend: '-1.5min',
              color: 'blue'
            },
            {
              name: 'Customer Satisfaction',
              current: 8.4,
              target: 8.0,
              trend: '+0.4',
              color: 'purple'
            },
            {
              name: 'Product Sales Rate',
              current: 15.2,
              target: 18.0,
              trend: '+1.2%',
              color: 'orange'
            }
          ]
        };
        
        setKpiData(mockKpiData);
      } catch (error) {
        console.error('Failed to load KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKpiData();
  }, [timeframe, selectedTeam]);

  const getTrendColor = (trend) => {
    return trend.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  const getKpiColor = (color) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!kpiData) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading KPI data...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">KPI Tracking</h1>
              <p className="text-gray-600">Team and individual performance metrics</p>
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
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Teams</option>
                <option value="team-a">Retention Team A</option>
                <option value="team-b">Retention Team B</option>
                <option value="team-c">Retention Team C</option>
              </select>
              <Button variant="outline" size="sm">
                📊 Export Report
              </Button>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.kpiMetrics.map((metric, index) => (
              <Card key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <Card.Content>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">{metric.name}</p>
                      <p className="text-2xl font-bold text-blue-900">{metric.current}%</p>
                      <p className="text-xs text-blue-700">Target: {metric.target}%</p>
                    </div>
                    <div className="text-3xl">📊</div>
                  </div>
                  <div className="mt-2">
                    <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                      {metric.trend}
                    </span>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Team Performance */}
          <Card>
            <Card.Header>
              <Card.Title>Team Performance</Card.Title>
              <Card.Description>Performance metrics by team</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {kpiData.teamPerformance.map((team, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{team.team}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getKpiColor('green')}`}>
                        {team.targetAchievement}% Target Achievement
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Officers</p>
                        <p className="text-lg font-semibold text-gray-900">{team.officers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Calls Completed</p>
                        <p className="text-lg font-semibold text-gray-900">{team.callsCompleted}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Customers Retained</p>
                        <p className="text-lg font-semibold text-gray-900">{team.customersRetained}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Products Sold</p>
                        <p className="text-lg font-semibold text-gray-900">{team.productsSold}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Satisfaction Score: <span className="font-medium">{team.satisfactionScore}</span></span>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Individual Performance */}
          <Card>
            <Card.Header>
              <Card.Title>Top Performers</Card.Title>
              <Card.Description>Individual officer performance rankings</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {kpiData.individualPerformance.map((officer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {officer.rank}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{officer.name}</h4>
                        <p className="text-sm text-gray-600">{officer.team}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Calls</p>
                        <p className="font-semibold">{officer.callsCompleted}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Retained</p>
                        <p className="font-semibold">{officer.customersRetained}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Sales</p>
                        <p className="font-semibold">{officer.productsSold}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Satisfaction</p>
                        <p className="font-semibold">{officer.satisfactionScore}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Trend</p>
                        <p className={`font-semibold ${getTrendColor(officer.trend)}`}>{officer.trend}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Performance Insights */}
          <Card>
            <Card.Header>
              <Card.Title>Performance Insights</Card.Title>
              <Card.Description>Key insights and recommendations</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">🎯 Strengths</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• High customer satisfaction scores across all teams</li>
                    <li>• Strong retention rates exceeding targets</li>
                    <li>• Consistent performance improvement trends</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Opportunities</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Focus on increasing product sales rates</li>
                    <li>• Optimize call duration for efficiency</li>
                    <li>• Share best practices across teams</li>
                  </ul>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading KPI data...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPITracking;