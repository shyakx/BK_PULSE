import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const CampaignManagement = () => {
  const { isCollapsed } = useSidebar();
  const [campaigns, setCampaigns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock campaigns data
        const mockCampaigns = {
          active: [
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
              revenue: 45000000,
              cost: 8000000,
              roi: 463,
              description: 'Targeted retention campaign for high-value corporate customers',
              strategy: 'Personalized outreach with exclusive offers and relationship management',
              channels: ['Phone', 'Email', 'In-person'],
              team: ['Alice Mukamana', 'John Nkurunziza', 'Grace Uwimana']
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
              revenue: 12000000,
              cost: 3000000,
              roi: 300,
              description: 'Digital-first campaign to increase engagement among retail customers',
              strategy: 'SMS, email, and mobile app notifications with personalized content',
              channels: ['SMS', 'Email', 'Mobile App'],
              team: ['Peter Nkurunziza', 'Sarah Uwimana']
            }
          ],
          completed: [
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
              revenue: 25000000,
              cost: 5000000,
              roi: 400,
              description: 'Growth campaign targeting SME customers with additional product offerings',
              strategy: 'Cross-selling and upselling with dedicated SME relationship managers',
              channels: ['Phone', 'Email', 'Webinar'],
              team: ['Alice Mukamana', 'John Nkurunziza']
            }
          ],
          draft: [
            {
              id: 4,
              name: 'Institutional Partnership Program',
              type: 'Partnership',
              segment: 'Institutional',
              status: 'Draft',
              startDate: '2024-02-01',
              endDate: '2024-03-01',
              targetCustomers: 100,
              contacted: 0,
              conversions: 0,
              retentionRate: 0,
              revenue: 0,
              cost: 0,
              roi: 0,
              description: 'Partnership program for institutional clients',
              strategy: 'Long-term relationship building and strategic partnerships',
              channels: ['In-person', 'Email', 'Events'],
              team: ['Grace Uwimana', 'Peter Nkurunziza']
            }
          ],
          templates: [
            {
              name: 'High-Risk Retention',
              description: 'Target customers with high churn probability',
              segment: 'All',
              duration: '30 days',
              expectedROI: 350
            },
            {
              name: 'Product Cross-sell',
              description: 'Cross-sell additional products to existing customers',
              segment: 'Retail',
              duration: '45 days',
              expectedROI: 280
            },
            {
              name: 'Digital Engagement',
              description: 'Increase digital channel engagement',
              segment: 'All',
              duration: '60 days',
              expectedROI: 250
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-600';
      case 'Completed': return 'bg-blue-100 text-blue-600';
      case 'Draft': return 'bg-yellow-100 text-yellow-600';
      case 'Paused': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Retention': return 'bg-red-100 text-red-600';
      case 'Engagement': return 'bg-blue-100 text-blue-600';
      case 'Growth': return 'bg-green-100 text-green-600';
      case 'Partnership': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const currentCampaigns = campaigns ? campaigns[filter] || [] : [];

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
              <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
              <p className="text-gray-600">Create, track, and log campaigns targeting segments</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Campaign Analytics
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowCreateCampaign(true)}>
                ➕ Create Campaign
              </Button>
            </div>
          </div>

          {/* Campaign Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Active Campaigns</p>
                    <p className="text-2xl font-bold text-green-900">{campaigns.active.length}</p>
                  </div>
                  <div className="text-3xl">🔄</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Completed</p>
                    <p className="text-2xl font-bold text-blue-900">{campaigns.completed.length}</p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Draft</p>
                    <p className="text-2xl font-bold text-yellow-900">{campaigns.draft.length}</p>
                  </div>
                  <div className="text-3xl">📝</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Total Campaigns</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {campaigns.active.length + campaigns.completed.length + campaigns.draft.length}
                    </p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active ({campaigns.active.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({campaigns.completed.length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'draft'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Draft ({campaigns.draft.length})
            </button>
          </div>

          {/* Create Campaign Form */}
          {showCreateCampaign && (
            <Card>
              <Card.Header>
                <Card.Title>Create New Campaign</Card.Title>
                <Card.Description>Set up a new retention or engagement campaign</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Campaign Name"
                      placeholder="Enter campaign name"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="retention">Retention</option>
                        <option value="engagement">Engagement</option>
                        <option value="growth">Growth</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Segment</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="all">All Segments</option>
                        <option value="retail">Retail</option>
                        <option value="corporate">Corporate</option>
                        <option value="sme">SME</option>
                        <option value="institutional">Institutional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="30">30 days</option>
                        <option value="45">45 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Description</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Describe the campaign objectives and strategy"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="primary">
                      Create Campaign
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Campaigns List */}
          <div className="space-y-4">
            {currentCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <Card.Content>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(campaign.type)}`}>
                          {campaign.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                          {campaign.segment}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Target Customers</p>
                          <p className="text-lg font-bold text-gray-900">{campaign.targetCustomers.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contacted</p>
                          <p className="text-lg font-bold text-blue-600">{campaign.contacted.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversions</p>
                          <p className="text-lg font-bold text-green-600">{campaign.conversions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Retention Rate</p>
                          <p className="text-lg font-bold text-purple-600">{campaign.retentionRate}%</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="text-lg font-bold text-green-600">{(campaign.revenue / 1000000).toFixed(1)}M RWF</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cost</p>
                          <p className="text-lg font-bold text-red-600">{(campaign.cost / 1000000).toFixed(1)}M RWF</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ROI</p>
                          <p className="text-lg font-bold text-blue-600">{campaign.roi}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Duration: {campaign.startDate} - {campaign.endDate}</span>
                        <span>Team: {campaign.team.join(', ')}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="primary">
                        👁️ View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        📊 Analytics
                      </Button>
                      <Button size="sm" variant="outline">
                        📝 Edit
                      </Button>
                    </div>
                  </div>
                  
                  {/* Campaign Strategy */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Strategy</h4>
                    <p className="text-sm text-gray-600 mb-3">{campaign.strategy}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {campaign.channels.map((channel, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {channel}
                          </span>
                        ))}
                      </div>
                      
                      {campaign.status === 'Active' && (
                        <div className="text-right text-sm">
                          <p className="text-gray-600">Progress: {Math.round((campaign.contacted / campaign.targetCustomers) * 100)}%</p>
                          <p className="text-gray-600">Days Remaining: {Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Campaign Templates */}
          <Card>
            <Card.Header>
              <Card.Title>Campaign Templates</Card.Title>
              <Card.Description>Pre-configured campaign templates for quick setup</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaigns.templates.map((template, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <Card.Content>
                      <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="space-y-1 text-sm text-gray-500 mb-3">
                        <p>Segment: {template.segment}</p>
                        <p>Duration: {template.duration}</p>
                        <p>Expected ROI: {template.expectedROI}%</p>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        🎯 Use Template
                      </Button>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Empty State */}
          {currentCampaigns.length === 0 && (
            <Card>
              <Card.Content>
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">
                    {filter === 'active' ? '🔄' : filter === 'completed' ? '✅' : '📝'}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">
                    No {filter} campaigns
                  </h3>
                  <p className="text-sm text-gray-500">
                    {filter === 'active' 
                      ? 'No campaigns are currently active'
                      : filter === 'completed'
                      ? 'No campaigns have been completed yet'
                      : 'No draft campaigns available'
                    }
                  </p>
                </div>
              </Card.Content>
            </Card>
          )}

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

export default CampaignManagement;
