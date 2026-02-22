import React from 'react';

const Footer = () => {
  return (
    <footer style={{ position: 'relative', marginTop: '0' }}>
      {/* Animated Wave SVG */}
      <svg
        style={{ display: 'block', width: '100%', height: 'auto' }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill="#9b8de8"
          style={{ animation: 'wave1 10s ease-in-out infinite' }}
        />
        <path
          d="M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,90.7C672,96,768,96,864,90.7C960,85,1056,75,1152,74.7C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill="#7c6fd6"
          style={{ animation: 'wave2 8s ease-in-out infinite' }}
        />
      </svg>

      {/* Add wave animations */}
      <style>{`
        @keyframes wave1 {
          0%, 100% { d: path("M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"); }
          50% { d: path("M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"); }
        }
        @keyframes wave2 {
          0%, 100% { d: path("M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,90.7C672,96,768,96,864,90.7C960,85,1056,75,1152,74.7C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"); }
          50% { d: path("M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,90.7C672,85,768,75,864,74.7C960,75,1056,85,1152,90.7C1248,96,1344,96,1392,90.7L1440,85L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"); }
        }
      `}</style>

      {/* Footer Content */}
      <div style={{
        background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
        padding: '60px 20px 30px',
        color: 'white',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '50px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>

          {/* Support Column */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>Support</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '15px', fontWeight: '300', fontFamily: "'Poppins', sans-serif", transition: 'color 0.3s' }}>Help Center</a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '15px', fontWeight: '300', fontFamily: "'Poppins', sans-serif", transition: 'color 0.3s' }}>FAQ</a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '15px', fontWeight: '300', fontFamily: "'Poppins', sans-serif", transition: 'color 0.3s' }}>Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>Legal</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '15px', fontWeight: '300', fontFamily: "'Poppins', sans-serif", transition: 'color 0.3s' }}>Privacy Policy</a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '15px', fontWeight: '300', fontFamily: "'Poppins', sans-serif", transition: 'color 0.3s' }}>Terms of Service</a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '15px', fontWeight: '300', fontFamily: "'Poppins', sans-serif", transition: 'color 0.3s' }}>Cookie Settings</a>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>Connect</h3>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
              {/* Facebook */}
              <a href="#" style={{ color: 'white', transition: 'transform 0.3s', display: 'flex' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="#" style={{ color: 'white', transition: 'transform 0.3s', display: 'flex' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* Twitter/X */}
              <a href="#" style={{ color: 'white', transition: 'transform 0.3s', display: 'flex' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
    
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '300', color: 'rgba(255, 255, 255, 0.85)', fontFamily: "'Poppins', sans-serif" }}>
            © 2026 VocaboPlay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;