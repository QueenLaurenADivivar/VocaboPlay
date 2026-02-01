import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const styles = {
    navbarContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(124, 111, 214, 0.1)',
      zIndex: 1000,
      transition: 'all 0.3s ease',
    },
    navbarContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '70px',
    },
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
      color: 'white',
      padding: '12px 28px',
      borderRadius: '25px',
      fontWeight: '700',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(124, 111, 214, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Poppins', sans-serif",
    },
    logoText: {
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: '0.5px',
    },
    navActions: {
      display: 'flex',
      alignItems: 'center',
    },
    btnSignup: {
      background: 'linear-gradient(135deg, #a99de8 0%, #7c6fd6 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 28px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(124, 111, 214, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Poppins', sans-serif",
    },
  };

  const [logoHover, setLogoHover] = React.useState(false);
  const [btnHover, setBtnHover] = React.useState(false);

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          body {
            padding-top: 70px;
          }
          
          .navbar-logo:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 0 8px 25px rgba(124, 111, 214, 0.4) !important;
          }
          
          .navbar-btn:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(124, 111, 214, 0.4) !important;
          }
          
          .navbar-btn:active {
            transform: translateY(-1px) !important;
          }
          
          @media (max-width: 768px) {
            .navbar-content-responsive {
              padding: 0 20px !important;
              height: 65px !important;
            }
            .navbar-logo-responsive {
              padding: 10px 20px !important;
              font-size: 18px !important;
            }
            .navbar-btn-responsive {
              padding: 10px 20px !important;
              font-size: 14px !important;
            }
          }
          
          @media (max-width: 480px) {
            .navbar-content-responsive {
              padding: 0 15px !important;
              height: 60px !important;
            }
            .navbar-logo-responsive {
              padding: 8px 16px !important;
              font-size: 16px !important;
            }
            .navbar-btn-responsive {
              padding: 8px 16px !important;
              font-size: 13px !important;
            }
          }
        `}
      </style>

      <nav style={styles.navbarContainer}>
        <div 
          style={styles.navbarContent}
          className="navbar-content-responsive"
        >
          {/* Logo Section */}
          <div style={styles.logoWrapper}>
            <div 
              style={styles.logo}
              className="navbar-logo navbar-logo-responsive"
              onClick={() => navigate('/')}
              onMouseEnter={() => setLogoHover(true)}
              onMouseLeave={() => setLogoHover(false)}
            >
              <span style={styles.logoText}>VocaboPlay</span>
            </div>
          </div>

          {/* Sign Up Button Only */}
          <div style={styles.navActions}>
            <button 
              style={styles.btnSignup}
              className="navbar-btn navbar-btn-responsive"
              onClick={() => navigate('/signup')}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              <span>Sign up</span>
              <span 
                style={{ 
                  fontSize: '10px',
                  transition: 'transform 0.3s ease',
                  transform: btnHover ? 'translateX(5px)' : 'translateX(0)'
                }}
              ></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;