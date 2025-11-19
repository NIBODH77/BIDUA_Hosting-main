const privacyPrinciples = [
  {
    title: 'Information We Collect',
    details: [
      'Account data such as your name, company name, billing address, and contact information provided during signup.',
      'Usage telemetry and service logs that help us secure the platform and monitor performance.',
      'Payment identifiers handled through compliant processors; BIDUA does not store full card numbers.'
    ]
  },
  {
    title: 'How We Use Data',
    details: [
      'Provisioning and maintaining your hosting services across our global infrastructure.',
      'Fraud prevention, legal compliance, customer support, and service improvements.',
      'Sending billing updates, incident notifications, and product announcements (you may opt out of marketing messages).'
    ]
  },
  {
    title: 'Your Controls',
    details: [
      'Update or delete billing profiles from the dashboard or by contacting support.',
      'Request data export, correction, or deletion subject to contractual and regulatory constraints.',
      'Configure backups, encryption, and access controls within your workloads. BIDUA will never access your data unless you authorize us for support or we are compelled by law.'
    ]
  }
];

export function Privacy() {
  return (
    <div className="bg-slate-950 text-slate-300 py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-cyan-400">BIDUA Industries Pvt Ltd</p>
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-base text-slate-400">
            We are committed to protecting the data of every customer served from our Noida, India headquarters across global regions.
          </p>
        </header>

        <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-6 space-y-3">
          <p className="text-sm">
            BIDUA Industries Pvt Ltd collects only the information required to deliver secure hosting services, process payments, and keep you informed.
            We never sell personal data and restrict access to trained personnel under confidentiality obligations.
          </p>
          <p className="text-sm">Your data may be processed in the country closest to your workloads to satisfy latency and compliance requirements.</p>
        </div>

        <section className="space-y-8">
          {privacyPrinciples.map((principle) => (
            <article key={principle.title} className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{principle.title}</h2>
              <ul className="space-y-3 text-sm list-disc list-inside text-slate-300">
                {principle.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Data Retention & Subprocessors</h2>
          <p className="text-sm text-slate-300">
            Billing records are retained for the duration of your account and for up to seven (7) years after the last transaction to comply with Indian and
            international tax regulations. Service logs are retained for 90 days unless otherwise required for active security investigations.
          </p>
          <p className="text-sm text-slate-300">
            We work with vetted infrastructure and payment partners that meet or exceed ISO, SOC, or PCI requirements. A current list is available on request.
          </p>
        </section>

        <section className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Contact & Requests</h2>
          <p className="text-sm text-slate-300">
            Email <a href="mailto:support@biduahosting.com" className="text-cyan-400 hover:underline">support@biduahosting.com</a> or call +1 (555) 123-4567 to
            submit privacy questions, file a complaint, or exercise your rights. Postal correspondence can be sent to BIDUA Industries Pvt Ltd, Noida, Uttar Pradesh, India.
          </p>
        </section>
      </div>
    </div>
  );
}
