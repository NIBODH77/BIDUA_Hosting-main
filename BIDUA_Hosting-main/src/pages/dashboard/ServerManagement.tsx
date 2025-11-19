import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Server, Power, PowerOff, RefreshCw, Trash2, ArrowLeft,
  Terminal, Monitor, Activity, HardDrive, Network, Settings,
  Database, FileText, RotateCcw,
  Cpu, MemoryStick, Gauge, Clock, AlertCircle, CheckCircle,
  XCircle, Edit2, Save, X, Key, Shield, Globe, Camera,
  Copy, AlertTriangle,
  Maximize2, Zap
} from 'lucide-react';
import { api } from '../../lib/api';

interface ServerData {
  id: number;
  server_name: string;
  hostname: string;
  server_status: string;
  ip_address?: string;
  plan_name?: string;
  vcpu?: number;
  ram_gb?: number;
  storage_gb?: number;
  bandwidth_gb?: number;
  operating_system?: string;
  created_date?: string;
  expiry_date?: string;
  monthly_cost?: number | string;
  billing_cycle?: string;
  specs?: Record<string, unknown>;
  notes?: string;
}

export function ServerManagement() {
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  const [server, setServer] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'console' | 'monitoring' | 'backups' | 'networking' | 'settings'>('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  
  // Modal states for advanced features
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showReinstallModal, setShowReinstallModal] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [showIPModal, setShowIPModal] = useState(false);
  const [showFirewallModal, setShowFirewallModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showDestroyModal, setShowDestroyModal] = useState(false);
  
  // Form states
  const [selectedOS, setSelectedOS] = useState('');
  const [rootPassword, setRootPassword] = useState('');
  const [copiedIP, setCopiedIP] = useState(false);

  // Helpers
  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount || 0);

  const loadServerDetails = async () => {
    try {
      setLoading(true);
  const response = await api.get(`/api/v1/servers/${serverId}`) as ServerData;
  setServer(response);
  setNewServerName(response.server_name);
    } catch (error) {
      console.error('Failed to load server:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  const handleServerAction = async (action: 'start' | 'stop' | 'reboot') => {
    try {
      setActionLoading(true);
      // Map 'reboot' to backend 'restart'
      const backendAction = action === 'reboot' ? 'restart' : action;
      await api.performServerAction(serverId || '', backendAction as 'start'|'stop'|'restart');
      await loadServerDetails();
      // Show success notification
    } catch (error) {
      console.error(`Failed to ${action} server:`, error);
      // Show error notification
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveName = async () => {
    try {
      await api.put(`/api/v1/servers/${serverId}`, { server_name: newServerName });
      setIsEditingName(false);
      await loadServerDetails();
    } catch (error) {
      console.error('Failed to update server name:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'stopped':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'provisioning':
        return <Clock className="h-5 w-5 text-blue-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      stopped: 'bg-red-500/20 text-red-400 border-red-500/30',
      provisioning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status as keyof typeof colors] || 'bg-slate-800 text-slate-300 border-slate-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">Loading server details...</p>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Server className="h-16 w-16 text-slate-600" />
        <p className="text-slate-400">Server not found</p>
        <Link to="/dashboard/servers" className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          Back to Servers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full h-full overflow-y-auto pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 sm:px-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard/servers')}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-slate-400" />
          </button>
          <div>
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  className="bg-slate-800 text-white px-3 py-1 rounded border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button onClick={handleSaveName} className="p-1 hover:bg-green-500/20 rounded">
                  <Save className="h-4 w-4 text-green-400" />
                </button>
                <button onClick={() => setIsEditingName(false)} className="p-1 hover:bg-red-500/20 rounded">
                  <X className="h-4 w-4 text-red-400" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{server.server_name}</h2>
                <button onClick={() => setIsEditingName(true)} className="p-1 hover:bg-slate-800 rounded">
                  <Edit2 className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            )}
            <p className="text-sm text-slate-400">{server.hostname}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold border ${getStatusColor(server.server_status)}`}>
            {getStatusIcon(server.server_status)}
            <span className="capitalize">{server.server_status}</span>
          </span>
        </div>
      </div>

      {/* Quick Actions - Comprehensive VPS Controls */}
      <div className="space-y-4">
        {/* Primary Power Controls */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2 px-2 sm:px-0">Power Management</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 px-2 sm:px-0">
            {server.server_status === 'active' ? (
              <button
                onClick={() => handleServerAction('stop')}
                disabled={actionLoading}
                className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition font-semibold disabled:opacity-50 text-xs sm:text-sm"
              >
                <PowerOff className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={() => handleServerAction('start')}
                disabled={actionLoading}
                className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition font-semibold disabled:opacity-50 text-xs sm:text-sm"
              >
                <Power className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Start</span>
              </button>
            )}
            <button
              onClick={() => handleServerAction('reboot')}
              disabled={actionLoading}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition font-semibold disabled:opacity-50 text-xs sm:text-sm"
            >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Reboot</span>
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition font-semibold text-xs sm:text-sm"
            >
              <Key className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Password</span>
            </button>
            <button
              onClick={() => setShowReinstallModal(true)}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition font-semibold text-xs sm:text-sm"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Reinstall OS</span>
            </button>
            <button
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition font-semibold text-xs sm:text-sm"
            >
              <Terminal className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Console</span>
            </button>
          </div>
        </div>

        {/* Secondary Management Controls */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2 px-2 sm:px-0">Server Management</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 px-2 sm:px-0">
            <button
              onClick={() => setShowSnapshotModal(true)}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition font-semibold text-xs sm:text-sm"
            >
              <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Snapshot</span>
            </button>
            <button
              onClick={() => setShowBackupModal(true)}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/30 transition font-semibold text-xs sm:text-sm"
            >
              <Database className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Backup</span>
            </button>
            <button
              onClick={() => setShowResizeModal(true)}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-lg hover:bg-teal-500/30 transition font-semibold text-xs sm:text-sm"
            >
              <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Resize</span>
            </button>
            <button
              onClick={() => setShowFirewallModal(true)}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-lg hover:bg-pink-500/30 transition font-semibold text-xs sm:text-sm"
            >
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Firewall</span>
            </button>
            <button
              onClick={() => setShowIPModal(true)}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-lg hover:bg-violet-500/30 transition font-semibold text-xs sm:text-sm"
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>IP Config</span>
            </button>
            <button
              onClick={() => setShowDestroyModal(true)}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition font-semibold text-xs sm:text-sm"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Destroy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 overflow-hidden">
        <div className="border-b border-cyan-500/30 overflow-x-auto">
          <div className="flex w-full min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: Monitor },
              { id: 'console', label: 'Console', icon: Terminal },
              { id: 'monitoring', label: 'Monitoring', icon: Activity },
              { id: 'backups', label: 'Backups', icon: Database },
              { id: 'networking', label: 'Networking', icon: Network },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition whitespace-nowrap flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Server Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Server Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Cpu className="h-4 w-4 text-cyan-400" />
                      <p className="text-xs text-slate-400">vCPU Cores</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{server.vcpu || 0}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <MemoryStick className="h-4 w-4 text-cyan-400" />
                      <p className="text-xs text-slate-400">RAM</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{server.ram_gb || 0} GB</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <HardDrive className="h-4 w-4 text-cyan-400" />
                      <p className="text-xs text-slate-400">Storage</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{server.storage_gb || 0} GB</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gauge className="h-4 w-4 text-cyan-400" />
                      <p className="text-xs text-slate-400">Bandwidth</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{server.bandwidth_gb || 0} GB</p>
                  </div>
                </div>
              </div>

              {/* Server Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Server Information</h3>
                <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operating System:</span>
                    <span className="text-white font-semibold">{server.operating_system || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP Address:</span>
                    <span className="text-white font-mono">{server.ip_address || 'Pending Assignment'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plan:</span>
                    <span className="text-white font-semibold">{server.plan_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-cyan-500/30 pt-3">
                    <span className="text-slate-400">Created:</span>
                    <span className="text-white">{server.created_date ? new Date(server.created_date).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expires:</span>
                    <span className="text-white">{server.expiry_date ? new Date(server.expiry_date).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-t border-cyan-500/30 pt-3">
                    <span className="text-slate-400">Monthly Cost:</span>
                    <span className="text-cyan-400 font-bold text-lg">{formatINR(Number(server.monthly_cost || 0))}</span>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {server.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    <span>Notes</span>
                  </h3>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-slate-300 whitespace-pre-wrap">{server.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'console' && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-lg border border-cyan-500/30 p-6 text-center">
                <Terminal className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Web Console</h3>
                <p className="text-slate-400 mb-4">Access your server's console directly from the browser</p>
                <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold border-2 border-cyan-500">
                  Launch Console
                </button>
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-lg border border-cyan-500/30 p-6 text-center">
                <Activity className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Server Monitoring</h3>
                <p className="text-slate-400">Real-time server performance metrics and resource usage</p>
                <div className="mt-6 text-sm text-slate-500">
                  Coming Soon: CPU, RAM, Disk, and Network monitoring graphs
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-lg border border-cyan-500/30 p-6 text-center">
                <Database className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Server Backups</h3>
                <p className="text-slate-400 mb-4">Create and manage automated backups of your server</p>
                <div className="flex justify-center space-x-3">
                  <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold border-2 border-cyan-500">
                    Create Backup
                  </button>
                  <button className="px-6 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold border border-slate-600">
                    Backup History
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'networking' && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-lg border border-cyan-500/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Network className="h-5 w-5 text-cyan-400" />
                  <span>Network Configuration</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-cyan-500/20">
                    <span className="text-slate-400">Primary IP:</span>
                    <span className="text-white font-mono">{server.ip_address || 'Not Assigned'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-cyan-500/20">
                    <span className="text-slate-400">IPv6:</span>
                    <span className="text-white font-mono">Not Configured</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-cyan-500/20">
                    <span className="text-slate-400">Private Network:</span>
                    <span className="text-white">Disabled</span>
                  </div>
                  <button className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold border-2 border-cyan-500">
                    Configure Firewall
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-lg border border-cyan-500/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Server Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Server Name</label>
                    <input
                      type="text"
                      value={newServerName}
                      onChange={(e) => setNewServerName(e.target.value)}
                      className="w-full bg-slate-900 text-white px-4 py-2 rounded-lg border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <button
                    onClick={handleSaveName}
                    className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold border-2 border-cyan-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-red-500/10 rounded-lg border border-red-500/30 p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center space-x-2">
                  <Trash2 className="h-5 w-5" />
                  <span>Danger Zone</span>
                </h3>
                <p className="text-slate-400 mb-4">
                  Once you delete a server, there is no going back. Please be certain.
                </p>
                <button 
                  onClick={() => setShowDestroyModal(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                  Delete Server
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Change Root Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Key className="h-6 w-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Change Root Password</h3>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-slate-400 mb-4">Set a new root password for your server. Password must be at least 12 characters.</p>
            <input
              type="text"
              value={rootPassword}
              onChange={(e) => setRootPassword(e.target.value)}
              placeholder="Enter new root password"
              className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // API call to change password
                  setShowPasswordModal(false);
                }}
                className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold"
              >
                Change Password
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reinstall OS */}
      {showReinstallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Reinstall Operating System</h3>
              </div>
              <button onClick={() => setShowReinstallModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-semibold">Warning: Data Loss</p>
                  <p className="text-slate-400 text-sm">You can reinstall Operating System 2 more times. All data will be permanently deleted.</p>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-3">Select OS:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Ubuntu 22.04 LTS', logo: '🐧', value: 'ubuntu-22.04' },
                  { name: 'Ubuntu 24.04 LTS', logo: '🐧', value: 'ubuntu-24.04' },
                  { name: 'Debian 12', logo: '🌀', value: 'debian-12' },
                  { name: 'CentOS 9', logo: '💜', value: 'centos-9' },
                  { name: 'Rocky Linux 9', logo: '🪨', value: 'rocky-9' },
                  { name: 'AlmaLinux 9', logo: '🦌', value: 'alma-9' },
                ].map((os) => (
                  <button
                    key={os.value}
                    onClick={() => setSelectedOS(os.value)}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedOS === os.value
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-700 bg-slate-950 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{os.logo}</div>
                    <div className="text-white font-semibold text-sm">{os.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // API call to reinstall OS
                  setShowReinstallModal(false);
                }}
                disabled={!selectedOS}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reinstall OS
              </button>
              <button
                onClick={() => setShowReinstallModal(false)}
                className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Snapshot */}
      {showSnapshotModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Camera className="h-6 w-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Create Snapshot</h3>
              </div>
              <button onClick={() => setShowSnapshotModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-slate-400 mb-4">Create a point-in-time snapshot of your server. This will capture the current state including all data and configurations.</p>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4">
              <p className="text-cyan-400 text-sm">💡 Snapshots allow you to quickly restore your server to this exact state later.</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // API call to create snapshot
                  setShowSnapshotModal(false);
                }}
                className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold"
              >
                Create Snapshot
              </button>
              <button
                onClick={() => setShowSnapshotModal(false)}
                className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Resize Server */}
      {showResizeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Maximize2 className="h-6 w-6 text-teal-400" />
                <h3 className="text-xl font-bold text-white">Resize Server</h3>
              </div>
              <button onClick={() => setShowResizeModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-slate-400 mb-4">Upgrade or downgrade your server resources. Server will be powered off during the resize process.</p>
            <div className="space-y-3 mb-4">
              <div className="bg-slate-950 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-semibold">Current Plan: {server.plan_name}</h4>
                    <p className="text-slate-400 text-sm">{server.vcpu} vCPU • {server.ram_gb}GB RAM • {server.storage_gb}GB Storage</p>
                  </div>
                  <span className="text-cyan-400 font-semibold">{formatINR(Number(server.monthly_cost || 0))}/mo</span>
                </div>
              </div>
              <div className="text-center text-slate-400">
                <Zap className="h-5 w-5 inline" />
              </div>
              <div className="bg-teal-500/10 border-2 border-teal-500 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-semibold">Upgrade to M.32GB</h4>
                    <p className="text-slate-400 text-sm">4 vCPU • 32GB RAM • 320GB Storage</p>
                  </div>
                  <span className="text-teal-400 font-semibold">₹5,280/mo</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // API call to resize server
                  setShowResizeModal(false);
                }}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
              >
                Resize Server
              </button>
              <button
                onClick={() => setShowResizeModal(false)}
                className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: IP Configuration */}
      {showIPModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-violet-400" />
                <h3 className="text-xl font-bold text-white">IP Configuration</h3>
              </div>
              <button onClick={() => setShowIPModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4 mb-4">
              <div className="bg-slate-950 border border-cyan-500/30 rounded-lg p-4">
                <label className="text-slate-400 text-sm mb-2 block">Primary IPv4 Address</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-white font-mono bg-slate-900 px-3 py-2 rounded border border-slate-700">
                    {server.ip_address || '160.187.80.183'}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(server.ip_address || '160.187.80.183');
                      setCopiedIP(true);
                      setTimeout(() => setCopiedIP(false), 2000);
                    }}
                    className="p-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
                  >
                    {copiedIP ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button className="w-full px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-semibold">
                + Add Additional IPv4 (₹200/mo)
              </button>
              <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
                + Enable IPv6
              </button>
            </div>
            <button
              onClick={() => setShowIPModal(false)}
              className="w-full px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal: Firewall Rules */}
      {showFirewallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500 max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-pink-400" />
                <h3 className="text-xl font-bold text-white">Firewall Rules</h3>
              </div>
              <button onClick={() => setShowFirewallModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              {[
                { protocol: 'TCP', port: '22', source: 'Anywhere', description: 'SSH Access' },
                { protocol: 'TCP', port: '80', source: 'Anywhere', description: 'HTTP' },
                { protocol: 'TCP', port: '443', source: 'Anywhere', description: 'HTTPS' },
              ].map((rule, idx) => (
                <div key={idx} className="bg-slate-950 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-mono">{rule.protocol}</span>
                      <span className="text-cyan-400">Port {rule.port}</span>
                      <span className="text-slate-400">from {rule.source}</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{rule.description}</p>
                  </div>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold">
                + Add New Rule
              </button>
              <button
                onClick={() => setShowFirewallModal(false)}
                className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Backup Management */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Database className="h-6 w-6 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Backup Management</h3>
              </div>
              <button onClick={() => setShowBackupModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold mb-4">
              Create Manual Backup Now
            </button>
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Available Backups</h4>
              {[
                { name: 'Auto Backup - 15/11/2025', size: '12.5 GB', type: 'Automatic' },
                { name: 'Pre-Update Backup', size: '11.8 GB', type: 'Manual' },
              ].map((backup, idx) => (
                <div key={idx} className="bg-slate-950 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-semibold">{backup.name}</h5>
                    <p className="text-slate-400 text-sm">{backup.size} • {backup.type}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
                      Restore
                    </button>
                    <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowBackupModal(false)}
              className="w-full mt-4 px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal: Destroy Server Confirmation */}
      {showDestroyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border-2 border-red-500 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Trash2 className="h-6 w-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">Destroy Server</h3>
              </div>
              <button onClick={() => setShowDestroyModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold">This action cannot be undone!</p>
                  <p className="text-slate-400 text-sm mt-1">All data, snapshots, and configurations will be permanently deleted.</p>
                </div>
              </div>
            </div>
            <p className="text-slate-400 mb-4">Type <span className="text-white font-mono bg-slate-950 px-2 py-1 rounded">DELETE</span> to confirm:</p>
            <input
              type="text"
              placeholder="Type DELETE to confirm"
              className="w-full px-4 py-3 bg-slate-950 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // API call to destroy server
                  setShowDestroyModal(false);
                }}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Destroy Server
              </button>
              <button
                onClick={() => setShowDestroyModal(false)}
                className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
