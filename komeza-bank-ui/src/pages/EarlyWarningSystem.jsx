import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const EarlyWarningSystem = () => {
  const { isCollapsed } = useSidebar();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertFilter, setAlertFilter] = useState('all');

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock alert data
        const mockAlerts = [
          {
            id: 'A001',
            customer: 'Jean Baptiste',
            customerId: 'C1001',
            alertType: 'High Risk',
            severity: 'Critical',
            message: 'Customer shows 87% churn probability - immediate action required',
            timestamp: '2024-01-22 14:30',
            status: 'Active',
            actions: ['Call customer', 'Offer retention incentive', 'Escalate to manager']
          },
          {
            id: 'A002',
            customer: 'Marie Claire',
            customerId: 'C1002',
            alertType: 'Transaction Pattern',
            severity: 'High',
            message: 'Unusual transaction pattern detected - potential account closure',
            timestamp: '2024-01-22 12:15',
            status: 'Active',
            actions: ['Review transaction history', 'Contact customer', 'Monitor account']
          },
          {
            id: 'A003',
            customer: 'Peter Nkurunziza',
            customerId: 'C1003',
            alertType: 'Digital Engagement',
            severity: 'Medium',
            message: 'Low digital banking usage - risk of switching to digital-only competitors',
            timestamp: '2024-01-22 10:45',
            status: 'Active',
            actions: ['Send digital banking tutorial', 'Offer digital incentives', 'Schedule training call']
          },
          {
            id: 'A004',
            customer: 'Sarah Uwimana',
            customerId: 'C1004',
            alertType: 'Complaint Spike',
            severity: 'High',
            message: 'Multiple complaints in last 7 days - customer satisfaction declining',
            timestamp: '2024-01-21 16:20',
            status: 'Resolved',
            actions: ['Issue resolved', 'Customer retained', 'Follow-up scheduled']
          }
        ];
        
        setAlerts(mockAlerts);
      } catch (error) {
        console.error('Failed to load alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'active') return alert.status === 'Active';
    if (alertFilter === 'resolved') return alert.status === 'Resolved';
    return true;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-600 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-600';
      case 'Resolved': return 'bg-green-100 text-green-600';
      case 'In Progress': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Early Warning System</h1>
              <p className="text-gray-600">Real-time churn alerts and customer risk signals</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                🔔 Mark All Read
              </Button>
              <Button variant="primary" size="sm">
                ⚙️ Alert Settings
              </Button>
            </div>
          </div>

          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Critical Alerts</p>
                    <p className="text-2xl font-bold text-red-900">
                      {alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length}
                    </p>
                  </div>
                  <div className="text-3xl">🚨</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">High Priority</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {alerts.filter(a => a.severity === 'High' && a.status === 'Active').length}
                    </p>
                  </div>
                  <div className="text-3xl">⚠️</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Medium Priority</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {alerts.filter(a => a.severity === 'Medium' && a.status === 'Active').length}
                    </p>
                  </div>
                  <div className="text-3xl">📋</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Resolved Today</p>
                    <p className="text-2xl font-bold text-green-900">
                      {alerts.filter(a => a.status === 'Resolved').length}
                    </p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <Card.Content>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-3">
                  <select
                    value={alertFilter}
                    onChange={(e) => setAlertFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Alerts</option>
                    <option value="active">Active Alerts</option>
                    <option value="resolved">Resolved Alerts</option>
                  </select>
                  <Button variant="outline" size="sm">
                    Export Alerts
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Alert List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity).split(' ')[0]} ${getSeverityColor(alert.severity).split(' ')[1]}`}>
                <Card.Content>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.customer}</h3>
                        <span className="text-sm text-gray-600">({alert.customerId})</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">{alert.alertType}</h4>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>

                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Recommended Actions:</h5>
                        <div className="flex flex-wrap gap-2">
                          {alert.actions.map((action, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500">Alert Time: {alert.timestamp}</p>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        View Customer
                      </Button>
                      {alert.status === 'Active' && (
                        <Button size="sm" variant="primary">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading alerts...</span>
            </div>
          )}

          {/* Empty State */}
          {filteredAlerts.length === 0 && !loading && (
            <Card>
              <Card.Content>
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">🔔</div>
                  <h3 className="text-sm font-medium text-gray-900">No alerts found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your filters or check back later</p>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarlyWarningSystem;