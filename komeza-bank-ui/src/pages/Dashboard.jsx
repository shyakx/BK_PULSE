import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar.jsx';
import { api } from '../services/api.ts';

const Dashboard = () => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [model, setModel] = useState(null);

  const segments = [
    { id: 'all', name: 'All Customers', count: 1247 },
    { id: 'retail', name: 'Retail', count: 856 },
    { id: 'sme', name: 'SME', count: 234 },
    { id: 'corporate', name: 'Corporate', count: 157 },
  ];

  const riskLevels = [
    { level: 'High Risk', count: 1247, percentage: 12.5, color: 'danger', bgColor: 'bg-danger-50', textColor: 'text-danger-600' },
    { level: 'Medium Risk', count: 3456, percentage: 34.6, color: 'accent', bgColor: 'bg-accent-50', textColor: 'text-accent-600' },
    { level: 'Low Risk', count: 8297, percentage: 52.9, color: 'primary', bgColor: 'bg-primary-50', textColor: 'text-primary-600' },
  ];

  const recentAlerts = [
    { id: 1, customer: 'CUST-001234', risk: 'High', segment: 'Retail', reason: 'No transactions in 30 days', time: '2 hours ago' },
    { id: 2, customer: 'CUST-005678', risk: 'High', segment: 'SME', reason: 'Multiple complaints', time: '4 hours ago' },
    { id: 3, customer: 'CUST-009012', risk: 'Medium', segment: 'Retail', reason: 'Decreased digital usage', time: '6 hours ago' },
    { id: 4, customer: 'CUST-003456', risk: 'High', segment: 'Corporate', reason: 'Account balance declining', time: '8 hours ago' },
  ];

  const topDrivers = [
    { driver: 'Days Since Last Transaction', impact: 0.23, trend: 'up' },
    { driver: 'Digital Login Frequency', impact: 0.18, trend: 'down' },
    { driver: 'Account Balance Trend', impact: 0.15, trend: 'down' },
    { driver: 'Complaints Count', impact: 0.12, trend: 'up' },
    { driver: 'NPS Score', impact: 0.10, trend: 'down' },
  ];

  useEffect(() => {
    api.getScoreSummary().then(setSummary);
    api.getAlerts(6).then(setAlerts);
    api.getModelStatus().then(setModel);
  }, []);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-1">
      {/* Header */}
      <div className="bg-primary-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Churn Intelligence Dashboard</h1>
              <p className="text-white/80 mt-1">Monitor customer churn risk and retention strategies</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                Export Report
              </Button>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                Generate Insights
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Segment Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {segments.map((segment) => (
              <button
                key={segment.id}
                onClick={() => setSelectedSegment(segment.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSegment === segment.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {segment.name} ({segment.count})
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="default" shadow="medium" hover>
            <Card.Content>
              <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">13,000</p>
              </div>
              <div className="text-4xl opacity-60 text-gray-600">👥</div>
            </div>
            </Card.Content>
          </Card>

          <Card variant="danger" shadow="medium" hover>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Churn Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">3.2%</p>
                </div>
                <div className="text-4xl opacity-60 text-gray-600">📉</div>
              </div>
            </Card.Content>
          </Card>

          <Card variant="default" shadow="medium" hover>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Retention Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">96.8%</p>
                </div>
                <div className="text-4xl opacity-60 text-gray-600">📈</div>
              </div>
            </Card.Content>
          </Card>

          <Card variant="default" shadow="medium" hover>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Model Accuracy</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">85.2%</p>
                </div>
                <div className="text-4xl opacity-60 text-gray-600">🎯</div>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Risk Distribution */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <Card.Title>Churn Risk Distribution</Card.Title>
                <Card.Description>Current risk levels across customer segments</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {riskLevels.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          risk.color === 'danger' ? 'bg-danger-400' :
                          risk.color === 'accent' ? 'bg-accent-400' : 'bg-primary-400'
                        }`}></div>
                        <div>
                          <div className="font-medium text-gray-900">{risk.level}</div>
                          <div className="text-sm text-gray-500">{risk.count.toLocaleString()} customers</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${risk.textColor}`}>
                          {risk.percentage}%
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              risk.color === 'danger' ? 'bg-danger-400' :
                              risk.color === 'accent' ? 'bg-accent-400' : 'bg-primary-400'
                            }`}
                            style={{ width: `${risk.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Recent Alerts */}
          <div>
            <Card>
              <Card.Header>
                <Card.Title>Recent Alerts</Card.Title>
                <Card.Description>Latest high-risk customer notifications</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {alert.customer}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.risk === 'High' ? 'bg-danger-100 text-danger-600' : 'bg-accent-100 text-accent-600'
                        }`}>
                          {alert.risk} Risk
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{alert.reason}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{alert.segment}</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>

        {/* Top Churn Drivers */}
        <div className="mt-8">
          <Card>
            <Card.Header>
              <Card.Title>Top Churn Drivers</Card.Title>
              <Card.Description>Most influential factors in churn prediction</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {topDrivers.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{driver.driver}</div>
                        <div className="text-sm text-gray-500">
                          Impact: {(driver.impact * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${
                        driver.trend === 'up' ? 'text-danger-600' : 'text-accent-600'
                      }`}>
                        {driver.trend === 'up' ? '↗' : '↘'}
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-primary-400 rounded-full"
                          style={{ width: `${driver.impact * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
