import { Link } from 'react-router-dom';
import { Code, ShoppingCart, Building2, Gamepad2, Database, Globe } from 'lucide-react';

export function Solutions() {
  const solutions = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Host your web applications with optimal performance and reliability.',
      features: ['Auto-scaling', 'Load balancing', 'CDN integration', 'SSL certificates'],
      color: 'blue',
    },
    {
      icon: ShoppingCart,
      title: 'E-Commerce',
      description: 'Secure and fast hosting solutions for online stores and marketplaces.',
      features: ['PCI compliance', 'High availability', 'DDoS protection', 'Backup solutions'],
      color: 'green',
    },
    {
      icon: Building2,
      title: 'Enterprise Applications',
      description: 'Scalable infrastructure for mission-critical business applications.',
      features: ['Dedicated resources', 'Private networking', 'Custom configurations', 'SLA guarantees'],
      color: 'purple',
    },
    {
      icon: Gamepad2,
      title: 'Game Servers',
      description: 'Low-latency servers optimized for gaming and real-time applications.',
      features: ['Low latency', 'DDoS protection', 'Instant deployment', 'Global locations'],
      color: 'red',
    },
    {
      icon: Database,
      title: 'Big Data & Analytics',
      description: 'High-performance computing for data processing and analysis.',
      features: ['High memory', 'Fast storage', 'GPU options', 'Scalable resources'],
      color: 'orange',
    },
    {
      icon: Globe,
      title: 'Content Delivery',
      description: 'Global content delivery with edge locations worldwide.',
      features: ['CDN integration', 'Edge caching', 'Global reach', 'Real-time analytics'],
      color: 'teal',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
    blue: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', hover: 'hover:bg-cyan-500' },
    green: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', hover: 'hover:bg-emerald-500' },
    purple: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', hover: 'hover:bg-cyan-500' },
    red: { bg: 'bg-orange-500/20', text: 'text-orange-400', hover: 'hover:bg-orange-500' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-600' },
    teal: { bg: 'bg-teal-500/20', text: 'text-teal-400', hover: 'hover:bg-teal-500' },
  };

  return (
    <div className="">
      <section className=" text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Solutions for Every Industry
          </h1>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            Tailored cloud hosting solutions designed to meet the unique needs of your business, whatever your industry.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const colors = colorClasses[solution.color];
              return (
                <div
                  key={index}
                  className=" rounded-xl shadow-md hover:shadow-xl hover:shadow-cyan-500/30 transition border-2 border-cyan-500 overflow-hidden group"
                >
                  <div className="p-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-lg mb-4 group-hover:scale-110 transition`}>
                      <solution.icon className={`h-8 w-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {solution.title}
                    </h3>
                    <p className="text-slate-400 mb-6">
                      {solution.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {solution.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-slate-300">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} mr-2`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/contact"
                      className={`inline-block px-6 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold ${colors.hover} hover:text-white transition`}
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cloud Transformation Services
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Migrate your infrastructure to the cloud with our expert guidance and support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-8 rounded-xl shadow-sm border-2 border-cyan-500">
              <h3 className="text-2xl font-bold text-white mb-4">Migration Services</h3>
              <p className="text-slate-400 mb-6">
                Seamlessly migrate your existing infrastructure to our cloud platform with minimal downtime.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  Assessment and planning
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  Data migration and transfer
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  Testing and validation
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  Post-migration support
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 p-8 rounded-xl shadow-sm border-2 border-cyan-500">
              <h3 className="text-2xl font-bold text-white mb-4">Consulting Services</h3>
              <p className="text-slate-400 mb-6">
                Get expert advice on cloud architecture, optimization, and best practices.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  Architecture design
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  Performance optimization
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  Security hardening
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  Cost optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16  text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Contact our solutions team to discuss your specific requirements
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 text-cyan-400 border-2 border-cyan-500 rounded-lg font-semibold hover:border-4 transition"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
