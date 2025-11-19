import { Link } from 'react-router-dom';
import { Server, Cpu, HardDrive, Network, Shield, CheckCircle } from 'lucide-react';

export function DedicatedServers() {
  const servers = [
    {
      name: 'Entry Server',
      price: 8960,
      specs: {
        cpu: 'Intel Xeon E-2136',
        cores: '6 Cores / 12 Threads',
        ram: '32GB DDR4',
        storage: '2x 512GB NVMe SSD',
        bandwidth: '10TB @ 1Gbps',
        ipv4: '1 IPv4',
      },
      features: ['Full Root Access', 'IPMI Access', 'DDoS Protection', '24/7 Support'],
    },
    {
      name: 'Professional Server',
      price: 15680,
      specs: {
        cpu: 'Intel Xeon E-2288G',
        cores: '8 Cores / 16 Threads',
        ram: '64GB DDR4',
        storage: '2x 1TB NVMe SSD',
        bandwidth: '20TB @ 1Gbps',
        ipv4: '5 IPv4',
      },
      features: ['Full Root Access', 'IPMI Access', 'Advanced DDoS Protection', 'Priority Support'],
      popular: true,
    },
    {
      name: 'Enterprise Server',
      price: 26880,
      specs: {
        cpu: 'Intel Xeon Silver 4214',
        cores: '12 Cores / 24 Threads',
        ram: '128GB DDR4',
        storage: '4x 1TB NVMe SSD',
        bandwidth: '50TB @ 10Gbps',
        ipv4: '16 IPv4',
      },
      features: ['Full Root Access', 'IPMI Access', 'Enterprise DDoS Protection', 'Dedicated Manager'],
    },
  ];

  return (
    <div className="">
      <section className=" text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bare Metal Dedicated Servers
            </h1>
            <p className="text-xl text-cyan-200">
              Maximum performance with dedicated hardware. No shared resources, complete control, and unmatched reliability.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Cpu, title: 'Latest Hardware', desc: 'Intel Xeon processors' },
              { icon: HardDrive, title: 'NVMe Storage', desc: 'Ultra-fast SSD drives' },
              { icon: Network, title: 'Premium Network', desc: 'Up to 10Gbps bandwidth' },
              { icon: Shield, title: 'DDoS Protection', desc: 'Enterprise-grade security' },
            ].map((item, index) => (
              <div key={index} className="bg-slate-900 p-6 rounded-lg shadow-sm text-center border-2 border-cyan-500">
                <item.icon className="h-10 w-10 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Dedicated Server
            </h2>
            <p className="text-xl text-slate-400">
              All servers come with instant provisioning and full IPMI access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servers.map((server, index) => (
              <div
                key={index}
                className={`bg-slate-900 rounded-xl shadow-lg overflow-hidden hover:shadow-cyan-500/30 transition ${
                  server.popular ? 'ring-2 ring-cyan-500 transform scale-105 border-2 border-cyan-500' : 'border-2 border-cyan-500'
                }`}
              >
                {server.popular && (
                  <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <Server className="h-12 w-12 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center mb-2">
                    {server.name}
                  </h3>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-white">₹{server.price}</span>
                    <span className="text-slate-400">/month</span>
                  </div>

                  <div className="space-y-3 mb-6 bg-slate-950 p-4 rounded-lg border-2 border-cyan-500/50">
                    <div>
                      <p className="text-sm text-slate-400">Processor</p>
                      <p className="font-semibold text-white">{server.specs.cpu}</p>
                      <p className="text-sm text-slate-400">{server.specs.cores}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Memory</p>
                      <p className="font-semibold text-white">{server.specs.ram}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Storage</p>
                      <p className="font-semibold text-white">{server.specs.storage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Bandwidth</p>
                      <p className="font-semibold text-white">{server.specs.bandwidth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">IP Addresses</p>
                      <p className="font-semibold text-white">{server.specs.ipv4}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-8">
                    {server.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/signup"
                    className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
                      server.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400'
                        : 'bg-slate-800 text-white hover:bg-slate-700 border-2 border-cyan-500/50'
                    }`}
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16  text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Custom Configuration?</h2>
          <p className="text-xl text-cyan-100 mb-8">
            Contact us for custom server builds with your exact specifications
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4  text-cyan-600 rounded-lg font-semibold hover:bg-cyan-5 transition border-2 border-cyan-400"
          >
            Contact Sales Team
          </Link>
        </div>
      </section>
    </div>
  );
}
