import { DocLayout } from '../../../components/docs/DocLayout';
import { MessageSquare, Clock, Users, Zap, File, Tag } from 'lucide-react';

export function SupportFeature() {
  return (
    <DocLayout
      title="Support Tickets System"
      description="Comprehensive guide to the support ticket system"
      breadcrumbs={[
        { label: 'Features', path: '/docs/features' },
        { label: 'Support System' }
      ]}
      prevPage={{ title: 'Payment Gateway', path: '/docs/features/payments' }}
      nextPage={{ title: 'Referral Program', path: '/docs/features/referrals' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            BIDUA Hosting provides a comprehensive support ticket system that allows you to track issues, communicate with support team, and manage technical problems efficiently. Our support team is available to assist with any hosting-related questions.
          </p>
        </section>

        {/* Support Channels */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Support Channels</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: MessageSquare,
                title: 'Support Tickets',
                description: 'Create and track support requests in your dashboard'
              },
              {
                icon: Clock,
                title: 'Live Chat',
                description: 'Get instant help during business hours'
              },
              {
                icon: File,
                title: 'Documentation',
                description: 'Self-service guides and knowledge base'
              },
              {
                icon: Users,
                title: 'Email Support',
                description: 'Reach out via email for detailed issues'
              }
            ].map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div key={index} className="border border-slate-200 rounded-lg p-6 hover:border-cyan-400 transition">
                  <Icon className="h-6 w-6 text-cyan-500 mb-3" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{channel.title}</h3>
                  <p className="text-slate-600">{channel.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Support Tiers */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Support Tiers</h2>

          <p className="text-slate-600 mb-6">
            Choose a support tier that matches your needs:
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Standard</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Premium</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Response Time</td>
                  <td className="px-4 py-3 text-slate-600">24 hours</td>
                  <td className="px-4 py-3 text-slate-600">4 hours</td>
                  <td className="px-4 py-3 text-slate-600">1 hour</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">Availability</td>
                  <td className="px-4 py-3 text-slate-600">Business Hours</td>
                  <td className="px-4 py-3 text-slate-600">24/7</td>
                  <td className="px-4 py-3 text-slate-600">24/7</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Support Channels</td>
                  <td className="px-4 py-3 text-slate-600">Tickets, Email</td>
                  <td className="px-4 py-3 text-slate-600">All + Chat</td>
                  <td className="px-4 py-3 text-slate-600">All + Phone</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">Dedicated Manager</td>
                  <td className="px-4 py-3 text-slate-600">No</td>
                  <td className="px-4 py-3 text-slate-600">No</td>
                  <td className="px-4 py-3 text-slate-600">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Priority</td>
                  <td className="px-4 py-3 text-slate-600">Normal</td>
                  <td className="px-4 py-3 text-slate-600">High</td>
                  <td className="px-4 py-3 text-slate-600">Critical</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">Cost</td>
                  <td className="px-4 py-3 text-slate-600">Included</td>
                  <td className="px-4 py-3 text-slate-600">$79/month</td>
                  <td className="px-4 py-3 text-slate-600">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Creating Support Tickets */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Creating Support Tickets</h2>

          <p className="text-slate-600 mb-6">
            Follow these steps to create a support ticket:
          </p>

          <ol className="space-y-4 my-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">1</span>
              <div>
                <p className="font-semibold text-slate-900">Access Support Section</p>
                <p className="text-slate-600">Go to Dashboard → Support or click "Open Ticket" button</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">2</span>
              <div>
                <p className="font-semibold text-slate-900">Click "New Ticket"</p>
                <p className="text-slate-600">Select the create new support ticket option</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">3</span>
              <div>
                <p className="font-semibold text-slate-900">Fill Out Form</p>
                <p className="text-slate-600">Complete ticket details including category, subject, and description</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">4</span>
              <div>
                <p className="font-semibold text-slate-900">Add Attachments (Optional)</p>
                <p className="text-slate-600">Upload screenshots, logs, or relevant files</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">5</span>
              <div>
                <p className="font-semibold text-slate-900">Submit Ticket</p>
                <p className="text-slate-600">Click submit and receive ticket number via email</p>
              </div>
            </li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-slate-700">Pro tip: Provide detailed information and error messages in your first ticket to help our team resolve your issue faster.</p>
          </div>
        </section>

        {/* Ticket Information */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ticket Information Form</h2>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 my-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Essential Information</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-cyan-500" />
                  <span>Category</span>
                </h4>
                <p className="text-slate-600 mb-2">Select the category that best describes your issue:</p>
                <ul className="space-y-1 text-slate-600">
                  <li>• Technical Support</li>
                  <li>• Billing & Invoicing</li>
                  <li>• Account Management</li>
                  <li>• Security & Abuse</li>
                  <li>• Feature Request</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-cyan-500" />
                  <span>Subject</span>
                </h4>
                <p className="text-slate-600">Brief title summarizing your issue (3-100 characters)</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                  <File className="h-4 w-4 text-cyan-500" />
                  <span>Description</span>
                </h4>
                <p className="text-slate-600">Detailed explanation of the issue including:</p>
                <ul className="space-y-1 text-slate-600 mt-2">
                  <li>• What happened</li>
                  <li>• When it started</li>
                  <li>• Steps to reproduce</li>
                  <li>• Error messages received</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Affected Services</h4>
                <p className="text-slate-600">Select which hosting plan or service is affected</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Priority Level</h4>
                <p className="text-slate-600">Choose how urgent this issue is:</p>
                <ul className="space-y-1 text-slate-600 mt-2">
                  <li>• Low - General inquiry</li>
                  <li>• Medium - Minor issue</li>
                  <li>• High - Service degraded</li>
                  <li>• Urgent - Service down</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Tickets */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tracking Your Tickets</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Ticket Status</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {[
              { status: 'Open', color: 'blue', description: 'Ticket created and waiting for support response' },
              { status: 'In Progress', color: 'yellow', description: 'Support team is actively working on your issue' },
              { status: 'Waiting for You', color: 'orange', description: 'Awaiting your response or additional information' },
              { status: 'Resolved', color: 'green', description: 'Issue has been fixed and verified' },
              { status: 'Closed', color: 'gray', description: 'Ticket is archived after 30 days of inactivity' },
              { status: 'Re-opened', color: 'red', description: 'Issue recurred after being resolved' }
            ].map((item, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  <p className="font-semibold text-slate-900">{item.status}</p>
                </div>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4 mt-6">Viewing Your Tickets</h3>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <ol className="space-y-3 text-slate-600">
              <li className="flex items-start space-x-3">
                <span className="font-bold text-cyan-500">1</span>
                <span>Go to Dashboard → Support section</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-cyan-500">2</span>
                <span>See list of all your tickets with status indicators</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-cyan-500">3</span>
                <span>Click on any ticket to view full conversation</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-cyan-500">4</span>
                <span>Reply directly or add comments to the ticket</span>
              </li>
            </ol>
          </div>
        </section>

        {/* Communication */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Communicating with Support</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Best Practices</h3>

          <div className="space-y-4 my-6">
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-green-900 mb-2">Do:</p>
              <ul className="space-y-1 text-green-800 text-sm">
                <li>• Be clear and concise in your descriptions</li>
                <li>• Provide all relevant information upfront</li>
                <li>• Include error messages and log files</li>
                <li>• Be polite and professional</li>
                <li>• Follow up promptly with any requested information</li>
              </ul>
            </div>

            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">Don't:</p>
              <ul className="space-y-1 text-red-800 text-sm">
                <li>• Open multiple tickets for the same issue</li>
                <li>• Send sensitive information like passwords</li>
                <li>• Use vague descriptions</li>
                <li>• Expect immediate responses outside support hours</li>
                <li>• Attach large files without prior approval</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Attachments */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Adding Attachments</h2>

          <p className="text-slate-600 mb-6">
            Attachments help us understand and resolve your issue faster:
          </p>

          <div className="border border-slate-200 rounded-lg p-6 my-6">
            <h3 className="font-semibold text-slate-900 mb-4">Supported File Types</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { type: 'Images', formats: 'PNG, JPG, GIF, SVG' },
                { type: 'Documents', formats: 'PDF, DOC, TXT' },
                { type: 'Archives', formats: 'ZIP, RAR, 7Z' },
                { type: 'Logs', formats: 'LOG, TXT' },
                { type: 'Code', formats: 'PHP, JS, PY, GO' },
                { type: 'Config', formats: 'CONF, INI, JSON' }
              ].map((item, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded p-3">
                  <p className="font-semibold text-slate-900">{item.type}</p>
                  <p className="text-sm text-slate-600">{item.formats}</p>
                </div>
              ))}
            </div>

            <p className="text-slate-600 mt-6 text-sm">Max file size: 25 MB per attachment, up to 5 attachments per ticket</p>
          </div>
        </section>

        {/* Knowledge Base */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Knowledge Base & FAQ</h2>

          <p className="text-slate-600 mb-6">
            Check our knowledge base for quick answers to common questions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                title: 'Getting Started',
                items: ['Creating an account', 'Purchasing a plan', 'First server setup', 'Payment methods']
              },
              {
                title: 'Server Management',
                items: ['Restarting server', 'Changing resources', 'Managing users', 'Backups & recovery']
              },
              {
                title: 'Security',
                items: ['Setting up firewall', 'SSH key setup', 'DDoS protection', 'SSL certificates']
              },
              {
                title: 'Troubleshooting',
                items: ['Connection issues', 'Performance problems', 'Error messages', 'Update guide']
              }
            ].map((category, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="text-slate-600 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Use the search function to find existing solutions first</li>
              <li>• Check the knowledge base before opening a ticket</li>
              <li>• Be specific with error messages and timestamps</li>
              <li>• Respond promptly to support team questions</li>
              <li>• Rate your support experience after resolution</li>
              <li>• Keep your contact information updated</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
