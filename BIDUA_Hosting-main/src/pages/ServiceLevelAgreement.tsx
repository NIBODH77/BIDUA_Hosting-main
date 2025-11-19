interface SlaTarget {
  title: string;
  metrics: string[];
}

const slaTargets: SlaTarget[] = [
  {
    title: 'Availability Commitment',
    metrics: [
      'A monthly uptime target of 99.9% measured across each billing cycle.',
      'Downtime excludes maintenance windows announced at least 24 hours in advance and events outside BIDUA control (force majeure, large-scale ISP outages).'
    ]
  },
  {
    title: 'Support Response Objectives',
    metrics: [
      'Critical incidents: first response within 30 minutes, 24/7.',
      'High priority incidents: first response within 1 hour.',
      'General requests: response within 12 business hours.'
    ]
  },
  {
    title: 'Remediation & Credits',
    metrics: [
      'If uptime falls below 99.9%, affected customers may request service credits equal to 10% of the monthly fee for each full percentage point below target.',
      'Credit claims must be filed within fifteen (15) days of the incident with supporting logs or monitoring data.'
    ]
  }
];

export function ServiceLevelAgreement() {
  return (
    <div className="bg-slate-950 text-slate-300 py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-cyan-400">BIDUA Industries Pvt Ltd</p>
          <h1 className="text-4xl font-bold text-white">Service Level Agreement</h1>
          <p className="text-base text-slate-400">Applies to global customers who deploy workloads through BIDUA Hosting and our Noida, India operations center.</p>
        </header>

        <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-6 space-y-3">
          <p className="text-sm">
            BIDUA Industries Pvt Ltd strives to deliver resilient hosting services from multiple data centers. This SLA describes the service targets, response
            expectations, and credit process accompanying every paid plan. The SLA supplements, but does not replace, the Terms of Service.
          </p>
        </div>

        <section className="space-y-8">
          {slaTargets.map((target) => (
            <article key={target.title} className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{target.title}</h2>
              <ul className="space-y-3 list-disc list-inside text-sm">
                {target.metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Customer Responsibilities</h2>
          <p className="text-sm text-slate-300">
            Customers must configure redundant deployments, maintain current contact details, and provide administrator access where necessary so our team can
            troubleshoot. Misconfiguration, resource exhaustion, or unapproved changes that cause downtime are excluded from SLA calculations.
          </p>
        </section>

        <section className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Need Assistance?</h2>
          <p className="text-sm text-slate-300">
            Contact BIDUA Industries Pvt Ltd, Noida, Uttar Pradesh, India | Email: support@biduahosting.com | Phone: +1 (555) 123-4567.
          </p>
        </section>
      </div>
    </div>
  );
}
