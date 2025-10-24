import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const ModelInsights = () => {
  const { isCollapsed } = useSidebar();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('churn_prediction');
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock insights data
        const mockInsights = {
          modelPerformance: {
            churn_prediction: {
              accuracy: 87.5,
              precision: 85.2,
              recall: 89.1,
              f1Score: 87.1,
              aucRoc: 0.92,
              lastTrained: '2024-01-20',
              driftScore: 0.05,
              performance: 'Good'
            },
            clv_prediction: {
              accuracy: 82.3,
              precision: 80.1,
              recall: 84.5,
              f1Score: 82.2,
              aucRoc: 0.88,
              lastTrained: '2024-01-18',
              driftScore: 0.08,
              performance: 'Good'
            },
            segmentation: {
              accuracy: 90.1,
              precision: 88.7,
              recall: 91.5,
              f1Score: 90.1,
              aucRoc: 0.94,
              lastTrained: '2024-01-15',
              driftScore: 0.03,
              performance: 'Excellent'
            }
          },
          featureImportance: {
            churn_prediction: [
              { feature: 'days_since_last_txn', importance: 0.32, description: 'Days since last transaction' },
              { feature: 'complaints_count', importance: 0.28, description: 'Number of complaints' },
              { feature: 'digital_engagement', importance: 0.15, description: 'Digital banking usage' },
              { feature: 'account_balance', importance: 0.12, description: 'Current account balance' },
              { feature: 'product_count', importance: 0.08, description: 'Number of products held' },
              { feature: 'age', importance: 0.05, description: 'Customer age' }
            ],
            clv_prediction: [
              { feature: 'transaction_frequency', importance: 0.35, description: 'Transaction frequency' },
              { feature: 'account_balance', importance: 0.25, description: 'Account balance' },
              { feature: 'product_count', importance: 0.20, description: 'Number of products' },
              { feature: 'tenure', importance: 0.15, description: 'Customer tenure' },
              { feature: 'digital_engagement', importance: 0.05, description: 'Digital engagement' }
            ],
            segmentation: [
              { feature: 'transaction_volume', importance: 0.30, description: 'Transaction volume' },
              { feature: 'product_mix', importance: 0.25, description: 'Product portfolio' },
              { feature: 'engagement_score', importance: 0.20, description: 'Engagement score' },
              { feature: 'demographics', importance: 0.15, description: 'Demographic factors' },
              { feature: 'behavior_patterns', importance: 0.10, description: 'Behavior patterns' }
            ]
          },
          abTestResults: [
            {
              testName: 'Churn Model v2.1 vs v2.0',
              startDate: '2024-01-15',
              endDate: '2024-01-22',
              status: 'Completed',
              controlGroup: {
                model: 'v2.0',
                accuracy: 84.2,
                precision: 82.1,
                recall: 86.5,
                conversions: 1250
              },
              testGroup: {
                model: 'v2.1',
                accuracy: 87.5,
                precision: 85.2,
                recall: 89.1,
                conversions: 1380
              },
              improvement: 10.4,
              confidence: 95.2,
              recommendation: 'Deploy v2.1 to production'
            },
            {
              testName: 'CLV Model Feature Engineering',
              startDate: '2024-01-10',
              endDate: '2024-01-17',
              status: 'Completed',
              controlGroup: {
                model: 'Baseline',
                accuracy: 78.9,
                precision: 76.5,
                recall: 81.2,
                conversions: 980
              },
              testGroup: {
                model: 'Enhanced',
                accuracy: 82.3,
                precision: 80.1,
                recall: 84.5,
                conversions: 1120
              },
              improvement: 14.3,
              confidence: 92.8,
              recommendation: 'Implement enhanced features'
            }
          ],
          modelHealth: {
            overallHealth: 'Good',
            alerts: [
              {
                type: 'Data Drift',
                severity: 'Medium',
                message: 'Transaction patterns showing slight drift',
                timestamp: '2024-01-22 14:30',
                status: 'Active'
              },
              {
                type: 'Performance Drop',
                severity: 'Low',
                message: 'Model accuracy dropped by 0.5%',
                timestamp: '2024-01-21 10:15',
                status: 'Resolved'
              }
            ],
            retrainingSchedule: {
              nextRetrain: '2024-02-20',
              frequency: 'Monthly',
              trigger: 'Scheduled',
              estimatedDuration: '4 hours'
            }
          },
          businessImpact: {
            revenueImpact: 45000000,
            costSavings: 12000000,
            customerRetained: 1250,
            falsePositives: 45,
            falseNegatives: 23,
            roi: 320
          }
        };
        
        setInsights(mockInsights);
      } catch (error) {
        console.error('Failed to load insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [selectedModel, timeframe]);

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent': return 'bg-green-100 text-green-600';
      case 'Good': return 'bg-blue-100 text-blue-600';
      case 'Fair': return 'bg-yellow-100 text-yellow-600';
      case 'Poor': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!insights) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading insights...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentModel = insights.modelPerformance[selectedModel];
  const currentFeatures = insights.featureImportance[selectedModel];

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Model Insights</h1>
              <p className="text-gray-600">Feature importance, accuracy, and A/B test outcomes</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="churn_prediction">Churn Prediction</option>
                <option value="clv_prediction">CLV Prediction</option>
                <option value="segmentation">Segmentation</option>
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
                🔍 View SHAP
              </Button>
            </div>
          </div>

          {/* Model Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Accuracy</p>
                    <p className="text-2xl font-bold text-blue-900">{currentModel.accuracy}%</p>
                  </div>
                  <div className="text-3xl">🎯</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Precision</p>
                    <p className="text-2xl font-bold text-green-900">{currentModel.precision}%</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Recall</p>
                    <p className="text-2xl font-bold text-purple-900">{currentModel.recall}%</p>
                  </div>
                  <div className="text-3xl">📈</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">F1 Score</p>
                    <p className="text-2xl font-bold text-orange-900">{currentModel.f1Score}</p>
                  </div>
                  <div className="text-3xl">⚖️</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">AUC-ROC</p>
                    <p className="text-2xl font-bold text-red-900">{currentModel.aucRoc}</p>
                  </div>
                  <div className="text-3xl">📉</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">Drift Score</p>
                    <p className="text-2xl font-bold text-indigo-900">{currentModel.driftScore}</p>
                  </div>
                  <div className="text-3xl">⚠️</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Feature Importance and Model Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>Feature Importance</Card.Title>
                <Card.Description>Most influential features in {selectedModel.replace('_', ' ')} model</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {currentFeatures.map((feature, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{feature.feature}</h4>
                        <span className="text-sm font-bold text-gray-900">{feature.importance}</span>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${feature.importance * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Model Health</Card.Title>
                <Card.Description>Current model health and alerts</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Overall Health</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPerformanceColor(insights.modelHealth.overallHealth)}`}>
                      {insights.modelHealth.overallHealth}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Alerts</h4>
                    <div className="space-y-2">
                      {insights.modelHealth.alerts.map((alert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                            <p className="text-xs text-gray-600">{alert.message}</p>
                            <p className="text-xs text-gray-500">{alert.timestamp}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Retraining Schedule</h4>
                    <div className="text-sm text-gray-600">
                      <p>Next Retrain: {insights.modelHealth.retrainingSchedule.nextRetrain}</p>
                      <p>Frequency: {insights.modelHealth.retrainingSchedule.frequency}</p>
                      <p>Duration: {insights.modelHealth.retrainingSchedule.estimatedDuration}</p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* A/B Test Results */}
          <Card>
            <Card.Header>
              <Card.Title>A/B Test Results</Card.Title>
              <Card.Description>Model comparison and performance testing outcomes</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {insights.abTestResults.map((test, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          test.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {test.status}
                        </span>
                        <span className="text-sm text-gray-600">{test.startDate} - {test.endDate}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Control Group ({test.controlGroup.model})</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Accuracy:</span>
                            <span className="font-medium">{test.controlGroup.accuracy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Precision:</span>
                            <span className="font-medium">{test.controlGroup.precision}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recall:</span>
                            <span className="font-medium">{test.controlGroup.recall}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Conversions:</span>
                            <span className="font-medium">{test.controlGroup.conversions}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Test Group ({test.testGroup.model})</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Accuracy:</span>
                            <span className="font-medium">{test.testGroup.accuracy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Precision:</span>
                            <span className="font-medium">{test.testGroup.precision}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recall:</span>
                            <span className="font-medium">{test.testGroup.recall}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Conversions:</span>
                            <span className="font-medium">{test.testGroup.conversions}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Improvement: <span className="font-bold text-green-600">{test.improvement}%</span></p>
                          <p className="text-sm text-gray-600">Confidence: <span className="font-bold text-blue-600">{test.confidence}%</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{test.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Business Impact */}
          <Card>
            <Card.Header>
              <Card.Title>Business Impact</Card.Title>
              <Card.Description>Financial and operational impact of model performance</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Revenue Impact</h4>
                  <p className="text-2xl font-bold text-green-600">{(insights.businessImpact.revenueImpact / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-500">RWF</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Cost Savings</h4>
                  <p className="text-2xl font-bold text-blue-600">{(insights.businessImpact.costSavings / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-500">RWF</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Customers Retained</h4>
                  <p className="text-2xl font-bold text-purple-600">{insights.businessImpact.customerRetained.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">This {timeframe}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">False Positives</h4>
                  <p className="text-2xl font-bold text-orange-600">{insights.businessImpact.falsePositives}</p>
                  <p className="text-xs text-gray-500">This {timeframe}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">False Negatives</h4>
                  <p className="text-2xl font-bold text-red-600">{insights.businessImpact.falseNegatives}</p>
                  <p className="text-xs text-gray-500">This {timeframe}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">ROI</h4>
                  <p className="text-2xl font-bold text-indigo-600">{insights.businessImpact.roi}%</p>
                  <p className="text-xs text-gray-500">Return on investment</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading insights...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelInsights;
