import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const logoTextStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '800',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login with:', { email, password, rememberMe });
    navigate('/dashboard');
  };

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Poppins', sans-serif !important;
          }
        `}
      </style>

      <div style={styles.pageContainer}>
        {/* Navbar */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgb(255, 255, 255)',
          zIndex: 1000,
          padding: '15px 40px',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div 
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #8c7fe7)',
                color: 'white',
                padding: '5px 16px',
                borderRadius: '10px',
                fontWeight: '200',
                fontSize: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgb(255, 255, 255)',
                transition: 'all 0.3s ease',
              }}>
              <div style={{ ...logoTextStyle, fontSize: '20px' }}>
                VocaboPlay
              </div>
            </div>
          </div>
        </nav>

        <div style={styles.contentContainer}>
          <div style={styles.card}>
            <h1 style={styles.title}>Log in</h1>
            <p style={styles.subtitle}>Log in to continue your vocabulary journey</p>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.passwordInput}
                  />
                  <button
                    type="button"
                    style={styles.showPasswordBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div style={styles.bottomRow}>
                <label style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={styles.checkboxInput}
                  />
                  <span style={styles.checkboxLabel}>Remember me</span>
                </label>
                <a href="#" style={styles.forgotPassword}>Forgot Password?</a>
              </div>

              <button type="submit" style={styles.loginBtn}>
                Log In
              </button>

              <p style={styles.signupText}>
                Don't have an account? <a onClick={() => navigate('/signup')} style={styles.signupLink}>Sign Up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f3f8',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '100px 20px 40px 20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '20px 30px',
    width: '100%',
    maxWidth: '350px',
    boxShadow: '0 2px 12px rgba(255, 255, 255, 0.06)',
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 40px 0',
    textAlign: 'center',
    lineHeight: '1.4',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    margin: '0',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #d0d0d0',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    color: '#333',
    transition: 'all 0.2s ease',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    padding: '12px 16px',
    paddingRight: '45px',
    border: '1px solid #d0d0d0',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    color: '#333',
    transition: 'all 0.2s ease',
  },
  showPasswordBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    transition: 'color 0.2s ease',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
    marginBottom: '8px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkboxInput: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#7c6fd6',
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#666',
    userSelect: 'none',
  },
  forgotPassword: {
    fontSize: '13px',
    color: '#7c6fd6',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  loginBtn: {
    padding: '14px 28px',
    backgroundColor: '#7c6fd6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '12px',
  },
  signupText: {
    fontSize: '14px',
    color: '#666',
    margin: '20px 0 0 0',
    textAlign: 'center',
  },
  signupLink: {
    color: '#7c6fd6',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
};

export default Login;
