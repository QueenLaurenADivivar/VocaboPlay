import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Global state for all data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState('disconnected');
  
  const [games, setGames] = useState([
    {
      id: 1,
      name: 'Flashcards',
      icon: '📇',
      description: 'Master vocabulary through spaced repetition and active recall.',
      totalWords: 30,
      timesPlayed: 0,
      avgScore: 0,
      color: '#5E4B8C',
      iconBg: '#F3F1F9',
      accentColor: '#5E4B8C',
      category: 'vocab',
      difficulty: 'beginner',
      timeEstimate: '5-10 min',
      lastUpdated: new Date().toISOString(),
      content: {
        words: []
      }
    },
    {
      id: 2,
      name: 'Match Game',
      icon: '🎯',
      description: 'Connect words with definitions in this fast-paced memory challenge.',
      totalPairs: 6,
      timesPlayed: 0,
      avgScore: 0,
      color: '#B83B5E',
      iconBg: '#FDF1F4',
      accentColor: '#B83B5E',
      category: 'vocab',
      difficulty: 'beginner',
      timeEstimate: '3-5 min',
      lastUpdated: new Date().toISOString(),
      content: {
        pairs: []
      }
    },
    {
      id: 3,
      name: 'Short Story',
      icon: '📖',
      description: 'Immerse yourself in narratives while learning vocabulary in context.',
      totalStories: 5,
      timesPlayed: 0,
      avgScore: 0,
      color: '#2F5D62',
      iconBg: '#EEF3F3',
      accentColor: '#2F5D62',
      category: 'reading',
      difficulty: 'intermediate',
      timeEstimate: '15-20 min',
      lastUpdated: new Date().toISOString(),
      content: {
        stories: []
      }
    },
    {
      id: 4,
      name: 'Quiz',
      icon: '❓',
      description: 'Test your knowledge with adaptive multiple choice questions.',
      totalQuestions: 10,
      timesPlayed: 0,
      avgScore: 0,
      color: '#1F4E5F',
      iconBg: '#E8EDF0',
      accentColor: '#1F4E5F',
      category: 'challenge',
      difficulty: 'intermediate',
      timeEstimate: '10-15 min',
      lastUpdated: new Date().toISOString(),
      content: {
        questions: []
      }
    },
    {
      id: 5,
      name: 'GuessWhat',
      icon: '🤔',
      description: 'Deduce the correct word from visual context clues and sentences.',
      totalQuestions: 10,
      timesPlayed: 0,
      avgScore: 0,
      color: '#C44545',
      iconBg: '#FCEEEE',
      accentColor: '#C44545',
      category: 'challenge',
      difficulty: 'advanced',
      timeEstimate: '8-12 min',
      lastUpdated: new Date().toISOString(),
      content: {
        questions: []
      }
    },
    {
      id: 6,
      name: 'Sentence Builder',
      icon: '📝',
      description: 'Construct grammatically correct sentences using vocabulary in context.',
      totalSentences: 5,
      timesPlayed: 0,
      avgScore: 0,
      color: '#3A6B6B',
      iconBg: '#EDF3F3',
      accentColor: '#3A6B6B',
      category: 'vocab',
      difficulty: 'beginner',
      timeEstimate: '6-10 min',
      lastUpdated: new Date().toISOString(),
      content: {
        sentences: []
      }
    },
  ]);

  const [words, setWords] = useState([
    // EASY LEVEL - 6 words
    {
      id: 1,
      word: 'Happy',
      pronunciation: '/ˈhæp.i/',
      definition: 'Feeling or showing pleasure or contentment.',
      example: 'She felt happy when she received the good news.',
      difficulty: 'Easy',
      timesStudied: 0,
      color: '#2E7D32',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['emotion', 'beginner']
    },
    {
      id: 2,
      word: 'Bright',
      pronunciation: '/braɪt/',
      definition: 'Giving out or reflecting a lot of light; shining.',
      example: 'The sun was bright in the clear blue sky.',
      difficulty: 'Easy',
      timesStudied: 0,
      color: '#2E7D32',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['description', 'beginner']
    },
    {
      id: 3,
      word: 'Quick',
      pronunciation: '/kwɪk/',
      definition: 'Moving fast or doing something in a short time.',
      example: 'The rabbit was very quick and escaped easily.',
      difficulty: 'Easy',
      timesStudied: 0,
      color: '#2E7D32',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['action', 'beginner']
    },
    {
      id: 4,
      word: 'Calm',
      pronunciation: '/kɑːm/',
      definition: 'Not showing or feeling nervousness, anger, or other strong emotions.',
      example: 'She remained calm during the emergency.',
      difficulty: 'Easy',
      timesStudied: 0,
      color: '#2E7D32',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['emotion', 'beginner']
    },
    {
      id: 5,
      word: 'Kind',
      pronunciation: '/kaɪnd/',
      definition: 'Having or showing a friendly, generous, and considerate nature.',
      example: 'He was kind to everyone he met.',
      difficulty: 'Easy',
      timesStudied: 0,
      color: '#2E7D32',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['personality', 'beginner']
    },
    {
      id: 6,
      word: 'Strong',
      pronunciation: '/strɒŋ/',
      definition: 'Having the power to move heavy weights or perform physically demanding tasks.',
      example: 'The athlete was strong enough to lift the heavy barbell.',
      difficulty: 'Easy',
      timesStudied: 0,
      color: '#2E7D32',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['description', 'beginner']
    },
    
    // MODERATE LEVEL - 6 words
    {
      id: 7,
      word: 'Ambitious',
      pronunciation: '/æmˈbɪʃ.əs/',
      definition: 'Having or showing a strong desire and determination to succeed.',
      example: 'She was ambitious and worked hard to achieve her goals.',
      difficulty: 'Medium',
      timesStudied: 0,
      color: '#B85C1A',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['personality', 'intermediate']
    },
    {
      id: 8,
      word: 'Cautious',
      pronunciation: '/ˈkɔː.ʃəs/',
      definition: 'Careful to avoid potential problems or dangers.',
      example: 'He was cautious when crossing the busy street.',
      difficulty: 'Medium',
      timesStudied: 0,
      color: '#B85C1A',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['personality', 'intermediate']
    },
    {
      id: 9,
      word: 'Diligent',
      pronunciation: '/ˈdɪl.ɪ.dʒənt/',
      definition: 'Having or showing care and conscientiousness in one\'s work or duties.',
      example: 'The diligent student completed all assignments on time.',
      difficulty: 'Medium',
      timesStudied: 0,
      color: '#B85C1A',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['personality', 'intermediate']
    },
    {
      id: 10,
      word: 'Generous',
      pronunciation: '/ˈdʒen.ər.əs/',
      definition: 'Showing a readiness to give more than is necessary or expected.',
      example: 'Her generous donation helped many families in need.',
      difficulty: 'Medium',
      timesStudied: 0,
      color: '#B85C1A',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['personality', 'intermediate']
    },
    {
      id: 11,
      word: 'Persistent',
      pronunciation: '/pəˈsɪs.tənt/',
      definition: 'Continuing firmly in a course of action despite difficulty or opposition.',
      example: 'His persistent efforts finally led to success.',
      difficulty: 'Medium',
      timesStudied: 0,
      color: '#B85C1A',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['personality', 'intermediate']
    },
    {
      id: 12,
      word: 'Vibrant',
      pronunciation: '/ˈvaɪ.brənt/',
      definition: 'Full of energy and enthusiasm; bright and striking.',
      example: 'The city had a vibrant cultural scene.',
      difficulty: 'Medium',
      timesStudied: 0,
      color: '#B85C1A',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['description', 'intermediate']
    },
    
    // ADVANCED LEVEL - 6 words
    {
      id: 13,
      word: 'Ephemeral',
      pronunciation: '/ɪˈfem.ər.əl/',
      definition: 'Lasting for a very short time; temporary.',
      example: 'The beauty of cherry blossoms is ephemeral.',
      difficulty: 'Hard',
      timesStudied: 0,
      color: '#A93226',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['abstract', 'advanced']
    },
    {
      id: 14,
      word: 'Ubiquitous',
      pronunciation: '/juːˈbɪk.wɪ.təs/',
      definition: 'Present, appearing, or found everywhere.',
      example: 'Smartphones have become ubiquitous in modern society.',
      difficulty: 'Hard',
      timesStudied: 0,
      color: '#A93226',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['abstract', 'advanced']
    },
    {
      id: 15,
      word: 'Enigmatic',
      pronunciation: '/ˌen.ɪɡˈmæt.ɪk/',
      definition: 'Difficult to interpret or understand; mysterious.',
      example: 'The Mona Lisa\'s enigmatic smile has fascinated people for centuries.',
      difficulty: 'Hard',
      timesStudied: 0,
      color: '#A93226',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['abstract', 'advanced']
    },
    {
      id: 16,
      word: 'Meticulous',
      pronunciation: '/məˈtɪk.jə.ləs/',
      definition: 'Showing great attention to detail; very careful and precise.',
      example: 'The scientist was meticulous in recording every observation.',
      difficulty: 'Hard',
      timesStudied: 0,
      color: '#A93226',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['personality', 'advanced']
    },
    {
      id: 17,
      word: 'Eloquent',
      pronunciation: '/ˈel.ə.kwənt/',
      definition: 'Fluent or persuasive in speaking or writing.',
      example: 'Her eloquent speech moved the entire audience to tears.',
      difficulty: 'Hard',
      timesStudied: 0,
      color: '#A93226',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['communication', 'advanced']
    },
    {
      id: 18,
      word: 'Resilient',
      pronunciation: '/rɪˈzɪl.i.ənt/',
      definition: 'Able to recover quickly from difficulties; tough and adaptable.',
      example: 'The community proved resilient after the natural disaster.',
      difficulty: 'Hard',
      timesStudied: 0,
      color: '#A93226',
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      categories: ['personality', 'advanced']
    },
  ]);

  // Simulate fetching students from Firebase
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setFirebaseStatus('connected');
          setLoading(false);
        }, 1000);
        
        setStudents([
          {
            id: 'student1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            grade: 'A',
            avgScore: 85,
            gamesPlayed: 24,
            joinDate: '2024-01-15',
            lastActive: new Date().toISOString(),
            progress: {
              wordsLearned: 45,
              streak: 7,
              level: 5
            }
          },
          {
            id: 'student2',
            name: 'Emma Wilson',
            email: 'emma.w@example.com',
            grade: 'A-',
            avgScore: 92,
            gamesPlayed: 31,
            joinDate: '2024-01-20',
            lastActive: new Date().toISOString(),
            progress: {
              wordsLearned: 52,
              streak: 12,
              level: 6
            }
          },
          {
            id: 'student3',
            name: 'Michael Chen',
            email: 'michael.c@example.com',
            grade: 'B+',
            avgScore: 78,
            gamesPlayed: 18,
            joinDate: '2024-02-01',
            lastActive: new Date().toISOString(),
            progress: {
              wordsLearned: 32,
              streak: 4,
              level: 3
            }
          }
        ]);
      } catch (error) {
        console.error('Error fetching students:', error);
        setFirebaseStatus('error');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  // ============= UTILITY FUNCTIONS =============
  const exportToJSON = (data, filename) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importFromJSON = (setterFunction) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setterFunction(data);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing file. Please check the format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ============= OVERVIEW COMPONENT =============
  const Overview = () => {
    const totalStudents = students.length;
    const totalGames = games.length;
    const totalWords = words.length;
    const totalPlayed = games.reduce((acc, game) => acc + (game.timesPlayed || 0), 0);
    const avgScore = students.length > 0 
      ? Math.round(students.reduce((acc, student) => acc + (student.avgScore || 0), 0) / students.length) 
      : 0;

    const stats = [
      { label: 'Total Students', value: totalStudents.toString(), icon: '▣', color: '#7c6fd6', bg: '#f0edff', change: '+3 this month' },
      { label: 'Active Words', value: totalWords.toString(), icon: '☰', color: '#2E7D32', bg: '#e8f5e9', change: '+18 total' },
      { label: 'Total Games', value: totalGames.toString(), icon: '◉', color: '#B85C1A', bg: '#fff4e5', change: '6 active' },
      { label: 'Avg Score', value: avgScore + '%', icon: '▦', color: '#7c6fd6', bg: '#f0edff', change: 'Class average' },
    ];

    return (
      <div>
        <div style={{
          marginBottom: '32px',
          borderBottom: '1px solid #eaeef2',
          paddingBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '600', 
              color: '#1a2634', 
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '-0.3px',
            }}>
              Admin Overview
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6b7a8d',
              margin: '0',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '300',
            }}>
              Monitor your vocabulary learning platform
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid #e6eaf0',
              fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = stat.color + '40';
              e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}15`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e6eaf0';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: '600',
                  color: stat.color,
                }}>
                  {stat.icon}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#7c8b9c',
                  background: '#f8fafc',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  fontFamily: "'Poppins', sans-serif",
                  border: '1px solid #e2e8f0',
                }}>
                  {stat.change}
                </span>
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '600', 
                color: '#1a2634', 
                marginBottom: '4px', 
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#7c8b9c', 
                fontWeight: '500', 
                fontFamily: "'Poppins', sans-serif" 
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px',
        }}>
          {/* Recent Activity */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e6eaf0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a2634',
                margin: '0',
                fontFamily: "'Poppins', sans-serif",
              }}>
                Recent Activity
              </h3>
            </div>
            
            {students.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {students.slice(0, 3).map((student, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                    }}>
                      {student.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a2634' }}>
                        {student.name} joined
                      </div>
                      <div style={{ fontSize: '11px', color: '#7c8b9c' }}>
                        {student.joinDate}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      background: '#e8f5e9',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: '400',
                      color: '#2e7d32',
                    }}>
                      New
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '32px 16px',
                textAlign: 'center',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>👋</span>
                <p style={{ fontSize: '14px', color: '#7c8b9c', margin: 0 }}>
                  No recent activity
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '23px',
            border: '1px solid #e6eaf0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a2634',
                margin: '0',
                fontFamily: "'Poppins', sans-serif",
              }}>
                Platform Stats
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: '500', color: '#2E7D32', marginBottom: '4px' }}>
                  {words.filter(w => w.difficulty === 'Easy').length}
                </div>
                <div style={{ fontSize: '12px', color: '#7c8b9c' }}>Easy Words</div>
              </div>
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: '500', color: '#B85C1A', marginBottom: '4px' }}>
                  {words.filter(w => w.difficulty === 'Medium').length}
                </div>
                <div style={{ fontSize: '12px', color: '#7c8b9c' }}>Medium Words</div>
              </div>
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: '500', color: '#A93226', marginBottom: '4px' }}>
                  {words.filter(w => w.difficulty === 'Hard').length}
                </div>
                <div style={{ fontSize: '12px', color: '#7c8b9c' }}>Hard Words</div>
              </div>
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: '500', color: '#7c6fd6', marginBottom: '4px' }}>
                  {totalPlayed}
                </div>
                <div style={{ fontSize: '12px', color: '#7c8b9c' }}>Total Plays</div>
              </div>
            </div>

            
            
          </div>
        </div>

        {/* Students Message */}
        <div style={{
          background: '#ffffff',
          padding: students.length > 0 ? '24px' : '64px 32px',
          borderRadius: '20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          textAlign: 'center',
          border: '1px solid #e6eaf0',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
          }}>
            {students.length > 0 ? '' : '👋'}
          </div>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '500', 
            color: '#1a2634',
            marginBottom: '8px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            {students.length > 0 ? `${students.length} Active Student${students.length > 1 ? 's' : ''}` : 'No Students Yet'}
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#7c8b9c',
            maxWidth: '480px',
            margin: '0 auto',
            fontFamily: "'Poppins', sans-serif",
            lineHeight: '1.6',
          }}>
            {students.length > 0 
              ? 'Students are actively learning vocabulary. Check the Students tab for detailed progress.'
              : 'No students have signed up yet. Students will appear here once they create an account and log in.'}
          </p>
          {students.length > 0 && (
            <button
              onClick={() => setActiveMenu('Students')}
              style={{
                marginTop: '20px',
                padding: '10px 24px',
                background: '#5c6ac4',
                color: 'white',
                border: 'none',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#4a58b0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#5c6ac4'}
            >
              View All Students 
            </button>
          )}
        </div>
      </div>
    );
  };

  // ============= STUDENTS LIST COMPONENT WITH FULL CRUD =============
const StudentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.email) {
      const studentToAdd = {
        ...newStudent,
        id: `student${students.length + 1}`,
        avgScore: 0,
        gamesPlayed: 0,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString(),
        progress: {
          wordsLearned: 0,
          streak: 0,
          level: 1
        }
      };
      setStudents([...students, studentToAdd]);
      setIsAdding(false);
      setNewStudent({ name: '', email: '' });
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setEditForm({
      name: student.name,
      email: student.email
    });
    setIsEditing(true);
  };

  const handleUpdateStudent = () => {
    setStudents(students.map(s => 
      s.id === selectedStudent.id 
        ? { ...s, ...editForm }
        : s
    ));
    setIsEditing(false);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to remove this student? This action cannot be undone.')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleViewProgress = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '32px',
        borderBottom: '1px solid #eaeef2',
        paddingBottom: '20px',
      }}>
        <div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#1a2634', 
            marginBottom: '6px',
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.3px',
          }}>
            Student Management
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#6b7a8d',
            margin: '0',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '300',
          }}>
            Manage and monitor student accounts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ 
            fontSize: '13px', 
            color: '#7c8b9c', 
            fontFamily: "'Poppins', sans-serif",
            background: '#f8fafc',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid #e2e8f0',
          }}>
            Total: {students.length} Students
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f8fafc',
          border: '1px solid #e6eaf0',
          borderRadius: '12px',
          padding: '4px 4px 4px 16px',
          flex: 1,
          maxWidth: '400px',
          transition: 'all 0.2s ease',
        }}>
          <span style={{ color: '#7c8b9c', fontSize: '18px', marginRight: '8px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 0',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontFamily: "'Poppins', sans-serif",
              outline: 'none',
              color: '#1a2634',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
        <span style={{
          fontSize: '13px',
          color: '#7c8b9c',
          background: '#f8fafc',
          padding: '8px 16px',
          borderRadius: '100px',
          border: '1px solid #e2e8f0',
        }}>
          {filteredStudents.length} of {students.length} shown
        </span>
      </div>

      {loading ? (
        <div style={{
          background: '#ffffff',
          padding: '64px 32px',
          borderRadius: '20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          textAlign: 'center',
          border: '1px solid #e6eaf0',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1a2634', marginBottom: '8px' }}>
            Loading Students...
          </h2>
        </div>
      ) : students.length === 0 ? (
        <div style={{
          background: '#ffffff',
          padding: '64px 32px',
          borderRadius: '20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          textAlign: 'center',
          border: '1px solid #e6eaf0',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍🎓</div>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#1a2634', 
            marginBottom: '8px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            No Students Yet
          </h2>
          <p style={{ 
            fontSize: '15px', 
            color: '#7c8b9c',
            maxWidth: '480px',
            margin: '0 auto 16px',
            fontFamily: "'Poppins', sans-serif",
            lineHeight: '1.6',
          }}>
            No students have signed up yet. Add a student manually or wait for them to create an account.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            style={{
              padding: '12px 28px',
              background: '#5c6ac4',
              color: 'white',
              border: 'none',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Add First Student
          </button>
        </div>
      ) : (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          border: '1px solid #e6eaf0',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              fontFamily: "'Poppins', sans-serif",
              minWidth: '900px',
            }}>
              <thead style={{ 
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <tr>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Student</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Email</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Avg Score</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Games</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Words</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Streak</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Join Date</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} style={{ 
                    borderBottom: '1px solid #e2e8f0', 
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a2634' }}>
                            {student.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Level {student.progress?.level || 1}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7a8d' }}>{student.email}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: student.avgScore >= 80 ? '#2e7d32' : '#ed6c02',
                      }}>
                        {student.avgScore}%
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7a8d' }}>{student.gamesPlayed}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7a8d' }}>{student.progress?.wordsLearned || 0}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '400',
                        background: student.progress?.streak > 0 ? '#e8f5e9' : '#f1f5f9',
                        color: student.progress?.streak > 0 ? '#2e7d32' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        width: 'fit-content',
                      }}>
                        🔥 {student.progress?.streak || 0}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7a8d' }}>{student.joinDate}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <button
                        onClick={() => handleViewProgress(student)}
                        style={{
                          padding: '6px 12px',
                          background: '#e8f5e9',
                          border: 'none',
                          borderRadius: '100px',
                          fontSize: '11px',
                          fontWeight: '400',
                          color: '#2e7d32',
                          cursor: 'pointer',
                          marginRight: '8px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => e.target.style.background = '#c8e6c9'}
                        onMouseOut={(e) => e.target.style.background = '#e8f5e9'}
                      >
                        Progress
                      </button>
                      <button
                        onClick={() => handleEditStudent(student)}
                        style={{
                          padding: '6px 12px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '100px',
                          fontSize: '11px',
                          fontWeight: '400',
                          cursor: 'pointer',
                          marginRight: '8px',
                          color: '#475569',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#f1f5f9';
                          e.target.style.borderColor = '#cbd5e1';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#f8fafc';
                          e.target.style.borderColor = '#e2e8f0';
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#fef2f2',
                          color: '#b91c1c',
                          border: '1px solid #fee2e2',
                          borderRadius: '100px',
                          fontSize: '11px',
                          fontWeight: '400',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#fee2e2';
                          e.target.style.borderColor = '#fecaca';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#fef2f2';
                          e.target.style.borderColor = '#fee2e2';
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAdding && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: '400', marginBottom: '24px', color: '#1a2634' }}>
              Add New Student
            </h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                placeholder="e.g., John Smith"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontFamily: "'Poppins', sans-serif",
                  outline: 'none',
                }}
                autoFocus
              />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                placeholder="student@example.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontFamily: "'Poppins', sans-serif",
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsAdding(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f8fafc',
                  color: '#7c8b9c',
                  border: '1px solid #e2e8f0',
                  borderRadius: '100px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#5c6ac4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 4px 12px rgba(92, 106, 196, 0.2)',
                }}
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: '#1a2634' }}>
              Edit Student
            </h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontFamily: "'Poppins', sans-serif",
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontFamily: "'Poppins', sans-serif",
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f8fafc',
                  color: '#7c8b9c',
                  border: '1px solid #e2e8f0',
                  borderRadius: '100px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStudent}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#5c6ac4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 4px 12px rgba(92, 106, 196, 0.2)',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Progress Modal */}
      {selectedStudent && !isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '560px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: '600',
                }}>
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1a2634', marginBottom: '4px' }}>
                    {selectedStudent.name}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    {selectedStudent.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a2634', marginBottom: '16px' }}>
                Progress Overview
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>Level</div>
                  <div style={{ fontSize: '28px', fontWeight: '600', color: '#1a2634' }}>{selectedStudent.progress?.level || 1}</div>
                </div>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>Words Learned</div>
                  <div style={{ fontSize: '28px', fontWeight: '600', color: '#1a2634' }}>{selectedStudent.progress?.wordsLearned || 0}</div>
                </div>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>Games Played</div>
                  <div style={{ fontSize: '28px', fontWeight: '600', color: '#1a2634' }}>{selectedStudent.gamesPlayed}</div>
                </div>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>Current Streak</div>
                  <div style={{ fontSize: '28px', fontWeight: '600', color: '#1a2634' }}>{selectedStudent.progress?.streak || 0} 🔥</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a2634', marginBottom: '12px' }}>
                Achievement Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                  <span style={{ color: '#475569' }}>Average Score</span>
                  <span style={{ fontWeight: '600', color: selectedStudent.avgScore >= 80 ? '#2e7d32' : '#ed6c02' }}>
                    {selectedStudent.avgScore}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                  <span style={{ color: '#475569' }}>Member Since</span>
                  <span style={{ fontWeight: '600', color: '#1a2634' }}>{selectedStudent.joinDate}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditForm({
                    name: selectedStudent.name,
                    email: selectedStudent.email
                  });
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f8fafc',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '100px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#5c6ac4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  // ============= GAME MANAGEMENT COMPONENT WITH FULL CRUD =============
  const GameManagement = () => {
    const [editingGame, setEditingGame] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editGameForm, setEditGameForm] = useState({ 
      description: '', 
      totalItems: 0,
      category: 'vocab',
      difficulty: 'beginner',
      timeEstimate: '5-10 min'
    });
    const [newGame, setNewGame] = useState({
      name: '',
      icon: '🎮',
      description: '',
      totalWords: 0,
      totalPairs: 0,
      totalStories: 0,
      totalQuestions: 0,
      totalSentences: 0,
      category: 'vocab',
      difficulty: 'beginner',
      timeEstimate: '5-10 min'
    });

    const getGameStats = (game) => {
      if (game.name === 'Flashcards') return `${game.totalWords} words`;
      if (game.name === 'Match Game') return `${game.totalPairs} pairs`;
      if (game.name === 'Short Story') return `${game.totalStories} stories`;
      if (game.name === 'Quiz') return `${game.totalQuestions} questions`;
      if (game.name === 'GuessWhat') return `${game.totalQuestions} questions`;
      if (game.name === 'Sentence Builder') return `${game.totalSentences} sentences`;
      return '0 items';
    };

    const getDifficultyColor = (difficulty) => {
      switch(difficulty) {
        case 'beginner': return '#2e7d32';
        case 'intermediate': return '#b85c1a';
        case 'advanced': return '#a93226';
        default: return '#7c8b9c';
      }
    };

    const getCategoryColor = (category) => {
      switch(category) {
        case 'vocab': return '#5E4B8C';
        case 'reading': return '#2F5D62';
        case 'challenge': return '#B83B5E';
        default: return '#5E4B8C';
      }
    };

    const getCategoryBg = (category) => {
      switch(category) {
        case 'vocab': return '#F3F1F9';
        case 'reading': return '#EEF3F3';
        case 'challenge': return '#FDF1F4';
        default: return '#F3F1F9';
      }
    };

    const handleEditGame = (game) => {
      setEditingGame(game.id);
      setEditGameForm({
        description: game.description,
        totalItems: game.totalWords || game.totalPairs || game.totalStories || game.totalQuestions || game.totalSentences || 0,
        category: game.category || 'vocab',
        difficulty: game.difficulty || 'beginner',
        timeEstimate: game.timeEstimate || '5-10 min'
      });
    };

    const handleUpdateGame = () => {
      setGames(games.map(game => {
        if (game.id === editingGame) {
          const updatedGame = { 
            ...game, 
            description: editGameForm.description,
            category: editGameForm.category,
            difficulty: editGameForm.difficulty,
            timeEstimate: editGameForm.timeEstimate,
            color: getCategoryColor(editGameForm.category),
            iconBg: getCategoryBg(editGameForm.category),
            accentColor: getCategoryColor(editGameForm.category)
          };
          
          if (game.name === 'Flashcards') updatedGame.totalWords = parseInt(editGameForm.totalItems) || 0;
          if (game.name === 'Match Game') updatedGame.totalPairs = parseInt(editGameForm.totalItems) || 0;
          if (game.name === 'Short Story') updatedGame.totalStories = parseInt(editGameForm.totalItems) || 0;
          if (game.name === 'Quiz') updatedGame.totalQuestions = parseInt(editGameForm.totalItems) || 0;
          if (game.name === 'GuessWhat') updatedGame.totalQuestions = parseInt(editGameForm.totalItems) || 0;
          if (game.name === 'Sentence Builder') updatedGame.totalSentences = parseInt(editGameForm.totalItems) || 0;
          
          updatedGame.lastUpdated = new Date().toISOString();
          return updatedGame;
        }
        return game;
      }));
      setEditingGame(null);
    };

    const handleAddGame = () => {
      if (!newGame.name || !newGame.description) {
        alert('Please fill in all required fields.');
        return;
      }

      const newId = games.length + 1;
      const color = getCategoryColor(newGame.category);
      const iconBg = getCategoryBg(newGame.category);

      const gameToAdd = {
        id: newId,
        name: newGame.name,
        icon: newGame.icon,
        description: newGame.description,
        totalWords: newGame.totalWords,
        totalPairs: newGame.totalPairs,
        totalStories: newGame.totalStories,
        totalQuestions: newGame.totalQuestions,
        totalSentences: newGame.totalSentences,
        timesPlayed: 0,
        avgScore: 0,
        color: color,
        iconBg: iconBg,
        accentColor: color,
        category: newGame.category,
        difficulty: newGame.difficulty,
        timeEstimate: newGame.timeEstimate,
        lastUpdated: new Date().toISOString(),
        content: {}
      };

      setGames([...games, gameToAdd]);
      setIsAdding(false);
      setNewGame({
        name: '',
        icon: '🎮',
        description: '',
        totalWords: 0,
        totalPairs: 0,
        totalStories: 0,
        totalQuestions: 0,
        totalSentences: 0,
        category: 'vocab',
        difficulty: 'beginner',
        timeEstimate: '5-10 min'
      });
    };

    const handleDeleteGame = (id) => {
      if (window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
        setGames(games.filter(g => g.id !== id));
      }
    };

    const handleIncrementPlayed = (gameId) => {
      setGames(games.map(game => 
        game.id === gameId 
          ? { ...game, timesPlayed: (game.timesPlayed || 0) + 1 }
          : game
      ));
    };

    const handleResetStats = (gameId) => {
      if (window.confirm('Reset all play stats for this game?')) {
        setGames(games.map(game => 
          game.id === gameId 
            ? { ...game, timesPlayed: 0, avgScore: 0 }
            : game
        ));
      }
    };

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          borderBottom: '1px solid #eaeef2',
          paddingBottom: '20px',
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '600', 
              color: '#1a2634', 
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '-0.3px',
            }}>
              Game Management
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6b7a8d',
              margin: '0',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '300',
            }}>
              Manage and configure all learning games
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ 
              fontSize: '13px', 
              color: '#7c8b9c', 
              fontFamily: "'Poppins', sans-serif",
              background: '#f8fafc',
              padding: '8px 16px',
              borderRadius: '100px',
              border: '1px solid #e2e8f0',
            }}>
              Total Games: {games.length}
            </span>
            <button
              onClick={() => setIsAdding(true)}
              style={{
                padding: '10px 20px',
                background: '#5c6ac4',
                color: 'white',
                border: 'none',
                borderRadius: '90px',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(92, 106, 196, 0.2)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#4a58b0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#5c6ac4';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '18px' }}>+</span>
              Add Game
            </button>
           
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}>
          {games.map((game) => (
            <div key={game.id} style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid #e6eaf0',
              transition: 'all 0.2s ease',
              fontFamily: "'Poppins', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = game.accentColor + '40';
              e.currentTarget.style.boxShadow = `0 8px 24px ${game.accentColor}15`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e6eaf0';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: game.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                }}>
                  {game.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: '#1a2634', 
                      margin: '0',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {game.name}
                    </h3>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '300',
                      color: '#2e7d32',
                      background: '#e8f5e9',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontFamily: "'Poppins', sans-serif",
                      whiteSpace: 'nowrap',
                    }}>
                      Active
                    </span>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7a8d',
                    fontFamily: "'Poppins', sans-serif",
                    margin: '0 0 12px 0',
                    lineHeight: '1.6',
                  }}>
                    {game.description}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '300',
                      color: game.accentColor,
                      background: `${game.accentColor}15`,
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {getGameStats(game)}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '300',
                      color: getDifficultyColor(game.difficulty),
                      background: `${getDifficultyColor(game.difficulty)}15`,
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontFamily: "'Poppins', sans-serif",
                      textTransform: 'capitalize',
                    }}>
                      {game.difficulty}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '300',
                      color: '#475569',
                      background: '#f1f5f9',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontFamily: "'Poppins', sans-serif",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      ⏱️ {game.timeEstimate}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ 
                marginBottom: '20px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#7c8b9c', fontFamily: "'Poppins', sans-serif" }}>
                    <span style={{ fontSize: '16px', marginRight: '4px' }}></span> Times Played:
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '300', color: '#1a2634', fontFamily: "'Poppins', sans-serif" }}>
                    {game.timesPlayed.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#7c8b9c', fontFamily: "'Poppins', sans-serif" }}>
                    <span style={{ fontSize: '16px', marginRight: '4px' }}></span> Average Score:
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '300', 
                    color: game.avgScore >= 70 ? '#2e7d32' : '#ed6c02', 
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {game.avgScore > 0 ? `${game.avgScore}%` : 'No data'}
                  </span>
                </div>
                <div style={{ 
                  marginTop: '12px', 
                  paddingTop: '12px', 
                  borderTop: '1px solid #e2e8f0',
                  fontSize: '11px',
                  color: '#94a3b8',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <span>Last updated: {new Date(game.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEditGame(game)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#5c6ac4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(92, 106, 196, 0.2)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#4a58b0';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#5c6ac4';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Edit Game
                </button>
                <button
                  onClick={() => handleIncrementPlayed(game.id)}
                  style={{
                    padding: '12px 16px',
                    background: '#f8fafc',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
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
                  +1 Play
                </button>
                <button
                  onClick={() => handleDeleteGame(game.id)}
                  style={{
                    padding: '12px 16px',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fee2e2',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.borderColor = '#fecaca';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#fef2f2';
                    e.currentTarget.style.borderColor = '#fee2e2';
                  }}
                >
                  Delete
                </button>
              </div>
              <div style={{ marginTop: '8px' }}>
                <button
                  onClick={() => handleResetStats(game.id)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'transparent',
                    color: '#7c8b9c',
                    border: '1px dashed #e2e8f0',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  Reset Stats
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Game Modal */}
        {editingGame && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              fontFamily: "'Poppins', sans-serif",
            }}>
              <h2 style={{ 
                fontSize: '22px', 
                fontWeight: '600', 
                marginBottom: '24px', 
                color: '#1a2634',
              }}>
                Edit Game Settings
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                  Description
                </label>
                <textarea
                  value={editGameForm.description}
                  onChange={(e) => setEditGameForm({...editGameForm, description: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                  Category
                </label>
                <select
                  value={editGameForm.category}
                  onChange={(e) => setEditGameForm({...editGameForm, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <option value="vocab">Vocabulary</option>
                  <option value="reading">Reading</option>
                  <option value="challenge">Challenge</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                  Difficulty
                </label>
                <select
                  value={editGameForm.difficulty}
                  onChange={(e) => setEditGameForm({...editGameForm, difficulty: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                  Time Estimate
                </label>
                <input
                  type="text"
                  value={editGameForm.timeEstimate}
                  onChange={(e) => setEditGameForm({...editGameForm, timeEstimate: e.target.value})}
                  placeholder="e.g., 5-10 min"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '14px', fontWeight: '400', display: 'block', marginBottom: '6px', color: '#475569' }}>
                  Total Items
                </label>
                <input
                  type="number"
                  value={editGameForm.totalItems}
                  onChange={(e) => setEditGameForm({...editGameForm, totalItems: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setEditingGame(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f8fafc',
                    color: '#7c8b9c',
                    border: '1px solid #e2e8f0',
                    borderRadius: '100px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateGame}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#5c6ac4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '100px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(92, 106, 196, 0.2)',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Game Modal */}
        {isAdding && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '560px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              fontFamily: "'Poppins', sans-serif",
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '400', 
                marginBottom: '24px', 
                color: '#1a2634',
              }}>
                Add New Game
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                  Game Name *
                </label>
                <input
                  type="text"
                  value={newGame.name}
                  onChange={(e) => setNewGame({...newGame, name: e.target.value})}
                  placeholder="e.g., Vocabulary Race"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                  Description *
                </label>
                <textarea
                  value={newGame.description}
                  onChange={(e) => setNewGame({...newGame, description: e.target.value})}
                  rows="3"
                  placeholder="Describe how the game works..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                  Icon
                </label>
                <select
                  value={newGame.icon}
                  onChange={(e) => setNewGame({...newGame, icon: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <option value="🎮">🎮 Game</option>
                  <option value="📇">📇 Flashcards</option>
                  <option value="🎯">🎯 Match</option>
                  <option value="📖">📖 Story</option>
                  <option value="❓">❓ Quiz</option>
                  <option value="🤔">🤔 GuessWhat</option>
                  <option value="📝">📝 Sentence Builder</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                    Category
                  </label>
                  <select
                    value={newGame.category}
                    onChange={(e) => setNewGame({...newGame, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                    }}
                  >
                    <option value="vocab">Vocabulary</option>
                    <option value="reading">Reading</option>
                    <option value="challenge">Challenge</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                    Difficulty
                  </label>
                  <select
                    value={newGame.difficulty}
                    onChange={(e) => setNewGame({...newGame, difficulty: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                    }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>
                  Time Estimate
                </label>
                <input
                  type="text"
                  value={newGame.timeEstimate}
                  onChange={(e) => setNewGame({...newGame, timeEstimate: e.target.value})}
                  placeholder="e.g., 5-10 min"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '12px', color: '#475569' }}>
                  Game Content Stats (Optional)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Total Words</label>
                    <input
                      type="number"
                      value={newGame.totalWords}
                      onChange={(e) => setNewGame({...newGame, totalWords: parseInt(e.target.value) || 0})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Total Pairs</label>
                    <input
                      type="number"
                      value={newGame.totalPairs}
                      onChange={(e) => setNewGame({...newGame, totalPairs: parseInt(e.target.value) || 0})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Total Stories</label>
                    <input
                      type="number"
                      value={newGame.totalStories}
                      onChange={(e) => setNewGame({...newGame, totalStories: parseInt(e.target.value) || 0})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Total Questions</label>
                    <input
                      type="number"
                      value={newGame.totalQuestions}
                      onChange={(e) => setNewGame({...newGame, totalQuestions: parseInt(e.target.value) || 0})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Total Sentences</label>
                    <input
                      type="number"
                      value={newGame.totalSentences}
                      onChange={(e) => setNewGame({...newGame, totalSentences: parseInt(e.target.value) || 0})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setIsAdding(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f8fafc',
                    color: '#7c8b9c',
                    border: '1px solid #e2e8f0',
                    borderRadius: '100px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGame}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: newGame.name && newGame.description ? '#5c6ac4' : '#e2e8f0',
                    color: newGame.name && newGame.description ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: newGame.name && newGame.description ? 'pointer' : 'not-allowed',
                    boxShadow: newGame.name && newGame.description ? '0 4px 12px rgba(92, 106, 196, 0.2)' : 'none',
                  }}
                >
                  Add Game
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============= WORD MANAGEMENT COMPONENT WITH FULL CRUD =============
  const WordManagement = () => {
    const [showAddWord, setShowAddWord] = useState(false);
    const [editingWord, setEditingWord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [newWord, setNewWord] = useState({ 
      word: '', 
      definition: '', 
      difficulty: 'Easy', 
      example: '', 
      pronunciation: '',
      categories: []
    });

    const filteredWords = words.filter(word => {
      const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          word.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = filterDifficulty === 'all' || word.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    });

    const handleAddWord = () => {
      if (newWord.word && newWord.definition) {
        const wordToAdd = {
          ...newWord,
          id: words.length + 1,
          timesStudied: 0,
          color: newWord.difficulty === 'Easy' ? '#4CAF50' : 
                 newWord.difficulty === 'Medium' ? '#FF9800' : '#F44336',
          dateAdded: new Date().toISOString(),
          lastReviewed: null,
          categories: newWord.categories.length ? newWord.categories : 
                     [newWord.difficulty === 'Easy' ? 'beginner' : 
                      newWord.difficulty === 'Medium' ? 'intermediate' : 'advanced']
        };
        setWords([...words, wordToAdd]);
        setNewWord({ word: '', definition: '', difficulty: 'Easy', example: '', pronunciation: '', categories: [] });
        setShowAddWord(false);
      }
    };

    const handleEditWord = (word) => {
      setEditingWord(word.id);
      setNewWord({
        word: word.word,
        pronunciation: word.pronunciation || '',
        definition: word.definition,
        example: word.example || '',
        difficulty: word.difficulty,
        categories: word.categories || []
      });
      setShowAddWord(true);
    };

    const handleUpdateWord = () => {
      if (newWord.word && newWord.definition) {
        setWords(words.map(w => 
          w.id === editingWord 
            ? { 
                ...w, 
                ...newWord,
                color: newWord.difficulty === 'Easy' ? '#4CAF50' : 
                       newWord.difficulty === 'Medium' ? '#FF9800' : '#F44336',
                lastReviewed: new Date().toISOString()
              }
            : w
        ));
        setEditingWord(null);
        setNewWord({ word: '', definition: '', difficulty: 'Easy', example: '', pronunciation: '', categories: [] });
        setShowAddWord(false);
      }
    };

    const handleDeleteWord = (id) => {
      if (window.confirm('Are you sure you want to delete this word?')) {
        setWords(words.filter(w => w.id !== id));
      }
    };

    const handleIncrementStudied = (id) => {
      setWords(words.map(w => 
        w.id === id 
          ? { ...w, timesStudied: (w.timesStudied || 0) + 1, lastReviewed: new Date().toISOString() }
          : w
      ));
    };

    const handleBulkImport = () => {
      const input = document.createElement('textarea');
      input.placeholder = 'Paste words in format: word,definition,difficulty (Easy/Medium/Hard),example (optional)';
      input.style.width = '100%';
      input.style.height = '200px';
      input.style.padding = '16px';
      input.style.border = '1px solid #e2e8f0';
      input.style.borderRadius = '12px';
      input.style.fontFamily = 'monospace';
      input.style.marginBottom = '16px';

      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.background = 'white';
      modal.style.padding = '32px';
      modal.style.borderRadius = '24px';
      modal.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
      modal.style.zIndex = '2000';
      modal.style.width = '90%';
      modal.style.maxWidth = '600px';

      const title = document.createElement('h3');
      title.textContent = 'Bulk Import Words';
      title.style.fontSize = '20px';
      title.style.fontWeight = '600';
      title.style.marginBottom = '20px';
      title.style.color = '#1a2634';

      const importBtn = document.createElement('button');
      importBtn.textContent = 'Import';
      importBtn.style.padding = '12px 24px';
      importBtn.style.background = '#5c6ac4';
      importBtn.style.color = 'white';
      importBtn.style.border = 'none';
      importBtn.style.borderRadius = '100px';
      importBtn.style.fontSize = '14px';
      importBtn.style.fontWeight = '600';
      importBtn.style.cursor = 'pointer';
      importBtn.style.marginRight = '12px';

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.padding = '12px 24px';
      cancelBtn.style.background = '#f8fafc';
      cancelBtn.style.color = '#475569';
      cancelBtn.style.border = '1px solid #e2e8f0';
      cancelBtn.style.borderRadius = '100px';
      cancelBtn.style.fontSize = '14px';
      cancelBtn.style.fontWeight = '600';
      cancelBtn.style.cursor = 'pointer';

      modal.appendChild(title);
      modal.appendChild(input);
      modal.appendChild(importBtn);
      modal.appendChild(cancelBtn);
      document.body.appendChild(modal);

      importBtn.onclick = () => {
        const lines = input.value.trim().split('\n');
        const newWords = [];
        let nextId = words.length + 1;

        lines.forEach(line => {
          const parts = line.split(',').map(p => p.trim());
          if (parts.length >= 2) {
            const word = parts[0];
            const definition = parts[1];
            const difficulty = parts[2] || 'Easy';
            const example = parts[3] || `"${word} is used in context."`;
            
            newWords.push({
              id: nextId++,
              word,
              pronunciation: `/ˈ${word.toLowerCase()}/`,
              definition,
              example,
              difficulty,
              timesStudied: 0,
              color: difficulty === 'Easy' ? '#4CAF50' : 
                     difficulty === 'Medium' ? '#FF9800' : '#F44336',
              dateAdded: new Date().toISOString(),
              lastReviewed: null,
              categories: [difficulty === 'Easy' ? 'beginner' : 
                          difficulty === 'Medium' ? 'intermediate' : 'advanced']
            });
          }
        });

        if (newWords.length > 0) {
          setWords([...words, ...newWords]);
          alert(`Successfully imported ${newWords.length} words!`);
        }

        document.body.removeChild(modal);
      };

      cancelBtn.onclick = () => {
        document.body.removeChild(modal);
      };
    };

    const getDifficultyColor = (difficulty) => {
      switch(difficulty) {
        case 'Easy': return '#4CAF50';
        case 'Medium': return '#FF9800';
        case 'Hard': return '#F44336';
        default: return '#7c8b9c';
      }
    };

    const wordStats = {
      easy: words.filter(w => w.difficulty === 'Easy').length,
      medium: words.filter(w => w.difficulty === 'Medium').length,
      hard: words.filter(w => w.difficulty === 'Hard').length,
      totalStudied: words.reduce((acc, w) => acc + (w.timesStudied || 0), 0)
    };

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          borderBottom: '1px solid #eaeef2',
          paddingBottom: '20px',
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '600', 
              color: '#1a2634', 
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '-0.3px',
            }}>
              Word Library
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#6b7a8d',
              margin: '0',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '300',
            }}>
              Manage vocabulary words across all games
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              fontSize: '13px', 
              color: '#7c8b9c', 
              fontFamily: "'Poppins', sans-serif",
              background: '#f8fafc',
              padding: '8px 16px',
              borderRadius: '90px',
              border: '1px solid #e2e8f0',
            }}>
              Total: {words.length} Words
            </span>
           
            <button
              onClick={() => {
                setEditingWord(null);
                setNewWord({ word: '', definition: '', difficulty: 'Easy', example: '', pronunciation: '', categories: [] });
                setShowAddWord(true);
              }}
              style={{
                padding: '10px 20px',
                background: '#5c6ac4',
                color: 'white',
                border: 'none',
                borderRadius: '90px',
                fontSize: '13px',
                fontWeight: '400',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(92, 106, 196, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#4a58b0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#5c6ac4';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '13px' }}>+</span>
              Add New Word
            </button>
          </div>
        </div>

        {/* Word Stats Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          padding: '16px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e6eaf0',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#e8f5e9',
            borderRadius: '100px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#2e7d32' }}>Easy:</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#2e7d32' }}>{wordStats.easy}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#fff4e5',
            borderRadius: '100px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#b85c1a' }}>Medium:</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#b85c1a' }}>{wordStats.medium}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#ffebee',
            borderRadius: '100px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#b71c1c' }}>Hard:</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#b71c1c' }}>{wordStats.hard}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#f1f5f9',
            borderRadius: '100px',
            marginLeft: 'auto',
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Total Studies:</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a2634' }}>{wordStats.totalStudied}</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center' 
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #e6eaf0',
            borderRadius: '12px',
            padding: '4px 4px 4px 16px',
            flex: 1,
            maxWidth: '400px',
            transition: 'all 0.2s ease',
          }}>
            <span style={{ color: '#7c8b9c', fontSize: '18px', marginRight: '8px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 0',
                border: 'none',
                background: 'transparent',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif",
                outline: 'none',
                color: '#1a2634',
              }}
            />
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            style={{
              padding: '12px 24px',
              border: '1px solid #e2e8f0',
              borderRadius: '100px',
              fontSize: '13px',
              fontFamily: "'Poppins', sans-serif",
              background: '#ffffff',
              color: '#1a2634',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <span style={{
            fontSize: '13px',
            color: '#7c8b9c',
            background: '#f8fafc',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid #e2e8f0',
          }}>
            {filteredWords.length} of {words.length} shown
          </span>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          border: '1px solid #e6eaf0',
        }}>
          <div style={{
            overflowX: 'auto',
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              fontFamily: "'Poppins', sans-serif",
              minWidth: '1200px',
            }}>
              <thead style={{ 
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <tr>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Word</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Pronunciation</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Definition</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Example</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Difficulty</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Times Studied</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Last Reviewed</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWords.map((word) => (
                  <tr key={word.id} style={{ 
                    borderBottom: '1px solid #e2e8f0', 
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '16px 20px', fontSize: '15px', fontWeight: '600', color: '#1a2634' }}>{word.word}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7a8d', fontStyle: 'italic' }}>{word.pronunciation}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', maxWidth: '300px', lineHeight: '1.5' }}>{word.definition}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#7c8b9c', fontStyle: 'italic', maxWidth: '300px' }}>"{word.example}"</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: `${getDifficultyColor(word.difficulty)}15`,
                        color: getDifficultyColor(word.difficulty),
                        whiteSpace: 'nowrap',
                      }}>
                        {word.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a2634' }}>{word.timesStudied}</span>
                        <button
                          onClick={() => handleIncrementStudied(word.id)}
                          style={{
                            padding: '4px 10px',
                            background: '#e8f5e9',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '400',
                            color: '#2e7d32',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseOver={(e) => e.target.style.background = '#c8e6c9'}
                          onMouseOut={(e) => e.target.style.background = '#e8f5e9'}
                        >
                          +1
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b' }}>
                      {word.lastReviewed ? new Date(word.lastReviewed).toLocaleDateString() : 'Never'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button
                        onClick={() => handleEditWord(word)}
                        style={{
                          padding: '6px 16px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: '400',
                          cursor: 'pointer',
                          marginRight: '8px',
                          color: '#475569',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#f1f5f9';
                          e.target.style.borderColor = '#cbd5e1';
                          e.target.style.color = '#1a2634';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#f8fafc';
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.color = '#475569';
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteWord(word.id)}
                        style={{
                          padding: '6px 16px',
                          background: '#fef2f2',
                          color: '#b91c1c',
                          border: '1px solid #fee2e2',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: '400',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#fee2e2';
                          e.target.style.borderColor = '#fecaca';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#fef2f2';
                          e.target.style.borderColor = '#fee2e2';
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Word Modal */}
        {showAddWord && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '460px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              fontFamily: "'Poppins', sans-serif",
            }}>
              <h2 style={{ 
                fontSize: '22px', 
                fontWeight: '400', 
                marginBottom: '24px', 
                color: '#1a2634',
              }}>
                {editingWord ? 'Edit Word' : 'Add New Word'}
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>Word *</label>
                <input 
                  type="text" 
                  placeholder="Enter word" 
                  value={newWord.word}
                  onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>Pronunciation</label>
                <input 
                  type="text" 
                  placeholder="e.g., /ˈhæp.i/" 
                  value={newWord.pronunciation || ''}
                  onChange={(e) => setNewWord({...newWord, pronunciation: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>Definition *</label>
                <textarea 
                  placeholder="Enter definition" 
                  rows="3" 
                  value={newWord.definition}
                  onChange={(e) => setNewWord({...newWord, definition: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>Example Sentence</label>
                <textarea 
                  placeholder="Enter example sentence" 
                  rows="2" 
                  value={newWord.example}
                  onChange={(e) => setNewWord({...newWord, example: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' }}>Difficulty</label>
                <select
                  value={newWord.difficulty}
                  onChange={(e) => setNewWord({...newWord, difficulty: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowAddWord(false);
                    setEditingWord(null);
                    setNewWord({ word: '', definition: '', difficulty: 'Easy', example: '', pronunciation: '', categories: [] });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f8fafc',
                    color: '#7c8b9c',
                    border: '1px solid #e2e8f0',
                    borderRadius: '100px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.2s ease',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={editingWord ? handleUpdateWord : handleAddWord}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#5c6ac4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '100px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif'",
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(92, 106, 196, 0.2)',
                  }}
                >
                  {editingWord ? 'Update Word' : 'Add Word'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Poppins', sans-serif;
            background: #f5f5f7;
          }
          
          .admin-menu-item {
            transition: all 0.3s ease;
          }
          
          .admin-menu-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(5px);
          }
          
          .admin-menu-item.active {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
            border-left: 4px solid white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>

      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f5f5f7',
        fontFamily: "'Poppins', sans-serif",
      }}>
        {/* Sidebar */}
        <div style={{
          width: '260px',
          background: 'linear-gradient(180deg, #8b7dd6 0%, #7c6fd6 50%, #6b5ec5 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          padding: '0',
          fontFamily: "'Poppins', sans-serif",
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          transition: 'transform 0.3s ease',
        }}>
          {/* Logo */}
          <div style={{
            padding: '30px 25px',
            fontSize: '27px',
            fontWeight: '700',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            letterSpacing: '-0.5px',
            color: 'white',
            fontFamily: "'Poppins', sans-serif",
            background: 'rgba(255, 255, 255, 0.05)',
          }}>
            Admin Panel
          </div>

          {/* Menu Items */}
          <nav style={{ flex: 1, padding: '25px 0' }}>
            {[
              { name: 'Overview', icon: '▣' },
              { name: 'Students', icon: '☰' },
              { name: 'Games', icon: '◉' },
              { name: 'Words', icon: '▦' },
            ].map((item) => (
              <div
                key={item.name}
                className={`admin-menu-item ${activeMenu === item.name ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.name)}
                style={{
                  padding: '14px 25px',
                  margin: '5px 15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: activeMenu === item.name ? '600' : '500',
                  color: 'white',
                  fontFamily: "'Poppins', sans-serif",
                  background: activeMenu === item.name 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)' 
                    : 'transparent',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  borderLeft: '4px solid transparent',
                  boxShadow: activeMenu === item.name ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                }}
                onMouseOver={(e) => {
                  if (activeMenu !== item.name) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeMenu !== item.name) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={{ 
                  fontSize: '20px',
                  filter: activeMenu === item.name ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
                }}>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </nav>

          {/* Logout at bottom */}
          <div style={{  
          }}>
            <div
              className="admin-menu-item"
              onClick={handleLogout}
              style={{
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span style={{ fontSize: '20px' }}></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          marginLeft: '260px',
          padding: '30px 40px',
          overflowY: 'auto',
        }}>
          {/* Top Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '40px',
            position: 'relative',
          }}>
            <div
              style={{
                background: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 12px rgba(124, 111, 214, 0.15)',
                border: '2px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Poppins', sans-serif",
              }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(124, 111, 214, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(124, 111, 214, 0.15)';
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}>👨‍🏫</div>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#333', fontFamily: "'Poppins', sans-serif" }}>Admin</span>
              <span style={{ fontSize: '12px', color: '#999' }}>▼</span>
            </div>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '55px',
                right: '0',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: '220px',
                overflow: 'hidden',
                fontFamily: "'Poppins', sans-serif",
                border: '1px solid #f0f0f0',
              }}>
                <div style={{
                  padding: '14px 18px',
                  fontSize: '13px',
                  color: '#999',
                  borderBottom: '1px solid #f5f5f5',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '500',
                }}>
                  Logged in as
                </div>
                <div style={{
                  padding: '14px 18px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  borderBottom: '1px solid #f5f5f5',
                  fontFamily: "'Poppins', sans-serif",
                  background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%)',
                }}>
                  Admin
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    border: 'none',
                    background: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#fff5f5';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {activeMenu === 'Overview' && <Overview />}
          {activeMenu === 'Students' && <StudentsList />}
          {activeMenu === 'Games' && <GameManagement />}
          {activeMenu === 'Words' && <WordManagement />}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;