import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const CustomerInteractionWorkflow = () => {
  const { isCollapsed } = useSidebar();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    customer: '',
    customerId: '',
    interactionType: '',
    outcome: '',
    followUpRequired: false,
    followUpDate: '',
    notes: ''
  });

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
            followUpRequired: true,
            followUpDate: '2024-01-25',
            notes: 'Discussed fee concerns, offered quarterly fee waiver. Customer satisfied.',
            timestamp: '2024-01-22 14:30',
            officer: 'Alice Mukamana',
            duration: 25,
            satisfaction: 8
          },
          {
            id: 'I002',
            customer: 'Marie Claire',
            customerId: 'C1002',
            interactionType: 'Product Offer',
            outcome: 'Product Sold',
            followUpRequired: false,
            followUpDate: null,
            notes: 'Presented investment opportunities. Customer interested in Aguka investment.',
            timestamp: '2024-01-22 11:15',
            officer: 'John Nkurunziza',
            duration: 18,
            satisfaction: 9
          },
          {
            id: 'I003',
            customer: 'Peter Nkurunziza',
            customerId: 'C1003',
            interactionType: 'Follow-up Call',
            outcome: 'Customer Retained',
            followUpRequired: true,
            followUpDate: '2024-01-30',
            notes: 'Regular relationship check. Customer happy with services.',
            timestamp: '2024-01-21 16:45',
            officer: 'Grace Uwimana',
            duration: 12,
            satisfaction: 7
          },
          {
            id: 'I004',
            customer: 'Sarah Uwimana',
            customerId: 'C1004',
            interactionType: 'Complaint Resolution',
            outcome: 'Issue Resolved',
            followUpRequired: true,
            followUpDate: '2024-01-24',
            notes: 'Addressed transaction fee concerns. Provided detailed explanation.',
            timestamp: '2024-01-21 10:20',
            officer: 'Alice Mukamana',
            duration: 35,
            satisfaction: 6
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

  const handleSubmitNewInteraction = (e) => {
    e.preventDefault();
    const newId = `I${String(interactions.length + 1).padStart(3, '0')}`;
    const interaction = {
      ...newInteraction,
      id: newId,
      timestamp: new Date().toLocaleString(),
      officer: 'Current User', // This would come from auth context
      duration: 0,
      satisfaction: 0
    };
    
    setInteractions(prev => [interaction, ...prev]);
    setNewInteraction({
      customer: '',
      customerId: '',
      interactionType: '',
      outcome: '',
      followUpRequired: false,
      followUpDate: '',
      notes: ''
    });
    setShowNewForm(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Interaction Workflow</h1>
              <p className="text-gray-600">Track and manage customer interactions</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 View Analytics
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowNewForm(true)}>
                ➕ New Interaction
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Interactions</p>
                    <p className="text-2xl font-bold text-green-900">{interactions.length}</p>
                  </div>
                  <div className="text-3xl">📞</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Retained Today</p>
                    <p className="text-2xl font-bold text-blue-900">
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
                    <p className="text-sm font-medium text-orange-600">Follow-ups Due</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {interactions.filter(i => i.followUpRequired).length}
                    </p>
                  </div>
                  <div className="text-3xl">📅</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* New Interaction Form */}
          {showNewForm && (
            <Card>
              <Card.Header>
                <Card.Title>Log New Interaction</Card.Title>
                <Card.Description>Record a customer interaction</Card.Description>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleSubmitNewInteraction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Customer Name"
                      value={newInteraction.customer}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, customer: e.target.value }))}
                      required
                    />
                    <Input
                      label="Customer ID"
                      value={newInteraction.customerId}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, customerId: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Interaction Type</label>
                      <select
                        value={newInteraction.interactionType}
                        onChange={(e) => setNewInteraction(prev => ({ ...prev, interactionType: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select type...</option>
                        <option value="Retention Call">Retention Call</option>
                        <option value="Product Offer">Product Offer</option>
                        <option value="Follow-up Call">Follow-up Call</option>
                        <option value="Complaint Resolution">Complaint Resolution</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                      <select
                        value={newInteraction.outcome}
                        onChange={(e) => setNewInteraction(prev => ({ ...prev, outcome: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select outcome...</option>
                        <option value="Customer Retained">Customer Retained</option>
                        <option value="Product Sold">Product Sold</option>
                        <option value="Issue Resolved">Issue Resolved</option>
                        <option value="Customer Churned">Customer Churned</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newInteraction.notes}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newInteraction.followUpRequired}
                        onChange={(e) => setNewInteraction(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Follow-up required</span>
                    </label>
                    {newInteraction.followUpRequired && (
                      <Input
                        type="date"
                        value={newInteraction.followUpDate}
                        onChange={(e) => setNewInteraction(prev => ({ ...prev, followUpDate: e.target.value }))}
                        className="w-48"
                      />
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" variant="primary">
                      Save Interaction
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          )}

          {/* Interactions List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Interactions</h2>
            {interactions.map((interaction) => (
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
                      
                      <p className="text-sm text-gray-600 mb-2">{interaction.notes}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Officer:</span> {interaction.officer}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {interaction.duration}min
                        </div>
                        <div>
                          <span className="font-medium">Satisfaction:</span> {interaction.satisfaction}/10
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {interaction.timestamp}
                        </div>
                      </div>

                      {interaction.followUpRequired && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-800">
                            <span className="font-medium">Follow-up due:</span> {interaction.followUpDate}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
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
        </div>
      </div>
    </div>
  );
};

export default CustomerInteractionWorkflow;