import { useState, useEffect } from 'react';
import { MessageSquare, Search, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  user_email?: string;
  assigned_email?: string;
}

export function SupportManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          users_profiles!support_tickets_user_id_fkey(email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map(ticket => ({
        ...ticket,
        user_email: ticket.users_profiles?.email || 'N/A',
      }));

      setTickets(formattedData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;
      await fetchTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleUpdatePriority = async (ticketId: string, newPriority: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ priority: newPriority })
        .eq('id', ticketId);

      if (error) throw error;
      await fetchTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, priority: newPriority });
      }
    } catch (error) {
      console.error('Error updating ticket priority:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertCircle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const calculateStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;

    return { total, open, inProgress, resolved };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-cyan-400" />
          Support Management
        </h2>
        <p className="text-slate-400">Manage customer support tickets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border-2 border-cyan-500 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Total Tickets</div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-slate-900 border-2 border-blue-500 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Open</div>
          <div className="text-2xl font-bold text-blue-400">{stats.open}</div>
        </div>
        <div className="bg-slate-900 border-2 border-yellow-500 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
        </div>
        <div className="bg-slate-900 border-2 border-green-500 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Resolved</div>
          <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl shadow-sm border-2 border-cyan-500 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
            <p className="text-slate-400 mt-4">Loading tickets...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition cursor-pointer"
                onClick={() => {
                  setSelectedTicket(ticket);
                  setShowModal(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{ticket.subject}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getPriorityBadgeColor(ticket.priority)}`}>
                        {getPriorityIcon(ticket.priority)}
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>Customer: <span className="text-slate-300">{ticket.user_email}</span></span>
                      <span>•</span>
                      <span>{new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No tickets found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl border-2 border-cyan-500 p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">Ticket Details</h3>

            <div className="space-y-4 mb-6">
              <div>
                <div className="text-sm text-slate-400 mb-1">Subject</div>
                <div className="text-white text-lg font-semibold">{selectedTicket.subject}</div>
              </div>

              <div>
                <div className="text-sm text-slate-400 mb-1">Description</div>
                <div className="text-white bg-slate-800 rounded-lg p-4 whitespace-pre-wrap">
                  {selectedTicket.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Customer</div>
                  <div className="text-white">{selectedTicket.user_email}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Ticket ID</div>
                  <div className="text-white font-mono text-sm">{selectedTicket.id.slice(0, 8)}...</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Priority</label>
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => handleUpdatePriority(selectedTicket.id, e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Created</div>
                  <div className="text-white">{new Date(selectedTicket.created_at).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400">Last Updated</div>
                  <div className="text-white">{new Date(selectedTicket.updated_at).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedTicket(null);
              }}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
