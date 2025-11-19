# Razorpay Checkout Implementation Guide

## Step 1: Update Checkout.tsx - Add Razorpay Integration

### Location: `BIDUA_Hosting-main/src/pages/Checkout.tsx`

### A. Add new state variables (after existing useState declarations around line 240):

```typescript
const [orderDetails, setOrderDetails] = useState<any>(null);
const [razorpayLoaded, setRazorpayLoaded] = useState(false);
```

### B. Add Razorpay script loader (add this useEffect after existing useEffects):

```typescript
// Load Razorpay script
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => setRazorpayLoaded(true);
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);
```

### C. Replace `handleCompleteOrder` function (lines 495-514):

**FIND THIS:**
```typescript
const handleCompleteOrder = async () => {
  if (!serverConfig || !agreeToTerms) return;

  setProcessing(true);
  try {
    // TODO: Integrate with backend orders API
    console.log('Creating order:', { serverConfig, billingInfo });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Move to confirmation step
    setCurrentStep(3);
  } catch (error) {
    console.error('Order creation failed:', error);
    alert('Failed to create order. Please try again.');
  } finally {
    setProcessing(false);
  }
};
```

**REPLACE WITH:**
```typescript
const handleCompleteOrder = async () => {
  if (!serverConfig || !agreeToTerms) return;

  setProcessing(true);

  try {
    // Step 1: Create Payment Order
    console.log('🔄 Creating payment order...', {
      plan_id: serverConfig.planId,
      billing_cycle: serverConfig.billingCycle
    });

    const paymentOrderResponse = await api.post('/api/v1/payments/create-order', {
      payment_type: 'server',
      plan_id: serverConfig.planId,
      billing_cycle: serverConfig.billingCycle === 'monthly' ? 'monthly' :
                     serverConfig.billingCycle === 'quarterly' ? 'quarterly' :
                     serverConfig.billingCycle === 'semiannually' ? 'semi_annual' :
                     serverConfig.billingCycle === 'annually' ? 'annual' :
                     serverConfig.billingCycle === 'biennially' ? 'biennial' :
                     serverConfig.billingCycle === 'triennially' ? 'triennial' : 'monthly',
      server_config: {
        server_name: hostname || `${serverConfig.planName} Server`,
        hostname: hostname || `server-${Date.now()}.bidua.com`,
        os: operatingSystem || 'Ubuntu 22.04 LTS',
        datacenter: datacenter || 'noida-india',
        managed_service: managedService,
        ddos_protection: ddosProtection,
        additional_ipv4: additionalIPv4,
        backup_service: backupService,
        plesk_addon: pleskAddon,
        backup_storage: backupStorage,
        ssl_certificate: sslCertificate,
        quantity: serverQuantity
      }
    });

    if (!paymentOrderResponse.success) {
      throw new Error('Failed to create payment order');
    }

    console.log('✅ Payment order created:', paymentOrderResponse);
    const { payment, plan } = paymentOrderResponse;

    // Step 2: Handle Payment Method
    if (paymentMethod === 'razorpay') {
      // Wait for Razorpay to load
      if (!razorpayLoaded) {
        alert('Payment system is loading. Please try again in a moment.');
        setProcessing(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: payment.total_amount * 100, // Amount in paise
        currency: payment.currency || 'INR',
        name: 'BIDUA Hosting',
        description: `${serverConfig.planName} - ${serverConfig.billingCycle}`,
        order_id: payment.razorpay_order_id,
        handler: async (response: any) => {
          try {
            console.log('🔄 Verifying payment...', response);

            // Step 3: Verify Payment
            const verificationResponse = await api.post('/api/v1/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            console.log('✅ Payment verified:', verificationResponse);

            if (verificationResponse.success) {
              // Payment successful
              setOrderDetails({
                ...verificationResponse.order,
                payment: verificationResponse.payment,
                server: verificationResponse.server,
                affiliate: verificationResponse.affiliate
              });

              // Show success message
              if (verificationResponse.server?.created) {
                console.log('🎉 Server created:', verificationResponse.server.hostname);
              }
              if (verificationResponse.affiliate?.activated) {
                console.log('🎉 Affiliate activated!');
              }

              // Move to confirmation step
              setCurrentStep(3);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            console.error('❌ Payment verification error:', error);
            alert(`Payment verification failed: ${error.message}. Please contact support with your payment ID: ${response.razorpay_payment_id}`);
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: billingInfo.fullName,
          email: billingInfo.email,
          contact: billingInfo.phone
        },
        notes: {
          billing_cycle: serverConfig.billingCycle,
          plan_name: serverConfig.planName,
          plan_type: serverConfig.planType
        },
        theme: {
          color: '#06b6d4' // Cyan color
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            setProcessing(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on('payment.failed', (response: any) => {
        console.error('❌ Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });

      razorpay.open();

    } else if (paymentMethod === 'bank_transfer') {
      // For bank transfer, just show the proforma invoice
      setOrderDetails({
        order_number: payment.razorpay_order_id,
        amount: payment.total_amount,
        status: 'pending'
      });
      setCurrentStep(3);
      setProcessing(false);
    }

  } catch (error: any) {
    console.error('❌ Order creation failed:', error);
    alert(error.message || 'Failed to create order. Please try again.');
    setProcessing(false);
  }
};
```

### D. Update ServerConfig interface (around line 13):

**ADD `planId` to the interface:**
```typescript
interface ServerConfig {
  planId?: number; // 🆕 Add this line
  planName: string;
  planType: string;
  vcpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  billingCycle: string;
  monthlyPrice: number;
  totalPrice: number;
  discount: number;
  // ... rest of fields
}
```

---

## Step 2: Update .env with Real Razorpay Key

### File: `BIDUA_Hosting-main/.env`

**Current:**
```env
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
```

