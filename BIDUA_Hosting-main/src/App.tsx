import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TawkToWidget } from './components/TawkToWidget';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BackendStatusBanner } from './components/BackendStatusBanner';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { Home } from './pages/Home';
import { Pricing } from './pages/Pricing';
import { DedicatedServers } from './pages/DedicatedServers';
import { Solutions } from './pages/Solutions';
import { Contact } from './pages/Contact';
import { Calculator } from './pages/Calculator';
import { Checkout } from './pages/Checkout';
import { InvoiceView } from './pages/InvoiceView';
import { InvoicePayment } from './pages/InvoicePayment';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { ServiceLevelAgreement } from './pages/ServiceLevelAgreement';

import { Overview } from './pages/dashboard/Overview';
import { MyServers } from './pages/dashboard/MyServers';
import { ServerManagement as UserServerManagement } from './pages/dashboard/ServerManagement';
import { ReferralsEnhanced as Referrals } from './pages/dashboard/ReferralsEnhanced';
import { Billing } from './pages/dashboard/Billing';
import { SupportEnhanced as Support } from './pages/dashboard/SupportEnhanced';
import { Settings } from './pages/dashboard/Settings';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ReferralManagement } from './pages/admin/ReferralManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { ServerManagement as AdminServerManagement } from './pages/admin/ServerManagement';
import { PlansManagement } from './pages/admin/PlansManagement';
import { OrdersManagement } from './pages/admin/OrdersManagement';
import { SupportManagementEnhanced as SupportManagement } from './pages/admin/SupportManagementEnhanced';
import { EmployeeManagement } from './pages/admin/EmployeeManagement';
import SplashCursor from './components/SplashCurser';
import { DocsLayout } from './components/docs/DocsLayout';

// Documentation imports
import { Documentation } from './pages/docs/Documentation';
import { Introduction } from './pages/docs/Introduction';
import { QuickStart } from './pages/docs/QuickStart';
import { Installation } from './pages/docs/Installation';
import { Architecture } from './pages/docs/Architecture';
import { Backend } from './pages/docs/Backend';
import { Frontend } from './pages/docs/Frontend';
import { Database } from './pages/docs/Database';
import { AuthAPI } from './pages/docs/api/AuthAPI';
import { PlansAPI } from './pages/docs/api/PlansAPI';
import { OrdersAPI } from './pages/docs/api/OrdersAPI';
import { PaymentsAPI } from './pages/docs/api/PaymentsAPI';
import { ServersAPI } from './pages/docs/api/ServersAPI';
import { SupportAPI } from './pages/docs/api/SupportAPI';
import { ReferralsAPI } from './pages/docs/api/ReferralsAPI';
import { HostingFeature } from './pages/docs/features/HostingFeature';
import { AddonsFeature } from './pages/docs/features/AddonsFeature';
import { BillingFeature } from './pages/docs/features/BillingFeature';
import { PaymentsFeature } from './pages/docs/features/PaymentsFeature';
import { SupportFeature } from './pages/docs/features/SupportFeature';
import { ReferralsFeature } from './pages/docs/features/ReferralsFeature';
import { ReferralsRegistration } from './pages/docs/features/ReferralsRegistration';
import { ReferralsCommission } from './pages/docs/features/ReferralsCommission';
import { ReferralsPayouts } from './pages/docs/features/ReferralsPayouts';
import { UserAccount } from './pages/docs/user/UserAccount';
import { UserPurchase } from './pages/docs/user/UserPurchase';
import { UserServers } from './pages/docs/user/UserServers';
import { UserBilling } from './pages/docs/user/UserBilling';
import { UserSupport } from './pages/docs/user/UserSupport';
import { UserReferrals } from './pages/docs/user/UserReferrals';
import { AdminDashboard as AdminDashboardDoc } from './pages/docs/admin/AdminDashboard';
import { AdminUsers } from './pages/docs/admin/AdminUsers';
import { AdminPlans } from './pages/docs/admin/AdminPlans';
import { AdminOrders } from './pages/docs/admin/AdminOrders';
import { AdminSupport } from './pages/docs/admin/AdminSupport';
import { DeployEnvironment } from './pages/docs/deploy/DeployEnvironment';
import { DeployBackend } from './pages/docs/deploy/DeployBackend';
import { DeployFrontend } from './pages/docs/deploy/DeployFrontend';
import { DeployDatabase } from './pages/docs/deploy/DeployDatabase';
import { ConfigEnv } from './pages/docs/config/ConfigEnv';
import { ConfigPayment } from './pages/docs/config/ConfigPayment';
import { ConfigEmail } from './pages/docs/config/ConfigEmail';
import { Troubleshooting } from './pages/docs/Troubleshooting';

