import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('role-select');
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const logoTextStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '800',
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep('signup');
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: selectedRole,
        createdAt: new Date().toISOString(),
        uid: user.uid
      });

      // Store token and user type in localStorage
      if (selectedRole === 'admin') {
        localStorage.setItem('adminToken', await user.getIdToken());
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userId', user.uid);
        navigate('/admin/dashboard');
      } else {
        localStorage.setItem('token', await user.getIdToken());
        localStorage.setItem('userType', 'student');
        localStorage.setItem('userId', user.uid);
        navigate('/dashboard');
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      
      // Handle Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        default:
          setError('Failed to create account. Please try again.');
          console.error('Signup error:', error);
      }
    }
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

      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#f5f3f8',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 20px rgba(255, 255, 255, 0.3)',
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
          {/* VocaboPlay Logo */}
          <div 
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(124, 111, 214, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ ...logoTextStyle, fontSize: '22px' }}>
              VocaboPlay
            </div>
          </div>
        </div>
      </nav>
 <div style={styles.pageContainer}>
        <div style={styles.contentContainer}>
          {step === 'role-select' && (
            <div style={styles.card}>
              <h1 style={styles.title}>Who are you?</h1>
              <p style={styles.subtitle}>Choose your account type</p>

              <div style={styles.roleGrid}>
                <div
                  style={styles.roleCard}
                  onClick={() => handleRoleSelect('admin')}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <img
                    src="src/assets/bokateacher.png"
                    alt="Admin"
                    style={styles.roleImage}
                  />
                  <div style={styles.roleLabel}>Admin</div>
                </div>

                <div
                  style={styles.roleCard}
                  onClick={() => handleRoleSelect('student')}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <img
                    src="src/assets/bokastudent.png"
                    alt="Student"
                    style={styles.roleImage}
                  />
                  <div style={styles.roleLabel}>Student</div>
                </div>
              </div>

              <div style={styles.loginLinksContainer}>
                <p style={styles.loginText}>
                  Already have an account?{' '}
                  <a 
                    onClick={() => navigate('/login')} 
                    style={styles.loginLink}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                  >
                    Student Login
                  </a>
                  {' or '}
                  <a 
                    onClick={() => navigate('/admin')} 
                    style={styles.adminLoginLink}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                  >
                    Admin Login
                  </a>
                </p>
              </div>
            </div>
          )}

          {step === 'signup' && (
            <div style={styles.card}>
              <h1 style={styles.title}>{selectedRole === 'admin' ? 'Admin' : 'Student'}</h1>
              <p style={styles.subtitle}>
                Sign up as {selectedRole === 'admin' ? 'an Admin' : 'a Student'}
              </p>

              {error && <div style={styles.errorMessage}>{error}</div>}

              <form onSubmit={handleSignupSubmit} style={styles.form}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                    disabled={loading}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Password</label>
                  <div style={styles.passwordWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={styles.passwordInput}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      style={styles.showPasswordBtn}
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <div style={styles.passwordWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={styles.passwordInput}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      style={styles.showPasswordBtn}
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  style={{
                    ...styles.signupBtn,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : `Create ${selectedRole === 'admin' ? 'Admin' : 'Student'} Account`}
                </button>

                <p style={styles.loginText}>
                  Already have an account?{' '}
                  <a 
                    onClick={() => !loading && navigate(selectedRole === 'admin' ? '/admin' : '/login')} 
                    style={{
                      ...styles.loginLink,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1
                    }}
                    onMouseOver={(e) => !loading && (e.target.style.textDecoration = 'underline')}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                  >
                    {selectedRole === 'admin' ? 'Admin Login' : 'Student Login'}
                  </a>
                </p>
              </form>

              <button
                style={{
                  ...styles.backBtn,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
                onClick={() => {
                  if (!loading) {
                    setStep('role-select');
                    setError('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }
                }}
                disabled={loading}
              >
                ← Back to Role Selection
              </button>
            </div>
          )}
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
    paddingTop: '80px',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '10px 10px',
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
    margin: '0 0 30px 0',
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
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    color: '#333',
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
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    color: '#333',
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
  errorMessage: {
    padding: '12px 14px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    color: '#c33',
    fontSize: '13px',
    marginBottom: '12px',
  },
  signupBtn: {
    padding: '14px 28px',
    backgroundColor: '#7c6fd6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s ease',
  },
  loginText: {
    fontSize: '12px',
    color: '#666',
    margin: '0',
    textAlign: 'center',
  },
  loginLink: {
    color: '#7c6fd6',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  adminLoginLink: {
    color: '#7c6fd6',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    margin: '40px 0',
  },
  roleCard: {
    padding: '32px 20px',
    border: '2px solid #e8eaed',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    fontFamily: "'Poppins', sans-serif",
  },
  roleImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  roleLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#888',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: '500',
    fontFamily: "'Poppins', sans-serif",
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.2s ease',
  },
  loginLinksContainer: {
    marginTop: '20px',
  }
};

export default Signup;