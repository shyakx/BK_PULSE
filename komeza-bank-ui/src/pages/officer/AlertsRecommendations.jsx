import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const AlertsRecommendations = () => {
  const { isCollapsed } = useSidebar();
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock alerts data
        const mockAlerts = {
          urgent: [
            {
              id: 1,
              type: 'urgent',
              title: 'High-Risk Customer Alert',
              description: 'Customer CUST001 has 95% churn probability and requires immediate attention',
              customer: {
                id: 'CUST001',
                name: 'Rwanda Development Bank',
                segment: 'Corporate',
                churnProbability: 95,
                lastContact: '2024-01-15',
                products: ['Current Account', 'Treasury Services', 'Investment']
              },
              priority: 'Critical',
              timestamp: '2024-01-22T10:30:00Z',
              actions: [
                'Schedule immediate follow-up call',
                'Prepare retention package',
                'Escalate to senior management'
              ],
              status: 'pending'
            },
            {
              id: 2,
              type: 'urgent',
              title: 'Customer Complaint Escalation',
              description: 'Customer CUST002 has filed a formal complaint about service delays',
              customer: {
                id: 'CUST002',
                name: 'Kigali Business Center',
                segment: 'SME',
                churnProbability: 85,
                lastContact: '2024-01-20',
                products: ['Business Account', 'Loan Facility']
              },
              priority: 'High',
              timestamp: '2024-01-22T09:15:00Z',
              actions: [
                'Contact customer within 2 hours',
                'Prepare resolution plan',
                'Schedule follow-up meeting'
              ],
              status: 'pending'
            }
          ],
          recommendations: [
            {
              id: 3,
              type: 'recommendation',
              title: 'Cross-Sell Opportunity',
              description: 'Customer CUST003 is eligible for Tekana investment product',
              customer: {
                id: 'CUST003',
                name: 'Tech Solutions Ltd',
                segment: 'SME',
                churnProbability: 45,
                lastContact: '2024-01-18',
                products: ['Business Account', 'Credit Facility']
              },
              priority: 'Medium',
              timestamp: '2024-01-22T08:45:00Z',
              actions: [
                'Schedule product presentation',
                'Prepare personalized offer',
                'Follow up within 1 week'
              ],
              status: 'pending',
              opportunity: {
                product: 'Tekana Investment',
                potentialValue: 5000000,
                probability: 70
              }
            },
            {
              id: 4,
              type: 'recommendation',
              title: 'Retention Campaign Suggestion',
              description: 'Customer CUST004 shows early churn signals and needs proactive engagement',
              customer: {
                id: 'CUST004',
                name: 'Rwanda Commercial Bank',
                segment: 'Retail',
                churnProbability: 65,
                lastContact: '2024-01-16',
                products: ['Savings Account', 'Mobile Banking']
              },
              priority: 'Medium',
              timestamp: '2024-01-22T07:30:00Z',
              actions: [
                'Send personalized communication',
                'Offer exclusive benefits',
                'Schedule relationship review'
              ],
              status: 'pending',
              opportunity: {
                product: 'Premium Banking',
                potentialValue: 2000000,
                probability: 60
              }
            }
          ],
          insights: [
            {
              id: 5,
              type: 'insight',
              title: 'Segment Performance Alert',
              description: 'Corporate segment showing 15% increase in churn risk this month',
              priority: 'Medium',
              timestamp: '2024-01-22T06:00:00Z',
              actions: [
                'Review segment strategy',
                'Analyze root causes',
                'Implement targeted campaigns'
              ],
              status: 'pending',
              metrics: {
                segment: 'Corporate',
                churnIncrease: 15,
                affectedCustomers: 25,
                timeframe: '30 days'
              }
            },
            {
              id: 6,
              type: 'insight',
              title: 'Product Usage Decline',
              description: 'Mobile banking usage decreased by 20% among retail customers',
              priority: 'Low',
              timestamp: '2024-01-21T16:00:00Z',
              actions: [
                'Investigate technical issues',
                'Send usage reminders',
                'Provide training support'
              ],
              status: 'pending',
              metrics: {
                product: 'Mobile Banking',
                usageDecline: 20,
                affectedCustomers: 150,
                timeframe: '14 days'
              }
            }
          ],
          system: [
            {
              id: 7,
              type: 'system',
              title: 'Model Performance Alert',
              description: 'Churn prediction model accuracy dropped to 85% (target: 90%)',
              priority: 'High',
              timestamp: '2024-01-22T05:00:00Z',
              actions: [
                'Review model performance',
                'Check data quality',
                'Schedule model retraining'
              ],
              status: 'pending',
              metrics: {
                currentAccuracy: 85,
                targetAccuracy: 90,
                lastRetraining: '2024-01-15',
                nextRetraining: '2024-01-29'
              }
            }
          ]
        };
        
        setAlerts(mockAlerts);
      } catch (error) {
        console.error('Failed to load alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-600 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent': return '🚨';
      case 'recommendation': return '💡';
      case 'insight': return '📊';
      case 'system': return '⚙️';
      default: return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'in_progress': return 'bg-blue-100 text-blue-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'dismissed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredAlerts = () => {
    if (!alerts) return [];
    
    let allAlerts = [
      ...alerts.urgent,
      ...alerts.recommendations,
      ...alerts.insights,
      ...alerts.system
    ];
    
    if (filter !== 'all') {
      allAlerts = allAlerts.filter(alert => alert.type === filter);
    }
    
    return allAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const handleAction = (alertId, action) => {
    console.log(`Action ${action} taken for alert ${alertId}`);
    // Here you would typically update the alert status or trigger the action
  };

  if (!alerts) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading alerts...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Alerts & Recommendations</h1>
              <p className="text-gray-600">Actionable insights and customer alerts</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                🔔 Mark All Read
              </Button>
              <Button variant="primary" size="sm">
                📊 View Analytics
              </Button>
            </div>
          </div>

          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="danger" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Urgent Alerts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{alerts.urgent.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">🚨</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Recommendations</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{alerts.recommendations.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">💡</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Insights</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{alerts.insights.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📊</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">System Alerts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{alerts.system.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">⚙️</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'all', label: 'All Alerts', count: filteredAlerts().length },
              { id: 'urgent', label: 'Urgent', count: alerts.urgent.length },
              { id: 'recommendation', label: 'Recommendations', count: alerts.recommendations.length },
              { id: 'insight', label: 'Insights', count: alerts.insights.length },
              { id: 'system', label: 'System', count: alerts.system.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  filter === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts().map(alert => (
              <Card 
                key={alert.id} 
                className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                  selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedAlert(alert)}
              >
                <Card.Content>
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{alert.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(alert.priority)}`}>
                            {alert.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                      
                      {alert.customer && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{alert.customer.name}</h4>
                              <p className="text-sm text-gray-600">{alert.customer.id} • {alert.customer.segment}</p>
                              <p className="text-sm text-gray-600">Churn: {alert.customer.churnProbability}%</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Last Contact</p>
                              <p className="text-sm font-medium text-gray-900">{alert.customer.lastContact}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        <span>{alert.actions.length} actions</span>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Selected Alert Details */}
          {selectedAlert && (
            <Card>
              <Card.Header>
                <div className="flex items-start justify-between">
                  <div>
                    <Card.Title className="flex items-center space-x-2">
                      <span>{getTypeIcon(selectedAlert.type)}</span>
                      <span>{selectedAlert.title}</span>
                    </Card.Title>
                    <Card.Description>{selectedAlert.description}</Card.Description>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedAlert(null)}>
                    ✕ Close
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  {/* Customer Details */}
                  {selectedAlert.customer && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Customer Name</p>
                            <p className="font-medium text-gray-900">{selectedAlert.customer.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Customer ID</p>
                            <p className="font-medium text-gray-900">{selectedAlert.customer.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Segment</p>
                            <p className="font-medium text-gray-900">{selectedAlert.customer.segment}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Churn Probability</p>
                            <p className="font-medium text-red-600">{selectedAlert.customer.churnProbability}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Last Contact</p>
                            <p className="font-medium text-gray-900">{selectedAlert.customer.lastContact}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Products</p>
                            <p className="font-medium text-gray-900">{selectedAlert.customer.products.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Opportunity Details */}
                  {selectedAlert.opportunity && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Opportunity Details</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Product</p>
                            <p className="font-medium text-gray-900">{selectedAlert.opportunity.product}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Potential Value</p>
                            <p className="font-medium text-gray-900">{(selectedAlert.opportunity.potentialValue / 1000000).toFixed(1)}M RWF</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Probability</p>
                            <p className="font-medium text-gray-900">{selectedAlert.opportunity.probability}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  {selectedAlert.metrics && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Key Metrics</h4>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(selectedAlert.metrics).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="font-medium text-gray-900">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recommended Actions</h4>
                    <div className="space-y-3">
                      {selectedAlert.actions.map((action, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-blue-600">•</span>
                          <span className="text-sm text-gray-700">{action}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleAction(selectedAlert.id, action)}
                          >
                            Execute
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <Button variant="primary" size="sm">
                      ✅ Mark as Completed
                    </Button>
                    <Button variant="outline" size="sm">
                      📝 Add Note
                    </Button>
                    <Button variant="outline" size="sm">
                      ⏰ Set Reminder
                    </Button>
                    <Button variant="outline" size="sm">
                      ❌ Dismiss
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading alerts...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsRecommendations;
