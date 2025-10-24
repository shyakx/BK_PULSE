import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';
import { churnModelService as localChurnService, ChurnModelService } from '../services/churnModel.js';
import { scoreCustomer, getModelStatus } from '../services/mlGateway.js';
import { getHighRiskCustomers, getCustomerStats } from '../services/customerDatabase.js';

const ChurnPrediction = () => {
  const { isCollapsed } = useSidebar();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [scoring, setScoring] = useState(false);
  const [apiScore, setApiScore] = useState(null);
  const [apiRisk, setApiRisk] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [recs, setRecs] = useState([]);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        // Load real high-risk customers from CSV
        const highRiskCustomers = await getHighRiskCustomers(20);
        
        // Transform to display format
        const displayCustomers = highRiskCustomers.map(customer => ({
          id: customer.id,
          name: customer.name,
          segment: customer.segment,
          riskScore: Math.round(customer.churnProbability * 100),
          riskLevel: customer.churnProbability >= 0.7 ? 'High' : 
                    customer.churnProbability >= 0.4 ? 'Medium' : 'Low',
          lastTransaction: customer.lastTransaction,
          accountBalance: customer.accountBalance,
          digitalActivity: customer.mobileBankingUsage > 10 ? 'High' : 
                          customer.mobileBankingUsage > 5 ? 'Medium' : 'Low',
          complaints: customer.complaintHistory,
          tenure: customer.tenure,
          products: customer.productCount > 3 ? ['Savings', 'Current Account', 'Credit Card'] :
                   customer.productCount > 1 ? ['Savings', 'Current Account'] : ['Savings'],
          clv: customer.accountBalance * 5, // Estimate CLV
          // Store full customer data for scoring
          fullCustomerData: customer
        }));
        
        setCustomers(displayCustomers);
      } catch (error) {
        console.error('Failed to load customers:', error);
        // Fallback to empty array
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || customer.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSegmentColor = (segment) => {
    switch (segment) {
      case 'Gold': return 'bg-yellow-100 text-yellow-600';
      case 'Silver': return 'bg-gray-100 text-gray-600';
      case 'Bronze': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const flattenFeatures = (features) => {
    const flat = { ...features };
    if (features.economicIndicators) {
      flat.economicIndicators_gdp = features.economicIndicators.gdp ?? 0;
      flat.economicIndicators_inflation = features.economicIndicators.inflation ?? 0;
      flat.economicIndicators_unemployment = features.economicIndicators.unemployment ?? 0;
      delete flat.economicIndicators;
    }
    if (features.marketConditions) {
      flat.marketConditions_marketGrowth = features.marketConditions.marketGrowth ?? 0;
      flat.marketConditions_competition = features.marketConditions.competition ?? 0;
      flat.marketConditions_stability = features.marketConditions.stability ?? 0;
      delete flat.marketConditions;
    }
    return flat;
  };

  const handleScoreSelected = async () => {
    if (!selectedCustomer) return;
    setScoring(true);
    setApiError(null);
    try {
      // Use the real customer data if available, otherwise use display data
      const customerData = selectedCustomer.fullCustomerData || selectedCustomer;
      
      const features = ChurnModelService.createFeatureSet({
        age: customerData.age,
        gender: customerData.gender,
        location: customerData.location,
        accountOpenDate: customerData.accountOpenDate,
        totalBalance: customerData.accountBalance,
        avgBalance: customerData.avgBalance,
        balanceHistory: [{ balance: customerData.accountBalance }], // Simplified
        transactions: Array.from({length: customerData.transactionFrequency}, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          amount: customerData.avgTransactionAmount,
          category: 'Transaction'
        })),
        lastTransactionDate: customerData.lastTransaction,
        products: customerData.products,
        digitalUsage: {
          mobileApp: customerData.mobileBankingUsage,
          onlineBanking: customerData.mobileBankingUsage,
          atmUsage: customerData.branchVisits,
          cardUsage: customerData.hasCreditCard ? 1 : 0
        },
        creditAccounts: customerData.hasCreditCard ? [{
          balance: customerData.accountBalance * 0.1,
          limit: customerData.accountBalance * 0.5
        }] : [],
        loginHistory: Array.from({length: customerData.activityScore}, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        })),
        supportInteractions: Array.from({length: customerData.complaintHistory}, (_, i) => ({
          date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Support'
        })),
        complaints: Array.from({length: customerData.complaintHistory}, (_, i) => ({
          date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Complaint'
        })),
        paymentHistory: Array.from({length: customerData.complaintHistory}, (_, i) => ({
          date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
          daysLate: i % 3 === 0 ? 1 : 0
        })),
        creditScore: 600 + (customerData.activityScore * 10),
        incomeHistory: Array.from({length: 6}, (_, i) => ({
          amount: customerData.accountBalance * (0.8 + i * 0.1)
        })),
        channelUsage: {
          branch: customerData.branchVisits,
          mobile: customerData.mobileBankingUsage,
          online: customerData.mobileBankingUsage,
          atm: customerData.branchVisits,
          phone: customerData.complaintHistory
        },
        activityPatterns: Array.from({length: 7}, (_, i) => ({
          hour: 9 + (i * 2),
          activity: customerData.activityScore
        })),
        historicalData: Array.from({length: 12}, (_, i) => ({
          month: i,
          activity: customerData.activityScore
        })),
        region: customerData.location,
        segment: customerData.segment,
      });
      const flat = flattenFeatures(features);
      const res = await scoreCustomer(flat);
      setApiScore(Math.round((res.churn_probability || 0) * 100));
      setApiRisk(res.risk || 'Unknown');
      setDrivers(res.top_drivers || []);
      setRecs(res.recommendations || []);
    } catch (e) {
      setApiError(e.message || String(e));
    } finally {
      setScoring(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const info = await getModelStatus();
        setModelInfo(info);
      } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Churn Prediction Engine</h1>
            <p className="text-gray-600">Customer churn risk scoring and analysis</p>
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
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                  <Button variant="outline" size="sm">
                    Export Data
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Customer List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Customer Risk Scores</h2>
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}>
                  <Card.Content>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <p className="text-sm text-gray-600">ID: {customer.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(customer.riskLevel)}`}>
                          {customer.riskLevel}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSegmentColor(customer.segment)}`}>
                          {customer.segment}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Risk Score</p>
                        <p className="text-lg font-bold text-gray-900">{customer.riskScore}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CLV</p>
                        <p className="text-lg font-bold text-gray-900">
                          {customer.clv.toLocaleString()} RWF
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Last Transaction: {customer.lastTransaction}</span>
                      <span>Tenure: {customer.tenure} months</span>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>

            {/* Customer Details */}
            <div>
              {selectedCustomer ? (
                <Card>
                  <Card.Header>
                    <Card.Title>Customer Details</Card.Title>
                    <Card.Description>{selectedCustomer.name} - {selectedCustomer.id}</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Risk Score</h4>
                          <p className="text-2xl font-bold text-gray-900">{selectedCustomer.riskScore}%</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Segment</h4>
                          <p className="text-lg font-semibold text-gray-900">{selectedCustomer.segment}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Account Balance</h4>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedCustomer.accountBalance.toLocaleString()} RWF
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Customer Lifetime Value</h4>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedCustomer.clv.toLocaleString()} RWF
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">API Risk</h4>
                          <p className="text-lg font-semibold text-gray-900">{apiRisk ?? '—'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">API Score</h4>
                          <p className="text-lg font-semibold text-gray-900">{apiScore != null ? `${apiScore}%` : '—'}</p>
                        </div>
                      </div>

                      {drivers && drivers.length > 0 && (
                        <div className="pt-2">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Top Drivers</h4>
                          <ul className="text-sm list-disc pl-5 text-gray-700">
                            {drivers.map((d, i) => (
                              <li key={i}>{d.feature}: {Math.round(d.impact * 1000) / 1000}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {recs && recs.length > 0 && (
                        <div className="pt-2">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Recommended Actions</h4>
                          <ul className="text-sm list-disc pl-5 text-gray-700">
                            {recs.map((r, i) => (
                              <li key={i}>{r.action}{r.rationale ? ` — ${r.rationale}` : ''}</li>
                            ))}
                          </ul>
                        </div>
                      )}

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

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Digital Activity</p>
                          <p className="font-medium">{selectedCustomer.digitalActivity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Complaints</p>
                          <p className="font-medium">{selectedCustomer.complaints}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        {apiError && (
                          <div className="text-sm text-red-600">{apiError}</div>
                        )}
                        <Button variant="primary" size="sm" className="w-full" onClick={handleScoreSelected} disabled={scoring}>
                          {scoring ? 'Scoring...' : 'Score with Model'}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
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
                      <div className="text-gray-400 text-4xl mb-2">👤</div>
                      <h3 className="text-sm font-medium text-gray-900">Select a Customer</h3>
                      <p className="text-sm text-gray-500">Click on a customer to view detailed information</p>
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
              <span className="ml-2 text-gray-600">Loading customers...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChurnPrediction;