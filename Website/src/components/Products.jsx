import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const spinnerStyle = {
  display: 'inline-block',
  width: '80px',
  height: '80px',
  position: 'relative',
  marginRight: '2rem',
};

const dualRingStyle = {
  boxSizing: 'border-box',
  display: 'block',
  position: 'absolute',
  width: '80px',
  height: '80px',
  border: '8px solid #f3f3f3',
  borderTop: '8px solid var(--accent)',
  borderRadius: '50%',
  animation: 'dual-ring-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
  borderColor: 'var(--accent) transparent var(--accent) transparent',
};

const spinnerKeyframes = `@keyframes dual-ring-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

const pageBgStyle = {
  minHeight: '100vh',
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -1,
};

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({}); // State to manage quantities for each product
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://6874dd20dd06792b9c95996f.mockapi.io/api/ecommerece')
      .then(res => {
        setProducts(res.data);
        // Initialize quantities to 1 for each product
        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);
  // Ensure Products page uses the default theme background immediately
  useEffect(() => {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundRepeat = '';
    document.body.style.backgroundPosition = '';
    // Remove any page-specific override so CSS variable from theme applies
    document.documentElement.style.removeProperty('--background');
  }, []);
  const handleQuantityChange = (productId, amount) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) + amount),
    }));
  };

  if (loading) return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={pageBgStyle} />
      <div className="container" style={{ textAlign: 'center' }}>
        <h2>Products</h2>
        <style>{spinnerKeyframes}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
          <span style={spinnerStyle}>
            <span style={dualRingStyle}></span>
          </span>
          <span style={{ fontSize: '1.5rem', color: 'var(--text)', fontWeight: 'bold' }}>Loading...</span>
        </div>
      </div>
    </div>
  );
  if (error) return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={pageBgStyle} />
      <div className="container"><h2>Products</h2><p>{error}</p></div>
    </div>
  );

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart({ ...product, quantity });
    navigate('/cart');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={pageBgStyle} />
      <div className="container fade-page">
        <h2 style={{ color: 'var(--primary)' }}>Products</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.75rem, 3vw, 2rem)', justifyContent: 'center' }}>
          {products.map(product => (
            <div
              key={product.id}
              className="product-card"
              style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: 'clamp(0.75rem, 2.5vw, 1rem)',
                width: 'clamp(160px, 44vw, 260px)',
                flex: '1 1 clamp(160px, 44vw, 260px)',
                boxSizing: 'border-box',
                background: 'rgb(255, 255, 255)', // changed here
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                border: '1px solid black',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} style={{ width: '100%', borderRadius: '4px' }} />
                <h3 style={{ margin: '1rem 0 0.5rem', color: 'var(--text)' }}>{product.name}</h3>
                <p style={{ fontWeight: 'bold', color: 'var(--text)', fontSize: '1.1rem' }}>${parseFloat(product.price).toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                <button onClick={() => handleQuantityChange(product.id, -1)} style={{ padding: '0.3rem 0.8rem', background: 'var(--primary)', color: 'var(--accent)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>-</button>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) - (quantities[product.id] || 1))}
                  style={{ width: '40px', textAlign: 'center', margin: '0 0.5rem', padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--text)', color: 'var(--text)', background: 'var(--background)' }}
                />
                <button onClick={() => handleQuantityChange(product.id, 1)} style={{ padding: '0.3rem 0.8rem', background: 'var(--primary)', color: 'var(--accent)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>+</button>
              </div>
              <button onClick={() => handleAddToCart(product)} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'var(--accent)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;