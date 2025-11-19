import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Server,
  MessageSquare,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Gift,
  Package,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/servers', icon: Server, label: 'Server Management' },
    { to: '/admin/plans', icon: Package, label: 'Plans Management' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders Management' },
    { to: '/admin/referrals', icon: Gift, label: 'Referral Management' },
    { to: '/admin/support', icon: MessageSquare, label: 'Support Management' },
    { to: '/admin/employees', icon: Briefcase, label: 'Employee Management' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#05050f] to-[#020617] text-slate-100">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[17rem] bg-slate-950/80 backdrop-blur-2xl border-r border-slate-900 shadow-[0_25px_65px_rgba(0,0,0,.65)] transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-slate-900/80">
              <Link to="/admin" className="flex items-center space-x-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500">BIDUA</p>
                  <span className="text-lg font-semibold text-white">Admin Panel</span>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {adminLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition border ${
                      isActive
                        ? 'border-cyan-500/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg shadow-cyan-500/10'
                        : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/60'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <div className="flex-1">
                      <span className="font-medium">{link.label}</span>
                      {isActive && <div className="text-xs text-cyan-300/80">Active</div>}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-900/70 p-4">
              <div className="flex items-center space-x-3 px-4 py-3 bg-slate-950/70 rounded-xl mb-3 border border-slate-800">
                <div className="w-11 h-11 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-semibold shadow shadow-cyan-500/30">
                  {profile?.full_name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {profile?.full_name || 'Admin'}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {profile?.role?.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 w-full px-4 py-3 text-slate-300 hover:bg-slate-900 rounded-xl transition border border-slate-800"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 flex items-center h-16 px-4 sm:px-6 lg:px-8 bg-slate-950/80 backdrop-blur border-b border-slate-900 shadow-[0_10px_35px_rgba(2,6,23,0.8)]">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white mr-4"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-slate-500">BIDUA Hosting</p>
                <h2 className="text-lg font-semibold text-white">Administration Console</h2>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/40">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-xs font-semibold text-cyan-100 tracking-wide">LIVE</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
