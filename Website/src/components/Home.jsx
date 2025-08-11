import React, { useEffect, useState, useRef } from 'react';

// Keyframes for animations

const styles = `
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes fadeIn {
  0% { opacity: 0;}
  100% { opacity: 1;}
}
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animated-bg {
  animation: gradientBG 12s ease-in-out infinite;
  background: linear-gradient(120deg, rgba(0,123,255,0.25) 0%, rgba(0,198,255,0.18) 50%, rgba(255,255,255,0.10) 100%);
  background-size: 200% 200%;
}
.landing-fadein {
  animation: fadeIn 1.2s cubic-bezier(.25,.8,.25,1) both;
}
.landing-fadein-up {
  animation: fadeInUp 1.1s cubic-bezier(.25,.8,.25,1) both;
}
.landing-h1 {
  animation-delay: 0.2s;
  color: #fff;
}
.landing-p {
  animation-delay: 0.5s;
}
.landing-btn {
  animation-delay: 0.8s;
  box-shadow: 0 4px 14px 0 rgba(0,123,255,0.20);
  transition: 
    background 0.4s cubic-bezier(.25,.8,.25,1),
    transform 0.25s cubic-bezier(.25,.8,.25,1),
    box-shadow 0.25s cubic-bezier(.25,.8,.25,1),
    color 0.2s;
  position: relative;
  overflow: hidden;
}
.landing-btn::before {
  content: '';
  position: absolute;
  left: -75%;
  top: 0;
  width: 50%;
  height: 100%;
  background: rgba(255,255,255,0.18);
  transform: skewX(-20deg);
  transition: left 0.5s cubic-bezier(.25,.8,.25,1);
  z-index: 1;
  pointer-events: none;
}
.landing-btn:hover::before {
  left: 120%;
}
.landing-btn:active {
  transform: scale(0.97);
}
.landing-btn-glow {
  box-shadow: 0 0 24px 6px rgba(0,198,255,0.25), 0 8px 24px 0 rgba(0,123,255,0.30);
}
`;

const Home = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [btnGlow, setBtnGlow] = useState(false);
  const btnRef = useRef(null);

  // Inject animation styles once
  useEffect(() => {
    if (!document.getElementById('landing-animations')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'landing-animations';
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }
  }, []);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    // Set background image on body
    document.body.style.backgroundImage = `url(${'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg'})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
    // Set the background of the main div to transparent
    document.documentElement.style.setProperty('--background', 'rgba(255,255,255,0.1)');

    // Cleanup to remove background when component unmounts and restore theme background variable
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundPosition = '';
      document.documentElement.style.removeProperty('--background');
    };
  }, []);

  useEffect(() => {
    // Center the navbar horizontally by setting its margin to auto
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.marginLeft = 'auto';
      navbar.style.marginRight = 'auto';
      navbar.style.left = '0';
      navbar.style.right = '0';
      navbar.style.position = 'relative';
      setNavbarHeight(navbar.offsetHeight);
    }
    // Cleanup: remove the inline styles when component unmounts
    return () => {
      if (navbar) {
        navbar.style.marginLeft = '';
        navbar.style.marginRight = '';
        navbar.style.left = '';
        navbar.style.right = '';
        navbar.style.position = '';
      }
    };
  }, []);

  // Button glow effect on hover
  const handleBtnMouseEnter = e => {
    setBtnGlow(true);
    e.currentTarget.style.background = 'linear-gradient(90deg, #007bff 0%, #00c6ff 100%)';
    e.currentTarget.style.transform = 'scale(1.07)';
    e.currentTarget.style.boxShadow = '0 0 24px 6px rgba(0,198,255,0.25), 0 8px 24px 0 rgba(0,123,255,0.30)';
    e.currentTarget.style.color = '#fff';
  };
  const handleBtnMouseLeave = e => {
    setBtnGlow(false);
    e.currentTarget.style.background = '#007bff';
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0,123,255,0.20)';
    e.currentTarget.style.color = '#fff';
  };

  // Footer moved to a shared component

  // Animate background overlay with gradient
  // Fix: Use minHeight instead of height for the hero section, and add flex column to parent for sticky footer
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
      }}
    >
      <section style={{ textAlign: 'center', flex: '1 0 auto' }}>
        <div
          className="animated-bg landing-fadein"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: `calc(100vh - ${navbarHeight}px - 140px)`, // 140px for footer height
            width: '100%',
            background: 'var(--background,rgb(230, 230, 228))',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <h1
            className="landing-fadein-up landing-h1"
            style={{
              fontSize: '70px',
              fontWeight: 700,
              letterSpacing: '2px',
              marginBottom: '1.2rem',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            Welcome to Jems & Bloom by Annas
          </h1>
          <p
            className="landing-fadein-up landing-p"
            style={{
              fontSize: '1.35rem',
              maxWidth: 600,
              margin: '0 auto 2.2rem auto',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            Your one-stop shop for the latest products. Enjoy seamless shopping and fast delivery!
          </p>
          <a
            ref={btnRef}
            href="/products"
            className={`shop-now-btn landing-fadein-up landing-btn${btnGlow ? ' landing-btn-glow' : ''}`}
            style={{
              display: 'inline-block',
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              background: '#007bff',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              position: 'relative',
              opacity: 0,
              animationFillMode: 'forwards',
              zIndex: 2,
              cursor: 'pointer',
              overflow: 'hidden',
            }}
            onMouseEnter={handleBtnMouseEnter}
            onMouseLeave={handleBtnMouseLeave}
          >
            Shop Now
          </a>
        </div>
      </section>
      <div style={{ flexShrink: 0 }}>
      </div>
    </div>
  );
};

export default Home;
