import { DocLayout } from '../../components/docs/DocLayout';
import { Database as DatabaseIcon, Network, Lock, Tag, Users as UsersIcon, ShoppingCart } from 'lucide-react';

export function Database() {
  return (
    <DocLayout
      title="Database Schema"
      description="Complete overview of BIDUA Hosting database structure, models, and relationships."
      breadcrumbs={[{ label: 'Core' }, { label: 'Database' }]}
      prevPage={{ title: 'Frontend Structure', path: '/docs/frontend' }}
      nextPage={{ title: 'API Authentication', path: '/docs/api/auth' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Database Overview</h2>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Database Type</h3>
                <p className="text-slate-700">PostgreSQL with async support via SQLAlchemy and asyncpg</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Connection String Format</h3>
                <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                  postgresql+asyncpg://user:password@host:5432/bidua_hosting
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">ORM</h3>
                <p className="text-slate-700">SQLAlchemy 2.0 with declarative models and async session management</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Migrations</h3>
                <p className="text-slate-700">Alembic for version control of database schema changes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Models */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Core Data Models</h2>

          <div className="space-y-4">
            {/* Users Model */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2 text-cyan-500" />
                Users Profile Model
              </h3>
              <div className="space-y-3">
                <div className="text-slate-600 text-sm">
                  <strong>Table:</strong> users_profiles
                </div>
                <div className="bg-slate-50 rounded p-4 space-y-2 text-sm">
                  <div className="font-mono">
                    <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                    <div className="text-slate-700"><span className="text-cyan-500">email</span> VARCHAR UNIQUE NOT NULL</div>
                    <div className="text-slate-700"><span className="text-cyan-500">username</span> VARCHAR UNIQUE NOT NULL</div>
                    <div className="text-slate-700"><span className="text-cyan-500">password_hash</span> VARCHAR NOT NULL</div>
                    <div className="text-slate-700"><span className="text-cyan-500">first_name</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">last_name</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">company_name</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">phone</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">country_id</span> INTEGER FK</div>
                    <div className="text-slate-700"><span className="text-cyan-500">is_active</span> BOOLEAN DEFAULT TRUE</div>
                    <div className="text-slate-700"><span className="text-cyan-500">is_admin</span> BOOLEAN DEFAULT FALSE</div>
                    <div className="text-slate-700"><span className="text-cyan-500">referral_code</span> VARCHAR UNIQUE</div>
                    <div className="text-slate-700"><span className="text-cyan-500">referred_by</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">created_at</span> TIMESTAMP</div>
                    <div className="text-slate-700"><span className="text-cyan-500">updated_at</span> TIMESTAMP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Model */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-blue-500" />
                Order Model
              </h3>
              <div className="space-y-3">
                <div className="text-slate-600 text-sm">
                  <strong>Table:</strong> orders
                </div>
                <div className="bg-slate-50 rounded p-4 space-y-2 text-sm">
                  <div className="font-mono">
                    <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                    <div className="text-slate-700"><span className="text-cyan-500">user_id</span> INTEGER FK → users_profiles</div>
                    <div className="text-slate-700"><span className="text-cyan-500">plan_id</span> INTEGER FK → hosting_plans</div>
                    <div className="text-slate-700"><span className="text-cyan-500">order_number</span> VARCHAR UNIQUE</div>
                    <div className="text-slate-700"><span className="text-cyan-500">order_status</span> VARCHAR (pending, active, cancelled, completed, expired)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">payment_status</span> VARCHAR (pending, paid, failed, refunded)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">billing_cycle</span> VARCHAR (monthly, quarterly, annual, biennial, triennial)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">total_amount</span> NUMERIC(10,2)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">discount_amount</span> NUMERIC(10,2)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">tax_amount</span> NUMERIC(10,2)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">grand_total</span> NUMERIC(10,2)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">currency</span> VARCHAR DEFAULT 'USD'</div>
                    <div className="text-slate-700"><span className="text-cyan-500">razorpay_order_id</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">razorpay_payment_id</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">created_at</span> TIMESTAMP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hosting Plans */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-green-500" />
                Hosting Plans Model
              </h3>
              <div className="space-y-3">
                <div className="text-slate-600 text-sm">
                  <strong>Table:</strong> hosting_plans
                </div>
                <div className="bg-slate-50 rounded p-4 space-y-2 text-sm">
                  <div className="font-mono">
                    <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                    <div className="text-slate-700"><span className="text-cyan-500">name</span> VARCHAR NOT NULL</div>
                    <div className="text-slate-700"><span className="text-cyan-500">type</span> VARCHAR (vps, dedicated, cloud, shared)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">description</span> TEXT</div>
                    <div className="text-slate-700"><span className="text-cyan-500">base_price</span> NUMERIC(10,2)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">cpu_cores</span> INTEGER</div>
                    <div className="text-slate-700"><span className="text-cyan-500">ram_gb</span> INTEGER</div>
                    <div className="text-slate-700"><span className="text-cyan-500">storage_gb</span> INTEGER</div>
                    <div className="text-slate-700"><span className="text-cyan-500">bandwidth_gb</span> INTEGER</div>
                    <div className="text-slate-700"><span className="text-cyan-500">os_options</span> JSON</div>
                    <div className="text-slate-700"><span className="text-cyan-500">is_active</span> BOOLEAN</div>
                    <div className="text-slate-700"><span className="text-cyan-500">created_at</span> TIMESTAMP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Servers Model */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Network className="h-5 w-5 mr-2 text-purple-500" />
                Server Model
              </h3>
              <div className="space-y-3">
                <div className="text-slate-600 text-sm">
                  <strong>Table:</strong> servers
                </div>
                <div className="bg-slate-50 rounded p-4 space-y-2 text-sm">
                  <div className="font-mono">
                    <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                    <div className="text-slate-700"><span className="text-cyan-500">user_id</span> INTEGER FK → users_profiles</div>
                    <div className="text-slate-700"><span className="text-cyan-500">order_id</span> INTEGER FK → orders</div>
                    <div className="text-slate-700"><span className="text-cyan-500">hostname</span> VARCHAR UNIQUE</div>
                    <div className="text-slate-700"><span className="text-cyan-500">ip_address</span> VARCHAR UNIQUE</div>
                    <div className="text-slate-700"><span className="text-cyan-500">status</span> VARCHAR (active, provisioning, suspended, terminated)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">os_type</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">root_password</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">cpu_cores</span> INTEGER</div>
                    <div className="text-slate-700"><span className="text-cyan-500">ram_gb</span> INTEGER</div>
                    <div className="text-slate-700"><span className="text-cyan-500">storage_gb</span> INTEGER</div>
                    <div className="text-slate-700"><span className="text-cyan-500">location</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">created_at</span> TIMESTAMP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Tickets */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-500" />
                Support Ticket Model
              </h3>
              <div className="space-y-3">
                <div className="text-slate-600 text-sm">
                  <strong>Table:</strong> support_tickets
                </div>
                <div className="bg-slate-50 rounded p-4 space-y-2 text-sm">
                  <div className="font-mono">
                    <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                    <div className="text-slate-700"><span className="text-cyan-500">user_id</span> INTEGER FK → users_profiles</div>
                    <div className="text-slate-700"><span className="text-cyan-500">ticket_id</span> VARCHAR UNIQUE</div>
                    <div className="text-slate-700"><span className="text-cyan-500">subject</span> VARCHAR NOT NULL</div>
                    <div className="text-slate-700"><span className="text-cyan-500">description</span> TEXT</div>
                    <div className="text-slate-700"><span className="text-cyan-500">status</span> VARCHAR (open, in_progress, resolved, closed)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">priority</span> VARCHAR (low, medium, high, critical)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">department</span> VARCHAR</div>
                    <div className="text-slate-700"><span className="text-cyan-500">assigned_to</span> INTEGER FK → users_profiles (nullable)</div>
                    <div className="text-slate-700"><span className="text-cyan-500">created_at</span> TIMESTAMP</div>
                    <div className="text-slate-700"><span className="text-cyan-500">updated_at</span> TIMESTAMP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Junction Tables */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Junction & Relationship Tables</h2>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Order Addons Junction</h3>
              <div className="space-y-3">
                <div className="text-slate-600 text-sm">
                  <strong>Table:</strong> order_addons
                </div>
                <div className="text-slate-700 text-sm mb-3">
                  Many-to-many relationship linking orders to selected addons with custom pricing
                </div>
                <div className="bg-slate-50 rounded p-3 space-y-1 text-sm font-mono">
                  <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                  <div className="text-slate-700"><span className="text-cyan-500">order_id</span> INTEGER FK → orders</div>
                  <div className="text-slate-700"><span className="text-cyan-500">addon_id</span> INTEGER FK → addons</div>
                  <div className="text-slate-700"><span className="text-cyan-500">quantity</span> INTEGER</div>
                  <div className="text-slate-700"><span className="text-cyan-500">price_per_unit</span> NUMERIC(10,2)</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Order Services Junction</h3>
              <div className="space-y-3">
                <div className="text-slate-600 text-sm">
                  <strong>Table:</strong> order_services
                </div>
                <div className="text-slate-700 text-sm mb-3">
                  Many-to-many relationship linking orders to selected services
                </div>
                <div className="bg-slate-50 rounded p-3 space-y-1 text-sm font-mono">
                  <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                  <div className="text-slate-700"><span className="text-cyan-500">order_id</span> INTEGER FK → orders</div>
                  <div className="text-slate-700"><span className="text-cyan-500">service_id</span> INTEGER FK → services</div>
                  <div className="text-slate-700"><span className="text-cyan-500">quantity</span> INTEGER</div>
                  <div className="text-slate-700"><span className="text-cyan-500">price</span> NUMERIC(10,2)</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Ticket Messages</h3>
              <div className="space-y-3">
                <div className="text-slate-600 text-sm">
                  <strong>Table:</strong> ticket_messages
                </div>
                <div className="text-slate-700 text-sm mb-3">
                  Messages thread for support tickets with user/admin communication
                </div>
                <div className="bg-slate-50 rounded p-3 space-y-1 text-sm font-mono">
                  <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                  <div className="text-slate-700"><span className="text-cyan-500">ticket_id</span> INTEGER FK → support_tickets</div>
                  <div className="text-slate-700"><span className="text-cyan-500">user_id</span> INTEGER FK → users_profiles</div>
                  <div className="text-slate-700"><span className="text-cyan-500">message</span> TEXT</div>
                  <div className="text-slate-700"><span className="text-cyan-500">created_at</span> TIMESTAMP</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting Tables */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Supporting Reference Tables</h2>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Countries</h3>
              <p className="text-slate-700 text-sm mb-3">Reference table for country data with tax rates</p>
              <div className="bg-slate-50 rounded p-3 space-y-1 text-sm font-mono">
                <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                <div className="text-slate-700"><span className="text-cyan-500">name</span> VARCHAR UNIQUE</div>
                <div className="text-slate-700"><span className="text-cyan-500">country_code</span> VARCHAR(2)</div>
                <div className="text-slate-700"><span className="text-cyan-500">tax_rate</span> NUMERIC(5,2)</div>
                <div className="text-slate-700"><span className="text-cyan-500">currency</span> VARCHAR(3)</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Addons</h3>
              <p className="text-slate-700 text-sm mb-3">Available add-on services that can be selected with orders</p>
              <div className="bg-slate-50 rounded p-3 space-y-1 text-sm font-mono">
                <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                <div className="text-slate-700"><span className="text-cyan-500">name</span> VARCHAR UNIQUE</div>
                <div className="text-slate-700"><span className="text-cyan-500">description</span> TEXT</div>
                <div className="text-slate-700"><span className="text-cyan-500">price</span> NUMERIC(10,2)</div>
                <div className="text-slate-700"><span className="text-cyan-500">icon</span> VARCHAR</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Invoices</h3>
              <p className="text-slate-700 text-sm mb-3">Generated invoices for orders</p>
              <div className="bg-slate-50 rounded p-3 space-y-1 text-sm font-mono">
                <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                <div className="text-slate-700"><span className="text-cyan-500">order_id</span> INTEGER FK → orders</div>
                <div className="text-slate-700"><span className="text-cyan-500">invoice_number</span> VARCHAR UNIQUE</div>
                <div className="text-slate-700"><span className="text-cyan-500">total_amount</span> NUMERIC(10,2)</div>
                <div className="text-slate-700"><span className="text-cyan-500">paid</span> BOOLEAN</div>
                <div className="text-slate-700"><span className="text-cyan-500">created_at</span> TIMESTAMP</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Referrals</h3>
              <p className="text-slate-700 text-sm mb-3">Tracks referral earnings and status</p>
              <div className="bg-slate-50 rounded p-3 space-y-1 text-sm font-mono">
                <div className="text-slate-700"><span className="text-cyan-500">id</span> INTEGER PRIMARY KEY</div>
                <div className="text-slate-700"><span className="text-cyan-500">referrer_id</span> INTEGER FK → users_profiles</div>
                <div className="text-slate-700"><span className="text-cyan-500">referred_user_id</span> INTEGER FK → users_profiles</div>
                <div className="text-slate-700"><span className="text-cyan-500">earned_amount</span> NUMERIC(10,2)</div>
                <div className="text-slate-700"><span className="text-cyan-500">status</span> VARCHAR (pending, approved, paid)</div>
                <div className="text-slate-700"><span className="text-cyan-500">created_at</span> TIMESTAMP</div>
              </div>
            </div>
          </div>
        </section>

        {/* Database Relationships */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Entity Relationships</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">User → Orders (One-to-Many)</h3>
                <p className="text-slate-700 text-sm">A user can have multiple orders. Foreign key: orders.user_id → users_profiles.id</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Order → Plan (Many-to-One)</h3>
                <p className="text-slate-700 text-sm">Each order references one hosting plan. Foreign key: orders.plan_id → hosting_plans.id</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Order → Addons (Many-to-Many)</h3>
                <p className="text-slate-700 text-sm">Orders can have multiple addons. Junction table: order_addons</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Order → Servers (One-to-Many)</h3>
                <p className="text-slate-700 text-sm">An order can provision multiple servers. Foreign key: servers.order_id → orders.id</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">User → Support Tickets (One-to-Many)</h3>
                <p className="text-slate-700 text-sm">A user can create multiple tickets. Foreign key: support_tickets.user_id → users_profiles.id</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">User → Referrals (One-to-Many)</h3>
                <p className="text-slate-700 text-sm">Users can refer multiple other users. Foreign key: referrals.referrer_id → users_profiles.id</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">User → Country (Many-to-One)</h3>
                <p className="text-slate-700 text-sm">Each user belongs to one country. Foreign key: users_profiles.country_id → countries.id</p>
              </div>
            </div>
          </div>
        </section>

        {/* Indexes */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Database Indexes</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <p className="text-slate-700 mb-4">Strategic indexes are created for frequently queried columns to improve performance:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-3">
                <span className="text-cyan-500 mr-2">•</span>
                <span><strong>users_profiles:</strong> email, username, is_active</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-500 mr-2">•</span>
                <span><strong>orders:</strong> user_id, order_number, order_status, payment_status, razorpay_order_id</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-500 mr-2">•</span>
                <span><strong>servers:</strong> user_id, status, hostname, ip_address</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-500 mr-2">•</span>
                <span><strong>support_tickets:</strong> user_id, status, ticket_id, priority</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-500 mr-2">•</span>
                <span><strong>invoices:</strong> order_id, invoice_number, paid</span>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore API Documentation</h2>
          <p className="text-slate-700 mb-6">
            Now that you understand the database structure, explore how to interact with this data through the API endpoints.
          </p>
          <div className="space-y-3">
            <a
              href="/docs/api/auth"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              View Authentication API →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
