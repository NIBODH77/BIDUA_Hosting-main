import { DocLayout } from '../../../components/docs/DocLayout';
import { Package, Layers, DollarSign, Grid3x3 } from 'lucide-react';

export function PlansAPI() {
  return (
    <DocLayout
      title="Plans & Pricing API"
      description="API documentation for hosting plans, pricing, addons, and pricing calculations."
      breadcrumbs={[{ label: 'API' }, { label: 'Plans' }]}
      prevPage={{ title: 'Authentication API', path: '/docs/api/auth' }}
      nextPage={{ title: 'Orders API', path: '/docs/api/orders' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Plans & Pricing Overview</h2>
          <p className="text-slate-700 mb-4">
            The Plans API provides access to hosting plans, pricing information, addons, and pricing calculations with tax rates for different countries.
          </p>
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
            <div>
              <h3 className="font-semibold text-slate-900">Public Endpoints</h3>
              <p className="text-slate-700 text-sm">These endpoints don't require authentication and return cached public data</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Rate Limiting</h3>
              <p className="text-slate-700 text-sm">Pricing endpoints are rate-limited to prevent abuse. Implement caching on frontend.</p>
            </div>
          </div>
        </section>

        {/* List Plans */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <Package className="h-6 w-6 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">List Hosting Plans</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/plans
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Query Parameters</h3>
              <div className="bg-slate-50 rounded p-3 space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold">type</span> (optional) - Filter by plan type: vps, dedicated, cloud</div>
                <div><span className="font-semibold">active_only</span> (optional) - Boolean to show only active plans</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "plans": [
    {
      "id": 1,
      "name": "VPS Starter",
      "type": "vps",
      "description": "Entry-level VPS perfect for small projects",
      "base_price": 4.99,
      "cpu_cores": 1,
      "ram_gb": 1,
      "storage_gb": 25,
      "bandwidth_gb": 100,
      "os_options": ["Ubuntu 22.04", "CentOS 7", "Debian 11"],
      "is_active": true,
      "features": ["99.9% Uptime", "Free Backups", "DDoS Protection"]
    },
    {
      "id": 2,
      "name": "VPS Professional",
      "type": "vps",
      "description": "High-performance VPS for growing businesses",
      "base_price": 9.99,
      "cpu_cores": 2,
      "ram_gb": 4,
      "storage_gb": 80,
      "bandwidth_gb": 500,
      "os_options": ["Ubuntu 22.04", "CentOS 7", "Debian 11"],
      "is_active": true,
      "features": ["99.95% Uptime", "Free Backups", "DDoS Protection", "24/7 Support"]
    }
  ],
  "total": 12,
  "count": 2
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Get Single Plan */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Get Plan Details</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/plans/{'{plan_id}'}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Path Parameters</h3>
              <div className="bg-slate-50 rounded p-3 space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold">plan_id</span> - Integer ID of the plan</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "id": 1,
  "name": "VPS Starter",
  "type": "vps",
  "description": "Entry-level VPS perfect for small projects",
  "base_price": 4.99,
  "cpu_cores": 1,
  "ram_gb": 1,
  "storage_gb": 25,
  "bandwidth_gb": 100,
  "os_options": ["Ubuntu 22.04", "CentOS 7", "Debian 11"],
  "datacenter_options": ["US-East", "EU-West", "APAC-Singapore"],
  "is_active": true,
  "features": ["99.9% Uptime", "Free Backups", "DDoS Protection"],
  "pricing_breakdown": {
    "monthly": 4.99,
    "quarterly": 14.97,
    "annual": 59.88,
    "biennial": 119.76,
    "triennial": 179.64
  }
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="font-semibold text-red-900 text-sm">404 Not Found</p>
                <p className="text-red-800 text-sm">Plan with specified ID does not exist</p>
              </div>
            </div>
          </div>
        </section>

        {/* List Addons */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Layers className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">List Available Addons</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/addons
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "addons": [
    {
      "id": 1,
      "name": "Extra RAM",
      "description": "Add 1GB of RAM",
      "price": 2.00,
      "icon": "memory",
      "category": "resources"
    },
    {
      "id": 2,
      "name": "Extra Storage",
      "description": "Add 20GB of storage",
      "price": 1.50,
      "icon": "storage",
      "category": "resources"
    },
    {
      "id": 3,
      "name": "SSL Certificate",
      "description": "Premium SSL certificate for domain",
      "price": 5.00,
      "icon": "lock",
      "category": "security"
    },
    {
      "id": 4,
      "name": "Backups Daily",
      "description": "Automatic daily backups",
      "price": 3.00,
      "icon": "backup",
      "category": "features"
    },
    {
      "id": 5,
      "name": "Load Balancer",
      "description": "High-availability load balancer",
      "price": 10.00,
      "icon": "scale",
      "category": "performance"
    }
  ],
  "total": 5
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Calculate Price */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Calculate Pricing</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/pricing/calculate
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "plan_id": 1,
  "billing_cycle": "annual",
  "country_id": 1,
  "addons": [
    {
      "addon_id": 1,
      "quantity": 2
    },
    {
      "addon_id": 3,
      "quantity": 1
    }
  ],
  "currency": "USD",
  "promo_code": "SAVE10"  // Optional
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "plan": {
    "id": 1,
    "name": "VPS Starter",
    "base_price": 4.99
  },
  "billing_cycle": "annual",
  "billing_cycle_multiplier": 12,
  "subtotal": 59.88,
  "addons": [
    {
      "addon_id": 1,
      "name": "Extra RAM",
      "quantity": 2,
      "unit_price": 2.00,
      "total": 4.00
    },
    {
      "addon_id": 3,
      "name": "SSL Certificate",
      "quantity": 1,
      "unit_price": 5.00,
      "total": 5.00
    }
  ],
  "addons_total": 9.00,
  "subtotal_with_addons": 68.88,
  "discount": {
    "code": "SAVE10",
    "percentage": 10,
    "amount": 6.89
  },
  "subtotal_after_discount": 62.00,
  "tax": {
    "rate": 18,
    "amount": 11.16,
    "country": "India"
  },
  "grand_total": 73.16,
  "currency": "USD"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Billing Cycles</h3>
              <div className="bg-slate-50 rounded p-3 space-y-1 text-sm text-slate-700">
                <div>• <span className="font-semibold">monthly</span> - Standard monthly billing</div>
                <div>• <span className="font-semibold">quarterly</span> - 3 months (typically 8% discount)</div>
                <div>• <span className="font-semibold">annual</span> - 12 months (typically 15% discount)</div>
                <div>• <span className="font-semibold">biennial</span> - 24 months (typically 20% discount)</div>
                <div>• <span className="font-semibold">triennial</span> - 36 months (typically 25% discount)</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">404 Not Found</p>
                  <p className="text-red-800 text-sm">Plan or country with specified ID does not exist</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">400 Bad Request</p>
                  <p className="text-red-800 text-sm">Invalid promo code or billing cycle</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Countries */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Grid3x3 className="h-6 w-6 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Get Countries & Tax Info</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/countries
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "countries": [
    {
      "id": 1,
      "name": "United States",
      "country_code": "US",
      "currency": "USD",
      "tax_rate": 0
    },
    {
      "id": 2,
      "name": "United Kingdom",
      "country_code": "GB",
      "currency": "GBP",
      "tax_rate": 20
    },
    {
      "id": 3,
      "name": "India",
      "country_code": "IN",
      "currency": "INR",
      "tax_rate": 18
    },
    {
      "id": 4,
      "name": "Germany",
      "country_code": "DE",
      "currency": "EUR",
      "tax_rate": 19
    }
  ],
  "total": 195
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Examples */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pricing Examples</h2>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Example 1: US Monthly Purchase</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between"><span>VPS Starter (monthly)</span><span className="font-semibold">$4.99</span></div>
                <div className="flex justify-between"><span>Tax (0%)</span><span className="font-semibold">$0.00</span></div>
                <div className="flex justify-between border-t pt-2"><span>Total</span><span className="font-semibold">$4.99</span></div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Example 2: India Annual Purchase</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between"><span>VPS Professional (annual)</span><span className="font-semibold">₹7,194</span></div>
                <div className="flex justify-between"><span>Extra RAM × 2</span><span className="font-semibold">₹288</span></div>
                <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">₹7,482</span></div>
                <div className="flex justify-between"><span>Tax (18%)</span><span className="font-semibold">₹1,346.76</span></div>
                <div className="flex justify-between border-t pt-2"><span>Total</span><span className="font-semibold">₹8,828.76</span></div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Example 3: UK Biennial with Discount</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between"><span>Dedicated Server (biennial)</span><span className="font-semibold">£239.80</span></div>
                <div className="flex justify-between"><span>Discount (SAVE20)</span><span className="font-semibold">-£47.96</span></div>
                <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">£191.84</span></div>
                <div className="flex justify-between"><span>Tax (20%)</span><span className="font-semibold">£38.37</span></div>
                <div className="flex justify-between border-t pt-2"><span>Total</span><span className="font-semibold">£230.21</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Continue with Orders</h2>
          <p className="text-slate-700 mb-6">
            Once you understand pricing, learn how to create orders and process payments.
          </p>
          <div className="space-y-3">
            <a
              href="/docs/api/orders"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              View Orders API →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
