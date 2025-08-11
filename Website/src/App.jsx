import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import TodoList from './components/TodoList';

function CursorCircles() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    let animationFrame;
    // Remove moving circles at a certain breakpoint (e.g., 768px)
    const checkBreakpoint = () => {
      if (window.innerWidth < 1000) {
        if (outerRef.current) outerRef.current.style.display = 'none';
        if (innerRef.current) innerRef.current.style.display = 'none';
      } else {
        if (outerRef.current) outerRef.current.style.display = '';
        if (innerRef.current) innerRef.current.style.display = '';
      }
    };
    window.addEventListener('resize', checkBreakpoint);
    checkBreakpoint();

    const moveCircles = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Inner circle follows exactly
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
      }
    };

    const animateOuter = () => {
      // Move outerX/Y a bit closer to mouseX/Y for trailing effect
      outerX += (mouseX - outerX) * 0.08; // Lower factor = more delay (was 0.01)
      outerY += (mouseY - outerY) * 0.08;  // Lower factor = more delay (was 0.18)
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerX - 20}px, ${outerY - 20}px)`;
      }
      animationFrame = requestAnimationFrame(animateOuter);
    };

    window.addEventListener('mousemove', moveCircles);
    animationFrame = requestAnimationFrame(animateOuter);

    return () => {
      window.removeEventListener('mousemove', moveCircles);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Circles styled for visibility and pointer-events none
  return (
    <>
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2.5px solid rgb(255, 255, 255)',
          background: 'rgba(150, 149, 145, 0.08)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'transform 0.13s cubic-bezier(.22,.68,.53,1.01)',
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#D4AF37',
          pointerEvents: 'none',
          zIndex: 10000,
          transition: 'transform 0.05s cubic-bezier(.22,.68,.53,1.01)',
          boxShadow: '0 0 8px 2px rgba(255,255,255,0.2)',
          mixBlendMode: 'difference',
          border: '2.5px solid rgb(255, 255, 255)',
          background: 'rgba(150, 149, 145, 0.08)',
        }}
      />
    </>
  );
}

// WhatsApp floating button (bottom right) - FIXED: Make it a proper React component that returns JSX
function Whats() {
  return (
    <>
      {/* 
        The draft message is written in the "text" query parameter of the WhatsApp link below.
        When the user clicks this button, WhatsApp opens with the draft message pre-filled in the chat box.
        The message is: "I want to contact with you from your webiste"
        You can change the message by editing the "text" parameter in the href URL.
      */}
      <a
        href="https://wa.me/923227646966?text=I%20want%20to%20contact%20with%20you%20from%20your%20webiste"
        target='_blank'
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          right: 'clamp(14px, 3vw, 35px)',
          bottom: 'clamp(14px, 3vw, 24px)',
          zIndex: 10001,
          background: '#25D366',
          borderRadius: '50%',
          width: 'clamp(48px, 6vw, 72px)',
          height: 'clamp(48px, 6vw, 72px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
          textDecoration: 'none',
        }}
        aria-label="Chat on WhatsApp"
        title="Click to open WhatsApp with a pre-filled message"
      >
        <svg
          width="60%"
          height="60%"
          viewBox="0 0 32 32"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.74 6.41L3.2 28.8l6.59-1.72A12.74 12.74 0 0 0 16 28.8c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.799-12.8zm0 23.04c-2.01 0-3.98-.53-5.7-1.54l-.41-.24-3.91 1.02 1.04-3.81-.26-.42A10.57 10.57 0 0 1 5.44 16c0-5.83 4.73-10.56 10.56-10.56 5.83 0 10.56 4.73 10.56 10.56 0 5.83-4.73 10.56-10.56 10.56zm5.8-7.89c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.89-1.79-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.53-.54-.71-.55-.18-.01-.4-.01-.62-.01-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.65 0 1.56 1.14 3.07 1.3 3.29.16.21 2.24 3.42 5.44 4.66.76.33 1.36.53 1.83.68.77.25 1.47.22 2.02.13.62-.09 1.89-.77 2.16-1.51.27-.74.27-1.37.19-1.51-.08-.14-.29-.21-.61-.37z"/>
        </svg>
      </a>
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(product => product.id !== productId));
  };

  // Add this function:
  const addToCart = (product) => {
    setCart(prevCart => {
      // Check if product is already in cart
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        // Increase quantity
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) } : item
        );
      } else {
        // Add new product with quantity 1
        return [...prevCart, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  // NEW: Function to update product quantity in cart
  const updateCartQuantity = (productId, newQuantity) => {
    setCart(prevCart => {
      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) } // Ensure quantity is at least 1
          : item
      );
    });
  };

  return (
    <>
      <Whats />
      <CursorCircles />
      <Router>
        <Navbar cart={cart} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateCartQuantity={updateCartQuantity} />} />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/update_products_admin" element={<TodoList />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
