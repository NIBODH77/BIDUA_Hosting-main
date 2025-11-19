import { DocLayout } from '../../../components/docs/DocLayout';
import { Package, Shield, Zap, Database, Mail, Users } from 'lucide-react';

export function AddonsFeature() {
  return (
    <DocLayout
      title="Add-ons System"
      description="Comprehensive guide to BIDUA Hosting add-ons and optional services"
      breadcrumbs={[
        { label: 'Features', path: '/docs/features' },
        { label: 'Add-ons System' }
      ]}
      prevPage={{ title: 'Hosting Plans', path: '/docs/features/hosting' }}
      nextPage={{ title: 'Billing & Invoicing', path: '/docs/features/billing' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            Add-ons enhance your hosting experience by providing additional services and features beyond your base plan. Add-ons can be purchased individually or in bundles and can be managed from your account dashboard.
          </p>
        </section>

        {/* Add-on Categories */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Add-on Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: Shield,
                title: 'Security Add-ons',
                items: ['SSL/TLS Certificates', 'Advanced DDoS Protection', 'WAF (Web Application Firewall)', 'Malware Scanning']
              },
              {
                icon: Database,
                title: 'Database Add-ons',
                items: ['Additional MySQL Databases', 'PostgreSQL Instances', 'MongoDB Support', 'Database Backup Service']
              },
              {
                icon: Mail,
                title: 'Email Add-ons',
                items: ['Email Accounts', 'Email Storage Upgrade', 'SMTP Relay', 'Spam Protection']
              },
              {
                icon: Users,
                title: 'Team & Collaboration',
                items: ['Team Member Accounts', 'Admin Users', 'API Access', 'Webhooks Integration']
              }
            ].map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="border border-slate-200 rounded-lg p-6 hover:border-cyan-400 transition">
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon className="h-6 w-6 text-cyan-500" />
                    <h3 className="text-lg font-semibold text-slate-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-cyan-500 font-bold">•</span>
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Available Add-ons */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Available Add-ons</h2>

          <div className="space-y-6 my-6">
            {/* Security */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Add-ons</span>
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">SSL/TLS Certificates</h4>
                    <span className="text-cyan-500 font-bold">$30/year</span>
                  </div>
                  <p className="text-slate-600 text-sm">Industry standard secure certificates with unlimited domains</p>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">Advanced DDoS Protection</h4>
                    <span className="text-cyan-500 font-bold">$99/month</span>
                  </div>
                  <p className="text-slate-600 text-sm">Enterprise-grade DDoS mitigation with real-time threat detection</p>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">WAF (Web Application Firewall)</h4>
                    <span className="text-cyan-500 font-bold">$49/month</span>
                  </div>
                  <p className="text-slate-600 text-sm">Protect applications from common web exploits and attacks</p>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">Malware Scanning & Removal</h4>
                    <span className="text-cyan-500 font-bold">$24/month</span>
                  </div>
                  <p className="text-slate-600 text-sm">Weekly automated scans with immediate notification and removal</p>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Performance Add-ons</span>
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">CDN Integration</h4>
                    <span className="text-cyan-500 font-bold">$10/month</span>
                  </div>
                  <p className="text-slate-600 text-sm">Global content delivery network for faster content distribution</p>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">Advanced Caching</h4>
                    <span className="text-cyan-500 font-bold">$20/month</span>
                  </div>
                  <p className="text-slate-600 text-sm">Multiple caching layers with automatic optimization</p>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">Premium Support</h4>
                    <span className="text-cyan-500 font-bold">$79/month</span>
                  </div>
                  <p className="text-slate-600 text-sm">24/7 priority support with dedicated account manager</p>
                </div>
              </div>
            </div>

            {/* Backup & Storage */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Backup & Storage</span>
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">Additional Storage (100GB)</h4>
                    <span className="text-cyan-500 font-bold">$15/month</span>
                  </div>
                  <p className="text-slate-600 text-sm">Expand storage capacity for your applications and data</p>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">Backup Automation</h4>
                    <span className="text-cyan-500 font-bold">$19/month</span>
                  </div>
                  <p className="text-slate-600 text-sm">Automated hourly backups with multi-region redundancy</p>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">Offsite Backup Service</h4>
                    <span className="text-cyan-500 font-bold">$29/month</span>
                  </div>
                  <p className="text-slate-600 text-sm">Daily encrypted backups stored in geo-redundant locations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add-on Management */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Add-ons</h2>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-slate-700">Add-ons can be managed from your account dashboard under Services section</p>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Adding an Add-on</h3>

          <ol className="space-y-4 mb-8">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Navigate to Services</p>
                <p className="text-slate-600">Go to Dashboard → Services → Available Add-ons</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Select Add-on</p>
                <p className="text-slate-600">Choose the add-on you want to purchase</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Configure Options</p>
                <p className="text-slate-600">Select quantity, billing cycle, and any specific settings</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Complete Payment</p>
                <p className="text-slate-600">Add to cart and proceed to checkout</p>
              </div>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Removing an Add-on</h3>

          <ol className="space-y-4">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Access Active Services</p>
                <p className="text-slate-600">Go to Dashboard → Services → Active Services</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Find the Add-on</p>
                <p className="text-slate-600">Locate the add-on you want to cancel in the list</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Click Cancel</p>
                <p className="text-slate-600">Click the cancel button and confirm cancellation</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Bundle Deals */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Bundle Deals</h2>

          <p className="text-slate-600 mb-6">
            Save money by purchasing recommended add-on combinations as bundles:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-lg p-6 bg-gradient-to-br from-cyan-50 to-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Security Bundle</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">Save 30%</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">SSL/TLS Certificate</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">Advanced DDoS Protection</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">Malware Scanning</span>
                </li>
              </ul>
              <p className="text-lg font-bold text-cyan-500">$149/month</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Performance Bundle</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">Save 25%</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">CDN Integration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">Advanced Caching</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">Premium Support</span>
                </li>
              </ul>
              <p className="text-lg font-bold text-cyan-500">$99/month</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6 bg-gradient-to-br from-green-50 to-teal-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Backup Bundle</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">Save 20%</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">Additional Storage</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">Backup Automation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">Offsite Backup Service</span>
                </li>
              </ul>
              <p className="text-lg font-bold text-cyan-500">$59/month</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-cyan-400">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Ultimate Bundle</h3>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded">Save 40%</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">All Security Add-ons</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">All Performance Add-ons</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span className="text-slate-600">All Backup Services</span>
                </li>
              </ul>
              <p className="text-lg font-bold text-cyan-500">$299/month</p>
            </div>
          </div>
        </section>

        {/* Billing Information */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Billing Information</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Pro-rata Billing</h3>
              <p className="text-slate-600">When adding an add-on mid-cycle, charges are pro-rated to your next billing date</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Cancellation Policy</h3>
              <p className="text-slate-600">Cancel add-ons anytime. Unused credits are applied to your account</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Invoice Details</h3>
              <p className="text-slate-600">All add-on charges appear separately on your invoice for easy tracking</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Tax Calculation</h3>
              <p className="text-slate-600">Taxes are calculated based on your location and service type</p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Bundle deals provide the best value for multiple add-ons</li>
              <li>• Start with essential add-ons and upgrade as your needs grow</li>
              <li>• Premium Support is recommended for mission-critical applications</li>
              <li>• Review your add-on usage quarterly to optimize costs</li>
              <li>• Contact support for custom bundle arrangements</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
