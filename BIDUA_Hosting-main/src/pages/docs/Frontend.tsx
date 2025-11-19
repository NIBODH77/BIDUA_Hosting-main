import { DocLayout } from '../../components/docs/DocLayout';
import { Layout, Palette, Package, Code, Zap, Share2 } from 'lucide-react';

export function Frontend() {
  return (
    <DocLayout
      title="Frontend Structure"
      description="Guide to BIDUA Hosting frontend organization, components, and development patterns."
      breadcrumbs={[{ label: 'Core' }, { label: 'Frontend' }]}
      prevPage={{ title: 'Backend Structure', path: '/docs/backend' }}
      nextPage={{ title: 'Database Schema', path: '/docs/database' }}
    >
      <div className="space-y-8">
        {/* Technology Stack */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-cyan-500" />
                Core Libraries
              </h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span><strong>React 18.3.1</strong> - UI framework with hooks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span><strong>TypeScript 5.5.3</strong> - Type safety</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span><strong>React Router 7.9.3</strong> - Client routing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span><strong>Vite 5.4.2</strong> - Build tool</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <Palette className="h-5 w-5 mr-2 text-purple-500" />
                Styling & UI
              </h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span><strong>Tailwind CSS 3.4.1</strong> - Utility styling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span><strong>Lucide React</strong> - Icon library</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span><strong>Modern CSS</strong> - Responsive design</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Directory Structure */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Directory Structure</h2>
          <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto text-sm">
            <pre className="text-green-400 font-mono">{`BIDUA_Hosting-main/
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles
│   ├── vite-env.d.ts        # Vite type definitions
│   ├── pages/
│   │   ├── Home.tsx          # Public homepage
│   │   ├── Pricing.tsx       # Pricing page
│   │   ├── Solutions.tsx     # Solutions page
│   │   ├── DedicatedServers.tsx # Server offerings
│   │   ├── Contact.tsx       # Contact page
│   │   ├── Calculator.tsx    # Price calculator
│   │   ├── Login.tsx         # Login page
│   │   ├── Signup.tsx        # Registration page
│   │   ├── Checkout.tsx      # Checkout flow
│   │   ├── InvoiceView.tsx   # Invoice viewer
│   │   ├── InvoicePayment.tsx # Payment processor
│   │   ├── Privacy.tsx       # Privacy policy
│   │   ├── Terms.tsx         # Terms of service
│   │   ├── ServiceLevelAgreement.tsx # SLA page
│   │   ├── dashboard/
│   │   │   ├── Overview.tsx  # Dashboard home
│   │   │   ├── MyServers.tsx # Server management
│   │   │   ├── Billing.tsx   # Billing/invoices
│   │   │   ├── Referrals.tsx # Referral program
│   │   │   ├── Support.tsx   # Support tickets
│   │   │   └── Settings.tsx  # User settings
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx # Admin home
│   │   │   ├── UserManagement.tsx
│   │   │   ├── OrdersManagement.tsx
│   │   │   ├── PlansManagement.tsx
│   │   │   ├── PricingManagement.tsx
│   │   │   ├── ServerManagement.tsx
│   │   │   ├── ReferralManagement.tsx
│   │   │   └── SupportManagement.tsx
│   │   └── docs/
│   │       ├── Documentation.tsx  # Docs home
│   │       ├── Introduction.tsx
│   │       ├── QuickStart.tsx
│   │       ├── Installation.tsx
│   │       ├── Architecture.tsx
│   │       ├── Backend.tsx
│   │       ├── Frontend.tsx
│   │       ├── Database.tsx
│   │       └── api/
│   │           ├── AuthAPI.tsx
│   │           ├── PlansAPI.tsx
│   │           ├── OrdersAPI.tsx
│   │           ├── PaymentsAPI.tsx
│   │           └── ServersAPI.tsx
│   ├── components/
│   │   ├── AttachmentList.tsx
│   │   ├── FileUpload.tsx
│   │   ├── PWAInstallPrompt.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── SplashCurser.tsx
│   │   ├── TawkToWidget.tsx
│   │   ├── calculator/
│   │   │   ├── MobileDropdown.tsx
│   │   │   └── PlanCalculator.tsx
│   │   ├── pricing/
│   │   │   └── MobileFilters.tsx
│   │   ├── public/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileBottomNav.tsx
│   │   ├── referrals/
│   │   │   ├── ReferralEarningsTab.tsx
│   │   │   └── ReferralPayoutsTab.tsx
│   │   └── docs/
│   │       └── DocLayout.tsx
│   ├── layouts/
│   │   ├── PublicLayout.tsx  # Public pages layout
│   │   ├── DashboardLayout.tsx # User dashboard layout
│   │   └── AdminLayout.tsx   # Admin panel layout
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication state
│   ├── hooks/
│   │   ├── useAddons.ts      # Addons data hook
│   │   ├── useCountryOptions.ts # Country options
│   │   └── useTawkTo.ts      # Tawk widget hook
│   ├── lib/
│   │   ├── api.ts            # API client
│   │   ├── auth.ts           # Auth utilities
│   │   ├── pricingApi.ts     # Pricing API
│   │   ├── pricingService.ts # Pricing logic
│   │   └── referral.ts       # Referral API
│   ├── services/
│   │   └── countriesAPI.ts   # Countries data
│   ├── types/
│   │   ├── index.ts          # TypeScript types
│   │   └── billing.ts        # Billing types
│   ├── constants/
│   │   └── countries.ts      # Country list
│   ├── assets/
│   │   ├── fonts/
│   │   │   └── myfont.otf
│   │   └── [images, icons]
│   └── public/
│       ├── favicon.ico
│       ├── manifest.json     # PWA manifest
│       └── [other assets]
├── vite.config.ts            # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies
└── index.html               # HTML entry point`}</pre>
          </div>
        </section>

        {/* Key Components */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Components & Features</h2>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Layout className="h-5 w-5 mr-2 text-cyan-500" />
                Layout System
              </h3>
              <div className="space-y-3 text-slate-700">
                <div>
                  <strong className="text-slate-900">PublicLayout</strong>
                  <p className="text-sm">Header, footer, and navigation for public pages</p>
                </div>
                <div>
                  <strong className="text-slate-900">DashboardLayout</strong>
                  <p className="text-sm">Sidebar navigation and user-specific layout for authenticated users</p>
                </div>
                <div>
                  <strong className="text-slate-900">AdminLayout</strong>
                  <p className="text-sm">Admin-specific layout with management navigation</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-500" />
                Core Components
              </h3>
              <div className="space-y-3 text-slate-700">
                <div>
                  <strong className="text-slate-900">ProtectedRoute</strong>
                  <p className="text-sm">Wraps authenticated routes and redirects unauthorized users to login</p>
                </div>
                <div>
                  <strong className="text-slate-900">PlanCalculator</strong>
                  <p className="text-sm">Dynamic pricing calculator with addon selection and tax computation</p>
                </div>
                <div>
                  <strong className="text-slate-900">FileUpload</strong>
                  <p className="text-sm">Reusable file upload component for support tickets and documents</p>
                </div>
                <div>
                  <strong className="text-slate-900">PWAInstallPrompt</strong>
                  <p className="text-sm">Progressive Web App installation prompt for mobile users</p>
                </div>
                <div>
                  <strong className="text-slate-900">TawkToWidget</strong>
                  <p className="text-sm">Live chat integration for customer support</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Page Features
              </h3>
              <div className="space-y-3 text-slate-700 text-sm">
                <div>
                  <strong className="text-slate-900">Pricing Page</strong> - Dynamic pricing display with plan comparison, currency selection, and addon management
                </div>
                <div>
                  <strong className="text-slate-900">Calculator</strong> - Interactive pricing tool for custom configurations
                </div>
                <div>
                  <strong className="text-slate-900">Checkout</strong> - Complete order flow with plan selection, addon configuration, and Razorpay integration
                </div>
                <div>
                  <strong className="text-slate-900">Dashboard</strong> - User hub with servers, billing, referrals, and support access
                </div>
                <div>
                  <strong className="text-slate-900">Admin Panel</strong> - Complete management tools for users, orders, plans, and support
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Context & State Management */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">State Management</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Share2 className="h-5 w-5 mr-2 text-purple-500" />
              AuthContext
            </h3>
            <div className="space-y-3 text-slate-700">
              <div>
                <strong className="text-slate-900">Location:</strong>
                <p className="text-sm">src/contexts/AuthContext.tsx</p>
              </div>
              <div>
                <strong className="text-slate-900">Purpose:</strong>
                <p className="text-sm">Manages global authentication state including user profile, login status, and token management</p>
              </div>
              <div>
                <strong className="text-slate-900">Provides:</strong>
                <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                  <li>user - Current authenticated user</li>
                  <li>token - JWT authentication token</li>
                  <li>isAuthenticated - Login status</li>
                  <li>login() - User login function</li>
                  <li>logout() - User logout function</li>
                  <li>register() - User registration function</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* API Integration */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">API Integration</h2>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">API Client (lib/api.ts)</h3>
              <p className="text-slate-700 mb-3">Centralized API communication with automatic token handling and error management:</p>
              <div className="bg-slate-50 rounded p-3 space-y-2 text-sm">
                <div><strong>Base URL:</strong> Configurable via environment variable or defaults to localhost:8000</div>
                <div><strong>Headers:</strong> Automatically includes Authorization token</div>
                <div><strong>Error Handling:</strong> Consistent error handling and response parsing</div>
                <div><strong>Methods:</strong> GET, POST, PUT, PATCH, DELETE wrappers</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Key API Calls</h3>
              <div className="space-y-2 text-sm">
                <div className="text-slate-700">
                  <strong className="text-slate-900">/api/v1/auth/login</strong> - User authentication
                </div>
                <div className="text-slate-700">
                  <strong className="text-slate-900">/api/v1/auth/register</strong> - User registration
                </div>
                <div className="text-slate-700">
                  <strong className="text-slate-900">/api/v1/plans</strong> - Fetch available plans
                </div>
                <div className="text-slate-700">
                  <strong className="text-slate-900">/api/v1/pricing/calculate</strong> - Calculate final price
                </div>
                <div className="text-slate-700">
                  <strong className="text-slate-900">/api/v1/orders</strong> - Create and manage orders
                </div>
                <div className="text-slate-700">
                  <strong className="text-slate-900">/api/v1/payments/create-order</strong> - Initiate Razorpay payment
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Styling & Tailwind */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Styling Approach</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Tailwind CSS Configuration</h3>
                <p className="text-slate-700 mb-3">
                  All styling uses Tailwind CSS utility classes for consistency and rapid development:
                </p>
                <div className="bg-slate-50 rounded p-3 space-y-2 text-sm text-slate-700">
                  <div>• <strong>Color Palette:</strong> Slate grays with cyan, blue, purple, green accents</div>
                  <div>• <strong>Responsive Design:</strong> Mobile-first approach with md: and lg: breakpoints</div>
                  <div>• <strong>Components:</strong> Reusable component patterns with consistent spacing</div>
                  <div>• <strong>Typography:</strong> Consistent font sizing and weight hierarchy</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Icons</h3>
                <p className="text-slate-700">
                  Uses <strong>Lucide React</strong> for consistent, scalable icons throughout the application
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Global Styles</h3>
                <p className="text-slate-700">
                  <code className="bg-slate-100 px-2 py-1 rounded">src/index.css</code> contains global utilities and custom CSS classes for shared styles
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Routing */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Routing & Navigation</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">React Router Setup</h3>
                <p className="text-slate-700 text-sm mb-3">
                  Uses React Router v7 for client-side routing with nested routes and lazy loading:
                </p>
                <div className="bg-slate-50 rounded p-3 space-y-2 text-sm text-slate-700">
                  <div><strong>Public Routes:</strong> Home, Pricing, Contact, Login, Signup</div>
                  <div><strong>Protected Routes:</strong> Dashboard, Servers, Billing, Support</div>
                  <div><strong>Admin Routes:</strong> Admin Panel, User Management, Order Management</div>
                  <div><strong>Documentation Routes:</strong> API docs and guides</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Navigation Components</h3>
                <p className="text-slate-700 text-sm">
                  Header, Footer, Sidebar, and MobileBottomNav provide consistent navigation across all pages
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Development Workflow */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Development Workflow</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-3 text-slate-700">
              <div>
                <strong className="text-slate-900">Development Server:</strong>
                <p className="text-sm">npm run dev - Starts Vite dev server with hot module replacement</p>
              </div>
              <div>
                <strong className="text-slate-900">Production Build:</strong>
                <p className="text-sm">npm run build - Optimizes and bundles for production</p>
              </div>
              <div>
                <strong className="text-slate-900">Linting:</strong>
                <p className="text-sm">Uses ESLint for code quality and TypeScript checking</p>
              </div>
              <div>
                <strong className="text-slate-900">Type Checking:</strong>
                <p className="text-sm">Full TypeScript support for type safety throughout codebase</p>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Continue Learning</h2>
          <p className="text-slate-700 mb-6">
            Explore the database structure and API documentation for complete system understanding.
          </p>
          <div className="space-y-3">
            <a
              href="/docs/database"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              View Database Schema →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
