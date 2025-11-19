import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Building2, Search, RefreshCw } from 'lucide-react';
import api from '../../lib/api';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

interface Employee {
  id: number;
  email: string;
  full_name: string;
  role: string;
  account_status: string;
  department?: string;
  created_at: string;
}

interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
}

interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  department_id: number;
  is_active: boolean;
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'employees' | 'departments' | 'roles'>('employees');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Form data
  const [employeeForm, setEmployeeForm] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'support',
    department: 'technical',
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    code: '',
    description: '',
    department_id: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch employees (users with role != 'customer')
      const usersRes = await api.request('/api/v1/admin/users?limit=1000', { method: 'GET' });
      const allUsers = Array.isArray(usersRes) ? usersRes : [];
      const employeeUsers = allUsers.filter((u: Employee) =>
        u.role !== 'customer' && (u.role === 'admin' || u.role === 'super_admin' || u.role === 'support')
      );
      setEmployees(employeeUsers);

      // Fetch departments - use mock data if endpoint doesn't exist
      try {
        const deptRes = await api.request('/api/v1/admin/departments', { method: 'GET' });
        setDepartments(Array.isArray(deptRes) ? deptRes : []);
      } catch {
        // Default departments
        setDepartments([
          { id: 1, name: 'Technical Support', code: 'technical', description: 'Handle technical issues', is_active: true },
          { id: 2, name: 'Billing', code: 'billing', description: 'Handle billing and payments', is_active: true },
          { id: 3, name: 'Sales', code: 'sales', description: 'Handle sales inquiries', is_active: true },
          { id: 4, name: 'Marketing', code: 'marketing', description: 'Marketing operations', is_active: true },
          { id: 5, name: 'General', code: 'general', description: 'General inquiries', is_active: true },
        ]);
      }

      // Fetch roles - use mock data if endpoint doesn't exist
      try {
        const rolesRes = await api.request('/api/v1/admin/roles', { method: 'GET' });
        setRoles(Array.isArray(rolesRes) ? rolesRes : []);
      } catch {
        // Default roles
        setRoles([
          { id: 1, name: 'Support Agent', code: 'support', description: 'Handle support tickets', department_id: 1, is_active: true },
          { id: 2, name: 'Administrator', code: 'admin', description: 'Full admin access', department_id: 1, is_active: true },
          { id: 3, name: 'Billing Agent', code: 'billing_agent', description: 'Handle billing', department_id: 2, is_active: true },
          { id: 4, name: 'Sales Agent', code: 'sales_agent', description: 'Handle sales', department_id: 3, is_active: true },
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.request('/api/v1/admin/employees', {
        method: 'POST',
        body: JSON.stringify(employeeForm),
      });
      await fetchData();
      setShowEmployeeModal(false);
      setEmployeeForm({ email: '', full_name: '', password: '', role: 'support', department: 'technical' });
      alert('Employee created successfully');
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee. The endpoint may not exist yet.');
    }
  };

  const handleUpdateEmployeeRole = async (userId: number, newRole: string) => {
    try {
      await api.request(`/api/v1/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      await fetchData();
      alert('Role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    }
  };

  const handleDeleteEmployee = async (userId: number) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;
    try {
      await api.request(`/api/v1/admin/users/${userId}`, { method: 'DELETE' });
      await fetchData();
      alert('Employee removed successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to remove employee');
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.request('/api/v1/admin/departments', {
        method: 'POST',
        body: JSON.stringify(departmentForm),
      });
      await fetchData();
      setShowDepartmentModal(false);
      setDepartmentForm({ name: '', code: '', description: '', is_active: true });
      alert('Department created successfully');
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Failed to create department. The endpoint may not exist yet.');
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.request('/api/v1/admin/roles', {
        method: 'POST',
        body: JSON.stringify(roleForm),
      });
      await fetchData();
      setShowRoleModal(false);
      setRoleForm({ name: '', code: '', description: '', department_id: 0, is_active: true });
      alert('Role created successfully');
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Failed to create role. The endpoint may not exist yet.');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      support: 'bg-green-100 text-green-800',
    };
    return styles[role] || 'bg-slate-900 text-slate-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Employee & Department Management"
        description="Equip your internal team with the right access, departments, and responsibilities."
        actions={
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-950/60 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Total Employees</p>
          <p className="text-2xl font-bold text-white">{employees.length}</p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Departments</p>
          <p className="text-2xl font-bold text-blue-600">{departments.length}</p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Roles</p>
          <p className="text-2xl font-bold text-green-600">{roles.length}</p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Active</p>
          <p className="text-2xl font-bold text-purple-600">
            {employees.filter(e => e.account_status === 'active').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-950/60 rounded-lg shadow-md border border-slate-900">
        <div className="border-b border-slate-900">
          <div className="flex">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                activeTab === 'employees' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'
              }`}
            >
              <Users className="w-4 h-4" />
              Employees
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                activeTab === 'departments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Departments
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                activeTab === 'roles' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'
              }`}
            >
              <Shield className="w-4 h-4" />
              Roles
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-800 rounded-lg"
                  />
                </div>
                <button
                  onClick={() => setShowEmployeeModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Employee
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-slate-950/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-950/60 divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-slate-950/70">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{employee.full_name}</div>
                          <div className="text-sm text-slate-500">{employee.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(employee.role)}`}>
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.account_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.account_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {formatDate(employee.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <select
                              value={employee.role}
                              onChange={(e) => handleUpdateEmployeeRole(employee.id, e.target.value)}
                              className="text-sm border border-slate-800 rounded px-2 py-1"
                            >
                              <option value="support">Support</option>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No employees found</p>
                </div>
              )}
            </>
          )}

          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowDepartmentModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Department
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="bg-slate-950/70 p-4 rounded-lg border border-slate-900">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{dept.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        dept.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-900 text-slate-200'
                      }`}>
                        {dept.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{dept.code}</p>
                    <p className="text-sm text-slate-400">{dept.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Role
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="bg-slate-950/70 p-4 rounded-lg border border-slate-900">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{role.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        role.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-900 text-slate-200'
                      }`}>
                        {role.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">Code: {role.code}</p>
                    <p className="text-sm text-slate-400">{role.description}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      Department: {departments.find(d => d.id === role.department_id)?.name || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950/60 rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={employeeForm.full_name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                  <select
                    value={employeeForm.role}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                  >
                    <option value="support">Support Agent</option>
                    <option value="admin">Administrator</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={employeeForm.department}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.code}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEmployeeModal(false)}
                    className="px-4 py-2 border border-slate-800 rounded-lg hover:bg-slate-950/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950/60 rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Department</h2>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={departmentForm.name}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Code</label>
                  <input
                    type="text"
                    value={departmentForm.code}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    value={departmentForm.description}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDepartmentModal(false)}
                    className="px-4 py-2 border border-slate-800 rounded-lg hover:bg-slate-950/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950/60 rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Role</h2>
              <form onSubmit={handleCreateRole} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Code</label>
                  <input
                    type="text"
                    value={roleForm.code}
                    onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={roleForm.department_id}
                    onChange={(e) => setRoleForm({ ...roleForm, department_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                  >
                    <option value={0}>Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRoleModal(false)}
                    className="px-4 py-2 border border-slate-800 rounded-lg hover:bg-slate-950/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
