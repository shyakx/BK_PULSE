import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const Reports = () => {
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
          availableReports: [
            {
              id: 1,
              name: 'Monthly Retention Performance',
              description: 'Comprehensive monthly retention metrics and KPIs',
              type: 'Performance',
              format: 'PDF',
              size: '2.3 MB',
              lastGenerated: '2024-01-22',
              frequency: 'Monthly',
              sections: [
                'Executive Summary',
                'Segment Performance',
                'Campaign Results',
                'Churn Analysis',
                'Recommendations'
              ],
              metrics: [
                'Overall Retention Rate',
                'Churn Rate by Segment',
                'Campaign ROI',
                'Customer Satisfaction',
                'Revenue Impact'
              ]
            },
            {
              id: 2,
              name: 'Customer Risk Analysis',
              description: 'Detailed analysis of high-risk customers and mitigation strategies',
              type: 'Risk Analysis',
              format: 'Excel',
              size: '1.8 MB',
              lastGenerated: '2024-01-21',
              frequency: 'Weekly',
              sections: [
                'Risk Assessment',
                'Customer Profiles',
                'Action Plans',
                'Progress Tracking',
                'Mitigation Strategies'
              ],
              metrics: [
                'Risk Score Distribution',
                'High-Risk Customer Count',
                'Mitigation Success Rate',
                'Revenue at Risk',
                'Action Completion Rate'
              ]
            },
            {
              id: 3,
              name: 'Campaign Effectiveness Report',
              description: 'ROI and performance analysis of retention campaigns',
              type: 'Campaign Analysis',
              format: 'PDF',
              size: '3.1 MB',
              lastGenerated: '2024-01-20',
              frequency: 'Bi-weekly',
              sections: [
                'Campaign Overview',
                'ROI Analysis',
                'Performance Metrics',
                'Lessons Learned',
                'Future Recommendations'
              ],
              metrics: [
                'Campaign ROI',
                'Conversion Rates',
                'Cost per Acquisition',
                'Revenue Generated',
                'Customer Satisfaction'
              ]
            },
            {
              id: 4,
              name: 'Segment Performance Dashboard',
              description: 'Performance metrics and trends by customer segment',
              type: 'Segment Analysis',
              format: 'Excel',
              size: '2.1 MB',
              lastGenerated: '2024-01-19',
              frequency: 'Monthly',
              sections: [
                'Segment Overview',
                'Performance Metrics',
                'Trend Analysis',
                'Growth Opportunities',
                'Risk Assessment'
              ],
              metrics: [
                'Segment Retention Rates',
                'Churn Rates by Segment',
                'Revenue per Segment',
                'Growth Rates',
                'Risk Scores'
              ]
            }
          ],
          generatedReports: [
            {
              id: 1,
              name: 'Monthly Retention Performance - January 2024',
              type: 'Performance',
              generatedDate: '2024-01-22',
              status: 'Completed',
              size: '2.3 MB',
              format: 'PDF',
              downloadCount: 15,
              lastDownloaded: '2024-01-22 14:30'
            },
            {
              id: 2,
              name: 'Customer Risk Analysis - Week 3',
              type: 'Risk Analysis',
              generatedDate: '2024-01-21',
              status: 'Completed',
              size: '1.8 MB',
              format: 'Excel',
              downloadCount: 8,
              lastDownloaded: '2024-01-21 16:45'
            },
            {
              id: 3,
              name: 'Campaign Effectiveness - Q1 2024',
              type: 'Campaign Analysis',
              generatedDate: '2024-01-20',
              status: 'Completed',
              size: '3.1 MB',
              format: 'PDF',
              downloadCount: 12,
              lastDownloaded: '2024-01-20 11:20'
            }
          ],
          reportTemplates: [
            {
              name: 'Executive Summary Template',
              description: 'High-level summary for management reporting',
              type: 'Executive',
              sections: ['Key Metrics', 'Trends', 'Recommendations'],
              estimatedTime: '30 minutes'
            },
            {
              name: 'Detailed Analysis Template',
              description: 'Comprehensive analysis with detailed metrics',
              type: 'Detailed',
              sections: ['Data Analysis', 'Charts', 'Insights', 'Recommendations'],
              estimatedTime: '60 minutes'
            },
            {
              name: 'Campaign Report Template',
              description: 'Campaign-specific reporting template',
              type: 'Campaign',
              sections: ['Campaign Overview', 'Results', 'ROI', 'Lessons Learned'],
              estimatedTime: '45 minutes'
            }
          ],
          reportMetrics: {
            totalReports: 24,
            generatedThisMonth: 8,
            avgGenerationTime: 45,
            mostPopular: 'Monthly Retention Performance'
          }
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'Performance': return 'bg-blue-100 text-blue-600';
      case 'Risk Analysis': return 'bg-red-100 text-red-600';
      case 'Campaign Analysis': return 'bg-green-100 text-green-600';
      case 'Segment Analysis': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-600';
      case 'Generating': return 'bg-yellow-100 text-yellow-600';
      case 'Failed': return 'bg-red-100 text-red-600';
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
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600">Generate exportable dashboards and historical reports</p>
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

          {/* Report Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Reports</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{reports.reportMetrics.totalReports}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📊</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Generated This Month</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{reports.reportMetrics.generatedThisMonth}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📈</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg Generation Time</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{reports.reportMetrics.avgGenerationTime}m</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">⏱️</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Most Popular</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">Monthly Retention</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">🏆</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Available Reports */}
          <Card>
            <Card.Header>
              <Card.Title>Available Reports</Card.Title>
              <Card.Description>Pre-configured reports ready for generation</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {reports.availableReports.map((report) => (
                  <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(report.type)}`}>
                            {report.type}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            {report.format}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Size</p>
                            <p className="font-medium">{report.size}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Frequency</p>
                            <p className="font-medium">{report.frequency}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Last Generated</p>
                            <p className="font-medium">{report.lastGenerated}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Format</p>
                            <p className="font-medium">{report.format}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {report.tags?.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="primary">
                          📊 Generate
                        </Button>
                        <Button size="sm" variant="outline">
                          👁️ Preview
                        </Button>
                        <Button size="sm" variant="outline">
                          ⚙️ Configure
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Sections</h4>
                          <ul className="space-y-1">
                            {report.sections.map((section, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                {section}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Metrics</h4>
                          <ul className="space-y-1">
                            {report.metrics.map((metric, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                {metric}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Generated Reports */}
          <Card>
            <Card.Header>
              <Card.Title>Generated Reports</Card.Title>
              <Card.Description>Recently generated reports available for download</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {reports.generatedReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Generated: {report.generatedDate}</span>
                        <span>Size: {report.size}</span>
                        <span>Format: {report.format}</span>
                        <span>Downloads: {report.downloadCount}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="primary">
                        📥 Download
                      </Button>
                      <Button size="sm" variant="outline">
                        👁️ Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        📊 Analytics
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Report Templates */}
          <Card>
            <Card.Header>
              <Card.Title>Report Templates</Card.Title>
              <Card.Description>Pre-configured templates for quick report generation</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reports.reportTemplates.map((template, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <Card.Content>
                      <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="space-y-1 text-sm text-gray-500 mb-3">
                        <p>Type: {template.type}</p>
                        <p>Estimated Time: {template.estimatedTime}</p>
                        <p>Sections: {template.sections.length}</p>
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

          {/* Report Generation Form */}
          <Card>
            <Card.Header>
              <Card.Title>Generate Custom Report</Card.Title>
              <Card.Description>Create a custom report with specific metrics and timeframes</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter report name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option value="performance">Performance Report</option>
                      <option value="risk">Risk Analysis</option>
                      <option value="campaign">Campaign Analysis</option>
                      <option value="segment">Segment Analysis</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="quarter">Last Quarter</option>
                      <option value="year">Last Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Include Sections</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Executive Summary', 'Detailed Analysis', 'Charts & Graphs', 'Recommendations', 'Appendices', 'Raw Data'].map((section) => (
                      <label key={section} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-gray-700">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="primary">
                    📊 Generate Report
                  </Button>
                  <Button variant="outline">
                    💾 Save Template
                  </Button>
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

export default Reports;
