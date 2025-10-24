import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const InteractionLog = () => {
  const { isCollapsed } = useSidebar();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  useEffect(() => {
    const loadInteractions = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock interaction data
        const mockInteractions = [
          {
            id: 'I001',
            customer: 'Jean Baptiste',
            customerId: 'C1001',
            interactionType: 'Retention Call',
            outcome: 'Customer Retained',
            notes: 'Discussed fee concerns, offered quarterly fee waiver. Customer satisfied with resolution.',
            timestamp: '2024-01-22 14:30',
            officer: 'Alice Mukamana',
            duration: 25,
            satisfaction: 8,
            followUpRequired: true,
            followUpDate: '2024-01-25',
            products: ['Savings', 'Current Account'],
            churnScore: 87
          },
          {
            id: 'I002',
            customer: 'Marie Claire',
            customerId: 'C1002',
            interactionType: 'Product Offer',
            outcome: 'Product Sold',
            notes: 'Presented Aguka investment opportunities. Customer interested in 6-month term.',
            timestamp: '2024-01-22 11:15',
            officer: 'John Nkurunziza',
            duration: 18,
            satisfaction: 9,
            followUpRequired: false,
            followUpDate: null,
            products: ['Savings', 'Investment'],
            churnScore: 45
          },
          {
            id: 'I003',
            customer: 'Peter Nkurunziza',
            customerId: 'C1003',
            interactionType: 'Follow-up Call',
            outcome: 'Customer Retained',
            notes: 'Regular relationship check. Customer happy with digital banking services.',
            timestamp: '2024-01-21 16:45',
            officer: 'Grace Uwimana',
            duration: 12,
            satisfaction: 7,
            followUpRequired: true,
            followUpDate: '2024-01-30',
            products: ['Savings'],
            churnScore: 25
          },
          {
            id: 'I004',
            customer: 'Sarah Uwimana',
            customerId: 'C1004',
            interactionType: 'Complaint Resolution',
            outcome: 'Issue Resolved',
            notes: 'Addressed transaction fee concerns. Provided detailed explanation of fee structure.',
            timestamp: '2024-01-21 10:20',
            officer: 'Alice Mukamana',
            duration: 35,
            satisfaction: 6,
            followUpRequired: true,
            followUpDate: '2024-01-24',
            products: ['Savings', 'Current Account', 'Investment'],
            churnScore: 72
          },
          {
            id: 'I005',
            customer: 'Francine Mutoni',
            customerId: 'C1005',
            interactionType: 'Retention Call',
            outcome: 'Customer Churned',
            notes: 'Customer decided to close account due to better rates elsewhere. Could not match competitor offer.',
            timestamp: '2024-01-20 15:30',
            officer: 'John Nkurunziza',
            duration: 45,
            satisfaction: 3,
            followUpRequired: false,
            followUpDate: null,
            products: ['Savings'],
            churnScore: 95
          }
        ];
        
        setInteractions(mockInteractions);
      } catch (error) {
        console.error('Failed to load interactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInteractions();
  }, []);

  const filteredInteractions = interactions.filter(interaction => {
    const matchesSearch = interaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interaction.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interaction.officer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || interaction.interactionType === filterType;
    const matchesOutcome = filterOutcome === 'all' || interaction.outcome === filterOutcome;
    
    return matchesSearch && matchesType && matchesOutcome;
  });

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'Customer Retained': return 'bg-green-100 text-green-600';
      case 'Product Sold': return 'bg-blue-100 text-blue-600';
      case 'Issue Resolved': return 'bg-purple-100 text-purple-600';
      case 'Customer Churned': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getInteractionTypeColor = (type) => {
    switch (type) {
      case 'Retention Call': return 'bg-red-100 text-red-600';
      case 'Product Offer': return 'bg-blue-100 text-blue-600';
      case 'Follow-up Call': return 'bg-green-100 text-green-600';
      case 'Complaint Resolution': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSatisfactionColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
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
              <h1 className="text-2xl font-bold text-gray-900">Interaction Log</h1>
              <p className="text-gray-600">Complete history of customer interactions</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Export Log
              </Button>
              <Button variant="primary" size="sm">
                ➕ Log New Interaction
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Interactions</p>
                    <p className="text-2xl font-bold text-blue-900">{interactions.length}</p>
                  </div>
                  <div className="text-3xl">📞</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Retained</p>
                    <p className="text-2xl font-bold text-green-900">
                      {interactions.filter(i => i.outcome === 'Customer Retained').length}
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
                    <p className="text-sm font-medium text-purple-600">Products Sold</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {interactions.filter(i => i.outcome === 'Product Sold').length}
                    </p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Avg Satisfaction</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {Math.round(interactions.reduce((sum, i) => sum + i.satisfaction, 0) / interactions.length)}
                    </p>
                  </div>
                  <div className="text-3xl">😊</div>
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
                    placeholder="Search by customer, ID, or officer"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="Retention Call">Retention Call</option>
                    <option value="Product Offer">Product Offer</option>
                    <option value="Follow-up Call">Follow-up Call</option>
                    <option value="Complaint Resolution">Complaint Resolution</option>
                  </select>
                  <select
                    value={filterOutcome}
                    onChange={(e) => setFilterOutcome(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Outcomes</option>
                    <option value="Customer Retained">Customer Retained</option>
                    <option value="Product Sold">Product Sold</option>
                    <option value="Issue Resolved">Issue Resolved</option>
                    <option value="Customer Churned">Customer Churned</option>
                  </select>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Interactions List */}
          <div className="space-y-4">
            {filteredInteractions.map((interaction) => (
              <Card key={interaction.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedInteraction(interaction)}>
                <Card.Content>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{interaction.customer}</h3>
                        <span className="text-sm text-gray-600">({interaction.customerId})</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getInteractionTypeColor(interaction.interactionType)}`}>
                          {interaction.interactionType}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getOutcomeColor(interaction.outcome)}`}>
                          {interaction.outcome}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{interaction.notes}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Officer:</span> {interaction.officer}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {interaction.duration}min
                        </div>
                        <div>
                          <span className="font-medium">Satisfaction:</span> 
                          <span className={`ml-1 font-semibold ${getSatisfactionColor(interaction.satisfaction)}`}>
                            {interaction.satisfaction}/10
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Churn Score:</span> {interaction.churnScore}%
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Time: {interaction.timestamp}</span>
                        {interaction.followUpRequired && (
                          <span className="text-orange-600 font-medium">
                            Follow-up due: {interaction.followUpDate}
                          </span>
                        )}
                      </div>

                      {interaction.products && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Products: </span>
                          <div className="inline-flex flex-wrap gap-1">
                            {interaction.products.map((product, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {interaction.followUpRequired && (
                        <Button size="sm" variant="primary">
                          Schedule Follow-up
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading interactions...</span>
            </div>
          )}

          {/* Empty State */}
          {filteredInteractions.length === 0 && !loading && (
            <Card>
              <Card.Content>
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📝</div>
                  <h3 className="text-sm font-medium text-gray-900">No interactions found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractionLog;