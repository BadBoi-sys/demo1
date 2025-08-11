import React from 'react';

function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        background: 'rgba(0, 0, 0, 0.4)',
        color: '#6e6e73',
        fontSize: '13px',
        borderTop: '1px solid #e5e5e5',
        padding: '48px 0 32px 0',
        marginTop: 'auto',
        minHeight: '120px',
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontWeight: 500, color: 'white' }}>
            Jems & Bloom by Annas
          </span>
          <span style={{ margin: '0 8px', color: 'white' }}>|</span>
          <a
            href="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              margin: '0 8px',
              fontWeight: 500,
              display: 'inline',
            }}
          >
            Home
          </a>
          <span style={{ margin: '0 8px', color: 'white', display: 'inline' }}>|</span>
          <a
            href="/products"
            style={{
              color: 'white',
              textDecoration: 'none',
              margin: '0 8px',
              fontWeight: 500,
              display: 'inline',
            }}
          >
            Products
          </a>
          <span style={{ margin: '0 8px', color: 'white' }}>|</span>
          <a
            href="/cart"
            style={{
              color: 'white',
              textDecoration: 'none',
              margin: '0 8px',
              fontWeight: 500,
            }}
          >
            Cart
          </a>
        </div>
        <div style={{ textAlign: 'center', color: 'white' }}>
          &copy; {new Date().getFullYear()} Jems & Bloom by Annas. All rights reserved.
        </div>
        <div style={{ textAlign: 'center', color: 'white', fontSize: '12px' }}>
          Built for demo purposes. Inspired by Apple.
        </div>
      </div>
    </footer>
  );
}

export default Footer;


