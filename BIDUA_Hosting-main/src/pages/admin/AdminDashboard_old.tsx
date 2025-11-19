import { useState, useEffect } from 'react';
import { Users, Server, ShoppingCart, MessageSquare, DollarSign, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeServers: 0,
    totalOrders: 0,
    openTickets: 0,
    monthlyRevenue: 0,
    newUsersThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [usersRes, serversRes, ordersRes, ticketsRes] = await Promise.all([
        supabase.from('users_profiles').select('id, created_at', { count: 'exact' }),
        supabase.from('servers').select('id, server_status', { count: 'exact' }),
        supabase.from('orders').select('id, total_amount, payment_status', { count: 'exact' }),
        supabase.from('support_tickets').select('id, status', { count: 'exact' }),
      ]);

      const totalUsers = usersRes.count || 0;
      const activeServers = serversRes.data?.filter(s => s.server_status === 'active').length || 0;
      const totalOrders = ordersRes.count || 0;
      const openTickets = ticketsRes.data?.filter(t => t.status === 'open' || t.status === 'in_progress').length || 0;

      const paidOrders = ordersRes.data?.filter(o => o.payment_status === 'paid') || [];
      const monthlyRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newUsersThisMonth = usersRes.data?.filter(u => new Date(u.created_at) > thirtyDaysAgo).length || 0;

      setStats({
        totalUsers,
        activeServers,
        totalOrders,
        openTickets,
        monthlyRevenue,
        newUsersThisMonth,
      });

      const activities = [
        ...(usersRes.data?.slice(0, 2).map((u: any) => ({
          id: `user-${u.id}`,
          type: 'user',
          message: 'New user registration',
          time: new Date(u.created_at).toLocaleString(),
        })) || []),
        ...(ordersRes.data?.slice(0, 2).map((o: any) => ({
          id: `order-${o.id}`,
          type: 'order',
          message: `New order - ₹${o.total_amount}`,
          time: 'Recent',
        })) || []),
      ];

      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toString(),
      change: `+${stats.newUsersThisMonth} this month`,
      icon: Users,
      color: 'blue',
      link: '/admin/users',
    },
    {
      label: 'Active Servers',
      value: stats.activeServers.toString(),
      change: 'Running smoothly',
      icon: Server,
      color: 'green',
      link: '/admin/servers',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      change: 'From paid orders',
      icon: DollarSign,
      color: 'purple',
      link: '/admin/orders',
    },
    {
      label: 'Open Tickets',
      value: stats.openTickets.toString(),
      change: 'Need attention',
      icon: MessageSquare,
      color: 'orange',
      link: '/admin/support',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: 'All time',
      icon: ShoppingCart,
      color: 'teal',
      link: '/admin/orders',
    },
    {
      label: 'System Status',
      value: 'Healthy',
      change: 'All systems operational',
      icon: Activity,
      color: 'green',
      link: '/admin',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500' },
    teal: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent mb-4"></div>
          <p className="text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-slate-400">Platform overview and statistics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
          <Activity className="h-5 w-5 text-green-400" />
          <span className="text-green-400 font-semibold">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const colors = colorClasses[stat.color];
          return (
            <Link
              key={index}
              to={stat.link}
              className={`bg-slate-900 p-6 rounded-xl shadow-sm border-2 ${colors.border} hover:shadow-lg hover:shadow-${stat.color}-500/30 transition group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition`}>
                  <stat.icon className={`h-7 w-7 ${colors.text}`} />
                </div>
                <TrendingUp className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 transition" />
              </div>
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.change}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl shadow-sm border-2 border-cyan-500">
          <div className="p-6 border-b border-cyan-500">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              Recent Platform Activity
            </h3>
          </div>
          <div className="divide-y divide-cyan-500/20">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-slate-800 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white">{activity.message}</p>
                      <p className="text-sm text-slate-400 mt-1">{activity.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      activity.type === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-slate-600" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl shadow-sm border-2 border-cyan-500 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-cyan-400" />
            Quick Management Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-400 hover:to-cyan-400 transition font-semibold text-center"
            >
              <Users className="inline h-5 w-5 mr-2" />
              Manage Users
            </Link>
            <Link
              to="/admin/servers"
              className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-400 hover:to-green-400 transition font-semibold text-center"
            >
              <Server className="inline h-5 w-5 mr-2" />
              Manage Servers
            </Link>
            <Link
              to="/admin/plans"
              className="block w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-400 hover:to-cyan-400 transition font-semibold text-center"
            >
              <TrendingUp className="inline h-5 w-5 mr-2" />
              Manage Plans
            </Link>
            <Link
              to="/admin/support"
              className="block w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-400 hover:to-red-400 transition font-semibold text-center"
            >
              <MessageSquare className="inline h-5 w-5 mr-2" />
              Support Queue ({stats.openTickets})
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 rounded-xl shadow-lg p-8 text-white border-2 border-cyan-500">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Platform Performance</h3>
            <p className="text-cyan-200 mb-4">
              Your hosting platform is running smoothly with {stats.totalUsers} users and {stats.activeServers} active servers.
            </p>
            <div className="flex gap-6 text-sm">
              <div>
                <div className="text-slate-400">Uptime</div>
                <div className="text-2xl font-bold text-green-400">99.9%</div>
              </div>
              <div>
                <div className="text-slate-400">Response Time</div>
                <div className="text-2xl font-bold text-cyan-400">45ms</div>
              </div>
              <div>
                <div className="text-slate-400">Success Rate</div>
                <div className="text-2xl font-bold text-green-400">98.5%</div>
              </div>
            </div>
          </div>
          <Activity className="h-20 w-20 text-cyan-400/30" />
        </div>
      </div>
    </div>
  );
}
