import { DocLayout } from '../../components/docs/DocLayout';
import { Cloud, Database, Cpu, Layers, Shield, Zap } from 'lucide-react';

export function Architecture() {
  return (
    <DocLayout
      title="System Architecture"
      description="Overview of BIDUA Hosting platform architecture, components, and data flow."
      breadcrumbs={[{ label: 'Core' }, { label: 'Architecture' }]}
      prevPage={{ title: 'Installation', path: '/docs/installation' }}
      nextPage={{ title: 'Backend Structure', path: '/docs/backend' }}
    >
      <div className="space-y-8">
        {/* Architecture Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Architecture Overview</h2>
          <p className="text-slate-700 mb-4">
            BIDUA Hosting is built on a modern, scalable three-tier architecture with clear separation of concerns:
          </p>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 border border-slate-200">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                    <Cloud className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Frontend Layer</h3>
                  <p className="text-slate-700">React-based single-page application with TypeScript, Vite, and Tailwind CSS. Handles user interface and client-side logic.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Cpu className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Backend API Layer</h3>
                  <p className="text-slate-700">FastAPI-based REST API with async support, JWT authentication, and comprehensive endpoint coverage for all business operations.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                    <Database className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Data Layer</h3>
                  <p className="text-slate-700">PostgreSQL database with SQLAlchemy ORM, providing reliable data persistence and complex relational queries.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Structure */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Component Structure</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-cyan-500" />
                  Frontend Components
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-slate-700">
                  <div>
                    <strong>Public Pages:</strong> Home, Pricing, Solutions, DedicatedServers, Contact
                  </div>
                  <div>
                    <strong>Dashboard Pages:</strong> Overview, MyServers, Billing, Referrals, Support, Settings
                  </div>
                  <div>
                    <strong>Admin Pages:</strong> UserManagement, OrdersManagement, PlansManagement, PricingManagement, ReferralManagement, SupportManagement
                  </div>
                  <div>
                    <strong>Core Components:</strong> Header, Footer, Navigation, Authentication flows, PWA support
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-blue-500" />
                  Backend Services
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-slate-700">
                  <div>
                    <strong>Authentication Service:</strong> JWT token management, user registration, login, password reset
                  </div>
                  <div>
                    <strong>User Service:</strong> Profile management, account settings, referral tracking
                  </div>
                  <div>
                    <strong>Order Service:</strong> Order creation, status tracking, order management
                  </div>
                  <div>
                    <strong>Payment Service:</strong> Razorpay integration, payment processing, invoice generation
                  </div>
                  <div>
                    <strong>Server Service:</strong> Server provisioning, configuration, management
                  </div>
                  <div>
                    <strong>Support Service:</strong> Ticket creation, message handling, attachments
                  </div>
                  <div>
                    <strong>Referral Service:</strong> Referral tracking, commission calculations, payout management
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-purple-500" />
                  Database Models
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-slate-700 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span>• User & Profile</span>
                    <span>• Hosting Plans</span>
                    <span>• Orders & Addons</span>
                    <span>• Services</span>
                    <span>• Payments & Invoices</span>
                    <span>• Servers</span>
                    <span>• Support Tickets</span>
                    <span>• Referrals</span>
                    <span>• Countries & Pricing</span>
                    <span>• Affiliates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Flow */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Flow Architecture</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="border-l-4 border-cyan-500 pl-4 py-2">
                <h3 className="font-semibold text-slate-900 mb-2">1. Authentication Flow</h3>
                <div className="text-slate-700 text-sm space-y-1">
                  <div>Frontend → Backend: User credentials</div>
                  <div>Backend: Validates & creates JWT token</div>
                  <div>Frontend: Stores token in localStorage/sessionStorage</div>
                  <div>All subsequent requests: Include Authorization header</div>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-slate-900 mb-2">2. Order & Payment Flow</h3>
                <div className="text-slate-700 text-sm space-y-1">
                  <div>Frontend: User selects plan and addons</div>
                  <div>Backend: Calculates pricing and applies taxes</div>
                  <div>Frontend: Displays final amount to user</div>
                  <div>Razorpay: Handles payment processing</div>
                  <div>Backend: Creates order and invoice on successful payment</div>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="font-semibold text-slate-900 mb-2">3. Server Creation Flow</h3>
                <div className="text-slate-700 text-sm space-y-1">
                  <div>User creates order with server specifications</div>
                  <div>Backend validates configuration and checks stock</div>
                  <div>Server is provisioned and added to user account</div>
                  <div>Frontend displays server in "My Servers" dashboard</div>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-semibold text-slate-900 mb-2">4. Support Ticket Flow</h3>
                <div className="text-slate-700 text-sm space-y-1">
                  <div>User creates support ticket from dashboard</div>
                  <div>Backend assigns to appropriate department</div>
                  <div>Admin can view, update status, and send messages</div>
                  <div>User receives email notifications on updates</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Architecture */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Security Architecture</h2>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-500" />
                Security Features
              </h3>
              <div className="space-y-3 text-slate-700">
                <div>
                  <strong>JWT Authentication:</strong> Secure token-based authentication with configurable expiration
                </div>
                <div>
                  <strong>Password Hashing:</strong> bcrypt hashing for secure password storage
                </div>
                <div>
                  <strong>CORS Protection:</strong> Configurable CORS policy to prevent unauthorized cross-origin requests
                </div>
                <div>
                  <strong>Role-Based Access Control:</strong> Admin and user roles with appropriate permissions
                </div>
                <div>
                  <strong>HTTPS Support:</strong> SSL/TLS encryption for data in transit
                </div>
                <div>
                  <strong>Input Validation:</strong> Pydantic schemas validate all API inputs
                </div>
                <div>
                  <strong>Rate Limiting:</strong> Protect endpoints from abuse
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Endpoints Organization */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">API Endpoints Organization</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded text-sm font-semibold">POST</span>
                <div>
                  <div className="font-semibold text-slate-900">/api/v1/auth/register</div>
                  <div className="text-sm text-slate-600">User registration</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-semibold">GET</span>
                <div>
                  <div className="font-semibold text-slate-900">/api/v1/plans</div>
                  <div className="text-sm text-slate-600">List hosting plans</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">POST</span>
                <div>
                  <div className="font-semibold text-slate-900">/api/v1/orders</div>
                  <div className="text-sm text-slate-600">Create new order</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm font-semibold">POST</span>
                <div>
                  <div className="font-semibold text-slate-900">/api/v1/payments/create-order</div>
                  <div className="text-sm text-slate-600">Create Razorpay payment order</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm font-semibold">GET</span>
                <div>
                  <div className="font-semibold text-slate-900">/api/v1/servers</div>
                  <div className="text-sm text-slate-600">List user's servers</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded text-sm font-semibold">POST</span>
                <div>
                  <div className="font-semibold text-slate-900">/api/v1/support/tickets</div>
                  <div className="text-sm text-slate-600">Create support ticket</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deployment Architecture */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Deployment Architecture</h2>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Production Deployment
                </h3>
                <ul className="text-slate-700 space-y-2 text-sm">
                  <li>• Frontend: Deployed to CDN (Vercel, Netlify, or S3+CloudFront)</li>
                  <li>• Backend: Containerized with Docker, deployed on cloud infrastructure</li>
                  <li>• Database: Managed PostgreSQL instance (RDS, Heroku, or similar)</li>
                  <li>• SSL/TLS: Automatic HTTPS with Let's Encrypt or certificate provider</li>
                  <li>• Monitoring: Application performance monitoring and logging</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Recommended Stack</h3>
                <ul className="text-slate-700 space-y-2 text-sm">
                  <li>• <strong>Frontend Hosting:</strong> Vercel, Netlify, or AWS CloudFront</li>
                  <li>• <strong>Backend Hosting:</strong> AWS ECS, DigitalOcean App Platform, Railway, or Render</li>
                  <li>• <strong>Database:</strong> AWS RDS for PostgreSQL, DigitalOcean Managed Database, or similar</li>
                  <li>• <strong>Email:</strong> SendGrid, AWS SES, or Mailgun</li>
                  <li>• <strong>File Storage:</strong> AWS S3, DigitalOcean Spaces, or similar</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore Further</h2>
          <div className="space-y-3">
            <a
              href="/docs/backend"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              Explore Backend Structure →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
