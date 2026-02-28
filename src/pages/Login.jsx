import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role || 'student';

        // ✅ LOAD PROGRESS FROM FIREBASE
        let userProgress = {
          wordsLearned: 0,
          gamesPlayed: 0,
          totalPoints: 0,
          level: 1,
          xp: 0,
          streak: 0,
          correctAnswers: 0,
          totalAnswers: 0,
          flashcards: { cardsViewed: 0, knownWords: [] },
          quiz: { gamesCompleted: 0, correctAnswers: 0, totalQuestions: 0 },
          match: { gamesCompleted: 0, totalPairs: 0, totalMoves: 0 },
          guessWhat: { gamesCompleted: 0, correctAnswers: 0, totalQuestions: 0 },
          sentenceBuilder: { gamesCompleted: 0, correctAnswers: 0, totalSentences: 0 },
          shortStory: { chaptersRead: 0, quizzesPassed: 0 },
          achievements: {
            firstGame: false,
            perfectScore: false,
            threeDayStreak: false,
            tenWords: false,
            masterLearner: false
          }
        };
        
        try {
          // Import the function dynamically
          const { getUserProgress } = await import('../services/firebaseService');
          const firebaseProgress = await getUserProgress(user.uid);
          
          if (firebaseProgress) {
            userProgress = firebaseProgress;
            // Save to localStorage
            localStorage.setItem('vocaboplay_progress', JSON.stringify(firebaseProgress));
            console.log('✅ Progress loaded from Firebase:', firebaseProgress);
          } else {
            console.log('ℹ️ No existing progress, starting fresh');
            localStorage.removeItem('vocaboplay_progress');
          }
        } catch (progressError) {
          console.error('❌ Error loading progress:', progressError);
          localStorage.removeItem('vocaboplay_progress');
        }

        const userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: userData.displayName || email.split('@')[0],
          username: userData.username || email.split('@')[0],
          avatar: userData.avatar || '👤',
          role: userRole,
          progress: userProgress,  // ← Use loaded progress
          settings: userData.settings || {
            emailNotifications: true,
            darkMode: false,
            language: 'en'
          }
        };

        const token = await user.getIdToken();

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
        } else {
          sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        }

        localStorage.setItem('token', token);
        localStorage.setItem('userType', userRole);
        localStorage.setItem('userId', user.uid);

        if (userRole === 'admin') {
          localStorage.setItem('adminToken', token);
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // User exists in Auth but not in Firestore - create basic profile
        const basicProfile = {
          uid: user.uid,
          email: user.email,
          displayName: email.split('@')[0],
          username: email.split('@')[0],
          avatar: '👤',
          role: 'student',
          progress: {
            wordsLearned: 0,
            gamesPlayed: 0,
            totalPoints: 0,
            level: 1,
            xp: 0,
            streak: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            flashcards: { cardsViewed: 0, knownWords: [] },
            quiz: { gamesCompleted: 0, correctAnswers: 0, totalQuestions: 0 },
            match: { gamesCompleted: 0, totalPairs: 0, totalMoves: 0 },
            guessWhat: { gamesCompleted: 0, correctAnswers: 0, totalQuestions: 0 },
            sentenceBuilder: { gamesCompleted: 0, correctAnswers: 0, totalSentences: 0 },
            shortStory: { chaptersRead: 0, quizzesPassed: 0 },
            achievements: {
              firstGame: false,
              perfectScore: false,
              threeDayStreak: false,
              tenWords: false,
              masterLearner: false
            }
          },
          settings: {
            emailNotifications: true,
            darkMode: false,
            language: 'en'
          }
        };
        
        localStorage.setItem('userProfile', JSON.stringify(basicProfile));
        localStorage.setItem('token', await user.getIdToken());
        localStorage.setItem('userType', 'student');
        localStorage.setItem('userId', user.uid);
        localStorage.removeItem('vocaboplay_progress'); // Ensure no old progress
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        default:
          setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component (EyeIcon, EyeOffIcon, styles, return) stays exactly the same
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
      margin: '0 0 30px 0',
      textAlign: 'center',
      lineHeight: '1.4',
    },
    errorMessage: {
      padding: '12px 14px',
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      color: '#c33',
      fontSize: '13px',
      marginBottom: '20px',
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
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '800', fontSize: '22px' }}>
                VocaboPlay
              </div>
            </div>
          </div>
        </nav>

        <div style={styles.contentContainer}>
          <div style={styles.card}>
            <h1 style={styles.title}>Log in</h1>
            <p style={styles.subtitle}>Log in to continue your vocabulary journey</p>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
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
                    placeholder="Enter your password"
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

              <div style={styles.bottomRow}>
                <label style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={styles.checkboxInput}
                    disabled={loading}
                  />
                  <span style={styles.checkboxLabel}>Remember me</span>
                </label>
                <a href="#" style={styles.forgotPassword}>Forgot Password?</a>
              </div>

              <button 
                type="submit" 
                style={{
                  ...styles.loginBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>

              <p style={styles.signupText}>
                Don't have an account? <a onClick={() => !loading && navigate('/signup')} style={{
                  ...styles.signupLink,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}>Sign Up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;