import { useState, useEffect } from 'react';
import { Server, Zap, Database, Cpu, MemoryStick, HardDrive, Network, Calculator, RefreshCw, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MobileDropdown } from './MobileDropdown';
import { pricingService, type HostingPlan, type BillingCycle as ApiBillingCycle } from '../../lib/pricingService';

type PlanType = 'general_purpose' | 'cpu_optimized' | 'memory_optimized';
type BillingCycle = 'monthly' | 'quarterly' | 'semiannually' | 'annually' | 'biennially' | 'triennially';

interface PlanConfig {
  ram: number;
  vcpu: number;
  storage: number;
  basePrice: number;
}

const planTypeInfo = {
  general_purpose: {
    name: 'General Purpose VM',
    icon: Server,
    color: 'cyan',
    description: 'Balanced resources for web apps'
  },
  cpu_optimized: {
    name: 'CPU Optimized VM',
    icon: Zap,
    color: 'orange',
    description: 'Dedicated CPU for compute tasks'
  },
  memory_optimized: {
    name: 'Memory Optimized VM',
    icon: Database,
    color: 'green',
    description: 'High RAM for databases'
  }
};

const storageOptions = [0, 50, 100, 200, 300, 500];
const bandwidthOptions = [0, 1, 2, 3, 5, 10];