function App() {
  return (
    <ErrorBoundary>
      <SplashCursor/>
      <BackendStatusBanner />
      <BrowserRouter>
        <AuthProvider>
          <TawkToWidget hideOnRoutes={['/login', '/signup']} />
          <PWAInstallPrompt />
          <Routes>
          {/* Invoice route without layout */}
          <Route path="/invoice/:invoiceId" element={<InvoiceView />} />
          
          {/* Invoice Payment route without layout */}
          <Route path="/pay-invoice/:invoiceId" element={<InvoicePayment />} />
          
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dedicated-servers" element={<DedicatedServers />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/sla" element={<ServiceLevelAgreement />} />

            {/* Documentation Routes */}
            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<Documentation />} />
              <Route path="introduction" element={<Introduction />} />
              <Route path="quick-start" element={<QuickStart />} />
              <Route path="installation" element={<Installation />} />
              <Route path="troubleshooting" element={<Troubleshooting />} />
              <Route path="architecture" element={<Architecture />} />
              <Route path="backend" element={<Backend />} />
              <Route path="frontend" element={<Frontend />} />
              <Route path="database" element={<Database />} />

              {/* API Documentation */}
              <Route path="api/auth" element={<AuthAPI />} />
              <Route path="api/plans" element={<PlansAPI />} />
              <Route path="api/orders" element={<OrdersAPI />} />
              <Route path="api/payments" element={<PaymentsAPI />} />
              <Route path="api/servers" element={<ServersAPI />} />
              <Route path="api/support" element={<SupportAPI />} />
              <Route path="api/referrals" element={<ReferralsAPI />} />

              {/* Features Documentation */}
              <Route path="features/hosting" element={<HostingFeature />} />
              <Route path="features/addons" element={<AddonsFeature />} />
              <Route path="features/billing" element={<BillingFeature />} />
              <Route path="features/payments" element={<PaymentsFeature />} />
              <Route path="features/support" element={<SupportFeature />} />
              <Route path="features/referrals" element={<ReferralsFeature />} />
              <Route path="features/referrals-registration" element={<ReferralsRegistration />} />
              <Route path="features/referrals-commission" element={<ReferralsCommission />} />
              <Route path="features/referrals-payouts" element={<ReferralsPayouts />} />

              {/* User Guides */}
              <Route path="user/account" element={<UserAccount />} />
              <Route path="user/purchase" element={<UserPurchase />} />
              <Route path="user/servers" element={<UserServers />} />
              <Route path="user/billing" element={<UserBilling />} />
              <Route path="user/support" element={<UserSupport />} />
              <Route path="user/referrals" element={<UserReferrals />} />

              {/* Admin Guides */}
              <Route path="admin/dashboard" element={<AdminDashboardDoc />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/plans" element={<AdminPlans />} />
              <Route path="admin/orders" element={<AdminOrders />} />
              <Route path="admin/support" element={<AdminSupport />} />

              {/* Deployment Guides */}
              <Route path="deploy/environment" element={<DeployEnvironment />} />
              <Route path="deploy/backend" element={<DeployBackend />} />
              <Route path="deploy/frontend" element={<DeployFrontend />} />
              <Route path="deploy/database" element={<DeployDatabase />} />

              {/* Configuration */}
              <Route path="config/env" element={<ConfigEnv />} />
              <Route path="config/payment" element={<ConfigPayment />} />
              <Route path="config/email" element={<ConfigEmail />} />
            </Route>
          </Route>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="servers" element={<MyServers />} />
            <Route path="servers/:serverId" element={<UserServerManagement />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="billing" element={<Billing />} />
            <Route path="support" element={<Support />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="servers" element={<AdminServerManagement />} />
            <Route path="plans" element={<PlansManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="referrals" element={<ReferralManagement />} />
            <Route path="support" element={<SupportManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
