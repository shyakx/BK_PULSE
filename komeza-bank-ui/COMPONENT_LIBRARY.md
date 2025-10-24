# BK Pulse Component Library

## Overview
This document provides comprehensive documentation for the reusable component library used in the BK Pulse system. These components can be reused across different projects to maintain consistency and accelerate development.

## Table of Contents
1. [Button Component](#button-component)
2. [Card Component](#card-component)
3. [Input Component](#input-component)
4. [Sidebar Component](#sidebar-component)
5. [Layout Components](#layout-components)
6. [Form Components](#form-components)
7. [Data Display Components](#data-display-components)
8. [Navigation Components](#navigation-components)
9. [Feedback Components](#feedback-components)
10. [Utility Components](#utility-components)

## Button Component

### Usage
```jsx
import { Button } from '../components/Button';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Delete</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With states
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable button |
| `loading` | `boolean` | `false` | Show loading spinner |
| `className` | `string` | `''` | Additional CSS classes |
| `onClick` | `function` | - | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |

### Variants
```jsx
// Primary - Main action button
<Button variant="primary">Save Changes</Button>

// Secondary - Secondary action
<Button variant="secondary">Cancel</Button>

// Outline - Subtle action
<Button variant="outline">Edit</Button>

// Ghost - Minimal action
<Button variant="ghost">View Details</Button>

// Danger - Destructive action
<Button variant="danger">Delete</Button>
```

### Sizes
```jsx
// Small - Compact spaces
<Button size="sm">Small</Button>

// Medium - Default size
<Button size="md">Medium</Button>

// Large - Prominent actions
<Button size="lg">Large</Button>

// Extra Large - Hero actions
<Button size="xl">Extra Large</Button>
```

## Card Component

### Usage
```jsx
import { Card } from '../components/Card';

// Basic card
<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description</Card.Description>
  </Card.Header>
  <Card.Content>
    Card content goes here
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>

// Card with custom styling
<Card padding="lg" shadow="medium" hover>
  <Card.Title>Hoverable Card</Card.Title>
  <Card.Content>This card has hover effects</Card.Content>
</Card>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Internal padding |
| `shadow` | `'none' \| 'soft' \| 'medium' \| 'strong'` | `'soft'` | Shadow depth |
| `hover` | `boolean` | `false` | Enable hover effects |
| `className` | `string` | `''` | Additional CSS classes |

### Sub-components
```jsx
// Card.Header - Card header section
<Card.Header>
  <Card.Title>Title</Card.Title>
  <Card.Description>Description</Card.Description>
</Card.Header>

// Card.Content - Main content area
<Card.Content>
  Main content goes here
</Card.Content>

// Card.Footer - Card footer with actions
<Card.Footer>
  <Button>Save</Button>
  <Button variant="outline">Cancel</Button>
</Card.Footer>
```

## Input Component

### Usage
```jsx
import { Input } from '../components/Input';

// Basic input
<Input 
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Input with validation
<Input 
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  helperText="Use a strong password"
/>

// Input with icons
<Input 
  label="Search"
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `leftIcon` | `ReactNode` | - | Left icon |
| `rightIcon` | `ReactNode` | - | Right icon |
| `className` | `string` | `''` | Additional CSS classes |

### Validation States
```jsx
// Error state
<Input 
  label="Email"
  error="Invalid email address"
  value={email}
/>

// Helper text
<Input 
  label="Password"
  helperText="Must be at least 8 characters"
  type="password"
/>

// Success state (custom styling)
<Input 
  label="Username"
  className="border-green-500"
  value={username}
/>
```

## Sidebar Component

### Usage
```jsx
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../components/LayoutWrapper';

const PageComponent = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Page content */}
      </div>
    </div>
  );
};
```

### Features
- **Role-based Navigation**: Shows different menu items based on user role
- **Collapsible**: Can be collapsed to save space
- **Responsive**: Adapts to different screen sizes
- **Active State**: Highlights current page
- **User Profile**: Shows user information and logout option

### Navigation Structure
```javascript
// Role-based navigation items
const navigationItems = {
  hod: [
    { path: '/hod-dashboard', name: 'Department Dashboard', icon: '📊' },
    { path: '/branch-team-performance', name: 'Branch Performance', icon: '📈' }
  ],
  officer: [
    { path: '/officer-dashboard', name: 'Customer 360°', icon: '👤' },
    { path: '/call-queue', name: 'Call Queue', icon: '📞' }
  ]
};
```

## Layout Components

### LayoutWrapper
```jsx
import { SidebarProvider } from '../components/LayoutWrapper';

const App = () => {
  return (
    <SidebarProvider>
      <Router>
        {/* App content */}
      </Router>
    </SidebarProvider>
  );
};
```

### Page Layout Pattern
```jsx
const PageComponent = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Page header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
              <p className="text-gray-600">Page description</p>
            </div>
          </div>
          
          {/* Page content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Content cards */}
          </div>
        </div>
      </div>
    </div>
  );
};
```

## Form Components

### Form Layout
```jsx
const FormComponent = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          error={errors.firstName}
        />
        <Input 
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          error={errors.lastName}
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};
```

### Form Validation
```jsx
const validateForm = (data) => {
  const errors = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  return errors;
};
```

## Data Display Components

### Table Component
```jsx
const DataTable = ({ data, columns }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### KPI Cards
```jsx
const KPICard = ({ title, value, change, trend }) => {
  return (
    <Card>
      <Card.Content>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <span className="text-sm font-medium">{change}</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
```

## Navigation Components

### Breadcrumb
```jsx
const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <a href={item.href} className="text-sm font-medium text-gray-500 hover:text-gray-700">
              {item.name}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};
```

### Pagination
```jsx
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button 
          variant="outline" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {/* Pagination buttons */}
          </nav>
        </div>
      </div>
    </div>
  );
};
```

## Feedback Components

### Loading Spinner
```jsx
const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  return (
    <div className="flex items-center justify-center">
      <svg className={`animate-spin ${sizeClasses[size]} text-primary-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};
```

### Alert Component
```jsx
const Alert = ({ type, title, message, onClose }) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
  
  return (
    <div className={`rounded-md border p-4 ${typeClasses[type]}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {/* Icon based on type */}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button onClick={onClose} className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2">
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Utility Components

### Modal Component
```jsx
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
};
```

### Tooltip Component
```jsx
const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};
```

## Best Practices

### 1. **Component Composition**
```jsx
// Use compound components for complex UI
<Card>
  <Card.Header>
    <Card.Title>User Profile</Card.Title>
    <Card.Description>Manage user information</Card.Description>
  </Card.Header>
  <Card.Content>
    <form>
      <Input label="Name" />
      <Input label="Email" />
    </form>
  </Card.Content>
  <Card.Footer>
    <Button>Save</Button>
    <Button variant="outline">Cancel</Button>
  </Card.Footer>
</Card>
```

### 2. **Props Interface**
```jsx
// Define clear prop interfaces
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  // Component implementation
};
```

### 3. **Accessibility**
```jsx
// Include accessibility attributes
<Button 
  aria-label="Save changes"
  aria-describedby="save-help"
  disabled={isLoading}
>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

### 4. **Performance**
```jsx
// Use React.memo for expensive components
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
    </div>
  );
});
```

## Conclusion

This component library provides a solid foundation for building consistent, accessible, and maintainable user interfaces. The components are designed to be:

- **Reusable**: Can be used across different projects
- **Flexible**: Support various configurations and use cases
- **Accessible**: Follow accessibility best practices
- **Performant**: Optimized for speed and efficiency
- **Maintainable**: Easy to understand and modify

By following the patterns and practices outlined in this documentation, developers can create high-quality user interfaces that provide excellent user experiences while maintaining code consistency and quality.
