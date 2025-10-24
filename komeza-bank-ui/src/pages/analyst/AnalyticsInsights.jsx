import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const AnalyticsInsights = () => {
  const { isCollapsed } = useSidebar();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('churn_drivers');
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock analytics data
        const mockAnalytics = {
          churnDrivers: [
            {
              driver: 'Decreased Transaction Frequency',
              impact: 0.32,
              description: 'Customers with reduced transaction activity show higher churn risk',
              trend: 'Increasing',
              examples: [
                'Customer reduced monthly transactions from 15 to 3',
                'No transactions in the last 30 days',
                'Transaction volume dropped by 60%'
              ]
            },
            {
              driver: 'Customer Complaints',
              impact: 0.28,
              description: 'Number and severity of customer complaints strongly predict churn',
              trend: 'Stable',
              examples: [
                'Multiple service quality complaints',
                'Unresolved complaint escalation',
                'Negative feedback on digital channels'
              ]
            },
            {
              driver: 'Digital Engagement Decline',
              impact: 0.15,
              description: 'Reduced usage of digital banking channels indicates disengagement',
              trend: 'Increasing',
              examples: [
                'Mobile app usage dropped by 40%',
                'No online banking login in 45 days',
                'Reduced digital transaction frequency'
              ]
            },
            {
              driver: 'Account Balance Reduction',
              impact: 0.12,
              description: 'Significant decrease in account balances signals potential churn',
              trend: 'Stable',
              examples: [
                'Account balance reduced by 50%',
                'Large withdrawal without replacement',
                'Account balance below historical average'
              ]
            },
            {
              driver: 'Product Relationship',
              impact: 0.08,
              description: 'Customers with fewer products are more likely to churn',
              trend: 'Decreasing',
              examples: [
                'Single product relationship',
                'No cross-selling success',
                'Limited product engagement'
              ]
            }
          ],
          clvInsights: [
            {
              segment: 'High-Value Corporate',
              avgCLV: 15000000,
              growthRate: 8.5,
              retentionRate: 92,
              keyFactors: [
                'Long-term relationships',
                'Multiple product usage',
                'High transaction volumes',
                'Stable revenue streams'
              ]
            },
            {
              segment: 'Growing SME',
              avgCLV: 8000000,
              growthRate: 12.3,
              retentionRate: 89,
              keyFactors: [
                'Rapid business growth',
                'Increasing transaction needs',
                'Product expansion',
                'Relationship development'
              ]
            },
            {
              segment: 'Digital-First Retail',
              avgCLV: 2500000,
              growthRate: 5.2,
              retentionRate: 85,
              keyFactors: [
                'Digital channel usage',
                'Price sensitivity',
                'Quick switching behavior',
                'High engagement requirements'
              ]
            }
          ],
          performanceTrends: {
            churnTrend: [
              { month: 'Oct 2023', rate: 14.2 },
              { month: 'Nov 2023', rate: 13.8 },
              { month: 'Dec 2023', rate: 12.9 },
              { month: 'Jan 2024', rate: 12.5 }
            ],
            retentionTrend: [
              { month: 'Oct 2023', rate: 85.8 },
              { month: 'Nov 2023', rate: 86.2 },
              { month: 'Dec 2023', rate: 87.1 },
              { month: 'Jan 2024', rate: 87.5 }
            ],
            revenueTrend: [
              { month: 'Oct 2023', revenue: 420000000 },
              { month: 'Nov 2023', revenue: 430000000 },
              { month: 'Dec 2023', revenue: 440000000 },
              { month: 'Jan 2024', revenue: 450000000 }
            ]
          },
          segmentAnalysis: [
            {
              segment: 'Retail',
              customers: 85000,
              churnRate: 15.2,
              retentionRate: 84.8,
              avgCLV: 2500000,
              revenue: 180000000,
              growthRate: 5.2,
              riskScore: 'High',
              topDrivers: [
                'Digital engagement decline',
                'Price sensitivity',
                'Competitor switching'
              ]
            },
            {
              segment: 'Corporate',
              customers: 25000,
              churnRate: 8.5,
              retentionRate: 91.5,
              avgCLV: 12000000,
              revenue: 320000000,
              growthRate: 3.8,
              riskScore: 'Medium',
              topDrivers: [
                'Service quality issues',
                'Relationship management',
                'Competitive pricing'
              ]
            },
            {
              segment: 'SME',
              customers: 12000,
              churnRate: 10.8,
              retentionRate: 89.2,
              avgCLV: 8000000,
              revenue: 95000000,
              growthRate: 7.5,
              riskScore: 'Medium',
              topDrivers: [
                'Growth challenges',
                'Working capital needs',
                'Service expectations'
              ]
            },
            {
              segment: 'Institutional',
              customers: 3000,
              churnRate: 5.2,
              retentionRate: 94.8,
              avgCLV: 60000000,
              revenue: 180000000,
              growthRate: 2.1,
              riskScore: 'Low',
              topDrivers: [
                'Regulatory changes',
                'Long-term contracts',
                'Strategic partnerships'
              ]
            }
          ],
          predictiveInsights: [
            {
              insight: 'Retail segment showing early churn signals',
              impact: 'High',
              confidence: 87,
              recommendation: 'Implement targeted digital retention campaigns',
              timeframe: '30 days',
              affectedCustomers: 1250
            },
            {
              insight: 'SME segment has highest growth potential',
              impact: 'Positive',
              confidence: 92,
              recommendation: 'Develop SME-specific products and services',
              timeframe: '60 days',
              affectedCustomers: 800
            },
            {
              insight: 'Corporate segment CLV increasing',
              impact: 'Positive',
              confidence: 89,
              recommendation: 'Focus on cross-selling opportunities',
              timeframe: '45 days',
              affectedCustomers: 500
            }
          ]
        };
        
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeframe]);

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'Increasing': return 'text-red-600';
      case 'Decreasing': return 'text-green-600';
      case 'Stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

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

  if (!analytics) {
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
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
              <p className="text-gray-600">Churn driver analysis and performance trends</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="churn_drivers">Churn Drivers</option>
                <option value="clv_analysis">CLV Analysis</option>
                <option value="segment_performance">Segment Performance</option>
                <option value="predictive_insights">Predictive Insights</option>
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
                📊 Export Report
              </Button>
              <Button variant="primary" size="sm">
                📈 Generate Insights
              </Button>
            </div>
          </div>

          {/* Churn Drivers Analysis */}
          {selectedMetric === 'churn_drivers' && (
            <Card>
              <Card.Header>
                <Card.Title>Churn Driver Analysis</Card.Title>
                <Card.Description>Key factors driving customer churn and their impact</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {analytics.churnDrivers.map((driver, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{driver.driver}</h3>
                          <p className="text-sm text-gray-600 mt-1">{driver.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                            Impact: {(driver.impact * 100).toFixed(1)}%
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            driver.trend === 'Increasing' ? 'bg-red-100 text-red-600' :
                            driver.trend === 'Decreasing' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {driver.trend}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Impact Score</span>
                          <span>{(driver.impact * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${driver.impact * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Examples</h4>
                        <ul className="space-y-1">
                          {driver.examples.map((example, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* CLV Analysis */}
          {selectedMetric === 'clv_analysis' && (
            <Card>
              <Card.Header>
                <Card.Title>Customer Lifetime Value Analysis</Card.Title>
                <Card.Description>CLV insights and growth potential by segment</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {analytics.clvInsights.map((segment, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{segment.segment}</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                          Growth: {segment.growthRate}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Avg CLV</p>
                          <p className="text-lg font-bold text-gray-900">{(segment.avgCLV / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Growth Rate</p>
                          <p className="text-lg font-bold text-green-600">{segment.growthRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Retention Rate</p>
                          <p className="text-lg font-bold text-blue-600">{segment.retentionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="text-lg font-bold text-purple-600">{(segment.revenue / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Factors</h4>
                        <div className="flex flex-wrap gap-1">
                          {segment.keyFactors.map((factor, i) => (
                            <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Segment Performance */}
          {selectedMetric === 'segment_performance' && (
            <Card>
              <Card.Header>
                <Card.Title>Segment Performance Analysis</Card.Title>
                <Card.Description>Comprehensive segment performance and risk assessment</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {analytics.segmentAnalysis.map((segment, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{segment.segment}</h3>
                          <p className="text-sm text-gray-600">{segment.customers.toLocaleString()} customers</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(segment.riskScore)}`}>
                          {segment.riskScore} Risk
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Churn Rate</p>
                          <p className="text-lg font-bold text-red-600">{segment.churnRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Retention Rate</p>
                          <p className="text-lg font-bold text-green-600">{segment.retentionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg CLV</p>
                          <p className="text-lg font-bold text-gray-900">{(segment.avgCLV / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="text-lg font-bold text-blue-600">{(segment.revenue / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Growth Rate</p>
                          <p className="text-lg font-bold text-purple-600">{segment.growthRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Risk Score</p>
                          <p className="text-lg font-bold text-gray-900">{segment.riskScore}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Top Churn Drivers</h4>
                        <div className="flex flex-wrap gap-1">
                          {segment.topDrivers.map((driver, i) => (
                            <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              {driver}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Predictive Insights */}
          {selectedMetric === 'predictive_insights' && (
            <Card>
              <Card.Header>
                <Card.Title>Predictive Insights</Card.Title>
                <Card.Description>AI-generated insights and recommendations</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {analytics.predictiveInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{insight.insight}</h4>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(insight.impact)}`}>
                            {insight.impact}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.recommendation}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Timeframe: {insight.timeframe}</span>
                        <span>Affected: {insight.affectedCustomers.toLocaleString()} customers</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Performance Trends */}
          <Card>
            <Card.Header>
              <Card.Title>Performance Trends</Card.Title>
              <Card.Description>Historical performance trends and projections</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Churn Rate Trend</h4>
                  <div className="flex items-end space-x-2 h-32">
                    {analytics.performanceTrends.churnTrend.map((point, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-red-500 rounded-t" 
                          style={{ height: `${(point.rate / 20) * 100}px` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1">{point.rate}%</span>
                        <span className="text-xs text-gray-500">{point.month.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Retention Rate Trend</h4>
                  <div className="flex items-end space-x-2 h-32">
                    {analytics.performanceTrends.retentionTrend.map((point, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-green-500 rounded-t" 
                          style={{ height: `${(point.rate / 100) * 100}px` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1">{point.rate}%</span>
                        <span className="text-xs text-gray-500">{point.month.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue Trend (M RWF)</h4>
                  <div className="flex items-end space-x-2 h-32">
                    {analytics.performanceTrends.revenueTrend.map((point, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-blue-500 rounded-t" 
                          style={{ height: `${(point.revenue / 500000000) * 100}px` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1">{(point.revenue / 1000000).toFixed(0)}M</span>
                        <span className="text-xs text-gray-500">{point.month.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
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

export default AnalyticsInsights;
