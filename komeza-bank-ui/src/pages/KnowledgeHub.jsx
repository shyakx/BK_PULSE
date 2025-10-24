import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const KnowledgeHub = () => {
  const { isCollapsed } = useSidebar();
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadKnowledgeItems = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock knowledge data
        const mockKnowledgeItems = [
          {
            id: 'K001',
            title: 'Retention Call Scripts',
            category: 'Scripts',
            description: 'Proven scripts for different retention scenarios',
            content: 'Welcome to our retention call scripts. These scripts have been tested and proven effective in retaining customers...',
            tags: ['retention', 'scripts', 'calls'],
            lastUpdated: '2024-01-20',
            usage: 156,
            rating: 4.8
          },
          {
            id: 'K002',
            title: 'Product Knowledge - Aguka Investment',
            category: 'Products',
            description: 'Complete guide to Aguka investment products',
            content: 'Aguka is our flagship investment product offering competitive returns...',
            tags: ['investment', 'aguka', 'products'],
            lastUpdated: '2024-01-18',
            usage: 89,
            rating: 4.6
          },
          {
            id: 'K003',
            title: 'Handling Customer Complaints',
            category: 'Procedures',
            description: 'Step-by-step guide for complaint resolution',
            content: 'When handling customer complaints, follow these steps: 1. Listen actively...',
            tags: ['complaints', 'resolution', 'procedures'],
            lastUpdated: '2024-01-15',
            usage: 203,
            rating: 4.9
          },
          {
            id: 'K004',
            title: 'Cross-selling Techniques',
            category: 'Sales',
            description: 'Effective techniques for cross-selling products',
            content: 'Cross-selling is about understanding customer needs and offering relevant products...',
            tags: ['cross-selling', 'sales', 'techniques'],
            lastUpdated: '2024-01-12',
            usage: 134,
            rating: 4.7
          },
          {
            id: 'K005',
            title: 'Digital Banking Features',
            category: 'Products',
            description: 'Guide to digital banking services and features',
            content: 'Our digital banking platform offers various features including...',
            tags: ['digital', 'banking', 'features'],
            lastUpdated: '2024-01-10',
            usage: 78,
            rating: 4.5
          },
          {
            id: 'K006',
            title: 'Churn Risk Indicators',
            category: 'Analytics',
            description: 'Key indicators that signal customer churn risk',
            content: 'Customers at risk of churning typically show these behaviors...',
            tags: ['churn', 'risk', 'indicators'],
            lastUpdated: '2024-01-08',
            usage: 167,
            rating: 4.8
          }
        ];
        
        setKnowledgeItems(mockKnowledgeItems);
      } catch (error) {
        console.error('Failed to load knowledge items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKnowledgeItems();
  }, []);

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Scripts': return 'bg-blue-100 text-blue-600';
      case 'Products': return 'bg-green-100 text-green-600';
      case 'Procedures': return 'bg-purple-100 text-purple-600';
      case 'Sales': return 'bg-orange-100 text-orange-600';
      case 'Analytics': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Hub</h1>
              <p className="text-gray-600">Product information, scripts, and best practices</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📚 Add Resource
              </Button>
              <Button variant="primary" size="sm">
                🔍 Advanced Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Resources</p>
                    <p className="text-2xl font-bold text-blue-900">{knowledgeItems.length}</p>
                  </div>
                  <div className="text-3xl">📚</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Most Used</p>
                    <p className="text-2xl font-bold text-green-900">
                      {knowledgeItems.reduce((max, item) => Math.max(max, item.usage), 0)}
                    </p>
                  </div>
                  <div className="text-3xl">🔥</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {Math.round(knowledgeItems.reduce((sum, item) => sum + item.rating, 0) / knowledgeItems.length * 10) / 10}
                    </p>
                  </div>
                  <div className="text-3xl">⭐</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Categories</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {new Set(knowledgeItems.map(item => item.category)).size}
                    </p>
                  </div>
                  <div className="text-3xl">📂</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <Card.Content>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search knowledge base..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Scripts">Scripts</option>
                    <option value="Products">Products</option>
                    <option value="Procedures">Procedures</option>
                    <option value="Sales">Sales</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                  <Button variant="outline" size="sm">
                    🔍 Filter
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Knowledge Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Knowledge Resources</h2>
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedItem(item)}>
                  <Card.Content>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>Usage: {item.usage}</span>
                        <span className={`font-medium ${getRatingColor(item.rating)}`}>
                          ⭐ {item.rating}
                        </span>
                      </div>
                      <span>Updated: {item.lastUpdated}</span>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>

            {/* Item Details */}
            <div>
              {selectedItem ? (
                <Card>
                  <Card.Header>
                    <Card.Title>{selectedItem.title}</Card.Title>
                    <Card.Description>{selectedItem.description}</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(selectedItem.category)}`}>
                          {selectedItem.category}
                        </span>
                        <span className={`text-sm font-medium ${getRatingColor(selectedItem.rating)}`}>
                          ⭐ {selectedItem.rating}
                        </span>
                        <span className="text-sm text-gray-600">({selectedItem.usage} uses)</span>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Content</h4>
                        <p className="text-sm text-gray-600">{selectedItem.content}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedItem.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Last Updated</p>
                          <p className="font-medium">{selectedItem.lastUpdated}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Usage Count</p>
                          <p className="font-medium">{selectedItem.usage}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <Button variant="primary" size="sm">
                            📖 View Full Content
                          </Button>
                          <Button variant="outline" size="sm">
                            📋 Copy to Clipboard
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
                      <div className="text-gray-400 text-4xl mb-2">📚</div>
                      <h3 className="text-sm font-medium text-gray-900">Select a Resource</h3>
                      <p className="text-sm text-gray-500">Click on a knowledge item to view detailed information</p>
                    </div>
                  </Card.Content>
                </Card>
              )}
            </div>
          </div>

          {/* Quick Access */}
          <Card>
            <Card.Header>
              <Card.Title>Quick Access</Card.Title>
              <Card.Description>Frequently used resources and shortcuts</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">📞</span>
                  <span className="text-sm">Call Scripts</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-sm">Product Info</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">📋</span>
                  <span className="text-sm">Procedures</span>
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading knowledge base...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;