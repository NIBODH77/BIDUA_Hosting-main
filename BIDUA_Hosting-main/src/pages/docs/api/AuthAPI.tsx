import { DocLayout } from '../../../components/docs/DocLayout';
import { Lock, Key, User, CheckCircle, AlertCircle } from 'lucide-react';

export function AuthAPI() {
  return (
    <DocLayout
      title="Authentication API"
      description="Complete guide to BIDUA Hosting authentication endpoints and JWT token management."
      breadcrumbs={[{ label: 'API' }, { label: 'Authentication' }]}
      prevPage={{ title: 'Database Schema', path: '/docs/database' }}
      nextPage={{ title: 'Plans API', path: '/docs/api/plans' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication Overview</h2>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Security Method</h3>
                <p className="text-slate-700">JWT (JSON Web Token) based authentication with Bearer token in Authorization header. All passwords are hashed asynchronously using bcrypt with run_in_threadpool to prevent event loop blocking.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Password Hashing</h3>
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-900">
                  <p className="font-semibold mb-1">✓ Async Password Hashing with bcrypt</p>
                  <p>Non-blocking password hashing using asyncio run_in_threadpool. Passwords are never stored in plain text. Each password is salted and hashed before database storage.</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Token Format</h3>
                <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Token Expiration</h3>
                <p className="text-slate-700">Access tokens expire after 30 minutes. Use refresh endpoint to get new token.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Referral Integration</h3>
                <p className="text-slate-700">Registration supports optional referral code parameter. If provided, system validates the code and establishes referral relationship (L1, L2, or L3 based on network depth).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Register Endpoint */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <User className="h-6 w-6 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Register New User</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/auth/register
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe",
  "referral_code": "NFFK3NVU"  // Optional - validates referral code
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (201 Created)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "customer",
    "account_status": "active",
    "referral_code": "USR_abc123",
    "referred_by": null,
    "total_referrals": 0,
    "l1_referrals": 0,
    "l2_referrals": 0,
    "l3_referrals": 0,
    "total_earnings": "0.0",
    "created_at": "2025-11-16T14:03:44.965087Z"
  }
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">400 Bad Request</p>
                  <p className="text-red-800 text-sm">User with email already exists</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">400 Bad Request</p>
                  <p className="text-red-800 text-sm">Invalid referral code - code does not exist or is invalid</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">422 Unprocessable Entity</p>
                  <p className="text-red-800 text-sm">Required fields missing or invalid format (email, password, full_name)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Login Endpoint */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Key className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">User Login</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/auth/login
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "email": "user@example.com",
  "password": "SecurePassword123"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "company_name": "ACME Corp",
    "is_active": true,
    "is_admin": false
  }
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">401 Unauthorized</p>
                  <p className="text-red-800 text-sm">Invalid credentials - email or password incorrect</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">404 Not Found</p>
                  <p className="text-red-800 text-sm">User with provided email not found</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Refresh Token Endpoint */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Refresh Access Token</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/auth/refresh
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-4 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <p className="text-slate-700 text-sm mb-2">Empty body required</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">401 Unauthorized</p>
                  <p className="text-red-800 text-sm">Token is expired or invalid</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">403 Forbidden</p>
                  <p className="text-red-800 text-sm">User is inactive</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Change Password Endpoint */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Change Password</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/auth/change-password
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-4 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "current_password": "OldPassword123",
  "new_password": "NewSecurePassword456",
  "confirm_password": "NewSecurePassword456"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "message": "Password changed successfully"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">401 Unauthorized</p>
                  <p className="text-red-800 text-sm">Current password is incorrect</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">400 Bad Request</p>
                  <p className="text-red-800 text-sm">Passwords do not match or invalid password format</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication Flow */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication Flow</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-cyan-500" />
                  1. User Registration
                </h3>
                <p className="text-slate-700 text-sm">User submits registration form with email, password, full name, and optional referral code</p>
              </div>

              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-cyan-500" />
                  1.5 Referral Code Validation (Optional)
                </h3>
                <p className="text-slate-700 text-sm mb-2">If referral code provided, server validates against AffiliateSubscription and Referral records</p>
                <p className="text-slate-600 text-xs bg-white px-3 py-2 rounded">Real-time validation: Frontend validates with 250ms debounce for instant feedback. Backend performs final validation at registration.</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                  2. Async Password Hashing & Account Creation
                </h3>
                <p className="text-slate-700 text-sm mb-2">Server hashes password asynchronously (non-blocking), creates user account, generates unique referral code, tracks referral relationship if code provided, returns JWT token</p>
                <p className="text-slate-600 text-xs bg-white px-3 py-2 rounded">Password hashing uses bcrypt via run_in_threadpool. Prevents event loop blocking during computation-intensive hashing.</p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-purple-500" />
                  3. User Data Stored with Referral Info
                </h3>
                <p className="text-slate-700 text-sm">User record includes: referral_code (auto-generated), referred_by (if code provided), l1/l2/l3_referrals counters, total_earnings, created_at timestamp</p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-purple-500" />
                  4. Login
                </h3>
                <p className="text-slate-700 text-sm">User submits email and password credentials to login endpoint. Password is verified against bcrypt hash.</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  5. Token Issued
                </h3>
                <p className="text-slate-700 text-sm">Server verifies credentials and returns new JWT token valid for 30 minutes</p>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-amber-500" />
                  6. Authenticated Requests
                </h3>
                <p className="text-slate-700 text-sm">Frontend stores token and includes it in Authorization header for all API requests</p>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-indigo-500" />
                  7. Token Refresh
                </h3>
                <p className="text-slate-700 text-sm">When token expires, use refresh endpoint to get new token without re-login</p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Practices</h2>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Do's
              </h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Store token securely (httpOnly cookies or secure localStorage)</li>
                <li>• Include token in Authorization header for all authenticated requests</li>
                <li>• Implement token refresh logic before expiration</li>
                <li>• Clear token on logout</li>
                <li>• Use HTTPS for all authentication requests</li>
                <li>• Validate token claims on frontend before critical operations</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Don'ts
              </h3>
              <ul className="text-red-800 text-sm space-y-1">
                <li>• Never expose token in URL parameters</li>
                <li>• Don't store sensitive credentials in localStorage without encryption</li>
                <li>• Never commit .env files with SECRET_KEY to version control</li>
                <li>• Avoid sending password in GET requests</li>
                <li>• Don't trust client-side token validation - always verify on server</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Next API Endpoints</h2>
          <p className="text-slate-700 mb-6">
            Continue exploring other API modules to understand complete platform functionality.
          </p>
          <div className="space-y-3">
            <a
              href="/docs/api/plans"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              View Plans API →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
