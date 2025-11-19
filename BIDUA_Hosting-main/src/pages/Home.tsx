import { Link } from 'react-router-dom';
import { Server, Shield, Zap, Clock, Globe, Headphones as HeadphonesIcon, CheckCircle, TrendingUp } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'NVMe SSD storage and high-performance processors for blazing fast speeds',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Advanced DDoS protection and enterprise-grade security measures',
    },
    {
      icon: Clock,
      title: '99.9% Uptime',
      description: 'Guaranteed uptime with redundant infrastructure and monitoring',
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Multiple data centers worldwide for optimal performance',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Expert support team available around the clock to help you',
    },
    {
      icon: TrendingUp,
      title: 'Easy Scaling',
      description: 'Seamlessly upgrade resources as your business grows',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Servers' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '150+', label: 'Countries' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="bg-slate-950">
      <section className="relative  text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div> */}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Enterprise Cloud Hosting Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-cyan-100">
              High-performance cloud servers with unmatched reliability and security. Deploy in seconds, scale effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pricing"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition transform hover:scale-105 shadow-lg shadow-cyan-500/50"
              >
                View Pricing
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4  rounded-lg font-semibold hover:bg-slate-700 transition border-2 border-cyan-500 hover:shadow-lg"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white/5 backdrop-blur-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose BIDUA Hosting?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built for developers, trusted by enterprises. Experience cloud hosting that scales with your ambitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className=" p-8 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition border-2 border-cyan-500 backdrop-blur-sm"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-cyan-500/20 rounded-lg mb-4">
                  <feature.icon className="h-7 w-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cloud Server Solutions
            </h2>
            <p className="text-xl text-slate-400">
              Choose the perfect configuration for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-950 p-8 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition border-2 border-cyan-500/30 hover:border-cyan-500">
              <div className="text-center mb-6">
                <Server className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">General Purpose</h3>
                <p className="text-slate-400">Balanced CPU and memory for most workloads</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Starting from 2 vCPU</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Up to 16GB RAM</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">NVMe SSD Storage</span>
                </li>
              </ul>
              <Link
                to="/pricing?type=general_purpose"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-400 hover:to-teal-400 transition font-semibold shadow-lg shadow-cyan-500/50"
              >
                View Plans
              </Link>
            </div>

            <div className="bg-slate-950 p-8 rounded-xl shadow-lg hover:shadow-orange-500/30 transition border-2 border-orange-500/30 hover:border-orange-500">
              <div className="text-center mb-6">
                <Zap className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">CPU Optimized</h3>
                <p className="text-slate-400">High-performance computing workloads</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Up to 32 vCPU</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Dedicated CPU cores</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Advanced CPU features</span>
                </li>
              </ul>
              <Link
                to="/pricing?type=cpu_optimized"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-400 hover:to-red-400 transition font-semibold shadow-lg shadow-orange-500/50"
              >
                View Plans
              </Link>
            </div>

            <div className="bg-slate-950 p-8 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition border-2 border-emerald-500/30 hover:border-emerald-500">
              <div className="text-center mb-6">
                <TrendingUp className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Memory Optimized</h3>
                <p className="text-slate-400">Memory-intensive applications</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Up to 256GB RAM</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">High memory-to-CPU ratio</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Perfect for databases</span>
                </li>
              </ul>
              <Link
                to="/pricing?type=memory_optimized"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-400 hover:to-green-400 transition font-semibold shadow-lg shadow-emerald-500/50"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20  text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-cyan-100">
            Deploy your first server in minutes. No credit card required for signup.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-teal-400 transition transform hover:scale-105 shadow-lg shadow-cyan-500/50"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
