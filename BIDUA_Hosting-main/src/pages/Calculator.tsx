import { PlanCalculator } from '../components/calculator/PlanCalculator';
import { CheckCircle } from 'lucide-react';

export function Calculator() {
  return (
    <div className=" min-h-screen ">
      <section className=" text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Build Your Custom Server
            </h1>
            <p className="text-lg md:text-xl text-cyan-100">
              Configure your perfect server setup and see pricing in real-time
            </p>
          </div>
        </div>
      </section>

      <PlanCalculator />

      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why Choose Custom Configuration?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Pay only for what you need',
              'Scale resources as you grow',
              'Transparent pricing with no hidden fees',
              'Flexible billing cycles with discounts',
              'Intel Xeon Gold processors',
              'NVMe SSD storage included',
              '99.9% uptime SLA guarantee',
              'Deploy in under 5 minutes'
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-3 bg-slate-950 p-4 rounded-lg border-2 border-cyan-500">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
