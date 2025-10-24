import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const BulkPredictions = () => {
  const { isCollapsed } = useSidebar();
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerIds, setCustomerIds] = useState('');
  const [predictionType, setPredictionType] = useState('churn');
  const [timeframe, setTimeframe] = useState('30');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock predictions data
        const mockPredictions = {
          recentPredictions: [
            {
              id: 1,
              batchName: 'High Risk Customers - Jan 2024',
              customerCount: 500,
              predictionType: 'Churn',
              timeframe: '30 days',
              generatedDate: '2024-01-22',
              status: 'Completed',
              results: {
                highRisk: 125,
                mediumRisk: 200,
                lowRisk: 175
              }
            },
            {
              id: 2,
              batchName: 'SME Segment Analysis',
              customerCount: 300,
              predictionType: 'CLV',
              timeframe: '90 days',
              generatedDate: '2024-01-20',
              status: 'Completed',
              results: {
                highValue: 80,
                mediumValue: 150,
                lowValue: 70
              }
            },
            {
              id: 3,
              batchName: 'Corporate Retention',
              customerCount: 200,
              predictionType: 'Churn',
              timeframe: '60 days',
              generatedDate: '2024-01-18',
              status: 'In Progress',
              results: {
                highRisk: 45,
                mediumRisk: 80,
                lowRisk: 75
              }
            }
          ],
          predictionTemplates: [
            {
              name: 'High Risk Churn Prediction',
              description: 'Identify customers with high churn probability',
              timeframe: '30 days',
              segment: 'All',
              threshold: 70
            },
            {
              name: 'CLV Analysis',
              description: 'Calculate customer lifetime value predictions',
              timeframe: '90 days',
              segment: 'SME',
              threshold: 50
            },
            {
              name: 'Retention Campaign Target',
              description: 'Identify customers for retention campaigns',
              timeframe: '45 days',
              segment: 'Retail',
              threshold: 60
            }
          ],
          sampleResults: [
            {
              customerId: 'CUST001',
              customerName: 'Rwanda Development Bank',
              segment: 'Institutional',
              churnProbability: 85,
              riskLevel: 'High',
              timeframe: '30 days',
              keyFactors: [
                'Decreased transaction frequency',
                'Increased complaints',
                'Low digital engagement'
              ],
              recommendations: [
                'Immediate relationship manager contact',
                'Personalized retention offer',
                'Enhanced service level'
              ]
            },
            {
              customerId: 'CUST002',
              customerName: 'Kigali Business Center',
              segment: 'Corporate',
              churnProbability: 72,
              riskLevel: 'High',
              timeframe: '30 days',
              keyFactors: [
                'Reduced account balance',
                'Competitor inquiries',
                'Service dissatisfaction'
              ],
              recommendations: [
                'Competitive pricing review',
                'Service quality improvement',
                'Relationship strengthening'
              ]
            },
            {
              customerId: 'CUST003',
              customerName: 'Tech Solutions Ltd',
              segment: 'SME',
              churnProbability: 45,
              riskLevel: 'Medium',
              timeframe: '30 days',
              keyFactors: [
                'Stable transaction patterns',
                'Good digital engagement',
                'Recent product adoption'
              ],
              recommendations: [
                'Monitor for changes',
                'Cross-selling opportunities',
                'Regular check-ins'
              ]
            }
          ]
        };
        
        setPredictions(mockPredictions);
      } catch (error) {
        console.error('Failed to load predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, []);

  const handleGeneratePredictions = async () => {
    if (!customerIds.trim()) {
      alert('Please enter customer IDs');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful generation
      const newPrediction = {
        id: Date.now(),
        batchName: `${predictionType} Prediction - ${new Date().toLocaleDateString()}`,
        customerCount: customerIds.split('\n').filter(id => id.trim()).length,
        predictionType: predictionType,
        timeframe: `${timeframe} days`,
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'Completed',
        results: {
          highRisk: Math.floor(Math.random() * 50) + 20,
          mediumRisk: Math.floor(Math.random() * 100) + 50,
          lowRisk: Math.floor(Math.random() * 100) + 50
        }
      };
      
      setPredictions(prev => ({
        ...prev,
        recentPredictions: [newPrediction, ...prev.recentPredictions]
      }));
      
      setCustomerIds('');
    } catch (error) {
      console.error('Failed to generate predictions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-600';
      case 'In Progress': return 'bg-yellow-100 text-yellow-600';
      case 'Failed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getChurnColor = (probability) => {
    if (probability >= 70) return 'text-red-600';
    if (probability >= 50) return 'text-orange-600';
    if (probability >= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (!predictions) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading predictions...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Bulk Predictions</h1>
              <p className="text-gray-600">Multi-customer predictions and risk timelines</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Export Results
              </Button>
              <Button variant="primary" size="sm">
                📈 View Analytics
              </Button>
            </div>
          </div>

          {/* Prediction Generator */}
          <Card>
            <Card.Header>
              <Card.Title>Generate Bulk Predictions</Card.Title>
              <Card.Description>Input multiple customer IDs to predict churn risk and timelines</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prediction Type</label>
                    <select
                      value={predictionType}
                      onChange={(e) => setPredictionType(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="churn">Churn Prediction</option>
                      <option value="clv">CLV Prediction</option>
                      <option value="retention">Retention Analysis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="45">45 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="primary" 
                      onClick={handleGeneratePredictions}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? '🔄 Generating...' : '🎯 Generate Predictions'}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer IDs</label>
                  <textarea
                    value={customerIds}
                    onChange={(e) => setCustomerIds(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={4}
                    placeholder="Enter customer IDs, one per line:&#10;CUST001&#10;CUST002&#10;CUST003"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter one customer ID per line. Maximum 1000 customers per batch.
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Recent Predictions */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Predictions</Card.Title>
              <Card.Description>Recently generated prediction batches</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {predictions.recentPredictions.map((prediction) => (
                  <div key={prediction.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{prediction.batchName}</h3>
                        <p className="text-sm text-gray-600">
                          {prediction.customerCount} customers • {prediction.predictionType} • {prediction.timeframe}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(prediction.status)}`}>
                          {prediction.status}
                        </span>
                        <span className="text-sm text-gray-500">{prediction.generatedDate}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">High Risk</p>
                        <p className="text-lg font-bold text-red-600">{prediction.results.highRisk}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Medium Risk</p>
                        <p className="text-lg font-bold text-yellow-600">{prediction.results.mediumRisk}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Low Risk</p>
                        <p className="text-lg font-bold text-green-600">{prediction.results.lowRisk}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        👁️ View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        📊 Export Results
                      </Button>
                      <Button size="sm" variant="outline">
                        📈 Analytics
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Sample Results */}
          <Card>
            <Card.Header>
              <Card.Title>Sample Prediction Results</Card.Title>
              <Card.Description>Example of individual customer predictions</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {predictions.sampleResults.map((result, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{result.customerName}</h3>
                        <p className="text-sm text-gray-600">{result.customerId} • {result.segment}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(result.riskLevel)}`}>
                          {result.riskLevel} Risk
                        </span>
                        <span className={`text-lg font-bold ${getChurnColor(result.churnProbability)}`}>
                          {result.churnProbability}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Factors</h4>
                        <ul className="space-y-1">
                          {result.keyFactors.map((factor, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {result.recommendations.map((recommendation, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm text-gray-500">
                      <span>Timeframe: {result.timeframe}</span>
                      <span>Last Updated: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Prediction Templates */}
          <Card>
            <Card.Header>
              <Card.Title>Prediction Templates</Card.Title>
              <Card.Description>Pre-configured prediction templates for common use cases</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {predictions.predictionTemplates.map((template, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <Card.Content>
                      <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="space-y-1 text-sm text-gray-500 mb-3">
                        <p>Timeframe: {template.timeframe}</p>
                        <p>Segment: {template.segment}</p>
                        <p>Threshold: {template.threshold}%</p>
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading predictions...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkPredictions;
