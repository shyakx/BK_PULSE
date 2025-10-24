import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const Settings = () => {
  const { isCollapsed } = useSidebar();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock settings data
        const mockSettings = {
          general: {
            systemName: 'BK Retention Intelligence',
            version: '2.1.0',
            environment: 'Production',
            timezone: 'Africa/Kigali',
            language: 'English',
            dateFormat: 'DD/MM/YYYY'
          },
          notifications: {
            emailAlerts: true,
            smsAlerts: false,
            systemAlerts: true,
            modelAlerts: true,
            userAlerts: true,
            alertFrequency: 'Real-time',
            alertRecipients: ['admin@bk.rw', 'manager@bk.rw']
          },
          security: {
            sessionTimeout: 30,
            passwordPolicy: 'Strong',
            twoFactorAuth: true,
            ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
            auditLogging: true,
            dataEncryption: true
          },
          integrations: {
            powerBI: {
              enabled: true,
              url: 'https://app.powerbi.com/workspaces/retention',
              apiKey: '***hidden***',
              refreshInterval: 60
            },
            database: {
              type: 'PostgreSQL',
              host: 'db.bk.rw',
              port: 5432,
              ssl: true,
              connectionPool: 20
            },
            apis: {
              cbsApi: {
                enabled: true,
                url: 'https://api.cbs.bk.rw/v1',
                timeout: 30
              },
              telephonyApi: {
                enabled: false,
                url: '',
                timeout: 30
              }
            }
          },
          model: {
            retrainingSchedule: 'Monthly',
            accuracyThreshold: 85,
            driftThreshold: 0.1,
            featureStore: 'Enabled',
            modelVersioning: 'Enabled',
            aBTesting: 'Enabled'
          }
        };
        
        setSettings(mockSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = (category) => {
    // Simulate saving settings
    console.log(`Saving ${category} settings...`);
    // In real implementation, this would make an API call
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'model', name: 'Model', icon: '🤖' }
  ];

  if (!settings) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading settings...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">Configure system settings and integrations</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                🔄 Reset to Default
              </Button>
              <Button variant="primary" size="sm">
                💾 Save All Changes
              </Button>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <Card>
              <Card.Header>
                <Card.Title>General Settings</Card.Title>
                <Card.Description>Basic system configuration</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input
                      label="System Name"
                      value={settings.general.systemName}
                      onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, systemName: e.target.value } }))}
                    />
                    <Input
                      label="Version"
                      value={settings.general.version}
                      disabled
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                      <select
                        value={settings.general.environment}
                        onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, environment: e.target.value } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="Production">Production</option>
                        <option value="Staging">Staging</option>
                        <option value="Development">Development</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, timezone: e.target.value } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="Africa/Kigali">Africa/Kigali</option>
                        <option value="UTC">UTC</option>
                        <option value="Africa/Nairobi">Africa/Nairobi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, language: e.target.value } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Kinyarwanda">Kinyarwanda</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                      <select
                        value={settings.general.dateFormat}
                        onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, dateFormat: e.target.value } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button variant="primary" onClick={() => handleSaveSettings('general')}>
                    Save General Settings
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <Card.Header>
                <Card.Title>Notification Settings</Card.Title>
                <Card.Description>Configure alert and notification preferences</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Alert Types</h4>
                    <div className="space-y-3">
                      {Object.entries(settings.notifications).filter(([key]) => key.includes('Alerts')).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setSettings(prev => ({ 
                                ...prev, 
                                notifications: { ...prev.notifications, [key]: e.target.checked } 
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alert Frequency</label>
                    <select
                      value={settings.notifications.alertFrequency}
                      onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, alertFrequency: e.target.value } }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Real-time">Real-time</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alert Recipients</label>
                    <textarea
                      value={settings.notifications.alertRecipients.join('\n')}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, alertRecipients: e.target.value.split('\n') } 
                      }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Enter email addresses, one per line"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button variant="primary" onClick={() => handleSaveSettings('notifications')}>
                    Save Notification Settings
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <Card.Header>
                <Card.Title>Security Settings</Card.Title>
                <Card.Description>Configure security policies and access controls</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, sessionTimeout: parseInt(e.target.value) } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="5"
                        max="480"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password Policy</label>
                      <select
                        value={settings.security.passwordPolicy}
                        onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, passwordPolicy: e.target.value } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Strong">Strong</option>
                        <option value="Very Strong">Very Strong</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, twoFactorAuth: e.target.checked } }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Audit Logging</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.auditLogging}
                          onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, auditLogging: e.target.checked } }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Data Encryption</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.dataEncryption}
                          onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, dataEncryption: e.target.checked } }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Whitelist</label>
                    <textarea
                      value={settings.security.ipWhitelist.join('\n')}
                      onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, ipWhitelist: e.target.value.split('\n') } }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Enter IP addresses or CIDR blocks, one per line"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button variant="primary" onClick={() => handleSaveSettings('security')}>
                    Save Security Settings
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <Card>
              <Card.Header>
                <Card.Title>Integration Settings</Card.Title>
                <Card.Description>Configure external system integrations</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Power BI Integration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Enabled</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.integrations.powerBI.enabled}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              integrations: { 
                                ...prev.integrations, 
                                powerBI: { ...prev.integrations.powerBI, enabled: e.target.checked } 
                              } 
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <Input
                        label="Power BI URL"
                        value={settings.integrations.powerBI.url}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          integrations: { 
                            ...prev.integrations, 
                            powerBI: { ...prev.integrations.powerBI, url: e.target.value } 
                          } 
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Database Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Database Type"
                        value={settings.integrations.database.type}
                        disabled
                      />
                      <Input
                        label="Host"
                        value={settings.integrations.database.host}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          integrations: { 
                            ...prev.integrations, 
                            database: { ...prev.integrations.database, host: e.target.value } 
                          } 
                        }))}
                      />
                      <Input
                        label="Port"
                        value={settings.integrations.database.port}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          integrations: { 
                            ...prev.integrations, 
                            database: { ...prev.integrations.database, port: parseInt(e.target.value) } 
                          } 
                        }))}
                        type="number"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">SSL Enabled</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.integrations.database.ssl}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              integrations: { 
                                ...prev.integrations, 
                                database: { ...prev.integrations.database, ssl: e.target.checked } 
                              } 
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button variant="primary" onClick={() => handleSaveSettings('integrations')}>
                    Save Integration Settings
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Model Settings */}
          {activeTab === 'model' && (
            <Card>
              <Card.Header>
                <Card.Title>Model Settings</Card.Title>
                <Card.Description>Configure machine learning model parameters</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Retraining Schedule</label>
                      <select
                        value={settings.model.retrainingSchedule}
                        onChange={(e) => setSettings(prev => ({ ...prev, model: { ...prev.model, retrainingSchedule: e.target.value } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accuracy Threshold (%)</label>
                      <input
                        type="number"
                        value={settings.model.accuracyThreshold}
                        onChange={(e) => setSettings(prev => ({ ...prev, model: { ...prev.model, accuracyThreshold: parseInt(e.target.value) } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="70"
                        max="99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Drift Threshold</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.model.driftThreshold}
                        onChange={(e) => setSettings(prev => ({ ...prev, model: { ...prev.model, driftThreshold: parseFloat(e.target.value) } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="0.01"
                        max="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Feature Store</label>
                      <select
                        value={settings.model.featureStore}
                        onChange={(e) => setSettings(prev => ({ ...prev, model: { ...prev.model, featureStore: e.target.value } }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="Enabled">Enabled</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Model Versioning</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.model.modelVersioning === 'Enabled'}
                          onChange={(e) => setSettings(prev => ({ ...prev, model: { ...prev.model, modelVersioning: e.target.checked ? 'Enabled' : 'Disabled' } }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">A/B Testing</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.model.aBTesting === 'Enabled'}
                          onChange={(e) => setSettings(prev => ({ ...prev, model: { ...prev.model, aBTesting: e.target.checked ? 'Enabled' : 'Disabled' } }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button variant="primary" onClick={() => handleSaveSettings('model')}>
                    Save Model Settings
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading settings...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
