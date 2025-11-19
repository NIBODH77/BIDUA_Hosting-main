import { DocLayout } from '../../../components/docs/DocLayout';
import { MessageSquare, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export function UserSupport() {
  return (
    <DocLayout
      title="Using the Support System"
      description="Guide to opening and managing support tickets"
      breadcrumbs={[
        { label: 'User Guides', path: '/docs/user' },
        { label: 'Using Support' }
      ]}
      prevPage={{ title: 'Billing & Payments', path: '/docs/user/billing' }}
      nextPage={{ title: 'Earning from Referrals', path: '/docs/user/referrals' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            Get help quickly through BIDUA Hosting support system. Create tickets, chat with support team, and track issue resolution.
          </p>
        </section>

        {/* Quick Support */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Support Options</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                title: 'Live Chat',
                available: 'Business hours',
                response: 'Instant',
                best: 'Quick questions'
              },
              {
                title: 'Support Tickets',
                available: '24/7',
                response: '4-24 hours',
                best: 'Complex issues'
              },
              {
                title: 'Email Support',
                available: '24/7',
                response: '4-24 hours',
                best: 'Detailed issues'
              },
              {
                title: 'Knowledge Base',
                available: '24/7',
                response: 'Instant',
                best: 'Self-service'
              }
            ].map((option, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">{option.title}</h3>
                <p className="text-slate-600 text-sm mb-1"><strong>Available:</strong> {option.available}</p>
                <p className="text-slate-600 text-sm mb-1"><strong>Response:</strong> {option.response}</p>
                <p className="text-slate-600 text-sm"><strong>Best for:</strong> {option.best}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Opening a Ticket */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Opening a Support Ticket</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Step-by-Step Process</h3>

          <ol className="space-y-4 my-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">1</span>
              <div>
                <p className="font-semibold text-slate-900">Access Support</p>
                <p className="text-slate-600">Dashboard → Support or click "Help" button</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">2</span>
              <div>
                <p className="font-semibold text-slate-900">Click "New Ticket"</p>
                <p className="text-slate-600">Create a new support request</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">3</span>
              <div>
                <p className="font-semibold text-slate-900">Select Category</p>
                <p className="text-slate-600">Choose issue type (Technical, Billing, Account, etc)</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">4</span>
              <div>
                <p className="font-semibold text-slate-900">Enter Subject</p>
                <p className="text-slate-600">Brief title describing your issue</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">5</span>
              <div>
                <p className="font-semibold text-slate-900">Describe Issue</p>
                <p className="text-slate-600">Detailed explanation of problem and what you've tried</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">6</span>
              <div>
                <p className="font-semibold text-slate-900">Add Attachments</p>
                <p className="text-slate-600">Upload screenshots, logs, or error messages</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">7</span>
              <div>
                <p className="font-semibold text-slate-900">Submit</p>
                <p className="text-slate-600">Submit ticket and receive confirmation number</p>
              </div>
            </li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-slate-700"><strong>Pro Tip:</strong> Provide detailed information in your first message to help us resolve your issue faster!</p>
          </div>
        </section>

        {/* Ticket Categories */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Support Categories</h2>

          <p className="text-slate-600 mb-6">
            Choose the right category for faster resolution:
          </p>

          <div className="space-y-3 mb-6">
            {[
              {
                category: 'Technical Support',
                issues: ['Server errors', 'Connectivity issues', 'Performance problems', 'Software installation']
              },
              {
                category: 'Billing & Invoicing',
                issues: ['Invoice questions', 'Payment issues', 'Refunds', 'Billing disputes']
              },
              {
                category: 'Account Management',
                issues: ['Password reset', 'Account access', 'Profile updates', 'Subscription changes']
              },
              {
                category: 'Security & Abuse',
                issues: ['Suspicious activity', 'Security concerns', 'Abuse reports', 'Data breach']
              },
              {
                category: 'Feature Request',
                issues: ['New features', 'Feature improvements', 'Suggestions']
              },
              {
                category: 'General Inquiry',
                issues: ['Other questions', 'Information requests']
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">{item.category}</h3>
                <p className="text-slate-600 text-sm">Examples: {item.issues.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ticket Details */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What to Include in Your Ticket</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Essential Information</h3>

          <div className="space-y-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-cyan-500" />
                <span>Clear Subject Line</span>
              </h4>
              <p className="text-slate-600 text-sm">Be specific: "Cannot connect to server via SSH" not "Help needed"</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-cyan-500" />
                <span>Detailed Description</span>
              </h4>
              <p className="text-slate-600 text-sm mb-2">Include:</p>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>• What happened and when</li>
                <li>• Steps you took before the issue</li>
                <li>• Error messages (verbatim if possible)</li>
                <li>• What you've already tried</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-cyan-500" />
                <span>System Information</span>
              </h4>
              <p className="text-slate-600 text-sm">Include relevant details like:</p>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>• Server name/IP</li>
                <li>• Operating system</li>
                <li>• Browser/client used</li>
                <li>• Your location/timezone</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-cyan-500" />
                <span>Screenshots/Logs</span>
              </h4>
              <p className="text-slate-600 text-sm">Attach error screenshots or log files for faster diagnosis</p>
            </div>
          </div>
        </section>

        {/* Tracking Tickets */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tracking Your Tickets</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Ticket Status</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {[
              { status: 'Open', color: 'blue', desc: 'Waiting for support response' },
              { status: 'In Progress', color: 'yellow', desc: 'Team is working on it' },
              { status: 'Waiting for You', color: 'orange', desc: 'Awaiting your information' },
              { status: 'Resolved', color: 'green', desc: 'Issue has been fixed' },
              { status: 'Closed', color: 'gray', desc: 'Ticket archived' },
              { status: 'Re-opened', color: 'red', desc: 'Issue recurred' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg">
                <div className={`w-3 h-3 rounded-full bg-${item.color}-500 mt-1`}></div>
                <div>
                  <p className="font-semibold text-slate-900">{item.status}</p>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Viewing Your Tickets</h3>

          <ol className="space-y-3 mb-6 text-slate-600">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span>Go to Dashboard → Support</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span>See list of all your tickets</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span>Click ticket to view conversation</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span>Add replies and attachments</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">5</span>
              <span>Mark as resolved when issue is fixed</span>
            </li>
          </ol>
        </section>

        {/* Responding to Support */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Responding to Support Team</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Best Practices</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">Do</h4>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>✓ Reply promptly to requests</li>
                <li>✓ Provide requested information</li>
                <li>✓ Be clear and detailed</li>
                <li>✓ Try suggested solutions</li>
                <li>✓ Be polite and professional</li>
              </ul>
            </div>

            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-3">Don't</h4>
              <ul className="space-y-2 text-red-800 text-sm">
                <li>✗ Share passwords/sensitive info</li>
                <li>✗ Open multiple tickets for same issue</li>
                <li>✗ Use vague descriptions</li>
                <li>✗ Ignore support responses</li>
                <li>✗ Complain or be rude</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Adding Attachments</h3>

          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <p className="text-slate-600 text-sm mb-3">Supported file types:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              <div>PNG, JPG, GIF (images)</div>
              <div>PDF, DOC, TXT (documents)</div>
              <div>ZIP, RAR (archives)</div>
              <div>LOG, CONF (configs)</div>
            </div>
            <p className="text-slate-600 text-xs mt-3">Max 25MB per file, 5 files per reply</p>
          </div>
        </section>

        {/* Response Times */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Support Response Times</h2>

          <p className="text-slate-600 mb-6">
            Response times depend on support tier and priority:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Priority</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Standard</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Premium</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 font-medium">Urgent (Critical)</td>
                  <td className="px-4 py-3">2 hours</td>
                  <td className="px-4 py-3">30 minutes</td>
                  <td className="px-4 py-3">15 minutes</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium">High (Major Issue)</td>
                  <td className="px-4 py-3">4 hours</td>
                  <td className="px-4 py-3">1 hour</td>
                  <td className="px-4 py-3">30 minutes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Medium (Minor Issue)</td>
                  <td className="px-4 py-3">12 hours</td>
                  <td className="px-4 py-3">4 hours</td>
                  <td className="px-4 py-3">2 hours</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-medium">Low (General)</td>
                  <td className="px-4 py-3">24 hours</td>
                  <td className="px-4 py-3">12 hours</td>
                  <td className="px-4 py-3">4 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Self-Service */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Self-Service Resources</h2>

          <p className="text-slate-600 mb-6">
            Many issues can be resolved quickly using our resources:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { title: 'Knowledge Base', desc: 'Searchable articles and guides' },
              { title: 'FAQ', desc: 'Common questions and answers' },
              { title: 'Video Tutorials', desc: 'Step-by-step video guides' },
              { title: 'Community Forum', desc: 'Get help from other users' }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:border-cyan-400 transition cursor-pointer">
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feedback & Rating */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Rating Support Experience</h2>

          <p className="text-slate-600 mb-6">
            Help us improve by rating your support experience:
          </p>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
            <p className="text-slate-600 mb-4">After ticket resolution, you'll receive a survey asking:</p>
            <ul className="space-y-2 text-slate-600">
              <li>• How satisfied were you with the support?</li>
              <li>• Was your issue resolved?</li>
              <li>• How would you rate the support team?</li>
              <li>• Any suggestions for improvement?</li>
            </ul>
            <p className="text-slate-600 mt-4 text-sm">Your feedback helps us serve you better!</p>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Check knowledge base first for quick answers</li>
              <li>• Use clear subject lines for easy tracking</li>
              <li>• Include relevant error messages and logs</li>
              <li>• Try suggested solutions and report back</li>
              <li>• Respond promptly to support requests</li>
              <li>• Save ticket number for future reference</li>
              <li>• Rate your experience to help us improve</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
