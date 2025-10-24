import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const KnowledgeBase = () => {
  const { isCollapsed } = useSidebar();
  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadKnowledge = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock knowledge base data
        const mockKnowledge = {
          categories: [
            { id: 'scripts', name: 'Retention Scripts', count: 15, icon: '📞' },
            { id: 'products', name: 'Product Knowledge', count: 8, icon: '💼' },
            { id: 'training', name: 'Training Modules', count: 12, icon: '🎓' },
            { id: 'cases', name: 'Case Studies', count: 20, icon: '📋' },
            { id: 'faqs', name: 'FAQs', count: 25, icon: '❓' }
          ],
          scripts: [
            {
              id: 1,
              title: 'High-Value Customer Retention Call',
              category: 'scripts',
              description: 'Script for retaining high-value customers showing churn signals',
              content: `Opening: "Good morning/afternoon, this is [Your Name] from Bank of Kigali. I'm calling to discuss your account and see how we can better serve you."

              Problem Identification: "I noticed you haven't been using your account as actively recently. Is there anything we can do to help?"

              Solution Presentation: "We have some exclusive offers for valued customers like yourself, including premium banking services and investment opportunities."

              Closing: "I'd like to schedule a follow-up meeting to discuss these options. When would be convenient for you?"`,
              tags: ['retention', 'high-value', 'calls'],
              difficulty: 'Intermediate',
              estimatedTime: '15-20 minutes'
            },
            {
              id: 2,
              title: 'SME Customer Engagement Script',
              category: 'scripts',
              description: 'Script for engaging SME customers and understanding their business needs',
              content: `Opening: "Hello, this is [Your Name] from Bank of Kigali. I'm calling to check on your business banking experience."

              Needs Assessment: "How has your business been performing? Are there any financial challenges we can help with?"

              Product Introduction: "We have specialized business solutions that might benefit your company, including working capital loans and treasury services."

              Next Steps: "I'd like to arrange a meeting with our business banking team to discuss these opportunities."`,
              tags: ['sme', 'business', 'engagement'],
              difficulty: 'Beginner',
              estimatedTime: '10-15 minutes'
            }
          ],
          products: [
            {
              id: 1,
              title: 'Tekana Investment Product',
              category: 'products',
              description: 'High-yield investment product for retail customers',
              features: [
                'Minimum investment: 100,000 RWF',
                'Interest rate: 8.5% per annum',
                'Flexible withdrawal options',
                'Mobile app access'
              ],
              benefits: [
                'Higher returns than savings accounts',
                'Flexible investment terms',
                'Easy access to funds',
                'Professional investment management'
              ],
              targetCustomers: ['Retail customers with surplus funds', 'SMEs looking for investment options'],
              salesPoints: [
                'Competitive interest rates',
                'Flexible terms',
                'Professional management',
                'Easy access to funds'
              ]
            },
            {
              id: 2,
              title: 'Treasury Services',
              category: 'products',
              description: 'Comprehensive treasury services for corporate clients',
              features: [
                'Foreign exchange services',
                'Interest rate hedging',
                'Cash management solutions',
                'Risk management tools'
              ],
              benefits: [
                'Reduced financial risk',
                'Improved cash flow management',
                'Access to global markets',
                'Expert financial advice'
              ],
              targetCustomers: ['Large corporations', 'Multinational companies', 'Government institutions'],
              salesPoints: [
                'Comprehensive risk management',
                'Global market access',
                'Expert advisory services',
                'Customized solutions'
              ]
            }
          ],
          training: [
            {
              id: 1,
              title: 'Customer Psychology in Retention',
              category: 'training',
              description: 'Understanding customer behavior and decision-making processes',
              content: 'This module covers the psychological factors that influence customer churn and retention decisions...',
              duration: '2 hours',
              difficulty: 'Intermediate',
              completionRate: 85,
              rating: 4.5
            },
            {
              id: 2,
              title: 'Effective Communication Techniques',
              category: 'training',
              description: 'Mastering communication skills for customer retention',
              content: 'Learn how to communicate effectively with customers to build trust and loyalty...',
              duration: '1.5 hours',
              difficulty: 'Beginner',
              completionRate: 92,
              rating: 4.7
            }
          ],
          cases: [
            {
              id: 1,
              title: 'Retaining a High-Value Corporate Client',
              category: 'cases',
              description: 'Case study of successfully retaining a major corporate client',
              situation: 'A large corporate client was considering switching to a competitor due to service issues.',
              action: 'Implemented a dedicated relationship manager and customized service package.',
              result: 'Client retained with 20% increase in business volume.',
              lessons: [
                'Personalized service is crucial for high-value clients',
                'Quick response to issues prevents escalation',
                'Regular communication builds strong relationships'
              ],
              tags: ['corporate', 'retention', 'success']
            },
            {
              id: 2,
              title: 'SME Customer Recovery',
              category: 'cases',
              description: 'Recovering a dissatisfied SME customer',
              situation: 'SME customer was unhappy with loan processing delays and considering alternatives.',
              action: 'Expedited loan processing and provided additional support services.',
              result: 'Customer retained and became a strong advocate for the bank.',
              lessons: [
                'Speed of service delivery is critical',
                'Proactive communication prevents issues',
                'Going the extra mile builds loyalty'
              ],
              tags: ['sme', 'recovery', 'service']
            }
          ],
          faqs: [
            {
              id: 1,
              question: 'How do I handle a customer who is threatening to leave?',
              answer: 'Stay calm and listen actively. Acknowledge their concerns and focus on finding solutions. Offer to escalate to a supervisor if needed.',
              category: 'faqs',
              tags: ['retention', 'difficult-customers']
            },
            {
              id: 2,
              question: 'What should I do if a customer is not responding to calls?',
              answer: 'Try different communication channels (email, SMS). Respect their preferences and timing. Document all attempts for follow-up.',
              category: 'faqs',
              tags: ['communication', 'follow-up']
            }
          ]
        };
        
        setKnowledge(mockKnowledge);
      } catch (error) {
        console.error('Failed to load knowledge base:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKnowledge();
  }, []);

  const filteredItems = () => {
    if (!knowledge) return [];
    
    let items = [];
    if (selectedCategory === 'all') {
      items = [
        ...knowledge.scripts,
        ...knowledge.products,
        ...knowledge.training,
        ...knowledge.cases,
        ...knowledge.faqs
      ];
    } else {
      items = knowledge[selectedCategory] || [];
    }
    
    if (searchTerm) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return items;
  };

  const getCategoryIcon = (category) => {
    const cat = knowledge?.categories.find(c => c.id === category);
    return cat?.icon || '📄';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-600';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-600';
      case 'Advanced': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!knowledge) {
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
              <p className="text-gray-600">Access scripts, training, and best practices</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📚 My Progress
              </Button>
              <Button variant="primary" size="sm">
                🎓 Start Training
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <Card>
            <Card.Content>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    label="Search Knowledge Base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search scripts, products, training..."
                    icon="🔍"
                  />
                </div>
                <div className="md:w-64">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">All Categories</option>
                    {knowledge.categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Categories Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {knowledge.categories.map(category => (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Card.Content>
                  <div className="text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} items</p>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Knowledge Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems().map(item => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => setSelectedItem(item)}
              >
                <Card.Content>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags?.map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                        {item.difficulty && (
                          <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{item.estimatedTime || item.duration || 'N/A'}</span>
                        {item.rating && (
                          <span>⭐ {item.rating}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Selected Item Details */}
          {selectedItem && (
            <Card>
              <Card.Header>
                <div className="flex items-start justify-between">
                  <div>
                    <Card.Title className="flex items-center space-x-2">
                      <span>{getCategoryIcon(selectedItem.category)}</span>
                      <span>{selectedItem.title}</span>
                    </Card.Title>
                    <Card.Description>{selectedItem.description}</Card.Description>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                    ✕ Close
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  {/* Content based on item type */}
                  {selectedItem.category === 'scripts' && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Script Content</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">{selectedItem.content}</pre>
                      </div>
                    </div>
                  )}
                  
                  {selectedItem.category === 'products' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                        <ul className="space-y-2">
                          {selectedItem.features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-green-600">✓</span>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Benefits</h4>
                        <ul className="space-y-2">
                          {selectedItem.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-blue-600">→</span>
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {selectedItem.category === 'training' && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Duration</span>
                          <p className="font-medium">{selectedItem.duration}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Difficulty</span>
                          <p className="font-medium">{selectedItem.difficulty}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Rating</span>
                          <p className="font-medium">⭐ {selectedItem.rating}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{selectedItem.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedItem.category === 'cases' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Situation</h4>
                        <p className="text-sm text-gray-700">{selectedItem.situation}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Action Taken</h4>
                        <p className="text-sm text-gray-700">{selectedItem.action}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Result</h4>
                        <p className="text-sm text-gray-700">{selectedItem.result}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Lessons</h4>
                        <ul className="space-y-1">
                          {selectedItem.lessons.map((lesson, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-blue-600">•</span>
                              <span className="text-sm text-gray-700">{lesson}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {selectedItem.category === 'faqs' && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Answer</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{selectedItem.answer}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <Button variant="primary" size="sm">
                      📖 Read More
                    </Button>
                    <Button variant="outline" size="sm">
                      ⭐ Bookmark
                    </Button>
                    <Button variant="outline" size="sm">
                      📤 Share
                    </Button>
                  </div>
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
