import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const KnowledgeBase = () => {
  const { isCollapsed } = useSidebar();
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    const loadKnowledgeBase = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock knowledge base data
        const mockKnowledgeBase = {
          categories: ['Scripts', 'Case Studies', 'Best Practices', 'Product Info', 'Training'],
          resources: [
            {
              id: 1,
              title: 'Retention Call Script - High Risk Customers',
              category: 'Scripts',
              description: 'Structured script for contacting high-risk customers',
              content: 'Opening: "Hello [Name], I\'m calling from Bank of Kigali to discuss your banking relationship..."',
              tags: ['retention', 'high-risk', 'phone-call'],
              lastUpdated: '2024-01-20',
              author: 'Alice Mukamana',
              rating: 4.8,
              usage: 95
            },
            {
              id: 2,
              title: 'SME Cross-selling Success Story',
              category: 'Case Studies',
              description: 'How we successfully cross-sold business loans to SME customers',
              content: 'Case Study: Tech Solutions Ltd - Identified growth opportunity through transaction analysis...',
              tags: ['cross-selling', 'sme', 'success-story'],
              lastUpdated: '2024-01-18',
              author: 'John Nkurunziza',
              rating: 4.6,
              usage: 87
            },
            {
              id: 3,
              title: 'Digital Banking Features Guide',
              category: 'Product Info',
              description: 'Comprehensive guide to digital banking features and benefits',
              content: 'Digital Banking Features: Mobile App, Online Banking, SMS Banking, USSD...',
              tags: ['digital-banking', 'features', 'guide'],
              lastUpdated: '2024-01-15',
              author: 'Grace Uwimana',
              rating: 4.7,
              usage: 92
            },
            {
              id: 4,
              title: 'Customer Objection Handling',
              category: 'Best Practices',
              description: 'Best practices for handling customer objections during retention calls',
              content: 'Common Objections: "I\'m not interested", "I\'m too busy", "I\'ll think about it"...',
              tags: ['objection-handling', 'retention', 'communication'],
              lastUpdated: '2024-01-12',
              author: 'Peter Nkurunziza',
              rating: 4.5,
              usage: 89
            },
            {
              id: 5,
              title: 'Churn Prediction Model Training',
              category: 'Training',
              description: 'Training module on interpreting churn prediction scores',
              content: 'Understanding Churn Scores: 0-30% (Low Risk), 31-60% (Medium Risk), 61-100% (High Risk)...',
              tags: ['training', 'churn-prediction', 'model'],
              lastUpdated: '2024-01-10',
              author: 'Sarah Uwimana',
              rating: 4.9,
              usage: 78
            },
            {
              id: 6,
              title: 'Corporate Banking Products',
              category: 'Product Info',
              description: 'Complete overview of corporate banking products and services',
              content: 'Corporate Products: Business Banking, Trade Finance, Cash Management, Treasury Services...',
              tags: ['corporate-banking', 'products', 'services'],
              lastUpdated: '2024-01-08',
              author: 'Alice Mukamana',
              rating: 4.4,
              usage: 85
            }
          ],
          recentActivity: [
            {
              user: 'Alice Mukamana',
              action: 'Viewed',
              resource: 'Retention Call Script - High Risk Customers',
              timestamp: '2024-01-22 14:30'
            },
            {
              user: 'John Nkurunziza',
              action: 'Updated',
              resource: 'SME Cross-selling Success Story',
              timestamp: '2024-01-22 12:15'
            },
            {
              user: 'Grace Uwimana',
              action: 'Rated',
              resource: 'Digital Banking Features Guide',
              timestamp: '2024-01-22 10:45'
            }
          ],
          popularResources: [
            {
              title: 'Retention Call Script - High Risk Customers',
              views: 1250,
              rating: 4.8,
              category: 'Scripts'
            },
            {
              title: 'Digital Banking Features Guide',
              views: 980,
              rating: 4.7,
              category: 'Product Info'
            },
            {
              title: 'Customer Objection Handling',
              views: 850,
              rating: 4.5,
              category: 'Best Practices'
            }
          ]
        };
        
        setKnowledgeBase(mockKnowledgeBase);
      } catch (error) {
        console.error('Failed to load knowledge base:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKnowledgeBase();
  }, []);

  const filteredResources = knowledgeBase?.resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Scripts': return 'bg-blue-100 text-blue-600';
      case 'Case Studies': return 'bg-green-100 text-green-600';
      case 'Best Practices': return 'bg-purple-100 text-purple-600';
      case 'Product Info': return 'bg-orange-100 text-orange-600';
      case 'Training': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!knowledgeBase) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading knowledge base...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
              <p className="text-gray-600">Scripts, case studies, and best practices</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Analytics
              </Button>
              <Button variant="primary" size="sm">
                ➕ Add Resource
              </Button>
            </div>
          </div>

          {/* Knowledge Base Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Resources</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{knowledgeBase.resources.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📚</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Scripts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {knowledgeBase.resources.filter(r => r.category === 'Scripts').length}
                    </p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📝</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Case Studies</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {knowledgeBase.resources.filter(r => r.category === 'Case Studies').length}
                    </p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📊</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Best Practices</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {knowledgeBase.resources.filter(r => r.category === 'Best Practices').length}
                    </p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">💡</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <Card.Content>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search resources by title, description, or tags"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Categories</option>
                    {knowledgeBase.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <Button variant="outline" size="sm">
                    🔍 Search
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Resources List */}
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedResource(resource)}>
                <Card.Content>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(resource.category)}`}>
                          {resource.category}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          {resource.rating}/5
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {resource.author} • {resource.lastUpdated}</span>
                        <span>Usage: {resource.usage}%</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="primary">
                        👁️ View
                      </Button>
                      <Button size="sm" variant="outline">
                        ⭐ Rate
                      </Button>
                      <Button size="sm" variant="outline">
                        📋 Copy
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Selected Resource Details */}
          {selectedResource && (
            <Card>
              <Card.Header>
                <Card.Title>{selectedResource.title}</Card.Title>
                <Card.Description>{selectedResource.description}</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Category: {selectedResource.category}</span>
                    <span>Rating: {selectedResource.rating}/5</span>
                    <span>Usage: {selectedResource.usage}%</span>
                    <span>Last Updated: {selectedResource.lastUpdated}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Content</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedResource.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="primary">
                      📋 Copy Content
                    </Button>
                    <Button variant="outline">
                      ⭐ Rate Resource
                    </Button>
                    <Button variant="outline">
                      📊 View Analytics
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Popular Resources */}
          <Card>
            <Card.Header>
              <Card.Title>Popular Resources</Card.Title>
              <Card.Description>Most viewed and highly rated resources</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {knowledgeBase.popularResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Views: {resource.views.toLocaleString()}</span>
                        <span>Rating: {resource.rating}/5</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(resource.category)}`}>
                          {resource.category}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Activity</Card.Title>
              <Card.Description>Latest knowledge base activity</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {knowledgeBase.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user} {activity.action} {activity.resource}
                        </p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Empty State */}
          {filteredResources.length === 0 && (
            <Card>
              <Card.Content>
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">🔍</div>
                  <h3 className="text-sm font-medium text-gray-900">No resources found</h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              </Card.Content>
            </Card>
          )}

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

export default KnowledgeBase;
