import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { BillingSettings } from '../types/billing';
import { useCountryOptions, type CountryOption } from '../hooks/useCountryOptions';
import { useAddons } from '../hooks/useAddons';
import {
  Server, Check, CreditCard, FileText, ChevronRight, ChevronLeft,
  Cpu, MemoryStick, HardDrive, Network, Clock, Shield, 
  User, Mail, Phone, MapPin, Building, Globe, Tag, Percent,
  Lock, Plus, Minus, FileDown, ChevronDown
} from 'lucide-react';

interface ServerConfig {
  planId?: number; // 🆕 Add this line
  planName: string;
  planType: string;
  vcpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  billingCycle: string;
  monthlyPrice: number;
  totalPrice: number;
  discount: number;
  extraStorage?: number;
  extraBandwidth?: number;
  // New configuration options
  operatingSystem?: string;
  datacenter?: string;
  hostname?: string;
  rootPassword?: string;
  additionalIPv4?: number;
  backupService?: boolean;
  managedService?: boolean;
  ddosProtection?: string;
}

interface BillingInfo {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId: string;
  password?: string;
  confirmPassword?: string;
  additionalNotes?: string;
  newsletter?: boolean;
  promotional?: boolean;
}

// Utility functions
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const capitalizeWords = (value: string) =>
  value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const numberToWords = (num: number): string => {
  if (num === 0) return 'zero';
  const belowTwenty = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens = ['','ten','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  const thousands = ['','thousand','million','billion'];

  const helper = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return belowTwenty[n];
    if (n < 100) {
      const tenWord = tens[Math.floor(n / 10)];
      const rest = helper(n % 10);
      return rest ? `${tenWord} ${rest}` : tenWord;
    }
    const hundredWord = `${belowTwenty[Math.floor(n / 100)]} hundred`;
    const remainder = helper(n % 100);
    return remainder ? `${hundredWord} ${remainder}` : hundredWord;
  };

  let i = 0;
  let words = '';
  let value = num;
  while (value > 0) {
    const chunk = value % 1000;
    if (chunk) {
      const chunkWords = `${helper(chunk)}${thousands[i] ? ` ${thousands[i]}` : ''}`.trim();
      words = words ? `${chunkWords} ${words}` : chunkWords;
    }
    value = Math.floor(value / 1000);
    i++;
  }
  return words.trim();
};

const currencyLocaleMap: Record<string, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AUD: 'en-AU',
  CAD: 'en-CA',
  SGD: 'en-SG',
  AED: 'en-AE',
  JPY: 'ja-JP',
  NZD: 'en-NZ'
};

const currencyWordMap: Record<string, { major: string; minor: string }> = {
  INR: { major: 'Rupees', minor: 'Paise' },
  USD: { major: 'US Dollars', minor: 'Cents' },
  EUR: { major: 'Euros', minor: 'Cents' },
  GBP: { major: 'Pounds', minor: 'Pence' },
  AUD: { major: 'Australian Dollars', minor: 'Cents' },
  CAD: { major: 'Canadian Dollars', minor: 'Cents' },
  SGD: { major: 'Singapore Dollars', minor: 'Cents' },
  AED: { major: 'UAE Dirhams', minor: 'Fils' },
  JPY: { major: 'Yen', minor: 'Sen' },
  NZD: { major: 'New Zealand Dollars', minor: 'Cents' }
};

interface CurrencyInfo {
  code: string;
  symbol: string;
  format: (value: number) => string;
}

const matchesCountry = (option: CountryOption, normalizedValue: string) => {
  const target = normalizedValue.toLowerCase();
  return (
    option.value.toLowerCase() === target ||
    option.label.toLowerCase() === target ||
    option.code?.toLowerCase() === target
  );
};

const createCurrencyInfo = (currencyCode: string): CurrencyInfo => {
  const locale = currencyLocaleMap[currencyCode] || 'en-US';
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const symbol = formatter.formatToParts(0).find(part => part.type === 'currency')?.value || currencyCode;
  return {
    code: currencyCode,
    symbol,
    format: (value: number) => formatter.format(Number.isFinite(value) ? value : 0)
  };
};

const defaultCurrencyInfo = createCurrencyInfo('INR');

const getCurrencyInfo = (countryValue: string, countryOptions: CountryOption[]): CurrencyInfo => {
  const normalized = (countryValue || '').toLowerCase();
  const match = countryOptions.find(option => matchesCountry(option, normalized));
  const currencyCode = match?.currency || defaultCurrencyInfo.code;
  return createCurrencyInfo(currencyCode);
};

const amountInWords = (amount: number, currencyCode: string) => {
  const majorAmount = Math.floor(amount);
  const minorAmount = Math.round((amount - majorAmount) * 100);
  const currencyLabels = currencyWordMap[currencyCode] || { major: `${currencyCode} Units`, minor: 'Cents' };
  const majorWords = majorAmount > 0 ? `${currencyLabels.major} ${numberToWords(majorAmount)}` : '';
  const minorWords = minorAmount > 0 ? `${currencyLabels.minor} ${numberToWords(minorAmount)}` : '';
  const combined = [majorWords.trim(), minorWords.trim()].filter(Boolean).join(' and ');
  return combined ? `${combined} only` : `${currencyLabels.major} zero only`;
};

const getCountryLabel = (countryValue: string, countryOptions: CountryOption[]) => {
  const normalized = (countryValue || '').toLowerCase();
  return countryOptions.find(option => matchesCountry(option, normalized))?.label || countryValue;
};

