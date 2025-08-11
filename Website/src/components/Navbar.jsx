import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

// Add a CSS variable override for the navbar and button theme
const navbarTheme = {
  background: "#fff", // white navbar
  color: "#111",      // black text
};

const buttonTheme = {
  background: "#111", // black buttons
  color: "#fff",      // white text
};

export { navbarTheme, buttonTheme };

const Navbar = ({ cart }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
      if (window.innerWidth > 1000) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen((open) => !open);
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (!isMobile) {
    return (
      <nav
        className="navbar"
        style={{
          background: "#111", // solid black
          color: "#fff",
          boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
          padding: "1rem 2rem",
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          width: "100vw",
          margin: 0,
          maxWidth: "95%",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'Segoe UI', Arial, sans-serif", // Remove Font Awesome from navbar font stack
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="navbar-logo"
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#fff", // The logo text color is white
            textDecoration: "none",
            letterSpacing: "1px",
            textShadow: "0 2px 8px rgba(255,255,255,0.15)",
          }}
        >
          <span style={{ color: "#fff" }}>Aurum Luxe</span>
        </Link>

        {/* Links */}
        <div className="navbar-links" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {["Home", "Products"].map((label, i) => {
            const path = label === "Home" ? "/" : `/${label.toLowerCase()}`;
            const isActive = location.pathname === path;
            return (
              <Link
                key={i}
                to={path}
                style={{
                  color: isActive ? "#fff" : "#bbb",
                  fontWeight: 600,
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  transition: "all 0.3s",
                  background: isActive
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                  textDecoration: "none",
                }}
                onMouseOver={e =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
                }
                onMouseOut={e =>
                (e.currentTarget.style.background = isActive
                  ? "rgba(255,255,255,0.08)"
                  : "transparent")
                }
              >
                {label}
              </Link>
            );
          })}

          {/* Cart button */}
          <Link
            to="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              color: "#111",
              padding: "0.5rem 1rem",
              borderRadius: "25px",
              fontWeight: "bold",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              textDecoration: "none",
              position: "relative",
              transition: "transform 0.2s",
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#111",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Social Media Links */}
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: "1.5rem",
              color: "#fff",
              fontSize: "1.4rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              transition: "color 0.2s",
            }}
            aria-label="Facebook"
            onMouseOver={e => (e.currentTarget.style.color = "#1877f3")}
            onMouseOut={e => (e.currentTarget.style.color = "#fff")}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor" style={{ display: "block" }}>
              <path d="M29 0h-26c-1.7 0-3 1.3-3 3v26c0 1.7 1.3 3 3 3h13v-12h-4v-5h4v-4c0-4.1 2.5-6.3 6.1-6.3 1.7 0 3.2 0.1 3.6 0.2v4.2h-2.5c-2 0-2.4 1-2.4 2.4v3.2h5l-1 5h-4v12h7c1.7 0 3-1.3 3-3v-26c0-1.7-1.3-3-3-3z" />
            </svg>
          </a>
        </div>
      </nav>
    );
  }

  // Mobile Sidebar
  return (
    <>
      <aside
        className={`sidebar${sidebarOpen ? ' open' : ''}`}
        style={{
          background: 'rgba(0,0,0,0.6)', // Changed to black with 0.6 opacity
        }}
      >
        <Link
          to="/"
          className="navbar-logo"
          onClick={() => setSidebarOpen(false)}
          style={{ marginBottom: '2rem', color: "#fff" }}
        >
          <span style={{ color: "#fff" }}>Aurum Luxe</span>
        </Link>
        <Link
          to="/"
          className={`navbar-link${location.pathname === '/' ? ' active' : ''}`}
          onClick={() => setSidebarOpen(false)}
          style={
            location.pathname === '/'
              ? {
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  display: 'block',
                }
              : {
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  display: 'block',
                }
          }
        >
          Home
        </Link>
        <Link
          to="/products"
          className={`navbar-link${location.pathname === '/products' ? ' active' : ''}`}
          onClick={() => setSidebarOpen(false)}
          style={
            location.pathname === '/products'
              ? {
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  display: 'block',
                }
              : {
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  display: 'block',
                }
          }
        >
          Products
        </Link>
        <Link
          to="/cart"
          className="navbar-link"
          onClick={() => setSidebarOpen(false)}
          style={
            location.pathname === '/cart'
              ? {
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  display: 'block',
                }
              : {
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  marginBottom: '0.5rem',
                  display: 'block',
                }
          }
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            🛒
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            <span style={{ marginLeft: '0.5rem' }}>Cart</span>
          </span>
        </Link>
        {/* Add a close button inside the sidebar, always visible and white */}
        <button
          className="sidebar-toggle sidebar-close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          style={{
            color: "#fff",
            background: "transparent",
            border: "none",
            fontSize: "2.2rem",
            cursor: "pointer",
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            zIndex: 201,
            boxShadow: "none",
            outline: "none",
            padding: 0,
            lineHeight: 1,
            display: "block",
          }}
        >
          ×
        </button>
      </aside>

      {!sidebarOpen && (
        <button
          className="sidebar-toggle floating-toggle"
          onClick={handleSidebarToggle}
          aria-label="Open sidebar"
          style={{
            color: "#fff", // Make the toggle button white
            background: "rgba(0,0,0,0.7)", // Add a dark background for contrast
            border: "none",
            fontSize: "2rem",
            cursor: "pointer",
            position: "fixed",
            top: "1.2rem",
            right: "1.2rem",
            zIndex: 200,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            outline: "none",
            padding: "0.3rem 0.9rem",
            lineHeight: 1,
            borderRadius: "8px",
            transition: "background 0.18s, box-shadow 0.18s",
          }}
        >
          ☰
        </button>
      )}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.2)',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
