const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface HostingPlan {
  id: number;
  name: string;
  description: string;
  plan_type: string;
  cpu_cores: number;
  ram_gb: number;
  storage_gb: number;
  bandwidth_gb: number;
  base_price: string;
  monthly_price: string;
  quarterly_price: string;
  annual_price: string;
  biennial_price: string;
  triennial_price: string;
  is_active: boolean;
  is_featured: boolean;
  features: string[];
  created_at: string;
  updated_at?: string;
}

export interface PlanType {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface BillingCycle {
  id: string;
  name: string;
  discount: number;
  months: number;
}

export interface PricingFilters {
  plan_types: PlanType[];
  billing_cycles: BillingCycle[];
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export const pricingService = {
  // Get all plans or filter by type
  async getPlans(planType?: string): Promise<HostingPlan[]> {
    const params = planType ? `?plan_type=${planType}` : '';
    return await fetchAPI(`/api/v1/pricing/plans${params}`);
  },

  // Get a specific plan by ID
  async getPlanById(id: number): Promise<HostingPlan> {
    return await fetchAPI(`/api/v1/pricing/plans/${id}`);
  },

  // Get all plan types
  async getPlanTypes(): Promise<PlanType[]> {
    return await fetchAPI('/api/v1/pricing/plan-types');
  },

  // Get all billing cycles
  async getBillingCycles(): Promise<BillingCycle[]> {
    return await fetchAPI('/api/v1/pricing/billing-cycles');
  },

  // Get all filters (plan types + billing cycles)
  async getFilters(): Promise<PricingFilters> {
    return await fetchAPI('/api/v1/pricing/filters');
  },
};
