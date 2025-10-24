import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const CustomerSegments = () => {
  const { isCollapsed } = useSidebar();
  const [segments, setSegments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [timeframe, setTimeframe] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSegments = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock segments data
        const mockSegments = {
          segmentOverview: [
            {
              id: 1,
              name: 'High-Value Corporate',
              description: 'Large corporate clients with significant revenue potential',
              customerCount: 2500,
              avgRevenue: 15000000,
              churnRate: 8.5,
              retentionRate: 91.5,
              riskScore: 'Medium',
              growthRate: 3.8,
              characteristics: [
                'High transaction volumes',
                'Multiple product relationships',
                'Long-term relationships',
                'Complex banking needs'
              ],
              trends: {
                churn: [9.2, 8.9, 8.7, 8.5],
                retention: [90.8, 91.0, 91.2, 91.5],
                revenue: [310, 315, 318, 320]
              }
            },
            {
              id: 2,
              name: 'Digital-First Retail',
              description: 'Tech-savvy retail customers preferring digital channels',
              customerCount: 45000,
              avgRevenue: 2500000,
              churnRate: 15.2,
              retentionRate: 84.8,
              riskScore: 'High',
              growthRate: 5.2,
              characteristics: [
                'High digital engagement',
                'Mobile-first behavior',
                'Price-sensitive',
                'Quick to switch'
              ],
              trends: {
                churn: [16.1, 15.8, 15.5, 15.2],
                retention: [83.9, 84.2, 84.5, 84.8],
                revenue: [170, 175, 177, 180]
              }
            },
            {
              id: 3,
              name: 'Growing SME',
              description: 'Small and medium enterprises with growth potential',
              customerCount: 12000,
              avgRevenue: 8000000,
              churnRate: 10.8,
              retentionRate: 89.2,
              riskScore: 'Medium',
              growthRate: 7.5,
              characteristics: [
                'Rapid growth phase',
                'Need for working capital',
                'Relationship-dependent',
                'Price and service sensitive'
              ],
              trends: {
                churn: [11.5, 11.2, 11.0, 10.8],
                retention: [88.5, 88.8, 89.0, 89.2],
                revenue: [90, 92, 94, 95]
              }
            },
            {
              id: 4,
              name: 'Institutional Partners',
              description: 'Government and institutional clients with stable relationships',
              customerCount: 3000,
              avgRevenue: 60000000,
              churnRate: 5.2,
              retentionRate: 94.8,
              riskScore: 'Low',
              growthRate: 2.1,
              characteristics: [
                'Long-term contracts',
                'Regulatory relationships',
                'Stable revenue streams',
                'Complex approval processes'
              ],
              trends: {
                churn: [5.8, 5.6, 5.4, 5.2],
                retention: [94.2, 94.4, 94.6, 94.8],
                revenue: [175, 177, 178, 180]
              }
            }
          ],
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
          insights: [
            {
              insight: 'Digital-First Retail segment showing highest churn risk',
              impact: 'High',
              confidence: 87,
              recommendation: 'Implement targeted digital retention campaigns',
              timeframe: '30 days'
            },
            {
              insight: 'Growing SME segment has highest growth potential',
              impact: 'Positive',
              confidence: 92,
              recommendation: 'Develop SME-specific products and services',
              timeframe: '60 days'
            },
            {
              insight: 'Institutional Partners segment most stable',
              impact: 'Medium',
              confidence: 95,
              recommendation: 'Maintain current relationship management approach',
              timeframe: 'Ongoing'
            }
          ]
        };
        
        setSegments(mockSegments);
      } catch (error) {
        console.error('Failed to load segments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSegments();
  }, [timeframe]);

  const filteredSegments = segments?.segmentOverview.filter(segment => 
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  if (!segments) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading segments...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Customer Segments</h1>
              <p className="text-gray-600">Deep dive into segments, cohort analysis, and trends</p>
            </div>
            <div className="flex space-x-3">
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

          {/* Segment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSegments.map((segment) => (
              <Card key={segment.id} variant="default" shadow="medium" hover
                    onClick={() => setSelectedSegment(segment)}>
                <Card.Content>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{segment.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(segment.riskScore)}`}>
                      {segment.riskScore} Risk
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Customers</span>
                      <span className="font-medium">{segment.customerCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Revenue</span>
                      <span className="font-medium">{(segment.avgRevenue / 1000000).toFixed(1)}M</span>
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
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="font-medium text-blue-600">{segment.growthRate}%</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Selected Segment Details */}
          {selectedSegment && (
            <Card variant="default" shadow="medium">
              <Card.Header>
                <Card.Title>{selectedSegment.name} - Detailed Analysis</Card.Title>
                <Card.Description>{selectedSegment.description}</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Segment Characteristics</h4>
                    <div className="space-y-2">
                      {selectedSegment.characteristics.map((characteristic, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-sm text-gray-700">{characteristic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Trends</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Churn Rate Trend</span>
                          <span>{selectedSegment.trends.churn[selectedSegment.trends.churn.length - 1]}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {selectedSegment.trends.churn.map((value, i) => (
                            <div key={i} className="flex-1 h-2 bg-red-100 rounded">
                              <div 
                                className="h-2 bg-red-500 rounded" 
                                style={{ width: `${(value / 20) * 100}%` }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Retention Rate Trend</span>
                          <span>{selectedSegment.trends.retention[selectedSegment.trends.retention.length - 1]}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {selectedSegment.trends.retention.map((value, i) => (
                            <div key={i} className="flex-1 h-2 bg-green-100 rounded">
                              <div 
                                className="h-2 bg-green-500 rounded" 
                                style={{ width: `${(value / 100) * 100}%` }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Cohort Analysis */}
          <Card variant="default" shadow="medium">
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
                    {segments.cohortAnalysis.map((cohort, index) => (
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

          {/* Insights and Recommendations */}
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Segment Insights</Card.Title>
              <Card.Description>AI-generated insights and recommendations</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {segments.insights.map((insight, index) => (
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

          {/* Search */}
          <Card variant="default" shadow="medium">
            <Card.Content>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search segments by name or description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button variant="outline" size="sm">
                  🔍 Search
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading segments...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSegments;
