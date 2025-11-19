import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Plus, Search, Clock, CheckCircle, AlertCircle, Send, ArrowLeft, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext'; // Keep this line for context

export function Support() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tickets' | 'new' | 'detail'>('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<SupportTicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  interface SupportTicketData {
    id: string;
    subject: string;
    status: string;
    priority: string;
    created: string;
    lastUpdated: string;
    messages: number;
    description?: string;
    department?: string;
  }

  // Load tickets from database
  useEffect(() => {
    loadTickets();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.messages]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response: any = await api.getSupportTickets();
      
      // Transform backend data to match frontend format
      const transformedTickets: SupportTicketData[] = (response || []).map((ticket: any) => ({
        id: ticket.ticket_number,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        created: ticket.created_at.split('T')[0],
        lastUpdated: ticket.updated_at ? ticket.updated_at.split('T')[0] : ticket.created_at.split('T')[0],
        messages: 0, // We'll implement message count later
        description: ticket.description,
        department: ticket.department
      }));
      
      setTickets(transformedTickets);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetail = async (ticketId: string) => {
    try {
      setLoading(true);
      const ticketDetail = await api.getSupportTicket(ticketId);
      setSelectedTicket(ticketDetail);
      setActiveTab('detail');
    } catch (error) {
      console.error('Failed to load ticket details:', error);
      alert('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      setSendingMessage(true);
      
      // Debug logging
      const token = localStorage.getItem('access_token');
      console.log('=== SEND MESSAGE DEBUG ===');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length);
      console.log('Token preview:', token?.substring(0, 20) + '...');
      console.log('Ticket ID:', selectedTicket.ticket_number);
      console.log('Message:', newMessage);
      console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000');
      
      const result = await api.addTicketMessage(selectedTicket.ticket_number, newMessage);
      console.log('Message sent successfully:', result);
      
      setNewMessage('');
      // Reload ticket to get updated messages
      await loadTicketDetail(selectedTicket.ticket_number);
    } catch (error) {
      console.error('=== SEND MESSAGE ERROR ===');
      console.error('Error details:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        alert(`Failed to send message: ${error.message}`);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    
    if (!confirm('Are you sure you want to close this ticket?')) return;

    try {
      await api.updateTicketStatus(selectedTicket.ticket_number, 'closed');
      alert('Ticket closed successfully');
      setActiveTab('tickets');
      setSelectedTicket(null);
      await loadTickets();
    } catch (error) {
      console.error('Failed to close ticket:', error);
      alert('Failed to close ticket');
    }
  };
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'medium',
    department: 'technical',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await api.createSupportTicket({
        subject: formData.subject,
        description: formData.message,
        priority: formData.priority,
        department: formData.department
      });
      
      // Reset form and reload tickets
      setFormData({
        subject: '',
        priority: 'medium',
        department: 'technical',
        message: '',
      });
      
      setActiveTab('tickets');
      await loadTickets();
      
      alert('Ticket created successfully!');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'answered':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'closed':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'answered':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
          <p className="text-slate-400">Get help from our support team</p>
        </div>
        <button
          onClick={() => setActiveTab('new')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50"
        >
          <Plus className="h-5 w-5" />
          <span>New Ticket</span>
        </button>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 overflow-hidden">
        <div className="border-b border-cyan-500/30">
          <div className="flex">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                activeTab === 'tickets'
                  ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
              }`}
            >
              My Tickets
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                activeTab === 'new'
                  ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
              }`}
            >
              New Ticket
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'tickets' && (
            <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="text-slate-400 mt-4">Loading tickets...</p>
                  </div>
                ) : (
                  <>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                />
              </div>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">
                    {searchQuery ? 'No tickets found' : 'No support tickets yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => loadTicketDetail(ticket.id)}
                      className="p-4 bg-slate-950 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-mono text-slate-400">{ticket.id}</span>
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                                ticket.status
                              )}`}
                            >
                              {getStatusIcon(ticket.status)}
                              <span className="capitalize">{ticket.status}</span>
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(
                                ticket.priority
                              )}`}
                            >
                              <span className="capitalize">{ticket.priority}</span>
                            </span>
                          </div>
                          <h3 className="text-white font-semibold mb-1">{ticket.subject}</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <div className="flex items-center space-x-4">
                          <span>Created: {new Date(ticket.created).toLocaleDateString()}</span>
                          <span>Updated: {new Date(ticket.lastUpdated).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket.messages}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                  </>
                )}
            </div>
          )}

          {activeTab === 'new' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  >
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing</option>
                    <option value="sales">Sales</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 resize-none"
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('tickets')}
                  className="px-6 py-3 text-slate-400 hover:text-slate-300 font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'detail' && selectedTicket && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <button
                      onClick={() => {
                        setActiveTab('tickets');
                        setSelectedTicket(null);
                      }}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-mono text-slate-400">{selectedTicket.ticket_number}</span>
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        selectedTicket.status
                      )}`}
                    >
                      {getStatusIcon(selectedTicket.status)}
                      <span className="capitalize">{selectedTicket.status}</span>
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(
                        selectedTicket.priority
                      )}`}
                    >
                      <span className="capitalize">{selectedTicket.priority}</span>
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedTicket.subject}</h2>
                  <p className="text-sm text-slate-400">
                    Created: {new Date(selectedTicket.created_at).toLocaleString()} • 
                    Department: <span className="capitalize">{selectedTicket.department}</span>
                  </p>
                </div>
                {selectedTicket.status !== 'closed' && (
                  <button
                    onClick={handleCloseTicket}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
                  >
                    Close Ticket
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="bg-slate-950 rounded-lg border border-cyan-500/30 p-6 max-h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  {/* Initial message */}
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <span className="text-cyan-400 font-semibold">
                          {user?.full_name?.[0] || user?.email?.[0] || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-900 rounded-lg p-4 border border-cyan-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-white">
                            {user?.full_name || user?.email || 'You'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(selectedTicket.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-300 whitespace-pre-wrap">{selectedTicket.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Subsequent messages */}
                  {selectedTicket.messages && selectedTicket.messages.length > 0 && selectedTicket.messages.map((msg: any, index: number) => (
                    <div key={index} className={`flex space-x-3 ${msg.is_staff_reply ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full ${msg.is_staff_reply ? 'bg-green-500/20' : 'bg-cyan-500/20'} flex items-center justify-center`}>
                          <span className={`${msg.is_staff_reply ? 'text-green-400' : 'text-cyan-400'} font-semibold`}>
                            {msg.author_name?.[0] || 'S'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className={`${msg.is_staff_reply ? 'bg-green-900/20 border-green-500/20' : 'bg-slate-900 border-cyan-500/20'} rounded-lg p-4 border`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-white">
                              {msg.author_name || (msg.is_staff_reply ? 'Support Team' : 'You')}
                              {msg.is_staff_reply && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Staff</span>}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-300 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message input */}
              {selectedTicket.status !== 'closed' && (
                <form onSubmit={handleSendMessage} className="bg-slate-950 rounded-lg border border-cyan-500/30 p-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-200">
                      Add Reply
                    </label>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 resize-none"
                      disabled={sendingMessage}
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={sendingMessage || !newMessage.trim()}
                        className="inline-flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                        <span>{sendingMessage ? 'Sending...' : 'Send Reply'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {selectedTicket.status === 'closed' && (
                <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-4 text-center">
                  <p className="text-slate-400">
                    <X className="h-5 w-5 inline mr-2" />
                    This ticket is closed. No further replies can be added.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
