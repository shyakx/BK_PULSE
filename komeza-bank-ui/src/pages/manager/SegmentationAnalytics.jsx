import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const SegmentationAnalytics = () => {
  const { isCollapsed } = useSidebar();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock analytics data
        const mockData = {
          cohortAnalysis: [
            {
              cohort: 'Q1 2023',
              customers: 5000,
              month1: 95,
              month2: 88,
              month3: 82,
              month6: 75,
              month12: 68
            },
            {
              cohort: 'Q2 2023',
              customers: 4800,
              month1: 96,
              month2: 89,
              month3: 83,
              month6: 76,
              month12: 70
            },
            {
              cohort: 'Q3 2023',
              customers: 5200,
              month1: 97,
              month2: 90,
              month3: 84,
              month6: 78,
              month12: 72
            },
            {
              cohort: 'Q4 2023',
              customers: 5100,
              month1: 98,
              month2: 91,
              month3: 85,
              month6: 79,
              month12: 73
            }
          ],
          segmentPerformance: [
            {
              segment: 'Retail',
              customers: 85000,
              churnRate: 15.2,
              retentionRate: 84.8,
              avgLifetimeValue: 2500000,
              revenue: 180000000,
              growthRate: 5.2,
              riskScore: 'High',
              trends: {
                churn: [16.1, 15.8, 15.5, 15.2],
                retention: [83.9, 84.2, 84.5, 84.8],
                revenue: [170, 175, 177, 180]
              }
            },
            {
              segment: 'Corporate',
              customers: 25000,
              churnRate: 8.5,
              retentionRate: 91.5,
              avgLifetimeValue: 12000000,
              revenue: 320000000,
              growthRate: 3.8,
              riskScore: 'Medium',
              trends: {
                churn: [9.2, 8.9, 8.7, 8.5],
                retention: [90.8, 91.0, 91.2, 91.5],
                revenue: [310, 315, 318, 320]
              }
            },
            {
              segment: 'SME',
              customers: 12000,
              churnRate: 10.8,
              retentionRate: 89.2,
              avgLifetimeValue: 8000000,
              revenue: 95000000,
              growthRate: 7.5,
              riskScore: 'Medium',
              trends: {
                churn: [11.5, 11.2, 11.0, 10.8],
                retention: [88.5, 88.8, 89.0, 89.2],
                revenue: [90, 92, 94, 95]
              }
            },
            {
              segment: 'Institutional',
              customers: 3000,
              churnRate: 5.2,
              retentionRate: 94.8,
              avgLifetimeValue: 60000000,
              revenue: 180000000,
              growthRate: 2.1,
              riskScore: 'Low',
              trends: {
                churn: [5.8, 5.6, 5.4, 5.2],
                retention: [94.2, 94.4, 94.6, 94.8],
                revenue: [175, 177, 178, 180]
              }
            }
          ],
          predictiveInsights: [
            {
              insight: 'Retail segment showing early churn signals',
              impact: 'High',
              confidence: 87,
              recommendation: 'Implement targeted retention campaigns',
              timeframe: '30 days'
            },
            {
              insight: 'Corporate segment CLV increasing',
              impact: 'Positive',
              confidence: 92,
              recommendation: 'Focus on cross-selling opportunities',
              timeframe: '60 days'
            },
            {
              insight: 'SME segment growth potential',
              impact: 'Medium',
              confidence: 78,
              recommendation: 'Develop SME-specific products',
              timeframe: '90 days'
            }
          ],
          campaignPerformance: [
            {
              campaign: 'Retail Retention Drive',
              segment: 'Retail',
              targetCustomers: 5000,
              contacts: 4200,
              conversions: 3150,
              retentionRate: 75,
              revenue: 45000000,
              cost: 8000000,
              roi: 463
            },
            {
              campaign: 'Corporate Value Enhancement',
              segment: 'Corporate',
              targetCustomers: 2000,
              contacts: 1900,
              conversions: 1520,
              retentionRate: 80,
              revenue: 120000000,
              cost: 15000000,
              roi: 700
            },
            {
              campaign: 'SME Growth Initiative',
              segment: 'SME',
              targetCustomers: 1500,
              contacts: 1350,
              conversions: 1080,
              retentionRate: 80,
              revenue: 25000000,
              cost: 5000000,
              roi: 400
            }
          ]
        };
        
        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [selectedSegment, timeframe]);

  const getRiskColor = (riskScore) => {
    switch (riskScore) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Positive': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!analyticsData) {
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
              <h1 className="text-2xl font-bold text-gray-900">Segmentation & Analytics</h1>
              <p className="text-gray-600">Cohort analysis and segment performance insights</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Segments</option>
                <option value="retail">Retail</option>
                <option value="corporate">Corporate</option>
                <option value="sme">SME</option>
                <option value="institutional">Institutional</option>
              </select>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Button variant="outline" size="sm">
                📊 Export Data
              </Button>
              <Button variant="primary" size="sm">
                📈 Generate Report
              </Button>
            </div>
          </div>

          {/* Segment Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.segmentPerformance.map((segment, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <Card.Content>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{segment.segment}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(segment.riskScore)}`}>
                      {segment.riskScore} Risk
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Customers</span>
                      <span className="font-medium">{segment.customers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Churn Rate</span>
                      <span className="font-medium text-red-600">{segment.churnRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Retention Rate</span>
                      <span className="font-medium text-green-600">{segment.retentionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg CLV</span>
                      <span className="font-medium">{(segment.avgLifetimeValue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="font-medium text-blue-600">{segment.growthRate}%</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Cohort Analysis */}
          <Card>
            <Card.Header>
              <Card.Title>Cohort Analysis</Card.Title>
              <Card.Description>Customer retention patterns by acquisition cohort</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Cohort</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Customers</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Month 1</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Month 2</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Month 3</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Month 6</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Month 12</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.cohortAnalysis.map((cohort, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-gray-900">{cohort.cohort}</td>
                        <td className="py-3 px-4 text-gray-600">{cohort.customers.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-medium">{cohort.month1}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-medium">{cohort.month2}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-medium">{cohort.month3}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-medium">{cohort.month6}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-medium">{cohort.month12}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>

          {/* Predictive Insights and Campaign Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>Predictive Insights</Card.Title>
                <Card.Description>AI-generated insights and recommendations</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {analyticsData.predictiveInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{insight.insight}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(insight.impact)}`}>
                          {insight.impact}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.recommendation}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Confidence: {insight.confidence}%</span>
                        <span>Timeframe: {insight.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Campaign Performance</Card.Title>
                <Card.Description>Retention campaign effectiveness by segment</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {analyticsData.campaignPerformance.map((campaign, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{campaign.campaign}</h4>
                        <span className="text-sm text-gray-600">{campaign.segment}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Target</p>
                          <p className="font-medium">{campaign.targetCustomers.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Contacts</p>
                          <p className="font-medium">{campaign.contacts.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Retention Rate</p>
                          <p className="font-medium text-green-600">{campaign.retentionRate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">ROI</p>
                          <p className="font-medium text-blue-600">{campaign.roi}%</p>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                        <span>Revenue: {(campaign.revenue / 1000000).toFixed(1)}M RWF</span>
                        <span>Cost: {(campaign.cost / 1000000).toFixed(1)}M RWF</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Segment Trends */}
          <Card>
            <Card.Header>
              <Card.Title>Segment Trends</Card.Title>
              <Card.Description>Historical performance trends by segment</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                {analyticsData.segmentPerformance.map((segment, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{segment.segment} Segment</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(segment.riskScore)}`}>
                        {segment.riskScore} Risk
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Churn Rate Trend</h4>
                        <div className="flex items-center space-x-2">
                          {segment.trends.churn.map((value, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div className="w-8 h-16 bg-red-100 rounded-t flex items-end">
                                <div 
                                  className="w-full bg-red-500 rounded-t" 
                                  style={{ height: `${(value / 20) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 mt-1">{value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Retention Rate Trend</h4>
                        <div className="flex items-center space-x-2">
                          {segment.trends.retention.map((value, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div className="w-8 h-16 bg-green-100 rounded-t flex items-end">
                                <div 
                                  className="w-full bg-green-500 rounded-t" 
                                  style={{ height: `${(value / 100) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 mt-1">{value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue Trend (M RWF)</h4>
                        <div className="flex items-center space-x-2">
                          {segment.trends.revenue.map((value, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div className="w-8 h-16 bg-blue-100 rounded-t flex items-end">
                                <div 
                                  className="w-full bg-blue-500 rounded-t" 
                                  style={{ height: `${(value / 200) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 mt-1">{value}M</span>
                            </div>
                          ))}
                        </div>
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
              <span className="ml-2 text-gray-600">Loading analytics...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SegmentationAnalytics;
