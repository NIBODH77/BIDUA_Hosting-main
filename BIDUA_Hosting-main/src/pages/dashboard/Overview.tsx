import { Server, CreditCard, AlertCircle, TrendingUp, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import api, { DashboardStats } from '../../lib/api';

interface Server {
  id: number;
  server_name: string;
  hostname: string;
  server_status: string;
  ip_address?: string;
  plan_name?: string;
  monthly_cost?: number;
}

export function Overview() {
  const [stats, setStats] = useState({
    activeServers: 0,
    monthlyCost: 0,
    openTickets: 0,
    bandwidthUsed: '0GB'
  });
  const [recentServers, setRecentServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  
  // Helpers for readable formatting
  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount || 0);

  const formatBandwidth = (tb: number) => {
    if (!tb || tb <= 0) return '0 GB';
    // Backend returns TB; display with one decimal and unit
    if (tb < 0.1) {
      // very small TB values -> show GB
      const gb = tb * 1024;
      return `${gb.toFixed(0)} GB`;
    }
    return `${tb.toFixed(1)} TB`;
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch servers for recent list
      const serversResponse = await api.getServers();
      const serversArray = Array.isArray(serversResponse) ? serversResponse : [];
      setRecentServers(serversArray.slice(0, 3));

      // Fetch aggregated dashboard stats from backend (more accurate)
  const dashStats: DashboardStats = await api.getDashboardStats();
  const activeServersCount = Number(dashStats.active_servers ?? 0);
  const monthlyCost = Number(dashStats.monthly_cost ?? 0);
  const openTickets = Number(dashStats.open_tickets ?? 0);
  const bandwidthTb = Number(dashStats.bandwidth_used ?? 0);

      setStats({
        activeServers: activeServersCount,
        monthlyCost: monthlyCost,
        openTickets: openTickets,
        bandwidthUsed: formatBandwidth(bandwidthTb)
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    
    // Check if user just registered
    const justRegistered = sessionStorage.getItem('registration_success');
    const storedMessage = sessionStorage.getItem('registration_message');
    
    if (justRegistered === 'true') {
      setShowWelcomeBanner(true);
      setWelcomeMessage(storedMessage || '🎉 Welcome to BIDUA Hosting!');
      
      // Clear the flags
      sessionStorage.removeItem('registration_success');
      sessionStorage.removeItem('registration_message');
      
      // Auto-hide banner after 10 seconds
      setTimeout(() => setShowWelcomeBanner(false), 10000);
    }
  }, [loadDashboardData]);

  const statCards = [
    {
      label: 'Active Servers',
      value: loading ? '...' : stats.activeServers.toString(),
      icon: Server,
      color: 'blue',
      link: '/dashboard/servers',
    },
    {
      label: 'Monthly Cost',
  value: loading ? '...' : formatINR(stats.monthlyCost),
      icon: CreditCard,
      color: 'green',
      link: '/dashboard/billing',
    },
    {
      label: 'Open Tickets',
      value: loading ? '...' : stats.openTickets.toString(),
      icon: AlertCircle,
      color: 'orange',
      link: '/dashboard/support',
    },
    {
      label: 'Bandwidth Used',
  value: loading ? '...' : stats.bandwidthUsed,
      icon: TrendingUp,
      color: 'purple',
      link: '/dashboard/servers',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-cyan-400', hover: 'hover:bg-cyan-500/10' },
    green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-500/10' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-500/10' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-500/10' },
  };

  return (
    <div className="space-y-6 w-full h-full overflow-y-auto pb-6">
      {/* Welcome Banner - Show after successful registration */}
      {showWelcomeBanner && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 sm:p-6 border-2 border-green-400 shadow-xl mx-2 sm:mx-0">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white flex-shrink-0 animate-bounce" />
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Registration Successful! 🎉
              </h3>
              <p className="text-white/90 mb-3 text-sm sm:text-base">
                {welcomeMessage}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-white/80">
                <span>✅ Your account is ready</span>
                <span className="hidden sm:inline">•</span>
                <span>✅ Start deploying servers today</span>
                <span className="hidden sm:inline">•</span>
                <span>✅ Explore our affiliate program</span>
              </div>
            </div>
            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="text-white/80 hover:text-white transition flex-shrink-0"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
      
      <div className="px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome Back!</h2>
        <p className="text-sm sm:text-base text-slate-400">Here's what's happening with your servers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-0">
        {statCards.map((stat, index) => {
          const colors = colorClasses[stat.color];
          return (
            <Link
              key={index}
              to={stat.link}
              className={`bg-slate-900 p-4 sm:p-6 rounded-xl shadow-sm border-2 border-cyan-500 ${colors.hover} transition hover:shadow-lg hover:shadow-cyan-500/30`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.text}`} />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0">
        <div className="bg-slate-900 rounded-xl shadow-sm border-2 border-cyan-500">
          <div className="p-4 sm:p-6 border-b border-cyan-500">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-white">Your Servers</h3>
              <Link
                to="/dashboard/servers"
                className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View All
              </Link>
            </div>
          </div>
          <div>
            {loading ? (
              <div className="p-4 sm:p-6 text-center text-slate-400">Loading servers...</div>
            ) : recentServers.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-slate-400">No servers yet</div>
            ) : (
              recentServers.map((server) => (
                <div key={server.id} className="p-4 sm:p-6 hover:bg-slate-800 transition border-b border-cyan-500/30 last:border-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-1 truncate">{server.server_name}</h4>
                      <p className="text-xs sm:text-sm text-slate-400 mb-2 truncate">{server.hostname}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                        <span className="truncate">{server.ip_address || 'N/A'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="px-2 py-0.5 bg-slate-800 rounded text-xs">
                          {server.plan_name || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold ${
                        server.server_status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {server.server_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl shadow-sm border-2 border-cyan-500">
          <div className="p-4 sm:p-6 border-b border-cyan-500">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-white">Recent Activity</h3>
              <Link
                to="/dashboard/billing"
                className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="text-center text-slate-400 py-8">
              <p className="text-sm sm:text-base">No recent activity</p>
              <p className="text-xs sm:text-sm mt-2">Your billing and payment history will appear here</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 rounded-xl shadow-lg p-8 text-white border-2 border-cyan-500">
        <h3 className="text-2xl font-bold mb-2">Need More Resources?</h3>
        <p className="text-cyan-200 mb-6">
          Upgrade your servers or add new ones to scale your infrastructure
        </p>
        <Link
          to="/pricing"
          className="inline-block px-6 py-3 bg-white text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition border-2 border-cyan-400"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}
