# BK Pulse Design System Documentation

## Overview
This document outlines the comprehensive design system used in the BK Pulse churn prediction and retention system. This design system can be reused for future banking and financial services applications.

## Table of Contents
1. [Design Principles](#design-principles)
2. [Component Architecture](#component-architecture)
3. [Layout System](#layout-system)
4. [Authentication & Authorization](#authentication--authorization)
5. [Navigation System](#navigation-system)
6. [Color System](#color-system)
7. [Typography](#typography)
8. [Spacing & Layout](#spacing--layout)
9. [Component Library](#component-library)
10. [Implementation Patterns](#implementation-patterns)
11. [Best Practices](#best-practices)

## Design Principles

### 1. **Role-Based Design**
- **Principle**: Interface adapts to user role and permissions
- **Implementation**: Dynamic navigation, conditional features, data access levels
- **Benefits**: Security, usability, reduced cognitive load

### 2. **Progressive Disclosure**
- **Principle**: Show relevant information at the right time
- **Implementation**: Collapsible sidebar, modal details, expandable cards
- **Benefits**: Clean interface, focused user experience

### 3. **Data-Driven Interface**
- **Principle**: Interface reflects real-time data and business metrics
- **Implementation**: Live dashboards, real-time updates, KPI tracking
- **Benefits**: Actionable insights, informed decision making

### 4. **Consistent Interaction Patterns**
- **Principle**: Similar actions behave consistently across the application
- **Implementation**: Standardized buttons, forms, modals, and navigation
- **Benefits**: Reduced learning curve, improved usability

## Component Architecture

### Core Components Structure
```
src/components/
├── Button.jsx           # Interactive elements
├── Card.jsx            # Content containers
├── Input.jsx           # Form controls
├── Sidebar.jsx         # Navigation
├── LayoutWrapper.jsx   # Layout management
├── RoleGuard.jsx       # Permission control
└── ExcelViewer.jsx     # Data visualization
```

### Component Design Patterns

#### 1. **Compound Component Pattern**
```jsx
// Card component with sub-components
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>
    Content here
  </Card.Content>
  <Card.Footer>
    Actions here
  </Card.Footer>
</Card>
```

#### 2. **Variant-Based Styling**
```jsx
// Button with multiple variants
<Button variant="primary" size="md">Primary</Button>
<Button variant="outline" size="sm">Secondary</Button>
<Button variant="danger" size="lg">Delete</Button>
```

#### 3. **Hook-Based State Management**
```jsx
// Sidebar state management
const { isCollapsed, toggleSidebar } = useSidebar();
```

## Layout System

### 1. **Responsive Sidebar Layout**
```jsx
<div className="min-h-screen bg-white">
  <Sidebar />
  <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
    {/* Page content */}
  </div>
</div>
```

### 2. **Grid System**
- **Container**: `max-w-7xl mx-auto`
- **Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **Spacing**: Consistent gap classes (`gap-4`, `gap-6`, `gap-8`)

### 3. **Card-Based Layout**
- **Primary Cards**: Main content areas
- **Summary Cards**: KPI displays
- **Detail Cards**: Expandable information
- **Modal Cards**: Overlay content

## Authentication & Authorization

### 1. **Role-Based Access Control (RBAC)**
```javascript
// Role definitions
const ROLES = {
  HOD: 'hod',
  SENIOR_MANAGER: 'senior_manager',
  DATA_ANALYST: 'data_analyst',
  OFFICER: 'officer'
};

// Permission checking
const hasPermission = (permission) => {
  return user?.permissions?.includes(permission);
};
```

### 2. **Context-Based Authentication**
```jsx
// AuthContext provides user state and permissions
const { user, hasPermission, login, logout } = useAuth();
```

### 3. **Route Protection**
```jsx
// Protected routes with role checking
<Route 
  path="/hod-dashboard" 
  element={
    isAuthenticated && user?.role === 'hod' 
      ? <HODDashboard /> 
      : <Navigate to="/login" replace />
  } 
/>
```

## Navigation System

### 1. **Role-Based Navigation**
```javascript
// Dynamic navigation based on user role
const getNavigationItems = (role) => {
  const items = {
    hod: [
      { path: '/hod-dashboard', name: 'Department Dashboard', icon: '📊' },
      { path: '/branch-team-performance', name: 'Branch Performance', icon: '📈' }
    ],
    officer: [
      { path: '/officer-dashboard', name: 'Customer 360°', icon: '👤' },
      { path: '/call-queue', name: 'Call Queue', icon: '📞' }
    ]
  };
  return items[role] || [];
};
```

### 2. **Collapsible Sidebar**
- **Expanded**: Full navigation with descriptions
- **Collapsed**: Icon-only navigation
- **Responsive**: Auto-collapse on mobile

### 3. **Breadcrumb Navigation**
- **Hierarchical**: Shows current page context
- **Interactive**: Clickable navigation path
- **Role-Aware**: Shows only accessible pages

## Color System

### 1. **Primary Colors**
```css
/* Primary brand colors */
--primary-50: #eff6ff;
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-900: #1e3a8a;
```

### 2. **Semantic Colors**
```css
/* Status colors */
--success-600: #059669;    /* Green for success */
--warning-600: #d97706;    /* Orange for warnings */
--danger-600: #dc2626;     /* Red for errors */
--info-600: #0891b2;       /* Blue for information */
```

### 3. **Neutral Colors**
```css
/* Grayscale system */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-600: #4b5563;
--gray-900: #111827;
```

## Typography

### 1. **Font Hierarchy**
```css
/* Headings */
.text-2xl { font-size: 1.5rem; font-weight: 700; }  /* Page titles */
.text-xl { font-size: 1.25rem; font-weight: 600; }   /* Section titles */
.text-lg { font-size: 1.125rem; font-weight: 600; }  /* Card titles */

/* Body text */
.text-base { font-size: 1rem; font-weight: 400; }    /* Regular text */
.text-sm { font-size: 0.875rem; font-weight: 400; }   /* Small text */
```

### 2. **Text Colors**
```css
.text-gray-900  /* Primary text */
.text-gray-600  /* Secondary text */
.text-gray-500  /* Muted text */
.text-primary-600 /* Brand text */
```

## Spacing & Layout

### 1. **Consistent Spacing Scale**
```css
/* Padding/Margin scale */
.p-4   /* 1rem - 16px */
.p-6   /* 1.5rem - 24px */
.p-8   /* 2rem - 32px */
.p-10  /* 2.5rem - 40px */
```

### 2. **Layout Patterns**
```jsx
// Standard page layout
<div className="p-6 space-y-6">
  {/* Header */}
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
      <p className="text-gray-600">Page description</p>
    </div>
  </div>
  
  {/* Content */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Cards */}
  </div>
</div>
```

## Component Library

### 1. **Button Component**
```jsx
// Variants
<Button variant="primary">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
```

### 2. **Card Component**
```jsx
// Basic card
<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description</Card.Description>
  </Card.Header>
  <Card.Content>
    Card content
  </Card.Content>
  <Card.Footer>
    Card actions
  </Card.Footer>
</Card>

// Card variants
<Card padding="lg" shadow="medium" hover>
  Hoverable card
</Card>
```

### 3. **Input Component**
```jsx
// Basic input
<Input 
  label="Email"
  placeholder="Enter email"
  error="Invalid email"
  helperText="We'll never share your email"
/>

// Input with icons
<Input 
  leftIcon={<UserIcon />}
  rightIcon={<EyeIcon />}
/>
```

## Implementation Patterns

### 1. **Page Structure Pattern**
```jsx
const PageComponent = () => {
  const { user, hasPermission } = useAuth();
  const { isCollapsed } = useSidebar();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Permission check
  if (!hasPermission('required_permission')) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <Card className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to view this data.</p>
            </Card>
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
          {/* Page content */}
        </div>
      </div>
    </div>
  );
};
```

### 2. **Data Loading Pattern**
```jsx
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);

const loadData = async () => {
  setLoading(true);
  try {
    const result = await api.getData();
    setData(result);
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadData();
}, []);
```

### 3. **Modal Pattern**
```jsx
const [showModal, setShowModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

const handleOpenModal = (item) => {
  setSelectedItem(item);
  setShowModal(true);
};

const handleCloseModal = () => {
  setSelectedItem(null);
  setShowModal(false);
};

// Modal JSX
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Modal content */}
    </Card>
  </div>
)}
```

## Best Practices

### 1. **Component Design**
- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Use compound components for complex UI
- **Props Interface**: Clear, typed prop interfaces
- **Default Values**: Sensible defaults for all props

### 2. **State Management**
- **Local State**: Use useState for component-specific state
- **Global State**: Use Context for app-wide state
- **Derived State**: Compute values from existing state
- **State Updates**: Use functional updates for complex state

### 3. **Performance**
- **Lazy Loading**: Load components and data on demand
- **Memoization**: Use React.memo for expensive components
- **Virtual Scrolling**: For large lists
- **Debouncing**: For search and input handlers

### 4. **Accessibility**
- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: Provide screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: Meet WCAG guidelines

### 5. **Testing**
- **Unit Tests**: Test individual components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows
- **Visual Tests**: Test UI consistency

## Reusability Guidelines

### 1. **Component Reuse**
- **Generic Components**: Create reusable UI components
- **Business Components**: Create domain-specific components
- **Layout Components**: Create reusable layout patterns
- **Utility Components**: Create helper components

### 2. **Pattern Reuse**
- **Page Patterns**: Standardize page structures
- **Form Patterns**: Standardize form handling
- **Data Patterns**: Standardize data loading
- **Navigation Patterns**: Standardize navigation flows

### 3. **Code Organization**
- **Feature-Based**: Organize by business features
- **Component-Based**: Organize by UI components
- **Utility-Based**: Organize by shared utilities
- **Service-Based**: Organize by external services

## Future Enhancements

### 1. **Design System Evolution**
- **Theme Support**: Multiple color themes
- **Dark Mode**: Dark/light mode toggle
- **Customization**: User-customizable interface
- **Accessibility**: Enhanced accessibility features

### 2. **Component Library Expansion**
- **Data Visualization**: Charts and graphs
- **Form Components**: Advanced form controls
- **Layout Components**: Complex layout patterns
- **Animation Components**: Smooth transitions

### 3. **Performance Optimizations**
- **Code Splitting**: Lazy load components
- **Bundle Optimization**: Reduce bundle size
- **Caching**: Implement smart caching
- **CDN Integration**: Optimize asset delivery

---

## Conclusion

This design system provides a solid foundation for building scalable, maintainable, and user-friendly applications. The patterns and components documented here can be reused across different projects while maintaining consistency and quality.

The system emphasizes:
- **User Experience**: Role-based, intuitive interfaces
- **Developer Experience**: Clear patterns and reusable components
- **Maintainability**: Well-organized, documented code
- **Scalability**: Flexible architecture for growth
- **Accessibility**: Inclusive design principles

This documentation serves as a living guide that should be updated as the system evolves and new patterns emerge.
