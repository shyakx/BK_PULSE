export interface User {
  email: string;
  role: 'agent' | 'supervisor' | 'branch' | 'analyst' | 'exec' | 'admin';
  name: string;
  department: string;
  permissions: string[];
  dataAccess: Record<string, any>;
  features: Record<string, any>;
  loginTime: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean, role: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessData: (dataLevel: string) => boolean;
  canAccessPII: () => boolean;
  canExportData: () => boolean;
  getRoleConfig: () => any;
  getFeatures: () => Record<string, any>;
}
