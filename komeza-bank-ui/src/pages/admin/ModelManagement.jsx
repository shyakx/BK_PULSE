import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const ModelManagement = () => {
  const { isCollapsed } = useSidebar();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock model data
        const mockModels = [
          {
            id: 1,
            name: 'Churn Prediction v2.1',
            type: 'XGBoost',
            version: '2.1.0',
            status: 'Production',
            accuracy: 87.5,
            precision: 85.2,
            recall: 89.1,
            f1Score: 87.1,
            aucRoc: 0.92,
            lastTrained: '2024-01-20',
            nextRetrain: '2024-02-20',
            driftScore: 0.05,
            performance: 'Good',
            features: [
              { name: 'days_since_last_txn', importance: 0.32, description: 'Days since last transaction' },
              { name: 'complaints_count', importance: 0.28, description: 'Number of complaints' },
              { name: 'digital_engagement', importance: 0.15, description: 'Digital banking usage' },
              { name: 'account_balance', importance: 0.12, description: 'Current account balance' },
              { name: 'product_count', importance: 0.08, description: 'Number of products held' }
            ],
            trainingData: {
              samples: 50000,
              features: 25,
              lastUpdate: '2024-01-15'
            }
          },
          {
            id: 2,
            name: 'Churn Prediction v2.0',
            type: 'Random Forest',
            version: '2.0.0',
            status: 'Staging',
            accuracy: 84.2,
            precision: 82.1,
            recall: 86.5,
            f1Score: 84.2,
            aucRoc: 0.89,
            lastTrained: '2024-01-10',
            nextRetrain: '2024-02-10',
            driftScore: 0.12,
            performance: 'Fair',
            features: [
              { name: 'days_since_last_txn', importance: 0.30, description: 'Days since last transaction' },
              { name: 'complaints_count', importance: 0.25, description: 'Number of complaints' },
              { name: 'digital_engagement', importance: 0.18, description: 'Digital banking usage' }
            ],
            trainingData: {
              samples: 45000,
              features: 20,
              lastUpdate: '2024-01-05'
            }
          },
          {
            id: 3,
            name: 'Churn Prediction v1.5',
            type: 'Logistic Regression',
            version: '1.5.0',
            status: 'Archived',
            accuracy: 78.9,
            precision: 76.5,
            recall: 81.2,
            f1Score: 78.8,
            aucRoc: 0.85,
            lastTrained: '2023-12-15',
            nextRetrain: 'N/A',
            driftScore: 0.25,
            performance: 'Poor',
            features: [
              { name: 'days_since_last_txn', importance: 0.35, description: 'Days since last transaction' },
              { name: 'complaints_count', importance: 0.22, description: 'Number of complaints' }
            ],
            trainingData: {
              samples: 40000,
              features: 15,
              lastUpdate: '2023-12-10'
            }
          }
        ];
        
        setModels(mockModels);
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Production': return 'bg-green-100 text-green-600';
      case 'Staging': return 'bg-yellow-100 text-yellow-600';
      case 'Archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Good': return 'bg-green-100 text-green-600';
      case 'Fair': return 'bg-yellow-100 text-yellow-600';
      case 'Poor': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDriftColor = (driftScore) => {
    if (driftScore < 0.1) return 'bg-green-100 text-green-600';
    if (driftScore < 0.2) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };

  if (!models.length) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading models...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Model Management</h1>
              <p className="text-gray-600">ML models, performance metrics, and retraining</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Export Metrics
              </Button>
              <Button variant="primary" size="sm">
                🤖 Upload New Model
              </Button>
            </div>
          </div>

          {/* Model Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Production Models</p>
                    <p className="text-2xl font-bold text-green-900">
                      {models.filter(m => m.status === 'Production').length}
                    </p>
                  </div>
                  <div className="text-3xl">🤖</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Avg Accuracy</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {Math.round(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length)}%
                    </p>
                  </div>
                  <div className="text-3xl">🎯</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Models with Drift</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {models.filter(m => m.driftScore > 0.1).length}
                    </p>
                  </div>
                  <div className="text-3xl">⚠️</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Total Models</p>
                    <p className="text-2xl font-bold text-orange-900">{models.length}</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Models List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Available Models</h2>
              {models.map((model) => (
                <Card key={model.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedModel(model)}>
                  <Card.Content>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{model.name}</h3>
                        <p className="text-sm text-gray-600">{model.type} - v{model.version}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(model.status)}`}>
                          {model.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPerformanceColor(model.performance)}`}>
                          {model.performance}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Accuracy</p>
                        <p className="text-lg font-bold text-gray-900">{model.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">F1 Score</p>
                        <p className="text-lg font-bold text-gray-900">{model.f1Score}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Drift: <span className={`font-medium ${getDriftColor(model.driftScore).split(' ')[1]}`}>
                        {model.driftScore}
                      </span></span>
                      <span>Last trained: {model.lastTrained}</span>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>

            {/* Model Details */}
            <div>
              {selectedModel ? (
                <Card>
                  <Card.Header>
                    <Card.Title>{selectedModel.name} Details</Card.Title>
                    <Card.Description>{selectedModel.type} - v{selectedModel.version}</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Performance Metrics</h4>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Accuracy:</span>
                              <span className="font-medium">{selectedModel.accuracy}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Precision:</span>
                              <span className="font-medium">{selectedModel.precision}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Recall:</span>
                              <span className="font-medium">{selectedModel.recall}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>AUC-ROC:</span>
                              <span className="font-medium">{selectedModel.aucRoc}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Model Health</h4>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Status:</span>
                              <span className={`font-medium ${getStatusColor(selectedModel.status).split(' ')[1]}`}>
                                {selectedModel.status}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Drift Score:</span>
                              <span className={`font-medium ${getDriftColor(selectedModel.driftScore).split(' ')[1]}`}>
                                {selectedModel.driftScore}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Next Retrain:</span>
                              <span className="font-medium">{selectedModel.nextRetrain}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Feature Importance</h4>
                        <div className="space-y-2">
                          {selectedModel.features.slice(0, 5).map((feature, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{feature.name}</p>
                                <p className="text-xs text-gray-600">{feature.description}</p>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{feature.importance}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Training Samples</p>
                          <p className="font-medium">{selectedModel.trainingData.samples.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Features</p>
                          <p className="font-medium">{selectedModel.trainingData.features}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <Button variant="primary" size="sm">
                            📊 View SHAP
                          </Button>
                          <Button variant="outline" size="sm">
                            🔄 Retrain
                          </Button>
                          <Button variant="outline" size="sm">
                            📈 Deploy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ) : (
                <Card>
                  <Card.Content>
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-2">🤖</div>
                      <h3 className="text-sm font-medium text-gray-900">Select a Model</h3>
                      <p className="text-sm text-gray-500">Click on a model to view detailed information</p>
                    </div>
                  </Card.Content>
                </Card>
              )}
            </div>
          </div>

          {/* Model Actions */}
          <Card>
            <Card.Header>
              <Card.Title>Model Operations</Card.Title>
              <Card.Description>Manage model lifecycle and retraining</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">🔄</span>
                  <span className="text-sm">Schedule Retraining</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm">Performance Reports</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">⚙️</span>
                  <span className="text-sm">Model Settings</span>
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading models...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelManagement;
