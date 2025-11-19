
import React, { useState, useEffect } from 'react';

const PaymentTest = () => {
  const [authToken, setAuthToken] = useState('');
  const [paymentType, setPaymentType] = useState('subscription');
  const [planId, setPlanId] = useState('1');
  const [response, setResponse] = useState('Response will be shown here.');
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = window.location.origin;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!authToken) {
      alert('Please enter your auth token.');
      return;
    }

    setIsLoading(true);
    setResponse('Creating order...');

    let createOrderPayload = {
      payment_type: paymentType,
    };

    if (paymentType === 'server') {
      createOrderPayload.plan_id = parseInt(planId);
      createOrderPayload.billing_cycle = 'monthly';
    }

    try {
      // Step 1: Create Order
      const createOrderRes = await fetch(`${API_BASE}/api/v1/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(createOrderPayload)
      });

      const createOrderText = await createOrderRes.text();
      
      if (!createOrderText) {
        throw new Error('Empty response from server');
      }

      let orderData;
      try {
        orderData = JSON.parse(createOrderText);
      } catch {
        throw new Error('Invalid JSON response');
      }

      if (!createOrderRes.ok) {
        throw new Error(orderData.detail || 'Failed to create order');
      }

      setResponse(`Order created: ${JSON.stringify(orderData, null, 2)}`);

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderData.razorpay_key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'RAMAERA Hosting',
        description: orderData.description || 'Payment',
        order_id: orderData.razorpay_order_id,
        handler: async function (razorpayResponse) {
          setResponse(`✅ Payment Successful!\nOrder ID: ${razorpayResponse.razorpay_order_id}\nPayment ID: ${razorpayResponse.razorpay_payment_id}\n\nVerifying...`);
          
          try {
            const verifyRes = await fetch(`${API_BASE}/api/v1/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              }),
            });

            const verifyText = await verifyRes.text();
            
            if (!verifyText) {
              throw new Error('Empty verification response');
            }

            let verifyData;
            try {
              verifyData = JSON.parse(verifyText);
            } catch {
              throw new Error('Invalid JSON from verify-payment');
            }

            if (!verifyRes.ok) {
              throw new Error(verifyData.detail || 'Verification failed');
            }

            setResponse(`✅ Payment Verified!\n${JSON.stringify(verifyData, null, 2)}`);
          } catch (verifyError) {
            setResponse(`❌ Verification Error: ${verifyError.message}`);
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test.user@example.com',
          contact: '9999999999',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (failResponse) {
        setResponse(`❌ Payment Failed:\n${JSON.stringify(failResponse.error, null, 2)}`);
      });
      
      rzp.open();

    } catch (err) {
      console.error(err);
      setResponse(`❌ Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', color: '#3399cc' }}>
          Razorpay Payment Test (React)
        </h1>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Auth Token:
          </label>
          <input
            type="text"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="Enter your JWT token"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Payment Type:
          </label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="subscription">Subscription (₹499/month)</option>
            <option value="server">Server Purchase</option>
          </select>
        </div>

        {paymentType === 'server' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Plan ID:
            </label>
            <input
              type="number"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              placeholder="Enter plan ID"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#3399cc',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background 0.3s',
          }}
          onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#287a99')}
          onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#3399cc')}
        >
          {isLoading ? 'Processing...' : '💳 Pay Now'}
        </button>

        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            borderRadius: '5px',
            minHeight: '100px',
          }}
        >
          {response}
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;
