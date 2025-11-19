import { useState, useEffect } from 'react';
import { 
  Users, DollarSign, TrendingUp, Gift, Copy, Check,
  Award, Download, CheckCircle
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getCommissionRules,
  getReferralStats,
  getReferralEarnings,
  getReferralPayouts,
  formatCurrency,
  getStatusColor
} from '../../lib/referral';
import { ReferralLandingPage } from '../../components/referrals/ReferralLandingPage';
// Types from referral adapters
import type { ReferralEarning as AdapterReferralEarning, ReferralPayout as AdapterReferralPayout } from '../../types';

interface AffiliateSubscription {
  id: number;
  subscription_type: string;
  amount_paid: number;
  referral_code: string;
  status: string;
  is_active: boolean;
  is_lifetime: boolean;
  activated_at: string;
}

interface AffiliateStats {
  total_referrals_level1: number;
  total_referrals_level2: number;
  total_referrals_level3: number;
  total_referrals: number;
  active_referrals: number;
  total_commission_earned: number;
  pending_commission: number;
  approved_commission: number;
  paid_commission: number;
  available_balance: number;
  total_payouts: number;
  total_payout_amount: number;
  subscription_status: string;
  referral_code: string;
  is_active: boolean;
  can_request_payout: boolean;
}

interface TeamMember {
  user_id: number;
  email: string;
  full_name: string;
  level: number;
  joined_at: string;
  has_purchased: boolean;
  total_purchases: number;
  total_commission: number;
  active_servers: number;
  child_count: number;
}

interface Commission {
  id: number;
  level: number;
  order_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  created_at: string;
  referred_user_email?: string;
  order_description?: string;
}

// Adapter-based simplified legacy stats fallback
interface LegacyReferralStats {
  referral_code: string;
  total_referrals: number;
  l1_referrals: number;
  l2_referrals: number;
  l3_referrals: number;
  total_earnings: number;
  available_balance: number;
  total_withdrawn: number;
}

// NOTE: Using adapter-provided types from ../../types (import removed for brevity) prevents ID mismatch issues

