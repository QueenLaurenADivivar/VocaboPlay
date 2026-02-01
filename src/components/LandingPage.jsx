import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Landing = () => {
  const navigate = useNavigate();
  const logoTextStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '800',
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          
          .animate-bounce-custom {
            animation: bounce 2s ease-in-out infinite;
          }
          
          .animate-slide-left {
            animation: slideInLeft 0.8s ease-out;
          }
          
          .animate-slide-right {
            animation: slideInRight 0.8s ease-out;
          }
          
          .animate-pulse-custom {
            animation: pulse 2s ease-in-out infinite;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Poppins', sans-serif;
            background-color: #f5f5f7;
          }
        `}
      </style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)' }}>
        
        {/* Navbar */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgb(255, 254, 254)',
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
            
            <div style={{
              background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(124, 111, 214, 0.3)',
              transition: 'all 0.3s ease',
            }}>
              <div style={{ ...logoTextStyle, fontSize: '22px' }}>
                VocaboPlay
              </div>
            </div>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 25px',
                borderRadius: '30px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(124, 111, 214, 0.3)',
                transition: 'all 0.3s ease',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Log in
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={{
          paddingTop: '120px',
          paddingBottom: '80px',
          textAlign: 'center',
        }} className="animate-fade-in">
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
            <img 
              src="src/assets/mascot.png"
              alt="VocaboPlay Mascot"
              style={{
                width: '300px',
                height: 'auto',
                marginBottom: '30px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
              className="animate-bounce-custom"
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
           
            <h1 style={{  
              color: '#333',
              fontSize: '45px',
              fontWeight: '700',
              marginBottom: '20px',
              lineHeight: '1.2',
              fontFamily: "'Poppins', sans-serif",
            }}>Learn New Words, Play Smart, Level Up Your Vocabulary</h1>
          </div>
        </section>

        {/* Master Vocabulary Section */}
        <section style={{
          padding: '80px 20px',
          background: '#ffffff',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '60px',
            alignItems: 'center',
          }}>
            <div className="animate-slide-left">
              <h2 style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '25px',
                lineHeight: '1.3',
                fontFamily: "'Poppins', sans-serif",
              }}>
                Master Vocabulary Through Fun and Games
              </h2>
              <p style={{
                fontSize: '17px',
                color: '#666',
                lineHeight: '1.7',
                fontFamily: "'Poppins', sans-serif",
              }}>
                VocaboPlay transforms vocabulary learning into an engaging journey. 
                Learn new words and track your progress.
              </p>
            </div>

            <div className="animate-slide-right" style={{ textAlign: 'center' }}>
              <img 
                src="src/assets/mascot-sitting.png"
                alt="Mascot" 
                style={{
                  width: '280px',
                  height: 'auto',
                  transition: 'transform 0.5s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(3deg)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section style={{
          padding: '80px 20px',
          background: 'white',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '60px',
            alignItems: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <img 
                src="src/assets/mascot-dad.png"
                alt="Mascot" 
                style={{
                  width: '280px',
                  height: 'auto',
                  transition: 'transform 0.5s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(-2deg)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
              />
            </div>
            <div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '25px',
                lineHeight: '1.3',
                fontFamily: "'Poppins', sans-serif",
              }}>
                About VocaboPlay
              </h2>
              <p style={{
                fontSize: '17px',
                color: '#666',
                lineHeight: '1.7',
                marginBottom: '20px',
                fontFamily: "'Poppins', sans-serif",
              }}>
                VocaboPlay is a web-based vocabulary learning platform that 
                integrates gamification techniques to enhance student engagement 
                and learning effectiveness.
              </p>
              <p style={{
                fontSize: '17px',
                color: '#666',
                lineHeight: '1.7',
                fontFamily: "'Poppins', sans-serif",
              }}>
                It supports vocabulary development through structured interactive 
                activities and progress monitoring, promoting consistent practice 
                and improved language proficiency.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section style={{
          padding: '80px 20px',
          background: '#ffffff',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a1a',
              textAlign: 'center',
              marginBottom: '60px',
              lineHeight: '1.3',
              fontFamily: "'Poppins', sans-serif",
            }}>
              Why Choose VocaboPlay?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '40px',
              alignItems: 'center',
            }}>
              <div style={{
                textAlign: 'center',
                padding: '30px',
                borderRadius: '16px',
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                height: '100%',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#7c6fd6',
                  marginBottom: '15px',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Fun Learning Experience
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Say goodbye to boring memorization! Our interactive games 
                  and activities make vocabulary learning enjoyable and engaging.
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }} className="animate-pulse-custom">
                <img 
                  src="src/assets/mascot-happy.png"
                  alt="Happy Mascot" 
                  style={{
                    width: '220px',
                    height: 'auto',
                  }}
                />
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '30px',
                borderRadius: '16px',
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                height: '100%',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#7c6fd6',
                  marginBottom: '15px',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Effective Learning
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Our learning methods help you remember words better and 
                  build vocabulary over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section style={{
          padding: '80px 20px',
          background: 'white',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a1a',
              textAlign: 'center',
              marginBottom: '50px',
              lineHeight: '1.3',
              fontFamily: "'Poppins', sans-serif",
            }}>
              How It Works
            </h2>
            <div style={{
              background: '#f8f7ff',
              borderRadius: '20px',
              padding: '50px',
              boxShadow: '0 10px 40px rgba(124, 111, 214, 0.1)',
            }}>
              {[
                { num: 1, title: 'Create an Account', desc: 'Sign up for free and set up your learning profile' },
                { num: 2, title: 'Browse the Word Library', desc: 'Explore our comprehensive collection of vocabulary words. Choose words based on your level and learning goals.' },
                { num: 3, title: 'Learn Through Games', desc: 'Practice with flashcards, take quizzes, and engage with interactive activities. Learn new words in a fun, effective way!' },
                { num: 4, title: 'Track Your Progress', desc: 'Monitor your improvement, earn achievements' },
              ].map((step) => (
                <div key={step.num} style={{
                  display: 'flex',
                  gap: '25px',
                  marginBottom: '35px',
                  padding: '25px',
                  borderRadius: '16px',
                  background: 'white',
                  transition: 'all 0.3s ease',
                  alignItems: 'center',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(10px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '700',
                    flexShrink: 0,
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {step.num}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '10px',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      color: '#666',
                      lineHeight: '1.6',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '80px 20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%)',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '30px',
              lineHeight: '1.3',
              fontFamily: "'Poppins', sans-serif",
            }}>
              Ready to Start Your Vocabulary Journey?
            </h2>
            <img 
              src="src/assets/mascot-skateboard.png"
              alt="Mascot" 
              style={{
                width: '240px',
                height: 'auto',
                marginBottom: '40px',
              }}
              className="animate-bounce-custom"
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <button 
                onClick={() => navigate('/signup')}
                style={{
                  background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 45px',
                  borderRadius: '30px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(124, 111, 214, 0.4)',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(124, 111, 214, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(124, 111, 214, 0.4)';
                }}
              >
                Start Now
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Landing;