const isCountryIndia = (countryValue: string, countryOptions: CountryOption[]) => {
  const normalized = (countryValue || '').toLowerCase();
  if (normalized === 'india' || normalized === 'in') return true;
  const match = countryOptions.find(option => matchesCountry(option, normalized));
  return match?.label.toLowerCase() === 'india';
};

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const { addons, loading: addonsLoading, getAddonBySlug } = useAddons();
  const [currentStep, setCurrentStep] = useState(1);
  const [serverConfig, setServerConfig] = useState<ServerConfig | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    phone: '',
    company: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    taxId: '',
    password: '',
    confirmPassword: '',
    additionalNotes: '',
    newsletter: false,
    promotional: false
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('specs'); // For mobile accordion
  
  // Countries state
  const { countries, loading: loadingCountries } = useCountryOptions();
  const currencyInfo = useMemo(() => getCurrencyInfo(billingInfo.country, countries), [billingInfo.country, countries]);
  const formatCurrency = (value: number) => currencyInfo.format(Number.isFinite(value) ? value : 0);
  const billingCountryLabel = useMemo(() => getCountryLabel(billingInfo.country, countries), [billingInfo.country, countries]);
  const isBillingCountryIndia = useMemo(() => isCountryIndia(billingInfo.country, countries), [billingInfo.country, countries]);
  
  // Configuration options state
  const [operatingSystem, setOperatingSystem] = useState('almalinux-8.4');
  const [datacenter, setDatacenter] = useState('noida-india');
  const [hostname, setHostname] = useState('');
  const [rootPassword, setRootPassword] = useState('');
  const [additionalIPv4, setAdditionalIPv4] = useState(0);
  const [backupService, setBackupService] = useState(false);
  const [managedService, setManagedService] = useState('self'); // self, basic, premium
  const [ddosProtection, setDdosProtection] = useState('basic');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [serverQuantity, setServerQuantity] = useState(1);
  // Backend-computed pricing quote (per selected cycle)
  const [pricingQuote, setPricingQuote] = useState<any | null>(null);
  
  // New addon states
  const [pleskAddon, setPleskAddon] = useState(''); // '', 'admin', 'pro', 'host'
  const [backupStorage, setBackupStorage] = useState(''); // '', '100gb', '200gb', '300gb', '500gb', '1000gb'
  const [sslCertificate, setSslCertificate] = useState(''); // '', 'essential', 'essential-wildcard', 'comodo', 'comodo-wildcard', 'rapid', 'rapid-wildcard'
  const [supportPackage, setSupportPackage] = useState(''); // '', 'basic', 'premium'
  const [extraStorage, setExtraStorage] = useState(0); // GB - ₹2/GB/month
  const [extraBandwidth, setExtraBandwidth] = useState(0); // TB - ₹100/TB/month
  
  // Simplified addon toggles (boolean checkbox/switch based)
  const [pleskLicense, setPleskLicense] = useState(false);
  const [automatedBackup, setAutomatedBackup] = useState(false);
  const [sslCertificateEnabled, setSslCertificateEnabled] = useState(false);
  const [prioritySupport, setPrioritySupport] = useState(false);
  const [managedServiceEnabled, setManagedServiceEnabled] = useState(false);
  const [ddosProtectionEnabled, setDdosProtectionEnabled] = useState(false);
  const [invoiceDate] = useState(() => new Date());
  const [invoiceNumber] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}_${month}_${day}${hours}${minutes}`;
  });
  const servicePeriodEnd = useMemo(() => {
    const end = new Date(invoiceDate);
    end.setMonth(end.getMonth() + 1);
    end.setDate(end.getDate() - 1);
    return end;
  }, [invoiceDate]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate('/login?redirect=/checkout', { replace: true });
      return;
    }

    // Check if coming from invoice payment
    const fromInvoice = location.state?.fromInvoice;
    const invoiceData = location.state?.invoice;
    
    if (fromInvoice && invoiceData) {
      // Create server config from invoice
      const config: ServerConfig = {
        planName: invoiceData.description || 'Server Purchase',
        planType: 'server',
        vcpu: 0,
        ram: 0,
        storage: 0,
        bandwidth: 0,
        billingCycle: 'one_time',
        monthlyPrice: invoiceData.total_amount || invoiceData.amount || 0,
        totalPrice: invoiceData.total_amount || invoiceData.amount || 0,
        discount: 0
      };
      setServerConfig(config);
      return;
    }

    // Get server configuration from navigation state
    const config = location.state?.serverConfig as ServerConfig;
    if (!config) {
      // Redirect to pricing if no config
      navigate('/pricing', { replace: true });
      return;
    }

    setServerConfig(config);
  }, [user, location.state, navigate]);

  useEffect(() => {
    // Update billing info when profile loads
    if (profile) {
      setBillingInfo(prev => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        email: profile.email || prev.email
      }));
    }
  }, [profile]);

  // Load and autofill billing settings
  useEffect(() => {
    const loadBillingSettings = async () => {
      try {
        const settings = await api.getBillingSettings() as BillingSettings;
        if (settings) {
          setBillingInfo(prev => ({
            ...prev,
            // Only autofill if user hasn't manually entered data
            company: settings.company_name || prev.company,
            address: settings.street || prev.address,
            city: settings.city || prev.city,
            state: settings.state || prev.state,
            postalCode: settings.postal_code || prev.postalCode,
            country: settings.country || prev.country,
            taxId: settings.tax_id || prev.taxId,
            phone: settings.billing_phone || prev.phone,
            // Use billing email only if it exists and user's email is empty
            email: settings.billing_email || prev.email,
          }));
        }
      } catch (error) {
        console.warn('Could not load billing settings:', error);
        // Don't throw error as billing autofill is optional
      }
    };

    if (user && currentStep === 2) { // Only load when user reaches billing step
      loadBillingSettings();
    }
  }, [user, currentStep]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const steps = [
    { number: 1, title: 'Review Configuration', icon: Server },
    { number: 2, title: 'Billing & Payment', icon: CreditCard },
    { number: 3, title: 'Confirmation', icon: Check }
  ];
  const invoicePrintStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      #invoice-print-area, #invoice-print-area * {
        visibility: visible;
      }
      #invoice-print-area {
        position: absolute;
        inset: 0;
        width: 100%;
        padding: 32px;
      }
    }
  `;

  // Calculate add-ons cost
  const calculateAddOnsCost = () => {
    let addOnsCost = 0;
    
    // Extra Storage - Get price from backend
    if (extraStorage > 0) {
      const storageAddon = getAddonBySlug('extra-storage');
      const storagePrice = storageAddon?.price || 2; // Fallback to ₹2/GB
      addOnsCost += extraStorage * storagePrice;
    }
    
    // Extra Bandwidth - Get price from backend
    if (extraBandwidth > 0) {
      const bandwidthAddon = getAddonBySlug('extra-bandwidth');
      const bandwidthPrice = bandwidthAddon?.price || 100; // Fallback to ₹100/TB
      addOnsCost += extraBandwidth * bandwidthPrice;
    }
    
    // IPv4 addresses
    if (additionalIPv4 > 0) {
      const ipv4Addon = getAddonBySlug('additional-ipv4');
      const ipv4Price = ipv4Addon?.price || 200; // Fallback to ₹200/IP
      addOnsCost += additionalIPv4 * ipv4Price;
    }
    
    // Old backup service (keeping for backwards compatibility)
    if (backupService) {
      addOnsCost += 500;
    }
    
    // Managed server (self, basic, premium)
    if (managedService === 'basic') {
      const managedBasicAddon = getAddonBySlug('managed-basic');
      addOnsCost += managedBasicAddon?.price || 2000;
    } else if (managedService === 'premium') {
      const managedPremiumAddon = getAddonBySlug('managed-premium');
      addOnsCost += managedPremiumAddon?.price || 5000;
    }
    // managedService === 'self' adds nothing
    
    // DDoS protection
    if (ddosProtection === 'advanced') {
      const ddosAdvancedAddon = getAddonBySlug('ddos-advanced');
      addOnsCost += ddosAdvancedAddon?.price || 1000;
    } else if (ddosProtection === 'enterprise') {
      const ddosEnterpriseAddon = getAddonBySlug('ddos-enterprise');
      addOnsCost += ddosEnterpriseAddon?.price || 3000;
    }
    
    // Plesk addons
    if (pleskAddon === 'admin') {
      const pleskAdminAddon = getAddonBySlug('plesk-admin');
      addOnsCost += pleskAdminAddon?.price || 950; // 10 domains
    } else if (pleskAddon === 'pro') {
      const pleskProAddon = getAddonBySlug('plesk-pro');
      addOnsCost += pleskProAddon?.price || 1750; // 30 domains
    } else if (pleskAddon === 'host') {
      const pleskHostAddon = getAddonBySlug('plesk-host');
      addOnsCost += pleskHostAddon?.price || 2650; // Unlimited domains
    }
    
    // Backup storage
    if (backupStorage === '100gb') {
      addOnsCost += 750;
    } else if (backupStorage === '200gb') {
      addOnsCost += 1500;
    } else if (backupStorage === '300gb') {
      addOnsCost += 2250;
    } else if (backupStorage === '500gb') {
      addOnsCost += 3750;
    } else if (backupStorage === '1000gb') {
      addOnsCost += 7500;
    }
    
    // SSL certificates (annual, so divide by 12 for monthly)
    if (sslCertificate === 'essential') {
      addOnsCost += Math.round(2700 / 12); // ₹225/month
    } else if (sslCertificate === 'essential-wildcard') {
      addOnsCost += Math.round(13945.61 / 12); // ₹1162/month
    } else if (sslCertificate === 'comodo') {
      addOnsCost += Math.round(2500 / 12); // ₹208/month
    } else if (sslCertificate === 'comodo-wildcard') {
      addOnsCost += Math.round(13005.86 / 12); // ₹1084/month
    } else if (sslCertificate === 'rapid') {
      addOnsCost += Math.round(3000 / 12); // ₹250/month
    } else if (sslCertificate === 'rapid-wildcard') {
      addOnsCost += Math.round(16452.72 / 12); // ₹1371/month
    }
    
    // Support packages
    if (supportPackage === 'basic') {
      addOnsCost += 2500;
    } else if (supportPackage === 'premium') {
      addOnsCost += 7500;
    }
    
    return addOnsCost;
  };

  // Calculate subtotal including add-ons and quantity
  const billingCycleInfo = useMemo(() => ({
    months:
      serverConfig?.billingCycle === 'quarterly' ? 3 :
      serverConfig?.billingCycle === 'semiannually' ? 6 :
      serverConfig?.billingCycle === 'annually' ? 12 :
      serverConfig?.billingCycle === 'biennially' ? 24 :
      serverConfig?.billingCycle === 'triennially' ? 36 : 1,
    discount:
      serverConfig?.billingCycle === 'quarterly' ? 10 :
      serverConfig?.billingCycle === 'semiannually' ? 15 :
      serverConfig?.billingCycle === 'annually' ? 20 :
      serverConfig?.billingCycle === 'biennially' ? 25 :
      serverConfig?.billingCycle === 'triennially' ? 35 : 5,
    label:
      serverConfig?.billingCycle === 'quarterly' ? 'Quarterly' :
      serverConfig?.billingCycle === 'semiannually' ? 'Semiannually' :
      serverConfig?.billingCycle === 'annually' ? 'Annually' :
      serverConfig?.billingCycle === 'biennially' ? 'Biennially' :
      serverConfig?.billingCycle === 'triennially' ? 'Triennially' : 'Monthly'
  }), [serverConfig?.billingCycle]);

  // Subtotal for the selected billing cycle after cycle discount, before promo
  const calculateSubtotal = () => {
    if (!serverConfig) return 0;
    // Prefer backend quote if available
    if (pricingQuote?.quote?.subtotal_after_discount != null) {
      return Number(pricingQuote.quote.subtotal_after_discount) || 0;
    }
    // Fallback local calculation
    const perServerMonthly = serverConfig.monthlyPrice + calculateAddOnsCost();
    const base = perServerMonthly * billingCycleInfo.months * serverQuantity;
    const discount = Math.round(base * (billingCycleInfo.discount / 100));
    return base - discount;
  };

  const getTaxBreakdown = () => {
    const subtotal = calculateSubtotal();
    const taxableAmount = Math.max(subtotal - promoDiscount, 0);
    if (!isBillingCountryIndia || taxableAmount === 0) {
      return { cgst: 0, sgst: 0, igst: 0 };
    }

    const normalizedState = (billingInfo.state || '').toLowerCase();
    const isWithinUP = normalizedState.includes('uttar pradesh') || normalizedState === 'up' || normalizedState === 'u.p';
    const totalTax = Math.round(taxableAmount * 0.18);

    if (isWithinUP) {
      const cgst = Math.floor(totalTax / 2);
      const sgst = totalTax - cgst;
      return { cgst, sgst, igst: 0 };
    }

    return { cgst: 0, sgst: 0, igst: totalTax };
  };

  // Calculate tax (18% GST for India)
  const calculateTax = () => {
    const { cgst, sgst, igst } = getTaxBreakdown();
    return cgst + sgst + igst;
  };

  // Calculate final total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal - promoDiscount + tax;
  };

  // Fetch backend pricing quote whenever relevant inputs change
  useEffect(() => {
    const fetchQuote = async () => {
      if (!serverConfig) return;
      try {
        const quotePayload = {
          plan_id: serverConfig.planId,
          billing_cycle: serverConfig.billingCycle,
          quantity: serverQuantity,
          additional_ipv4: additionalIPv4,
          extra_storage_gb: extraStorage,
          extra_bandwidth_tb: extraBandwidth,
          plesk_addon: pleskAddon,
          backup_storage: backupStorage,
          ssl_certificate: sslCertificate,
          support_package: supportPackage,
          managed_service: managedService,
          ddos_protection: ddosProtection,
        };
        const res = await api.getPricingQuote(quotePayload);
        setPricingQuote(res);
      } catch (e) {
        // Silently ignore; UI will fallback to local calc
        console.warn('Pricing quote unavailable, using local calculation');
        setPricingQuote(null);
      }
    };
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverConfig?.planId, serverConfig?.billingCycle, serverQuantity, additionalIPv4, extraStorage, extraBandwidth, pleskAddon, backupStorage, sslCertificate, supportPackage, managedService, ddosProtection]);

  // Validate promo code
  const handleApplyPromoCode = () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoDiscount(Math.round(calculateSubtotal() * 0.10));
      alert('Promo code applied! 10% discount');
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setPromoDiscount(Math.round(calculateSubtotal() * 0.20));
      alert('Promo code applied! 20% discount');
    } else {
      alert('Invalid promo code');
      setPromoDiscount(0);
    }
  };

  const handleInputChange = (field: keyof BillingInfo, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of page when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteOrder = async () => {
    if (!serverConfig || !agreeToTerms) return;

    setProcessing(true);

    try {
      // Step 1: Create Payment Order
      console.log('🔄 Creating payment order...', {
        plan_id: serverConfig.planId,
        billing_cycle: serverConfig.billingCycle,
        total_amount: calculateTotal()
      });

      const paymentOrderResponse = await api.post('/api/v1/payments/create-order', {
        payment_type: 'server',
        plan_id: serverConfig.planId,
        amount: pricingQuote?.quote?.total || calculateTotal(), // Prefer backend quote total
        billing_cycle: serverConfig.billingCycle === 'monthly' ? 'monthly' :
                       serverConfig.billingCycle === 'quarterly' ? 'quarterly' :
                       serverConfig.billingCycle === 'semiannually' ? 'semi_annual' :
                       serverConfig.billingCycle === 'annually' ? 'annual' :
                       serverConfig.billingCycle === 'biennially' ? 'biennial' :
                       serverConfig.billingCycle === 'triennially' ? 'triennial' : 'monthly',
        server_config: {
          server_name: hostname || `${serverConfig.planName} Server`,
          hostname: hostname || `server-${Date.now()}.bidua.com`,
          os: operatingSystem || 'Ubuntu 22.04 LTS',
          datacenter: datacenter || 'noida-india',
          managed_service: managedService,
          ddos_protection: ddosProtection,
          additional_ipv4: additionalIPv4,
          backup_service: backupService,
          plesk_addon: pleskAddon,
          backup_storage: backupStorage,
          ssl_certificate: sslCertificate,
          support_package: supportPackage,
          extra_storage: extraStorage,
          extra_bandwidth: extraBandwidth,
          quantity: serverQuantity
        }
      });

      if (!paymentOrderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      console.log('✅ Payment order created:', paymentOrderResponse);
      const { payment, plan } = paymentOrderResponse;

      // Step 2: Handle Payment Method
      if (paymentMethod === 'razorpay') {
        // Wait for Razorpay to load
        if (!razorpayLoaded) {
          alert('Payment system is loading. Please try again in a moment.');
          setProcessing(false);
          return;
        }

        // Initialize Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: payment.total_amount * 100, // Amount in paise
          currency: payment.currency || 'INR',
          name: 'BIDUA Hosting',
          description: `${serverConfig.planName} - ${serverConfig.billingCycle}`,
          order_id: payment.razorpay_order_id,
          handler: async (response: any) => {
            try {
              console.log('🔄 Verifying payment...', response);

              // Step 3: Verify Payment
              const verificationResponse = await api.post('/api/v1/payments/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              console.log('✅ Payment verified:', verificationResponse);

              if (verificationResponse.success) {
                // Payment successful
                setOrderDetails({
                  ...verificationResponse.order,
                  payment: verificationResponse.payment,
                  server: verificationResponse.server,
                  affiliate: verificationResponse.affiliate
                });

                // Save billing info to backend for future use
                try {
                  await api.updateBillingSettings({
                    street: billingInfo.address,
                    city: billingInfo.city,
                    state: billingInfo.state,
                    country: billingInfo.country,
                    postal_code: billingInfo.postalCode,
                    company_name: billingInfo.company,
                    tax_id: billingInfo.taxId,
                    billing_email: billingInfo.email,
                    billing_phone: billingInfo.phone,
                  });
                  console.log('✅ Billing settings saved for future checkouts');
                } catch (error) {
                  console.warn('Could not save billing settings:', error);
                  // Don't fail the checkout if billing save fails
                }

                // Show success message
                if (verificationResponse.server?.created) {
                  console.log('🎉 Server created:', verificationResponse.server.hostname);
                }
                if (verificationResponse.affiliate?.activated) {
                  console.log('🎉 Affiliate activated!');
                }

                // Move to confirmation step
                setCurrentStep(3);
                
                // Scroll to top of page smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (error: any) {
              console.error('❌ Payment verification error:', error);
              alert(`Payment verification failed: ${error.message}. Please contact support with your payment ID: ${response.razorpay_payment_id}`);
            } finally {
              setProcessing(false);
            }
          },
          prefill: {
            name: billingInfo.fullName,
            email: billingInfo.email,
            contact: billingInfo.phone
          },
          notes: {
            billing_cycle: serverConfig.billingCycle,
            plan_name: serverConfig.planName,
            plan_type: serverConfig.planType
          },
          theme: {
            color: '#06b6d4' // Cyan color
          },
          modal: {
            ondismiss: () => {
              console.log('Payment cancelled by user');
              setProcessing(false);
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);

        razorpay.on('payment.failed', (response: any) => {
          console.error('❌ Payment failed:', response.error);
          alert(`Payment failed: ${response.error.description}`);
          setProcessing(false);
        });

        razorpay.open();

      } else if (paymentMethod === 'bank_transfer') {
        // For bank transfer, just show the proforma invoice
        setOrderDetails({
          order_number: payment.razorpay_order_id,
          amount: payment.total_amount,
          status: 'pending'
        });

        // Save billing info to backend for future use
        try {
          await api.updateBillingSettings({
            street: billingInfo.address,
            city: billingInfo.city,
            state: billingInfo.state,
            country: billingInfo.country,
            postal_code: billingInfo.postalCode,
            company_name: billingInfo.company,
            tax_id: billingInfo.taxId,
            billing_email: billingInfo.email,
            billing_phone: billingInfo.phone,
          });
          console.log('✅ Billing settings saved for future checkouts');
        } catch (error) {
          console.warn('Could not save billing settings:', error);
          // Don't fail the checkout if billing save fails
        }

        setCurrentStep(3);
        setProcessing(false);
      }

    } catch (error: any) {
      console.error('❌ Order creation failed:', error);
      alert(error.message || 'Failed to create order. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownloadInvoice = () => {
    window.print();
  };

  if (!serverConfig) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-100">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const taxableAmount = Math.max(subtotal - promoDiscount, 0);
  const taxBreakdown = getTaxBreakdown();
  const totalAmount = calculateTotal();
  const invoiceAmountInWords = amountInWords(totalAmount, currencyInfo.code);
  const invoiceDateDisplay = formatDate(invoiceDate);
  const dueDateDisplay = formatDate(invoiceDate);
  const servicePeriodRange = `${formatDate(invoiceDate)} - ${formatDate(servicePeriodEnd)}`;
  const datacenterLabel = datacenter ? capitalizeWords(datacenter.replace(/-/g, ' ')) : 'Preferred Datacenter';
  const osLabel = operatingSystem ? capitalizeWords(operatingSystem.replace(/-/g, ' ')) : 'Preferred Operating System';
  const managedServiceLabel = managedService === 'premium'
    ? 'Managed by BIDUA (Premium)'
    : managedService === 'basic'
    ? 'Managed by BIDUA (Basic)'
    : 'I will manage the server myself';
  const invoiceItemDescription = `${serverConfig.planName} - ${(hostname || serverConfig.planType || 'Server').trim()} (${servicePeriodRange})`;
  const billingLines = [
    billingInfo.fullName || 'Valued Customer',
    billingInfo.company,
    billingInfo.address,
    billingInfo.addressLine2,
    [billingInfo.state, billingInfo.city, billingInfo.postalCode].filter(Boolean).join(', '),
    billingCountryLabel
  ].filter((line): line is string => Boolean(line && line.trim()));
  const payToLines = [
    'BIDUA Industries Pvt Ltd',
    'Office 201, B 158, Sector 63',
    'Noida, Uttar Pradesh 201301',
    'India'
  ];
  const payToFinancials = {
    pan: 'BIDUA0000B',
    accountName: 'BIDUA Industries Pvt Ltd',
    accountNumber: '12345678901234',
    ifsc: 'HDFC0001648',
    gstin: '09BIDUA0000B1Z5'
  };
  const fundsApplied = 0;
  const balanceAmount = totalAmount - fundsApplied;

  return (
    <div className="min-h-screen bg-slate-950 py-6 lg:py-12 pb-32 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps - Mobile Optimized */}
        <div className="mb-6 lg:mb-12">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex flex-col items-center ${index > 0 ? 'ml-4 lg:ml-8' : ''}`}>
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 transition-all touch-manipulation ${
                    currentStep >= step.number
                      ? 'bg-cyan-600 border-cyan-600 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="h-4 w-4 lg:h-6 lg:w-6" />
                    ) : (
                      <step.icon className="h-4 w-4 lg:h-6 lg:w-6" />
                    )}
                  </div>
                  <span className={`mt-1 lg:mt-2 text-xs lg:text-sm font-medium hidden sm:block ${
                    currentStep >= step.number ? 'text-cyan-400' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                  <span className={`mt-1 text-[10px] font-medium sm:hidden ${
                    currentStep >= step.number ? 'text-cyan-400' : 'text-slate-500'
                  }`}>
                    Step {step.number}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 lg:w-24 h-1 mx-2 lg:mx-4 ${
                    currentStep > step.number ? 'bg-cyan-600' : 'bg-slate-700'
                  }`} style={{ marginTop: index === 0 ? '-20px' : '-20px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500/30 p-8">
              {/* Step 1: Review Configuration */}
              {currentStep === 1 && (
                <div className="space-y-3 lg:space-y-6">
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex items-center">
                    <Server className="h-5 w-5 lg:h-6 lg:w-6 text-cyan-400 mr-2 lg:mr-3" />
                    Configure Your Server
                  </h2>

                  {/* Server Specs - Collapsible on Mobile */}
                  <div className="bg-slate-950 rounded-xl border-2 border-cyan-500/30 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'specs' ? null : 'specs')}
                      className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-800/50 active:bg-slate-800 transition-all touch-manipulation min-h-[64px] lg:hidden"
                    >
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <Server className="h-5 w-5 text-cyan-400" />
                        <span>Server Specifications</span>
                      </h3>
                      <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${expandedSection === 'specs' ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`lg:block ${expandedSection === 'specs' ? 'block' : 'hidden lg:block'}`}>
                      <div className="p-4 lg:p-6">
                        <h3 className="text-xl font-bold text-white mb-4 hidden lg:block">{serverConfig.planName}</h3>
                        <h4 className="text-lg font-bold text-white mb-4 lg:hidden">{serverConfig.planName}</h4>
                        <div className="grid grid-cols-2 gap-3 lg:gap-4">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <Cpu className="h-4 w-4 lg:h-5 lg:w-5 text-cyan-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-slate-400">vCPU Cores</p>
                              <p className="text-sm lg:text-base text-white font-semibold">{serverConfig.vcpu}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <MemoryStick className="h-4 w-4 lg:h-5 lg:w-5 text-green-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-slate-400">RAM</p>
                              <p className="text-sm lg:text-base text-white font-semibold">{serverConfig.ram}GB</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <HardDrive className="h-4 w-4 lg:h-5 lg:w-5 text-orange-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-slate-400">Storage</p>
                              <p className="text-sm lg:text-base text-white font-semibold">{serverConfig.storage}GB NVMe SSD</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <Network className="h-4 w-4 lg:h-5 lg:w-5 text-purple-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-slate-400">Bandwidth</p>
                              <p className="text-sm lg:text-base text-white font-semibold">{serverConfig.bandwidth}TB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operating System - Collapsible on Mobile */}
                  <div className="bg-slate-950 rounded-xl border-2 border-cyan-500/30 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'os' ? null : 'os')}
                      className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-800/50 active:bg-slate-800 transition-all touch-manipulation min-h-[64px] lg:hidden"
                    >
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-cyan-400" />
                        <span>Operating System</span>
                      </h3>
                      <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${expandedSection === 'os' ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`lg:block ${expandedSection === 'os' ? 'block' : 'hidden lg:block'}`}>
                      <div className="p-4 lg:p-6">
                        <label className="block font-bold text-white mb-3 lg:mb-4 hidden lg:flex items-center">
                          <Globe className="h-5 w-5 inline text-cyan-400 mr-2" />
                          Operating System
                        </label>
                        <select
                          value={operatingSystem}
                          onChange={(e) => setOperatingSystem(e.target.value)}
                          className="w-full px-3 lg:px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm lg:text-base min-h-[44px]"
                        >
                          <option value="almalinux-8.4">Almalinux 8.4 x86_64</option>
                          <option value="almalinux-9.4">Almalinux 9.4 x86_64</option>
                          <option value="centos-7.9">Centos 7.9 x86_64</option>
                          <option value="centos-8.9">Centos 8.9 x86_64</option>
                          <option value="centos-9.3">Centos 9.3 x86_64</option>
                          <option value="debian-9.4">Debian 9.4 x86_64</option>
                          <option value="debian-10">Debian 10 x86_64</option>
                          <option value="debian-11">Debian 11 x86_64</option>
                          <option value="debian-12">Debian 12 x86_64</option>
                          <option value="fedora-34">Fedora 34 x86_64</option>
                          <option value="oracle-8.9">Oracle 8.9 x86_64</option>
                          <option value="oracle-9.3">Oracle 9.3 x86_64</option>
                          <option value="rocky-8.8">Rocky 8.8 x86_64</option>
                          <option value="rocky-9.2">Rocky 9.2 x86_64</option>
                          <option value="suse-13.1">Suse 13.1 x86_64</option>
                          <option value="suse-15.1">Suse 15.1 x86_64</option>
                          <option value="ubuntu-20.04">Ubuntu 20.04 x86_64</option>
                          <option value="ubuntu-22.04">Ubuntu 22.04 x86_64</option>
                          <option value="ubuntu-24.04">Ubuntu 24.04 x86_64</option>
                          <option value="windows-2016">Windows 2016 Standard Evaluation</option>
                          <option value="windows-2019">Windows 2019 Standard Evaluation</option>
                          <option value="windows-2022">Windows 2022 Standard Evaluation</option>
                          <option value="oracle-10.0">oracle-10.0-x86_64</option>
                          <option value="custom-iso">Custom ISO</option>
                        </select>
                      </div>
                    </div>
                  </div>

                {/* Datacenter Location - Collapsible on Mobile */}
                <div className="bg-slate-950 rounded-xl border-2 border-cyan-500/30 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'datacenter' ? null : 'datacenter')}
                    className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-800/50 active:bg-slate-800 transition-all touch-manipulation min-h-[64px] lg:hidden"
                  >
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-cyan-400" />
                      <span>Datacenter Location</span>
                    </h3>
                    <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${expandedSection === 'datacenter' ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`lg:block ${expandedSection === 'datacenter' ? 'block' : 'hidden lg:block'}`}>
                    <div className="p-4 lg:p-6">
                      <label className="block font-bold text-white mb-3 lg:mb-4 hidden lg:flex items-center">
                        <MapPin className="h-5 w-5 inline text-cyan-400 mr-2" />
                        Datacenter Location
                      </label>
                      <select
                        value={datacenter}
                        onChange={(e) => setDatacenter(e.target.value)}
                        className="w-full px-3 lg:px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm lg:text-base min-h-[44px]"
                      >
                        <option value="noida-india">🇮🇳 Noida, India</option>
                        <option value="milton-keynes-uk">🇬🇧 Milton Keynes, United Kingdom</option>
                        <option value="singapore" disabled>🇸🇬 Singapore (Coming Soon)</option>
                      </select>
                    </div>
                  </div>
                </div>

                  {/* Server Configuration - Collapsible on Mobile */}
                  <div className="bg-slate-950 rounded-xl border-2 border-cyan-500/30 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'config' ? null : 'config')}
                      className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-800/50 active:bg-slate-800 transition-all touch-manipulation min-h-[64px] lg:hidden"
                    >
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <Server className="h-5 w-5 text-cyan-400" />
                        <span>Server Details</span>
                      </h3>
                      <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${expandedSection === 'config' ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`lg:block ${expandedSection === 'config' ? 'block' : 'hidden lg:block'}`}>
                      <div className="p-4 lg:p-6">
                        <h4 className="font-bold text-white mb-3 lg:mb-4 hidden lg:block">Server Configuration</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Hostname <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={hostname}
                              onChange={(e) => setHostname(e.target.value)}
                              placeholder="server1.example.com"
                              className="w-full px-3 lg:px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm lg:text-base min-h-[44px]"
                              required
                            />
                            <p className="text-xs text-slate-400 mt-1">Fully qualified domain name for your server</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Root Password <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="password"
                              value={rootPassword}
                              onChange={(e) => setRootPassword(e.target.value)}
                              placeholder="Enter strong password"
                              className="w-full px-3 lg:px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm lg:text-base min-h-[44px]"
                              required
                            />
                            <p className="text-xs text-slate-400 mt-1">Minimum 8 characters with uppercase, lowercase, number, and special character</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons - Collapsible on Mobile */}
                  <div className="bg-slate-950 rounded-xl border-2 border-cyan-500/30 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'addons' ? null : 'addons')}
                      className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-800/50 active:bg-slate-800 transition-all touch-manipulation min-h-[64px] lg:hidden"
                    >
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <Plus className="h-5 w-5 text-cyan-400" />
                        <span>Add-ons & Upgrades</span>
                      </h3>
                      <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${expandedSection === 'addons' ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`lg:block ${expandedSection === 'addons' ? 'block' : 'hidden lg:block'}`}>
                      <div className="p-4 lg:p-6">
                        <h4 className="font-bold text-white mb-3 lg:mb-4 hidden lg:flex items-center">
                          <Plus className="h-5 w-5 text-cyan-400 mr-2" />
                          Add-ons & Upgrades
                        </h4>
                      
                        <div className="space-y-4">
                          {/* Additional IPv4 */}
                          <div className="p-3 lg:p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <p className="font-medium text-white text-sm lg:text-base mb-1">Additional IPv4 Addresses</p>
                                <p className="text-xs lg:text-sm text-slate-400">{formatCurrency(200)}/month per IP</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setAdditionalIPv4(Math.max(0, additionalIPv4 - 1))}
                                  className="flex-1 h-12 bg-slate-800 text-white rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center touch-manipulation transition-all font-semibold"
                                >
                                  <Minus className="h-5 w-5 mr-1" /> Decrease
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAdditionalIPv4(Math.min(10, additionalIPv4 + 1))}
                                  className="flex-1 h-12 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 active:bg-cyan-700 flex items-center justify-center touch-manipulation transition-all font-semibold"
                                >
                                  <Plus className="h-5 w-5 mr-1" /> Increase
                                </button>
                              </div>
                              <div className="text-center py-2 bg-slate-800/50 rounded-lg">
                                <span className="text-white font-bold text-lg">{additionalIPv4}</span>
                                <span className="text-slate-400 text-sm ml-2">IP{additionalIPv4 !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>

                          {/* Extra Storage */}
                          <div className="p-3 lg:p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <p className="font-medium text-white text-sm lg:text-base mb-1">Extra Storage</p>
                                <p className="text-xs lg:text-sm text-slate-400">
                                  {formatCurrency(getAddonBySlug('extra-storage')?.price || 2)}/GB/month
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setExtraStorage(Math.max(0, extraStorage - 10))}
                                  className="flex-1 h-12 bg-slate-800 text-white rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center touch-manipulation transition-all font-semibold"
                                >
                                  <Minus className="h-5 w-5 mr-1" /> -10GB
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setExtraStorage(Math.min(1000, extraStorage + 10))}
                                  className="flex-1 h-12 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 active:bg-cyan-700 flex items-center justify-center touch-manipulation transition-all font-semibold"
                                >
                                  <Plus className="h-5 w-5 mr-1" /> +10GB
                                </button>
                              </div>
                              <div className="text-center py-2 bg-slate-800/50 rounded-lg">
                                <span className="text-white font-bold text-lg">{extraStorage} GB</span>
                                {extraStorage > 0 && (
                                  <span className="text-cyan-400 text-xs ml-2">
                                    ({formatCurrency(extraStorage * (getAddonBySlug('extra-storage')?.price || 2))}/mo)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Extra Bandwidth */}
                          <div className="p-3 lg:p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <p className="font-medium text-white text-sm lg:text-base mb-1">Extra Bandwidth</p>
                                <p className="text-xs lg:text-sm text-slate-400">
                                  {formatCurrency(getAddonBySlug('extra-bandwidth')?.price || 100)}/TB/month
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setExtraBandwidth(Math.max(0, extraBandwidth - 1))}
                                  className="flex-1 h-12 bg-slate-800 text-white rounded-lg hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center touch-manipulation transition-all font-semibold"
                                >
                                  <Minus className="h-5 w-5 mr-1" /> -1TB
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setExtraBandwidth(Math.min(100, extraBandwidth + 1))}
                                  className="flex-1 h-12 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 active:bg-cyan-700 flex items-center justify-center touch-manipulation transition-all font-semibold"
                                >
                                  <Plus className="h-5 w-5 mr-1" /> +1TB
                                </button>
                              </div>
                              <div className="text-center py-2 bg-slate-800/50 rounded-lg">
                                <span className="text-white font-bold text-lg">{extraBandwidth} TB</span>
                                {extraBandwidth > 0 && (
                                  <span className="text-cyan-400 text-xs ml-2">
                                    ({formatCurrency(extraBandwidth * (getAddonBySlug('extra-bandwidth')?.price || 100))}/mo)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Plesk Control Panel - Dropdown Selector */}
                          <div className="p-3 lg:p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-white text-sm lg:text-base">Plesk Control Panel</p>
                              <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">Popular</span>
                            </div>
                            <select
                              value={pleskAddon}
                              onChange={(e) => setPleskAddon(e.target.value)}
                              className="w-full px-3 py-2.5 lg:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm lg:text-base focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 touch-manipulation min-h-[44px]"
                            >
                              <option value="">None</option>
                              <option value="admin">Plesk Admin - ₹950/month</option>
                              <option value="pro">Plesk Pro - ₹1,750/month</option>
                              <option value="host">Plesk Host - ₹2,650/month</option>
                            </select>
                          </div>

                          {/* Backup Storage - Dropdown Selector */}
                          <div className="p-3 lg:p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-white text-sm lg:text-base">Automated Daily Backups</p>
                              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Recommended</span>
                            </div>
                            <select
                              value={backupStorage}
                              onChange={(e) => setBackupStorage(e.target.value)}
                              className="w-full px-3 py-2.5 lg:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm lg:text-base focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 touch-manipulation min-h-[44px]"
                            >
                              <option value="">None</option>
                              <option value="100gb">100GB - ₹750/month</option>
                              <option value="200gb">200GB - ₹1,500/month</option>
                              <option value="300gb">300GB - ₹2,250/month</option>
                              <option value="500gb">500GB - ₹3,750/month</option>
                              <option value="1000gb">1000GB - ₹7,500/month</option>
                            </select>
                          </div>

                          {/* SSL Certificate - Dropdown Selector */}
                          <div className="p-3 lg:p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-white text-sm lg:text-base">Premium SSL Certificate</p>
                              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Secure</span>
                            </div>
                            <select
                              value={sslCertificate}
                              onChange={(e) => setSslCertificate(e.target.value)}
                              className="w-full px-3 py-2.5 lg:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm lg:text-base focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 touch-manipulation min-h-[44px]"
                            >
                              <option value="">None</option>
                              <option value="essential">Essential SSL - ₹225/month</option>
                              <option value="essential-wildcard">Essential Wildcard - ₹1,162/month</option>
                              <option value="comodo">Comodo SSL - ₹208/month</option>
                              <option value="comodo-wildcard">Comodo Wildcard - ₹1,084/month</option>
                              <option value="rapid">RapidSSL - ₹250/month</option>
                              <option value="rapid-wildcard">RapidSSL Wildcard - ₹1,371/month</option>
                            </select>
                          </div>

                          {/* Support Package - Dropdown Selector */}
                          <div className="p-3 lg:p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-white text-sm lg:text-base">24/7 Priority Support</p>
                            </div>
                            <select
                              value={supportPackage}
                              onChange={(e) => setSupportPackage(e.target.value)}
                              className="w-full px-3 py-2.5 lg:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm lg:text-base focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 touch-manipulation min-h-[44px]"
                            >
                              <option value="">None</option>
                              <option value="basic">Basic Support - ₹2,500/month</option>
                              <option value="premium">Premium Support - ₹7,500/month</option>
                            </select>
                          </div>

                          {/* Managed Service - Dropdown Selector */}
                          <div className="p-3 lg:p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-white text-sm lg:text-base">Managed Service</p>
                              <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">Premium</span>
                            </div>
                            <select
                              value={managedService}
                              onChange={(e) => setManagedService(e.target.value)}
                              className="w-full px-3 py-2.5 lg:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm lg:text-base focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 touch-manipulation min-h-[44px]"
                            >
                              <option value="self">Self-Managed (Free)</option>
                              <option value="basic">Basic Management - ₹2,000/month</option>
                              <option value="premium">Premium Management - ₹5,000/month</option>
                            </select>
                          </div>

                          {/* DDoS Protection - Dropdown Selector */}
                          <div className="p-3 lg:p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-white text-sm lg:text-base">DDoS Protection</p>
                              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">Security</span>
                            </div>
                            <select
                              value={ddosProtection}
                              onChange={(e) => setDdosProtection(e.target.value)}
                              className="w-full px-3 py-2.5 lg:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm lg:text-base focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 touch-manipulation min-h-[44px]"
                            >
                              <option value="basic">Basic (Free - Included)</option>
                              <option value="advanced">Advanced - ₹1,000/month</option>
                              <option value="enterprise">Enterprise - ₹3,000/month</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Billing Cycle */}
                    <div className="bg-slate-950 rounded-xl p-6 border border-cyan-500/30">
                      <h4 className="font-bold text-white mb-4 flex items-center">
                        <Clock className="h-5 w-5 text-cyan-400 mr-2" />
                        Billing Cycle
                      </h4>
                      <p className="text-lg text-white capitalize">{serverConfig.billingCycle}</p>
                      <p className="text-sm text-green-400 mt-2">
                        <Percent className="h-4 w-4 inline mr-1" />
                        Saving {(() => {
                          // Define discount percentages based on billing cycle
                          const discountMap: Record<string, number> = {
                            'monthly': 5,
                            'quarterly': 10,
                            'semiannually': 15,
                            'annually': 20,
                            'biennially': 25,
                            'triennially': 35
                          };
                          const discountPercent = discountMap[serverConfig.billingCycle] || 0;
                          return `${discountPercent}%`;
                        })()} with {serverConfig.billingCycle} billing
                      </p>
                    </div>

                    {/* Included Features */}
                    <div className="bg-slate-950 rounded-xl p-6 border border-cyan-500/30">
                      <h4 className="font-bold text-white mb-4 flex items-center">
                        <Shield className="h-5 w-5 text-cyan-400 mr-2" />
                        Included Features
                      </h4>
                      <ul className="grid grid-cols-2 gap-3">
                        {[
                          'Full Root Access',
                          'Console Access',
                          'Basic DDoS Protection',
                          '99.9% Uptime SLA',
                          '24/7 Support',
                          'IPv4 & IPv6',
                          'NVMe SSD Storage',
                          'Free Setup'
                        ].map((feature, i) => (
                          <li key={i} className="flex items-center text-sm text-slate-300">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                  <button
                    onClick={handleNextStep}
                    disabled={!hostname || !rootPassword}
                    className="mt-8 w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-4 rounded-lg font-bold hover:from-cyan-500 hover:to-teal-500 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation active:from-cyan-700 active:to-teal-700"
                  >
                    Continue to Billing
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              )}

              {/* Step 2: Billing & Payment */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <CreditCard className="h-6 w-6 text-cyan-400 mr-3" />
                      Billing & Payment Information
                    </h2>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const settings = await api.getBillingSettings() as BillingSettings;
                          if (settings) {
                            setBillingInfo(prev => ({
                              ...prev,
                              company: settings.company_name || prev.company,
                              address: settings.street || prev.address,
                              city: settings.city || prev.city,
                              state: settings.state || prev.state,
                              postalCode: settings.postal_code || prev.postalCode,
                              country: settings.country || prev.country,
                              taxId: settings.tax_id || prev.taxId,
                              phone: settings.billing_phone || prev.phone,
                            }));
                          }
                        } catch (error) {
                          console.warn('Could not load billing settings:', error);
                        }
                      }}
                      className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-all border border-cyan-500/30 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Auto-fill from Settings</span>
                    </button>
                  </div>

                  {/* Server Quantity Selector */}
                  <div className="mb-6 bg-slate-950 rounded-xl p-4 sm:p-6 border border-cyan-500/30">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Server className="h-5 w-5 text-cyan-400 mr-2" />
                      Server Quantity
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm sm:text-base">{serverConfig.planName}</p>
                        <p className="text-xs sm:text-sm text-slate-400">Select number of servers you want to deploy</p>
                      </div>
                      <div className="flex items-center space-x-3 sm:space-x-4 justify-center sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setServerQuantity(Math.max(1, serverQuantity - 1))}
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 text-white rounded-lg hover:bg-slate-700 flex items-center justify-center transition-all"
                        >
                          <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        <span className="text-xl sm:text-2xl font-bold text-white w-12 sm:w-16 text-center">{serverQuantity}</span>
                        <button
                          type="button"
                          onClick={() => setServerQuantity(Math.min(100, serverQuantity + 1))}
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 flex items-center justify-center transition-all"
                        >
                          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-cyan-500/30">
                      <p className="text-xs text-slate-400 flex flex-wrap items-center gap-1">
                        <span>Total:</span>
                        <span className="font-semibold text-white">{serverQuantity} × {formatCurrency(serverConfig.monthlyPrice + calculateAddOnsCost())}/mo</span>
                        <span>=</span>
                        <span className="font-bold text-cyan-400 text-sm">{formatCurrency(calculateSubtotal())}/mo</span>
                      </p>
                    </div>
                  </div>

                  <form className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            <User className="h-4 w-4 inline mr-1" />
                            Full Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={billingInfo.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            <Building className="h-4 w-4 inline mr-1" />
                            Company Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={billingInfo.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            <Mail className="h-4 w-4 inline mr-1" />
                            Email Address <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            value={billingInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            <Phone className="h-4 w-4 inline mr-1" />
                            Phone Number <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="tel"
                            value={billingInfo.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Billing Address</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            Street Address <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={billingInfo.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="123 Main Street"
                            className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Address Line 2 (Optional)
                          </label>
                          <input
                            type="text"
                            value={billingInfo.addressLine2}
                            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                            placeholder="Apartment, suite, etc."
                            className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              <Globe className="h-4 w-4 inline mr-1" />
                              Country <span className="text-red-400">*</span>
                            </label>
                            <select
                              value={billingCountryLabel || billingInfo.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                              required
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
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              State/Province <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={billingInfo.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              placeholder="Delhi"
                              className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              City <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={billingInfo.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="New Delhi"
                              className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Postal Code <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={billingInfo.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
                              placeholder="110001"
                              className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              <FileText className="h-4 w-4 inline mr-1" />
                              GST/Tax ID (Optional)
                            </label>
                            <input
                              type="text"
                              value={billingInfo.taxId}
                              onChange={(e) => handleInputChange('taxId', e.target.value)}
                              placeholder="22AAAAA0000A1Z5"
                              className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            />
                            <p className="text-xs text-slate-400 mt-1">Enter your GSTIN for GST invoice</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Security (for new customers) */}
                    {!user && (
                      <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                          <Lock className="h-5 w-5 text-cyan-400 mr-2" />
                          Account Security
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Password <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="password"
                              value={billingInfo.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              placeholder="Create strong password"
                              className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Confirm Password <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="password"
                              value={billingInfo.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              placeholder="Re-enter password"
                              className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 text-cyan-400 mr-2" />
                        Payment Method
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-start p-4 bg-slate-950 border-2 border-cyan-500/30 rounded-lg cursor-pointer hover:border-cyan-500 transition-all">
                          <input
                            type="radio"
                            name="payment"
                            value="razorpay"
                            checked={paymentMethod === 'razorpay'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1 w-5 h-5 text-cyan-600 bg-slate-900 border-slate-700"
                          />
                          <div className="ml-3 flex-1">
                            <p className="font-medium text-white">Credit/Debit Card, UPI, NetBanking</p>
                            <p className="text-sm text-slate-400">Secure payment powered by Razorpay</p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">Visa</span>
                              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">Mastercard</span>
                              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">UPI</span>
                              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">Wallets</span>
                            </div>
                          </div>
                          <Check className={`h-5 w-5 ${paymentMethod === 'razorpay' ? 'text-cyan-400' : 'text-transparent'}`} />
                        </label>

                        <label className="flex items-start p-4 bg-slate-950 border-2 border-slate-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-all">
                          <input
                            type="radio"
                            name="payment"
                            value="bank_transfer"
                            checked={paymentMethod === 'bank_transfer'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1 w-5 h-5 text-cyan-600 bg-slate-900 border-slate-700"
                          />
                          <div className="ml-3 flex-1">
                            <p className="font-medium text-white">Bank Transfer / NEFT / RTGS</p>
                            <p className="text-sm text-slate-400">Manual payment via bank transfer (1-2 business days)</p>
                          </div>
                          <Check className={`h-5 w-5 ${paymentMethod === 'bank_transfer' ? 'text-cyan-400' : 'text-transparent'}`} />
                        </label>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={billingInfo.additionalNotes}
                        onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                        placeholder="Any special instructions or requirements..."
                        rows={3}
                        maxLength={500}
                        className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                      <p className="text-xs text-slate-400 mt-1">{billingInfo.additionalNotes?.length || 0}/500 characters</p>
                    </div>

                    {/* Marketing Preferences */}
                    <div className="bg-slate-950 rounded-lg p-6 border border-cyan-500/30">
                      <h3 className="text-lg font-bold text-white mb-4">Communication Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={billingInfo.newsletter}
                            onChange={(e) => handleInputChange('newsletter', e.target.checked ? 'true' : 'false')}
                            className="mt-1 w-5 h-5 text-cyan-600 bg-slate-900 border-slate-700 rounded focus:ring-cyan-500"
                          />
                          <span className="text-sm text-slate-300">Send me newsletters and product updates</span>
                        </label>
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={billingInfo.promotional}
                            onChange={(e) => handleInputChange('promotional', e.target.checked ? 'true' : 'false')}
                            className="mt-1 w-5 h-5 text-cyan-600 bg-slate-900 border-slate-700 rounded focus:ring-cyan-500"
                          />
                          <span className="text-sm text-slate-300">Send me promotional offers and discounts</span>
                        </label>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-slate-950 rounded-lg p-6 border border-cyan-500/30">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="mt-1 w-5 h-5 text-cyan-600 bg-slate-900 border-slate-700 rounded focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-300">
                          I have read and agree to the{' '}
                          <a href="/terms" target="_blank" className="text-cyan-400 hover:underline">Terms of Service</a>,{' '}
                          <a href="/privacy" target="_blank" className="text-cyan-400 hover:underline">Privacy Policy</a>, and{' '}
                          <a href="/sla" target="_blank" className="text-cyan-400 hover:underline">Service Level Agreement</a>
                          <span className="text-red-400"> *</span>
                        </span>
                      </label>
                    </div>
                  </form>

                  <div className="mt-8 flex space-x-4">
                    <button
                      onClick={handlePreviousStep}
                      className="flex-1 bg-slate-800 text-white px-6 py-4 rounded-lg font-bold hover:bg-slate-700 transition-all flex items-center justify-center"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Back
                    </button>
                    <button
                      onClick={handleCompleteOrder}
                      disabled={!agreeToTerms || processing}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-4 rounded-lg font-bold hover:from-cyan-500 hover:to-teal-500 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          Complete Order - {formatCurrency(calculateTotal())}
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <style>{invoicePrintStyles}</style>
                  <div id="invoice-print-area" className="bg-slate-950 rounded-2xl border border-cyan-500/40 p-6 md:p-10 text-left">
                    <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-slate-800 pb-6">
                      <div>
                        <p className="text-xs tracking-[0.4em] uppercase text-cyan-400">Order Confirmed</p>
                        <h2 className="text-3xl font-bold text-white mt-3 flex flex-wrap items-center gap-2">
                          <Check className="h-8 w-8 text-green-400" />
                          Proforma Invoice #{invoiceNumber}
                        </h2>
                        <p className="text-sm text-slate-400 mt-2">
                          Save or download this invoice for your records. Complete the payment to activate your BIDUA cloud resources.
                        </p>
                      </div>
                      <div className="space-y-3 text-right">
                        <div>
                          <p className="text-xs uppercase text-slate-400">Invoice Date</p>
                          <p className="text-lg font-semibold text-white">{invoiceDateDisplay}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-400">Due Date</p>
                          <p className="text-lg font-semibold text-white">{dueDateDisplay}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-400">Status</p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-sm font-semibold">
                            Pending Payment
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Pay To</p>
                        <p className="text-lg font-semibold text-white mb-1">BIDUA Industries Pvt Ltd</p>
                        {payToLines.map((line, idx) => (
                          <p key={`${line}-${idx}`} className="text-sm text-slate-300">{line}</p>
                        ))}
                        <div className="mt-4 space-y-1 text-sm text-slate-300">
                          <p><span className="text-slate-500">PAN:</span> {payToFinancials.pan}</p>
                          <p><span className="text-slate-500">A/C Name:</span> {payToFinancials.accountName}</p>
                          <p><span className="text-slate-500">A/C Number:</span> {payToFinancials.accountNumber}</p>
                          <p><span className="text-slate-500">IFSC:</span> {payToFinancials.ifsc}</p>
                          <p><span className="text-slate-500">GSTIN:</span> {payToFinancials.gstin}</p>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Invoiced To</p>
                        {billingLines.map((line, idx) => (
                          <p key={`${line}-${idx}`} className="text-sm text-slate-300">{line}</p>
                        ))}
                        <div className="mt-4 text-sm text-slate-300 space-y-1">
                          <p><span className="text-slate-500">GSTIN:</span> {billingInfo.taxId || 'Not Available'}</p>
                          {billingInfo.email && (
                            <p><span className="text-slate-500">Email:</span> {billingInfo.email}</p>
                          )}
                          {billingInfo.phone && (
                            <p><span className="text-slate-500">Phone:</span> {billingInfo.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-10">
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cyan-400" /> Invoice Items
                      </h3>
                      <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="min-w-full divide-y divide-slate-800 text-sm">
                          <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                              <th className="px-4 py-3 text-left">Description</th>
                              <th className="px-4 py-3 text-left">Item Type</th>
                              <th className="px-4 py-3 text-left">SAC Code</th>
                              <th className="px-4 py-3 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            <tr className="bg-slate-900/40">
                              <td className="px-4 py-4 text-white">
                                <p className="font-semibold">{invoiceItemDescription}</p>
                                <div className="text-xs text-slate-400 mt-2 space-y-1">
                                  <p>Datacenter: {datacenterLabel}</p>
                                  <p>Operating System: {osLabel}</p>
                                  <p>Managed Server: {managedServiceLabel}</p>
                                  <p>Specs: {serverConfig.vcpu} vCPU · {serverConfig.ram} GB RAM · {serverConfig.storage} GB Storage · {serverConfig.bandwidth} TB Bandwidth</p>
                                  <p>Quantity: {serverQuantity}</p>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-slate-300">Hosting</td>
                              <td className="px-4 py-4 text-slate-300">998315</td>
                              <td className="px-4 py-4 text-right text-white font-semibold">{formatCurrency(taxableAmount)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-8 space-y-2 text-sm">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Sub Total</span>
                        <span className="text-white font-semibold">{formatCurrency(subtotal)}</span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Promotional Discount</span>
                          <span className="text-emerald-400 font-semibold">-{formatCurrency(promoDiscount)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Taxable Amount</span>
                        <span className="text-white font-semibold">{formatCurrency(taxableAmount)}</span>
                      </div>
                    </div>

                    {isBillingCountryIndia && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-4">
                          <p className="text-xs uppercase text-slate-400">CGST (9%)</p>
                          <p className="text-lg font-semibold text-white mt-1">{formatCurrency(taxBreakdown.cgst)}</p>
                        </div>
                        <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-4">
                          <p className="text-xs uppercase text-slate-400">SGST (9%)</p>
                          <p className="text-lg font-semibold text-white mt-1">{formatCurrency(taxBreakdown.sgst)}</p>
                        </div>
                        <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-4">
                          <p className="text-xs uppercase text-slate-400">IGST (18%)</p>
                          <p className="text-lg font-semibold text-white mt-1">{formatCurrency(taxBreakdown.igst)}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 bg-slate-900/50 rounded-xl border border-cyan-500/20 p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase text-slate-400">Total Amount Incl. GST</p>
                        <p className="text-3xl font-bold text-cyan-400 mt-2">{formatCurrency(totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-slate-400">Amount in Words ({currencyInfo.code})</p>
                        <p className="text-sm text-white mt-2">{invoiceAmountInWords}</p>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                        <p className="text-xs uppercase text-slate-400 mb-1">Funds Applied</p>
                        <p className="text-lg font-semibold text-white">{formatCurrency(fundsApplied)}</p>
                        <p className="text-xs text-slate-500 mt-1">No credits applied to this invoice.</p>
                      </div>
                      <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-5">
                        <p className="text-xs uppercase text-slate-400 mb-1">Balance</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(balanceAmount)}</p>
                        <p className="text-xs text-slate-500 mt-1">Please pay the balance to activate your services.</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="text-sm font-semibold text-white mb-3">Transaction History</h4>
                      <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="min-w-full divide-y divide-slate-800 text-sm">
                          <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                              <th className="px-4 py-3 text-left">Transaction Date</th>
                              <th className="px-4 py-3 text-left">Gateway</th>
                              <th className="px-4 py-3 text-left">Transaction ID</th>
                              <th className="px-4 py-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-4 py-4 text-slate-400" colSpan={4}>
                                No Related Transactions Found
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-8 text-xs text-slate-500 space-y-2">
                      <p>Make payments via NEFT/RTGS or UPI to the account mentioned above. Once payment is received, your server is provisioned instantly.</p>
                      <p>This invoice is generated digitally by BIDUA Industries Pvt Ltd, Noida, India.</p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-4">
                    <button
                      onClick={handleDownloadInvoice}
                      className="flex-1 flex items-center justify-center gap-2 border border-cyan-500/40 text-cyan-200 px-6 py-4 rounded-lg font-semibold hover:bg-cyan-500/10 transition-all"
                    >
                      <FileDown className="h-5 w-5" /> Download Invoice (PDF)
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-4 rounded-lg font-bold hover:from-cyan-500 hover:to-teal-500 transition-all"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => navigate('/dashboard/servers')}
                      className="flex-1 bg-slate-800 text-white px-6 py-4 rounded-lg font-bold hover:bg-slate-700 transition-all"
                    >
                      View My Servers
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar - Hidden on Mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500/30 p-6 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
              
              {/* Server Details */}
              <div className="mb-6">
                <h4 className="font-bold text-white mb-3">{serverConfig.planName}</h4>
                <p className="text-sm text-cyan-400 mb-2">{serverConfig.planType}</p>
                {currentStep >=2 && serverQuantity > 1 && (
                  <p className="text-sm text-green-400 mb-2">Quantity: {serverQuantity}x</p>
                )}
              </div>

              {/* Configuration Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">» Datacenter:</span>
                  <span className="text-white">{datacenter === 'noida-india' ? 'India' : 'United Kingdom'}</span>
                </div>
                
                {operatingSystem && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Operating System:</span>
                    <span className="text-white text-right">{operatingSystem.replace(/-/g, ' ')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">» Managed Server:</span>
                  <span className="text-white text-right">
                    {managedService === 'self' ? 'I will manage the server myself' : 
                     managedService === 'basic' ? 'Basic Management' : 
                     managedService === 'premium' ? 'Premium Management' : 'Self-managed'}
                  </span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Base Plan:</span>
                  <span className="text-white">{formatCurrency(serverConfig.monthlyPrice * (currentStep >= 2 ? serverQuantity : 1))}</span>
                </div>

                {/* Add-ons */}
                {extraStorage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Extra Storage ({extraStorage} GB):</span>
                    <span className="text-white">
                      {formatCurrency((extraStorage * (getAddonBySlug('extra-storage')?.price || 2)) * (currentStep >= 2 ? serverQuantity : 1))}
                    </span>
                  </div>
                )}

                {extraBandwidth > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Extra Bandwidth ({extraBandwidth} TB):</span>
                    <span className="text-white">
                      {formatCurrency((extraBandwidth * (getAddonBySlug('extra-bandwidth')?.price || 100)) * (currentStep >= 2 ? serverQuantity : 1))}
                    </span>
                  </div>
                )}

                {additionalIPv4 > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Additional IPv4 ({additionalIPv4}x):</span>
                    <span className="text-white">{formatCurrency((additionalIPv4 * 200) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {pleskAddon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Plesk {pleskAddon === 'admin' ? 'Admin' : pleskAddon === 'pro' ? 'Pro' : 'Host'}:</span>
                    <span className="text-white">{formatCurrency((pleskAddon === 'admin' ? 950 : pleskAddon === 'pro' ? 1750 : 2650) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {backupStorage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Backup {backupStorage.toUpperCase()}:</span>
                    <span className="text-white">{formatCurrency((backupStorage === '100gb' ? 750 : backupStorage === '200gb' ? 1500 : backupStorage === '300gb' ? 2250 : backupStorage === '500gb' ? 3750 : 7500) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {sslCertificate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» SSL {
                      sslCertificate === 'essential' ? 'Essential' : 
                      sslCertificate === 'essential-wildcard' ? 'Essential Wildcard' :
                      sslCertificate === 'comodo' ? 'Comodo' :
                      sslCertificate === 'comodo-wildcard' ? 'Comodo Wildcard' :
                      sslCertificate === 'rapid' ? 'RapidSSL' : 'RapidSSL Wildcard'
                    }:</span>
                    <span className="text-white">{formatCurrency((
                      sslCertificate === 'essential' ? 225 : 
                      sslCertificate === 'essential-wildcard' ? 1162 : 
                      sslCertificate === 'comodo' ? 208 : 
                      sslCertificate === 'comodo-wildcard' ? 1084 : 
                      sslCertificate === 'rapid' ? 250 : 1371
                    ) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {supportPackage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Support {supportPackage === 'basic' ? 'Basic' : 'Premium'}:</span>
                    <span className="text-white">{formatCurrency((supportPackage === 'basic' ? 2500 : 7500) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {managedService !== 'self' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» {managedService === 'basic' ? 'Basic' : 'Premium'} Management:</span>
                    <span className="text-white">{formatCurrency((managedService === 'basic' ? 2000 : 5000) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {ddosProtection !== 'basic' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» DDoS {ddosProtection === 'advanced' ? 'Advanced' : 'Enterprise'}:</span>
                    <span className="text-white">{formatCurrency((ddosProtection === 'advanced' ? 1000 : 3000) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {/* Promo Code - Only show in step 2 */}
                {currentStep === 2 && (
                  <div className="pt-4 border-t border-slate-700">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Tag className="h-4 w-4 inline mr-1" />
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="WELCOME10"
                        className="flex-1 px-3 py-2 bg-slate-950 border border-cyan-500/30 rounded-lg text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromoCode}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-500 transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Try: WELCOME10 or SAVE20</p>
                  </div>
                )}
              </div>

              {/* Setup Fees */}
              <div className="border-t border-slate-700 pt-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Setup Fees:</span>
                <span className="text-white">{formatCurrency(0)}</span>
                </div>
                
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">{pricingQuote?.quote?.cycle_label || billingCycleInfo.label}:</span>
                  <span className="text-white font-semibold">{formatCurrency(calculateSubtotal())}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-400 mb-2">
                    <span>Promo Discount:</span>
                  <span>-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}

                {isBillingCountryIndia && (
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>IGST @ 18.00%:</span>
                  <span className="text-white">{formatCurrency(calculateTax())}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-slate-700 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg text-slate-300 font-bold">Total:</span>
                  <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400">{formatCurrency(calculateTotal())}</div>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-xs text-cyan-100 mb-2">
                  <strong>What happens next?</strong>
                </p>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Server deployment within 5 minutes</li>
                  <li>• Email with access credentials</li>
                  <li>• Invoice generated automatically</li>
                  <li>• 24/7 support available</li>
                </ul>
              </div>

              {/* Support Contact */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-2">Need help?</p>
                <p className="text-xs text-cyan-400">📞 +91 120 416 8464</p>
                <p className="text-xs text-cyan-400">✉️ support@bidua.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Summary Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-br from-cyan-900 to-slate-900 border-t-2 border-cyan-500 shadow-2xl z-40 safe-area-inset pb-safe">
          <button
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full px-4 py-4 flex items-center justify-between text-white touch-manipulation active:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Server className="h-6 w-6 text-cyan-400 flex-shrink-0" />
              <div className="text-left">
                <div className="text-xs text-slate-300">Total Amount</div>
                <div className="text-xl font-bold">{formatCurrency(calculateTotal())}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-cyan-300 font-medium">Summary</span>
              <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${showMobileSummary ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {showMobileSummary && (
            <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto animate-slideUp">
              {/* Server Details */}
              <div className="mb-4">
                <h4 className="font-bold text-white mb-2">{serverConfig.planName}</h4>
                <p className="text-sm text-cyan-400 mb-1">{serverConfig.planType}</p>
                {currentStep >= 2 && serverQuantity > 1 && (
                  <p className="text-sm text-green-400 mb-1">Quantity: {serverQuantity}x</p>
                )}
              </div>

              {/* Configuration Details */}
              <div className="space-y-2 mb-4 pb-4 border-b border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Datacenter:</span>
                  <span className="text-white">{datacenter === 'noida-india' ? 'India' : 'United Kingdom'}</span>
                </div>
                
                {operatingSystem && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">OS:</span>
                    <span className="text-white text-right">{operatingSystem.replace(/-/g, ' ')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Management:</span>
                  <span className="text-white text-right">
                    {managedService === 'self' ? 'Self-managed' : 
                     managedService === 'basic' ? 'Basic' : 
                     'Premium'}
                  </span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Base Plan:</span>
                  <span className="text-white">{formatCurrency(serverConfig.monthlyPrice * (currentStep >= 2 ? serverQuantity : 1))}</span>
                </div>

                {additionalIPv4 > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Additional IPv4 ({additionalIPv4}x):</span>
                    <span className="text-white">{formatCurrency((additionalIPv4 * 200) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {pleskAddon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Plesk {pleskAddon === 'admin' ? 'Admin' : pleskAddon === 'pro' ? 'Pro' : 'Host'}:</span>
                    <span className="text-white">{formatCurrency((pleskAddon === 'admin' ? 950 : pleskAddon === 'pro' ? 1750 : 2650) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {backupStorage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Backup {backupStorage.toUpperCase()}:</span>
                    <span className="text-white">{formatCurrency((backupStorage === '100gb' ? 750 : backupStorage === '200gb' ? 1500 : backupStorage === '300gb' ? 2250 : backupStorage === '500gb' ? 3750 : 7500) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {sslCertificate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">SSL Certificate:</span>
                    <span className="text-white">{formatCurrency((sslCertificate === 'essential' ? 225 : sslCertificate === 'essential-wildcard' ? 1162 : sslCertificate === 'comodo' ? 208 : sslCertificate === 'comodo-wildcard' ? 1084 : sslCertificate === 'rapid' ? 250 : 1371) * (currentStep >= 2 ? serverQuantity : 1))}/mo</span>
                  </div>
                )}

                {supportPackage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Support {supportPackage === 'basic' ? 'Basic' : 'Premium'}:</span>
                    <span className="text-white">{formatCurrency((supportPackage === 'basic' ? 2500 : 7500) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {managedService !== 'self' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{managedService === 'basic' ? 'Basic' : 'Premium'} Management:</span>
                    <span className="text-white">{formatCurrency((managedService === 'basic' ? 2000 : 5000) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {ddosProtection !== 'basic' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">DDoS {ddosProtection === 'advanced' ? 'Advanced' : 'Enterprise'}:</span>
                    <span className="text-white">{formatCurrency((ddosProtection === 'advanced' ? 1000 : 3000) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-cyan-500/30 pt-3 mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">{pricingQuote?.quote?.cycle_label || billingCycleInfo.label}:</span>
                  <span className="text-white font-semibold">{formatCurrency(calculateSubtotal())}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-400 mb-2">
                    <span>Promo Discount:</span>
                    <span>-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}

                {isBillingCountryIndia && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">IGST @ 18.00%:</span>
                    <span className="text-white">{formatCurrency(calculateTax())}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-950 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-cyan-400 font-bold">Total:</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              {/* Support Contact */}
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Need help?</p>
                <div className="flex justify-between text-xs">
                  <span className="text-cyan-400">📞 +91 120 416 8464</span>
                  <span className="text-cyan-400">✉️ support@bidua.com</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sticky Order Summary Footer - Similar to Calculator */}
        <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-gradient-to-br from-cyan-900 to-slate-900 border-t-2 border-cyan-500 shadow-2xl z-40 safe-area-inset">
          <button
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full px-4 py-4 flex items-center justify-between text-white touch-manipulation active:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Server className="h-6 w-6 text-cyan-400 flex-shrink-0" />
              <div className="text-left">
                <div className="text-xs text-slate-300">Total Price</div>
                <div className="text-xl font-bold">{formatCurrency(calculateTotal())}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-cyan-300 font-medium">Details</span>
              <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${showMobileSummary ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {showMobileSummary && (
            <div className="px-4 pb-4 max-h-[70vh] overflow-y-auto animate-slideUp scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-slate-800">
              {/* Server Details Header */}
              <div className="mb-4 pb-3 border-b border-cyan-500/30">
                <h4 className="font-bold text-white text-base mb-1">{serverConfig.planName}</h4>
                <p className="text-xs text-cyan-400 mb-1">{serverConfig.planType}</p>
                {currentStep >= 2 && serverQuantity > 1 && (
                  <p className="text-xs text-green-400">Quantity: {serverQuantity}x Servers</p>
                )}
              </div>

              {/* Configuration Details */}
              <div className="space-y-2 mb-4 pb-3 border-b border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">» Datacenter:</span>
                  <span className="text-white">{datacenter === 'noida-india' ? 'India (Noida)' : 'United Kingdom'}</span>
                </div>
                {operatingSystem && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Operating System:</span>
                    <span className="text-white">{operatingSystem.replace(/-/g, ' ')}</span>
                  </div>
                )}
                {pleskAddon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Control Panel:</span>
                    <span className="text-white">Plesk {pleskAddon === 'admin' ? 'Admin' : pleskAddon === 'pro' ? 'Pro' : 'Host'}</span>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 mb-4">
                <h5 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2">Configuration & Add-ons</h5>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">» Base Plan:</span>
                  <span className="text-white">{formatCurrency(serverConfig.monthlyPrice * (currentStep >= 2 ? serverQuantity : 1))}</span>
                </div>

                {additionalIPv4 > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Additional IPv4 ({additionalIPv4}x):</span>
                    <span className="text-white">{formatCurrency((additionalIPv4 * 200) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {extraStorage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Extra Storage ({extraStorage} GB):</span>
                    <span className="text-white">{formatCurrency((extraStorage * (getAddonBySlug('extra-storage')?.price || 2)) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {extraBandwidth > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Extra Bandwidth ({extraBandwidth} TB):</span>
                    <span className="text-white">{formatCurrency((extraBandwidth * (getAddonBySlug('extra-bandwidth')?.price || 100)) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {pleskAddon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Plesk {pleskAddon === 'admin' ? 'Admin' : pleskAddon === 'pro' ? 'Pro' : 'Host'}:</span>
                    <span className="text-white">{formatCurrency((pleskAddon === 'admin' ? 950 : pleskAddon === 'pro' ? 1750 : 2650) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {backupStorage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» Backup Storage {backupStorage.toUpperCase()}:</span>
                    <span className="text-white">{formatCurrency((backupStorage === '100gb' ? 750 : backupStorage === '200gb' ? 1500 : backupStorage === '300gb' ? 2250 : backupStorage === '500gb' ? 3750 : 7500) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {sslCertificate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» SSL {
                      sslCertificate === 'essential' ? 'Essential' : 
                      sslCertificate === 'essential-wildcard' ? 'Essential Wildcard' :
                      sslCertificate === 'comodo' ? 'Comodo' :
                      sslCertificate === 'comodo-wildcard' ? 'Comodo Wildcard' :
                      sslCertificate === 'rapid' ? 'RapidSSL' : 'RapidSSL Wildcard'
                    }:</span>
                    <span className="text-white">{formatCurrency((
                      sslCertificate === 'essential' ? 225 : 
                      sslCertificate === 'essential-wildcard' ? 1162 : 
                      sslCertificate === 'comodo' ? 208 : 
                      sslCertificate === 'comodo-wildcard' ? 1084 : 
                      sslCertificate === 'rapid' ? 250 : 1371
                    ) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {supportPackage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» {supportPackage === 'basic' ? 'Basic' : 'Premium'} Support:</span>
                    <span className="text-white">{formatCurrency((supportPackage === 'basic' ? 2500 : 7500) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {managedService !== 'self' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» {managedService === 'basic' ? 'Basic' : 'Premium'} Management:</span>
                    <span className="text-white">{formatCurrency((managedService === 'basic' ? 2000 : 5000) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}

                {ddosProtection !== 'basic' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">» DDoS {ddosProtection === 'advanced' ? 'Advanced' : 'Enterprise'}:</span>
                    <span className="text-white">{formatCurrency((ddosProtection === 'advanced' ? 1000 : 3000) * (currentStep >= 2 ? serverQuantity : 1))}</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-slate-700 pt-3 mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Setup Fees:</span>
                  <span className="text-white">{formatCurrency(0)}</span>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">{pricingQuote?.quote?.cycle_label || billingCycleInfo.label}:</span>
                  <span className="text-white font-semibold">{formatCurrency(calculateSubtotal())}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-400 mb-2">
                    <span>Promo Discount:</span>
                    <span>-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}

                {isBillingCountryIndia && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">IGST @ 18.00%:</span>
                    <span className="text-white">{formatCurrency(calculateTax())}</span>
                  </div>
                )}
              </div>

              {/* Total with highlight */}
              <div className="bg-slate-950 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-cyan-400 font-bold">Total:</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              {/* What's Next Info */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mb-3">
                <p className="text-xs text-cyan-100 font-semibold mb-1">What happens next?</p>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Server deployment within 5 minutes</li>
                  <li>• Email with access credentials</li>
                  <li>• Invoice generated automatically</li>
                  <li>• 24/7 support available</li>
                </ul>
              </div>

              {/* Support Contact */}
              <div className="pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-2">Need help?</p>
                <div className="flex flex-col space-y-1 text-xs">
                  <span className="text-cyan-400">📞 +91 120 416 8464</span>
                  <span className="text-cyan-400">✉️ support@bidua.com</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
