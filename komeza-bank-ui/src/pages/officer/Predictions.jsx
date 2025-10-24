import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';
import { getCustomerById, searchCustomers } from '../../services/customerDatabase.js';
import { ChurnModelService } from '../../services/churnModel.js';
import { scoreCustomer } from '../../services/mlGateway.js';

const Predictions = () => {
  const { isCollapsed } = useSidebar();
  const [customerId, setCustomerId] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);

  useEffect(() => {
    // Load recent predictions
    const mockRecentPredictions = [
      {
        id: 1,
        customerId: 'CUST001',
        customerName: 'Rwanda Development Bank',
        churnProbability: 85,
        riskLevel: 'High',
        timeline: '7-14 days',
        date: '2024-01-22',
        status: 'Active'
      },
      {
        id: 2,
        customerId: 'CUST002',
        customerName: 'Kigali Business Center',
        churnProbability: 72,
        riskLevel: 'High',
        timeline: '30-45 days',
        date: '2024-01-20',
        status: 'Active'
      },
      {
        id: 3,
        customerId: 'CUST003',
        customerName: 'Tech Solutions Ltd',
        churnProbability: 45,
        riskLevel: 'Medium',
        timeline: '60+ days',
        date: '2024-01-18',
        status: 'Active'
      }
    ];
    setRecentPredictions(mockRecentPredictions);
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!customerId.trim()) {
      setError('Please enter a customer ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get customer data
      const customer = getCustomerById(customerId);
      if (!customer) {
        setError('Customer not found');
        return;
      }

      // Generate features using the same logic as ChurnPrediction page
      const features = ChurnModelService.createFeatureSet(customer);
      
      // Flatten features for API
      const flattenFeatures = (features) => {
        const flat = { ...features };
        if (features.economicIndicators) {
          flat.economicIndicators_gdp = features.economicIndicators.gdp ?? 0;
          flat.economicIndicators_inflation = features.economicIndicators.inflation ?? 0;
          flat.economicIndicators_unemployment = features.economicIndicators.unemployment ?? 0;
          delete flat.economicIndicators;
        }
        if (features.marketConditions) {
          flat.marketConditions_marketGrowth = features.marketConditions.marketGrowth ?? 0;
          flat.marketConditions_competition = features.marketConditions.competition ?? 0;
          flat.marketConditions_stability = features.marketConditions.stability ?? 0;
          delete flat.marketConditions;
        }
        return flat;
      };

      const flatFeatures = flattenFeatures(features);
      
      // Call real model API
      const modelResponse = await scoreCustomer(flatFeatures);
      
      // Format prediction result
      const predictionResult = {
        customerId: customerId,
        customerName: customer.name,
        churnProbability: Math.round(modelResponse.churn_probability * 100),
        riskLevel: modelResponse.risk,
        timeline: getTimelineFromRisk(modelResponse.risk),
        features: {
          transactionFrequency: features.transactionFrequency,
          accountBalance: customer.accountBalance,
          lastTransaction: features.lastTransactionDays,
          productCount: features.productCount,
          complaintCount: features.complaintCount,
          engagementScore: Math.round(features.digitalAdoption * 100)
        },
        shapValues: modelResponse.top_drivers ? 
          Object.fromEntries(modelResponse.top_drivers.map(d => [d.feature, d.impact])) : {},
        recommendations: modelResponse.recommendations || [],
        nextSteps: generateNextSteps(modelResponse.risk, modelResponse.recommendations)
      };
      
      setPrediction(predictionResult);
      
      // Add to recent predictions
      setRecentPredictions(prev => [predictionResult, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Prediction error:', error);
      setError(`Failed to generate prediction: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getTimelineFromRisk = (risk) => {
    switch (risk) {
      case 'Critical': return '1-7 days';
      case 'High': return '7-14 days';
      case 'Medium': return '30-45 days';
      case 'Low': return '60+ days';
      default: return '60+ days';
    }
  };

  const generateNextSteps = (risk, recommendations) => {
    const baseSteps = [
      'Contact customer within 24 hours',
      'Prepare retention offer based on customer profile',
      'Schedule follow-up meeting',
      'Monitor customer activity closely'
    ];
    
    if (risk === 'Critical' || risk === 'High') {
      return [
        'URGENT: Contact customer immediately',
        'Prepare emergency retention package',
        'Schedule same-day follow-up',
        'Escalate to senior management'
      ];
    }
    
    return baseSteps;
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 70) return 'text-red-600';
    if (probability >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getShapColor = (value) => {
    if (value > 0) return 'text-red-600';
    if (value < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Single Customer Predictions</h1>
              <p className="text-gray-600">Generate churn predictions for individual customers</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 View Analytics
              </Button>
              <Button variant="primary" size="sm">
                📋 Export Results
              </Button>
            </div>
          </div>

          {/* Prediction Form */}
          <Card>
            <Card.Header>
              <Card.Title>Generate Prediction</Card.Title>
              <Card.Description>Enter customer ID to generate churn prediction</Card.Description>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handlePredict} className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      label="Customer ID"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      placeholder="Enter customer ID (e.g., CUST001)"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? '🔄 Predicting...' : '🎯 Predict Churn'}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </form>
            </Card.Content>
          </Card>

          {/* Prediction Results */}
          {prediction && (
            <div className="space-y-6">
              {/* Prediction Summary */}
              <Card>
                <Card.Header>
                  <Card.Title>Prediction Results</Card.Title>
                  <Card.Description>Churn risk assessment for {prediction.customerName}</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        <span className={getProbabilityColor(prediction.churnProbability)}>
                          {prediction.churnProbability}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Churn Probability</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        <span className={`px-3 py-1 rounded-full ${getRiskColor(prediction.riskLevel)}`}>
                          {prediction.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Risk Level</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {prediction.timeline}
                      </div>
                      <p className="text-sm text-gray-600">Expected Timeline</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Feature Analysis */}
              <Card>
                <Card.Header>
                  <Card.Title>Feature Analysis</Card.Title>
                  <Card.Description>Key factors influencing churn prediction</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Current Values</h4>
                      {Object.entries(prediction.features).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">SHAP Values (Impact)</h4>
                      {Object.entries(prediction.shapValues).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className={`font-medium ${getShapColor(value)}`}>
                            {value > 0 ? '+' : ''}{value.toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <Card.Header>
                    <Card.Title>Retention Recommendations</Card.Title>
                    <Card.Description>Suggested actions to prevent churn</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      {prediction.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-600">💡</span>
                          <span className="text-sm text-gray-700">
                            {typeof rec === 'string' ? rec : rec.action}
                            {typeof rec === 'object' && rec.rationale && (
                              <span className="text-gray-500"> — {rec.rationale}</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Next Steps</Card.Title>
                    <Card.Description>Immediate actions to take</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      {prediction.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <span className="text-green-600">✅</span>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </div>
          )}

          {/* Recent Predictions */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Predictions</Card.Title>
              <Card.Description>Your latest churn predictions</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {recentPredictions.map((pred) => (
                  <div key={pred.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-gray-900">{pred.customerName}</h4>
                        <span className="text-sm text-gray-600">({pred.customerId})</span>
                        <span className="text-sm text-gray-500">{pred.date}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Churn: <span className={getProbabilityColor(pred.churnProbability)}>{pred.churnProbability}%</span></span>
                        <span>Timeline: {pred.timeline}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(pred.riskLevel)}`}>
                        {pred.riskLevel}
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
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
              <span className="ml-2 text-gray-600">Generating prediction...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictions;