export function ReferralsEnhanced() {
  const { profile } = useAuth();
  const [subscription, setSubscription] = useState<AffiliateSubscription | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'commissions' | 'earnings' | 'payouts'>('overview');
  const [copied, setCopied] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [commissionRules, setCommissionRules] = useState<Array<{id:number; level:number; value:number; type:string; product_type:string; name:string; description?:string}>>([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [autoActivated, setAutoActivated] = useState(false);
  const [legacyStats, setLegacyStats] = useState<LegacyReferralStats | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  // Use relaxed ID typing (string | number) due to backend returning string IDs
  type UIReferralEarning = Omit<AdapterReferralEarning, 'id'> & { id: string | number };
  type UIReferralPayout = Omit<AdapterReferralPayout, 'id'> & { id: string | number };
  const [earnings, setEarnings] = useState<UIReferralEarning[]>([]);
  const [payouts, setPayouts] = useState<UIReferralPayout[]>([]);

  useEffect(() => {
    loadData();
    
    // Check if user just activated affiliate subscription
    const justActivated = sessionStorage.getItem('affiliate_just_activated');
    const storedMessage = sessionStorage.getItem('affiliate_welcome_message');
    
    if (justActivated === 'true') {
      setShowWelcomeBanner(true);
      setWelcomeMessage(storedMessage || '🎉 Welcome to BIDUA Hosting Affiliate Program!');
      
      // Clear the flags
      sessionStorage.removeItem('affiliate_just_activated');
      sessionStorage.removeItem('affiliate_welcome_message');
      
      // Auto-hide banner after 10 seconds
      setTimeout(() => setShowWelcomeBanner(false), 10000);
    }
  }, []);

  // Load Razorpay script once
  useEffect(() => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]') as HTMLScriptElement | null;
    if (existing) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => setRazorpayLoaded(false);
    document.body.appendChild(script);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setBackendOffline(false);
    setOfflineMessage(null);
    let currentSubscription: AffiliateSubscription | null = null;
    try {
      // First perform explicit health pre-check to avoid false offline from a single failing endpoint
      try {
        await api.get('/api/v1/health');
      } catch (healthErr) {
        if (healthErr instanceof Error && healthErr.message.startsWith('BACKEND_OFFLINE')) {
          setBackendOffline(true);
          setOfflineMessage('Backend health check failed. Please verify API on port 8000.');
          setLoading(false);
          return;
        }
      }

      // Load subscription status
      const subResponse = await api.get('/api/v1/affiliate/subscription/status') as AffiliateSubscription;
      setSubscription(subResponse);
      currentSubscription = subResponse as AffiliateSubscription;
    } catch (error: unknown) {
      // If no subscription found, attempt auto-activation from prior server purchase
      try {
        if (error instanceof Error && error.message.startsWith('BACKEND_OFFLINE')) {
          setBackendOffline(true);
          setOfflineMessage('Backend connection failed. Please ensure the API is running on port 8000.');
          setLoading(false);
          return;
        }
        const activateResp = await api.post('/api/v1/affiliate/subscription/activate-from-server');
        const isSubObj = (x: unknown): x is { subscription: AffiliateSubscription } => {
          return typeof x === 'object' && x !== null && 'subscription' in (x as Record<string, unknown>);
        };
        const activated: AffiliateSubscription = isSubObj(activateResp)
          ? activateResp.subscription
          : (activateResp as AffiliateSubscription);
        if (activated && (activated.is_active || activated.status === 'active')) {
          setSubscription(activated);
          setShowSubscriptionModal(false);
          currentSubscription = activated;
          setAutoActivated(true);
        } else {
          // Fall back to subscription modal
          console.log('No subscription found, showing modal');
          setShowSubscriptionModal(true);
        }
      } catch (e: unknown) {
        // Differentiate activation failure reasons
        if (e instanceof Error) {
          if (e.message.startsWith('BACKEND_OFFLINE')) {
            setBackendOffline(true);
            setOfflineMessage('Backend connection failed during activation.');
            setLoading(false);
            return;
          }
          // Activation endpoint responded but no server purchase met criteria
          if (e.message.includes('No completed server purchase')) {
            setShowSubscriptionModal(true);
          } else {
            setShowSubscriptionModal(true);
          }
        } else {
          setShowSubscriptionModal(true);
        }
      }
    }

    try {
      // Load stats (only if subscribed)
      if (currentSubscription) {
        const statsResponse = await api.get('/api/v1/affiliate/stats') as AffiliateStats;
        setStats(statsResponse);

        // Load team members
        const teamResponse = await api.get('/api/v1/affiliate/team/members') as TeamMember[];
        setTeamMembers(teamResponse);

  // Load commissions
  const commissionsResponse = await api.get('/api/v1/affiliate/commissions?limit=50') as Commission[];
  setCommissions(commissionsResponse);

        // Load commission rules dynamically (server product_type)
        setRulesLoading(true);
        try {
          const rules = await getCommissionRules('server');
          setCommissionRules(rules);
        } catch (e) {
          console.warn('Failed to load commission rules', e);
        } finally {
          setRulesLoading(false);
        }

        // Adapter-based stats fallback + earnings + payouts
        try {
          const mapped = await getReferralStats();
          if (mapped) {
            setLegacyStats({
              referral_code: mapped.referral_code || '',
              total_referrals: mapped.total_referrals || 0,
              l1_referrals: mapped.l1_referrals || 0,
              l2_referrals: mapped.l2_referrals || 0,
              l3_referrals: mapped.l3_referrals || 0,
              total_earnings: mapped.total_earnings || 0,
              available_balance: mapped.available_balance || 0,
              total_withdrawn: mapped.total_withdrawn || 0
            });
          }
  } catch (statsErr) { console.warn('Referral stats adapter failed', statsErr); }
        try {
          const earn = await getReferralEarnings();
          setEarnings((earn as AdapterReferralEarning[]).map(e => ({ ...e, id: e.id as string | number })));
        } catch (earnErr) { console.warn('Referral earnings fetch failed', earnErr); }
        try {
          const ph = await getReferralPayouts();
          setPayouts((ph as AdapterReferralPayout[]).map(p => ({ ...p, id: p.id as string | number })));
        } catch (payoutErr) { console.warn('Referral payouts fetch failed', payoutErr); }
      }
    } catch {
      console.log('Stats/Team/Commissions loading skipped - no subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      // Create payment order for ₹499 subscription
      const paymentOrderResponse = await api.post('/api/v1/payments/create-order', {
        payment_type: 'subscription'
      }) as any;

      if (!paymentOrderResponse?.success) {
        throw new Error('Failed to create payment order');
      }

      const { payment } = paymentOrderResponse;

      // Ensure Razorpay loaded
      if (!razorpayLoaded || !(window as any).Razorpay) {
        alert('Payment system is loading. Please try again in a moment.');
        return;
      }

      const options = {
        key: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID,
        amount: payment.total_amount * 100, // paise
        currency: payment.currency || 'INR',
        name: 'BIDUA Hosting',
        description: 'Affiliate Premium Subscription (₹499)',
        order_id: payment.razorpay_order_id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResponse = await api.post('/api/v1/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }) as any;

            if (!verificationResponse?.success) {
              throw new Error('Payment verification failed');
            }

            // Show success message
            const welcomeMessage = verificationResponse.affiliate?.message || 
              '🎉 Payment successful! Welcome to BIDUA Hosting Affiliate Program!';
            
            // Store success state in sessionStorage to show welcome banner
            sessionStorage.setItem('affiliate_just_activated', 'true');
            sessionStorage.setItem('affiliate_welcome_message', welcomeMessage);
            
            // Reload the page to show the affiliate dashboard
            window.location.reload();
          } catch (err: any) {
            console.error('Payment verification/subscription error:', err);
            const errorMsg = err?.message || 'Payment verification failed';
            alert(`❌ ${errorMsg}\n\nPlease contact support if the payment was deducted.`);
          }
        },
        modal: {
          ondismiss: () => {
            // User cancelled payment
            console.log('Subscription payment cancelled by user');
          }
        },
        theme: { color: '#06b6d4' }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', (resp: any) => {
        console.error('Payment failed:', resp?.error);
        alert(resp?.error?.description || 'Payment failed');
      });
      razorpay.open();
    } catch (error: any) {
      console.error('Subscription initiation failed:', error);
      alert(error?.message || 'Failed to initiate payment');
    }
  };

  const copyReferralLink = () => {
    const code = stats?.referral_code || legacyStats?.referral_code;
    if (code) {
      const link = `${window.location.origin}/signup?ref=${code}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const requestPayout = async () => {
    if (!stats || stats.available_balance < 500) {
      alert('Minimum payout amount is ₹500');
      return;
    }

    try {
      await api.post('/api/v1/affiliate/payouts/request', {
        amount: stats.available_balance,
        payment_method: 'bank_transfer',
        payment_details: JSON.stringify({ account: 'Your bank details' }),
        notes: 'Payout request'
      });
      alert('Payout request submitted successfully!');
      loadData();
    } catch (error) {
      console.error('Payout request failed:', error);
      alert('Failed to request payout. Please try again.');
    }
  };

  const filterTeamByLevel = (level: number | null) => {
    setSelectedLevel(level);
  };

  const filteredTeam = selectedLevel 
    ? teamMembers.filter(m => m.level === selectedLevel)
    : teamMembers;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading affiliate dashboard...</div>
      </div>
    );
  }

  if (backendOffline) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center space-y-3 max-w-md">
          <div className="text-red-400 font-semibold text-lg">Backend Unreachable</div>
          <div className="text-slate-300 text-sm">{offlineMessage || 'Health check + fallback host failed.'}</div>
          <ul className="text-xs text-slate-400 space-y-1 text-left mx-auto list-disc list-inside">
            <li>Confirm uvicorn running on port 8000</li>
            <li>Check no firewall/VPN blocks localhost</li>
            <li>Verify VITE_API_URL env var (currently defaulting to localhost)</li>
          </ul>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold"
          >Retry</button>
        </div>
      </div>
    );
  }

  // Show Landing Page for Non-Subscribers
  if (showSubscriptionModal && !subscription) {
    return (
      <ReferralLandingPage
        onSubscribe={handleSubscribe}
        onBuyServer={() => window.location.href = '/dashboard/servers'}
      />
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto pb-6">
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Welcome Banner - Show after successful activation */}
        {showWelcomeBanner && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 sm:p-6 border-2 border-green-400 shadow-xl animate-pulse">
            <div className="flex items-start gap-4">
              <Award className="h-8 w-8 sm:h-12 sm:w-12 text-white flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Welcome to the Affiliate Program! 🎉
                </h3>
                <p className="text-white/90 mb-3 text-sm sm:text-base">
                  {welcomeMessage}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-white/80">
                  <span>✅ Your referral code is ready</span>
                  <span className="hidden sm:inline">•</span>
                  <span>✅ Start sharing and earning today</span>
                  <span className="hidden sm:inline">•</span>
                  <span>✅ Track all earnings in real-time</span>
                </div>
              </div>
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="text-white/80 hover:text-white transition flex-shrink-0"
              >
                <Check className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Affiliate Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-400">Manage your affiliate program and track your earnings</p>
        </div>

        {/* Subscription Status Banner */}
        {subscription && (
          <div className={`rounded-xl p-4 sm:p-6 border-2 ${
            subscription.subscription_type === 'free_with_server' 
              ? 'bg-gradient-to-r from-cyan-900/50 to-teal-900/50 border-cyan-500'
              : 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500'
          }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 flex-shrink-0" />
              <div>
                <h3 className="text-white font-bold text-sm sm:text-base">
                  {subscription.subscription_type === 'free_with_server' 
                    ? 'Free Lifetime Affiliate (Server Purchase)' 
                    : 'Lifetime Affiliate Member'}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Activated on {new Date(subscription.activated_at).toLocaleDateString()}
                </p>
                {profile?.referred_by && (
                  <p className="text-cyan-300 text-xs mt-1">Sponsor ID: {profile.referred_by}</p>
                )}
                {autoActivated && (
                  <p className="text-green-400 text-xs mt-1">Automatically activated from your server purchase 🎉</p>
                )}
              </div>
            </div>
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Referral Code Card */}
      <div className="bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl shadow-lg p-4 sm:p-6 border-2 border-cyan-400">
        <div className="flex items-center space-x-3 mb-4">
          <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-white flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Your Referral Code</h3>
            <p className="text-xs sm:text-sm text-cyan-100">Share this code to start earning</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4">
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-wider text-center">
            {stats?.referral_code || legacyStats?.referral_code || 'Loading...'}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            readOnly
            value={`${window.location.origin}/signup?ref=${stats?.referral_code || legacyStats?.referral_code || ''}`}
            className="flex-1 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-xs sm:text-sm truncate min-w-0"
          />
          <button
            onClick={copyReferralLink}
            className="px-3 sm:px-4 py-2 bg-white text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition flex items-center justify-center space-x-2 text-sm sm:text-base whitespace-nowrap"
          >
            {copied ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <Copy className="h-4 w-4 sm:h-5 sm:w-5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 rounded-xl p-4 sm:p-6 border-2 border-cyan-500">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats?.total_referrals || legacyStats?.total_referrals || 0}</div>
          <div className="text-xs sm:text-sm text-slate-400 mb-3">Total Referrals</div>
          <div className="flex justify-between text-xs pt-3 border-t border-cyan-500/30">
            <span className="text-slate-400">L1: {stats?.total_referrals_level1 || legacyStats?.l1_referrals || 0}</span>
            <span className="text-slate-400">L2: {stats?.total_referrals_level2 || legacyStats?.l2_referrals || 0}</span>
            <span className="text-slate-400">L3: {stats?.total_referrals_level3 || legacyStats?.l3_referrals || 0}</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 sm:p-6 border-2 border-green-500">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            ₹{stats?.total_commission_earned?.toLocaleString() || legacyStats?.total_earnings?.toLocaleString() || 0}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">Total Earned</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 sm:p-6 border-2 border-cyan-500">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            ₹{stats?.available_balance?.toLocaleString() || legacyStats?.available_balance?.toLocaleString() || 0}
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mb-2">Available Balance</div>
          {stats?.can_request_payout && (
            <button
              onClick={requestPayout}
              className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition"
            >
              Request Payout
            </button>
          )}
        </div>

        <div className="bg-slate-900 rounded-xl p-4 sm:p-6 border-2 border-blue-500">
          <div className="flex items-center justify-between mb-3">
            <Download className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            ₹{stats?.total_payout_amount?.toLocaleString() || legacyStats?.total_withdrawn?.toLocaleString() || 0}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">Total Withdrawn</div>
          <div className="text-xs text-slate-500 mt-2">{stats?.total_payouts || 0} payouts</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 rounded-xl border-2 border-cyan-500 overflow-hidden">
        <div className="border-b border-cyan-500/30 overflow-x-auto">
          <div className="flex space-x-1 p-1 min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'team', label: 'My Team', icon: Users },
              { id: 'commissions', label: 'Commissions', icon: DollarSign },
              { id: 'earnings', label: 'Earnings', icon: TrendingUp },
              { id: 'payouts', label: 'Payouts', icon: Download }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Commission Structure (Dynamic)</h3>
                {rulesLoading && (
                  <div className="text-xs text-slate-400 mb-2">Loading commission rules...</div>
                )}
                {!rulesLoading && commissionRules.length === 0 && (
                  <div className="text-xs text-slate-500 mb-4">No active commission rules found. Default percentages may apply.</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {[1,2,3].map(level => {
                    const rulesForLevel = commissionRules.filter(r => r.level === level);
                    return (
                      <div key={level} className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-cyan-500/30">
                        <h4 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">Level {level}</h4>
                        {rulesForLevel.length === 0 && (
                          <div className="text-xs text-slate-500">No rule configured.</div>
                        )}
                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                          {rulesForLevel.map(rule => (
                            <div key={rule.id} className="flex justify-between">
                              <span className="text-slate-400 truncate" title={rule.description || rule.name}>{rule.name}</span>
                              <span className="text-green-400 font-bold">
                                {rule.type === 'percentage' ? `${rule.value}%` : `₹${rule.value}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Payout Information</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Minimum payout: ₹500</li>
                  <li>• Payouts processed within 7-10 business days</li>
                  <li>• Commissions approved automatically for verified orders</li>
                  <li>• Track all earnings in real-time</li>
                </ul>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <button
                  onClick={() => filterTeamByLevel(null)}
                  className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                    selectedLevel === null
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All Levels ({teamMembers.length})
                </button>
                <button
                  onClick={() => filterTeamByLevel(1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                    selectedLevel === 1
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Level 1 ({stats?.total_referrals_level1 || 0})
                </button>
                <button
                  onClick={() => filterTeamByLevel(2)}
                  className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                    selectedLevel === 2
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Level 2 ({stats?.total_referrals_level2 || 0})
                </button>
                <button
                  onClick={() => filterTeamByLevel(3)}
                  className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                    selectedLevel === 3
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Level 3 ({stats?.total_referrals_level3 || 0})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Member</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Level</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Joined</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Purchases</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Commission</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Servers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeam.map(member => (
                      <tr key={member.user_id} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="text-white font-medium">{member.full_name}</div>
                            <div className="text-slate-400 text-sm">{member.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            member.level === 1 ? 'bg-cyan-500/20 text-cyan-400' :
                            member.level === 2 ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            L{member.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-sm">
                          {new Date(member.joined_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-white font-medium">₹{member.total_purchases.toLocaleString()}</div>
                          {member.has_purchased && (
                            <div className="text-green-400 text-xs">✓ Active</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-green-400 font-bold">
                          ₹{member.total_commission.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {member.active_servers}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTeam.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No team members yet. Start referring to build your team!</p>
                </div>
              )}
            </div>
          )}

          {/* Commissions Tab */}
          {activeTab === 'commissions' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">From</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Level</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Order Amount</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Rate</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Commission</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map(comm => (
                      <tr key={comm.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="py-3 px-4 text-slate-300 text-sm">
                          {new Date(comm.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-sm">
                          {comm.referred_user_email || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400">
                            L{comm.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white">
                          ₹{comm.order_amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {comm.commission_rate}%
                        </td>
                        <td className="py-3 px-4 text-green-400 font-bold">
                          ₹{comm.commission_amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            comm.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                            comm.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {comm.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {commissions.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No commissions yet. Commissions will appear here when your referrals make purchases.</p>
                </div>
              )}
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-4">
              {earnings.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No earnings yet. When your referrals generate commissions, they will appear here.</p>
                </div>
              )}
              {earnings.map(e => (
                <div key={String(e.id)} className="bg-slate-800 rounded-lg p-4 border border-cyan-500/30">
                  <div className="flex justify-between mb-2">
                    <div>
                      <div className="text-white font-semibold">Level {e.level} Commission</div>
                      <div className="text-xs text-slate-400">{new Date(e.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">+{formatCurrency(e.commission_amount)}</div>
                      <div className="text-xs text-slate-500">Order: {formatCurrency(e.order_amount)}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-xs">
                    <span className="text-slate-400">Rate: {e.commission_percentage}%</span>
                    {e.is_recurring && (
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">Recurring</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              {stats?.can_request_payout && (
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 border-2 border-green-400">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">Ready for Payout!</h3>
                      <p className="text-green-100 mb-3">
                        You have {formatCurrency((stats?.available_balance || legacyStats?.available_balance || 0))} available for withdrawal
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs text-green-100">
                        <div>TDS (10%): {formatCurrency((stats?.available_balance || legacyStats?.available_balance || 0) * 0.10)}</div>
                        <div>GST (18%): {formatCurrency((stats?.available_balance || legacyStats?.available_balance || 0) * 0.18)}</div>
                        <div className="font-semibold">Net: {formatCurrency((stats?.available_balance || legacyStats?.available_balance || 0) * 0.72)}</div>
                      </div>
                    </div>
                    <button
                      onClick={requestPayout}
                      className="px-5 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
                    >
                      Request Payout
                    </button>
                  </div>
                </div>
              )}
              {payouts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No payout requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payouts.map(p => (
                    <div key={String(p.id)} className="bg-slate-800 rounded-lg p-5 border border-cyan-500/30">
                      <div className="flex justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">Payout #{p.payout_number}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}>{p.status.replace('_',' ')}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">Requested: {new Date(p.requested_at).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">{formatCurrency(p.net_amount)}</div>
                          <div className="text-xs text-slate-500">Net Amount</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-900 rounded p-2">
                          <div className="text-slate-400 mb-1">Gross</div>
                          <div className="text-white font-semibold">{formatCurrency(p.gross_amount)}</div>
                        </div>
                        <div className="bg-slate-900 rounded p-2">
                          <div className="text-slate-400 mb-1">TDS</div>
                          <div className="text-white">{formatCurrency(p.tds_amount)}</div>
                        </div>
                        <div className="bg-slate-900 rounded p-2">
                          <div className="text-slate-400 mb-1">GST</div>
                          <div className="text-white">{formatCurrency(p.service_tax_amount)}</div>
                        </div>
                        <div className="bg-slate-900 rounded p-2">
                          <div className="text-slate-400 mb-1">Method</div>
                          <div className="text-white capitalize">{p.payment_method.replace('_',' ')}</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mt-3">
                        <span className="text-slate-400">Tax Period: {p.tax_year} Q{p.tax_quarter}</span>
                        {p.payment_reference && (
                          <span className="text-green-400 font-mono">Ref: {p.payment_reference}</span>
                        )}
                      </div>
                      {p.rejected_reason && (
                        <div className="mt-3 text-xs text-red-400">Rejected: {p.rejected_reason}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
