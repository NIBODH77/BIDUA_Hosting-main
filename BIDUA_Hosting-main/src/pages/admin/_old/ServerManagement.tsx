import { useState, useEffect } from 'react';
import { Server, Search, Play, Pause, RotateCw, Trash2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ServerData {
  id: string;
  user_id: string;
  server_name: string;
  ip_address: string;
  server_status: string;
  server_type: string;
  specs: any;
  created_at: string;
  user_email?: string;
}

export function ServerManagement() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('servers')
        .select(`
          *,
          users_profiles(email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map(server => ({
        ...server,
        user_email: server.users_profiles?.email || 'N/A'
      }));

      setServers(formattedData);
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServerAction = async (serverId: string, action: string) => {
    let newStatus = '';
    switch (action) {
      case 'start':
        newStatus = 'active';
        break;
      case 'stop':
        newStatus = 'suspended';
        break;
      case 'restart':
        newStatus = 'active';
        break;
      case 'terminate':
        newStatus = 'terminated';
        break;
    }

    try {
      const { error } = await supabase
        .from('servers')
        .update({ server_status: newStatus })
        .eq('id', serverId);

      if (error) throw error;
      await fetchServers();
    } catch (error) {
      console.error('Error updating server:', error);
    }
  };

  const handleDeleteServer = async (serverId: string) => {
    if (!confirm('Are you sure you want to delete this server?')) return;

    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', serverId);

      if (error) throw error;
      await fetchServers();
    } catch (error) {
      console.error('Error deleting server:', error);
    }
  };

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.server_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || server.server_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'provisioning': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'suspended': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'terminated': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Server className="h-7 w-7 text-cyan-400" />
            Server Management
          </h2>
          <p className="text-slate-400">Manage all hosted servers</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-400 hover:to-teal-400 transition font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Provision Server
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl shadow-sm border-2 border-cyan-500 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="provisioning">Provisioning</option>
            <option value="suspended">Suspended</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
            <p className="text-slate-400 mt-4">Loading servers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/30">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Server Name</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">IP Address</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Owner</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Created</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/20">
                {filteredServers.map((server) => (
                  <tr key={server.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{server.server_name}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{server.ip_address || 'Pending'}</td>
                    <td className="py-4 px-4 text-slate-300">{server.user_email}</td>
                    <td className="py-4 px-4 text-slate-300">{server.server_type}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(server.server_status)}`}>
                        {server.server_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {new Date(server.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {server.server_status === 'suspended' && (
                          <button
                            onClick={() => handleServerAction(server.id, 'start')}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition"
                            title="Start Server"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        {server.server_status === 'active' && (
                          <>
                            <button
                              onClick={() => handleServerAction(server.id, 'restart')}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition"
                              title="Restart Server"
                            >
                              <RotateCw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleServerAction(server.id, 'stop')}
                              className="p-2 text-orange-400 hover:bg-orange-500/20 rounded-lg transition"
                              title="Stop Server"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteServer(server.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                          title="Delete Server"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredServers.length === 0 && (
              <div className="text-center py-12">
                <Server className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No servers found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
