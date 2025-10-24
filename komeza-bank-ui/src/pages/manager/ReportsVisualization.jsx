import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const ReportsVisualization = () => {
  const { isCollapsed } = useSidebar();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock reports data
        const mockReports = {
          powerBIDashboards: [
            {
              id: 1,
              name: 'Retention Performance Dashboard',
              description: 'Comprehensive view of retention metrics and KPIs',
              url: 'https://app.powerbi.com/workspaces/retention/dashboard/performance',
              lastUpdated: '2024-01-22',
              status: 'Active',
              accessLevel: 'Manager',
              metrics: ['Churn Rate', 'Retention Rate', 'Revenue Impact', 'Campaign ROI']
            },
            {
              id: 2,
              name: 'Customer Segmentation Analysis',
              description: 'Deep dive into customer segments and behavior patterns',
              url: 'https://app.powerbi.com/workspaces/retention/dashboard/segmentation',
              lastUpdated: '2024-01-21',
              status: 'Active',
              accessLevel: 'Manager',
              metrics: ['Segment Performance', 'Cohort Analysis', 'CLV Trends', 'Risk Distribution']
            },
            {
              id: 3,
              name: 'Campaign Effectiveness Report',
              description: 'ROI and performance analysis of retention campaigns',
              url: 'https://app.powerbi.com/workspaces/retention/dashboard/campaigns',
              lastUpdated: '2024-01-20',
              status: 'Active',
              accessLevel: 'Manager',
              metrics: ['Campaign ROI', 'Conversion Rates', 'Cost per Acquisition', 'Revenue Generated']
            }
          ],
          downloadableReports: [
            {
              id: 1,
              name: 'Monthly Retention Report',
              description: 'Comprehensive monthly retention performance summary',
              format: 'PDF',
              size: '2.3 MB',
              lastGenerated: '2024-01-22',
              frequency: 'Monthly',
              sections: ['Executive Summary', 'Segment Performance', 'Campaign Results', 'Recommendations']
            },
            {
              id: 2,
              name: 'Customer Risk Analysis',
              description: 'Detailed analysis of high-risk customers and mitigation strategies',
              format: 'Excel',
              size: '1.8 MB',
              lastGenerated: '2024-01-21',
              frequency: 'Weekly',
              sections: ['Risk Assessment', 'Customer Profiles', 'Action Plans', 'Progress Tracking']
            },
            {
              id: 3,
              name: 'Campaign Performance Summary',
              description: 'ROI and effectiveness analysis of all retention campaigns',
              format: 'PDF',
              size: '3.1 MB',
              lastGenerated: '2024-01-20',
              frequency: 'Bi-weekly',
              sections: ['Campaign Overview', 'ROI Analysis', 'Lessons Learned', 'Future Recommendations']
            }
          ],
          kpiMetrics: {
            overallRetention: 87.5,
            churnRate: 12.5,
            revenueRetained: 450000000,
            costPerRetention: 15000,
            campaignROI: 320,
            customerSatisfaction: 8.2
          },
          trendData: {
            retentionTrend: [
              { month: 'Oct 2023', rate: 85.8 },
              { month: 'Nov 2023', rate: 86.2 },
              { month: 'Dec 2023', rate: 87.1 },
              { month: 'Jan 2024', rate: 87.5 }
            ],
            churnTrend: [
              { month: 'Oct 2023', rate: 14.2 },
              { month: 'Nov 2023', rate: 13.8 },
              { month: 'Dec 2023', rate: 12.9 },
              { month: 'Jan 2024', rate: 12.5 }
            ],
            revenueTrend: [
              { month: 'Oct 2023', revenue: 420000000 },
              { month: 'Nov 2023', revenue: 430000000 },
              { month: 'Dec 2023', revenue: 440000000 },
              { month: 'Jan 2024', revenue: 450000000 }
            ]
          },
          segmentPerformance: [
            {
              segment: 'Retail',
              customers: 85000,
              retentionRate: 84.8,
              churnRate: 15.2,
              revenue: 180000000,
              growth: 5.2
            },
            {
              segment: 'Corporate',
              customers: 25000,
              retentionRate: 91.5,
              churnRate: 8.5,
              revenue: 320000000,
              growth: 3.8
            },
            {
              segment: 'SME',
              customers: 12000,
              retentionRate: 89.2,
              churnRate: 10.8,
              revenue: 95000000,
              growth: 7.5
            },
            {
              segment: 'Institutional',
              customers: 3000,
              retentionRate: 94.8,
              churnRate: 5.2,
              revenue: 180000000,
              growth: 2.1
            }
          ]
        };
        
        setReports(mockReports);
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [timeframe]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-600';
      case 'Inactive': return 'bg-gray-100 text-gray-600';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'Manager': return 'bg-purple-100 text-purple-600';
      case 'Analyst': return 'bg-blue-100 text-blue-600';
      case 'Officer': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!reports) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading reports...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Reports & Visualization</h1>
              <p className="text-gray-600">Power BI dashboards and downloadable reports</p>
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
                📊 Export All
              </Button>
              <Button variant="primary" size="sm">
                📈 Generate Report
              </Button>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Retention Rate</p>
                    <p className="text-2xl font-bold text-green-900">{reports.kpiMetrics.overallRetention}%</p>
                  </div>
                  <div className="text-3xl">📈</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Churn Rate</p>
                    <p className="text-2xl font-bold text-red-900">{reports.kpiMetrics.churnRate}%</p>
                  </div>
                  <div className="text-3xl">📉</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Revenue Retained</p>
                    <p className="text-2xl font-bold text-blue-900">{(reports.kpiMetrics.revenueRetained / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Cost per Retention</p>
                    <p className="text-2xl font-bold text-purple-900">{(reports.kpiMetrics.costPerRetention / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-3xl">💵</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Campaign ROI</p>
                    <p className="text-2xl font-bold text-orange-900">{reports.kpiMetrics.campaignROI}%</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">Satisfaction</p>
                    <p className="text-2xl font-bold text-indigo-900">{reports.kpiMetrics.customerSatisfaction}/10</p>
                  </div>
                  <div className="text-3xl">😊</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Power BI Dashboards */}
          <Card>
            <Card.Header>
              <Card.Title>Power BI Dashboards</Card.Title>
              <Card.Description>Interactive dashboards for real-time analytics</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.powerBIDashboards.map((dashboard) => (
                  <Card key={dashboard.id} className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedReport(dashboard)}>
                    <Card.Content>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{dashboard.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{dashboard.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dashboard.status)}`}>
                            {dashboard.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getAccessLevelColor(dashboard.accessLevel)}`}>
                            {dashboard.accessLevel}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <p className="text-xs text-gray-500">Last Updated: {dashboard.lastUpdated}</p>
                        <p className="text-xs text-gray-500">Metrics: {dashboard.metrics.join(', ')}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="primary" className="flex-1">
                          📊 Open Dashboard
                        </Button>
                        <Button size="sm" variant="outline">
                          🔗 Share
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Downloadable Reports */}
          <Card>
            <Card.Header>
              <Card.Title>Downloadable Reports</Card.Title>
              <Card.Description>Exportable reports in various formats</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {reports.downloadableReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                          {report.format}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          {report.frequency}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Size: {report.size}</span>
                        <span>Last Generated: {report.lastGenerated}</span>
                        <span>Sections: {report.sections.length}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="primary">
                        📥 Download
                      </Button>
                      <Button size="sm" variant="outline">
                        👁️ Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Segment Performance */}
          <Card>
            <Card.Header>
              <Card.Title>Segment Performance</Card.Title>
              <Card.Description>Performance metrics by customer segment</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {reports.segmentPerformance.map((segment, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{segment.segment}</h3>
                      <span className="text-sm text-gray-600">{segment.customers.toLocaleString()} customers</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Retention Rate</p>
                        <p className="text-lg font-bold text-green-600">{segment.retentionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Churn Rate</p>
                        <p className="text-lg font-bold text-red-600">{segment.churnRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-lg font-bold text-gray-900">{(segment.revenue / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Growth</p>
                        <p className="text-lg font-bold text-blue-600">{segment.growth}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Trend</p>
                        <p className="text-lg font-bold text-gray-900">
                          {segment.growth > 5 ? '📈' : segment.growth > 0 ? '➡️' : '📉'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Trend Visualization */}
          <Card>
            <Card.Header>
              <Card.Title>Performance Trends</Card.Title>
              <Card.Description>Historical performance trends and projections</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Retention Rate Trend</h4>
                  <div className="flex items-end space-x-2 h-32">
                    {reports.trendData.retentionTrend.map((point, index) => (
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
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Churn Rate Trend</h4>
                  <div className="flex items-end space-x-2 h-32">
                    {reports.trendData.churnTrend.map((point, index) => (
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
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue Trend (M RWF)</h4>
                  <div className="flex items-end space-x-2 h-32">
                    {reports.trendData.revenueTrend.map((point, index) => (
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
              <span className="ml-2 text-gray-600">Loading reports...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsVisualization;
