// BK Pulse Environment Configuration
// Handles environment variables safely

const getEnvVar = (key, defaultValue) => {
  try {
    // Check if we're in a browser environment with Vite
    if (typeof window !== 'undefined' && window.import && window.import.meta && window.import.meta.env) {
      return window.import.meta.env[key] || defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return defaultValue;
  }
};

export const config = {
  // API Base URLs
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3001/api'),
  recommenderUrl: getEnvVar('VITE_RECOMMENDER_URL', 'http://localhost:3002/api'),
  crmUrl: getEnvVar('VITE_CRM_URL', 'http://localhost:3003/api'),
  telephonyUrl: getEnvVar('VITE_TELEPHONY_URL', 'http://localhost:3004/api'),
  modelApiUrl: getEnvVar('VITE_MODEL_API_URL', 'http://localhost:8000'),
  
  // Application Settings
  appName: getEnvVar('VITE_APP_NAME', 'BK Pulse'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  // Development Settings
  debugMode: getEnvVar('VITE_DEBUG_MODE', 'true') === 'true',
  mockData: getEnvVar('VITE_MOCK_DATA', 'true') === 'true'
};

export default config;
