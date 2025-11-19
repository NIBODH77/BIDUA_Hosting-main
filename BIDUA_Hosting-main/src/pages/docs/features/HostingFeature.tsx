import { DocLayout } from '../../../components/docs/DocLayout';
import { Server, Zap, Globe, Lock, BarChart3, HardDrive } from 'lucide-react';

export function HostingFeature() {
  return (
    <DocLayout
      title="Hosting Plans"
      description="Comprehensive guide to BIDUA Hosting's hosting plan features and capabilities"
      breadcrumbs={[
        { label: 'Features', path: '/docs/features' },
        { label: 'Hosting Plans' }
      ]}
      nextPage={{ title: 'Add-ons System', path: '/docs/features/addons' }}
    >
      <div className="space-y-8">
        {/* Overview Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            BIDUA Hosting offers a range of hosting plans designed to meet different business needs, from startup projects to enterprise-level deployments. Each plan comes with customizable resources and features.
          </p>
        </section>

        {/* Plan Types */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Plan Types</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: Server,
                title: 'Shared Hosting',
                description: 'Perfect for small websites and blogs. Shared resources with affordable pricing.'
              },
              {
                icon: Zap,
                title: 'VPS Hosting',
                description: 'Dedicated virtual server with guaranteed resources and full control.'
              },
              {
                icon: Globe,
                title: 'Cloud Hosting',
                description: 'Scalable cloud infrastructure with auto-scaling capabilities.'
              },
              {
                icon: Lock,
                title: 'Dedicated Servers',
                description: 'Complete server dedicated to your applications with maximum performance.'
              }
            ].map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div key={index} className="border border-slate-200 rounded-lg p-6 hover:border-cyan-400 transition">
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon className="h-6 w-6 text-cyan-500" />
                    <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
                  </div>
                  <p className="text-slate-600">{plan.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Plan Features */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Plan Features</h2>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Shared</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">VPS</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Cloud</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Dedicated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">CPU Cores</td>
                  <td className="px-4 py-3 text-slate-600">Shared</td>
                  <td className="px-4 py-3 text-slate-600">2-4</td>
                  <td className="px-4 py-3 text-slate-600">4-16</td>
                  <td className="px-4 py-3 text-slate-600">16-64</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">RAM</td>
                  <td className="px-4 py-3 text-slate-600">512MB - 2GB</td>
                  <td className="px-4 py-3 text-slate-600">2GB - 16GB</td>
                  <td className="px-4 py-3 text-slate-600">8GB - 64GB</td>
                  <td className="px-4 py-3 text-slate-600">32GB - 256GB</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Storage</td>
                  <td className="px-4 py-3 text-slate-600">10GB - 100GB</td>
                  <td className="px-4 py-3 text-slate-600">50GB - 500GB</td>
                  <td className="px-4 py-3 text-slate-600">100GB - 2TB</td>
                  <td className="px-4 py-3 text-slate-600">500GB - 10TB</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">Bandwidth</td>
                  <td className="px-4 py-3 text-slate-600">100GB/month</td>
                  <td className="px-4 py-3 text-slate-600">1TB/month</td>
                  <td className="px-4 py-3 text-slate-600">5TB/month</td>
                  <td className="px-4 py-3 text-slate-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Root Access</td>
                  <td className="px-4 py-3 text-slate-600">No</td>
                  <td className="px-4 py-3 text-slate-600">Yes</td>
                  <td className="px-4 py-3 text-slate-600">Yes</td>
                  <td className="px-4 py-3 text-slate-600">Yes</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">Uptime SLA</td>
                  <td className="px-4 py-3 text-slate-600">99.5%</td>
                  <td className="px-4 py-3 text-slate-600">99.8%</td>
                  <td className="px-4 py-3 text-slate-600">99.95%</td>
                  <td className="px-4 py-3 text-slate-600">99.99%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Resource Customization */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Resource Customization</h2>
          <p className="text-slate-600 mb-4">
            Most plans allow you to customize resources according to your needs:
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>CPU Scaling:</strong> Increase or decrease CPU cores as needed</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Memory Upgrade:</strong> Add RAM in configurable increments</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Storage Expansion:</strong> Extend storage capacity without downtime</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Bandwidth Allocation:</strong> Adjust monthly bandwidth limits</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Operating Systems */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Supported Operating Systems</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Linux</h3>
              <ul className="space-y-2 text-slate-600">
                <li>Ubuntu 20.04 / 22.04 LTS</li>
                <li>CentOS 7 / 8</li>
                <li>Debian 10 / 11</li>
                <li>AlmaLinux 8 / 9</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Windows</h3>
              <ul className="space-y-2 text-slate-600">
                <li>Windows Server 2016</li>
                <li>Windows Server 2019</li>
                <li>Windows Server 2022</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Features Included</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: BarChart3,
                title: 'Real-time Monitoring',
                description: 'Monitor CPU, RAM, disk usage and network traffic in real-time'
              },
              {
                icon: Lock,
                title: 'Security',
                description: 'Advanced firewall, DDoS protection, and automatic backups'
              },
              {
                icon: HardDrive,
                title: 'Backups',
                description: 'Automatic daily backups with point-in-time recovery'
              },
              {
                icon: Zap,
                title: 'Performance',
                description: 'SSD storage, CDN integration, and optimization tools'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="border border-slate-200 rounded-lg p-6">
                  <Icon className="h-6 w-6 text-cyan-500 mb-3" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Billing Cycles */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Billing Cycles & Pricing</h2>

          <p className="text-slate-600 mb-4">
            Plans are available with flexible billing cycles to suit your budget:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 my-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { cycle: 'Monthly', discount: 'No discount' },
                { cycle: 'Quarterly', discount: '5% discount' },
                { cycle: '6 Months', discount: '10% discount' },
                { cycle: 'Annual', discount: '20% discount' },
                { cycle: '2 Years', discount: '25% discount' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <p className="font-semibold text-slate-900">{item.cycle}</p>
                  <p className="text-sm text-slate-600">{item.discount}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Getting Started</h2>

          <ol className="space-y-4 my-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">1</span>
              <div>
                <p className="font-semibold text-slate-900">Choose Your Plan</p>
                <p className="text-slate-600">Select a plan that matches your requirements on the Pricing page</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">2</span>
              <div>
                <p className="font-semibold text-slate-900">Configure Resources</p>
                <p className="text-slate-600">Customize CPU, RAM, storage and other resources as needed</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">3</span>
              <div>
                <p className="font-semibold text-slate-900">Select OS</p>
                <p className="text-slate-600">Choose your preferred operating system from available options</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">4</span>
              <div>
                <p className="font-semibold text-slate-900">Complete Purchase</p>
                <p className="text-slate-600">Proceed to checkout and complete payment</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Start with a plan that matches your current needs and scale up as you grow</li>
              <li>• Annual plans offer significant savings compared to monthly billing</li>
              <li>• Upgrade or downgrade your plan anytime within the same billing cycle</li>
              <li>• All plans include technical support during business hours</li>
              <li>• Premium support is available as an add-on for critical applications</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
