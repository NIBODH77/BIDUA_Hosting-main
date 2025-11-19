import { Link } from 'react-router-dom';
import { ChevronRight, Home, Code, Users, Rocket, Server, CreditCard, FileText, AlertCircle } from 'lucide-react';

export function Documentation() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 text-sm text-slate-600">
        <Link to="/" className="hover:text-cyan-500">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-medium">Documentation</span>
      </div>

      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">BIDUA Hosting Documentation</h1>
        <p className="text-cyan-50 text-lg max-w-2xl">
          Comprehensive guides and references to help you build, deploy, and operate the BIDUA Hosting platform.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/docs/quick-start"
            className="inline-flex items-center px-5 py-2.5 bg-white text-cyan-600 rounded-lg font-semibold shadow hover:bg-cyan-50 transition"
          >
            Start Building
          </Link>
          <Link
            to="/docs/api/auth"
            className="inline-flex items-center px-5 py-2.5 bg-cyan-600 text-white rounded-lg font-semibold shadow hover:bg-cyan-500 transition"
          >
            Explore APIs
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/docs/introduction"
          className="bg-white p-6 rounded-xl border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-cyan-50 rounded-lg group-hover:bg-cyan-100 transition">
              <Home className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Getting Started</h3>
          </div>
          <p className="text-slate-600">
            Learn the basics and set up your environment with our introduction and quick-start guides.
          </p>
        </Link>

        <Link
          to="/docs/troubleshooting"
          className="bg-white p-6 rounded-xl border border-orange-200 hover:-translate-y-1 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition">
              <AlertCircle className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Troubleshooting</h3>
          </div>
          <p className="text-slate-600">
            Solutions for cache issues, backend offline errors, and common development problems.
          </p>
        </Link>

        <Link
          to="/docs/api/auth"
          className="bg-white p-6 rounded-xl border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-cyan-50 rounded-lg group-hover:bg-cyan-100 transition">
              <Code className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">API Reference</h3>
          </div>
          <p className="text-slate-600">
            Complete REST API reference with request samples, response schemas, and error handling details.
          </p>
        </Link>

        <Link
          to="/docs/user/purchase"
          className="bg-white p-6 rounded-xl border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-cyan-50 rounded-lg group-hover:bg-cyan-100 transition">
              <Users className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">User Guides</h3>
          </div>
          <p className="text-slate-600">
            Walkthroughs that show customers how to buy servers, manage invoices, and get support.
          </p>
        </Link>

        <Link
          to="/docs/deploy/environment"
          className="bg-white p-6 rounded-xl border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-cyan-50 rounded-lg group-hover:bg-cyan-100 transition">
              <Rocket className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Deployment</h3>
          </div>
          <p className="text-slate-600">
            Production-ready deployment checklists for backend, frontend, and database infrastructure.
          </p>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Platform Features</h2>
            <p className="text-slate-600">Deep dives into every capability built into BIDUA Hosting.</p>
          </div>
          <Link to="/docs/features/hosting" className="text-cyan-600 font-medium hover:text-cyan-700">
            Browse all features →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border border-slate-100 hover:border-cyan-200 hover:shadow transition">
            <div className="p-3 bg-cyan-50 rounded-lg inline-block mb-3">
              <Server className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Server Management</h3>
            <p className="text-sm text-slate-600">
              Provision and orchestrate VPS, Cloud, and Dedicated servers with granular controls.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 hover:border-cyan-200 hover:shadow transition">
            <div className="p-3 bg-cyan-50 rounded-lg inline-block mb-3">
              <CreditCard className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Billing System</h3>
            <p className="text-sm text-slate-600">
              Automated invoices, taxes, coupon logic, and Razorpay payments built-in.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 hover:border-cyan-200 hover:shadow transition">
            <div className="p-3 bg-cyan-50 rounded-lg inline-block mb-3">
              <FileText className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Support Tickets</h3>
            <p className="text-sm text-slate-600">
              Full ticketing lifecycle with priorities, attachments, and department routing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
