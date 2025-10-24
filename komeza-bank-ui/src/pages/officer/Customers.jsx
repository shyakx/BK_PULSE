import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';
import { getHighRiskCustomers, getCustomersBySegment, getCustomerStats } from '../../services/customerDatabase.js';

const Customers = () => {
  const { isCollapsed } = useSidebar();
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load real customers from CSV
        const [highRiskCustomers, stats] = await Promise.all([
          getHighRiskCustomers(100),
          getCustomerStats()
        ]);

        // Transform real data to display format
        const realCustomers = highRiskCustomers.map(customer => ({
          id: customer.id,
          name: customer.name,
          accountNumber: customer.id,
          nationalId: customer.id, // Use customer ID as national ID
          phone: `+250788${customer.id.slice(-6)}`, // Generate phone from ID
          email: `${customer.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
          segment: customer.segment,
          accountStatus: 'Active',
          products: customer.productCount > 2 ? ['Savings', 'Current Account', 'Credit Card'] :
                   customer.productCount > 1 ? ['Savings', 'Current Account'] : ['Savings'],
          lastTransaction: customer.lastTransaction,
          churnPrediction: Math.round(customer.churnProbability * 100),
          riskLevel: customer.churnProbability >= 0.7 ? 'High' : 
                    customer.churnProbability >= 0.4 ? 'Medium' : 'Low',
          relationshipManager: `Manager ${Math.floor(Math.random() * 5) + 1}`,
          notes: `${customer.segment} customer with ${customer.productCount} products`
        }));

        const mockCustomers = [
          {
            id: 'CUST001',
            name: 'Rwanda Development Bank',
            accountNumber: '1234567890',
            nationalId: '1234567890123456',
            phone: '+250788123456',
            email: 'contact@rdb.rw',
            segment: 'Institutional',
            accountStatus: 'Active',
            products: ['Corporate Banking', 'Investment Services', 'Treasury'],
            lastTransaction: '2024-01-20',
            churnPrediction: 85,
            riskLevel: 'High',
            relationshipManager: 'Grace Uwimana',
            notes: 'Long-term institutional client with complex banking needs'
          },
          {
            id: 'CUST002',
            name: 'Kigali Business Center',
            accountNumber: '2345678901',
            nationalId: '2345678901234567',
            phone: '+250788234567',
            email: 'info@kbc.rw',
            segment: 'Corporate',
            accountStatus: 'Active',
            products: ['Business Banking', 'Trade Finance', 'Cash Management'],
            lastTransaction: '2024-01-18',
            churnPrediction: 72,
            riskLevel: 'High',
            relationshipManager: 'John Nkurunziza',
            notes: 'Growing business with increasing transaction volumes'
          },
          {
            id: 'CUST003',
            name: 'Tech Solutions Ltd',
            accountNumber: '3456789012',
            nationalId: '3456789012345678',
            phone: '+250788345678',
            email: 'hello@techsolutions.rw',
            segment: 'SME',
            accountStatus: 'Active',
            products: ['SME Banking', 'Digital Banking', 'Business Loans'],
            lastTransaction: '2024-01-22',
            churnPrediction: 45,
            riskLevel: 'Medium',
            relationshipManager: 'Alice Mukamana',
            notes: 'Tech startup with digital-first approach'
          },
          {
            id: 'CUST004',
            name: 'Rwanda Commercial Bank',
            accountNumber: '4567890123',
            nationalId: '4567890123456789',
            phone: '+250788456789',
            email: 'contact@rcb.rw',
            segment: 'Institutional',
            accountStatus: 'Active',
            products: ['Corporate Banking', 'Investment Services'],
            lastTransaction: '2024-01-21',
            churnPrediction: 35,
            riskLevel: 'Medium',
            relationshipManager: 'Peter Nkurunziza',
            notes: 'Stable institutional relationship'
          },
          {
            id: 'CUST005',
            name: 'Kigali Manufacturing Co',
            accountNumber: '5678901234',
            nationalId: '5678901234567890',
            phone: '+250788567890',
            email: 'info@kmc.rw',
            segment: 'Corporate',
            accountStatus: 'Active',
            products: ['Business Banking', 'Trade Finance'],
            lastTransaction: '2024-01-19',
            churnPrediction: 28,
            riskLevel: 'Low',
            relationshipManager: 'Sarah Uwimana',
            notes: 'Established manufacturing company with stable operations'
          },
          {
            id: 'CUST006',
            name: 'Digital Services Ltd',
            accountNumber: '6789012345',
            nationalId: '6789012345678901',
            phone: '+250788678901',
            email: 'contact@digitalservices.rw',
            segment: 'SME',
            accountStatus: 'Active',
            products: ['SME Banking', 'Digital Banking'],
            lastTransaction: '2024-01-17',
            churnPrediction: 22,
            riskLevel: 'Low',
            relationshipManager: 'Alice Mukamana',
            notes: 'Digital services company with high engagement'
          }
        ];
        
        setCustomers(realCustomers);
      } catch (error) {
        console.error('Failed to load customers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.accountNumber.includes(searchTerm) ||
                         customer.phone.includes(searchTerm);
    const matchesSegment = filterSegment === 'all' || customer.segment.toLowerCase() === filterSegment;
    const matchesRisk = filterRisk === 'all' || customer.riskLevel.toLowerCase() === filterRisk;
    return matchesSearch && matchesSegment && matchesRisk;
  }) || [];

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
              <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600">Customer database and search functionality</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Export List
              </Button>
              <Button variant="primary" size="sm">
                ➕ Add Customer
              </Button>
            </div>
          </div>

          {/* Customer Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{customers.length}</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">👥</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="danger" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">High Risk</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {customers.filter(c => c.riskLevel === 'High').length}
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
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {customers.filter(c => c.accountStatus === 'Active').length}
                    </p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">✅</div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg Churn Risk</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {Math.round(customers.reduce((sum, c) => sum + c.churnPrediction, 0) / customers.length)}%
                    </p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📊</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card variant="corporate" shadow="medium">
            <Card.Content>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, account number, or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterSegment}
                    onChange={(e) => setFilterSegment(e.target.value)}
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    <option value="all">All Segments</option>
                    <option value="retail">Retail</option>
                    <option value="corporate">Corporate</option>
                    <option value="sme">SME</option>
                    <option value="institutional">Institutional</option>
                  </select>
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                  <Button variant="outline" size="sm">
                    🔍 Search
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Customers List */}
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} variant="default" shadow="medium" hover
                    onClick={() => setSelectedCustomer(customer)}>
                <Card.Content>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                          {customer.segment}
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskColor(customer.riskLevel)}`}>
                          {customer.riskLevel} Risk
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(customer.accountStatus)}`}>
                          {customer.accountStatus}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Account Number</p>
                          <p className="font-medium">{customer.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Last Transaction</p>
                          <p className="font-medium">{customer.lastTransaction}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Relationship Manager</p>
                          <p className="font-medium">{customer.relationshipManager}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Churn Prediction</p>
                          <p className={`text-lg font-bold ${getChurnColor(customer.churnPrediction)}`}>
                            {customer.churnPrediction}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Risk Level</p>
                          <p className="font-medium">{customer.riskLevel}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Products</p>
                          <p className="font-medium">{customer.products.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Segment</p>
                          <p className="font-medium">{customer.segment}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {customer.products.map((product, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {product}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-600">{customer.notes}</p>
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

          {/* Selected Customer Details */}
          {selectedCustomer && (
            <Card variant="executive" shadow="medium">
              <Card.Header variant="executive">
                <Card.Title variant="executive">{selectedCustomer.name} - Customer Details</Card.Title>
                <Card.Description variant="executive">Complete customer profile and information</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer ID:</span>
                        <span className="font-medium">{selectedCustomer.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium">{selectedCustomer.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">National ID:</span>
                        <span className="font-medium">{selectedCustomer.nationalId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedCustomer.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Risk & Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Churn Prediction:</span>
                        <span className={`font-medium ${getChurnColor(selectedCustomer.churnPrediction)}`}>
                          {selectedCustomer.churnPrediction}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="font-medium">{selectedCustomer.riskLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Segment:</span>
                        <span className="font-medium">{selectedCustomer.segment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium">{selectedCustomer.accountStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Relationship Manager:</span>
                        <span className="font-medium">{selectedCustomer.relationshipManager}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Products & Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.products.map((product, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedCustomer.notes}</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
                  <Button variant="primary">
                    📞 Make Call
                  </Button>
                  <Button variant="outline">
                    📧 Send Email
                  </Button>
                  <Button variant="outline">
                    📊 View Analytics
                  </Button>
                  <Button variant="outline">
                    📝 Add Note
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <Card variant="corporate" shadow="medium">
              <Card.Content>
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No customers found</h3>
                  <p className="text-sm text-gray-600">
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

export default Customers;
