import { DocLayout } from '../../../components/docs/DocLayout';
import { User, Lock, Mail, Settings, Shield, LogOut } from 'lucide-react';

export function UserAccount() {
  return (
    <DocLayout
      title="Account Setup & Management"
      description="Guide to setting up and managing your BIDUA Hosting account"
      breadcrumbs={[
        { label: 'User Guides', path: '/docs/user' },
        { label: 'Account Setup' }
      ]}
      nextPage={{ title: 'How to Purchase', path: '/docs/user/purchase' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            Your BIDUA Hosting account is your gateway to manage hosting services, billing, and support. This guide covers account creation, profile setup, security settings, and account management.
          </p>
        </section>

        {/* Creating an Account */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Creating Your Account</h2>

          <ol className="space-y-4 my-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">1</span>
              <div>
                <p className="font-semibold text-slate-900">Visit the Sign-up Page</p>
                <p className="text-slate-600">Go to www.biduahosting.com and click "Sign Up"</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">2</span>
              <div>
                <p className="font-semibold text-slate-900">Enter Email Address</p>
                <p className="text-slate-600">Provide a valid email address you have access to</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">3</span>
              <div>
                <p className="font-semibold text-slate-900">Create Password</p>
                <p className="text-slate-600">Choose a strong password (min 8 characters, mix of letters, numbers, symbols)</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">4</span>
              <div>
                <p className="font-semibold text-slate-900">Verify Email</p>
                <p className="text-slate-600">Click the verification link sent to your email address</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">5</span>
              <div>
                <p className="font-semibold text-slate-900">Complete Profile</p>
                <p className="text-slate-600">Add your name, phone number, and billing address</p>
              </div>
            </li>
          </ol>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-slate-700"><strong>Important:</strong> Use a real, accessible email address. This will be used for account recovery and important notifications.</p>
          </div>
        </section>

        {/* Profile Management */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Your Profile</h2>

          <p className="text-slate-600 mb-6">
            Keep your profile information current and accurate:
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Accessing Profile Settings</h3>

          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Log into your account</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">Click your profile icon in the top right</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Select "Settings" from the dropdown menu</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span className="text-slate-600">Navigate to "Profile" section</span>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Fields</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {[
              { field: 'Full Name', required: true, description: 'Your legal name' },
              { field: 'Email Address', required: true, description: 'Primary contact email' },
              { field: 'Phone Number', required: true, description: 'Contact phone number' },
              { field: 'Company', required: false, description: 'Organization name (optional)' },
              { field: 'Address', required: true, description: 'Billing street address' },
              { field: 'City', required: true, description: 'City for billing' },
              { field: 'State/Province', required: false, description: 'State/province (if applicable)' },
              { field: 'Country', required: true, description: 'Country of residence' },
              { field: 'Postal Code', required: true, description: 'ZIP/postal code' },
              { field: 'Business Type', required: false, description: 'Individual, business, etc.' }
            ].map((item, index) => (
              <div key={index} className="border border-slate-200 rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-slate-900">{item.field}</p>
                  {item.required && <span className="text-red-500 text-xs font-bold">REQUIRED</span>}
                </div>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Password Security */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Password & Security</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Changing Your Password</h3>

          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Go to Settings → Security</p>
                <p className="text-slate-600">Navigate to the password section</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Enter Current Password</p>
                <p className="text-slate-600">Verify your existing password</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Enter New Password</p>
                <p className="text-slate-600">Create a new strong password</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Confirm & Save</p>
                <p className="text-slate-600">Click save to update your password</p>
              </div>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Password Requirements</h3>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Minimum 8 characters</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>At least one uppercase letter</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>At least one lowercase letter</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>At least one number</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>At least one special character (!@#$%^&*)</span>
              </li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Two-Factor Authentication (2FA)</h3>

          <p className="text-slate-600 mb-4">
            Secure your account with two-factor authentication:
          </p>

          <ol className="space-y-4">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Go to Settings → Security</p>
                <p className="text-slate-600">Find 2FA section</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Enable 2FA</p>
                <p className="text-slate-600">Click enable and choose your authentication method</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Scan QR Code</p>
                <p className="text-slate-600">Use authenticator app to scan the QR code</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Save Backup Codes</p>
                <p className="text-slate-600">Save recovery codes in a secure location</p>
              </div>
            </li>
          </ol>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
            <p className="text-slate-700"><strong>Recommended:</strong> Enable 2FA for enhanced security. You'll need to enter a code from your phone when logging in.</p>
          </div>
        </section>

        {/* Email Management */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Management</h2>

          <p className="text-slate-600 mb-6">
            Manage email addresses and communication preferences:
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Adding Additional Emails</h3>

          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Go to Settings → Email Addresses</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">Click "Add Email Address"</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">Enter the email and verify it</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span className="text-slate-600">Select as primary (optional)</span>
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>

          <div className="border border-slate-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-slate-900 mb-4">Email Notification Types:</h4>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-slate-900 text-sm">Account Notifications</p>
                <p className="text-slate-600 text-sm">Login attempts, password changes, account updates</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">Billing Notifications</p>
                <p className="text-slate-600 text-sm">Invoices, payment reminders, renewal notices</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">Service Notifications</p>
                <p className="text-slate-600 text-sm">Server updates, maintenance, status changes</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">Support Notifications</p>
                <p className="text-slate-600 text-sm">Ticket updates, responses, resolutions</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">Marketing Communications</p>
                <p className="text-slate-600 text-sm">Promotions, new features, newsletters</p>
              </div>
            </div>
          </div>

          <p className="text-slate-600 mb-4">
            Customize which notifications you receive by going to Settings → Notifications
          </p>
        </section>

        {/* Account Recovery */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Recovery</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Forgot Password</h3>

          <ol className="space-y-4 mb-6">
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
              <div>
                <p className="font-semibold text-slate-900">Click "Forgot Password"</p>
                <p className="text-slate-600">On the login page</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
              <div>
                <p className="font-semibold text-slate-900">Enter Your Email</p>
                <p className="text-slate-600">Provide the email associated with your account</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
              <div>
                <p className="font-semibold text-slate-900">Check Email</p>
                <p className="text-slate-600">Click reset link sent to your email</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
              <div>
                <p className="font-semibold text-slate-900">Create New Password</p>
                <p className="text-slate-600">Set a new secure password</p>
              </div>
            </li>
          </ol>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-slate-700"><strong>Note:</strong> Password reset links expire after 24 hours. Request a new one if needed.</p>
          </div>
        </section>

        {/* Account Settings */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: Lock,
                title: 'Password & Security',
                items: ['Change password', 'Enable 2FA', 'View login history', 'Manage sessions']
              },
              {
                icon: Mail,
                title: 'Email & Notifications',
                items: ['Manage email addresses', 'Set preferences', 'Manage subscriptions', 'Unsubscribe lists']
              },
              {
                icon: Settings,
                title: 'Preferences',
                items: ['Language', 'Timezone', 'Display settings', 'Theme (light/dark)']
              },
              {
                icon: Shield,
                title: 'Privacy & Data',
                items: ['Privacy settings', 'Data export', 'Account deletion', 'Cookie settings']
              }
            ].map((setting, index) => {
              const Icon = setting.icon;
              return (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <Icon className="h-5 w-5 text-cyan-500 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-3">{setting.title}</h3>
                  <ul className="space-y-2">
                    {setting.items.map((item, idx) => (
                      <li key={idx} className="text-slate-600 text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Keep your profile information up to date</li>
              <li>• Use a strong, unique password</li>
              <li>• Enable two-factor authentication for security</li>
              <li>• Regularly review your account activity</li>
              <li>• Update billing address if you move</li>
              <li>• Save recovery codes in a secure location</li>
              <li>• Never share your password or API keys</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
