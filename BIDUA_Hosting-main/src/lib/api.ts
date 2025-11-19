// Prefer explicit 127.0.0.1 to avoid rare IPv6/mDNS localhost resolution issues
// Allow override via VITE_API_URL; if localhost fails we'll retry with 127.0.0.1 once.
const PRIMARY_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const FALLBACK_BASE = PRIMARY_BASE.includes('localhost')
  ? PRIMARY_BASE.replace('localhost', '127.0.0.1')
  : PRIMARY_BASE;

const API_BASE_URL = PRIMARY_BASE;

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('access_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('access_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const attempt = async (base: string): Promise<T> => {
      const url = `${base}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add existing headers
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers[key] = String(value);
      });
    }

    // Only add authorization for endpoints that need it (not login/register/validate-code)
    const isPublicEndpoint = endpoint === '/api/v1/auth/login' || 
                            endpoint === '/api/v1/auth/register' ||
                            endpoint.includes('/api/v1/affiliate/validate-code');
    
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // Don't log error for /auth/me checks - this is expected on app load
        if (!endpoint.includes('/auth/me')) {
          console.error('No authentication token found. Please log in.');
        }
        throw new Error('You are not logged in. Please log in to continue.');
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    // Debug logging for POST requests
    if (options.method === 'POST') {
      console.log('=== API POST REQUEST ===');
      console.log('URL:', url);
      console.log('Headers:', headers);
      console.log('Has Authorization:', !!headers['Authorization']);
      console.log('Body:', options.body);
    }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: response.statusText
        }));
        
        // Only log unexpected errors (not 401 or 404 which are normal for unauthenticated users)
        if (response.status !== 401 && response.status !== 404) {
          console.error('=== API REQUEST FAILED ===');
          console.error('Status:', response.status);
          console.error('URL:', url);
          console.error('Method:', options.method || 'GET');
          console.error('Error:', error);
        }
        
        // Special handling for 401 errors - but not for login/register endpoints
        if (response.status === 401) {
          // For login/register, return the actual error message
          if (isPublicEndpoint) {
            throw new Error(error.detail || 'Invalid credentials. Please check your email and password.');
          }
          // For protected endpoints, it's a session expiry
          throw new Error('Your session has expired. Please log in again.');
        }
        
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    };

    try {
      return await attempt(this.baseUrl);
    } catch (err) {
      // Network layer fetch failure → try localhost fallback substitution once
      if (err instanceof TypeError && (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) && FALLBACK_BASE !== this.baseUrl) {
        if (import.meta.env.DEV) {
          console.warn(`Primary base ${this.baseUrl} failed, retrying with fallback ${FALLBACK_BASE}`);
        }
        try {
          return await attempt(FALLBACK_BASE);
        } catch (fallbackErr) {
          if (fallbackErr instanceof TypeError && (fallbackErr.message === 'Failed to fetch' || fallbackErr.message.includes('NetworkError'))) {
            if (import.meta.env.DEV) {
              console.info('ℹ️ Backend connection failed on both primary and fallback hosts.');
            }
            throw new Error('BACKEND_OFFLINE: Unable to connect after fallback. Confirm backend on port 8000.');
          }
          throw fallbackErr;
        }
      }
      // Non-network or already retried error: propagate with enhanced context for 5xx
      if (err instanceof Error) {
        if (/HTTP error!/i.test(err.message)) {
          console.error('[API] HTTP failure:', err.message);
        } else if (!err.message.startsWith('BACKEND_OFFLINE')) {
          console.error('[API] Request error:', err.message);
        }
      }
      throw err;
    }
  }

  // Auth endpoints
  async signUp(email: string, password: string, username: string, fullName: string, referralCode?: string) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        referral_code: referralCode
      }),
    });
  }

  async signIn(email: string, password: string) {
    const response = await this.request<{ access_token: string; token_type: string }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    
    // Fetch user profile immediately after login
    const user = await this.getCurrentUser();
    
    return { ...response, user };
  }

  async signOut() {
    this.setToken(null);
    return { success: true };
  }

  async getCurrentUser() {
    try {
      return await this.request('/api/v1/auth/me', {
        method: 'GET',
      });
    } catch {
      // Return null if not authenticated instead of throwing
      return null;
    }
  }

  async refreshToken() {
    return this.request<{ access_token: string }>('/api/v1/auth/refresh', {
      method: 'POST',
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/api/v1/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  // User endpoints
  async getUsers(params?: { skip?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.skip) query.append('skip', params.skip.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    
    return this.request(`/api/v1/users?${query.toString()}`, {
      method: 'GET',
    });
  }

  async getUserProfile(userId: string) {
    return this.request(`/api/v1/users/${userId}`, {
      method: 'GET',
    });
  }

  async updateUserProfile(userId: string, data: unknown) {
    return this.request(`/api/v1/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/api/v1/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Plans endpoints
  async getPlans() {
    return this.request('/api/v1/plans', {
      method: 'GET',
    });
  }

  async getPlan(planId: string) {
    return this.request(`/api/v1/plans/${planId}`, {
      method: 'GET',
    });
  }

  async createPlan(data: unknown) {
    return this.request('/api/v1/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePlan(planId: string, data: unknown) {
    return this.request(`/api/v1/plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePlan(planId: string) {
    return this.request(`/api/v1/plans/${planId}`, {
      method: 'DELETE',
    });
  }

  // Servers endpoints
  async getServers(params?: { user_id?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.user_id) query.append('user_id', params.user_id);
    if (params?.status) query.append('status', params.status);
    
    return this.request(`/api/v1/servers?${query.toString()}`, {
      method: 'GET',
    });
  }

  async getServer(serverId: string) {
    return this.request(`/api/v1/servers/${serverId}`, {
      method: 'GET',
    });
  }

  async performServerAction(serverId: string | number, action: 'start' | 'stop' | 'restart' | 'terminate') {
    return this.request(`/api/v1/servers/${serverId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  async createServer(data: unknown) {
    return this.request('/api/v1/servers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServer(serverId: string, data: unknown) {
    return this.request(`/api/v1/servers/${serverId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteServer(serverId: string) {
    return this.request(`/api/v1/servers/${serverId}`, {
      method: 'DELETE',
    });
  }

  // Orders endpoints
  async getOrders(params?: { user_id?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.user_id) query.append('user_id', params.user_id);
    if (params?.status) query.append('status', params.status);
    
    return this.request(`/api/v1/orders?${query.toString()}`, {
      method: 'GET',
    });
  }

  async getOrder(orderId: string) {
    return this.request(`/api/v1/orders/${orderId}`, {
      method: 'GET',
    });
  }

  async createOrder(data: unknown) {
    return this.request('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Payments endpoints
  async createPayment(data: unknown) {
    return this.request('/api/v1/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyPayment(paymentId: string, data: unknown) {
    return this.request(`/api/v1/payments/${paymentId}/verify`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentHistory(userId: string) {
    return this.request(`/api/v1/payments/history/${userId}`, {
      method: 'GET',
    });
  }

  // Invoices endpoints
  async getInvoices(params?: { user_id?: string }) {
    const query = new URLSearchParams();
    if (params?.user_id) query.append('user_id', params.user_id);
    
    return this.request(`/api/v1/invoices?${query.toString()}`, {
      method: 'GET',
    });
  }

  async getInvoice(invoiceId: string) {
    return this.request(`/api/v1/invoices/${invoiceId}`, {
      method: 'GET',
    });
  }

  // Referrals endpoints
  async getReferralStats(userId: string) {
    return this.request(`/api/v1/referrals/stats/${userId}`, {
      method: 'GET',
    });
  }

  async getReferralEarnings(userId: string) {
    return this.request(`/api/v1/referrals/earnings/${userId}`, {
      method: 'GET',
    });
  }

  async getReferralCode(userId: string) {
    return this.request(`/api/v1/referrals/code/${userId}`, {
      method: 'GET',
    });
  }

  // Support tickets endpoints
  async getSupportTickets(params?: { user_id?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.user_id) query.append('user_id', params.user_id);
    if (params?.status) query.append('status', params.status);
    
      return this.request(`/api/v1/support/tickets?${query.toString()}`, {
      method: 'GET',
    });
  }

  async getSupportTicket(ticketId: string) {
      return this.request(`/api/v1/support/tickets/${ticketId}`, {
      method: 'GET',
    });
  }

  async createSupportTicket(data: unknown) {
      return this.request('/api/v1/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSupportTicket(ticketId: string, data: unknown) {
      return this.request(`/api/v1/support/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addTicketMessage(ticketId: string, message: string) {
    return this.request(`/api/v1/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ 
        message,
        is_internal_note: false 
      }),
    });
  }

  async updateTicketStatus(ticketId: string, status: string) {
    return this.request(`/api/v1/support/tickets/${ticketId}/status?new_status=${status}`, {
      method: 'PUT',
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/api/v1/admin/stats', {
      method: 'GET',
    });
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/api/v1/dashboard/stats', {
      method: 'GET',
    });
  }

  async getDashboardOverview() {
    return this.request('/api/v1/dashboard/overview', {
      method: 'GET',
    });
  }

  // Billing endpoints
  async getBillingSettings() {
    return this.request('/api/v1/billing/settings', {
      method: 'GET',
    });
  }

  async updateBillingSettings(data: unknown) {
    return this.request('/api/v1/billing/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getPaymentMethods() {
    return this.request('/api/v1/billing/payment-methods', {
      method: 'GET',
    });
  }

  async createPaymentMethod(data: unknown) {
    return this.request('/api/v1/billing/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deletePaymentMethod(methodId: string) {
    return this.request(`/api/v1/billing/payment-methods/${methodId}`, {
      method: 'DELETE',
    });
  }

  async setDefaultPaymentMethod(methodId: string) {
    return this.request(`/api/v1/billing/payment-methods/${methodId}/default`, {
      method: 'PUT',
    });
  }

  async getCurrentBalance() {
    return this.request('/api/v1/billing/current-balance', {
      method: 'GET',
    });
  }

  async toggleAutoRenewal() {
    return this.request('/api/v1/billing/auto-renewal/toggle', {
      method: 'POST',
    });
  }

  // Generic HTTP methods for affiliate and other endpoints
  async get<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  // Pricing quote (server plan + addons) computed on backend
  async getPricingQuote(data: unknown) {
    return this.request('/api/v1/pricing/quote', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async post<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;

// Types
export interface DashboardStats {
  // Aggregated counts
  active_servers: number; // number of active servers
  open_tickets: number;   // number of open support tickets

  // Financials
  monthly_cost: number;   // total monthly cost in INR

  // Usage
  bandwidth_used: number; // bandwidth used in TB (terabytes)
}
