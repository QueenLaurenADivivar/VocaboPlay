// src/components/Leaderboards.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../pages/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const Leaderboards = ({ onBack, isAdmin = false, currentUserId = null }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('points');

  // Fetch leaderboard data from Firebase
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        
        // Determine limit based on user type (admin sees more)
        const limitCount = isAdmin ? 50 : 20;
        
        // Determine sort field based on selected leaderboard
        let sortField = 'progress.totalPoints';
        switch (selectedLeaderboard) {
          case 'points':
            sortField = 'progress.totalPoints';
            break;
          case 'words':
            sortField = 'progress.wordsLearned';
            break;
          case 'streak':
            sortField = 'progress.streak';
            break;
          case 'games':
            sortField = 'progress.gamesPlayed';
            break;
          default:
            sortField = 'progress.totalPoints';
        }

        // Create query with dynamic sorting
        const q = query(usersRef, orderBy(sortField, 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        
        // Map the data with ranks
        const users = snapshot.docs.map((doc, index) => {
          const data = doc.data();
          return {
            id: doc.id,
            rank: index + 1,
            ...data,
            displayName: data.displayName || 'Anonymous User',
            avatar: data.avatar || '👤',
            email: data.email || 'No email',
            progress: data.progress || {
              totalPoints: 0,
              wordsLearned: 0,
              streak: 0,
              gamesPlayed: 0,
              level: 1
            }
          };
        });
        
        setLeaderboardData(users);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Optional: Add mock data for testing if Firebase fails
        // setLeaderboardData(generateMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedLeaderboard, timeFilter, isAdmin]);

  // Admin-only functions (walang effect sa student view)
  const handleResetStats = (userId) => {
    if (isAdmin && window.confirm('Reset stats for this user?')) {
      console.log('Reset user:', userId);
      // Add your Firebase reset logic here
      alert('Reset functionality - implement as needed');
    }
  };

  const handleRemoveUser = (userId) => {
    if (isAdmin && window.confirm('Remove this user from leaderboard?')) {
      console.log('Remove user:', userId);
      // Add your Firebase remove logic here
      alert('Remove functionality - implement as needed');
    }
  };

  const handleExportData = () => {
    if (!isAdmin) return;
    
    const csvData = leaderboardData.map(user => ({
      Rank: user.rank,
      Name: user.displayName,
      Email: user.email,
      Points: user.progress.totalPoints,
      Words: user.progress.wordsLearned,
      Streak: user.progress.streak,
      Games: user.progress.gamesPlayed,
      Level: user.progress.level || 1
    }));
    
    console.log('Export data:', csvData);
    alert('Export functionality - implement as needed');
  };

  // Helper functions to get values based on selected leaderboard
  const getValue = (user) => {
    switch (selectedLeaderboard) {
      case 'points': return user.progress.totalPoints || 0;
      case 'words': return user.progress.wordsLearned || 0;
      case 'streak': return user.progress.streak || 0;
      case 'games': return user.progress.gamesPlayed || 0;
      default: return user.progress.totalPoints || 0;
    }
  };

  const getUnit = () => {
    switch (selectedLeaderboard) {
      case 'points': return 'pts';
      case 'words': return 'words';
      case 'streak': return 'days';
      case 'games': return 'games';
      default: return 'pts';
    }
  };

  // Leaderboard types configuration
  const leaderboardTypes = [
    { id: 'points', label: 'Total Points', icon: '⭐', color: '#7c6fd6', bg: '#f0edff' },
    { id: 'words', label: 'Words Learned', icon: '📚', color: '#2E7D32', bg: '#e8f5e9' },
    { id: 'streak', label: 'Longest Streak', icon: '🔥', color: '#B85C1A', bg: '#fff4e5' },
    { id: 'games', label: 'Games Played', icon: '🎮', color: '#C44545', bg: '#fee9e9' },
  ];

  // Time filters
  const timeFilters = [
    { id: 'all', label: 'All Time' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
  ];

  // Get current leaderboard info
  const currentType = leaderboardTypes.find(t => t.id === selectedLeaderboard) || leaderboardTypes[0];

  return (
    <div style={{
      fontFamily: "'Inter', 'Poppins', sans-serif",
      maxWidth: isAdmin ? '1400px' : '1200px',
      margin: '0 auto',
      padding: '24px',
      color: '#0f172a',
    }}>
      {/* HEADER - Different for Admin vs Student */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '20px',
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {isAdmin ? 'Admin Leaderboards' : 'Leaderboards'}
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#475569',
            margin: '0',
            fontWeight: '200',
          }}>
            {isAdmin ? 'Monitor and manage top performers' : 'See how you rank against other learners'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Admin Export Button - ONLY visible to admin */}
          {isAdmin && (
            <button
              onClick={handleExportData}
              style={{
                padding: '10px 20px',
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <span>📊</span>
              Export Data
            </button>
          )}
          
          <button
            onClick={onBack}
            style={{
              padding: '10px 24px',
              background: isAdmin ? '#7c6fd6' : 'white',
              color: isAdmin ? 'white' : '#475569',
              border: isAdmin ? 'none' : '1px solid #e2e8f0',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Poppins', sans-serif",
            }}
            onMouseOver={(e) => {
              if (!isAdmin) {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }
            }}
            onMouseOut={(e) => {
              if (!isAdmin) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }
            }}
          >
            ← 
          </button>
        </div>
      </div>

      {/* TIME FILTER - Same for both */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '100px',
        }}>
          {timeFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id)}
              style={{
                padding: '8px 20px',
                borderRadius: '100px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: timeFilter === filter.id ? '#ffffff' : 'transparent',
                color: timeFilter === filter.id ? '#0f172a' : '#64748b',
                boxShadow: timeFilter === filter.id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <span style={{
          fontSize: '13px',
          color: '#64748b',
          background: '#ffffff',
          padding: '8px 16px',
          borderRadius: '100px',
          border: '1px solid #e2e8f0',
        }}>
          Top {leaderboardData.length} Learners
        </span>
      </div>

      {/* LEADERBOARD TYPE SELECTOR - Same for both */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '32px',
      }}>
        {leaderboardTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setSelectedLeaderboard(type.id)}
            style={{
              background: selectedLeaderboard === type.id ? type.color : '#ffffff',
              border: `1px solid ${selectedLeaderboard === type.id ? type.color : '#e2e8f0'}`,
              borderRadius: '16px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: selectedLeaderboard === type.id ? '0 4px 12px rgba(124, 111, 214, 0.2)' : 'none',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: selectedLeaderboard === type.id ? 'rgba(255,255,255,0.2)' : type.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              {type.icon}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: selectedLeaderboard === type.id ? 'white' : '#0f172a',
            }}>
              {type.label}
            </div>
          </button>
        ))}
      </div>

      {/* ADMIN STATS SUMMARY - ONLY visible to admin */}
      {isAdmin && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Total Players</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{leaderboardData.length}</div>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Avg Points</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>
              {leaderboardData.length > 0 
                ? Math.round(leaderboardData.reduce((acc, u) => acc + u.progress.totalPoints, 0) / leaderboardData.length)
                : 0}
            </div>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Active Today</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>12</div>
          </div>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>New This Week</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>5</div>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '80px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px' }}>
            Loading Leaderboard
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Fetching top performers...
          </p>
        </div>
      ) : (
        <>
          {/* TOP 3 PODIUM - ONLY for students */}
          {!isAdmin && leaderboardData.length >= 3 && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '32px',
              padding: '16px',
              background: '#faf9ff',
              borderRadius: '12px',
              border: '1px solid #eae8f0',
            }}>
              {/* 2nd Place */}
              {leaderboardData[1] && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#e8e8e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {leaderboardData[1].avatar && (leaderboardData[1].avatar.includes('src/') || leaderboardData[1].avatar.includes('.png')) ? (
                      <img 
                        src={leaderboardData[1].avatar}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<span style="font-size: 32px;">👤</span>';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '32px' }}>{leaderboardData[1].avatar}</span>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#a0a0a0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: '500',
                      fontSize: '12px',
                      border: '2px solid #ffffff',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      2
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '500', 
                    color: '#2c3440', 
                    fontSize: '14px', 
                    marginBottom: '4px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {leaderboardData[1].displayName}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6f7887',
                    background: '#f2f4f8',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {getValue(leaderboardData[1])} {getUnit()}
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {leaderboardData[0] && (
                <div style={{
                  textAlign: 'center',
                  transform: 'scale(1.05)',
                  zIndex: 2,
                }}>
                  <div style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    background: '#f5e9d3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    border: '2px solid #ffffff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {leaderboardData[0].avatar && (leaderboardData[0].avatar.includes('src/') || leaderboardData[0].avatar.includes('.png')) ? (
                      <img 
                        src={leaderboardData[0].avatar}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<span style="font-size: 40px;">👤</span>';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '40px' }}>{leaderboardData[0].avatar}</span>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#d4af37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: '500',
                      fontSize: '14px',
                      border: '2px solid #ffffff',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      1
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#2c3440', 
                    fontSize: '16px', 
                    marginBottom: '4px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {leaderboardData[0].displayName}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b63b5',
                    background: '#f2efff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {getValue(leaderboardData[0])} {getUnit()}
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {leaderboardData[2] && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: '#ede0d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {leaderboardData[2].avatar && (leaderboardData[2].avatar.includes('src/') || leaderboardData[2].avatar.includes('.png')) ? (
                      <img 
                        src={leaderboardData[2].avatar}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<span style="font-size: 28px;">👤</span>';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '28px' }}>{leaderboardData[2].avatar}</span>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#b08d6b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: '500',
                      fontSize: '11px',
                      border: '2px solid #ffffff',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      3
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '500', 
                    color: '#2c3440', 
                    fontSize: '13px', 
                    marginBottom: '4px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {leaderboardData[2].displayName}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6f7887',
                    background: '#f2f4f8',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {getValue(leaderboardData[2])} {getUnit()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LEADERBOARD TABLE */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #eaedf2',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #eaedf2',
              background: '#fbfcfd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#2c3440',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Poppins', sans-serif",
              }}>
                <span style={{ fontSize: '18px', color: currentType.color }}>{currentType.icon}</span>
                {currentType.label} Ranking
              </h3>
              <span style={{
                fontSize: '12px',
                color: '#6f7887',
                background: '#ffffff',
                padding: '4px 10px',
                borderRadius: '12px',
                border: '1px solid #eaedf2',
                fontFamily: "'Poppins', sans-serif",
              }}>
                Total: {leaderboardData.length} players
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: "'Poppins', sans-serif",
              }}>
                <thead>
                  <tr style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #eaedf2',
                  }}>
                    <th style={{ 
                      padding: '14px 20px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6f7887',
                      fontFamily: "'Poppins', sans-serif",
                    }}>Rank</th>
                    <th style={{ 
                      padding: '14px 20px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6f7887',
                      fontFamily: "'Poppins', sans-serif",
                    }}>Player</th>
                    {/* Email column - ONLY for admin */}
                    {isAdmin && <th style={{ 
                      padding: '14px 20px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6f7887',
                      fontFamily: "'Poppins', sans-serif",
                    }}>Email</th>}
                    <th style={{ 
                      padding: '14px 20px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6f7887',
                      fontFamily: "'Poppins', sans-serif",
                    }}>Level</th>
                    <th style={{ 
                      padding: '14px 20px', 
                      textAlign: 'right', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6f7887',
                      fontFamily: "'Poppins', sans-serif",
                    }}>{currentType.label}</th>
                    {/* Actions column - ONLY for admin */}
                    {isAdmin && <th style={{ 
                      padding: '14px 20px', 
                      textAlign: 'center', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6f7887',
                      fontFamily: "'Poppins', sans-serif",
                    }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: index < leaderboardData.length - 1 ? '1px solid #eaedf2' : 'none',
                        background: user.id === currentUserId ? '#f8f7ff' : 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        if (user.id !== currentUserId) {
                          e.currentTarget.style.background = '#f9fafc';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (user.id !== currentUserId) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}>
                          {user.rank <= 3 ? (
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: user.rank === 1 ? '#f5e9d3' : user.rank === 2 ? '#e8e8e8' : '#ede0d4',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: user.rank === 1 ? '#b38b40' : user.rank === 2 ? '#6f7887' : '#8b6f4c',
                              fontWeight: '500',
                              fontSize: '10px',
                              fontFamily: "'Poppins', sans-serif",
                            }}>
                              {user.rank}
                            </div>
                          ) : (
                            <span style={{
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                              fontWeight: '400',
                              color: '#8f9aab',
                              fontFamily: "'Poppins', sans-serif",
                            }}>
                              #{user.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${currentType.color}10, ${currentType.color}20)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}>
                            {user.avatar && (user.avatar.includes('src/') || user.avatar.includes('.png')) ? (
                              <img 
                                src={user.avatar}
                                alt=""
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentNode.innerHTML = '<span style="font-size: 18px;">👤</span>';
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: '18px', color: currentType.color }}>{user.avatar}</span>
                            )}
                          </div>
                          <div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#2c3440',
                              marginBottom: '2px',
                              fontFamily: "'Poppins', sans-serif",
                            }}>
                              {user.displayName}
                              {user.id === currentUserId && !isAdmin && (
                                <span style={{
                                  marginLeft: '8px',
                                  fontSize: '10px',
                                  background: '#6b63b5',
                                  color: '#ffffff',
                                  padding: '2px 6px',
                                  borderRadius: '10px',
                                  fontWeight: '400',
                                  fontFamily: "'Poppins', sans-serif",
                                }}>
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Email column - ONLY for admin */}
                      {isAdmin && (
                        <td style={{ 
                          padding: '14px 20px', 
                          color: '#6f7887', 
                          fontSize: '13px',
                          fontFamily: "'Poppins', sans-serif",
                        }}>{user.email}</td>
                      )}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: '#f2f4f8',
                          color: '#5a6270',
                          fontFamily: "'Poppins', sans-serif",
                        }}>
                          Level {user.progress.level || 1}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: currentType.color,
                          fontFamily: "'Poppins', sans-serif",
                        }}>
                          {getValue(user).toLocaleString()}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: '#9aa5b5',
                          marginLeft: '4px',
                          fontFamily: "'Poppins', sans-serif",
                        }}>
                          {getUnit()}
                        </span>
                      </td>
                      {/* Admin Actions - ONLY for admin */}
                      {isAdmin && (
                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleResetStats(user.id)}
                              style={{
                                padding: '4px 10px',
                                background: '#faf6f0',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                color: '#8b6f4c',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: "'Poppins', sans-serif",
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#f5ede2'}
                              onMouseOut={(e) => e.currentTarget.style.background = '#faf6f0'}
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => handleRemoveUser(user.id)}
                              style={{
                                padding: '4px 10px',
                                background: '#faf2f2',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                color: '#b58a8a',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: "'Poppins', sans-serif",
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#f5e5e5'}
                              onMouseOut={(e) => e.currentTarget.style.background = '#faf2f2'}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* USER'S RANK - ONLY for students */}
          {!isAdmin && currentUserId && (
            <div style={{
              marginTop: '24px',
              padding: '16px 24px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ color: '#475569' }}>Your Current Rank</span>
              <span style={{ 
                color: '#c5c4cb', 
                fontWeight: '300',
                fontSize: '15px',
              }}>
                #{leaderboardData.findIndex(u => u.id === currentUserId) + 1 || 'Not in top 20'}
              </span>
            </div>
          )}

          {/* FOOTER STATS */}
          {leaderboardData.length > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              color: '#475569',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span>🏆 Top Score: {getValue(leaderboardData[0]).toLocaleString()} {getUnit()}</span>
                <span>📊 Average: {Math.round(leaderboardData.reduce((acc, u) => acc + getValue(u), 0) / leaderboardData.length).toLocaleString()} {getUnit()}</span>
              </div>
              <span style={{ color: '#7c6fd6', fontWeight: '400' }}>
                Updated just now
              </span>
            </div>
          )}

          {/* EMPTY STATE */}
          {leaderboardData.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#f8f7ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <span style={{ fontSize: '40px', color: '#7c6fd6' }}>🏆</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                No data yet
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                Players will appear here once they start playing
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboards;