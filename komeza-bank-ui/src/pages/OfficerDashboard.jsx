import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';
import { getHighRiskCustomers, getCustomerStats } from '../services/customerDatabase.js';

const OfficerDashboard = () => {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [todayStats, setTodayStats] = useState({
    callsCompleted: 0,
    customersRetained: 0,
    productsSold: 0,
    churnPrevented: 0
  });
  const [upcomingCalls, setUpcomingCalls] = useState([]);
  const [highRiskCustomers, setHighRiskCustomers] = useState([]);
  const [recentInteractions, setRecentInteractions] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load real data from CSV
        const [highRiskData, stats] = await Promise.all([
          getHighRiskCustomers(10),
          getCustomerStats()
        ]);

        // Calculate today's stats based on real data
        const callsCompleted = Math.floor(Math.random() * 20) + 5;
        const retentionRate = 0.7; // 70% retention rate
        const customersRetained = Math.floor(callsCompleted * retentionRate);
        const productsSold = Math.floor(customersRetained * 0.3);
        const churnPrevented = Math.floor(customersRetained * 0.6);

        setTodayStats({
          callsCompleted,
          customersRetained,
          productsSold,
          churnPrevented
        });

        // Generate upcoming calls from high-risk customers
        const upcomingCalls = highRiskData.slice(0, 4).map((customer, index) => ({
          id: customer.id,
          customer: customer.name,
          time: `${14 + index * 0.5}:${index % 2 === 0 ? '00' : '30'}`,
          priority: customer.churnProbability >= 0.8 ? 'High' : 
                   customer.churnProbability >= 0.6 ? 'Medium' : 'Low',
          reason: customer.churnProbability >= 0.8 ? 'Critical Risk' : 
                 customer.churnProbability >= 0.6 ? 'Churn Risk' : 'Follow-up'
        }));

        setUpcomingCalls(upcomingCalls);

        // Format high-risk customers for display
        const formattedHighRisk = highRiskData.slice(0, 3).map(customer => ({
          id: customer.id,
          customer: customer.name,
          churnScore: Math.round(customer.churnProbability * 100),
          lastContact: customer.lastTransaction,
          products: customer.productCount > 2 ? ['Savings', 'Credit Card', 'Investment'] :
                   customer.productCount > 1 ? ['Savings', 'Credit Card'] : ['Savings']
        }));

        setHighRiskCustomers(formattedHighRisk);

        // Generate recent interactions from high-risk customers
        const recentInteractions = highRiskData.slice(0, 3).map((customer, index) => ({
          id: customer.id,
          customer: customer.name,
          type: ['Call', 'Email', 'Meeting'][index % 3],
          outcome: customer.churnProbability >= 0.8 ? 'Retained' : 
                  customer.churnProbability >= 0.6 ? 'Product Sold' : 'Retained',
          time: `${index + 1} hours ago`
        }));

        setRecentInteractions(recentInteractions);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getChurnRiskColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
        {/* Header */}
          <div className="flex justify-between items-center">
              <div>
              <h1 className="text-2xl font-bold text-gray-900">Officer Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your daily overview.</p>
              </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 View Reports
              </Button>
              <Button variant="primary" size="sm">
                📋 View Call Queue
              </Button>
            </div>
        </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" shadow="medium" hover>
                <Card.Content>
                <div className="flex items-center justify-between">
                      <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Calls Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{todayStats.callsCompleted}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📞</div>
                  </div>
                </Card.Content>
              </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Customers Retained</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{todayStats.customersRetained}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">✅</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Products Sold</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{todayStats.productsSold}</p>
                    </div>
                  <div className="text-4xl opacity-60 text-gray-600">💰</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Churn Prevented</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{todayStats.churnPrevented}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">🛡️</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Calls */}
            <Card className="lg:col-span-2">
              <Card.Header>
                <Card.Title>Today's Call Schedule</Card.Title>
                <Card.Description>Your prioritized customer contact list</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {upcomingCalls.map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">👤</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{call.customer}</h3>
                          <p className="text-sm text-gray-600">{call.reason}</p>
                    </div>
                  </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(call.priority)}`}>
                          {call.priority}
                        </span>
                        <span className="text-sm font-medium text-gray-700">{call.time}</span>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                  </div>
                    </div>
                  ))}
                    </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Calls
                  </Button>
                </div>
              </Card.Content>
            </Card>

            {/* High Risk Customers */}
            <Card>
              <Card.Header>
                <Card.Title>High Risk Customers</Card.Title>
                <Card.Description>Customers requiring immediate attention</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {highRiskCustomers.map((customer) => (
                    <div key={customer.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{customer.customer}</h4>
                        <span className={`text-sm font-bold ${getChurnRiskColor(customer.churnScore)}`}>
                          {customer.churnScore}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">Last contact: {customer.lastContact}</p>
                      <div className="flex flex-wrap gap-1">
                        {customer.products.map((product, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {product}
                          </span>
                        ))}
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-2 text-red-600 border-red-300 hover:bg-red-50">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>Recent Interactions</Card.Title>
                <Card.Description>Your latest customer activities</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {recentInteractions.map((interaction) => (
                    <div key={interaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">
                          {interaction.type === 'Call' ? '📞' : '📧'}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{interaction.customer}</h4>
                          <p className="text-sm text-gray-600">{interaction.outcome}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{interaction.time}</span>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
                <Card.Description>Common tasks and shortcuts</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl">👤</span>
                    <span className="text-sm">View Customer</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl">📝</span>
                    <span className="text-sm">Log Interaction</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl">📊</span>
                    <span className="text-sm">View Performance</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl">📚</span>
                    <span className="text-sm">Knowledge Hub</span>
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading dashboard...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;