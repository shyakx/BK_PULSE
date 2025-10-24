import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const CampaignExecution = () => {
  const { isCollapsed } = useSidebar();
  const [campaigns, setCampaigns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [newLog, setNewLog] = useState({
    customerId: '',
    outcome: '',
    notes: '',
    followUpDate: ''
  });

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock campaigns data
        const mockCampaigns = {
          activeCampaigns: [
            {
              id: 1,
              name: 'High-Value Customer Retention',
              type: 'Retention',
              segment: 'Corporate',
              status: 'Active',
              startDate: '2024-01-15',
              endDate: '2024-02-15',
              targetCustomers: 500,
              contacted: 420,
              conversions: 315,
              retentionRate: 75,
              description: 'Targeted retention campaign for high-value corporate customers',
              strategy: 'Personalized outreach with exclusive offers and relationship management',
              assignedCustomers: [
                {
                  id: 'CUST001',
                  name: 'Rwanda Development Bank',
                  churnProbability: 85,
                  priority: 'High',
                  lastContact: '2024-01-20',
                  status: 'Pending'
                },
                {
                  id: 'CUST002',
                  name: 'Kigali Business Center',
                  churnProbability: 72,
                  priority: 'High',
                  lastContact: '2024-01-18',
                  status: 'Contacted'
                },
                {
                  id: 'CUST003',
                  name: 'Tech Solutions Ltd',
                  churnProbability: 45,
                  priority: 'Medium',
                  lastContact: '2024-01-22',
                  status: 'Pending'
                }
              ]
            },
            {
              id: 2,
              name: 'Digital Engagement Drive',
              type: 'Engagement',
              segment: 'Retail',
              status: 'Active',
              startDate: '2024-01-20',
              endDate: '2024-02-20',
              targetCustomers: 2000,
              contacted: 1800,
              conversions: 1350,
              retentionRate: 75,
              description: 'Digital-first campaign to increase engagement among retail customers',
              strategy: 'SMS, email, and mobile app notifications with personalized content',
              assignedCustomers: [
                {
                  id: 'CUST004',
                  name: 'Rwanda Commercial Bank',
                  churnProbability: 35,
                  priority: 'Medium',
                  lastContact: '2024-01-21',
                  status: 'Contacted'
                },
                {
                  id: 'CUST005',
                  name: 'Kigali Manufacturing Co',
                  churnProbability: 28,
                  priority: 'Low',
                  lastContact: '2024-01-19',
                  status: 'Pending'
                }
              ]
            }
          ],
          completedCampaigns: [
            {
              id: 3,
              name: 'SME Growth Initiative',
              type: 'Growth',
              segment: 'SME',
              status: 'Completed',
              startDate: '2024-01-01',
              endDate: '2024-01-31',
              targetCustomers: 800,
              contacted: 750,
              conversions: 600,
              retentionRate: 80,
              description: 'Growth campaign targeting SME customers with additional product offerings',
              strategy: 'Cross-selling and upselling with dedicated SME relationship managers',
              results: {
                revenue: 25000000,
                cost: 5000000,
                roi: 400,
                satisfaction: 8.5
              }
            }
          ],
          interactionLogs: [
            {
              id: 1,
              campaignId: 1,
              customerId: 'CUST001',
              customerName: 'Rwanda Development Bank',
              date: '2024-01-22',
              type: 'Phone Call',
              outcome: 'Positive',
              notes: 'Customer expressed interest in new investment products. Scheduled follow-up meeting.',
              followUpDate: '2024-01-29',
              officer: 'Grace Uwimana'
            },
            {
              id: 2,
              campaignId: 1,
              customerId: 'CUST002',
              customerName: 'Kigali Business Center',
              date: '2024-01-20',
              type: 'Email',
              outcome: 'Neutral',
              notes: 'Sent information about treasury services. Awaiting response.',
              followUpDate: '2024-01-27',
              officer: 'John Nkurunziza'
            },
            {
              id: 3,
              campaignId: 2,
              customerId: 'CUST004',
              customerName: 'Rwanda Commercial Bank',
              date: '2024-01-21',
              type: 'Meeting',
              outcome: 'Positive',
              notes: 'Quarterly business review meeting. Customer satisfied with services.',
              followUpDate: '2024-04-21',
              officer: 'Peter Nkurunziza'
            }
          ]
        };
        
        setCampaigns(mockCampaigns);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const handleLogInteraction = (e) => {
    e.preventDefault();
    if (!newLog.customerId || !newLog.outcome || !newLog.notes) {
      alert('Please fill in all required fields');
      return;
    }

    const newInteraction = {
      id: Date.now(),
      campaignId: selectedCampaign?.id,
      customerId: newLog.customerId,
      customerName: selectedCampaign?.assignedCustomers.find(c => c.id === newLog.customerId)?.name || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      type: 'Phone Call',
      outcome: newLog.outcome,
      notes: newLog.notes,
      followUpDate: newLog.followUpDate,
      officer: 'Current Officer'
    };

    setCampaigns(prev => ({
      ...prev,
      interactionLogs: [newInteraction, ...prev.interactionLogs]
    }));

    setNewLog({
      customerId: '',
      outcome: '',
      notes: '',
      followUpDate: ''
    });
    setShowLogForm(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-600';
      case 'Completed': return 'bg-blue-100 text-blue-600';
      case 'Pending': return 'bg-yellow-100 text-yellow-600';
      case 'Contacted': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'Positive': return 'bg-green-100 text-green-600';
      case 'Neutral': return 'bg-yellow-100 text-yellow-600';
      case 'Negative': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!campaigns) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading campaigns...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Campaign Execution</h1>
              <p className="text-gray-600">Log campaign interactions and track outcomes</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Campaign Analytics
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowLogForm(true)}>
                📝 Log Interaction
              </Button>
            </div>
          </div>

          {/* Campaign Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Campaigns</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{campaigns.activeCampaigns.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">🔄</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Interactions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{campaigns.interactionLogs.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📞</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{campaigns.completedCampaigns.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">✅</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg Retention Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {Math.round(campaigns.activeCampaigns.reduce((sum, c) => sum + c.retentionRate, 0) / campaigns.activeCampaigns.length)}%
                    </p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📊</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Active Campaigns */}
          <Card>
            <Card.Header>
              <Card.Title>Active Campaigns</Card.Title>
              <Card.Description>Currently running campaigns and assigned customers</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {campaigns.activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                            {campaign.type}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                            {campaign.segment}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Target Customers</p>
                            <p className="text-lg font-bold text-gray-900">{campaign.targetCustomers}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Contacted</p>
                            <p className="text-lg font-bold text-blue-600">{campaign.contacted}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Conversions</p>
                            <p className="text-lg font-bold text-green-600">{campaign.conversions}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Retention Rate</p>
                            <p className="text-lg font-bold text-purple-600">{campaign.retentionRate}%</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Duration: {campaign.startDate} - {campaign.endDate}</span>
                          <span>Progress: {Math.round((campaign.contacted / campaign.targetCustomers) * 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="primary" onClick={() => setSelectedCampaign(campaign)}>
                          👁️ View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          📊 Analytics
                        </Button>
                      </div>
                    </div>
                    
                    {/* Assigned Customers */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Assigned Customers</h4>
                      <div className="space-y-2">
                        {campaign.assignedCustomers.map((customer, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-900">{customer.name}</span>
                              <span className="text-sm text-gray-600">({customer.id})</span>
                              <span className="text-sm text-gray-600">Churn: {customer.churnProbability}%</span>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(customer.priority)}`}>
                                {customer.priority}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                                {customer.status}
                              </span>
                              <Button size="sm" variant="outline">
                                📞 Contact
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Log Interaction Form */}
          {showLogForm && (
            <Card>
              <Card.Header>
                <Card.Title>Log Campaign Interaction</Card.Title>
                <Card.Description>Record customer interaction and outcome</Card.Description>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleLogInteraction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                      <select
                        value={newLog.customerId}
                        onChange={(e) => setNewLog(prev => ({ ...prev, customerId: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select customer...</option>
                        {campaigns.activeCampaigns.flatMap(c => c.assignedCustomers).map(customer => (
                          <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                      <select
                        value={newLog.outcome}
                        onChange={(e) => setNewLog(prev => ({ ...prev, outcome: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select outcome...</option>
                        <option value="Positive">Positive</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Negative">Negative</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newLog.notes}
                      onChange={(e) => setNewLog(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Describe the interaction and outcome..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={newLog.followUpDate}
                      onChange={(e) => setNewLog(prev => ({ ...prev, followUpDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button type="submit" variant="primary">
                      📝 Log Interaction
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowLogForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          )}

          {/* Interaction Logs */}
          <Card>
            <Card.Header>
              <Card.Title>Interaction Logs</Card.Title>
              <Card.Description>Recent campaign interactions and outcomes</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {campaigns.interactionLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-medium text-gray-900">{log.customerName}</h4>
                          <span className="text-sm text-gray-600">({log.customerId})</span>
                          <span className="text-sm text-gray-600">{log.date}</span>
                          <span className="text-sm text-gray-600">by {log.officer}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.notes}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Type: {log.type}</span>
                          <span>Follow-up: {log.followUpDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getOutcomeColor(log.outcome)}`}>
                          {log.outcome}
                        </span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Completed Campaigns */}
          <Card>
            <Card.Header>
              <Card.Title>Completed Campaigns</Card.Title>
              <Card.Description>Recently completed campaigns with results</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {campaigns.completedCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                            {campaign.type}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                            {campaign.segment}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Target Customers</p>
                            <p className="text-lg font-bold text-gray-900">{campaign.targetCustomers}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Contacted</p>
                            <p className="text-lg font-bold text-blue-600">{campaign.contacted}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Conversions</p>
                            <p className="text-lg font-bold text-green-600">{campaign.conversions}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Retention Rate</p>
                            <p className="text-lg font-bold text-purple-600">{campaign.retentionRate}%</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Revenue</p>
                            <p className="text-lg font-bold text-green-600">{(campaign.results.revenue / 1000000).toFixed(1)}M RWF</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Cost</p>
                            <p className="text-lg font-bold text-red-600">{(campaign.results.cost / 1000000).toFixed(1)}M RWF</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">ROI</p>
                            <p className="text-lg font-bold text-blue-600">{campaign.results.roi}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Satisfaction</p>
                            <p className="text-lg font-bold text-purple-600">{campaign.results.satisfaction}/10</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          📊 View Results
                        </Button>
                        <Button size="sm" variant="outline">
                          📋 Lessons Learned
                        </Button>
                      </div>
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
              <span className="ml-2 text-gray-600">Loading campaigns...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignExecution;
