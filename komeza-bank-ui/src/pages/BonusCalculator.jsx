import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const BonusCalculator = () => {
  const { isCollapsed } = useSidebar();
  const [bonusData, setBonusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    const loadBonusData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock bonus data
        const mockBonusData = {
          officers: [
            {
              id: 'O001',
              name: 'Alice Mukamana',
              team: 'Retention Team A',
              baseSalary: 450000,
              callsCompleted: 45,
              customersRetained: 38,
              productsSold: 12,
              satisfactionScore: 8.2,
              attendanceRate: 98,
              bonusEligible: true
            },
            {
              id: 'O002',
              name: 'John Nkurunziza',
              team: 'Retention Team A',
              baseSalary: 420000,
              callsCompleted: 42,
              customersRetained: 35,
              productsSold: 10,
              satisfactionScore: 8.0,
              attendanceRate: 95,
              bonusEligible: true
            },
            {
              id: 'O003',
              name: 'Grace Uwimana',
              team: 'Retention Team B',
              baseSalary: 430000,
              callsCompleted: 48,
              customersRetained: 40,
              productsSold: 8,
              satisfactionScore: 8.5,
              attendanceRate: 100,
              bonusEligible: true
            }
          ],
          bonusRules: {
            callsCompleted: {
              base: 30,
              bonusPerCall: 2000,
              maxBonus: 50000
            },
            customersRetained: {
              base: 25,
              bonusPerRetention: 5000,
              maxBonus: 100000
            },
            productsSold: {
              base: 5,
              bonusPerSale: 15000,
              maxBonus: 75000
            },
            satisfactionScore: {
              base: 7.0,
              bonusPerPoint: 10000,
              maxBonus: 20000
            },
            attendanceRate: {
              base: 95,
              bonusPerPoint: 2000,
              maxBonus: 10000
            }
          }
        };
        
        setBonusData(mockBonusData);
      } catch (error) {
        console.error('Failed to load bonus data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBonusData();
  }, [timeframe]);

  const calculateBonus = (officer) => {
    if (!bonusData || !officer.bonusEligible) return 0;
    
    const rules = bonusData.bonusRules;
    let totalBonus = 0;
    
    // Calls completed bonus
    if (officer.callsCompleted > rules.callsCompleted.base) {
      const extraCalls = officer.callsCompleted - rules.callsCompleted.base;
      const callsBonus = Math.min(extraCalls * rules.callsCompleted.bonusPerCall, rules.callsCompleted.maxBonus);
      totalBonus += callsBonus;
    }
    
    // Customers retained bonus
    if (officer.customersRetained > rules.customersRetained.base) {
      const extraRetentions = officer.customersRetained - rules.customersRetained.base;
      const retentionBonus = Math.min(extraRetentions * rules.customersRetained.bonusPerRetention, rules.customersRetained.maxBonus);
      totalBonus += retentionBonus;
    }
    
    // Products sold bonus
    if (officer.productsSold > rules.productsSold.base) {
      const extraSales = officer.productsSold - rules.productsSold.base;
      const salesBonus = Math.min(extraSales * rules.productsSold.bonusPerSale, rules.productsSold.maxBonus);
      totalBonus += salesBonus;
    }
    
    // Satisfaction score bonus
    if (officer.satisfactionScore > rules.satisfactionScore.base) {
      const extraPoints = officer.satisfactionScore - rules.satisfactionScore.base;
      const satisfactionBonus = Math.min(extraPoints * rules.satisfactionScore.bonusPerPoint, rules.satisfactionScore.maxBonus);
      totalBonus += satisfactionBonus;
    }
    
    // Attendance bonus
    if (officer.attendanceRate > rules.attendanceRate.base) {
      const extraPoints = officer.attendanceRate - rules.attendanceRate.base;
      const attendanceBonus = Math.min(extraPoints * rules.attendanceRate.bonusPerPoint, rules.attendanceRate.maxBonus);
      totalBonus += attendanceBonus;
    }
    
    return Math.round(totalBonus);
  };

  const getPerformanceColor = (value, base, type) => {
    if (value > base) return 'text-green-600';
    if (value === base) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!bonusData) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading bonus data...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Bonus Calculator</h1>
              <p className="text-gray-600">Performance-based incentive calculations</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Button variant="outline" size="sm">
                📊 Export Report
              </Button>
            </div>
          </div>

          {/* Bonus Rules */}
          <Card>
            <Card.Header>
              <Card.Title>Bonus Rules</Card.Title>
              <Card.Description>Current incentive structure and targets</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(bonusData.bonusRules).map(([key, rule]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 capitalize mb-2">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Base Target:</span> {rule.base}</p>
                      <p><span className="text-gray-600">Bonus per Unit:</span> {rule.bonusPerCall || rule.bonusPerRetention || rule.bonusPerSale || rule.bonusPerPoint} RWF</p>
                      <p><span className="text-gray-600">Max Bonus:</span> {rule.maxBonus.toLocaleString()} RWF</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Officers Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Officer Performance</h2>
              {bonusData.officers.map((officer) => {
                const bonus = calculateBonus(officer);
                return (
                  <Card key={officer.id} className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedOfficer(officer)}>
                    <Card.Content>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{officer.name}</h3>
                          <p className="text-sm text-gray-600">{officer.team}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{bonus.toLocaleString()} RWF</p>
                          <p className="text-xs text-gray-500">Bonus</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Calls: <span className={`font-medium ${getPerformanceColor(officer.callsCompleted, bonusData.bonusRules.callsCompleted.base, 'calls')}`}>{officer.callsCompleted}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-600">Retained: <span className={`font-medium ${getPerformanceColor(officer.customersRetained, bonusData.bonusRules.customersRetained.base, 'retained')}`}>{officer.customersRetained}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-600">Sales: <span className={`font-medium ${getPerformanceColor(officer.productsSold, bonusData.bonusRules.productsSold.base, 'sales')}`}>{officer.productsSold}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-600">Satisfaction: <span className={`font-medium ${getPerformanceColor(officer.satisfactionScore, bonusData.bonusRules.satisfactionScore.base, 'satisfaction')}`}>{officer.satisfactionScore}</span></p>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                );
              })}
            </div>

            {/* Detailed Calculation */}
            <div>
              {selectedOfficer ? (
                <Card>
                  <Card.Header>
                    <Card.Title>Bonus Breakdown</Card.Title>
                    <Card.Description>{selectedOfficer.name} - Detailed calculation</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Base Salary</h4>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedOfficer.baseSalary.toLocaleString()} RWF
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Total Bonus</h4>
                          <p className="text-lg font-semibold text-green-600">
                            {calculateBonus(selectedOfficer).toLocaleString()} RWF
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Calls Completed</span>
                            <span className="text-sm text-gray-600">{selectedOfficer.callsCompleted} calls</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Target: {bonusData.bonusRules.callsCompleted.base} | 
                            Bonus: {Math.min((selectedOfficer.callsCompleted - bonusData.bonusRules.callsCompleted.base) * bonusData.bonusRules.callsCompleted.bonusPerCall, bonusData.bonusRules.callsCompleted.maxBonus).toLocaleString()} RWF
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Customers Retained</span>
                            <span className="text-sm text-gray-600">{selectedOfficer.customersRetained} customers</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Target: {bonusData.bonusRules.customersRetained.base} | 
                            Bonus: {Math.min((selectedOfficer.customersRetained - bonusData.bonusRules.customersRetained.base) * bonusData.bonusRules.customersRetained.bonusPerRetention, bonusData.bonusRules.customersRetained.maxBonus).toLocaleString()} RWF
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Products Sold</span>
                            <span className="text-sm text-gray-600">{selectedOfficer.productsSold} products</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Target: {bonusData.bonusRules.productsSold.base} | 
                            Bonus: {Math.min((selectedOfficer.productsSold - bonusData.bonusRules.productsSold.base) * bonusData.bonusRules.productsSold.bonusPerSale, bonusData.bonusRules.productsSold.maxBonus).toLocaleString()} RWF
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Satisfaction Score</span>
                            <span className="text-sm text-gray-600">{selectedOfficer.satisfactionScore}/10</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Target: {bonusData.bonusRules.satisfactionScore.base} | 
                            Bonus: {Math.min((selectedOfficer.satisfactionScore - bonusData.bonusRules.satisfactionScore.base) * bonusData.bonusRules.satisfactionScore.bonusPerPoint, bonusData.bonusRules.satisfactionScore.maxBonus).toLocaleString()} RWF
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                            <span className="text-sm text-gray-600">{selectedOfficer.attendanceRate}%</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Target: {bonusData.bonusRules.attendanceRate.base}% | 
                            Bonus: {Math.min((selectedOfficer.attendanceRate - bonusData.bonusRules.attendanceRate.base) * bonusData.bonusRules.attendanceRate.bonusPerPoint, bonusData.bonusRules.attendanceRate.maxBonus).toLocaleString()} RWF
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total Compensation</span>
                          <span className="text-xl font-bold text-green-600">
                            {(selectedOfficer.baseSalary + calculateBonus(selectedOfficer)).toLocaleString()} RWF
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ) : (
                <Card>
                  <Card.Content>
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-2">💰</div>
                      <h3 className="text-sm font-medium text-gray-900">Select an Officer</h3>
                      <p className="text-sm text-gray-500">Click on an officer to view detailed bonus calculation</p>
                    </div>
                  </Card.Content>
                </Card>
              )}
            </div>
          </div>

          {/* Summary */}
          <Card>
            <Card.Header>
              <Card.Title>Bonus Summary</Card.Title>
              <Card.Description>Total bonus payments and team performance</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Total Bonuses</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {bonusData.officers.reduce((sum, officer) => sum + calculateBonus(officer), 0).toLocaleString()} RWF
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Average Bonus</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(bonusData.officers.reduce((sum, officer) => sum + calculateBonus(officer), 0) / bonusData.officers.length).toLocaleString()} RWF
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700">Eligible Officers</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {bonusData.officers.filter(officer => officer.bonusEligible).length}/{bonusData.officers.length}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading bonus data...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BonusCalculator;