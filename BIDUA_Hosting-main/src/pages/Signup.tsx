import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Server, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export function Signup() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralCheckLoading, setReferralCheckLoading] = useState(false);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referralInviter, setReferralInviter] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users to their intended destination
  useEffect(() => {
    if (user) {
      const serverConfig = location.state?.serverConfig;
      const redirectUrl = searchParams.get('redirect');

      if (serverConfig && redirectUrl) {
        // User is already logged in and has a server selection - go to checkout
        navigate(decodeURIComponent(redirectUrl), { state: { serverConfig }, replace: true });
      } else if (redirectUrl) {
        // Generic redirect
        navigate(decodeURIComponent(redirectUrl), { replace: true });
      } else {
        // Default to dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate, location.state, searchParams]);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, [searchParams]);

  // Validate referral code when it changes
  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!referralCode) {
        setReferralValid(null);
        setReferralInviter(null);
        return;
      }
      setReferralCheckLoading(true);
      try {
        const resp = await api.get<{ valid: boolean; inviter?: { full_name?: string; email?: string }; code?: string }>(`/api/v1/affiliate/validate-code?code=${encodeURIComponent(referralCode)}`);
        if (!active) return;
        setReferralValid(Boolean(resp?.valid));
        setReferralInviter(resp?.inviter?.full_name || resp?.inviter?.email || null);
      } catch {
        if (!active) return;
        // Backend unreachable or error: don't mark invalid, just unknown
        setReferralValid(null);
        setReferralInviter(null);
      } finally {
        if (active) setReferralCheckLoading(false);
      }
    };
    // debounce a bit
    const t = setTimeout(check, 250);
    return () => { active = false; clearTimeout(t); };
  }, [referralCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName, referralCode);

      // Show success message
      const successMessage = referralCode && referralValid 
        ? `🎉 Account created successfully! Welcome to BIDUA Hosting! You were referred by ${referralInviter || 'a member'}.`
        : '🎉 Account created successfully! Welcome to BIDUA Hosting!';
      
      // Store success message in sessionStorage
      sessionStorage.setItem('registration_success', 'true');
      sessionStorage.setItem('registration_message', successMessage);

      // Check if there's a pending server configuration from checkout flow
      const serverConfig = location.state?.serverConfig;
      const redirectUrl = searchParams.get('redirect');

      if (serverConfig && redirectUrl) {
        // User came from pricing page - redirect to checkout with server config
        navigate(decodeURIComponent(redirectUrl), { state: { serverConfig } });
      } else if (redirectUrl) {
        // Generic redirect
        navigate(decodeURIComponent(redirectUrl));
      } else {
        // Default to dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Try to extract API error message for already registered user
      let message = 'Failed to create account';
      if (err?.message?.includes('User with this email already exists')) {
        message = 'An account with this email already exists. Please log in or use a different email.';
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white mb-6">
            <Server className="h-10 w-10 text-cyan-400 animate-serverPulse" />
            <span className="text-2xl font-bold">BIDUA Hosting</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-cyan-200">Start your cloud hosting journey today</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl shadow-2xl p-8 border border-cyan-500/30">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 pr-12 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 uppercase"
                  placeholder="Enter referral code"
                />
                {referralCode && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {referralCheckLoading && (
                      <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
                    )}
                    {!referralCheckLoading && referralValid === true && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {!referralCheckLoading && referralValid === false && (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {/* Referrer name and validation status below the input */}
              {referralCode && referralValid === true && referralInviter && (
                <div className="mt-2 flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <div className="text-sm text-green-300">
                    <span className="font-semibold">Valid referral code</span>
                    <span className="text-green-400"> • </span>
                    <span>You'll be referred by </span>
                    <span className="font-semibold text-green-200">{referralInviter}</span>
                  </div>
                </div>
              )}
              {referralCode && !referralCheckLoading && referralValid === false && (
                <div className="mt-2 flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <div className="text-sm text-red-300">
                    <span className="font-semibold">Invalid or inactive referral code.</span>
                    <span className="text-red-400"> You can still sign up without it.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-cyan-500 border-cyan-500/30 rounded focus:ring-cyan-500 bg-slate-800 mt-1"
              />
              <label className="ml-2 text-sm text-slate-300">
                I agree to the{' '}
                <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
