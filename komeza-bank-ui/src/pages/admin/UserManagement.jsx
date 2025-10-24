import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar.jsx';
import { useSidebar } from '../../components/LayoutWrapper.jsx';

const UserManagement = () => {
  const { isCollapsed } = useSidebar();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'Active'
  });

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const mockUsers = [
          {
            id: 1,
            name: 'Alice Mukamana',
            email: 'alice.mukamana@bk.rw',
            role: 'officer',
            department: 'Retention',
            status: 'Active',
            lastLogin: '2024-01-22 14:30',
            permissions: ['customers', 'predictions', 'performance'],
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            name: 'John Nkurunziza',
            email: 'john.nkurunziza@bk.rw',
            role: 'analyst',
            department: 'Analytics',
            status: 'Active',
            lastLogin: '2024-01-22 12:15',
            permissions: ['segments', 'bulk_predictions', 'campaigns'],
            createdAt: '2024-01-10'
          },
          {
            id: 3,
            name: 'Grace Uwimana',
            email: 'grace.uwimana@bk.rw',
            role: 'manager',
            department: 'Management',
            status: 'Active',
            lastLogin: '2024-01-22 10:45',
            permissions: ['executive_dashboard', 'approvals', 'reports'],
            createdAt: '2024-01-05'
          },
          {
            id: 4,
            name: 'Peter Nkurunziza',
            email: 'peter.nkurunziza@bk.rw',
            role: 'officer',
            department: 'Retention',
            status: 'Inactive',
            lastLogin: '2024-01-20 16:20',
            permissions: ['customers', 'predictions'],
            createdAt: '2024-01-12'
          },
          {
            id: 5,
            name: 'Sarah Uwimana',
            email: 'sarah.uwimana@bk.rw',
            role: 'admin',
            department: 'IT',
            status: 'Active',
            lastLogin: '2024-01-22 15:10',
            permissions: ['admin_dashboard', 'user_management', 'model_management'],
            createdAt: '2024-01-01'
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-600';
      case 'manager': return 'bg-purple-100 text-purple-600';
      case 'analyst': return 'bg-blue-100 text-blue-600';
      case 'officer': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-600';
      case 'Inactive': return 'bg-gray-100 text-gray-600';
      case 'Suspended': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newId = users.length + 1;
    const user = {
      ...newUser,
      id: newId,
      lastLogin: 'Never',
      permissions: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setUsers(prev => [user, ...prev]);
    setNewUser({
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'Active'
    });
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage users, roles, and access permissions</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                📊 Export Users
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowAddUser(true)}>
                ➕ Add User
              </Button>
            </div>
          </div>

          {/* User Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Users</p>
                    <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Active Users</p>
                    <p className="text-2xl font-bold text-green-900">
                      {users.filter(u => u.status === 'Active').length}
                    </p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Retention Officers</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {users.filter(u => u.role === 'officer').length}
                    </p>
                  </div>
                  <div className="text-3xl">👤</div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Managers</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {users.filter(u => u.role === 'manager').length}
                    </p>
                  </div>
                  <div className="text-3xl">👔</div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <Card>
              <Card.Header>
                <Card.Title>Add New User</Card.Title>
                <Card.Description>Create a new user account with appropriate role and permissions</Card.Description>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select role...</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="analyst">Analyst</option>
                        <option value="officer">Officer</option>
                      </select>
                    </div>
                    <Input
                      label="Department"
                      value={newUser.department}
                      onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" variant="primary">
                      Create User
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <Card.Content>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search users by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="analyst">Analyst</option>
                    <option value="officer">Officer</option>
                  </select>
                  <Button variant="outline" size="sm">
                    🔍 Filter
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Users List */}
          <Card>
            <Card.Header>
              <Card.Title>Users ({filteredUsers.length})</Card.Title>
              <Card.Description>Manage user accounts and permissions</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{user.permissions.length} permissions</p>
                      </div>
                      
                      <div className="text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Last: {user.lastLogin}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleToggleStatus(user.id)}>
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteUser(user.id)}>
                          Delete
                        </Button>
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
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
