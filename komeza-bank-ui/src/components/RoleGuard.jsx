import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// Role-based access control component
const RoleGuard = ({ 
  children, 
  requiredRole, 
  requiredPermission, 
  requiredDataLevel,
  requirePIIAccess = false,
  requireExportAccess = false,
  fallback = null 
}) => {
  const { user, hasPermission, canAccessData, canAccessPII, canExportData } = useAuth();

  // Check if user is authenticated
  if (!user) {
    return fallback || <div className="text-center py-8 text-gray-500">Please log in to access this content.</div>;
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    return fallback || (
      <div className="text-center py-8">
        <div className="text-red-600 font-medium">Access Denied</div>
        <div className="text-gray-500 text-sm">You don't have the required role to access this content.</div>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="text-center py-8">
        <div className="text-red-600 font-medium">Permission Denied</div>
        <div className="text-gray-500 text-sm">You don't have the required permission: {requiredPermission}</div>
      </div>
    );
  }

  // Check data access level
  if (requiredDataLevel && !canAccessData(requiredDataLevel)) {
    return fallback || (
      <div className="text-center py-8">
        <div className="text-red-600 font-medium">Data Access Denied</div>
        <div className="text-gray-500 text-sm">You don't have access to {requiredDataLevel} level data.</div>
      </div>
    );
  }

  // Check PII access requirement
  if (requirePIIAccess && !canAccessPII()) {
    return fallback || (
      <div className="text-center py-8">
        <div className="text-red-600 font-medium">PII Access Denied</div>
        <div className="text-gray-500 text-sm">You don't have permission to access personally identifiable information.</div>
      </div>
    );
  }

  // Check export access requirement
  if (requireExportAccess && !canExportData()) {
    return fallback || (
      <div className="text-center py-8">
        <div className="text-red-600 font-medium">Export Access Denied</div>
        <div className="text-gray-500 text-sm">You don't have permission to export data.</div>
      </div>
    );
  }

  return children;
};

// Higher-order component for role-based access
export const withRoleGuard = (WrappedComponent, guardProps) => {
  return (props) => (
    <RoleGuard {...guardProps}>
      <WrappedComponent {...props} />
    </RoleGuard>
  );
};

// Hook for role-based conditional rendering
export const useRoleAccess = () => {
  const { user, hasPermission, canAccessData, canAccessPII, canExportData, getFeatures } = useAuth();

  return {
    user,
    hasPermission,
    canAccessData,
    canAccessPII,
    canExportData,
    getFeatures,
    isAdmin: user?.role === 'admin',
    isAgent: user?.role === 'agent',
    isSupervisor: user?.role === 'supervisor',
    isBranchManager: user?.role === 'branch',
    isAnalyst: user?.role === 'analyst',
    isExecutive: user?.role === 'exec'
  };
};

export { RoleGuard };
export default RoleGuard;
