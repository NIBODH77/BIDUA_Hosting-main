export function Terms() {
  const sections = [
    {
      title: '1. Company & Agreement',
      content: [
        'These Terms of Service govern your access to BIDUA Hosting products that are operated by BIDUA Industries Pvt Ltd, headquartered in Noida, India.',
        'By creating an account, subscribing to any hosting service, or accessing our applications you confirm that you are at least 18 years old and are capable of entering into a binding contract.'
      ]
    },
    {
      title: '2. Account Eligibility & Security',
      content: [
        'You are responsible for maintaining the confidentiality of your login credentials and any activity under your account. Notify us immediately if you suspect unauthorized access or data misuse.',
        'We may suspend or reject any signup request that does not meet our verification requirements or violates applicable laws.'
      ]
    },
    {
      title: '3. Acceptable Use & Fair Resources',
      content: [
        'Our infrastructure is shared across a global customer base. You agree not to engage in abusive workloads, unsolicited messaging, mining, or any practice that threatens platform stability.',
        'We reserve the right to throttle, suspend, or terminate workloads that impact other customers or violate regional compliance mandates.'
      ]
    },
    {
      title: '4. Billing & Payments',
      content: [
        'All plans are billed in advance according to the billing cycle selected at checkout. Taxes are applied based on your billing country and Indian GST regulations.',
        'Invoices are delivered electronically. Failure to pay within the due date may lead to service suspension until the outstanding balance is cleared.'
      ]
    },
    {
      title: '5. Data Privacy & Security',
      content: [
        'We implement layered security practices, but you are responsible for configuring backups, encryption, and application-level protections. Our Privacy Policy explains how we collect and process personal information.',
        'Customer data is hosted in compliant data centers. We do not access your workloads except when required to deliver support or by lawful request.'
      ]
    },
    {
      title: '6. Support & Maintenance',
      content: [
        '24/7 support is available through the BIDUA dashboard, email, and dedicated escalation channels. Managed support tiers include proactive monitoring as described on the respective plan page.',
        'Scheduled maintenance windows are communicated in advance. Emergency maintenance may occur without prior notice to preserve platform integrity.'
      ]
    },
    {
      title: '7. Termination',
      content: [
        'You may cancel services at any time from the dashboard. No refunds are offered for partial billing cycles unless required by law.',
        'We may terminate or suspend your access for violations of these Terms, unpaid invoices, or requests by regulators.'
      ]
    },
    {
      title: '8. Limitation of Liability',
      content: [
        'To the fullest extent permitted by law, BIDUA Industries Pvt Ltd is not liable for lost profits, indirect, or consequential damages. Our aggregate liability is limited to fees paid in the preceding thirty (30) days for the impacted service.'
      ]
    },
    {
      title: '9. Contact & Notices',
      content: [
        'Primary contact: BIDUA Industries Pvt Ltd, Noida, Uttar Pradesh, India. Email: support@biduahosting.com | Phone: +1 (555) 123-4567.'
      ]
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-300 py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-cyan-400">BIDUA Industries Pvt Ltd</p>
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="text-base text-slate-400">Effective from {new Date().getFullYear()} and applicable to all BIDUA Hosting platforms worldwide.</p>
        </header>

        <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-6">
          <p className="text-sm text-slate-300">
            Registered office: BIDUA Industries Pvt Ltd, Noida, Uttar Pradesh, India. These terms set out the expectations for using BIDUA
            Hosting services, payment obligations, and the rights granted to you as a global customer.
          </p>
        </div>

        <section className="space-y-8">
          {sections.map((section) => (
            <article key={section.title} className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-3">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              {section.content.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-slate-300">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
