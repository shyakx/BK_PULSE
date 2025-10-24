import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const CustomerOverview = () => {
  const { isCollapsed } = useSidebar();
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock customers data
        const mockCustomers = [
          {
            id: 1,
            name: 'Rwanda Development Bank',
            segment: 'Institutional',
            churnProbability: 85,
            riskLevel: 'Critical',
            revenueAtRisk: 45000000,
            lastContact: '2024-01-15',
            products: ['Corporate Banking', 'Investment Services', 'Treasury'],
            relationshipManager: 'Grace Uwimana',
            status: 'High Risk',
            trends: {
              engagement: 'Decreasing',
              transactions: 'Decreasing',
              complaints: 'Increasing'
            }
          },
          {
            id: 2,
            name: 'Kigali Business Center',
            segment: 'Corporate',
            churnProbability: 78,
            riskLevel: 'High',
            revenueAtRisk: 32000000,
            lastContact: '2024-01-18',
            products: ['Business Banking', 'Trade Finance', 'Cash Management'],
            relationshipManager: 'John Nkurunziza',
            status: 'At Risk',
            trends: {
              engagement: 'Stable',
              transactions: 'Decreasing',
              complaints: 'Stable'
            }
          },
          {
            id: 3,
            name: 'Tech Solutions Ltd',
            segment: 'SME',
            churnProbability: 72,
            riskLevel: 'High',
            revenueAtRisk: 18000000,
            lastContact: '2024-01-20',
            products: ['SME Banking', 'Digital Banking', 'Business Loans'],
            relationshipManager: 'Alice Mukamana',
            status: 'At Risk',
            trends: {
              engagement: 'Decreasing',
              transactions: 'Stable',
              complaints: 'Increasing'
            }
          },
          {
            id: 4,
            name: 'Rwanda Commercial Bank',
            segment: 'Institutional',
            churnProbability: 45,
            riskLevel: 'Medium',
            revenueAtRisk: 25000000,
            lastContact: '2024-01-22',
            products: ['Corporate Banking', 'Investment Services'],
            relationshipManager: 'Peter Nkurunziza',
            status: 'Stable',
            trends: {
              engagement: 'Stable',
              transactions: 'Stable',
              complaints: 'Stable'
            }
          },
          {
            id: 5,
            name: 'Kigali Manufacturing Co',
            segment: 'Corporate',
            churnProbability: 35,
            riskLevel: 'Low',
            revenueAtRisk: 15000000,
            lastContact: '2024-01-21',
            products: ['Business Banking', 'Trade Finance'],
            relationshipManager: 'Sarah Uwimana',
            status: 'Stable',
            trends: {
              engagement: 'Increasing',
              transactions: 'Stable',
              complaints: 'Stable'
            }
          },
          {
            id: 6,
            name: 'Digital Services Ltd',
            segment: 'SME',
            churnProbability: 28,
            riskLevel: 'Low',
            revenueAtRisk: 8000000,
            lastContact: '2024-01-19',
            products: ['SME Banking', 'Digital Banking'],
            relationshipManager: 'Alice Mukamana',
            status: 'Stable',
            trends: {
              engagement: 'Increasing',
              transactions: 'Increasing',
              complaints: 'Stable'
            }
          }
        ];
        
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Failed to load customers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = segmentFilter === 'all' || customer.segment.toLowerCase() === segmentFilter;
    const matchesRisk = riskFilter === 'all' || customer.riskLevel.toLowerCase() === riskFilter;
    return matchesSearch && matchesSegment && matchesRisk;
  }) || [];

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Critical': return 'bg-red-100 text-red-600';
      case 'High': return 'bg-orange-100 text-orange-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'High Risk': return 'bg-red-100 text-red-600';
      case 'At Risk': return 'bg-yellow-100 text-yellow-600';
      case 'Stable': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'Increasing': return 'text-green-600';
      case 'Decreasing': return 'text-red-600';
      case 'Stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getChurnColor = (probability) => {
    if (probability >= 70) return 'text-red-600';
    if (probability >= 50) return 'text-orange-600';
    if (probability >= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (!customers) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading customers...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Customer Overview</h1>
              <p className="text-gray-600">High-risk customers and portfolio summary</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Export Report
              </Button>
              <Button variant="primary" size="sm">
                📈 Generate Insights
              </Button>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">High Risk Customers</p>
                    <p className="text-2xl font-bold text-red-900">
                      {customers.filter(c => c.riskLevel === 'Critical' || c.riskLevel === 'High').length}
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
                    <p className="text-sm font-medium text-orange-600">Revenue at Risk</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {(customers.reduce((sum, c) => sum + c.revenueAtRisk, 0) / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Customers</p>
                    <p className="text-2xl font-bold text-blue-900">{customers.length}</p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Stable Customers</p>
                    <p className="text-2xl font-bold text-green-900">
                      {customers.filter(c => c.status === 'Stable').length}
                    </p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <Card.Content>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search customers by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={segmentFilter}
                    onChange={(e) => setSegmentFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Segments</option>
                    <option value="retail">Retail</option>
                    <option value="corporate">Corporate</option>
                    <option value="sme">SME</option>
                    <option value="institutional">Institutional</option>
                  </select>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <Button variant="outline" size="sm">
                    🔍 Filter
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Customers List */}
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <Card.Content>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                          {customer.segment}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(customer.riskLevel)}`}>
                          {customer.riskLevel} Risk
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Churn Probability</p>
                          <p className={`text-lg font-bold ${getChurnColor(customer.churnProbability)}`}>
                            {customer.churnProbability}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue at Risk</p>
                          <p className="text-lg font-bold text-gray-900">
                            {(customer.revenueAtRisk / 1000000).toFixed(1)}M RWF
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Last Contact</p>
                          <p className="text-lg font-bold text-gray-900">{customer.lastContact}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Relationship Manager</p>
                          <p className="text-lg font-bold text-gray-900">{customer.relationshipManager}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {customer.products.map((product, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {product}
                          </span>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Engagement</p>
                          <p className={`font-medium ${getTrendColor(customer.trends.engagement)}`}>
                            {customer.trends.engagement}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Transactions</p>
                          <p className={`font-medium ${getTrendColor(customer.trends.transactions)}`}>
                            {customer.trends.transactions}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Complaints</p>
                          <p className={`font-medium ${getTrendColor(customer.trends.complaints)}`}>
                            {customer.trends.complaints}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="primary">
                        👁️ View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        📞 Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        📊 Analytics
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <Card>
              <Card.Content>
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">🔍</div>
                  <h3 className="text-sm font-medium text-gray-900">No customers found</h3>
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
              <span className="ml-2 text-gray-600">Loading customers...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
