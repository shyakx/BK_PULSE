import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const CampaignApprovals = () => {
  const { isCollapsed } = useSidebar();
  const [campaigns, setCampaigns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock campaigns data
        const mockCampaigns = {
          pending: [
            {
              id: 1,
              name: 'High-Value Customer Retention',
              type: 'Retention',
              segment: 'Corporate',
              createdBy: 'John Nkurunziza',
              createdDate: '2024-01-20',
              targetCustomers: 500,
              budget: 15000000,
              expectedROI: 350,
              description: 'Targeted retention campaign for high-value corporate customers showing churn signals',
              strategy: 'Personalized outreach with exclusive offers and relationship management',
              timeline: '30 days',
              priority: 'High',
              status: 'Pending Approval',
              documents: ['Campaign Strategy.pdf', 'Budget Breakdown.xlsx', 'Target List.csv']
            },
            {
              id: 2,
              name: 'Digital Engagement Drive',
              type: 'Engagement',
              segment: 'Retail',
              createdBy: 'Alice Mukamana',
              createdDate: '2024-01-22',
              targetCustomers: 2000,
              budget: 8000000,
              expectedROI: 280,
              description: 'Digital-first campaign to increase engagement among retail customers',
              strategy: 'SMS, email, and mobile app notifications with personalized content',
              timeline: '45 days',
              priority: 'Medium',
              status: 'Pending Approval',
              documents: ['Digital Strategy.pdf', 'Content Calendar.docx', 'Budget Plan.xlsx']
            },
            {
              id: 3,
              name: 'SME Growth Initiative',
              type: 'Growth',
              segment: 'SME',
              createdBy: 'Grace Uwimana',
              createdDate: '2024-01-21',
              targetCustomers: 800,
              budget: 5000000,
              expectedROI: 400,
              description: 'Growth campaign targeting SME customers with additional product offerings',
              strategy: 'Cross-selling and upselling with dedicated SME relationship managers',
              timeline: '60 days',
              priority: 'Medium',
              status: 'Pending Approval',
              documents: ['SME Strategy.pdf', 'Product Catalog.pdf', 'ROI Projection.xlsx']
            }
          ],
          approved: [
            {
              id: 4,
              name: 'Retail Retention Drive',
              type: 'Retention',
              segment: 'Retail',
              createdBy: 'Peter Nkurunziza',
              createdDate: '2024-01-15',
              approvedBy: 'Manager',
              approvedDate: '2024-01-16',
              targetCustomers: 1500,
              budget: 10000000,
              expectedROI: 320,
              description: 'Comprehensive retention campaign for retail segment',
              strategy: 'Multi-channel approach with personalized offers',
              timeline: '30 days',
              priority: 'High',
              status: 'Approved',
              progress: 65,
              currentResults: {
                contacts: 1200,
                conversions: 780,
                revenue: 25000000,
                cost: 6500000
              }
            }
          ],
          rejected: [
            {
              id: 5,
              name: 'Aggressive Cross-sell Campaign',
              type: 'Cross-sell',
              segment: 'All',
              createdBy: 'Sarah Uwimana',
              createdDate: '2024-01-18',
              rejectedBy: 'Manager',
              rejectedDate: '2024-01-19',
              targetCustomers: 5000,
              budget: 20000000,
              expectedROI: 150,
              description: 'Aggressive cross-selling campaign across all segments',
              strategy: 'Mass marketing with product bundles and discounts',
              timeline: '90 days',
              priority: 'Low',
              status: 'Rejected',
              rejectionReason: 'Budget too high for expected ROI, strategy too aggressive'
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

  const handleApprove = (campaignId) => {
    setCampaigns(prev => {
      const campaign = prev.pending.find(c => c.id === campaignId);
      if (campaign) {
        const approvedCampaign = {
          ...campaign,
          status: 'Approved',
          approvedBy: 'Current Manager',
          approvedDate: new Date().toISOString().split('T')[0],
          progress: 0
        };
        
        return {
          ...prev,
          pending: prev.pending.filter(c => c.id !== campaignId),
          approved: [approvedCampaign, ...prev.approved]
        };
      }
      return prev;
    });
  };

  const handleReject = (campaignId, reason) => {
    setCampaigns(prev => {
      const campaign = prev.pending.find(c => c.id === campaignId);
      if (campaign) {
        const rejectedCampaign = {
          ...campaign,
          status: 'Rejected',
          rejectedBy: 'Current Manager',
          rejectedDate: new Date().toISOString().split('T')[0],
          rejectionReason: reason
        };
        
        return {
          ...prev,
          pending: prev.pending.filter(c => c.id !== campaignId),
          rejected: [rejectedCampaign, ...prev.rejected]
        };
      }
      return prev;
    });
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
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-600';
      case 'Approved': return 'bg-green-100 text-green-600';
      case 'Rejected': return 'bg-red-100 text-red-600';
      case 'In Progress': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Retention': return 'bg-red-100 text-red-600';
      case 'Engagement': return 'bg-blue-100 text-blue-600';
      case 'Growth': return 'bg-green-100 text-green-600';
      case 'Cross-sell': return 'bg-purple-100 text-purple-600';
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

  const currentCampaigns = campaigns[filter] || [];

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campaign Approvals</h1>
              <p className="text-gray-600">Review and approve retention campaigns</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Campaign Analytics
              </Button>
              <Button variant="primary" size="sm">
                📈 Performance Report
              </Button>
            </div>
          </div>

          {/* Campaign Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-yellow-900">{campaigns.pending.length}</p>
                  </div>
                  <div className="text-3xl">⏳</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Approved</p>
                    <p className="text-2xl font-bold text-green-900">{campaigns.approved.length}</p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-900">{campaigns.rejected.length}</p>
                  </div>
                  <div className="text-3xl">❌</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Campaigns</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {campaigns.pending.length + campaigns.approved.length + campaigns.rejected.length}
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
              onClick={() => setFilter('pending')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Approval ({campaigns.pending.length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved ({campaigns.approved.length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected ({campaigns.rejected.length})
            </button>
          </div>

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
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(campaign.priority)}`}>
                          {campaign.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Segment</p>
                          <p className="font-medium">{campaign.segment}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Target Customers</p>
                          <p className="font-medium">{campaign.targetCustomers.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-medium">{(campaign.budget / 1000000).toFixed(1)}M RWF</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Expected ROI</p>
                          <p className="font-medium text-green-600">{campaign.expectedROI}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created by {campaign.createdBy} on {campaign.createdDate}</span>
                        <span>Timeline: {campaign.timeline}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      {filter === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => handleApprove(campaign.id)}
                          >
                            ✅ Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => {
                              const reason = prompt('Rejection reason:');
                              if (reason) handleReject(campaign.id, reason);
                            }}
                          >
                            ❌ Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        👁️ View Details
                      </Button>
                    </div>
                  </div>
                  
                  {/* Campaign Strategy */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Strategy</h4>
                    <p className="text-sm text-gray-600 mb-3">{campaign.strategy}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {campaign.documents?.map((doc, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            📄 {doc}
                          </span>
                        ))}
                      </div>
                      
                      {campaign.currentResults && (
                        <div className="text-right text-sm">
                          <p className="text-gray-600">Progress: {campaign.progress}%</p>
                          <p className="text-gray-600">Revenue: {(campaign.currentResults.revenue / 1000000).toFixed(1)}M RWF</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Rejection Reason */}
                  {campaign.rejectionReason && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-red-700 mb-2">Rejection Reason</h4>
                      <p className="text-sm text-red-600">{campaign.rejectionReason}</p>
                    </div>
                  )}
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {currentCampaigns.length === 0 && (
            <Card>
              <Card.Content>
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">
                    {filter === 'pending' ? '⏳' : filter === 'approved' ? '✅' : '❌'}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">
                    No {filter} campaigns
                  </h3>
                  <p className="text-sm text-gray-500">
                    {filter === 'pending' 
                      ? 'No campaigns are currently pending approval'
                      : filter === 'approved'
                      ? 'No campaigns have been approved yet'
                      : 'No campaigns have been rejected'
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

export default CampaignApprovals;
