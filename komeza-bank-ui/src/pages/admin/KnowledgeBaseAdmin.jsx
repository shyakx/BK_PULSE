import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const KnowledgeBaseAdmin = () => {
  const { isCollapsed } = useSidebar();
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('modules');
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState({
    title: '',
    category: '',
    content: '',
    difficulty: 'Beginner',
    tags: []
  });

  useEffect(() => {
    const loadKnowledgeBase = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock knowledge base data
        const mockKnowledgeBase = {
          modules: [
            {
              id: 1,
              title: 'Customer Retention Fundamentals',
              category: 'Training',
              content: 'Basic principles of customer retention...',
              difficulty: 'Beginner',
              duration: '30 minutes',
              completionRate: 85,
              lastUpdated: '2024-01-15',
              tags: ['retention', 'fundamentals', 'training'],
              status: 'Published'
            },
            {
              id: 2,
              title: 'Churn Prediction Model Interpretation',
              category: 'Technical',
              content: 'How to interpret churn prediction scores...',
              difficulty: 'Intermediate',
              duration: '45 minutes',
              completionRate: 72,
              lastUpdated: '2024-01-20',
              tags: ['churn', 'prediction', 'model'],
              status: 'Published'
            },
            {
              id: 3,
              title: 'Advanced Analytics Techniques',
              category: 'Analytics',
              content: 'Advanced analytical methods for retention...',
              difficulty: 'Advanced',
              duration: '60 minutes',
              completionRate: 58,
              lastUpdated: '2024-01-18',
              tags: ['analytics', 'advanced', 'techniques'],
              status: 'Draft'
            }
          ],
          bestPractices: [
            {
              id: 1,
              title: 'Effective Customer Communication',
              description: 'Best practices for customer interactions',
              category: 'Communication',
              usage: 95,
              rating: 4.8,
              lastUpdated: '2024-01-10'
            },
            {
              id: 2,
              title: 'Retention Campaign Design',
              description: 'How to design effective retention campaigns',
              category: 'Campaign',
              usage: 87,
              rating: 4.6,
              lastUpdated: '2024-01-12'
            },
            {
              id: 3,
              title: 'Data Quality Guidelines',
              description: 'Ensuring data quality in retention processes',
              category: 'Data',
              usage: 78,
              rating: 4.4,
              lastUpdated: '2024-01-08'
            }
          ],
          userProgress: [
            {
              user: 'Alice Mukamana',
              role: 'Officer',
              completedModules: 8,
              totalModules: 12,
              progress: 67,
              lastActivity: '2024-01-22'
            },
            {
              user: 'John Nkurunziza',
              role: 'Analyst',
              completedModules: 10,
              totalModules: 12,
              progress: 83,
              lastActivity: '2024-01-21'
            },
            {
              user: 'Grace Uwimana',
              role: 'Manager',
              completedModules: 6,
              totalModules: 8,
              progress: 75,
              lastActivity: '2024-01-20'
            }
          ],
          categories: ['Training', 'Technical', 'Analytics', 'Communication', 'Campaign', 'Data'],
          difficulties: ['Beginner', 'Intermediate', 'Advanced']
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-600';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-600';
      case 'Advanced': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-600';
      case 'Draft': return 'bg-yellow-100 text-yellow-600';
      case 'Archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAddModule = (e) => {
    e.preventDefault();
    const newId = knowledgeBase.modules.length + 1;
    const module = {
      ...newModule,
      id: newId,
      duration: '30 minutes',
      completionRate: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    
    setKnowledgeBase(prev => ({
      ...prev,
      modules: [module, ...prev.modules]
    }));
    setNewModule({
      title: '',
      category: '',
      content: '',
      difficulty: 'Beginner',
      tags: []
    });
    setShowAddModule(false);
  };

  const tabs = [
    { id: 'modules', name: 'Training Modules', icon: '📚' },
    { id: 'practices', name: 'Best Practices', icon: '💡' },
    { id: 'progress', name: 'User Progress', icon: '📊' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ];

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
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Base Admin</h1>
              <p className="text-gray-600">Manage training modules and learning content</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Export Analytics
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowAddModule(true)}>
                ➕ Add Module
              </Button>
            </div>
          </div>

          {/* Knowledge Base Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Modules</p>
                    <p className="text-2xl font-bold text-blue-900">{knowledgeBase.modules.length}</p>
                  </div>
                  <div className="text-3xl">📚</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Published</p>
                    <p className="text-2xl font-bold text-green-900">
                      {knowledgeBase.modules.filter(m => m.status === 'Published').length}
                    </p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Avg Completion</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {Math.round(knowledgeBase.modules.reduce((sum, m) => sum + m.completionRate, 0) / knowledgeBase.modules.length)}%
                    </p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Active Users</p>
                    <p className="text-2xl font-bold text-orange-900">{knowledgeBase.userProgress.length}</p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Knowledge Base Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Add Module Form */}
          {showAddModule && (
            <Card>
              <Card.Header>
                <Card.Title>Add New Training Module</Card.Title>
                <Card.Description>Create a new training module for the knowledge base</Card.Description>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleAddModule} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Module Title"
                      value={newModule.title}
                      onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newModule.category}
                        onChange={(e) => setNewModule(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select category...</option>
                        {knowledgeBase.categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={newModule.content}
                      onChange={(e) => setNewModule(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select
                        value={newModule.difficulty}
                        onChange={(e) => setNewModule(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        {knowledgeBase.difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Tags (comma-separated)"
                      value={newModule.tags.join(', ')}
                      onChange={(e) => setNewModule(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                      placeholder="retention, training, fundamentals"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" variant="primary">
                      Create Module
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddModule(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          )}

          {/* Training Modules */}
          {activeTab === 'modules' && (
            <Card>
              <Card.Header>
                <Card.Title>Training Modules</Card.Title>
                <Card.Description>Manage training modules and content</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {knowledgeBase.modules.map((module) => (
                    <div key={module.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{module.title}</h3>
                          <p className="text-sm text-gray-600">{module.content}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(module.difficulty)}`}>
                            {module.difficulty}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(module.status)}`}>
                            {module.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-medium">{module.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{module.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Completion Rate</p>
                          <p className="font-medium">{module.completionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Last Updated</p>
                          <p className="font-medium">{module.lastUpdated}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {module.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="danger">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Best Practices */}
          {activeTab === 'practices' && (
            <Card>
              <Card.Header>
                <Card.Title>Best Practices</Card.Title>
                <Card.Description>Manage best practice documentation</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {knowledgeBase.bestPractices.map((practice) => (
                    <div key={practice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{practice.title}</h4>
                        <p className="text-sm text-gray-600">{practice.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Category: {practice.category}</span>
                          <span>Usage: {practice.usage}%</span>
                          <span>Rating: {practice.rating}/5</span>
                          <span>Updated: {practice.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* User Progress */}
          {activeTab === 'progress' && (
            <Card>
              <Card.Header>
                <Card.Title>User Learning Progress</Card.Title>
                <Card.Description>Track individual user progress through training modules</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {knowledgeBase.userProgress.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {user.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.user}</h4>
                          <p className="text-sm text-gray-600">{user.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Completed</p>
                          <p className="font-semibold">{user.completedModules}/{user.totalModules}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Progress</p>
                          <p className="font-semibold">{user.progress}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Last Activity</p>
                          <p className="font-semibold">{user.lastActivity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <Card.Header>
                  <Card.Title>Module Performance</Card.Title>
                  <Card.Description>Completion rates and engagement metrics</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    {knowledgeBase.modules.map((module) => (
                      <div key={module.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{module.title}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${module.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{module.completionRate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>User Engagement</Card.Title>
                  <Card.Description>User activity and learning patterns</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    {knowledgeBase.userProgress.map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{user.user}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${user.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
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

export default KnowledgeBaseAdmin;