export function PlanCalculator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [planType, setPlanType] = useState<PlanType>('general_purpose');
  const [selectedRam, setSelectedRam] = useState<number>(8);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [extraStorage, setExtraStorage] = useState<number>(0);
  const [extraBandwidth, setExtraBandwidth] = useState<number>(0);
  const [showPriceSummary, setShowPriceSummary] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('plan');
  
  // Dynamic pricing state
  const [plans, setPlans] = useState<HostingPlan[]>([]);
  const [billingCyclesData, setBillingCyclesData] = useState<ApiBillingCycle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load pricing data from API
  useEffect(() => {
    async function loadPricingData() {
      try {
  console.log('🔄 [Calculator] Fetching pricing data from API...');
        const [plansData, cyclesData] = await Promise.all([
          pricingService.getPlans(),
          pricingService.getBillingCycles()
        ]);
        console.log('✅ [Calculator] Received plans from database:', {
          totalPlans: plansData.length,
          planTypes: {
            general_purpose: plansData.filter(p => p.plan_type === 'general_purpose').length,
            cpu_optimized: plansData.filter(p => p.plan_type === 'cpu_optimized').length,
            memory_optimized: plansData.filter(p => p.plan_type === 'memory_optimized').length,
          },
          sampleCPUOptimized: plansData.find(p => p.plan_type === 'cpu_optimized' && p.name === 'C.8GB') ? {
            name: plansData.find(p => p.plan_type === 'cpu_optimized' && p.name === 'C.8GB')!.name,
            cpu: plansData.find(p => p.plan_type === 'cpu_optimized' && p.name === 'C.8GB')!.cpu_cores,
            ram: plansData.find(p => p.plan_type === 'cpu_optimized' && p.name === 'C.8GB')!.ram_gb,
          } : null
        });
        console.log('💰 [Calculator] Billing cycles:', cyclesData);
        setPlans(plansData);
        setBillingCyclesData(cyclesData);
        
  // Success banner
  console.log('%c✅ CALCULATOR DATA LOADED FROM DATABASE', 'background: #3b82f6; color: white; padding: 8px 16px; font-weight: bold; font-size: 14px;');
  console.log('%cAll configurations are now fetched dynamically from PostgreSQL!', 'color: #3b82f6; font-weight: bold;');
      } catch (error) {
  console.error('❌ [Calculator] Failed to load pricing data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPricingData();
  }, []);
  
  // Build plan configurations from API data
  const planConfigurations: Record<PlanType, Record<number, PlanConfig>> = {
    general_purpose: {},
    cpu_optimized: {},
    memory_optimized: {}
  };
  
  plans.forEach(plan => {
    const config: PlanConfig = {
      ram: plan.ram_gb,
      vcpu: plan.cpu_cores,
      storage: plan.storage_gb,
      basePrice: parseFloat(plan.monthly_price)
    };
    planConfigurations[plan.plan_type as PlanType][plan.ram_gb] = config;
  });
  
  // Build billing cycles from API data
  const billingCycles: Record<BillingCycle, { name: string; months: number; discount: number }> = {
    monthly: { name: 'Monthly', months: 1, discount: 5 },
    quarterly: { name: 'Quarterly', months: 3, discount: 10 },
    semiannually: { name: 'Semi-Annually', months: 6, discount: 15 },
    annually: { name: 'Annually', months: 12, discount: 20 },
    biennially: { name: 'Biennially', months: 24, discount: 25 },
    triennially: { name: 'Triennially', months: 36, discount: 35 }
  };
  
  billingCyclesData.forEach(cycle => {
    if (cycle.id in billingCycles) {
      billingCycles[cycle.id as BillingCycle] = {
        name: cycle.name,
        months: cycle.months,
        discount: cycle.discount
      };
    }
  });

  const availableRamOptions = Object.keys(planConfigurations[planType]).map(Number).sort((a, b) => a - b);
  const currentConfig = planConfigurations[planType][selectedRam];
  const cycleInfo = billingCycles[billingCycle];
  
  // Log selected configuration for debugging
  useEffect(() => {
    if (plans.length > 0 && currentConfig) {
      console.log(`🎯 [Calculator] Selected Configuration:`, {
        planType,
        selectedRam: `${selectedRam}GB`,
        vcpu: currentConfig.vcpu,
        ram: currentConfig.ram,
        storage: currentConfig.storage,
        basePrice: currentConfig.basePrice,
        billingCycle,
        extraStorage: `${extraStorage}GB`,
        extraBandwidth: `${extraBandwidth}TB`
      });
    }
  }, [planType, selectedRam, billingCycle, extraStorage, extraBandwidth, plans.length, currentConfig]);
  
  const handleDeploy = () => {
    const selectedPlan = plans.find(p => p.ram_gb === selectedRam);
    if (!selectedPlan) return;

    const serverConfig = {
      planName: selectedPlan.name,
      planType,
      vcpu: selectedPlan.cpu_cores,
      ram: selectedRam,
      storage: selectedPlan.storage_gb + extraStorage,
      bandwidth: selectedPlan.bandwidth_gb / 1000 + extraBandwidth,
      billingCycle,
      monthlyPrice: Math.round(pricing.effectiveMonthly),
      totalPrice: Math.round(pricing.totalAfterDiscount),
      discount: pricing.discount,
      extraStorage,
      extraBandwidth
    };

    if (user) {
      navigate('/checkout', { state: { serverConfig } });
    } else {
      navigate(`/login?redirect=${encodeURIComponent('/checkout')}`, { 
        state: { serverConfig } 
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-white text-xl">Loading pricing data...</div>
      </div>
    );
  }
  
  // Handle case where config doesn't exist
  if (!currentConfig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-white text-xl">No plans available</div>
      </div>
    );
  }

  const STORAGE_PRICE_PER_GB = 2;
  const BANDWIDTH_PRICE_PER_TB = 100;

  const calculatePricing = () => {
    const baseMonthly = currentConfig.basePrice;
    const storageAddon = extraStorage * STORAGE_PRICE_PER_GB;
    const bandwidthAddon = extraBandwidth * BANDWIDTH_PRICE_PER_TB;

    const monthlyTotal = baseMonthly + storageAddon + bandwidthAddon;
    const totalBeforeDiscount = monthlyTotal * cycleInfo.months;
    const discount = (totalBeforeDiscount * cycleInfo.discount) / 100;
    const totalAfterDiscount = totalBeforeDiscount - discount;
    const effectiveMonthly = totalAfterDiscount / cycleInfo.months;

    return {
      baseMonthly,
      storageAddon,
      bandwidthAddon,
      monthlyTotal,
      totalBeforeDiscount,
      discount,
      totalAfterDiscount,
      effectiveMonthly,
      savingsPercent: cycleInfo.discount
    };
  };

  const pricing = calculatePricing();

  const handleReset = () => {
    setPlanType('general_purpose');
    setSelectedRam(8);
    setBillingCycle('monthly');
    setExtraStorage(0);
    setExtraBandwidth(0);
    setExpandedSection('plan');
  };

  const planInfo = planTypeInfo[planType];
  const PlanIcon = planInfo.icon;

  const planTypeOptions = (Object.keys(planTypeInfo) as PlanType[]).map(type => ({
    value: type,
    label: planTypeInfo[type].name,
    sublabel: planTypeInfo[type].description,
    icon: planTypeInfo[type].icon
  }));

  const ramOptions = availableRamOptions.map(ram => {
    const config = planConfigurations[planType][ram];
    return {
      value: ram,
      label: `${ram}GB RAM`,
      sublabel: `${config.vcpu} vCPU • ${config.storage}GB Storage • ₹${config.basePrice.toLocaleString()}/mo`
    };
  });

  const billingOptions = (Object.keys(billingCycles) as BillingCycle[]).map(cycle => {
    const info = billingCycles[cycle];
    return {
      value: cycle,
      label: info.name,
      sublabel: info.discount > 0 ? `Save ${info.discount}%` : 'No discount'
    };
  });

  const storageDropdownOptions = storageOptions.map(storage => ({
    value: storage,
    label: storage === 0 ? 'No extra storage' : `+${storage}GB`,
    sublabel: storage > 0 ? `₹${(storage * STORAGE_PRICE_PER_GB).toLocaleString()}/month` : undefined
  }));

  const bandwidthDropdownOptions = bandwidthOptions.map(bandwidth => ({
    value: bandwidth,
    label: bandwidth === 0 ? 'No extra bandwidth' : `+${bandwidth}TB`,
    sublabel: bandwidth > 0 ? `₹${(bandwidth * BANDWIDTH_PRICE_PER_TB).toLocaleString()}/month` : undefined
  }));

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center space-x-2 sm:space-x-3">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
            <span>Custom Server Calculator</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">Configure your perfect server and see real-time pricing</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 text-cyan-400 rounded-lg hover:bg-slate-700 active:bg-slate-600 transition-all border-2 border-cyan-500/30 hover:border-cyan-500/50 w-full sm:w-auto touch-manipulation min-h-[44px]"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="font-medium">Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-3 lg:space-y-4">
          <div className="bg-slate-900 rounded-xl border-2 border-cyan-500/30 overflow-hidden shadow-lg">
            <button
              onClick={() => toggleSection('plan')}
              className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-800/50 active:bg-slate-800 transition-all touch-manipulation min-h-[64px]"
            >
              <h3 className="text-lg lg:text-xl font-bold text-white flex items-center space-x-2">
                <Server className="h-5 w-5 text-cyan-400" />
                <span>Plan Type</span>
              </h3>
              <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${expandedSection === 'plan' ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-300 ease-in-out ${expandedSection === 'plan' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="px-4 pb-4 lg:px-6 lg:pb-6">
                <div className="block lg:hidden">
                  <MobileDropdown
                    options={planTypeOptions}
                    value={planType}
                    onChange={(value) => {
                      setPlanType(value as PlanType);
                      const firstRam = Object.keys(planConfigurations[value as PlanType])[0];
                      setSelectedRam(Number(firstRam));
                    }}
                    label="Select Plan Type"
                  />
                </div>

                <div className="hidden lg:grid lg:grid-cols-3 gap-4">
                  {(Object.keys(planTypeInfo) as PlanType[]).map((type) => {
                    const info = planTypeInfo[type];
                    const TypeIcon = info.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setPlanType(type);
                          const firstRam = Object.keys(planConfigurations[type])[0];
                          setSelectedRam(Number(firstRam));
                        }}
                        className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                          planType === type
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-2 border-cyan-500/30'
                        }`}
                      >
                        <TypeIcon className="h-8 w-8" />
                        <span className="font-semibold text-sm text-center">{info.name}</span>
                        <span className="text-xs opacity-80 text-center">{info.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border-2 border-cyan-500/30 overflow-hidden shadow-lg">
            <button
              onClick={() => toggleSection('ram')}
              className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-800/50 active:bg-slate-800 transition-all touch-manipulation min-h-[64px]"
            >
              <h3 className="text-lg lg:text-xl font-bold text-white flex items-center space-x-2">
                <MemoryStick className="h-5 w-5 text-cyan-400" />
                <span>RAM Configuration</span>
              </h3>
              <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${expandedSection === 'ram' ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-300 ease-in-out ${expandedSection === 'ram' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="px-4 pb-4 lg:px-6 lg:pb-6 space-y-4">
                <div className="block lg:hidden">
                  <MobileDropdown
                    options={ramOptions}
                    value={selectedRam}
                    onChange={(value) => setSelectedRam(value as number)}
                    label="Select RAM"
                  />
                </div>

                <div className="hidden lg:block">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select RAM: {selectedRam}GB
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={availableRamOptions.length - 1}
                    value={availableRamOptions.indexOf(selectedRam)}
                    onChange={(e) => setSelectedRam(availableRamOptions[parseInt(e.target.value)])}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    {availableRamOptions.map((ram) => (
                      <span key={ram}>{ram}GB</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-slate-800 p-3 rounded-lg border-2 border-cyan-500/20">
                    <Cpu className="h-5 w-5 text-cyan-400 mb-1" />
                    <div className="text-xs text-slate-400">vCPU Cores</div>
                    <div className="text-lg font-bold text-white">{currentConfig.vcpu}</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg border-2 border-green-500/20">
                    <MemoryStick className="h-5 w-5 text-green-400 mb-1" />
                    <div className="text-xs text-slate-400">RAM</div>
                    <div className="text-lg font-bold text-white">{currentConfig.ram}GB</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg border-2 border-orange-500/20">
                    <HardDrive className="h-5 w-5 text-orange-400 mb-1" />
                    <div className="text-xs text-slate-400">NVMe Storage</div>
                    <div className="text-lg font-bold text-white">{currentConfig.storage}GB</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg border-2 border-blue-500/20">
                    <Network className="h-5 w-5 text-blue-400 mb-1" />
                    <div className="text-xs text-slate-400">Bandwidth</div>
                    <div className="text-lg font-bold text-white">1TB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border-2 border-cyan-500/30 overflow-hidden shadow-lg">
            <button
              onClick={() => toggleSection('addons')}
              className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-800/50 active:bg-slate-800 transition-all touch-manipulation min-h-[64px]"
            >
              <h3 className="text-lg lg:text-xl font-bold text-white flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-cyan-400" />
                <span>Add-ons</span>
              </h3>
              <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${expandedSection === 'addons' ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-300 ease-in-out ${expandedSection === 'addons' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="px-4 pb-4 lg:px-6 lg:pb-6 space-y-4">
                <div className="block lg:hidden space-y-4">
                  <MobileDropdown
                    options={storageDropdownOptions}
                    value={extraStorage}
                    onChange={(value) => setExtraStorage(value as number)}
                    label="Extra Storage"
                  />
                  <MobileDropdown
                    options={bandwidthDropdownOptions}
                    value={extraBandwidth}
                    onChange={(value) => setExtraBandwidth(value as number)}
                    label="Extra Bandwidth"
                  />
                </div>

                <div className="hidden lg:block space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Extra Storage: +{extraStorage}GB (₹{STORAGE_PRICE_PER_GB}/GB/month)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={500}
                      step={50}
                      value={extraStorage}
                      onChange={(e) => setExtraStorage(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Extra Bandwidth: +{extraBandwidth}TB (₹{BANDWIDTH_PRICE_PER_TB}/TB/month)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={extraBandwidth}
                      onChange={(e) => setExtraBandwidth(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border-2 border-cyan-500/30 overflow-hidden shadow-lg">
            <button
              onClick={() => toggleSection('billing')}
              className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-800/50 active:bg-slate-800 transition-all touch-manipulation min-h-[64px]"
            >
              <h3 className="text-lg lg:text-xl font-bold text-white flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-cyan-400" />
                <span>Billing Cycle</span>
              </h3>
              <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${expandedSection === 'billing' ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-300 ease-in-out ${expandedSection === 'billing' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="px-4 pb-4 lg:px-6 lg:pb-6">
                <div className="block lg:hidden">
                  <MobileDropdown
                    options={billingOptions}
                    value={billingCycle}
                    onChange={(value) => setBillingCycle(value as BillingCycle)}
                    label="Select Billing Cycle"
                  />
                </div>

                <div className="hidden lg:grid lg:grid-cols-3 gap-3">
                  {(Object.keys(billingCycles) as BillingCycle[]).map((cycle) => {
                    const info = billingCycles[cycle];
                    return (
                      <button
                        key={cycle}
                        onClick={() => setBillingCycle(cycle)}
                        className={`p-3 rounded-lg transition-all ${
                          billingCycle === cycle
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-2 border-cyan-500/30'
                        }`}
                      >
                        <div className="font-semibold text-sm">{info.name}</div>
                        {info.discount > 0 && (
                          <div className={`text-xs mt-1 ${billingCycle === cycle ? 'opacity-80' : 'text-green-400'}`}>
                            Save {info.discount}%
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-gradient-to-br from-cyan-900 to-slate-900 rounded-xl p-6 border-2 border-cyan-500 shadow-xl shadow-cyan-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <PlanIcon className="h-6 w-6 text-cyan-400" />
                <span>Price Summary</span>
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Base Plan</span>
                  <span className="text-white font-semibold">₹{pricing.baseMonthly.toLocaleString()}/mo</span>
                </div>
                {pricing.storageAddon > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Extra Storage</span>
                    <span className="text-white font-semibold">₹{pricing.storageAddon.toLocaleString()}/mo</span>
                  </div>
                )}
                {pricing.bandwidthAddon > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Extra Bandwidth</span>
                    <span className="text-white font-semibold">₹{pricing.bandwidthAddon.toLocaleString()}/mo</span>
                  </div>
                )}
              </div>

              <div className="border-t border-cyan-500/30 pt-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Subtotal ({cycleInfo.months} months)</span>
                  <span className="text-white">₹{pricing.totalBeforeDiscount.toLocaleString()}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-400">Discount ({pricing.savingsPercent}%)</span>
                    <span className="text-green-400">-₹{pricing.discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-950 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-slate-300 text-sm">Total Price</span>
                  <span className="text-3xl font-bold text-white">₹{Math.round(pricing.totalAfterDiscount).toLocaleString()}</span>
                </div>
                <div className="text-sm text-cyan-400">
                  ₹{Math.round(pricing.effectiveMonthly).toLocaleString()}/month effective
                </div>
              </div>

              <button
                onClick={handleDeploy}
                className="block w-full text-center px-6 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-bold hover:from-cyan-400 hover:to-teal-400 active:from-cyan-600 active:to-teal-600 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
              >
                Deploy This Configuration
              </button>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 border-2 border-cyan-500/30">
              <h4 className="font-bold text-white mb-3">Comparison Across Cycles</h4>
              <div className="space-y-2 text-sm">
                {(Object.keys(billingCycles) as BillingCycle[]).map((cycle) => {
                  const info = billingCycles[cycle];
                  const cyclePrice = pricing.monthlyTotal * info.months;
                  const cycleDiscount = (cyclePrice * info.discount) / 100;
                  const finalPrice = cyclePrice - cycleDiscount;

                  return (
                    <div key={cycle} className={`flex justify-between p-2 rounded transition-colors ${billingCycle === cycle ? 'bg-cyan-600/20' : ''}`}>
                      <span className="text-slate-300">{info.name}</span>
                      <span className="text-white font-semibold">₹{Math.round(finalPrice).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-gradient-to-br from-cyan-900 to-slate-900 border-t-2 border-cyan-500 shadow-2xl z-40 safe-area-inset">
        <button
          onClick={() => setShowPriceSummary(!showPriceSummary)}
          className="w-full px-4 py-4 flex items-center justify-between text-white touch-manipulation active:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <PlanIcon className="h-6 w-6 text-cyan-400 flex-shrink-0" />
            <div className="text-left">
              <div className="text-xs text-slate-300">Total Price</div>
              <div className="text-xl font-bold">₹{Math.round(pricing.totalAfterDiscount).toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-cyan-300 font-medium">Details</span>
            <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${showPriceSummary ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {showPriceSummary && (
          <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto animate-slideUp">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Base Plan</span>
                <span className="text-white font-semibold">₹{pricing.baseMonthly.toLocaleString()}/mo</span>
              </div>
              {pricing.storageAddon > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Extra Storage (+{extraStorage}GB)</span>
                  <span className="text-white font-semibold">₹{pricing.storageAddon.toLocaleString()}/mo</span>
                </div>
              )}
              {pricing.bandwidthAddon > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Extra Bandwidth (+{extraBandwidth}TB)</span>
                  <span className="text-white font-semibold">₹{pricing.bandwidthAddon.toLocaleString()}/mo</span>
                </div>
              )}
            </div>

            <div className="border-t border-cyan-500/30 pt-3 mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Subtotal ({cycleInfo.months} months)</span>
                <span className="text-white">₹{pricing.totalBeforeDiscount.toLocaleString()}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-400">Discount ({pricing.savingsPercent}%)</span>
                  <span className="text-green-400">-₹{pricing.discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-950 rounded-lg p-3 mb-3">
              <div className="text-xs text-cyan-400 mb-1">
                ₹{Math.round(pricing.effectiveMonthly).toLocaleString()}/month effective rate
              </div>
            </div>

            <button
              onClick={handleDeploy}
              className="block w-full text-center px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-bold hover:from-cyan-400 hover:to-teal-400 active:from-cyan-600 active:to-teal-600 transition-all shadow-lg touch-manipulation"
            >
              Deploy This Configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
