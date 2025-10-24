import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const TaskAssignmentEngine = () => {
  const { isCollapsed } = useSidebar();
  const [tasks, setTasks] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockOfficers = [
          {
            id: 'O001',
            name: 'Alice Mukamana',
            role: 'Senior Officer',
            currentTasks: 8,
            maxTasks: 15,
            specialization: ['Gold Segment', 'High Risk'],
            performance: 92,
            availability: 'Available'
          },
          {
            id: 'O002',
            name: 'John Nkurunziza',
            role: 'Officer',
            currentTasks: 12,
            maxTasks: 15,
            specialization: ['Silver Segment', 'Bronze Segment'],
            performance: 87,
            availability: 'Available'
          },
          {
            id: 'O003',
            name: 'Grace Uwimana',
            role: 'Officer',
            currentTasks: 15,
            maxTasks: 15,
            specialization: ['High Risk', 'Retention'],
            performance: 95,
            availability: 'Busy'
          }
        ];

        const mockTasks = [
          {
            id: 'T001',
            customer: 'Jean Baptiste',
            customerId: 'C1001',
            priority: 'High',
            taskType: 'Retention Call',
            description: 'High churn risk - immediate intervention required',
            assignedTo: null,
            dueDate: '2024-01-22',
            estimatedDuration: 30,
            customerSegment: 'Gold',
            churnScore: 87
          },
          {
            id: 'T002',
            customer: 'Marie Claire',
            customerId: 'C1002',
            priority: 'Medium',
            taskType: 'Product Offer',
            description: 'Present investment opportunities',
            assignedTo: null,
            dueDate: '2024-01-23',
            estimatedDuration: 20,
            customerSegment: 'Silver',
            churnScore: 45
          },
          {
            id: 'T003',
            customer: 'Peter Nkurunziza',
            customerId: 'C1003',
            priority: 'Low',
            taskType: 'Follow-up',
            description: 'Regular relationship check',
            assignedTo: null,
            dueDate: '2024-01-24',
            estimatedDuration: 15,
            customerSegment: 'Bronze',
            churnScore: 25
          },
          {
            id: 'T004',
            customer: 'Sarah Uwimana',
            customerId: 'C1004',
            priority: 'High',
            taskType: 'Retention Call',
            description: 'Address recent complaints',
            assignedTo: null,
            dueDate: '2024-01-22',
            estimatedDuration: 45,
            customerSegment: 'Gold',
            churnScore: 72
          }
        ];
        
        setOfficers(mockOfficers);
        setTasks(mockTasks);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-600';
      case 'Busy': return 'bg-red-100 text-red-600';
      case 'Offline': return 'bg-gray-100 text-gray-600';
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

  const handleAssignTask = (taskId, officerId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, assignedTo: officerId } : task
    ));
  };

  const handleAutoAssign = () => {
    // Simple auto-assignment logic
    const unassignedTasks = tasks.filter(task => !task.assignedTo);
    const availableOfficers = officers.filter(officer => 
      officer.availability === 'Available' && officer.currentTasks < officer.maxTasks
    );

    unassignedTasks.forEach(task => {
      const suitableOfficer = availableOfficers.find(officer => 
        officer.specialization.some(spec => 
          spec === task.customerSegment || 
          (task.priority === 'High' && spec === 'High Risk')
        )
      );
      
      if (suitableOfficer) {
        handleAssignTask(task.id, suitableOfficer.id);
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Assignment Engine</h1>
              <p className="text-gray-600">Intelligent customer assignment to retention officers</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 View Analytics
              </Button>
              <Button variant="primary" size="sm" onClick={handleAutoAssign}>
                🤖 Auto Assign
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-blue-900">{tasks.length}</p>
                  </div>
                  <div className="text-3xl">📋</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Unassigned</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {tasks.filter(t => !t.assignedTo).length}
                    </p>
                  </div>
                  <div className="text-3xl">⏳</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Assigned</p>
                    <p className="text-2xl font-bold text-green-900">
                      {tasks.filter(t => t.assignedTo).length}
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
                    <p className="text-sm font-medium text-purple-600">Available Officers</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {officers.filter(o => o.availability === 'Available').length}
                    </p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Officers */}
            <Card>
              <Card.Header>
                <Card.Title>Available Officers</Card.Title>
                <Card.Description>Officer capacity and specialization</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {officers.map((officer) => (
                    <div key={officer.id} 
                         className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                           selectedOfficer?.id === officer.id 
                             ? 'bg-blue-50 border-blue-200' 
                             : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                         }`}
                         onClick={() => setSelectedOfficer(officer)}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{officer.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getAvailabilityColor(officer.availability)}`}>
                          {officer.availability}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                        <div>
                          <span className="text-gray-600">Tasks:</span>
                          <span className="font-medium ml-1">{officer.currentTasks}/{officer.maxTasks}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Performance:</span>
                          <span className="font-medium ml-1">{officer.performance}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Specialization:</p>
                        <div className="flex flex-wrap gap-1">
                          {officer.specialization.map((spec, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Tasks */}
            <Card className="lg:col-span-2">
              <Card.Header>
                <Card.Title>Customer Tasks</Card.Title>
                <Card.Description>Tasks requiring assignment</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{task.customer}</h3>
                            <span className="text-sm text-gray-600">({task.customerId})</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getSegmentColor(task.customerSegment)}`}>
                              {task.customerSegment}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <h4 className="text-sm font-medium text-gray-700">{task.taskType}</h4>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Due:</span> {task.dueDate}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {task.estimatedDuration}min
                            </div>
                            <div>
                              <span className="font-medium">Churn Score:</span> {task.churnScore}%
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          {task.assignedTo ? (
                            <div className="text-sm">
                              <span className="text-gray-600">Assigned to:</span>
                              <span className="font-medium text-green-600">
                                {officers.find(o => o.id === task.assignedTo)?.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col space-y-1">
                              <select 
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                                onChange={(e) => handleAssignTask(task.id, e.target.value)}
                                value=""
                              >
                                <option value="">Assign to...</option>
                                {officers.filter(o => o.availability === 'Available' && o.currentTasks < o.maxTasks).map(officer => (
                                  <option key={officer.id} value={officer.id}>
                                    {officer.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading assignment data...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAssignmentEngine;