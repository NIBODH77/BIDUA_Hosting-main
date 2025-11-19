import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Send,
  ArrowLeft,
  User as UserIcon,
  Paperclip
} from 'lucide-react';
import { api } from '../../lib/api';
import { FileUpload } from '../../components/FileUpload';
import { AttachmentList } from '../../components/AttachmentList';

interface SupportTicketData {
  id: string;
  ticket_number: string;
  subject: string;
  status: string;
  priority: string;
  created: string;
  lastUpdated: string;
  message_count: number;
  description?: string;
  department?: string;
}

interface TicketDetail extends SupportTicketData {
  user_name: string;
  user_email: string;
  assigned_to_name?: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: number;
  message: string;
  is_staff_reply: boolean;
  is_internal_note: boolean;
  created_at: string;
  author_name: string;
  author_email: string;
  attachments?: Attachment[];
}

interface Attachment {
  id: number;
  filename: string;
  size: number;
  mime_type: string;
  status: string;
  message_id?: number;
}

export function SupportEnhanced() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'new' | 'detail'>('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<SupportTicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [replyMessage, setReplyMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState(0);
  const [pendingAttachments, setPendingAttachments] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    subject: '',
    priority: 'medium',
    department: 'technical',
    message: '',
  });

  // Load tickets from database
  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response: any = await api.getSupportTickets({ status: statusFilter !== 'all' ? statusFilter : undefined });
      
      // Transform backend data to match frontend format
      const transformedTickets: SupportTicketData[] = (response || []).map((ticket: any) => ({
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        created: ticket.created_at.split('T')[0],
        lastUpdated: ticket.updated_at ? ticket.updated_at.split('T')[0] : ticket.created_at.split('T')[0],
        message_count: ticket.message_count || 0,
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
      const response = await api.getSupportTicket(ticketId);
      
      // Load attachments to group with messages
      const token = localStorage.getItem('access_token');
      const attachmentsResponse = await fetch(
        `http://localhost:8000/api/v1/attachments/tickets/${ticketId}/attachments?include_pending=true`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      const attachments = attachmentsResponse.ok ? await attachmentsResponse.json() : [];
      
      // Group attachments by message_id
      const messageAttachments: Record<number, Attachment[]> = {};
      const pendingAttachmentsTemp: number[] = [];
      
      attachments.forEach((att: Attachment) => {
        if (att.status === 'pending') {
          pendingAttachmentsTemp.push(att.id);
        } else if (att.message_id) {
          if (!messageAttachments[att.message_id]) {
            messageAttachments[att.message_id] = [];
          }
          messageAttachments[att.message_id].push(att);
        }
      });
      
      // Add attachments to messages
      if (response.messages) {
        response.messages = response.messages.map((msg: TicketMessage) => ({
          ...msg,
          attachments: messageAttachments[msg.id] || []
        }));
      }
      
      setSelectedTicket(response);
      setPendingAttachments(pendingAttachmentsTemp);
      setActiveTab('detail');
    } catch (error) {
      console.error('Failed to load ticket details:', error);
      alert('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      const token = localStorage.getItem('access_token');
      
      // Step 1: Send the message
      const response = await fetch(`http://localhost:8000/api/v1/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: replyMessage,
          is_internal_note: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }

      const messageData = await response.json();
      console.log('Message sent successfully:', messageData);

      // Step 2: Link pending attachments to this message
      if (pendingAttachments.length > 0) {
        try {
          await fetch(`http://localhost:8000/api/v1/attachments/attachments/link-to-message`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              attachment_ids: pendingAttachments,
              message_id: messageData.id
            })
          });
          console.log('Attachments linked to message');
        } catch (linkError) {
          console.error('Failed to link attachments:', linkError);
          // Continue anyway - message was sent
        }
      }

      // Clear state
      setReplyMessage('');
      setPendingAttachments([]);
      setShowFileUpload(false);
      setAttachmentRefreshKey(prev => prev + 1);
      
      // Reload ticket details to show new message with attachments
      await loadTicketDetail(selectedTicket.id);
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert(`Failed to send reply: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to close this ticket?')) return;

    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/v1/support/tickets/${ticketId}/status?new_status=closed`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Ticket closed successfully');
      setActiveTab('tickets');
      await loadTickets();
    } catch (error) {
      console.error('Failed to close ticket:', error);
      alert('Failed to close ticket');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'in_progress':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'closed':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
          <p className="text-slate-400">Get help from our support team</p>
        </div>
        {activeTab !== 'new' && (
          <button
            onClick={() => setActiveTab('new')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50"
          >
            <Plus className="h-5 w-5" />
            <span>New Ticket</span>
          </button>
        )}
      </div>

      {/* Ticket Detail View */}
      {activeTab === 'detail' && selectedTicket && (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 overflow-hidden">
          <div className="p-6 border-b border-cyan-500/30">
            <button
              onClick={() => setActiveTab('tickets')}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tickets</span>
            </button>
            
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{selectedTicket.subject}</h2>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedTicket.status)}`}>
                    {getStatusIcon(selectedTicket.status)}
                    <span className="capitalize">{selectedTicket.status.replace('_', ' ')}</span>
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(selectedTicket.priority)}`}>
                    <span className="capitalize">{selectedTicket.priority}</span>
                  </span>
                </div>
                <p className="text-sm font-mono text-slate-400">Ticket #{selectedTicket.ticket_number}</p>
                <p className="text-sm text-slate-400 mt-2">Created: {new Date(selectedTicket.created).toLocaleString()}</p>
                {selectedTicket.assigned_to_name && (
                  <p className="text-sm text-slate-400">Assigned to: {selectedTicket.assigned_to_name}</p>
                )}
              </div>
              
              {selectedTicket.status !== 'closed' && (
                <button
                  onClick={() => handleCloseTicket(selectedTicket.id)}
                  className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition border border-red-500/30"
                >
                  Close Ticket
                </button>
              )}
            </div>
          </div>

          {/* Initial Description */}
          <div className="p-6 border-b border-cyan-500/20 bg-slate-950">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-white">{selectedTicket.user_name}</span>
                  <span className="text-sm text-slate-400">{new Date(selectedTicket.created).toLocaleString()}</span>
                </div>
                <p className="text-slate-300 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>
            </div>
          </div>

          {/* Messages/Replies */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
              selectedTicket.messages.map((msg) => (
                <div key={msg.id} className={`flex items-start space-x-3 ${msg.is_staff_reply ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.is_staff_reply ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                  }`}>
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className={`flex-1 ${msg.is_staff_reply ? 'text-right' : ''}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-white">{msg.author_name}</span>
                      {msg.is_staff_reply && <span className="text-xs text-purple-400 font-semibold">STAFF</span>}
                      <span className="text-sm text-slate-400">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      msg.is_staff_reply ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-slate-950'
                    }`}>
                      <p className="text-slate-300 whitespace-pre-wrap">{msg.message}</p>
                      
                      {/* Show attachments for this message */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-cyan-500/20 space-y-2">
                          {msg.attachments.map((att) => (
                            <div key={att.id} className="flex items-center gap-2 text-sm">
                              <Paperclip className="h-4 w-4 text-cyan-400" />
                              <span className="text-cyan-300">{att.filename}</span>
                              <span className="text-slate-500">({(att.size / 1024).toFixed(1)} KB)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-8">No replies yet</p>
            )}
          </div>

          {/* Attachments Section */}
          <div className="p-6 border-t border-cyan-500/30 bg-slate-950/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Attachments
              </h3>
              {selectedTicket.status !== 'closed' && (
                <button
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                >
                  {showFileUpload ? 'Hide Upload' : 'Upload Files'}
                </button>
              )}
            </div>

            {showFileUpload && selectedTicket.status !== 'closed' && (
              <div className="mb-4">
                <FileUpload
                  ticketId={parseInt(selectedTicket.id)}
                  onUploadComplete={(file) => {
                    // Add to pending attachments
                    setPendingAttachments(prev => [...prev, file.id]);
                    setAttachmentRefreshKey(prev => prev + 1);
                  }}
                />
              </div>
            )}

            <AttachmentList 
              key={attachmentRefreshKey}
              ticketId={parseInt(selectedTicket.id)}
              onDelete={() => setAttachmentRefreshKey(prev => prev + 1)}
            />
          </div>

          {/* Reply Box */}
          {selectedTicket.status !== 'closed' && (
            <div className="p-6 border-t border-cyan-500/30">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 resize-none"
                  />
                </div>
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tickets List */}
      {activeTab === 'tickets' && (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 overflow-hidden">
          <div className="p-6 border-b border-cyan-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold text-white">My Tickets</h2>
              
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                {['all', 'open', 'in_progress', 'closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      statusFilter === status
                        ? 'bg-cyan-500 text-white'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

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
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="text-slate-400 mt-4">Loading tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
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
                          <span className="text-sm font-mono text-slate-400">{ticket.ticket_number}</span>
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
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
                        <span>{ticket.message_count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Ticket Form */}
      {activeTab === 'new' && (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 overflow-hidden">
          <div className="p-6 border-b border-cyan-500/30">
            <h2 className="text-xl font-semibold text-white">Create New Ticket</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  <option value="urgent">Urgent</option>
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
        </div>
      )}
    </div>
  );
}
