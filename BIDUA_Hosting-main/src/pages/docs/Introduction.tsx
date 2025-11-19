import { DocLayout } from '../../components/docs/DocLayout';
import { Server, Zap, Shield, Globe } from 'lucide-react';

export function Introduction() {
  return (
    <DocLayout
      title="Introduction to BIDUA Hosting"
      description="Welcome to the BIDUA Hosting platform - a comprehensive hosting management system built for scale and efficiency."
      breadcrumbs={[{ label: 'Getting Started' }, { label: 'Introduction' }]}
      nextPage={{ title: 'Quick Start', path: '/docs/quick-start' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What is BIDUA Hosting?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            BIDUA Hosting is a full-stack hosting platform operated by <strong>BIDUA Industries Pvt Ltd</strong>, headquartered in Noida, India.
            The platform delivers enterprise-grade cloud, VPS, and bare-metal server solutions for businesses of all sizes.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Built with modern technologies including React, TypeScript, FastAPI, and PostgreSQL, BIDUA Hosting provides a complete
            ecosystem for managing hosting services, billing, support tickets, and customer relationships.
          </p>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <Server className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Server Management</h3>
              </div>
              <p className="text-slate-600">
                Provision and manage VPS, Cloud, and Dedicated servers with customizable configurations,
                multiple operating systems, and datacenter options.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <Zap className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Automated Billing</h3>
              </div>
              <p className="text-slate-600">
                Complete billing system with automated invoice generation, multiple billing cycles,
                tax calculations, and Razorpay payment integration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <Shield className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Support System</h3>
              </div>
              <p className="text-slate-600">
                Comprehensive ticketing system with priority levels, file attachments,
                message threading, and department-based routing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <Globe className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Global Reach</h3>
              </div>
              <p className="text-slate-600">
                Multi-currency support with 10+ currencies, country-specific tax calculations,
                and international payment processing.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Technology Stack</h2>
          <div className="bg-slate-50 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Frontend</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>React 18.3.1</strong> - UI framework with hooks and context</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>TypeScript 5.5.3</strong> - Type-safe development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>Vite 5.4.2</strong> - Fast build tool and dev server</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>Tailwind CSS 3.4.1</strong> - Utility-first styling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>React Router 7.9.3</strong> - Client-side routing</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Backend</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>FastAPI 0.104.1</strong> - Modern Python web framework</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>SQLAlchemy 2.0</strong> - ORM with async support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>PostgreSQL</strong> - Production database</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>Alembic</strong> - Database migration tool</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span><strong>Uvicorn</strong> - ASGI web server</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Capabilities */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Platform Capabilities</h2>
          <div className="space-y-4">
            <div className="bg-white border-l-4 border-cyan-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-slate-900 mb-2">For Customers</h4>
              <p className="text-slate-700">
                Purchase and manage servers, view invoices, make payments, create support tickets,
                track referral earnings, and manage account settings.
              </p>
            </div>

            <div className="bg-white border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-slate-900 mb-2">For Administrators</h4>
              <p className="text-slate-700">
                Manage users, process orders, configure hosting plans, handle support tickets,
                approve referral payouts, and monitor platform analytics.
              </p>
            </div>

            <div className="bg-white border-l-4 border-purple-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-slate-900 mb-2">For Developers</h4>
              <p className="text-slate-700">
                RESTful API with comprehensive endpoints, JWT authentication, role-based access control,
                and detailed API documentation for integration.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
          <p className="text-slate-700 mb-6">
            Follow our quick start guide to set up your development environment and start building with BIDUA Hosting.
          </p>
          <a
            href="/docs/quick-start"
            className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
          >
            View Quick Start Guide →
          </a>
        </section>
      </div>
    </DocLayout>
  );
}
