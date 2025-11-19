export interface BillingSettings {
  id?: number;
  user_id?: number;
  
  // Address fields
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  
  // Company information
  company_name?: string;
  tax_id?: string;
  
  // Contact information
  billing_email?: string;
  billing_phone?: string;
  
  // Notification settings
  email_notifications?: boolean;
  server_alerts?: boolean;
  billing_alerts?: boolean;
  maintenance_alerts?: boolean;
  marketing_emails?: boolean;
  
  // Auto-renewal settings
  auto_renewal?: boolean;
  
  // Delivery preferences
  invoice_delivery?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export interface BillingFormData {
  // Billing Address
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
  // Company Info
  companyName: string;
  taxId: string;
  
  // Contact
  billingEmail: string;
  billingPhone: string;
  
  // Preferences
  autoRenewal: boolean;
  billingAlerts: boolean;
  invoiceDelivery: string;
}

export interface PaymentMethod {
  id: number;
  user_id: number;
  type: string;
  brand?: string;
  last4?: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
  is_active: boolean;
  card_holder_name?: string;
  upi_id?: string;
  bank_name?: string;
  account_number?: string;
  created_at: string;
  updated_at?: string;
}