**Update with your actual Razorpay test key:**
```env
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
```

**Get your key from:** https://dashboard.razorpay.com/app/keys

---

## Step 3: Test the Integration

### Test Flow:
1. Go to `/pricing`
2. Select a plan
3. Click "Deploy Now"
4. Fill checkout form
5. Click "Complete Order"
6. Razorpay popup should appear
7. Use test card: `4111 1111 1111 1111`, CVV: `123`, Expiry: Any future date
8. Complete payment
9. Should see confirmation page
10. Check `/dashboard/servers` - server should be created
11. Check `/dashboard/referrals` - affiliate should be activated

---

## Step 4: Billing Page - Add Pay Now Button

### File: `BIDUA_Hosting-main/src/pages/dashboard/Billing.tsx`

### A. Add handlePayNow function (before the return statement, around line 84):

```typescript
const handlePayNow = async (invoice: Invoice) => {
  try {
    setLoading(true);

    // Get full invoice details
    const invoiceDetails = await api.get(`/api/v1/invoices/${invoice.id}`);

    // Initiate payment using the same Razorpay flow
    // Load Razorpay script if not already loaded
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = async () => {
      try {
        // Create payment order for this invoice
        const paymentOrderResponse = await api.post('/api/v1/payments/create-order', {
          payment_type: 'server',
          plan_id: invoiceDetails.plan_id,
          billing_cycle: 'one_time',
          invoice_id: invoice.id
        });

        if (!paymentOrderResponse.success) {
          throw new Error('Failed to create payment order');
        }

        const { payment } = paymentOrderResponse;

        // Initialize Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: payment.total_amount * 100,
          currency: payment.currency || 'INR',
          name: 'BIDUA Hosting',
          description: `Invoice #${invoice.id}`,
          order_id: payment.razorpay_order_id,
          handler: async (response: any) => {
            try {
              const verificationResponse = await api.post('/api/v1/payments/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verificationResponse.success) {
                alert('Payment successful!');
                loadBillingData(); // Reload invoices
              }
            } catch (error: any) {
              alert(`Payment verification failed: ${error.message}`);
            }
          },
          theme: {
            color: '#06b6d4'
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } catch (error: any) {
        alert(error.message || 'Failed to initiate payment');
      } finally {
        setLoading(false);
      }
    };

    document.body.appendChild(script);
  } catch (error: any) {
    console.error('Failed to initiate payment:', error);
    alert('Failed to initiate payment. Please try again.');
    setLoading(false);
  }
};
```

### B. Update the actions column in the invoices table (around line 180):

**FIND:**
```tsx
<td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
  <div className="flex items-center justify-center">
    <button className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition">
      <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      <span className="hidden sm:inline">Download</span>
    </button>
  </div>
</td>
```

**REPLACE WITH:**
```tsx
<td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
  <div className="flex items-center justify-center gap-2">
    {(invoice.status === 'pending' || invoice.status === 'unpaid') && (
      <button
        onClick={() => handlePayNow(invoice)}
        disabled={loading}
        className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition disabled:opacity-50"
      >
        <CreditCard className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span>Pay Now</span>
      </button>
    )}
    <button className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition">
      <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      <span className="hidden sm:inline">Download</span>
    </button>
  </div>
</td>
```

---

## Step 5: Settings Page - Auto-fill Profile & Email Non-Editable

### File: `BIDUA_Hosting-main/src/pages/dashboard/Settings.tsx`

**Note:** I'll need to see this file to provide exact code. The changes needed:

1. **Auto-fill from user profile:**
   - Fetch user profile on component mount
   - Pre-fill: fullName, email, phone from signup data

2. **Make email non-editable:**
   - Add `disabled` attribute to email input
   - Add visual styling to show it's disabled

3. **Two-way billing sync:**
   - On checkout: Save billing address to user profile
   - On settings page load: Pre-fill billing from user profile
   - When user updates billing in settings: Update for future checkouts

---

## Razorpay Test Cards

### Test Credit Card (Success):
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
Name: Any name
```

### Test UPI:
```
UPI ID: success@razorpay
```

### Test Net Banking:
```
Select any bank
Use credentials provided on test page
```

---

## Common Issues & Solutions

### Issue 1: "Razorpay is not defined"
**Solution:** Ensure Razorpay script is loaded before opening checkout
```typescript
if (!(window as any).Razorpay) {
  alert('Payment system is loading. Please try again.');
  return;
}
```

### Issue 2: Payment succeeds but verification fails
**Solution:** Check backend logs for signature verification errors. Ensure `RAZORPAY_KEY_SECRET` is correctly set in backend `.env`

### Issue 3: Server not created after payment
**Solution:** Check backend logs. The code should show:
```
✅ Server {id} created for user {user_id}
```

### Issue 4: 404 on payment endpoints
**Solution:** Ensure backend is running on port 8000:
```bash
cd backend_template
python -m uvicorn app.main:app --reload --port 8000
```

---

## Backend Requirements

Ensure backend has:
```env
# backend_template/.env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
```

---

## Implementation Checklist

- [x] ✅ Add `planId` to Pricing page serverConfig
- [ ] ⚠️ Replace `handleCompleteOrder` in Checkout.tsx
- [ ] ⚠️ Add Razorpay script loader to Checkout.tsx
- [ ] ⚠️ Update `.env` with real Razorpay key
- [ ] ⚠️ Add `handlePayNow` to Billing page
- [ ] ⚠️ Update Billing page invoice actions column
- [ ] ⚠️ Test complete checkout flow
- [ ] ⚠️ Verify server created after payment
- [ ] ⚠️ Verify affiliate activated after payment

---

**Estimated Time:** 1-2 hours to implement and test
**Priority:** CRITICAL - Users cannot buy servers without this
