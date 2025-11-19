import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Server,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MobileBottomNav } from '../components/public/MobileBottomNav';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, profile, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/servers', icon: Server, label: 'My Servers' },
    { to: '/dashboard/referrals', icon: Gift, label: 'Referrals' },
    { to: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
    { to: '/dashboard/support', icon: MessageSquare, label: 'Support' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <div className="flex w-full h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-cyan-500/20 transform transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-cyan-500/20 flex-shrink-0">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Server className="h-8 w-8 text-cyan-400 animate-serverGlow" />
                <span className="text-xl font-bold text-white">BIDUA</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-slate-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {links.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-slate-950'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-950 transition border-t border-cyan-500/20 mt-4 pt-4"
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Switch to Admin Panel</span>
                </Link>
              )}
            </nav>

            <div className="border-t border-cyan-500/20 p-4 flex-shrink-0">
              <div className="flex items-center space-x-3 px-4 py-3 bg-slate-950 rounded-lg mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {profile?.role?.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-screen w-full overflow-x-hidden lg:ml-64">
          <header className="sticky top-0 z-40 flex items-center h-16 px-4 sm:px-6 lg:px-8 bg-slate-900 border-b border-cyan-500/20 md:flex hidden flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-slate-300 mr-4"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-green-400">USER MODE</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 w-full overflow-y-auto overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileBottomNav />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
