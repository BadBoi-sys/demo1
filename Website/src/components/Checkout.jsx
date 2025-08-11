import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

const inputStyle = {
  padding: '0.75rem 0.9rem',
  borderRadius: '10px',
  border: '1px solid rgba(0,0,0,0.15)',
  background: 'var(--background)',
  color: 'var(--text)',
};

const labelStyle = {
  fontWeight: 600,
  color: 'var(--text)',
};

const errorStyle = {
  color: '#b00020',
  fontSize: '0.85rem',
};

function Checkout({ cart = [] }) {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingSuccess, setPendingSuccess] = useState(false);

  const [form, setForm] = useState({
    email: '',
    address: '',
    country: '',
    city: '',
    phone: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState({});

  // Ensure default app background (in case coming from pages that override it)
  useEffect(() => {
    document.body.style.backgroundImage = '';
    document.documentElement.style.removeProperty('--background');
  }, []);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email';
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.phone || form.phone.replace(/\D/g, '').length < 7) newErrors.phone = 'Please enter a valid phone number';
    if (!form.postalCode) newErrors.postalCode = 'Postal code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCurrency = (num) => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    return (n || 0).toFixed(2);
  };

  const buildEmailBody = () => {
    const lines = [];
    lines.push('New Cash on Delivery Order');
    lines.push('');
    lines.push('Customer details:');
    lines.push(`Email: ${form.email}`);
    lines.push(`Phone: ${form.phone}`);
    lines.push(`Address: ${form.address}`);
    lines.push(`City: ${form.city}`);
    lines.push(`Country: ${form.country}`);
    lines.push(`Postal Code: ${form.postalCode}`);
    lines.push('');
    lines.push('Items:');
    let grand = 0;
    cart.forEach((item, idx) => {
      const unit = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      const qty = item.quantity || 1;
      const line = (unit || 0) * qty;
      grand += line;
      lines.push(`${idx + 1}. ${item.name} | Qty: ${qty} | Unit: $${formatCurrency(unit)} | Total: $${formatCurrency(line)}`);
    });
    lines.push('');
    lines.push(`Grand Total: $${formatCurrency(grand)}`);
    lines.push('Payment Method: Cash on Delivery');
    return lines.join('\n');
  };

  const buildWhatsAppText = () => {
    const header = '*New Cash on Delivery Order*\n\n';
    const customer = `*Customer*\nEmail: ${form.email}\nPhone: ${form.phone}\nAddress: ${form.address}, ${form.city}, ${form.country}, ${form.postalCode}\n\n`;
    let itemsText = '*Items*\n';
    let grand = 0;
    cart.forEach((item, idx) => {
      const unit = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      const qty = item.quantity || 1;
      const line = (unit || 0) * qty;
      grand += line;
      itemsText += `${idx + 1}. ${item.name} | Qty: ${qty} | Unit: $${formatCurrency(unit)} | Total: $${formatCurrency(line)}\n`;
    });
    const total = `\n*Grand Total:* $${formatCurrency(grand)}\n*Payment:* Cash on Delivery`;
    const full = `${header}${customer}${itemsText}${total}`;
    // WhatsApp message practical limit ~4096 chars
    return full.length > 4000 ? full.slice(0, 3990) + '…' : full;
  };

  const openWhatsApp = (text) => {
    const rawNumber = '923331876698';
    const phoneParam = `+${rawNumber}`;
    const encodedText = encodeURIComponent(text);
    const isAndroid = /Android/i.test(navigator.userAgent);

    const schemeUrl = `whatsapp://send?phone=${encodeURIComponent(phoneParam)}&text=${encodedText}`;
    const intentUrl = `intent://send?text=${encodedText}&phone=${encodeURIComponent(phoneParam)}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
    const waMe = `https://wa.me/${rawNumber}?text=${encodedText}`;
    const apiUrl = `https://api.whatsapp.com/send?phone=${rawNumber}&text=${encodedText}`;

    const tryOpen = (url) => {
      const a = document.createElement('a');
      a.href = url;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 0);
    };

    try {
      if (isAndroid) {
        tryOpen(intentUrl);
      } else {
        tryOpen(schemeUrl);
      }
    } catch (e) {
      // ignore
    }

    setFallbackInfo((prev) => ({ ...(prev || {}), whatsapp: waMe, whatsappAlt: apiUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const waTextImmediate = buildWhatsAppText();
    // Open WhatsApp immediately on user gesture
    try { openWhatsApp(waTextImmediate); } catch {}
    setPendingSuccess(true);
    const recipient = 'rayyanfayyaz1122@icloud.com';
    const subject = 'New COD Order - Jems & Bloom by Annas';
    const body = buildEmailBody();

    // Try sending with EmailJS if environment variables are set; otherwise fall back to mailto
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      setIsSending(true);
      // Use async flow only for EmailJS to keep mailto path synchronous
      (async () => {
        try {
          const emailjs = (await import('@emailjs/browser')).default;
          await emailjs.send(
            serviceId,
            templateId,
            {
              to_email: recipient,
              from_email: form.email,
              reply_to: form.email,
              user_phone: form.phone,
              user_address: `${form.address}, ${form.city}, ${form.country}, ${form.postalCode}`,
              cart_summary: body,
              subject,
            },
            { publicKey }
          );
          // Wait to show success until user returns from WhatsApp
          // (pendingSuccess already set)
        } catch (err) {
          console.warn('EmailJS send failed, falling back to mailto:', err);
          // We already opened WhatsApp; just finish gracefully
        } finally {
          setIsSending(false);
        }
      })();
      return;
    }

    // If EmailJS not configured, we already triggered WhatsApp above
    // Wait to show success until user returns from WhatsApp
    setPendingSuccess(true);
  };

  // Show success overlay when user returns to the page after WhatsApp handoff
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && pendingSuccess && !showSuccess) {
        setShowSuccess(true);
        setTimeout(() => navigate('/'), 3000);
      }
    };
    const handleFocus = () => {
      if (pendingSuccess && !showSuccess) {
        setShowSuccess(true);
        setTimeout(() => navigate('/'), 3000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [pendingSuccess, showSuccess, navigate]);

  return (
    <div className="container fade-page" style={{ maxWidth: 820, margin: '0 auto', padding: '1rem', position: 'relative' }}>
      <h2 style={{ marginBottom: '1.25rem', color: 'var(--primary)', textAlign: 'left' }}>Checkout</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', background: 'var(--background)', padding: '1.25rem', borderRadius: 16, boxShadow: '0 2px 16px rgba(12,12,12,0.08)' }}>
          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} style={inputStyle} placeholder="you@example.com" />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </div>

          <div style={fieldStyle}>
            <label htmlFor="address" style={labelStyle}>Complete Address</label>
            <input id="address" type="text" value={form.address} onChange={(e) => setField('address', e.target.value)} style={inputStyle} placeholder="Street, area, house/building no." />
            {errors.address && <span style={errorStyle}>{errors.address}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div style={fieldStyle}>
              <label htmlFor="country" style={labelStyle}>Country</label>
              <input id="country" type="text" value={form.country} onChange={(e) => setField('country', e.target.value)} style={inputStyle} placeholder="Country" />
              {errors.country && <span style={errorStyle}>{errors.country}</span>}
            </div>
            <div style={fieldStyle}>
              <label htmlFor="city" style={labelStyle}>City</label>
              <input id="city" type="text" value={form.city} onChange={(e) => setField('city', e.target.value)} style={inputStyle} placeholder="City" />
              {errors.city && <span style={errorStyle}>{errors.city}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div style={fieldStyle}>
              <label htmlFor="phone" style={labelStyle}>Phone Number</label>
              <input id="phone" type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} style={inputStyle} placeholder="e.g. +1 555 123 4567" />
              {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
            </div>
            <div style={fieldStyle}>
              <label htmlFor="postalCode" style={labelStyle}>Postal Code</label>
              <input id="postalCode" type="text" value={form.postalCode} onChange={(e) => setField('postalCode', e.target.value)} style={inputStyle} placeholder="ZIP / Postal Code" />
              {errors.postalCode && <span style={errorStyle}>{errors.postalCode}</span>}
            </div>
          </div>

          <div style={{ background: 'var(--background)', border: '1px dashed rgba(0,0,0,0.15)', borderRadius: 16, padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="radio" id="cod" name="payment" checked readOnly />
              <label htmlFor="cod" style={{ ...labelStyle, margin: 0 }}>Cash on Delivery</label>
            </div>
            <p style={{ marginTop: '0.5rem', color: 'var(--text)', opacity: 0.9, fontSize: '0.95rem' }}>
              Pay with cash when your order arrives. No online payment needed.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" disabled={isSending} className="checkout-btn-anim" style={{ padding: '0.9rem 1.25rem', borderRadius: 10, fontWeight: 800, opacity: isSending ? 0.7 : 1, cursor: isSending ? 'not-allowed' : 'pointer' }}>{isSending ? 'Placing order…' : 'Place Order'}</button>
            <button type="button" onClick={() => navigate('/cart')} style={{ padding: '0.85rem 1.25rem', background: 'var(--primary)', color: 'var(--accent)', border: 'none', borderRadius: 10, fontWeight: 700 }}>Back to Cart</button>
          </div>


        </form>
      </div>
      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ background: 'var(--background)', color: 'var(--text)', padding: '1.25rem 1.5rem', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.25)', width: 320, textAlign: 'center', transform: 'scale(1)', animation: 'popIn .35s ease-out' }}>
            <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.15))' }}>
                <circle cx="36" cy="36" r="34" stroke="var(--accent)" strokeWidth="4" fill="none"/>
                <path d="M22 37.5L31 46L50 27" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Order placed!</div>
            <div style={{ opacity: 0.85, fontSize: '0.95rem' }}>We’re redirecting you…</div>
          </div>
          <style>{`@keyframes popIn{0%{transform:scale(.85);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
        </div>
      )}
    </div>
  );
}

export default Checkout;


