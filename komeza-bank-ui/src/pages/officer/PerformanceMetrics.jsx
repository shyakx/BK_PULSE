import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const PerformanceMetrics = () => {
  const { isCollapsed } = useSidebar();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock metrics data
        const mockMetrics = {
          currentPeriod: {
            period: 'January 2024',
            calls: {
              total: 150,
              completed: 135,
              pending: 15,
              successRate: 90
            },
            retention: {
              totalCustomers: 200,
              retained: 180,
              churned: 20,
              retentionRate: 90
            },
            conversion: {
              totalContacts: 135,
              conversions: 95,
              conversionRate: 70.4
            },
            feedback: {
              totalFeedback: 120,
              positive: 95,
              neutral: 20,
              negative: 5,
              satisfactionScore: 8.5
            },
            goals: {
              callsTarget: 200,
              retentionTarget: 85,
              conversionTarget: 65,
              satisfactionTarget: 8.0,
              callsProgress: 75,
              retentionProgress: 105.9,
              conversionProgress: 108.3,
              satisfactionProgress: 106.3
            }
          },
          trends: {
            calls: [120, 135, 140, 150],
            retention: [85, 88, 90, 90],
            conversion: [65, 68, 70, 70.4],
            satisfaction: [8.0, 8.2, 8.3, 8.5]
          },
          achievements: [
            {
              id: 1,
              title: 'Top Performer',
              description: 'Highest retention rate in team',
              date: '2024-01-15',
              type: 'achievement',
              points: 100
            },
            {
              id: 2,
              title: 'Customer Champion',
              description: 'Exceeded satisfaction targets',
              date: '2024-01-10',
              type: 'achievement',
              points: 75
            },
            {
              id: 3,
              title: 'Conversion Master',
              description: 'Best conversion rate this month',
              date: '2024-01-05',
              type: 'achievement',
              points: 50
            }
          ],
          leaderboard: [
            { rank: 1, name: 'Grace Uwimana', score: 95, retention: 92, conversion: 75 },
            { rank: 2, name: 'John Nkurunziza', score: 90, retention: 90, conversion: 70.4 },
            { rank: 3, name: 'Peter Nkurunziza', score: 88, retention: 88, conversion: 68 },
            { rank: 4, name: 'Marie Mukamana', score: 85, retention: 85, conversion: 65 },
            { rank: 5, name: 'Paul Nkurunziza', score: 82, retention: 82, conversion: 62 }
          ]
        };
        
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Failed to load metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [selectedPeriod]);

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading performance metrics...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Performance Metrics</h1>
              <p className="text-gray-600">Your personal KPIs and performance tracking</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
              <Button variant="outline" size="sm">
                📊 Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Calls Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.currentPeriod.calls.completed}</p>
                    <p className="text-sm text-gray-500 mt-1">of {metrics.currentPeriod.calls.total} total</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">📞</div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className={getProgressColor(metrics.currentPeriod.goals.callsProgress)}>
                      {metrics.currentPeriod.goals.callsProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gray-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(metrics.currentPeriod.goals.callsProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Retention Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.currentPeriod.retention.retentionRate}%</p>
                    <p className="text-sm text-gray-500 mt-1">{metrics.currentPeriod.retention.retained} retained</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">🎯</div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Target</span>
                    <span className={getProgressColor(metrics.currentPeriod.goals.retentionProgress)}>
                      {metrics.currentPeriod.goals.retentionProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gray-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(metrics.currentPeriod.goals.retentionProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.currentPeriod.conversion.conversionRate}%</p>
                    <p className="text-sm text-gray-500 mt-1">{metrics.currentPeriod.conversion.conversions} conversions</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">💼</div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Target</span>
                    <span className={getProgressColor(metrics.currentPeriod.goals.conversionProgress)}>
                      {metrics.currentPeriod.goals.conversionProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gray-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(metrics.currentPeriod.goals.conversionProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" shadow="medium" hover>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Satisfaction Score</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.currentPeriod.feedback.satisfactionScore}/10</p>
                    <p className="text-sm text-gray-500 mt-1">{metrics.currentPeriod.feedback.positive} positive</p>
                  </div>
                  <div className="text-4xl opacity-60 text-gray-600">⭐</div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Target</span>
                    <span className={getProgressColor(metrics.currentPeriod.goals.satisfactionProgress)}>
                      {metrics.currentPeriod.goals.satisfactionProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(metrics.currentPeriod.goals.satisfactionProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Performance Trends</Card.Title>
              <Card.Description>Your performance over the last 4 periods</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Calls Completed</h4>
                  <div className="space-y-2">
                    {metrics.trends.calls.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period {index + 1}</span>
                        <span className="font-medium text-blue-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Retention Rate</h4>
                  <div className="space-y-2">
                    {metrics.trends.retention.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period {index + 1}</span>
                        <span className="font-medium text-green-600">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Conversion Rate</h4>
                  <div className="space-y-2">
                    {metrics.trends.conversion.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period {index + 1}</span>
                        <span className="font-medium text-purple-600">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Satisfaction Score</h4>
                  <div className="space-y-2">
                    {metrics.trends.satisfaction.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Period {index + 1}</span>
                        <span className="font-medium text-orange-600">{value}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Achievements */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Achievements</Card.Title>
              <Card.Description>Your latest accomplishments and badges</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">🏆</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{achievement.date}</span>
                          <span className="text-sm font-medium text-yellow-600">+{achievement.points} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Team Leaderboard */}
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Team Leaderboard</Card.Title>
              <Card.Description>Your ranking among team members</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {metrics.leaderboard.map((member) => (
                  <div key={member.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                        {member.rank}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Retention: {member.retention}%</span>
                          <span>Conversion: {member.conversion}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{member.score}</div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Goals and Targets */}
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Goals & Targets</Card.Title>
              <Card.Description>Your performance targets and progress</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Monthly Targets</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Calls Target</span>
                      <span className="text-sm font-medium text-gray-900">
                        {metrics.currentPeriod.goals.callsTarget} calls
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Retention Target</span>
                      <span className="text-sm font-medium text-gray-900">
                        {metrics.currentPeriod.goals.retentionTarget}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Conversion Target</span>
                      <span className="text-sm font-medium text-gray-900">
                        {metrics.currentPeriod.goals.conversionTarget}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Satisfaction Target</span>
                      <span className="text-sm font-medium text-gray-900">
                        {metrics.currentPeriod.goals.satisfactionTarget}/10
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Performance Summary</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Score</span>
                      <span className={`text-sm font-medium ${getScoreColor(90)}`}>90/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Team Rank</span>
                      <span className="text-sm font-medium text-gray-900">#2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Targets Met</span>
                      <span className="text-sm font-medium text-green-600">3/4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bonus Eligible</span>
                      <span className="text-sm font-medium text-green-600">Yes</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading performance metrics...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
