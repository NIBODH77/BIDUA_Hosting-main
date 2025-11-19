import { supabase } from './supabase';
import { ReferralStats, ReferralEarning, ReferralPayout, PaymentMethod } from '../types';

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
    under_review: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
    paid: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  };
  return colors[status] || 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
};

export const getReferralStats = async (): Promise<ReferralStats | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users_profiles')
    .select('referral_code, total_referrals, l1_referrals, l2_referrals, l3_referrals, total_earnings, available_balance, total_withdrawn')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching referral stats:', error);
    return null;
  }

  return {
    referral_code: data.referral_code,
    total_referrals: data.total_referrals || 0,
    l1_referrals: data.l1_referrals || 0,
    l2_referrals: data.l2_referrals || 0,
    l3_referrals: data.l3_referrals || 0,
    total_earnings: data.total_earnings || 0,
    available_balance: data.available_balance || 0,
    total_withdrawn: data.total_withdrawn || 0,
    can_request_payout: (data.available_balance || 0) >= 500,
  };
};

export const getReferralEarnings = async (): Promise<ReferralEarning[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('referral_earnings')
    .select(`
      *,
      referral_user:users_profiles!referral_earnings_referral_user_id_fkey(id, full_name, referral_code),
      order:orders(id, order_number, amount)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching referral earnings:', error);
    return [];
  }

  return data as ReferralEarning[];
};

export const getReferralPayouts = async (): Promise<ReferralPayout[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('referral_payouts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching referral payouts:', error);
    return [];
  }

  return data as ReferralPayout[];
};

export const requestPayout = async (
  amount: number,
  paymentMethod: PaymentMethod,
  paymentDetails: {
    bank_account_details?: {
      account_holder: string;
      account_number: string;
      ifsc_code: string;
      bank_name: string;
    };
    upi_id?: string;
    paypal_email?: string;
  }
): Promise<{ success: boolean; error?: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'User not authenticated' };

  const { data, error } = await supabase.rpc('request_referral_payout', {
    p_amount: amount,
    p_payment_method: paymentMethod,
    p_bank_account_details: paymentDetails.bank_account_details || null,
    p_upi_id: paymentDetails.upi_id || null,
    p_paypal_email: paymentDetails.paypal_email || null,
  });

  if (error) {
    console.error('Error requesting payout:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const adminApprovePayout = async (
  payoutId: string,
  paymentReference: string
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase.rpc('admin_approve_payout', {
    p_payout_id: payoutId,
    p_payment_reference: paymentReference,
  });

  if (error) {
    console.error('Error approving payout:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const adminRejectPayout = async (
  payoutId: string,
  rejectedReason: string
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase.rpc('admin_reject_payout', {
    p_payout_id: payoutId,
    p_rejected_reason: rejectedReason,
  });

  if (error) {
    console.error('Error rejecting payout:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};
