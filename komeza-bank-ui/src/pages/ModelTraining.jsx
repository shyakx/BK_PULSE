import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';
import { useAuth } from '../context/AuthContext';
import { churnModelService } from '../services/churnModel';

const ModelTraining = () => {
  const { user, hasPermission } = useAuth();
  const { isCollapsed } = useSidebar();
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [trainingData, setTrainingData] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [hyperparameters, setHyperparameters] = useState({
    nEstimators: 100,
    maxDepth: 10,
    minSamplesSplit: 5,
    minSamplesLeaf: 2,
    maxFeatures: 'sqrt'
  });

  // Available features for selection
  const availableFeatures = [
    { id: 'age', name: 'Customer Age', category: 'Demographics', importance: 0.15 },
    { id: 'accountAge', name: 'Account Age', category: 'Account', importance: 0.22 },
    { id: 'totalBalance', name: 'Total Balance', category: 'Financial', importance: 0.18 },
    { id: 'transactionFrequency', name: 'Transaction Frequency', category: 'Behavioral', importance: 0.25 },
    { id: 'digitalAdoption', name: 'Digital Adoption', category: 'Engagement', importance: 0.20 },
    { id: 'loginFrequency', name: 'Login Frequency', category: 'Engagement', importance: 0.16 },
    { id: 'paymentDelays', name: 'Payment Delays', category: 'Risk', importance: 0.28 },
    { id: 'supportInteractions', name: 'Support Interactions', category: 'Service', importance: 0.19 },
    { id: 'productCount', name: 'Product Count', category: 'Portfolio', importance: 0.14 },
    { id: 'creditUtilization', name: 'Credit Utilization', category: 'Financial', importance: 0.21 },
    { id: 'balanceVolatility', name: 'Balance Volatility', category: 'Financial', importance: 0.17 },
    { id: 'lastTransactionDays', name: 'Days Since Last Transaction', category: 'Behavioral', importance: 0.23 }
  ];

  // Mock training data summary
  const mockTrainingData = {
    totalRecords: 25000,
    churnRate: 0.15,
    dateRange: '2022-01-01 to 2024-01-25',
    dataQuality: 0.94,
    features: 45,
    segments: ['Gold', 'Silver', 'Bronze', 'High Risk', 'SME/Corporate']
  };

  // Mock model performance metrics
  const mockModelMetrics = {
    accuracy: 0.87,
    precision: 0.82,
    recall: 0.79,
    f1Score: 0.80,
    auc: 0.91,
    featureImportance: [
      { feature: 'paymentDelays', importance: 0.28 },
      { feature: 'transactionFrequency', importance: 0.25 },
      { feature: 'lastTransactionDays', importance: 0.23 },
      { feature: 'accountAge', importance: 0.22 },
      { feature: 'creditUtilization', importance: 0.21 }
    ]
  };

  useEffect(() => {
    // Initialize with all features selected
    setSelectedFeatures(availableFeatures.map(f => f.id));
    setModelMetrics(mockModelMetrics);
    setTrainingData(mockTrainingData);
  }, []);

  const handleStartTraining = async () => {
    setTrainingStatus('training');
    setTrainingProgress(0);
    
    // Simulate training progress
    const progressInterval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTrainingStatus('completed');
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      // Simulate model training
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Update metrics with new training results
      setModelMetrics({
        ...mockModelMetrics,
        accuracy: 0.87 + (Math.random() - 0.5) * 0.05,
        precision: 0.82 + (Math.random() - 0.5) * 0.05,
        recall: 0.79 + (Math.random() - 0.5) * 0.05,
        f1Score: 0.80 + (Math.random() - 0.5) * 0.05
      });
      
    } catch (error) {
      console.error('Training failed:', error);
      setTrainingStatus('error');
    }
  };

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleHyperparameterChange = (param, value) => {
    setHyperparameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleModelDeployment = async () => {
    console.log('Deploying model to production...');
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Model deployed successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'idle': return 'text-gray-600 bg-gray-50';
      case 'training': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMetricColor = (value, threshold) => {
    return value >= threshold ? 'text-green-600' : 'text-red-600';
  };

  if (!hasPermission('manage_models')) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <Card className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to manage model training.</p>
            </Card>
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
              <h1 className="text-2xl font-bold text-gray-900">Model Training & Management</h1>
              <p className="text-gray-600">Train, validate, and deploy churn prediction models</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => console.log('Export model metrics')}>
                Export Metrics
              </Button>
              <Button onClick={handleModelDeployment}>
                Deploy Model
              </Button>
            </div>
          </div>

          {/* Training Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Training Status</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trainingStatus)}`}>
                {trainingStatus.charAt(0).toUpperCase() + trainingStatus.slice(1)}
              </span>
            </div>
            
            {trainingStatus === 'training' && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Training Progress</span>
                  <span>{Math.round(trainingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Training Data</p>
                <p className="font-semibold">{trainingData?.totalRecords?.toLocaleString()} records</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Churn Rate</p>
                <p className="font-semibold">{(trainingData?.churnRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data Quality</p>
                <p className="font-semibold">{(trainingData?.dataQuality * 100).toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          {/* Model Performance */}
          {modelMetrics && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Model Performance</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className={`text-2xl font-bold ${getMetricColor(modelMetrics.accuracy, 0.85)}`}>
                    {(modelMetrics.accuracy * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Precision</p>
                  <p className={`text-2xl font-bold ${getMetricColor(modelMetrics.precision, 0.80)}`}>
                    {(modelMetrics.precision * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recall</p>
                  <p className={`text-2xl font-bold ${getMetricColor(modelMetrics.recall, 0.75)}`}>
                    {(modelMetrics.recall * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">F1-Score</p>
                  <p className={`text-2xl font-bold ${getMetricColor(modelMetrics.f1Score, 0.77)}`}>
                    {(modelMetrics.f1Score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Feature Importance */}
              <div>
                <h3 className="font-semibold mb-3">Feature Importance</h3>
                <div className="space-y-2">
                  {modelMetrics.featureImportance.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{item.feature}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.importance * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {(item.importance * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Feature Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Feature Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFeatures.map((feature) => (
                <div 
                  key={feature.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFeatures.includes(feature.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleFeatureToggle(feature.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{feature.name}</h3>
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{feature.category}</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full" 
                        style={{ width: `${feature.importance * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {(feature.importance * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Hyperparameters */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Hyperparameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Estimators
                </label>
                <Input
                  type="number"
                  value={hyperparameters.nEstimators}
                  onChange={(e) => handleHyperparameterChange('nEstimators', parseInt(e.target.value))}
                  min="10"
                  max="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Depth
                </label>
                <Input
                  type="number"
                  value={hyperparameters.maxDepth}
                  onChange={(e) => handleHyperparameterChange('maxDepth', parseInt(e.target.value))}
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Samples Split
                </label>
                <Input
                  type="number"
                  value={hyperparameters.minSamplesSplit}
                  onChange={(e) => handleHyperparameterChange('minSamplesSplit', parseInt(e.target.value))}
                  min="2"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Samples Leaf
                </label>
                <Input
                  type="number"
                  value={hyperparameters.minSamplesLeaf}
                  onChange={(e) => handleHyperparameterChange('minSamplesLeaf', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Features
                </label>
                <select
                  value={hyperparameters.maxFeatures}
                  onChange={(e) => handleHyperparameterChange('maxFeatures', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sqrt">Square Root</option>
                  <option value="log2">Log2</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Training Controls */}
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Model Training</h2>
                <p className="text-gray-600">Start training with selected features and parameters</p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => console.log('Validate model')}
                  disabled={trainingStatus === 'training'}
                >
                  Validate
                </Button>
                <Button 
                  onClick={handleStartTraining}
                  disabled={trainingStatus === 'training'}
                >
                  {trainingStatus === 'training' ? 'Training...' : 'Start Training'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Model History */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Model History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      v1.2.0
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2024-01-25
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      87.2%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Production
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button size="sm" variant="outline">View</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      v1.1.0
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2024-01-15
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      85.8%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                        Archived
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button size="sm" variant="outline">View</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      v1.0.0
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2024-01-01
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      83.5%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                        Archived
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button size="sm" variant="outline">View</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;
