import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const Leaderboard = () => {
  const { isCollapsed } = useSidebar();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('week');
  const [category, setCategory] = useState('overall');

  useEffect(() => {
    const loadLeaderboardData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock leaderboard data
        const mockLeaderboardData = {
          overall: [
            {
              rank: 1,
              name: 'Alice Mukamana',
              team: 'Retention Team A',
              score: 95,
              callsCompleted: 45,
              customersRetained: 38,
              productsSold: 12,
              satisfactionScore: 8.2,
              trend: '+5%',
              badge: '🏆 Champion',
              points: 2850
            },
            {
              rank: 2,
              name: 'Grace Uwimana',
              team: 'Retention Team B',
              score: 92,
              callsCompleted: 48,
              customersRetained: 40,
              productsSold: 8,
              satisfactionScore: 8.5,
              trend: '+7%',
              badge: '⭐ Star',
              points: 2720
            },
            {
              rank: 3,
              name: 'John Nkurunziza',
              team: 'Retention Team A',
              score: 89,
              callsCompleted: 42,
              customersRetained: 35,
              productsSold: 10,
              satisfactionScore: 8.0,
              trend: '+3%',
              badge: '🔥 Rising',
              points: 2580
            },
            {
              rank: 4,
              name: 'Sarah Uwimana',
              team: 'Retention Team C',
              score: 87,
              callsCompleted: 40,
              customersRetained: 33,
              productsSold: 9,
              satisfactionScore: 8.3,
              trend: '+4%',
              badge: '💪 Strong',
              points: 2450
            },
            {
              rank: 5,
              name: 'Peter Nkurunziza',
              team: 'Retention Team C',
              score: 85,
              callsCompleted: 38,
              customersRetained: 32,
              productsSold: 7,
              satisfactionScore: 8.1,
              trend: '+2%',
              badge: '📈 Growing',
              points: 2320
            }
          ],
          retention: [
            {
              rank: 1,
              name: 'Alice Mukamana',
              team: 'Retention Team A',
              score: 95,
              customersRetained: 38,
              retentionRate: 84.4,
              trend: '+5%',
              badge: '🏆 Retention Master',
              points: 2850
            },
            {
              rank: 2,
              name: 'Grace Uwimana',
              team: 'Retention Team B',
              score: 92,
              customersRetained: 40,
              retentionRate: 83.3,
              trend: '+7%',
              badge: '⭐ Retention Star',
              points: 2720
            }
          ],
          sales: [
            {
              rank: 1,
              name: 'Alice Mukamana',
              team: 'Retention Team A',
              score: 95,
              productsSold: 12,
              salesRate: 26.7,
              trend: '+5%',
              badge: '💰 Sales Champion',
              points: 2850
            },
            {
              rank: 2,
              name: 'John Nkurunziza',
              team: 'Retention Team A',
              score: 89,
              productsSold: 10,
              salesRate: 23.8,
              trend: '+3%',
              badge: '🔥 Sales Star',
              points: 2580
            }
          ],
          satisfaction: [
            {
              rank: 1,
              name: 'Grace Uwimana',
              team: 'Retention Team B',
              score: 92,
              satisfactionScore: 8.5,
              customerCount: 40,
              trend: '+7%',
              badge: '😊 Satisfaction Leader',
              points: 2720
            },
            {
              rank: 2,
              name: 'Sarah Uwimana',
              team: 'Retention Team C',
              score: 87,
              satisfactionScore: 8.3,
              customerCount: 33,
              trend: '+4%',
              badge: '⭐ Customer Favorite',
              points: 2450
            }
          ]
        };
        
        setLeaderboardData(mockLeaderboardData);
      } catch (error) {
        console.error('Failed to load leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboardData();
  }, [timeframe, category]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getTrendColor = (trend) => {
    return trend.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const currentData = leaderboardData?.[category] || [];

  if (!leaderboardData) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading leaderboard...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
              <p className="text-gray-600">Performance rankings and achievements</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="overall">Overall</option>
                <option value="retention">Retention</option>
                <option value="sales">Sales</option>
                <option value="satisfaction">Satisfaction</option>
              </select>
              <Button variant="outline" size="sm">
                🏆 View Awards
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'overall', label: 'Overall', icon: '🏆' },
              { key: 'retention', label: 'Retention', icon: '✅' },
              { key: 'sales', label: 'Sales', icon: '💰' },
              { key: 'satisfaction', label: 'Satisfaction', icon: '😊' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCategory(tab.key)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  category === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          {currentData.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              {currentData[1] && (
                <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
                  <Card.Content>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🥈</div>
                      <h3 className="font-bold text-gray-900">{currentData[1].name}</h3>
                      <p className="text-sm text-gray-600">{currentData[1].team}</p>
                      <div className="mt-2">
                        <span className={`text-2xl font-bold ${getScoreColor(currentData[1].score)}`}>
                          {currentData[1].score}
                        </span>
                        <span className="text-sm text-gray-600 ml-1">points</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{currentData[1].badge}</p>
                    </div>
                  </Card.Content>
                </Card>
              )}

              {/* 1st Place */}
              {currentData[0] && (
                <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                  <Card.Content>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🥇</div>
                      <h3 className="font-bold text-gray-900">{currentData[0].name}</h3>
                      <p className="text-sm text-gray-600">{currentData[0].team}</p>
                      <div className="mt-2">
                        <span className={`text-3xl font-bold ${getScoreColor(currentData[0].score)}`}>
                          {currentData[0].score}
                        </span>
                        <span className="text-sm text-gray-600 ml-1">points</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{currentData[0].badge}</p>
                    </div>
                  </Card.Content>
                </Card>
              )}

              {/* 3rd Place */}
              {currentData[2] && (
                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                  <Card.Content>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🥉</div>
                      <h3 className="font-bold text-gray-900">{currentData[2].name}</h3>
                      <p className="text-sm text-gray-600">{currentData[2].team}</p>
                      <div className="mt-2">
                        <span className={`text-2xl font-bold ${getScoreColor(currentData[2].score)}`}>
                          {currentData[2].score}
                        </span>
                        <span className="text-sm text-gray-600 ml-1">points</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{currentData[2].badge}</p>
                    </div>
                  </Card.Content>
                </Card>
              )}
            </div>
          )}

          {/* Full Leaderboard */}
          <Card>
            <Card.Header>
              <Card.Title>Complete Rankings</Card.Title>
              <Card.Description>Full leaderboard for {category} performance</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {currentData.map((officer, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-700">
                        {getRankIcon(officer.rank)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{officer.name}</h4>
                        <p className="text-sm text-gray-600">{officer.team}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Score</p>
                        <p className={`text-lg font-bold ${getScoreColor(officer.score)}`}>
                          {officer.score}
                        </p>
                      </div>
                      
                      {category === 'overall' && (
                        <>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Calls</p>
                            <p className="font-semibold">{officer.callsCompleted}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Retained</p>
                            <p className="font-semibold">{officer.customersRetained}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Sales</p>
                            <p className="font-semibold">{officer.productsSold}</p>
                          </div>
                        </>
                      )}
                      
                      {category === 'retention' && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Retention Rate</p>
                          <p className="font-semibold">{officer.retentionRate}%</p>
                        </div>
                      )}
                      
                      {category === 'sales' && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Sales Rate</p>
                          <p className="font-semibold">{officer.salesRate}%</p>
                        </div>
                      )}
                      
                      {category === 'satisfaction' && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Satisfaction</p>
                          <p className="font-semibold">{officer.satisfactionScore}</p>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Trend</p>
                        <p className={`font-semibold ${getTrendColor(officer.trend)}`}>
                          {officer.trend}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Points</p>
                        <p className="font-semibold">{officer.points}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Achievements */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Achievements</Card.Title>
              <Card.Description>Latest badges and accomplishments</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentData.slice(0, 6).map((officer, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{officer.badge.split(' ')[0]}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{officer.name}</h4>
                        <p className="text-sm text-gray-600">{officer.badge}</p>
                        <p className="text-xs text-gray-500">{officer.team}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading leaderboard...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;