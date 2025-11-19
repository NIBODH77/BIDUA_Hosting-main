import { DocLayout } from '../../../components/docs/DocLayout';
import { CheckCircle2, AlertCircle, Zap, Code } from 'lucide-react';

export function ReferralsRegistration() {
  return (
    <DocLayout
      title="Referral Registration & Signup"
      description="Learn how to register with referral codes and start tracking commissions"
      breadcrumbs={[
        { label: 'Features', path: '/docs/features' },
        { label: 'Referral Program', path: '/docs/features/referrals' },
        { label: 'Registration' }
      ]}
      prevPage={{ title: 'Referral Program', path: '/docs/features/referrals' }}
      nextPage={{ title: 'Commission Structure', path: '/docs/features/referrals-commission' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Registration with Referral Support</h2>
          <p className="text-slate-700 mb-4">
            The registration system supports two signup flows: basic registration and referral-based registration. When users sign up with a referral code, they are automatically linked to the referrer's network.
          </p>
        </section>

        {/* Simple Registration */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Simple Registration (No Referral)</h2>
          
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Request</h3>
            <div className="bg-slate-50 rounded p-4 overflow-x-auto">
              <pre className="text-slate-700 font-mono text-sm">{`POST /api/v1/auth/register

{
  "email": "newuser@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe"
}`}</pre>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-3">What Happens</h3>
            <ol className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-semibold text-sm">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Password Hashed Asynchronously</p>
                  <p className="text-slate-600 text-sm">Password is hashed using bcrypt via run_in_threadpool (non-blocking)</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-semibold text-sm">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Account Created</p>
                  <p className="text-slate-600 text-sm">User record stored with email, full_name, hashed password, role: 'customer'</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-semibold text-sm">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Referral Code Generated</p>
                  <p className="text-slate-600 text-sm">Unique referral code created (e.g., NFFK3NVU) and stored in user profile</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-semibold text-sm">4</span>
                <div>
                  <p className="font-semibold text-slate-900">JWT Token Issued</p>
                  <p className="text-slate-600 text-sm">Access token returned (valid 30 minutes). User is now logged in.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800"><CheckCircle2 className="h-5 w-5 inline mr-2 text-green-600" /> User can now share their referral code with others</p>
          </div>
        </section>

        {/* Referral Registration */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Registration with Referral Code</h2>
          
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Request</h3>
            <div className="bg-slate-50 rounded p-4 overflow-x-auto">
              <pre className="text-slate-700 font-mono text-sm">{`POST /api/v1/auth/register

{
  "email": "referred@example.com",
  "password": "SecurePassword123",
  "full_name": "Jane Smith",
  "referral_code": "NFFK3NVU"  // <- Referrer's code
}`}</pre>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-3">What Happens</h3>
            <ol className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Referral Code Validated</p>
                  <p className="text-slate-600 text-sm">Server checks if code exists in AffiliateSubscription and Referral tables. Returns 400 error if invalid.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Network Level Determined</p>
                  <p className="text-slate-600 text-sm">System calculates referral network depth (L1 = direct, L2 = indirect, L3 = third-level)</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Password Hashed</p>
                  <p className="text-slate-600 text-sm">Password hashed asynchronously using bcrypt (non-blocking)</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">4</span>
                <div>
                  <p className="font-semibold text-slate-900">Account Created with Referral Link</p>
                  <p className="text-slate-600 text-sm">User record created with referred_by set to referrer's ID. Automatic referral tracking established.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">5</span>
                <div>
                  <p className="font-semibold text-slate-900">Referrer Counters Updated</p>
                  <p className="text-slate-600 text-sm">Referrer's l1_referrals, l2_referrals, or l3_referrals counter incremented based on network level</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">6</span>
                <div>
                  <p className="font-semibold text-slate-900">JWT Token Issued</p>
                  <p className="text-slate-600 text-sm">Access token returned. New user is logged in and ready to purchase.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800"><CheckCircle2 className="h-5 w-5 inline mr-2 text-blue-600" /> Referrer's commission counter incremented, commission will be earned when new user makes first purchase</p>
          </div>
        </section>

        {/* Real-time Validation */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Real-Time Referral Code Validation</h2>
          
          <p className="text-slate-700 mb-6">
            The frontend provides instant validation of referral codes as users type, improving user experience with immediate feedback.
          </p>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Frontend Validation Endpoint</h3>
            <div className="bg-slate-50 rounded p-4 overflow-x-auto mb-4">
              <pre className="text-slate-700 font-mono text-sm">{`GET /api/v1/affiliate/validate-code?code=NFFK3NVU`}</pre>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-3">Response Examples</h3>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="font-semibold text-green-900 mb-2">Valid Code</p>
                <pre className="text-slate-700 font-mono text-sm">{`{
  "valid": true,
  "referrer_name": "John Doe",
  "referrer_email": "john@example.com",
  "commission_rate": 15
}`}</pre>
              </div>

              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="font-semibold text-red-900 mb-2">Invalid Code</p>
                <pre className="text-slate-700 font-mono text-sm">{`{
  "valid": false,
  "error": "Referral code not found or invalid"
}`}</pre>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <p className="text-amber-800 mb-2"><Zap className="h-5 w-5 inline mr-2" /> <strong>250ms Debounce</strong></p>
              <p className="text-amber-700 text-sm">Frontend debounces validation requests by 250ms to reduce API calls while typing</p>
            </div>
          </div>
        </section>

        {/* Referral Code Format */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Referral Code Format & Generation</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Code Format</h3>
              <div className="space-y-3 text-slate-600">
                <p><strong>Pattern:</strong> Alphanumeric string</p>
                <p><strong>Length:</strong> 8 characters</p>
                <p><strong>Example:</strong> NFFK3NVU</p>
                <p><strong>Uniqueness:</strong> One code per user (never changes)</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Generation Method</h3>
              <div className="space-y-3 text-slate-600">
                <p><strong>Timing:</strong> On user registration (signup)</p>
                <p><strong>Algorithm:</strong> Random alphanumeric generation</p>
                <p><strong>Validation:</strong> Uniqueness checked before storage</p>
                <p><strong>Expiration:</strong> Never expires (lifetime valid)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Guide */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Developer Integration Guide</h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                <Code className="h-5 w-5 mr-2 text-cyan-500" />
                Frontend Implementation
              </h3>
              
              <p className="text-slate-600 text-sm mb-4">Include optional referral_code field in registration form:</p>

              <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-x-auto text-xs font-mono mb-4">{`// Signup form submission
const handleRegister = async (formData) => {
  const payload = {
    email: formData.email,
    password: formData.password,
    full_name: formData.fullName,
    referral_code: formData.referralCode || undefined  // Optional
  };

  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  // Store token, redirect to dashboard
};`}</pre>

              <p className="text-slate-600 text-sm">Always validate referral code on frontend for instant UX feedback, but don't trust it - backend validates again at registration.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3">URL Parameter Support</h3>
              
              <p className="text-slate-600 text-sm mb-4">Support referral code via URL parameter for sharing:</p>

              <div className="bg-slate-50 rounded p-3 font-mono text-sm text-slate-700 mb-4">
                <p>https://yourapp.com/signup?ref=NFFK3NVU</p>
              </div>

              <p className="text-slate-600 text-sm">Auto-populate referral_code field when ?ref= parameter is present in signup URL</p>
            </div>
          </div>
        </section>

        {/* Response Structure */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Registration Response Structure</h2>
          
          <div className="bg-slate-50 rounded-lg p-6 overflow-x-auto">
            <pre className="text-slate-700 font-mono text-sm">{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "full_name": "Jane Smith",
    "role": "customer",
    "account_status": "active",
    "referral_code": "USR_xyz789",
    "referred_by": 456,              // ID of referrer (if code used)
    "total_referrals": 0,            // Will increase when they refer others
    "l1_referrals": 0,               // Direct referrals
    "l2_referrals": 0,               // Indirect referrals
    "l3_referrals": 0,               // Third-level referrals
    "total_earnings": "0.00",        // Cumulative earnings
    "created_at": "2025-11-16T14:03:44.965087Z"
  }
}`}</pre>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Practices</h2>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Do's
              </h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Validate referral codes on frontend for instant feedback</li>
                <li>• Show referrer information when code is valid</li>
                <li>• Allow optional referral code (don't require it)</li>
                <li>• Support ?ref= URL parameter for easy sharing</li>
                <li>• Validate again on backend (never trust frontend)</li>
                <li>• Store referral_code in user profile immediately</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Don'ts
              </h3>
              <ul className="text-red-800 text-sm space-y-1">
                <li>• Don't require referral code for signup</li>
                <li>• Don't skip backend validation</li>
                <li>• Don't allow self-referrals (check in backend)</li>
                <li>• Don't expose sensitive referrer information</li>
                <li>• Don't proceed with registration if code validation fails</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
