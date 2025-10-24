# BK Pulse Technical Architecture Documentation

## Overview
This document outlines the technical architecture of the BK Pulse churn prediction and retention system, providing a blueprint for building similar enterprise applications.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Authentication System](#authentication-system)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Component Architecture](#component-architecture)
8. [Routing System](#routing-system)
9. [Performance Optimization](#performance-optimization)
10. [Security Implementation](#security-implementation)
11. [Deployment Strategy](#deployment-strategy)

## System Architecture

### 1. **Frontend Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    BK Pulse Frontend                        │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (React Components)                      │
│  ├── Pages (Feature-based)                                 │
│  ├── Components (Reusable UI)                              │
│  └── Layouts (Page Templates)                              │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                      │
│  ├── Context Providers (State Management)                  │
│  ├── Custom Hooks (Logic Reuse)                           │
│  └── Utilities (Helper Functions)                          │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                │
│  ├── API Services (HTTP Clients)                          │
│  ├── Local Storage (Client-side Persistence)              │
│  └── Mock Services (Development)                           │
├─────────────────────────────────────────────────────────────┤
│  Integration Layer                                         │
│  ├── Authentication (Auth0/Custom)                         │
│  ├── External APIs (CRM, Banking, Analytics)               │
│  └── Real-time Updates (WebSocket/SSE)                     │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Component Hierarchy**
```
App
├── AuthProvider (Authentication Context)
├── SidebarProvider (Layout Context)
└── Router
    ├── Public Routes (Login)
    └── Protected Routes
        ├── HOD Routes
        ├── Senior Manager Routes
        ├── Data Analyst Routes
        └── Officer Routes
```

## Technology Stack

### 1. **Frontend Technologies**
```json
{
  "framework": "React 18",
  "buildTool": "Vite",
  "styling": "Tailwind CSS",
  "routing": "React Router v6",
  "stateManagement": "React Context + Hooks",
  "httpClient": "Fetch API",
  "typeScript": "TypeScript (Partial)",
  "testing": "Jest + React Testing Library"
}
```

### 2. **Development Tools**
```json
{
  "packageManager": "npm",
  "bundler": "Vite",
  "linter": "ESLint",
  "formatter": "Prettier",
  "gitHooks": "Husky",
  "versionControl": "Git"
}
```

### 3. **External Integrations**
```json
{
  "authentication": "Custom JWT",
  "crm": "Salesforce API",
  "banking": "T24 Core Banking",
  "analytics": "Power BI",
  "communication": "Email/SMS APIs",
  "monitoring": "Application Insights"
}
```

## Project Structure

### 1. **Directory Organization**
```
src/
├── components/           # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Sidebar.jsx
│   └── LayoutWrapper.jsx
├── pages/               # Feature-based pages
│   ├── ChurnPrediction.jsx
│   ├── CampaignManagement.jsx
│   ├── SystemIntegration.jsx
│   └── ...
├── context/             # React Context providers
│   └── AuthContext.jsx
├── utils/               # Utility functions
│   ├── roles.js
│   └── helpers.js
├── services/            # API and external services
│   ├── api.ts
│   └── systemIntegration.js
├── config/              # Configuration files
│   └── environment.js
├── assets/              # Static assets
│   ├── images/
│   └── icons/
└── styles/              # Global styles
    └── index.css
```

### 2. **File Naming Conventions**
```
Components: PascalCase.jsx (Button.jsx, Card.jsx)
Pages: PascalCase.jsx (ChurnPrediction.jsx)
Utilities: camelCase.js (roles.js, helpers.js)
Services: camelCase.js/ts (api.ts, systemIntegration.js)
Config: camelCase.js (environment.js)
```

## Authentication System

### 1. **Authentication Flow**
```javascript
// Login Process
const login = async (email, password, role) => {
  // 1. Validate credentials
  const user = await validateCredentials(email, password);
  
  // 2. Get role configuration
  const roleConfig = getRoleConfig(role);
  
  // 3. Create user session
  const userSession = {
    email,
    role,
    permissions: roleConfig.permissions,
    dataAccess: roleConfig.dataAccess,
    features: getRoleFeatures(role),
    loginTime: new Date().toISOString()
  };
  
  // 4. Store in localStorage
  localStorage.setItem('bk_pulse_auth_user', JSON.stringify(userSession));
  
  // 5. Update context
  setUser(userSession);
};
```

### 2. **Role-Based Access Control**
```javascript
// Role Definitions
const ROLES = {
  HOD: 'hod',
  SENIOR_MANAGER: 'senior_manager',
  DATA_ANALYST: 'data_analyst',
  OFFICER: 'officer'
};

// Permission System
const ROLE_PERMISSIONS = {
  [ROLES.HOD]: {
    permissions: [
      'view_department_dashboard',
      'view_branch_performance',
      'manage_targets',
      'export_executive_data'
    ],
    dataAccess: {
      level: 'organization_level',
      piiAccess: true,
      exportAccess: true
    }
  }
};

// Permission Checking
const hasPermission = (permission) => {
  return user?.permissions?.includes(permission);
};
```

### 3. **Route Protection**
```javascript
// Protected Route Component
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, hasPermission } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDenied />;
  }
  
  return children;
};

// Usage
<Route 
  path="/hod-dashboard" 
  element={
    <ProtectedRoute requiredPermission="view_department_dashboard">
      <HODDashboard />
    </ProtectedRoute>
  } 
/>
```

## State Management

### 1. **Context-Based State Management**
```javascript
// AuthContext for user state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bk_pulse_auth_user');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      hasPermission: (permission) => user?.permissions?.includes(permission)
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. **Layout State Management**
```javascript
// SidebarContext for layout state
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <SidebarContext.Provider value={{
      isCollapsed,
      toggleSidebar
    }}>
      {children}
    </SidebarContext.Provider>
  );
};
```

### 3. **Component State Patterns**
```javascript
// Standard component state pattern
const PageComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await api.getData(filters);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [filters]);
  
  return (
    // Component JSX
  );
};
```

## API Integration

### 1. **API Service Layer**
```javascript
// api.ts - Centralized API service
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
  
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

export const api = new ApiService(process.env.VITE_API_URL);
```

### 2. **Mock API Implementation**
```javascript
// Mock API for development
const mockApi = {
  async get(endpoint) {
    await delay(1000); // Simulate network delay
    
    switch (endpoint) {
      case '/customers':
        return mockCustomers;
      case '/campaigns':
        return mockCampaigns;
      default:
        return [];
    }
  },
  
  async post(endpoint, data) {
    await delay(500);
    return { success: true, id: Date.now() };
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
```

### 3. **Environment Configuration**
```javascript
// environment.js - Environment-specific configuration
const getEnvVar = (key, defaultValue) => {
  try {
    if (typeof window !== 'undefined' && window.import?.meta?.env) {
      return window.import.meta.env[key] || defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return defaultValue;
  }
};

export const config = {
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3001/api'),
  crmUrl: getEnvVar('VITE_CRM_URL', 'http://localhost:3003/api'),
  telephonyUrl: getEnvVar('VITE_TELEPHONY_URL', 'http://localhost:3004/api'),
  debugMode: getEnvVar('VITE_DEBUG_MODE', 'true') === 'true',
  mockData: getEnvVar('VITE_MOCK_DATA', 'true') === 'true'
};
```

## Component Architecture

### 1. **Component Design Patterns**

#### Compound Components
```javascript
// Card component with sub-components
const Card = ({ children, className, ...props }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

// Attach sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;

export default Card;
```

#### Variant-Based Components
```javascript
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
```

### 2. **Custom Hooks**
```javascript
// useApi hook for data fetching
const useApi = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await api.get(endpoint);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, dependencies);
  
  return { data, loading, error };
};

// Usage
const { data: customers, loading, error } = useApi('/customers');
```

## Routing System

### 1. **Route Structure**
```javascript
// App.jsx - Main routing configuration
const App = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Router>
      <SidebarProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          } />
          
          {/* Role-based routes */}
          <Route path="/hod-dashboard" element={
            isAuthenticated && user?.role === 'hod' 
              ? <HODDashboard /> 
              : <Navigate to="/login" replace />
          } />
        </Routes>
      </SidebarProvider>
    </Router>
  );
};
```

### 2. **Dynamic Route Generation**
```javascript
// Generate routes based on user role
const generateRoutes = (userRole) => {
  const roleRoutes = {
    hod: [
      { path: '/hod-dashboard', component: HODDashboard },
      { path: '/branch-team-performance', component: BranchTeamPerformance }
    ],
    officer: [
      { path: '/officer-dashboard', component: OfficerDashboard },
      { path: '/call-queue', component: CallQueue }
    ]
  };
  
  return roleRoutes[userRole] || [];
};
```

## Performance Optimization

### 1. **Code Splitting**
```javascript
// Lazy load components
const ChurnPrediction = lazy(() => import('./pages/ChurnPrediction'));
const CampaignManagement = lazy(() => import('./pages/CampaignManagement'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ChurnPrediction />
</Suspense>
```

### 2. **Memoization**
```javascript
// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }));
  }, [data]);
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.processed}</div>
      ))}
    </div>
  );
});
```

### 3. **Virtual Scrolling**
```javascript
// For large lists
const VirtualizedList = ({ items, itemHeight = 50 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 400;
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItems, items.length);
  
  const visibleItemsList = items.slice(startIndex, endIndex);
  
  return (
    <div 
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItemsList.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Security Implementation

### 1. **Input Validation**
```javascript
// Client-side validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};
```

### 2. **XSS Prevention**
```javascript
// Sanitize user input
const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};
```

### 3. **CSRF Protection**
```javascript
// Include CSRF token in requests
const getCSRFToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
};

const apiRequest = async (url, options = {}) => {
  const token = getCSRFToken();
  return fetch(url, {
    ...options,
    headers: {
      'X-CSRF-Token': token,
      ...options.headers
    }
  });
};
```

## Deployment Strategy

### 1. **Build Configuration**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

### 2. **Environment Variables**
```bash
# .env.production
VITE_API_URL=https://api.bkpulse.com
VITE_CRM_URL=https://crm.bkpulse.com
VITE_DEBUG_MODE=false
VITE_MOCK_DATA=false
```

### 3. **Docker Configuration**
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. **CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: actions/deploy-to-azure@v1
        with:
          azure-subscription: ${{ secrets.AZURE_SUBSCRIPTION }}
          azure-resource-group: ${{ secrets.AZURE_RESOURCE_GROUP }}
```

## Monitoring and Analytics

### 1. **Error Tracking**
```javascript
// Error boundary for React components
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

### 2. **Performance Monitoring**
```javascript
// Performance monitoring
const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// Usage
const expensiveOperation = () => {
  return measurePerformance('Data Processing', () => {
    // Expensive operation
    return processLargeDataset(data);
  });
};
```

## Conclusion

This technical architecture provides a solid foundation for building scalable, maintainable, and secure enterprise applications. The patterns and practices documented here can be adapted and reused for similar projects while maintaining high standards of code quality and user experience.

Key architectural principles:
- **Modularity**: Clear separation of concerns
- **Scalability**: Architecture that grows with the application
- **Security**: Built-in security considerations
- **Performance**: Optimized for speed and efficiency
- **Maintainability**: Easy to understand and modify
- **Reusability**: Components and patterns that can be reused
