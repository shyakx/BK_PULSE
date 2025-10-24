import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const CustomerSegmentation = () => {
  const { isCollapsed } = useSidebar();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    const loadSegments = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock segment data
        const mockSegments = [
          {
            id: 'gold',
            name: 'Gold Segment',
            description: 'High-value customers with multiple products',
            customerCount: 1250,
            totalValue: 4500000000,
            avgClv: 3600000,
            churnRisk: 15,
            characteristics: [
              'Account balance > 5M RWF',
              'Multiple product ownership',
              'Long tenure (>24 months)',
              'High digital engagement'
            ],
            strategies: [
              'Premium retention offers',
              'Exclusive product access',
              'Dedicated relationship manager',
              'Priority customer service'
            ],
            color: 'bg-yellow-100 text-yellow-600'
          },
          {
            id: 'silver',
            name: 'Silver Segment',
            description: 'Medium-value customers with growth potential',
            customerCount: 3500,
            totalValue: 2800000000,
            avgClv: 800000,
            churnRisk: 25,
            characteristics: [
              'Account balance 1M-5M RWF',
              '2-3 products',
              'Medium tenure (12-24 months)',
              'Moderate digital usage'
            ],
            strategies: [
              'Cross-selling opportunities',
              'Value-added services',
              'Regular engagement',
              'Product education'
            ],
            color: 'bg-gray-100 text-gray-600'
          },
          {
            id: 'bronze',
            name: 'Bronze Segment',
            description: 'Basic customers with potential for growth',
            customerCount: 8500,
            totalValue: 1200000000,
            avgClv: 140000,
            churnRisk: 35,
            characteristics: [
              'Account balance < 1M RWF',
              '1-2 products',
              'Short tenure (<12 months)',
              'Low digital engagement'
            ],
            strategies: [
              'Financial literacy programs',
              'Digital banking training',
              'Basic product education',
              'Relationship building'
            ],
            color: 'bg-orange-100 text-orange-600'
          },
          {
            id: 'high-risk',
            name: 'High Risk Segment',
            description: 'Customers showing churn signals',
            customerCount: 450,
            totalValue: 180000000,
            avgClv: 400000,
            churnRisk: 85,
            characteristics: [
              'Declining transaction frequency',
              'Multiple complaints',
              'Low engagement',
              'Competitor activity'
            ],
            strategies: [
              'Immediate intervention',
              'Retention incentives',
              'Personal outreach',
              'Issue resolution'
            ],
            color: 'bg-red-100 text-red-600'
          }
        ];
        
        setSegments(mockSegments);
      } catch (error) {
        console.error('Failed to load segments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSegments();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Segmentation</h1>
              <p className="text-gray-600">Customer grouping by value, risk, and behavior</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Export Segments
              </Button>
              <Button variant="primary" size="sm">
                ⚙️ Update Rules
              </Button>
            </div>
          </div>

          {/* Segment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {segments.map((segment) => (
              <Card key={segment.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedSegment(segment)}>
                <Card.Content>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{segment.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${segment.color}`}>
                      {segment.customerCount} customers
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{segment.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Value</span>
                      <span className="font-medium">{segment.totalValue.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg CLV</span>
                      <span className="font-medium">{segment.avgClv.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Churn Risk</span>
                      <span className="font-medium text-red-600">{segment.churnRisk}%</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Segment Details */}
          {selectedSegment && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <Card.Header>
                  <Card.Title>{selectedSegment.name} Details</Card.Title>
                  <Card.Description>{selectedSegment.description}</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Customer Count</h4>
                        <p className="text-2xl font-bold text-gray-900">{selectedSegment.customerCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Total Value</h4>
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedSegment.totalValue.toLocaleString()} RWF
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Average CLV</h4>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedSegment.avgClv.toLocaleString()} RWF
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Churn Risk</h4>
                        <p className="text-lg font-semibold text-red-600">{selectedSegment.churnRisk}%</p>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Segment Characteristics</Card.Title>
                  <Card.Description>Key attributes of this customer segment</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Characteristics</h4>
                      <ul className="space-y-1">
                        {selectedSegment.characteristics.map((characteristic, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {characteristic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Retention Strategies</h4>
                      <ul className="space-y-1">
                        {selectedSegment.strategies.map((strategy, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}

          {/* Segment Actions */}
          <Card>
            <Card.Header>
              <Card.Title>Segment Management</Card.Title>
              <Card.Description>Actions and insights for customer segments</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm">Segment Analytics</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">📢</span>
                  <span className="text-sm">Create Campaign</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">⚙️</span>
                  <span className="text-sm">Update Rules</span>
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading segments...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSegmentation;