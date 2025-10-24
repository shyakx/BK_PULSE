import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';
import { getCustomerById, searchCustomers, getHighRiskCustomers } from '../../services/customerDatabase.js';

const CustomerDetails = () => {
  const { isCollapsed } = useSidebar();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    const loadCustomerDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load all customers for search functionality
        const mockAllCustomers = [
          {
            id: 'CUST001',
            name: 'Rwanda Development Bank',
            accountNumber: '1234567890',
            segment: 'Institutional',
            riskLevel: 'High',
            churnPrediction: 85
          },
          {
            id: 'CUST002',
            name: 'Kigali Business Center',
            accountNumber: '2345678901',
            segment: 'Corporate',
            riskLevel: 'Medium',
            churnPrediction: 45
          },
          {
            id: 'CUST003',
            name: 'Musanze Coffee Coop',
            accountNumber: '3456789012',
            segment: 'SME',
            riskLevel: 'Low',
            churnPrediction: 22
          },
          {
            id: 'CUST004',
            name: 'Huye University',
            accountNumber: '4567890123',
            segment: 'Institutional',
            riskLevel: 'Low',
            churnPrediction: 15
          },
          {
            id: 'CUST005',
            name: 'Rubavu Trading Ltd',
            accountNumber: '5678901234',
            segment: 'SME',
            riskLevel: 'High',
            churnPrediction: 78
          }
        ];
        
        // Load real customers for search functionality
        const realCustomers = await getHighRiskCustomers(50);
        const allCustomers = realCustomers.map(customer => ({
          id: customer.id,
          name: customer.name,
          accountNumber: customer.id, // Use customer ID as account number
          segment: customer.segment,
          riskLevel: customer.churnProbability >= 0.7 ? 'High' : 
                   customer.churnProbability >= 0.4 ? 'Medium' : 'Low',
          churnPrediction: Math.round(customer.churnProbability * 100)
        }));
        
        setAllCustomers(allCustomers);
        
        // Mock customer details data
        const mockCustomer = {
          basicInfo: {
            id: 'CUST001',
            name: 'Rwanda Development Bank',
            accountNumber: '1234567890',
            nationalId: '1234567890123456',
            phone: '+250788123456',
            email: 'contact@rdb.rw',
            address: 'KG 1 Ave, Kigali, Rwanda',
            segment: 'Institutional',
            accountStatus: 'Active',
            relationshipManager: 'Grace Uwimana',
            joinDate: '2020-03-15',
            lastLogin: '2024-01-22 14:30'
          },
          churnAnalysis: {
            probability: 85,
            riskLevel: 'High',
            timeframe: '30 days',
            keyFactors: [
              'Decreased transaction frequency',
              'Increased complaints',
              'Low digital engagement',
              'Account balance reduction'
            ],
            recommendations: [
              'Immediate relationship manager contact',
              'Personalized retention offer',
              'Enhanced service level',
              'Regular check-ins'
            ],
            historicalTrends: [
              { month: 'Oct 2023', score: 45 },
              { month: 'Nov 2023', score: 52 },
              { month: 'Dec 2023', score: 68 },
              { month: 'Jan 2024', score: 85 }
            ]
          },
          transactionHistory: [
            {
              date: '2024-01-20',
              type: 'Transfer',
              amount: 5000000,
              description: 'Transfer to external account',
              status: 'Completed'
            },
            {
              date: '2024-01-18',
              type: 'Deposit',
              amount: 15000000,
              description: 'Salary payment',
              status: 'Completed'
            },
            {
              date: '2024-01-15',
              type: 'Withdrawal',
              amount: 2000000,
              description: 'ATM withdrawal',
              status: 'Completed'
            },
            {
              date: '2024-01-12',
              type: 'Transfer',
              amount: 3000000,
              description: 'Internal transfer',
              status: 'Completed'
            },
            {
              date: '2024-01-10',
              type: 'Deposit',
              amount: 8000000,
              description: 'Business deposit',
              status: 'Completed'
            }
          ],
          products: [
            {
              name: 'Corporate Banking',
              type: 'Account',
              status: 'Active',
              openedDate: '2020-03-15',
              balance: 25000000,
              features: ['Online Banking', 'Mobile App', 'SMS Alerts']
            },
            {
              name: 'Investment Services',
              type: 'Investment',
              status: 'Active',
              openedDate: '2021-06-20',
              balance: 50000000,
              features: ['Portfolio Management', 'Research Reports', 'Advisory Services']
            },
            {
              name: 'Treasury Services',
              type: 'Treasury',
              status: 'Active',
              openedDate: '2022-01-10',
              balance: 75000000,
              features: ['FX Trading', 'Money Market', 'Risk Management']
            }
          ],
          interactions: [
            {
              date: '2024-01-22',
              type: 'Phone Call',
              outcome: 'Customer expressed satisfaction',
              notes: 'Follow-up call regarding new investment products',
              officer: 'Grace Uwimana'
            },
            {
              date: '2024-01-20',
              type: 'Email',
              outcome: 'Response received',
              notes: 'Sent information about treasury services',
              officer: 'Grace Uwimana'
            },
            {
              date: '2024-01-18',
              type: 'Meeting',
              outcome: 'Productive discussion',
              notes: 'Quarterly business review meeting',
              officer: 'Grace Uwimana'
            },
            {
              date: '2024-01-15',
              type: 'Phone Call',
              outcome: 'Issue resolved',
              notes: 'Resolved complaint about online banking',
              officer: 'Grace Uwimana'
            }
          ],
          complaints: [
            {
              id: 'COMP001',
              date: '2024-01-15',
              category: 'Service Quality',
              description: 'Online banking login issues',
              status: 'Resolved',
              resolution: 'Technical issue fixed, customer satisfied'
            },
            {
              id: 'COMP002',
              date: '2024-01-10',
              category: 'Transaction',
              description: 'Delayed transfer processing',
              status: 'Resolved',
              resolution: 'Transfer processed, compensation provided'
            }
          ],
          notes: [
            {
              date: '2024-01-22',
              author: 'Grace Uwimana',
              content: 'Customer showed interest in new investment products. Follow up in 2 weeks.',
              type: 'General'
            },
            {
              date: '2024-01-20',
              author: 'Grace Uwimana',
              content: 'Customer mentioned competitor rates. Need to review our pricing.',
              type: 'Competitive'
            },
            {
              date: '2024-01-18',
              author: 'Grace Uwimana',
              content: 'Quarterly review went well. Customer satisfied with services.',
              type: 'Meeting'
            }
          ]
        };
        
        setCustomer(mockCustomer);
      } catch (error) {
        console.error('Failed to load customer details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomerDetails();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const filtered = allCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.accountNumber.includes(searchTerm) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [searchTerm, allCustomers]);

  const handleCustomerSelect = (selectedCustomer) => {
    // In a real app, this would load the selected customer's details
    console.log('Selected customer:', selectedCustomer);
    setShowSearch(false);
    setSearchTerm('');
    // You would call an API to load the selected customer's details here
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
      case 'Active': return 'bg-green-100 text-green-600';
      case 'Inactive': return 'bg-gray-100 text-gray-600';
      case 'Suspended': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getChurnColor = (probability) => {
    if (probability >= 70) return 'text-red-600';
    if (probability >= 50) return 'text-orange-600';
    if (probability >= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'transactions', name: 'Transactions', icon: '💳' },
    { id: 'products', name: 'Products', icon: '🏦' },
    { id: 'interactions', name: 'Interactions', icon: '📞' },
    { id: 'complaints', name: 'Complaints', icon: '⚠️' },
    { id: 'notes', name: 'Notes', icon: '📝' }
  ];

  if (!customer) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading customer details...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">{customer.basicInfo.name}</h1>
              <p className="text-gray-600">Complete customer profile and interaction history</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.history.back()}
              >
                ← Back to List
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
              >
                🔍 Search Customer
              </Button>
              <Button variant="outline" size="sm">
                📊 Export Profile
              </Button>
              <Button variant="primary" size="sm">
                📞 Contact Customer
              </Button>
            </div>
          </div>

          {/* Customer Search */}
          {showSearch && (
            <Card variant="default" shadow="medium">
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Search Customer</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowSearch(false)}
                    >
                      ✕ Close
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Input
                      placeholder="Search by name, account number, or customer ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                    
                    {searchTerm && filteredCustomers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            onClick={() => handleCustomerSelect(customer)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{customer.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {customer.accountNumber} • {customer.segment}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(customer.riskLevel)}`}>
                                  {customer.riskLevel} Risk
                                </span>
                                <p className="text-sm text-gray-600 mt-1">
                                  {customer.churnPrediction}% churn
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {searchTerm && filteredCustomers.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3">
                        <p className="text-sm text-gray-600">No customers found matching "{searchTerm}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Customer Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="danger" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Churn Probability</p>
                    <p className={`text-3xl font-bold text-gray-900 mt-1 ${getChurnColor(customer.churnAnalysis.probability)}`}>
                      {customer.churnAnalysis.probability}%
                    </p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">⚠️</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Products</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{customer.products.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">🏦</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Balance</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {(customer.products.reduce((sum, p) => sum + p.balance, 0) / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">💰</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Interactions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{customer.interactions.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📞</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Navigation Tabs */}
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <Card.Header>
                  <Card.Title>Basic Information</Card.Title>
                  <Card.Description>Customer basic details and contact information</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Customer ID:</span>
                      <span className="text-sm font-medium">{customer.basicInfo.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account Number:</span>
                      <span className="text-sm font-medium">{customer.basicInfo.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm font-medium">{customer.basicInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium">{customer.basicInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Segment:</span>
                      <span className="text-sm font-medium">{customer.basicInfo.segment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-sm font-medium ${getStatusColor(customer.basicInfo.accountStatus).split(' ')[1]}`}>
                        {customer.basicInfo.accountStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Relationship Manager:</span>
                      <span className="text-sm font-medium">{customer.basicInfo.relationshipManager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Join Date:</span>
                      <span className="text-sm font-medium">{customer.basicInfo.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Login:</span>
                      <span className="text-sm font-medium">{customer.basicInfo.lastLogin}</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Churn Analysis</Card.Title>
                  <Card.Description>Risk assessment and churn prediction</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Churn Probability:</span>
                      <span className={`text-lg font-bold ${getChurnColor(customer.churnAnalysis.probability)}`}>
                        {customer.churnAnalysis.probability}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk Level:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(customer.churnAnalysis.riskLevel)}`}>
                        {customer.churnAnalysis.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Timeframe:</span>
                      <span className="text-sm font-medium">{customer.churnAnalysis.timeframe}</span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Risk Factors</h4>
                      <ul className="space-y-1">
                        {customer.churnAnalysis.keyFactors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {customer.churnAnalysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <Card>
              <Card.Header>
                <Card.Title>Transaction History</Card.Title>
                <Card.Description>Recent transaction history and patterns</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {customer.transactionHistory.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-medium text-gray-900">{transaction.type}</h4>
                          <span className="text-sm text-gray-600">{transaction.date}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {(transaction.amount / 1000000).toFixed(1)}M RWF
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <Card>
              <Card.Header>
                <Card.Title>Products & Services</Card.Title>
                <Card.Description>Active products and account details</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {customer.products.map((product, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.type} • Opened: {product.openedDate}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {(product.balance / 1000000).toFixed(1)}M RWF
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {product.features.map((feature, i) => (
                            <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Interactions Tab */}
          {activeTab === 'interactions' && (
            <Card>
              <Card.Header>
                <Card.Title>Interaction History</Card.Title>
                <Card.Description>Customer interactions and communication history</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {customer.interactions.map((interaction, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{interaction.type}</h4>
                          <span className="text-sm text-gray-600">{interaction.date}</span>
                          <span className="text-sm text-gray-600">by {interaction.officer}</span>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                          {interaction.outcome}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{interaction.notes}</p>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <Card>
              <Card.Header>
                <Card.Title>Complaints & Issues</Card.Title>
                <Card.Description>Customer complaints and resolution history</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {customer.complaints.map((complaint, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{complaint.category}</h4>
                          <p className="text-sm text-gray-600">ID: {complaint.id} • {complaint.date}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          complaint.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                      <p className="text-sm text-gray-500">Resolution: {complaint.resolution}</p>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <Card>
              <Card.Header>
                <Card.Title>Customer Notes</Card.Title>
                <Card.Description>Internal notes and observations</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {customer.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{note.date}</span>
                          <span className="text-sm text-gray-600">by {note.author}</span>
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            {note.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading customer details...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
