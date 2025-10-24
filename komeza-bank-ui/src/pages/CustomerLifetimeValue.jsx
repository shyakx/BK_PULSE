import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const CustomerLifetimeValue = () => {
  const { isCollapsed } = useSidebar();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clvFilter, setClvFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock customer CLV data
        const mockCustomers = [
          {
            id: 'C1001',
            name: 'Jean Baptiste',
            segment: 'Gold',
            currentClv: 12500000,
            projectedClv: 15000000,
            clvGrowth: 20,
            monthlyRevenue: 450000,
            retentionProbability: 85,
            products: ['Savings', 'Current Account', 'Credit Card'],
            tenure: 36,
            lastTransaction: '2024-01-22',
            riskScore: 15
          },
          {
            id: 'C1002',
            name: 'Marie Claire',
            segment: 'Silver',
            currentClv: 3200000,
            projectedClv: 4200000,
            clvGrowth: 31,
            monthlyRevenue: 180000,
            retentionProbability: 75,
            products: ['Savings', 'Investment'],
            tenure: 18,
            lastTransaction: '2024-01-20',
            riskScore: 25
          },
          {
            id: 'C1003',
            name: 'Peter Nkurunziza',
            segment: 'Bronze',
            currentClv: 800000,
            projectedClv: 1200000,
            clvGrowth: 50,
            monthlyRevenue: 45000,
            retentionProbability: 65,
            products: ['Savings'],
            tenure: 6,
            lastTransaction: '2024-01-22',
            riskScore: 35
          },
          {
            id: 'C1004',
            name: 'Sarah Uwimana',
            segment: 'Gold',
            currentClv: 8500000,
            projectedClv: 9500000,
            clvGrowth: 12,
            monthlyRevenue: 320000,
            retentionProbability: 90,
            products: ['Savings', 'Current Account', 'Investment'],
            tenure: 48,
            lastTransaction: '2024-01-21',
            riskScore: 10
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

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (clvFilter === 'high') matchesFilter = customer.currentClv >= 5000000;
    if (clvFilter === 'medium') matchesFilter = customer.currentClv >= 1000000 && customer.currentClv < 5000000;
    if (clvFilter === 'low') matchesFilter = customer.currentClv < 1000000;
    
    return matchesSearch && matchesFilter;
  });

  const getClvTier = (clv) => {
    if (clv >= 5000000) return { tier: 'High', color: 'bg-green-100 text-green-600' };
    if (clv >= 1000000) return { tier: 'Medium', color: 'bg-yellow-100 text-yellow-600' };
    return { tier: 'Low', color: 'bg-red-100 text-red-600' };
  };

  const getSegmentColor = (segment) => {
    switch (segment) {
      case 'Gold': return 'bg-yellow-100 text-yellow-600';
      case 'Silver': return 'bg-gray-100 text-gray-600';
      case 'Bronze': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Lifetime Value (CLV)</h1>
            <p className="text-gray-600">Customer value analysis and projections</p>
          </div>

          {/* CLV Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total CLV</p>
                    <p className="text-2xl font-bold text-green-900">
                      {customers.reduce((sum, c) => sum + c.currentClv, 0).toLocaleString()} RWF
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
                    <p className="text-sm font-medium text-blue-600">Avg CLV</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {Math.round(customers.reduce((sum, c) => sum + c.currentClv, 0) / customers.length).toLocaleString()} RWF
                    </p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">High Value</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {customers.filter(c => c.currentClv >= 5000000).length}
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
                    <p className="text-sm font-medium text-orange-600">Growth Potential</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {Math.round(customers.reduce((sum, c) => sum + c.clvGrowth, 0) / customers.length)}%
                    </p>
                  </div>
                  <div className="text-3xl">📈</div>
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
                    placeholder="Search customers by name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={clvFilter}
                    onChange={(e) => setClvFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All CLV Tiers</option>
                    <option value="high">High CLV (≥5M)</option>
                    <option value="medium">Medium CLV (1M-5M)</option>
                    <option value="low">Low CLV (&lt;1M)</option>
                  </select>
                  <Button variant="outline" size="sm">
                    Export CLV Data
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Customer List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Customer CLV Analysis</h2>
              {filteredCustomers.map((customer) => {
                const clvTier = getClvTier(customer.currentClv);
                return (
                  <Card key={customer.id} className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedCustomer(customer)}>
                    <Card.Content>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                          <p className="text-sm text-gray-600">ID: {customer.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${clvTier.color}`}>
                            {clvTier.tier} CLV
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getSegmentColor(customer.segment)}`}>
                            {customer.segment}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Current CLV</p>
                          <p className="text-lg font-bold text-gray-900">
                            {customer.currentClv.toLocaleString()} RWF
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Projected CLV</p>
                          <p className="text-lg font-bold text-green-600">
                            {customer.projectedClv.toLocaleString()} RWF
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Growth: +{customer.clvGrowth}%</span>
                        <span>Retention: {customer.retentionProbability}%</span>
                      </div>
                    </Card.Content>
                  </Card>
                );
              })}
            </div>

            {/* Customer Details */}
            <div>
              {selectedCustomer ? (
                <Card>
                  <Card.Header>
                    <Card.Title>CLV Details</Card.Title>
                    <Card.Description>{selectedCustomer.name} - {selectedCustomer.id}</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Current CLV</h4>
                          <p className="text-2xl font-bold text-gray-900">
                            {selectedCustomer.currentClv.toLocaleString()} RWF
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Projected CLV</h4>
                          <p className="text-2xl font-bold text-green-600">
                            {selectedCustomer.projectedClv.toLocaleString()} RWF
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Monthly Revenue</h4>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedCustomer.monthlyRevenue.toLocaleString()} RWF
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">CLV Growth</h4>
                          <p className="text-lg font-semibold text-green-600">
                            +{selectedCustomer.clvGrowth}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Retention Probability</h4>
                          <p className="text-lg font-semibold text-blue-600">
                            {selectedCustomer.retentionProbability}%
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Tenure</h4>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedCustomer.tenure} months
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Products</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.products.map((product, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <Button variant="primary" size="sm" className="w-full">
                          View Full Profile
                        </Button>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ) : (
                <Card>
                  <Card.Content>
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-2">💰</div>
                      <h3 className="text-sm font-medium text-gray-900">Select a Customer</h3>
                      <p className="text-sm text-gray-500">Click on a customer to view detailed CLV information</p>
                    </div>
                  </Card.Content>
                </Card>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading CLV data...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerLifetimeValue;