import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Order {
  id: string;
  user_id: string;
  plan_id: string;
  order_status: string;
  total_amount: number;
  payment_status: string;
  server_details: any;
  created_at: string;
  user_email?: string;
  plan_name?: string;
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users_profiles(email),
          hosting_plans(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map(order => ({
        ...order,
        user_email: order.users_profiles?.email || 'N/A',
        plan_name: order.hosting_plans?.name || 'N/A'
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      await fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'refunded': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const calculateStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.order_status === 'pending').length;
    const completed = orders.filter(o => o.order_status === 'completed').length;
    const revenue = orders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    return { total, pending, completed, revenue };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShoppingCart className="h-7 w-7 text-cyan-400" />
          Orders Management
        </h2>
        <p className="text-slate-400">Track and manage customer orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border-2 border-cyan-500 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-slate-900 border-2 border-yellow-500 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
        </div>
        <div className="bg-slate-900 border-2 border-green-500 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
        </div>
        <div className="bg-slate-900 border-2 border-purple-500 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-purple-400">₹{stats.revenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl shadow-sm border-2 border-cyan-500 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders..."
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
            <p className="text-slate-400 mt-4">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/30">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Plan</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Payment</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/20">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-4 px-4">
                      <div className="font-mono text-sm text-cyan-400">{order.id.slice(0, 8)}...</div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{order.user_email}</td>
                    <td className="py-4 px-4 text-slate-300">{order.plan_name}</td>
                    <td className="py-4 px-4">
                      <span className="text-white font-semibold">₹{Number(order.total_amount).toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(order.order_status)}`}>
                        {order.order_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentBadgeColor(order.payment_status)}`}>
                        {order.payment_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.order_status === 'pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition"
                            title="Complete Order"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {order.order_status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                            title="Cancel Order"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No orders found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border-2 border-cyan-500 p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold text-white mb-4">Order Details</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-slate-400 mb-1">Order ID</div>
                <div className="text-white font-mono text-sm">{selectedOrder.id}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Customer</div>
                <div className="text-white">{selectedOrder.user_email}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Plan</div>
                <div className="text-white">{selectedOrder.plan_name}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Amount</div>
                <div className="text-cyan-400 font-bold">₹{Number(selectedOrder.total_amount).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Order Status</div>
                <select
                  value={selectedOrder.order_status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Payment Status</div>
                <select
                  value={selectedOrder.payment_status}
                  onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-slate-400 mb-1">Created</div>
                <div className="text-white">{new Date(selectedOrder.created_at).toLocaleString()}</div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedOrder(null);
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
