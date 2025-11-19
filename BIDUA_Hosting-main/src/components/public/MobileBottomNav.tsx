import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Server, Calculator, MoreHorizontal, X, User, LogIn, DollarSign, Building2, Headphones, LayoutDashboard, CreditCard, Gift } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function MobileBottomNav() {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const closeMoreMenu = () => {
    setMoreMenuOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation - Only visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-cyan-500/30 z-40 shadow-lg shadow-cyan-500/10">
        <div className="grid grid-cols-4 h-16">
          {user ? (
            <>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`flex flex-col items-center justify-center space-y-1 transition ${
                  isActive('/dashboard') ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                }`}
                onClick={closeMoreMenu}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="text-xs font-medium">Dashboard</span>
              </Link>

              {/* Servers */}
              <Link
                to="/dashboard/servers"
                className={`flex flex-col items-center justify-center space-y-1 transition ${
                  isActive('/dashboard/servers') ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                }`}
                onClick={closeMoreMenu}
              >
                <Server className="h-5 w-5" />
                <span className="text-xs font-medium">Servers</span>
              </Link>

              {/* Billing */}
              <Link
                to="/dashboard/billing"
                className={`flex flex-col items-center justify-center space-y-1 transition ${
                  isActive('/dashboard/billing') ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                }`}
                onClick={closeMoreMenu}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs font-medium">Billing</span>
              </Link>

              {/* More */}
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex flex-col items-center justify-center space-y-1 transition ${
                  moreMenuOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {moreMenuOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
                <span className="text-xs font-medium">More</span>
              </button>
            </>
          ) : (
            <>
              {/* Home */}
              <Link
                to="/"
                className={`flex flex-col items-center justify-center space-y-1 transition ${
                  isActive('/') ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                }`}
                onClick={closeMoreMenu}
              >
                <Home className="h-5 w-5" />
                <span className="text-xs font-medium">Home</span>
              </Link>

              {/* Plans */}
              <Link
                to="/pricing"
                className={`flex flex-col items-center justify-center space-y-1 transition ${
                  isActive('/pricing') ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                }`}
                onClick={closeMoreMenu}
              >
                <Server className="h-5 w-5" />
                <span className="text-xs font-medium">Plans</span>
              </Link>

              {/* Calculator */}
              <Link
                to="/calculator"
                className={`flex flex-col items-center justify-center space-y-1 transition ${
                  isActive('/calculator') ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                }`}
                onClick={closeMoreMenu}
              >
                <Calculator className="h-5 w-5" />
                <span className="text-xs font-medium">Calculator</span>
              </Link>

              {/* More */}
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex flex-col items-center justify-center space-y-1 transition ${
                  moreMenuOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {moreMenuOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
                <span className="text-xs font-medium">More</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* More Menu Overlay */}
      {moreMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={closeMoreMenu}
          />

          {/* More Menu Panel */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 bg-slate-900 border-t border-cyan-500/30 z-40 shadow-lg shadow-cyan-500/20 max-h-[60vh] overflow-y-auto">
            <div className="p-4 space-y-2">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                Menu
              </div>

              {user ? (
                <>
                  {/* Referrals/Affiliate */}
                  <Link
                    to="/dashboard/referrals"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive('/dashboard/referrals')
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400'
                    }`}
                    onClick={closeMoreMenu}
                  >
                    <Gift className="h-5 w-5" />
                    <span className="font-medium">Referrals & Affiliate</span>
                  </Link>

                  {/* Account/Settings */}
                  <Link
                    to="/dashboard/settings"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive('/dashboard/settings')
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400'
                    }`}
                    onClick={closeMoreMenu}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Account Settings</span>
                  </Link>

                  {/* Support */}
                  <Link
                    to="/dashboard/support"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive('/dashboard/support')
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400'
                    }`}
                    onClick={closeMoreMenu}
                  >
                    <Headphones className="h-5 w-5" />
                    <span className="font-medium">Support</span>
                  </Link>

                  {/* Pricing Calculator */}
                  <Link
                    to="/calculator"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive('/calculator')
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400'
                    }`}
                    onClick={closeMoreMenu}
                  >
                    <Calculator className="h-5 w-5" />
                    <span className="font-medium">Pricing Calculator</span>
                  </Link>

                  {/* Dedicated Servers */}
                  <Link
                    to="/dedicated-servers"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive('/dedicated-servers')
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400'
                    }`}
                    onClick={closeMoreMenu}
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Dedicated Servers</span>
                  </Link>

                  <div className="border-t border-cyan-500/20 my-3" />

                  {/* Logout */}
                  <button
                    onClick={async () => {
                      closeMoreMenu();
                      await signOut();
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogIn className="h-5 w-5 rotate-180" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Support */}
                  <Link
                    to="/contact"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive('/contact')
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400'
                    }`}
                    onClick={closeMoreMenu}
                  >
                    <Headphones className="h-5 w-5" />
                    <span className="font-medium">Support & Contact</span>
                  </Link>

                  {/* Dedicated Servers */}
                  <Link
                    to="/dedicated-servers"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive('/dedicated-servers')
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400'
                    }`}
                    onClick={closeMoreMenu}
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Dedicated Servers</span>
                  </Link>

                  {/* Solutions */}
                  <Link
                    to="/solutions"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive('/solutions')
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400'
                    }`}
                    onClick={closeMoreMenu}
                  >
                    <DollarSign className="h-5 w-5" />
                    <span className="font-medium">Solutions</span>
                  </Link>

                  <div className="border-t border-cyan-500/20 my-3" />

                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
                    onClick={closeMoreMenu}
                  >
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
