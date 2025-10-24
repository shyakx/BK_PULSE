import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const CallQueue = () => {
  const { isCollapsed } = useSidebar();
  const [callQueue, setCallQueue] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCallQueue = async () => {
      setLoading(true);
      try {
        const queueData = await getCallQueue();
        setCallQueue(queueData);
      } catch (error) {
        console.error('Failed to load call queue:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCallQueue();
  }, []);

  // Mock API function - replace with actual API call
  const getCallQueue = async () => {
    return [
      {
        id: 1,
        customer: 'Marie Uwimana',
        phone: '+250 789 456 789',
        priority: 'High',
        segment: 'Gold',
        reason: 'Churn Risk',
        scheduledTime: '14:30',
        status: 'Pending'
      },
      {
        id: 2,
        customer: 'Francine Mutoni',
        phone: '+250 788 234 567',
        priority: 'Medium',
        segment: 'Silver',
        reason: 'Product Offer',
        scheduledTime: '15:00',
        status: 'Pending'
      },
      {
        id: 3,
        customer: 'Grace Mukamana',
        phone: '+250 787 345 678',
        priority: 'High',
        segment: 'Gold',
        reason: 'Retention Call',
        scheduledTime: '15:30',
        status: 'Pending'
      },
      {
        id: 4,
        customer: 'John Nkurunziza',
        phone: '+250 786 456 789',
        priority: 'Low',
        segment: 'Bronze',
        reason: 'Follow-up',
        scheduledTime: '16:00',
        status: 'Pending'
      },
      {
        id: 5,
        customer: 'Alice Mukamana',
        phone: '+250 785 567 890',
        priority: 'Medium',
        segment: 'Silver',
        reason: 'Product Offer',
        scheduledTime: '16:30',
        status: 'Completed'
      }
    ];
  };

  const handleStartCall = (customer) => {
    alert(`Starting call with ${customer.customer} at ${customer.phone}`);
  };

  const handleLoadLeads = () => {
    alert('Loading leads from AI system...');
  };

  const handleOpenExcel = () => {
    alert('Opening Excel file...');
  };

  const handleExportExcel = () => {
    alert('Exporting to Excel...');
  };

  const filteredQueue = callQueue.filter(customer => 
    customer.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
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

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Call Queue & Tasks</h1>
            <p className="text-gray-600">Prioritized customer contact list and daily tasks</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Today's Call Queue */}
            <Card className="h-fit">
              <Card.Header>
                <Card.Title>Today's Call Queue</Card.Title>
                <Card.Description>Prioritized customer contact list ({filteredQueue.length} total customers)</Card.Description>
              </Card.Header>
              <Card.Content>
                {/* Search and Actions */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Search customers by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLoadLeads}
                        className="flex items-center gap-2"
                      >
                        <span>🤖</span>
                        Load Leads
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleOpenExcel}
                        className="flex items-center gap-2"
                      >
                        <span>📊</span>
                        Open Excel
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportExcel}
                        className="flex items-center gap-2"
                      >
                        <span>💾</span>
                        Export Excel
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Customer List */}
                <div className="space-y-3">
                  {filteredQueue.map((customer) => (
                    <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{customer.customer}</h3>
                            <div className="flex gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(customer.priority)}`}>
                                {customer.priority}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getSegmentColor(customer.segment)}`}>
                                {customer.segment}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{customer.phone}</p>
                          <p className="text-sm text-gray-500 mb-2">{customer.reason}</p>
                          <p className="text-sm font-medium text-gray-700">Scheduled: {customer.scheduledTime}</p>
                        </div>
                        <div className="ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartCall(customer)}
                            disabled={customer.status === 'Completed'}
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredQueue.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📞</div>
                    <h3 className="text-sm font-medium text-gray-900">No customers found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search or refresh the queue.</p>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Right Column - System Integration Status */}
            <Card className="h-fit">
              <Card.Header>
                <Card.Title>System Integration Status</Card.Title>
                <Card.Description>Connected systems and last sync times</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {/* Recommender Engine */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🤖</div>
                      <div>
                        <h3 className="font-medium text-gray-900">Recommender Engine</h3>
                        <p className="text-sm text-gray-600">AI-powered customer recommendations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-600 font-medium">Disconnected</span>
                    </div>
                  </div>

                  {/* CRM System */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">👥</div>
                      <div>
                        <h3 className="font-medium text-gray-900">CRM System</h3>
                        <p className="text-sm text-gray-600">Customer relationship management</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-600 font-medium">Disconnected</span>
                    </div>
                  </div>

                  {/* Telephony System */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📞</div>
                      <div>
                        <h3 className="font-medium text-gray-900">Telephony System</h3>
                        <p className="text-sm text-gray-600">Call tracking and management</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-600 font-medium">Disconnected</span>
                    </div>
                  </div>
                </div>

                {/* Connection Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => alert('Reconnecting to systems...')}
                    className="w-full"
                  >
                    Reconnect All Systems
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallQueue;
