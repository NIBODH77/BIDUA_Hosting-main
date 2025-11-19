// Referral library: implements adapter between backend affiliate endpoints and legacy Referral* types
import { api } from './api';
import type { ReferralStats, ReferralEarning, ReferralPayout, PayoutStatus, PaymentMethod } from '../types';

// Backend schema shapes (partial) for typing without importing backend code
interface AffiliateStatsResponse {
  total_referrals_level1: number;
  total_referrals_level2: number;
  total_referrals_level3: number;
  total_referrals: number;
  active_referrals_level1: number;
  active_referrals_level2: number;
  active_referrals_level3: number;
  active_referrals: number;
  total_commission_earned: number | string;
  pending_commission: number | string;
  approved_commission: number | string;
  paid_commission: number | string;
  available_balance: number | string;
  total_payouts: number;
  total_payout_amount: number | string;
  subscription_type?: string;
  subscription_status?: string;
  referral_code?: string;
  is_active: boolean;
  can_request_payout: boolean;
}

interface CommissionDetailResponse {
  id: number;
  affiliate_user_id: number;
  level: number;
  order_id?: number;
  order_amount: number | string;
  commission_rate: number | string; // percentage value
  commission_amount: number | string;
  status: string;
  approved_at?: string;
  paid_at?: string;
  created_at: string;
  referred_user_email?: string;
  order_description?: string;
}

interface PayoutResponseBackend {
  id: number;
  affiliate_user_id: number;
  amount: number | string;
  currency: string;
  payment_method: string;
  status: string; // backend enum values: pending, processing, completed, failed, cancelled
  requested_at: string;
  processed_at?: string;
  transaction_id?: string;
  notes?: string;
  admin_notes?: string;
}

interface CommissionRuleResponseBackend {
  id: number;
  name: string;
  description?: string;
  level: number;
  product_type?: string;
  commission_type: string; // 'percentage' | 'fixed'
  commission_value: number | string; // numeric value
  is_active: boolean;
}

// Utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    requested: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    under_review: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    processing: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
    completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
    failed: 'bg-red-500/20 text-red-400 border border-red-500/30',
    cancelled: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
    paid: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  };
  return colors[status] || 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
};

// Adapter: AffiliateStatsResponse -> ReferralStats (legacy interface)
export const getReferralStats = async (): Promise<ReferralStats | null> => {
  try {
    const raw = await api.get<AffiliateStatsResponse>('/api/v1/affiliate/stats');
    if (!raw) return null;
    const toNumber = (v: number | string | undefined | null): number => {
      if (v === undefined || v === null) return 0;
      if (typeof v === 'number') return v;
      const parsed = parseFloat(v);
      return isNaN(parsed) ? 0 : parsed;
    };
    const stats: ReferralStats = {
      referral_code: raw.referral_code || '',
      total_referrals: raw.total_referrals || 0,
      l1_referrals: raw.total_referrals_level1 || 0,
      l2_referrals: raw.total_referrals_level2 || 0,
      l3_referrals: raw.total_referrals_level3 || 0,
      total_earnings: toNumber(raw.total_commission_earned),
      available_balance: toNumber(raw.available_balance),
      total_withdrawn: toNumber(raw.total_payout_amount),
      can_request_payout: raw.can_request_payout,
    };
    return stats;
  } catch (error) {
    // Gracefully propagate offline detection; return null otherwise
    if (error instanceof Error && error.message.startsWith('BACKEND_OFFLINE')) {
      throw error; // upstream can choose to show offline banner
    }
    console.warn('getReferralStats failed:', error);
    return null;
  }
};

