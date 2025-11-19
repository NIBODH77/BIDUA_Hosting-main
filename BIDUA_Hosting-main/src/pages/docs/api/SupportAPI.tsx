import { DocLayout } from '../../../components/docs/DocLayout';
import { MessageSquare, Send, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export function SupportAPI() {
  return (
    <DocLayout
      title="Support API"
      description="API documentation for support tickets, issue tracking, and customer communication."
      breadcrumbs={[{ label: 'API' }, { label: 'Support' }]}
      prevPage={{ title: 'Servers API', path: '/docs/api/servers' }}
      nextPage={{ label: 'Referrals', path: '/docs/api/referrals' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Support API Overview</h2>
          <p className="text-slate-700 mb-4">
            The Support API enables customers to create support tickets, track issues, and communicate with the support team. Each ticket manages conversations and attachments.
          </p>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200 space-y-3">
            <div>
              <h3 className="font-semibold text-slate-900">Authentication</h3>
              <p className="text-slate-700 text-sm">All endpoints require authentication. Include JWT token in Authorization header.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Ticket Statuses</h3>
              <p className="text-slate-700 text-sm">open, in_progress, waiting_for_customer, resolved, closed</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Priority Levels</h3>
              <p className="text-slate-700 text-sm">low, medium, high, critical</p>
            </div>
          </div>
        </section>

        {/* Create Support Ticket */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create Support Ticket</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/support/tickets
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
                <div className="text-slate-700">Content-Type: application/json</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "title": "Server connection timeout issues",
  "description": "Experiencing frequent connection timeouts on my VPS. Happens every evening around 9 PM.",
  "category": "technical_support",
  "priority": "high",
  "order_id": 5,
  "attachments": [
    {
      "filename": "error_logs.txt",
      "url": "https://upload-service.example.com/files/abc123"
    }
  ],
  "tags": ["network", "performance"]
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (201 Created)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "id": 42,
  "ticket_number": "TKT-2024-000042",
  "user_id": 1,
  "title": "Server connection timeout issues",
  "description": "Experiencing frequent connection timeouts on my VPS. Happens every evening around 9 PM.",
  "category": "technical_support",
  "priority": "high",
  "status": "open",
  "order_id": 5,
  "attachments": [
    {
      "id": 1,
      "filename": "error_logs.txt",
      "url": "https://upload-service.example.com/files/abc123",
      "size": 2048,
      "uploaded_at": "2024-01-15T11:30:00Z"
    }
  ],
  "tags": ["network", "performance"],
  "created_at": "2024-01-15T11:30:00Z",
  "updated_at": "2024-01-15T11:30:00Z"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">401 Unauthorized</p>
                  <p className="text-red-800 text-sm">Missing or invalid authentication token</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">400 Bad Request</p>
                  <p className="text-red-800 text-sm">Missing required fields (title, description) or invalid priority</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">413 Payload Too Large</p>
                  <p className="text-red-800 text-sm">Attachments exceed size limit (10MB per file)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* List Support Tickets */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">List User Support Tickets</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/support/tickets
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Query Parameters</h3>
              <div className="bg-slate-50 rounded p-3 space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold">skip</span> (optional) - Number of tickets to skip (default: 0)</div>
                <div><span className="font-semibold">limit</span> (optional) - Number of tickets to return (default: 10, max: 50)</div>
                <div><span className="font-semibold">status</span> (optional) - Filter by ticket status (open, resolved, closed, etc.)</div>
                <div><span className="font-semibold">priority</span> (optional) - Filter by priority level</div>
                <div><span className="font-semibold">sort_by</span> (optional) - Sort field (created_at, updated_at, priority) default: created_at</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "tickets": [
    {
      "id": 42,
      "ticket_number": "TKT-2024-000042",
      "title": "Server connection timeout issues",
      "category": "technical_support",
      "priority": "high",
      "status": "in_progress",
      "assigned_to": {
        "id": 10,
        "name": "John Support",
        "avatar": "https://avatar.example.com/john.jpg"
      },
      "message_count": 5,
      "last_message_at": "2024-01-15T14:22:00Z",
      "created_at": "2024-01-15T11:30:00Z"
    },
    {
      "id": 40,
      "ticket_number": "TKT-2024-000040",
      "title": "Billing inquiry",
      "category": "billing",
      "priority": "medium",
      "status": "resolved",
      "assigned_to": {
        "id": 8,
        "name": "Sarah Billing"
      },
      "message_count": 3,
      "last_message_at": "2024-01-14T09:15:00Z",
      "created_at": "2024-01-13T16:45:00Z"
    }
  ],
  "total": 2,
  "skip": 0,
  "limit": 10
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Get Ticket Details */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Get Support Ticket Details</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/support/tickets/{'{ticket_id}'}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "id": 42,
  "ticket_number": "TKT-2024-000042",
  "user_id": 1,
  "title": "Server connection timeout issues",
  "description": "Experiencing frequent connection timeouts...",
  "category": "technical_support",
  "priority": "high",
  "status": "in_progress",
  "order_id": 5,
  "assigned_to": {
    "id": 10,
    "name": "John Support",
    "email": "john.support@bidua.com"
  },
  "attachments": [
    {
      "id": 1,
      "filename": "error_logs.txt",
      "url": "https://upload-service.example.com/files/abc123",
      "size": 2048
    }
  ],
  "tags": ["network", "performance"],
  "messages": [
    {
      "id": 1,
      "author": {
        "id": 1,
        "name": "You",
        "type": "customer"
      },
      "content": "Experiencing frequent connection timeouts...",
      "attachments": [],
      "created_at": "2024-01-15T11:30:00Z"
    },
    {
      "id": 2,
      "author": {
        "id": 10,
        "name": "John Support",
        "type": "support"
      },
      "content": "Thank you for reporting this. We're investigating your server logs...",
      "attachments": [],
      "created_at": "2024-01-15T12:45:00Z"
    }
  ],
  "created_at": "2024-01-15T11:30:00Z",
  "updated_at": "2024-01-15T14:22:00Z"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">401 Unauthorized</p>
                  <p className="text-red-800 text-sm">Missing or invalid authentication token</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">403 Forbidden</p>
                  <p className="text-red-800 text-sm">You don't have permission to access this ticket</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">404 Not Found</p>
                  <p className="text-red-800 text-sm">Support ticket with specified ID does not exist</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add Message to Ticket */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Send className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Add Message to Ticket</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/support/tickets/{'{ticket_id}'}/messages
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
                <div className="text-slate-700">Content-Type: application/json</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "content": "Thank you for the update. We've implemented a fix on our end. Please restart your server and test the connection.",
  "attachments": [
    {
      "filename": "patch_notes.txt",
      "url": "https://upload-service.example.com/files/def456"
    }
  ]
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (201 Created)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "id": 3,
  "ticket_id": 42,
  "author": {
    "id": 10,
    "name": "John Support",
    "type": "support"
  },
  "content": "Thank you for the update. We've implemented a fix on our end...",
  "attachments": [
    {
      "id": 2,
      "filename": "patch_notes.txt",
      "url": "https://upload-service.example.com/files/def456",
      "size": 1024
    }
  ],
  "created_at": "2024-01-15T15:30:00Z"
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Update Ticket Status */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Update Ticket Status</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                PATCH /api/v1/support/tickets/{'{ticket_id}'}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
                <div className="text-slate-700">Content-Type: application/json</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "status": "resolved",
  "priority": "medium"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "id": 42,
  "ticket_number": "TKT-2024-000042",
  "status": "resolved",
  "priority": "medium",
  "updated_at": "2024-01-15T16:00:00Z"
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Ticket Lifecycle */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ticket Lifecycle</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500">
                <h3 className="font-semibold text-slate-900 mb-2">1. Open</h3>
                <p className="text-slate-700 text-sm">Customer creates ticket, waiting for support team response</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-slate-900 mb-2">2. In Progress</h3>
                <p className="text-slate-700 text-sm">Support team assigned and actively investigating the issue</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-semibold text-slate-900 mb-2">3. Waiting for Customer</h3>
                <p className="text-slate-700 text-sm">Support team provided solution, waiting for customer feedback</p>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-green-50 rounded-lg p-4 border-l-4 border-pink-500">
                <h3 className="font-semibold text-slate-900 mb-2">4. Resolved</h3>
                <p className="text-slate-700 text-sm">Issue resolved successfully, can be reopened if needed</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-slate-50 rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="font-semibold text-slate-900 mb-2">5. Closed</h3>
                <p className="text-slate-700 text-sm">Ticket archived, customer can view but cannot add messages</p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Support Ticket Best Practices</h2>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Do's
              </h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Provide detailed descriptions and error messages</li>
                <li>• Attach relevant logs and screenshots</li>
                <li>• Set appropriate priority levels</li>
                <li>• Respond promptly to support team requests</li>
                <li>• Keep communication organized in single ticket</li>
                <li>• Close ticket after issue is fully resolved</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Don'ts
              </h3>
              <ul className="text-red-800 text-sm space-y-1">
                <li>• Don't create duplicate tickets for same issue</li>
                <li>• Don't share sensitive data in ticket messages</li>
                <li>• Don't spam with frequent updates</li>
                <li>• Don't set false priority to get faster response</li>
                <li>• Don't attach files larger than size limit</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore Referrals Program</h2>
          <p className="text-slate-700 mb-6">
            Learn how to earn through our referral program and track your earnings.
          </p>
          <div className="space-y-3">
            <a
              href="/docs/api/referrals"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              View Referrals API →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
