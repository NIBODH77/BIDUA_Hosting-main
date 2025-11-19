import { DocLayout } from '../../../components/docs/DocLayout';
import { Mail, Settings } from 'lucide-react';

export function ConfigEmail() {
  return (
    <DocLayout
      title="Email Configuration"
      description="Configure email service for notifications and communications"
      breadcrumbs={[
        { label: 'Configuration', path: '/docs/config' },
        { label: 'Email Configuration' }
      ]}
      prevPage={{ title: 'Payment Gateway', path: '/docs/config/payment' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Configuration</h2>
          <p className="text-slate-600 mb-4">Setup email service for sending notifications, invoices, and communications.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Service Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              {
                service: 'SendGrid',
                cost: '$20+/month',
                features: '100K emails/month, API, Templates',
                setup: '5 min'
              },
              {
                service: 'Mailgun',
                cost: 'Free tier',
                features: '10K emails/month free, Webhooks',
                setup: '5 min'
              },
              {
                service: 'AWS SES',
                cost: 'Pay per email',
                features: 'Scalable, Low cost',
                setup: '10 min'
              },
              {
                service: 'Postmark',
                cost: '$25+/month',
                features: 'Transactional email, Templates',
                setup: '5 min'
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">{item.service}</h3>
                <p className="text-slate-600 text-sm mb-1">Cost: {item.cost}</p>
                <p className="text-slate-600 text-sm mb-1">Features: {item.features}</p>
                <p className="text-slate-600 text-sm">Setup: {item.setup}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">SendGrid Setup</h2>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Create Account</p>
                <p className="text-slate-600 text-sm">Visit sendgrid.com and sign up</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Get API Key</p>
                <p className="text-slate-600 text-sm">Settings → API Keys → Create key</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Verify Sender</p>
                <p className="text-slate-600 text-sm">Sender Authentication → Verify email</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Configure Application</p>
                <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-xs mt-2 overflow-x-auto">
                  <p>EMAIL_BACKEND=sendgrid_backend.SendgridBackend</p>
                  <p>SENDGRID_API_KEY=SG.xxxxx</p>
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Environment Configuration</h2>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Email Settings</h3>
            <div className="space-y-1 text-slate-600 text-sm font-mono">
              <p># SMTP Configuration</p>
              <p>EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend</p>
              <p>EMAIL_HOST=smtp.sendgrid.net</p>
              <p>EMAIL_PORT=587</p>
              <p>EMAIL_HOST_USER=apikey</p>
              <p>EMAIL_HOST_PASSWORD=SG.xxxxx</p>
              <p>EMAIL_USE_TLS=true</p>
              <p></p>
              <p># Default From Email</p>
              <p>DEFAULT_FROM_EMAIL=noreply@biduahosting.com</p>
              <p>SERVER_EMAIL=server@biduahosting.com</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Templates</h2>
          <div className="space-y-3 mb-6">
            {[
              { name: 'Welcome Email', trigger: 'Account created', variable: 'user_name, activation_link' },
              { name: 'Password Reset', trigger: 'Password reset requested', variable: 'reset_link, expiry' },
              { name: 'Order Confirmation', trigger: 'Order placed', variable: 'order_id, amount, plan' },
              { name: 'Invoice', trigger: 'Invoice generated', variable: 'invoice_id, amount, due_date' },
              { name: 'Payment Reminder', trigger: 'Payment due', variable: 'amount, due_date, payment_link' },
              { name: 'Support Ticket', trigger: 'Ticket created/updated', variable: 'ticket_id, status, message' }
            ].map((template, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3">
                <h4 className="font-semibold text-slate-900 mb-1">{template.name}</h4>
                <p className="text-slate-600 text-sm">Trigger: {template.trigger}</p>
                <p className="text-slate-600 text-xs">Variables: {template.variable}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Events</h2>
          <div className="space-y-2 text-slate-600 text-sm mb-6">
            <p className="font-semibold text-slate-900">Core Email Events:</p>
            <ul className="space-y-1">
              <li>• User Registration → Welcome Email</li>
              <li>• Password Reset → Reset Link</li>
              <li>• Order Placed → Confirmation + Invoice</li>
              <li>• Renewal Upcoming → Reminder</li>
              <li>• Payment Received → Receipt</li>
              <li>• Support Ticket → Acknowledgment</li>
              <li>• Refund Issued → Notification</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Testing Emails</h2>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
            <h3 className="font-semibold text-slate-900 mb-2">Development</h3>
            <p className="text-slate-600 text-sm mb-3">Use console backend to test without sending real emails:</p>
            <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-xs overflow-x-auto">
              <p>EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Test Command</h3>
            <div className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-xs overflow-x-auto">
              <p>python manage.py shell</p>
              <p>from django.core.mail import send_mail</p>
              <p>send_mail('Test', 'Hello', 'from@email.com', ['to@email.com'])</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Best Practices</h2>
          <div className="space-y-3 mb-6">
            {[
              { practice: 'Use Templates', desc: 'Create reusable email templates' },
              { practice: 'Domain Authentication', desc: 'Setup SPF, DKIM, DMARC' },
              { practice: 'Unsubscribe', desc: 'Always include unsubscribe link' },
              { practice: 'Rate Limiting', desc: 'Limit emails per user/hour' },
              { practice: 'Error Handling', desc: 'Log email failures' },
              { practice: 'Testing', desc: 'Test templates before production' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between p-3 border border-slate-200 rounded">
                <span className="font-semibold text-slate-900">{item.practice}</span>
                <span className="text-slate-600 text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Troubleshooting</h2>
          <div className="space-y-3 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Emails Not Sending</h4>
              <ul className="space-y-1 text-slate-600 text-sm">
                <li>• Check API key is correct</li>
                <li>• Verify sender email is authenticated</li>
                <li>• Check email logs in SendGrid dashboard</li>
                <li>• Verify network connectivity</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Emails Going to Spam</h4>
              <ul className="space-y-1 text-slate-600 text-sm">
                <li>• Implement SPF/DKIM records</li>
                <li>• Include sender name properly</li>
                <li>• Avoid spam trigger words</li>
                <li>• Monitor bounce rates</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tips</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Setup email templates for consistency</li>
              <li>• Monitor email delivery rates</li>
              <li>• Always test emails in development first</li>
              <li>• Use proper sender authentication</li>
              <li>• Implement email preferences for users</li>
              <li>• Keep unsubscribe links working</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
