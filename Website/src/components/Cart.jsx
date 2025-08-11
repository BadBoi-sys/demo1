import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart, removeFromCart, updateCartQuantity }) => {
  const navigate = useNavigate();

  const getItemTotal = (item) => {
    const unitPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    const quantity = item.quantity || 1;
    return (unitPrice || 0) * quantity;
  };

  const total = cart.reduce((sum, item) => sum + getItemTotal(item), 0);

  const handleQuantityChange = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (item) {
      updateCartQuantity(id, Math.max(1, (item.quantity || 1) + delta));
    }
  };

  return (
    <div className="container fade-page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h2 className="cart-heading" style={{ marginBottom: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--primary)', textAlign: 'left' }}>Your Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart" style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--background)', borderRadius: '16px', boxShadow: '0 2px 16px rgba(12,12,12,0.08), 0 1.5px 4px rgba(212,175,55,0.08)', marginTop: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛍️</div>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Your cart is empty</h3>
          <p style={{ fontSize: '1.05rem', color: 'var(--text)', marginBottom: '1.5rem' }}>Discover hand-picked pieces crafted to shine. Add your favorites to begin.</p>
          <button onClick={() => navigate('/products')} className="checkout-btn-anim" style={{ padding: '0.9rem 2rem', background: 'var(--accent)', color: 'var(--primary)', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Browse Products</button>
        </div>
      ) : (
        <div className="cart-page-wrap" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="cart-page" style={{ display: 'grid', gap: '2rem' }}>
          <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map(item => (
              <div key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.25rem', background: 'var(--background)', borderRadius: '16px', boxShadow: '0 2px 16px rgba(12,12,12,0.08)' }}>
                <div className="cart-item-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                  <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: 'clamp(56px, 12vw, 80px)', height: 'clamp(56px, 12vw, 80px)', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', background: '#f3f3f3', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div className="cart-item-title" style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1.05rem', marginBottom: '0.15rem', maxWidth: '100%' }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', opacity: 0.9, fontSize: '0.95rem' }}>
                      <span>${(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)} each</span>
                      <span style={{ display: 'inline-block', height: 4, width: 4, background: 'var(--text)', borderRadius: 2, opacity: 0.2 }} />
                      <span className="badge-free" style={{ background: 'var(--accent)', color: 'var(--primary)', borderRadius: 999, padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>Free shipping</span>
                    </div>
                  </div>
                </div>
                <div className="cart-item-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="qty" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button aria-label="Decrease quantity" onClick={() => handleQuantityChange(item.id, -1)} style={{ padding: '0.35rem 0.7rem', background: 'var(--primary)', color: 'var(--accent)', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem' }}>-</button>
                    <input type="number" min="1" value={item.quantity || 1} onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value || '1', 10))} style={{ width: 'clamp(40px, 12vw, 56px)', textAlign: 'center', padding: '0.25rem', borderRadius: 8, border: '1px solid var(--text)', color: 'var(--text)', background: 'var(--background)' }} />
                    <button aria-label="Increase quantity" onClick={() => handleQuantityChange(item.id, 1)} style={{ padding: '0.35rem 0.7rem', background: 'var(--primary)', color: 'var(--accent)', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem' }}>+</button>
                  </div>
                  <div className="line-total" style={{ fontWeight: 800, color: 'var(--text)', textAlign: 'right' }}>${getItemTotal(item).toFixed(2)}</div>
                  <button className="remove-btn-anim" onClick={() => removeFromCart(item.id)} style={{ padding: '0.5rem 0.9rem', borderRadius: '10px', fontWeight: 700 }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary" style={{ padding: '1.25rem 1.5rem', background: 'var(--background)', borderRadius: '16px', boxShadow: '0 2px 16px rgba(12,12,12,0.08)', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text)' }}>Order Summary</h3>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text)' }}>
              <span>Items</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text)' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Free</span>
            </div>
            <div className="summary-total" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.08)', color: 'var(--text)', fontWeight: 800, fontSize: '1.25rem' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="checkout-btn-anim" style={{ width: '100%', marginTop: '1rem', padding: '0.9rem 1.25rem', borderRadius: '10px', fontWeight: 800 }}>Proceed to Checkout</button>
            <button onClick={() => navigate('/products')} style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem 1.25rem', background: 'var(--primary)', color: 'var(--accent)', border: 'none', borderRadius: '10px', fontWeight: 700 }}>Continue Shopping</button>
          </aside>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;