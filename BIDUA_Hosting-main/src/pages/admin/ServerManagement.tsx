import { useState, useEffect } from 'react';
import { Server, Search, Filter, RefreshCw, Power, Eye } from 'lucide-react';
import api from '../../lib/api';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

interface ServerData {
  id: number;
  user_id: number;
  server_name: string;
  hostname: string;
  ip_address: string | null;
  server_status: string;
  server_type: string;
  plan_name: string;
  monthly_cost: number;
  vcpu: number;
  ram_gb: number;
  storage_gb: number;
  bandwidth_gb: number;
  operating_system: string;
  created_at: string;
  expiry_date: string;
  user?: {
    email: string;
    full_name: string;
  };
}

export function ServerManagement() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await api.request('/api/v1/admin/servers?limit=1000', { method: 'GET' });
      setServers(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching servers:', error);
      setServers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleServerAction = async (serverId: number, action: string) => {
    try {
      setActionLoading(serverId);
      await api.request(`/api/v1/servers/${serverId}/action`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
      await fetchServers();
      alert(`Server ${action} successful`);
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert(`Failed to ${action} server`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      running: 'bg-green-100 text-green-800',
      stopped: 'bg-red-100 text-red-800',
      provisioning: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-orange-100 text-orange-800',
      terminated: 'bg-slate-900 text-slate-200',
    };
    return styles[status] || 'bg-slate-900 text-slate-200';
  };

  const filteredServers = servers.filter(server => {
    const matchesSearch =
      server.server_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (server.ip_address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (server.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || server.server_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
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
        title="Server Management"
        description="Oversee provisioning, lifecycle events, and uptime for every deployed instance."
        actions={
          <button
            onClick={fetchServers}
            className="flex items-center gap-2 px-4 py-2 bg-slate-950/60 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, hostname, IP, or user email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-slate-500 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="running">Running</option>
              <option value="stopped">Stopped</option>
              <option value="provisioning">Provisioning</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Total Servers</p>
          <p className="text-2xl font-bold text-white">{servers.length}</p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {servers.filter(s => s.server_status === 'active' || s.server_status === 'running').length}
          </p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Provisioning</p>
          <p className="text-2xl font-bold text-yellow-600">
            {servers.filter(s => s.server_status === 'provisioning').length}
          </p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-lg shadow-md border border-slate-900">
          <p className="text-sm text-slate-400">Monthly Revenue</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(servers.reduce((sum, s) => sum + (s.monthly_cost || 0), 0))}
          </p>
        </div>
      </div>

      {/* Servers Table */}
      <div className="bg-slate-950/60 rounded-lg shadow-md border border-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Server
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Specs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-950/60 divide-y divide-gray-200">
              {filteredServers.map((server) => (
                <tr key={server.id} className="hover:bg-slate-950/70">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Server className="w-5 h-5 text-slate-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-white">{server.server_name}</div>
                        <div className="text-sm text-slate-500">{server.hostname}</div>
                        <div className="text-xs text-slate-500">{server.ip_address || 'No IP'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{server.user?.full_name || 'N/A'}</div>
                    <div className="text-sm text-slate-500">{server.user?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{server.plan_name}</div>
                    <div className="text-xs text-slate-500">
                      {server.vcpu} vCPU | {server.ram_gb}GB RAM | {server.storage_gb}GB SSD
                    </div>
                    <div className="text-xs text-slate-500">{server.operating_system}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(server.server_status)}`}>
                      {server.server_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {formatCurrency(server.monthly_cost)}
                    </div>
                    <div className="text-xs text-slate-500">per month</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{formatDate(server.created_at)}</div>
                    <div className="text-xs text-slate-500">Expires: {formatDate(server.expiry_date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedServer(server);
                          setShowDetails(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {server.server_status === 'active' && (
                        <button
                          onClick={() => handleServerAction(server.id, 'stop')}
                          disabled={actionLoading === server.id}
                          className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                          title="Stop Server"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}
                      {server.server_status === 'stopped' && (
                        <button
                          onClick={() => handleServerAction(server.id, 'start')}
                          disabled={actionLoading === server.id}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Start Server"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleServerAction(server.id, 'restart')}
                        disabled={actionLoading === server.id}
                        className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                        title="Restart Server"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredServers.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No servers found</p>
          </div>
        )}
      </div>

      {/* Server Details Modal */}
      {showDetails && selectedServer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950/60 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Server Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-slate-500 hover:text-slate-400"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Server Name</p>
                    <p className="font-medium">{selectedServer.server_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedServer.server_status)}`}>
                      {selectedServer.server_status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Hostname</p>
                    <p className="font-medium">{selectedServer.hostname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">IP Address</p>
                    <p className="font-medium">{selectedServer.ip_address || 'Not Assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Plan</p>
                    <p className="font-medium">{selectedServer.plan_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Monthly Cost</p>
                    <p className="font-medium">{formatCurrency(selectedServer.monthly_cost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">vCPU</p>
                    <p className="font-medium">{selectedServer.vcpu} cores</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">RAM</p>
                    <p className="font-medium">{selectedServer.ram_gb} GB</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Storage</p>
                    <p className="font-medium">{selectedServer.storage_gb} GB SSD</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Bandwidth</p>
                    <p className="font-medium">{selectedServer.bandwidth_gb} GB</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Operating System</p>
                    <p className="font-medium">{selectedServer.operating_system}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Server Type</p>
                    <p className="font-medium">{selectedServer.server_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Created</p>
                    <p className="font-medium">{formatDate(selectedServer.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Expires</p>
                    <p className="font-medium">{formatDate(selectedServer.expiry_date)}</p>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-slate-400 mb-2">User Information</p>
                  <p className="font-medium">{selectedServer.user?.full_name || 'N/A'}</p>
                  <p className="text-sm text-slate-500">{selectedServer.user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-slate-800 rounded-lg hover:bg-slate-950/70"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
