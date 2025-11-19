import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

type BillingCycle = 'monthly' | 'quarterly' | 'semiannually' | 'annually' | 'biennially' | 'triennially';

interface PlanType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface MobileFiltersProps {
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  planTypes: PlanType[];
  billingCycles: Array<{ id: BillingCycle; name: string; discount: number }>;
}

export function MobileFilters({
  billingCycle,
  setBillingCycle,
  selectedType,
  setSelectedType,
  planTypes,
  billingCycles,
}: MobileFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedPlanType = planTypes.find(type => type.id === selectedType);
  const selectedCycle = billingCycles.find(c => c.id === billingCycle);

  return (
    <div className="md:hidden sticky top-0 z-40 bg-slate-900 border-b border-cyan-500/30 shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 flex items-center justify-between text-white"
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-cyan-400" />
          <div className="text-left">
            <div className="text-sm font-semibold">
              {selectedPlanType?.name}
            </div>
            <div className="text-xs text-slate-400">
              {selectedCycle?.name} • Save {selectedCycle?.discount}%
            </div>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-cyan-500/20 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-white mb-2 mt-4">
              Server Type
            </label>
            <div className="space-y-2">
              {planTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    selectedType === type.id
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-cyan-500/30'
                  }`}
                >
                  <type.icon className="h-5 w-5" />
                  <span className="text-sm">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Billing Cycle
            </label>
            <div className="space-y-2">
              {billingCycles.map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => {
                    setBillingCycle(cycle.id);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                    billingCycle === cycle.id
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-cyan-500/30'
                  }`}
                >
                  <span className="text-sm">{cycle.name}</span>
                  {cycle.discount > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      billingCycle === cycle.id ? 'bg-white/20' : 'bg-green-500/20 text-green-400'
                    }`}>
                      Save {cycle.discount}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(false)}
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-3 rounded-lg font-bold shadow-lg hover:from-cyan-500 hover:to-teal-500 transition-all mt-4"
          >
            Show Plans
          </button>
        </div>
      )}
    </div>
  );
}