// Adapter: CommissionDetailResponse[] -> ReferralEarning[]
export const getReferralEarnings = async (): Promise<ReferralEarning[]> => {
  try {
    const data = await api.get<CommissionDetailResponse[]>('/api/v1/affiliate/commissions?limit=100');
    return (data || []).map(c => {
      const toNumber = (v: number | string | undefined | null): number => {
        if (v === undefined || v === null) return 0;
        if (typeof v === 'number') return v;
        const parsed = parseFloat(v);
        return isNaN(parsed) ? 0 : parsed;
      };
      return {
        id: String(c.id),
        user_id: String(c.affiliate_user_id),
        referral_user_id: c.referred_user_email || '', // email shown; backend lacks direct user id reference here
        order_id: c.order_id ? String(c.order_id) : '',
        level: (c.level === 1 || c.level === 2 || c.level === 3 ? c.level : 1),
        commission_percentage: toNumber(c.commission_rate),
        order_amount: toNumber(c.order_amount),
        commission_amount: toNumber(c.commission_amount),
        is_recurring: false, // backend does not expose recurring flag yet
        created_at: c.created_at,
        referral_user: undefined,
        order: undefined,
      } as ReferralEarning;
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('BACKEND_OFFLINE')) {
      throw error;
    }
    console.warn('getReferralEarnings failed:', error);
    return [];
  }
};

// Adapter: PayoutResponse[] -> ReferralPayout[]
export const getReferralPayouts = async (): Promise<ReferralPayout[]> => {
  try {
    const data = await api.get<PayoutResponseBackend[]>('/api/v1/affiliate/payouts');
    const mapStatus = (s: string): PayoutStatus => {
      switch (s) {
        case 'pending': return 'requested';
        case 'processing': return 'under_review';
        case 'completed': return 'paid';
        case 'failed': return 'rejected';
        case 'cancelled': return 'rejected';
        default: return 'requested';
      }
    };
    return (data || []).map(p => {
      const amountNum = typeof p.amount === 'number' ? p.amount : parseFloat(String(p.amount));
      return {
        id: String(p.id),
        user_id: String(p.affiliate_user_id),
        payout_number: `PAYOUT-${p.id}`,
        gross_amount: amountNum,
        tds_amount: 0, // backend does not provide tax breakdown yet
        service_tax_amount: 0,
        net_amount: amountNum, // assume gross==net without tax components
        status: mapStatus(p.status),
        payment_method: (p.payment_method as PaymentMethod) || 'bank_transfer',
        requested_at: p.requested_at,
        processed_at: p.processed_at || undefined,
        tax_year: new Date(p.requested_at).getFullYear(),
        tax_quarter: Math.floor(new Date(p.requested_at).getMonth() / 3) + 1,
        created_at: p.requested_at,
      } as ReferralPayout;
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('BACKEND_OFFLINE')) {
      throw error;
    }
    console.warn('getReferralPayouts failed:', error);
    return [];
  }
};

// Create payout request
export const requestPayout = async (amount: number, method: PaymentMethod, details: Record<string, unknown>, notes?: string) => {
  try {
    const payload = {
      amount,
      payment_method: method,
      payment_details: JSON.stringify(details),
      notes: notes || undefined,
    };
    const response = await api.post('/api/v1/affiliate/payouts/request', payload);
    return { success: true, response };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('BACKEND_OFFLINE')) {
      return { success: false, offline: true, error: error.message };
    }
    return { success: false, error: (error as Error).message };
  }
};

// Fetch commission rules (optional dynamic percentages)
export const getCommissionRules = async (productType?: string) => {
  try {
    const query = productType ? `?product_type=${encodeURIComponent(productType)}` : '';
    const data = await api.get<CommissionRuleResponseBackend[]>(`/api/v1/affiliate/commission-rules${query}`);
    return (data || []).map(r => ({
      id: r.id,
      level: r.level,
      product_type: r.product_type || 'all',
      type: r.commission_type,
      value: typeof r.commission_value === 'number' ? r.commission_value : parseFloat(String(r.commission_value)),
      name: r.name,
      description: r.description,
    }));
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('BACKEND_OFFLINE')) {
      throw error;
    }
    console.warn('getCommissionRules failed:', error);
    return [];
  }
};

// Admin helpers (placeholders until admin UI integrates proper endpoints)
export const adminApprovePayout = async () => {
  return { success: false, error: 'Admin approve not wired yet' };
};

export const adminRejectPayout = async () => {
  return { success: false, error: 'Admin reject not wired yet' };
};
