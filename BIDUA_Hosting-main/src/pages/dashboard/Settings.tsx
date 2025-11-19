import { useState, useEffect, useMemo } from 'react';
import { User, Lock, Bell, Shield, Mail, CreditCard, MapPin, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { BillingSettings, BillingFormData } from '../../types/billing';
import { useCountryOptions } from '../../hooks/useCountryOptions';

export function Settings() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [inviter, setInviter] = useState<{ code: string; name: string } | null>(null);

  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    phone: '',
    company: '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    serverAlerts: true,
    billingAlerts: true,
      maintenanceAlerts: true,
      marketingEmails: false,
    });

    const [billingData, setBillingData] = useState({
      // Billing Address
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      // Company Info
      companyName: '',
      taxId: '',
      // Contact
      billingEmail: '',
      billingPhone: '',
      // Preferences
      autoRenewal: true,
      billingAlerts: true,
      invoiceDelivery: 'email',
    });
    const { countries, loading: loadingCountries } = useCountryOptions();
    const billingCountryLabel = useMemo(() => {
      const normalized = (billingData.country || '').toLowerCase();
      const countryMatch = countries.find(country => {
        const code = country.code?.toLowerCase();
        return (
          country.value.toLowerCase() === normalized ||
          country.label.toLowerCase() === normalized ||
          (code && code === normalized)
        );
      });
      return countryMatch?.value || billingData.country;
    }, [countries, billingData.country]);
    const billingCurrencyCode = useMemo(() => {
      if (!billingCountryLabel) return 'INR';
      return countries.find(country => country.value === billingCountryLabel)?.currency || 'INR';
    }, [countries, billingCountryLabel]);

  // Fetch inviter info if user was referred
  useEffect(() => {
    const fetchInviter = async () => {
      if (profile?.referred_by) {
        try {
          // Use the new /auth/me/inviter endpoint that doesn't require admin access
          const response = await api.get('/api/v1/auth/me/inviter') as any;
          if (response?.inviter) {
            setInviter({
              code: response.inviter.referral_code || '',
              name: response.inviter.full_name || response.inviter.email || 'Unknown',
            });
          } else {
            setInviter(null);
          }
        } catch (error) {
          console.error('Failed to fetch inviter info:', error);
          setInviter(null);
        }
      } else {
        setInviter(null);
      }
    };
    fetchInviter();
  }, [profile?.referred_by]);  // Load billing settings on component mount
  useEffect(() => {
    const loadBillingSettings = async () => {
      try {
        const settings = await api.getBillingSettings() as BillingSettings;
        if (settings) {
          setBillingData({
            street: settings.street || '',
            city: settings.city || '',
            state: settings.state || '',
            country: settings.country || '',
            postalCode: settings.postal_code || '',
            companyName: settings.company_name || '',
            taxId: settings.tax_id || '',
            billingEmail: settings.billing_email || '',
            billingPhone: settings.billing_phone || '',
            autoRenewal: settings.auto_renewal ?? true,
            billingAlerts: settings.billing_alerts ?? true,
            invoiceDelivery: settings.invoice_delivery || 'email',
          });
        }
      } catch (error) {
        console.error('Failed to load billing settings:', error);
      }
    };

    if (activeTab === 'billing') {
      loadBillingSettings();
    }
  }, [activeTab]);  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // TODO: Add actual API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccessMessage('Your profile has been updated successfully');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (securityData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    setIsSaving(true);
    
    try {
      await api.changePassword(securityData.currentPassword, securityData.newPassword);
      
      // Show success message
      setSuccessMessage('Your password has been updated successfully');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Failed to update password:', error);
      const errorMessage = error?.message || 'Failed to update password. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // TODO: Add actual API call to update notification preferences
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccessMessage('Your notification preferences have been saved');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Failed to update notifications:', error);
      alert('Failed to update notification preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Transform frontend data to backend format
      const apiData = {
        street: billingData.street,
        city: billingData.city,
        state: billingData.state,
        country: billingData.country,
        postal_code: billingData.postalCode,
        company_name: billingData.companyName,
        tax_id: billingData.taxId,
        billing_email: billingData.billingEmail,
        billing_phone: billingData.billingPhone,
        auto_renewal: billingData.autoRenewal,
        billing_alerts: billingData.billingAlerts,
        invoice_delivery: billingData.invoiceDelivery,
      };
      
      await api.updateBillingSettings(apiData);
      
      // Show success message
      setSuccessMessage('Your billing information has been saved');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      console.log('Billing settings updated successfully');
    } catch (error) {
      console.error('Failed to update billing settings:', error);
      alert('Failed to save billing information. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 border border-green-400">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm text-green-50">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account settings and preferences</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 overflow-hidden">
        <div className="border-b border-cyan-500/30">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition ${
                activeTab === 'profile'
                  ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition ${
                activeTab === 'security'
                  ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition ${
                activeTab === 'notifications'
                  ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition ${
                activeTab === 'billing'
                  ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-950'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center space-x-4 pb-6 border-b border-cyan-500/30">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{profile?.full_name}</h3>
                  <p className="text-sm text-slate-400 capitalize">{profile?.role?.replace('_', ' ')}</p>
                  {inviter && (
                    <div className="mt-2 text-xs text-cyan-300 bg-cyan-900/30 rounded px-3 py-1 inline-block">
                      <span className="font-semibold">Invited by:</span> {inviter.name} <span className="text-cyan-400">({inviter.code})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                    title="Email cannot be changed. Contact support if you need to update your email."
                  />
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                </div>

                {inviter && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Invited By
                    </label>
                    <div className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-lg text-slate-300 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-cyan-300">{inviter.name}</span>
                        <span className="text-slate-500 mx-2">•</span>
                        <span className="text-slate-400">Referral Code: </span>
                        <span className="font-mono text-cyan-400">{inviter.code}</span>
                      </div>
                      <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-400 font-semibold">
                        Referred User
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-cyan-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-400 mb-1">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-400 mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-semibold hover:bg-cyan-500/30 transition">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-200 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-200 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-200 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">Email Notifications</p>
                        <p className="text-xs text-slate-400">Receive notifications via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })
                      }
                      className="w-5 h-5 text-cyan-500 border-cyan-500/30 rounded focus:ring-cyan-500 bg-slate-800"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">Server Alerts</p>
                        <p className="text-xs text-slate-400">Get notified about server status changes</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.serverAlerts}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, serverAlerts: e.target.checked })
                      }
                      className="w-5 h-5 text-cyan-500 border-cyan-500/30 rounded focus:ring-cyan-500 bg-slate-800"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">Billing Alerts</p>
                        <p className="text-xs text-slate-400">Get notified about billing and payments</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.billingAlerts}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, billingAlerts: e.target.checked })
                      }
                      className="w-5 h-5 text-cyan-500 border-cyan-500/30 rounded focus:ring-cyan-500 bg-slate-800"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">Maintenance Alerts</p>
                        <p className="text-xs text-slate-400">Get notified about scheduled maintenance</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.maintenanceAlerts}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, maintenanceAlerts: e.target.checked })
                      }
                      className="w-5 h-5 text-cyan-500 border-cyan-500/30 rounded focus:ring-cyan-500 bg-slate-800"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">Marketing Emails</p>
                        <p className="text-xs text-slate-400">Receive updates about new features and offers</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, marketingEmails: e.target.checked })
                      }
                      className="w-5 h-5 text-cyan-500 border-cyan-500/30 rounded focus:ring-cyan-500 bg-slate-800"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'billing' && (
            <form onSubmit={handleBillingSubmit} className="space-y-6">
              {/* Billing Address Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  <span>Billing Address</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={billingData.street}
                      onChange={(e) => setBillingData({ ...billingData, street: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Country
                    </label>
                    <select
                      value={billingCountryLabel || billingData.country}
                      onChange={(e) => setBillingData({ ...billingData, country: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      disabled={loadingCountries}
                    >
                      {loadingCountries ? (
                        <option value="">Loading countries...</option>
                      ) : (
                        countries.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))
                      )}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">Preferred currency: {billingCurrencyCode}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={billingData.state}
                      onChange={(e) => setBillingData({ ...billingData, state: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="Maharashtra"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={billingData.city}
                      onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={billingData.postalCode}
                      onChange={(e) => setBillingData({ ...billingData, postalCode: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-cyan-400" />
                  <span>Company Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={billingData.companyName}
                      onChange={(e) => setBillingData({ ...billingData, companyName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="ACME Corporation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Tax ID/GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={billingData.taxId}
                      onChange={(e) => setBillingData({ ...billingData, taxId: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <span>Billing Contact</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Billing Email
                    </label>
                    <input
                      type="email"
                      value={billingData.billingEmail}
                      onChange={(e) => setBillingData({ ...billingData, billingEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="billing@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Billing Phone
                    </label>
                    <input
                      type="tel"
                      value={billingData.billingPhone}
                      onChange={(e) => setBillingData({ ...billingData, billingPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Billing Preferences</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">Auto-renewal</p>
                        <p className="text-xs text-slate-400">Automatically renew subscriptions</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={billingData.autoRenewal}
                      onChange={(e) => setBillingData({ ...billingData, autoRenewal: e.target.checked })}
                      className="w-5 h-5 text-cyan-500 border-cyan-500/30 rounded focus:ring-cyan-500 bg-slate-800"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">Billing Alerts</p>
                        <p className="text-xs text-slate-400">Receive billing and payment notifications</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={billingData.billingAlerts}
                      onChange={(e) => setBillingData({ ...billingData, billingAlerts: e.target.checked })}
                      className="w-5 h-5 text-cyan-500 border-cyan-500/30 rounded focus:ring-cyan-500 bg-slate-800"
                    />
                  </label>

                  <div className="p-4 bg-slate-950 rounded-lg border border-cyan-500/30">
                    <label className="block text-sm font-semibold text-slate-200 mb-3">
                      Invoice Delivery Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="invoiceDelivery"
                          value="email"
                          checked={billingData.invoiceDelivery === 'email'}
                          onChange={(e) => setBillingData({ ...billingData, invoiceDelivery: e.target.value })}
                          className="w-4 h-4 text-cyan-500 border-cyan-500/30 focus:ring-cyan-500 bg-slate-800"
                        />
                        <span className="text-sm text-slate-300">Email (Recommended)</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="invoiceDelivery"
                          value="dashboard"
                          checked={billingData.invoiceDelivery === 'dashboard'}
                          onChange={(e) => setBillingData({ ...billingData, invoiceDelivery: e.target.value })}
                          className="w-4 h-4 text-cyan-500 border-cyan-500/30 focus:ring-cyan-500 bg-slate-800"
                        />
                        <span className="text-sm text-slate-300">Dashboard Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-cyan-500/30">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Billing Information'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
