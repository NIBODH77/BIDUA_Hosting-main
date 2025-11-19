import { DocLayout } from '../../components/docs/DocLayout';
import { FileCode, Folder, Zap, Settings, Lock } from 'lucide-react';

export function Backend() {
  return (
    <DocLayout
      title="Backend Structure"
      description="Comprehensive guide to BIDUA Hosting backend organization, services, and directory structure."
      breadcrumbs={[{ label: 'Core' }, { label: 'Backend' }]}
      prevPage={{ title: 'Architecture', path: '/docs/architecture' }}
      nextPage={{ title: 'Frontend Structure', path: '/docs/frontend' }}
    >
      <div className="space-y-8">
        {/* Project Structure */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Structure</h2>
          <p className="text-slate-700 mb-4">
            The backend is organized following FastAPI best practices with clear separation of concerns:
          </p>
          <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto text-sm">
            <pre className="text-green-400 font-mono">{`backend_template/
├── app/
│   ├── main.py                 # FastAPI app initialization
│   ├── core/
│   │   ├── config.py          # Configuration and settings
│   │   ├── database.py        # Database connection setup
│   │   ├── security.py        # JWT and auth utilities
│   │   └── dependencies.py    # Dependency injection
│   ├── api/
│   │   └── v1/
│   │       ├── api.py         # API router aggregation
│   │       └── endpoints/
│   │           ├── auth.py    # Authentication endpoints
│   │           ├── users.py   # User management
│   │           ├── plans.py   # Hosting plans
│   │           ├── orders.py  # Order management
│   │           ├── servers.py # Server management
│   │           ├── payments.py # Payment handling
│   │           ├── invoices.py # Invoice management
│   │           ├── support.py  # Support tickets
│   │           ├── referrals.py # Referral system
│   │           ├── addons.py   # Addon management
│   │           ├── countries.py # Country data
│   │           ├── billing.py  # Billing operations
│   │           ├── dashboard.py # Dashboard data
│   │           ├── admin.py    # Admin operations
│   │           ├── admin_pricing.py # Admin pricing
│   │           └── settings.py # User settings
│   ├── models/
│   │   ├── base.py            # Base model
│   │   ├── users.py           # User model
│   │   ├── order.py           # Order model
│   │   ├── order_addon.py     # Order addon junction
│   │   ├── order_service.py   # Order service junction
│   │   ├── addon.py           # Addon model
│   │   ├── service.py         # Service model
│   │   ├── plan.py            # Hosting plan model
│   │   ├── server.py          # Server model
│   │   ├── payment.py         # Payment model
│   │   ├── invoice.py         # Invoice model
│   │   ├── support.py         # Support ticket model
│   │   ├── referrals.py       # Referral model
│   │   ├── affiliate.py       # Affiliate model
│   │   ├── countries.py       # Country model
│   │   ├── roles.py           # Role model
│   │   ├── settings.py        # Settings model
│   │   ├── billing.py         # Billing model
│   │   └── hosting_plan_config.py # Plan config
│   ├── schemas/
│   │   ├── users.py           # User request/response schemas
│   │   ├── order.py           # Order schemas
│   │   ├── payment.py         # Payment schemas
│   │   └── [...other schemas]
│   ├── services/
│   │   ├── user_service.py    # User business logic
│   │   ├── order_service.py   # Order operations
│   │   ├── server_service.py  # Server management
│   │   ├── payment_service.py # Payment processing
│   │   └── [...other services]
│   ├── utils/
│   │   ├── security_utils.py  # Password and security
│   │   ├── email_utils.py     # Email sending
│   │   └── validators.py      # Input validation
│   └── static/                # Static files
├── alembic/                   # Database migrations
│   ├── versions/             # Migration scripts
│   └── env.py                # Migration environment
├── scripts/
│   ├── seed_countries.py     # Seed countries
│   ├── seed_pricing_data.py  # Seed pricing
│   └── seed_addons_data.py   # Seed addons
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
└── pytest.ini               # Testing configuration`}</pre>
          </div>
        </section>

        {/* Core Modules */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Core Modules</h2>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-500" />
                Core Security Module
              </h3>
              <div className="space-y-3 text-slate-700">
                <div>
                  <strong className="text-slate-900">app/core/security.py</strong>
                  <p className="text-sm mt-1">Handles JWT token generation, verification, and user authentication</p>
                </div>
                <div className="bg-slate-50 rounded p-3 text-sm">
                  <strong>Key Functions:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>create_access_token() - Generate JWT tokens</li>
                    <li>verify_token() - Validate JWT tokens</li>
                    <li>get_current_user() - Extract user from token</li>
                    <li>verify_password() - Check password hashes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Database Module
              </h3>
              <div className="space-y-3 text-slate-700">
                <div>
                  <strong className="text-slate-900">app/core/database.py</strong>
                  <p className="text-sm mt-1">AsyncSQL engine setup with SQLAlchemy ORM</p>
                </div>
                <div className="bg-slate-50 rounded p-3 text-sm">
                  <strong>Key Components:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AsyncEngine - Async database connection</li>
                    <li>SessionLocal - Session management</li>
                    <li>Base - SQLAlchemy declarative base</li>
                    <li>get_db() - Dependency for DB access</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-500" />
                Configuration Module
              </h3>
              <div className="space-y-3 text-slate-700">
                <div>
                  <strong className="text-slate-900">app/core/config.py</strong>
                  <p className="text-sm mt-1">Pydantic settings management with environment variables</p>
                </div>
                <div className="bg-slate-50 rounded p-3 text-sm">
                  <strong>Key Settings:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>DATABASE_URL - PostgreSQL connection string</li>
                    <li>SECRET_KEY - JWT signing key</li>
                    <li>RAZORPAY_KEY_ID/SECRET - Payment credentials</li>
                    <li>API_V1_STR - API version prefix</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">API Endpoints Overview</h2>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Authentication Endpoints</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded font-semibold">POST</span>
                    <span className="ml-2">/api/v1/auth/register</span>
                  </div>
                  <span className="text-slate-600">Register new user</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded font-semibold">POST</span>
                    <span className="ml-2">/api/v1/auth/login</span>
                  </div>
                  <span className="text-slate-600">Login user</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded font-semibold">POST</span>
                    <span className="ml-2">/api/v1/auth/refresh</span>
                  </div>
                  <span className="text-slate-600">Refresh token</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded font-semibold">POST</span>
                    <span className="ml-2">/api/v1/auth/change-password</span>
                  </div>
                  <span className="text-slate-600">Change password</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Plans & Pricing Endpoints</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">GET</span>
                    <span className="ml-2">/api/v1/plans</span>
                  </div>
                  <span className="text-slate-600">List all plans</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">GET</span>
                    <span className="ml-2">/api/v1/plans/{'{id}'}</span>
                  </div>
                  <span className="text-slate-600">Get plan details</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">GET</span>
                    <span className="ml-2">/api/v1/addons</span>
                  </div>
                  <span className="text-slate-600">List addons</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">GET</span>
                    <span className="ml-2">/api/v1/pricing/calculate</span>
                  </div>
                  <span className="text-slate-600">Calculate pricing</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Order & Payment Endpoints</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">POST</span>
                    <span className="ml-2">/api/v1/orders</span>
                  </div>
                  <span className="text-slate-600">Create order</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">GET</span>
                    <span className="ml-2">/api/v1/orders</span>
                  </div>
                  <span className="text-slate-600">List user orders</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">POST</span>
                    <span className="ml-2">/api/v1/payments/create-order</span>
                  </div>
                  <span className="text-slate-600">Create Razorpay order</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">POST</span>
                    <span className="ml-2">/api/v1/payments/verify</span>
                  </div>
                  <span className="text-slate-600">Verify payment</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Server Management Endpoints</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">GET</span>
                    <span className="ml-2">/api/v1/servers</span>
                  </div>
                  <span className="text-slate-600">List user servers</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">GET</span>
                    <span className="ml-2">/api/v1/servers/{'{id}'}</span>
                  </div>
                  <span className="text-slate-600">Get server details</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">PATCH</span>
                    <span className="ml-2">/api/v1/servers/{'{id}'}</span>
                  </div>
                  <span className="text-slate-600">Update server</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Database Models */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Database Models</h2>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">User Model</h3>
              <div className="bg-slate-50 rounded p-3 text-sm space-y-2">
                <div><strong>Table:</strong> users_profiles</div>
                <div><strong>Key Fields:</strong></div>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>id, email, username - Identity</li>
                  <li>password_hash - Hashed password</li>
                  <li>first_name, last_name - Profile info</li>
                  <li>company_name, phone - Contact details</li>
                  <li>is_active, is_admin - Status flags</li>
                  <li>referral_code, referred_by - Referral system</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Order Model</h3>
              <div className="bg-slate-50 rounded p-3 text-sm space-y-2">
                <div><strong>Table:</strong> orders</div>
                <div><strong>Key Fields:</strong></div>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>order_number - Unique identifier</li>
                  <li>user_id, plan_id - Foreign keys</li>
                  <li>order_status - pending, active, cancelled</li>
                  <li>payment_status - pending, paid, failed</li>
                  <li>total_amount, discount_amount, tax_amount, grand_total</li>
                  <li>razorpay_order_id, razorpay_payment_id - Payment tracking</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Server Model</h3>
              <div className="bg-slate-50 rounded p-3 text-sm space-y-2">
                <div><strong>Table:</strong> servers</div>
                <div><strong>Key Fields:</strong></div>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>hostname, ip_address - Server identity</li>
                  <li>user_id, order_id - References</li>
                  <li>status - active, provisioning, suspended</li>
                  <li>os_type, root_password - Configuration</li>
                  <li>cpu_cores, ram_gb, storage_gb - Specifications</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Support Ticket Model</h3>
              <div className="bg-slate-50 rounded p-3 text-sm space-y-2">
                <div><strong>Table:</strong> support_tickets</div>
                <div><strong>Key Fields:</strong></div>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>ticket_id - Unique identifier</li>
                  <li>user_id - Ticket creator</li>
                  <li>subject, description - Issue details</li>
                  <li>status - open, in_progress, resolved</li>
                  <li>priority - low, medium, high, critical</li>
                  <li>department - Category/routing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Services Layer */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Services & Business Logic</h2>
          <p className="text-slate-700 mb-4">
            Services handle business logic and complex operations:
          </p>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-3 text-slate-700">
              <div>
                <strong className="text-slate-900">UserService</strong>
                <p className="text-sm">User registration, profile updates, password management</p>
              </div>
              <div>
                <strong className="text-slate-900">OrderService</strong>
                <p className="text-sm">Order creation, status tracking, order validation</p>
              </div>
              <div>
                <strong className="text-slate-900">PaymentService</strong>
                <p className="text-sm">Razorpay integration, payment verification, invoice generation</p>
              </div>
              <div>
                <strong className="text-slate-900">ServerService</strong>
                <p className="text-sm">Server provisioning, configuration, status management</p>
              </div>
              <div>
                <strong className="text-slate-900">PricingService</strong>
                <p className="text-sm">Price calculation, currency conversion, tax computation</p>
              </div>
              <div>
                <strong className="text-slate-900">ReferralService</strong>
                <p className="text-sm">Referral tracking, commission calculation, payout processing</p>
              </div>
              <div>
                <strong className="text-slate-900">SupportService</strong>
                <p className="text-sm">Ticket creation, message management, attachment handling</p>
              </div>
            </div>
          </div>
        </section>

        {/* Environment Variables */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment Configuration</h2>
          <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm">{`# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/bidua_hosting

# Authentication
SECRET_KEY=your-super-secret-jwt-key-for-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# API Configuration
API_V1_STR=/api/v1
DEBUG=False
VERSION=1.0.0
ALLOWED_HOSTS=["localhost", "0.0.0.0"]
BACKEND_CORS_ORIGINS=["http://localhost:4333", "https://yourdomain.com"]

# Email Configuration (if needed)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password`}</pre>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Continue Learning</h2>
          <p className="text-slate-700 mb-6">
            Explore the database models, API endpoints, and frontend integration patterns.
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
