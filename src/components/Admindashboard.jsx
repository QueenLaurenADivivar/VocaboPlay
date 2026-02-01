import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  // Overview Component
  const Overview = () => {
    const stats = [
      { label: 'Total Students', value: '0', icon: '▣', color: '#7c6fd6', change: '0%' },
      { label: 'Active Words', value: '200', icon: '☰', color: '#4CAF50', change: '0%' },
      { label: 'Total Games', value: '6', icon: '◉', color: '#FF9800', change: '0%' },
      { label: 'Avg Score', value: '0%', icon: '▦', color: '#2196F3', change: '0%' },
    ];

    return (
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '30px', fontFamily: "'Poppins', sans-serif" }}>
          Admin Overview
        </h1>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0',
              fontFamily: "'Poppins', sans-serif",
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px',
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: `${stat.color}15`,
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
                  color: '#999',
                  background: '#f8f7ff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  {stat.change}
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '5px', fontFamily: "'Poppins', sans-serif" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#999', fontWeight: '500', fontFamily: "'Poppins', sans-serif" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* No Students Message */}
        <div style={{
          background: 'white',
          padding: '60px 25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          textAlign: 'center',
          border: '1px solid #f0f0f0',
        }}>
         
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#1a1a1a',
            marginBottom: '10px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            No Students Yet
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#666',
            maxWidth: '400px',
            margin: '0 auto',
            fontFamily: "'Poppins', sans-serif"
          }}>
            No students have logged in yet. Students will appear here once they create an account and log in.
          </p>
        </div>
      </div>
    );
  };

  // Students List Component
  const StudentsList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', fontFamily: "'Poppins', sans-serif" }}>
            All Students
          </h1>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: "'Poppins', sans-serif",
              background: 'white',
            }}
          />
        </div>

        {/* No Students Message */}
        <div style={{
          background: 'white',
          padding: '60px 25px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          textAlign: 'center',
          border: '1px solid #f0f0f0',
        }}>
        
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#1a1a1a', 
            marginBottom: '10px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            No Students Yet
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#999',
            maxWidth: '400px',
            margin: '0 auto',
            fontFamily: "'Poppins', sans-serif"
          }}>
            No students have logged in yet. Students will appear here once they create an account and log in.
          </p>
        </div>
      </div>
    );
  };

  // Game Management Component - UPDATED with consistent icons and colors
  const GameManagement = () => {
    const [editingGame, setEditingGame] = useState(null);

    const games = [
      {
        id: 1,
        name: 'Flashcards',
        icon: '📇',
        description: 'Flip cards to learn new words and their definitions.',
        totalWords: 6,
        timesPlayed: 0,
        avgScore: 0,
        color: '#7c6fd6',
        iconBg: '#FFE5E5',
        accentColor: '#7c6fd6'
      },
      {
        id: 2,
        name: 'Match Game',
        icon: '🎯',
        description: 'Connect words with their correct definitions.',
        totalPairs: 6,
        timesPlayed: 0,
        avgScore: 0,
        color: '#4A90E2',
        iconBg: '#E5F3FF',
        accentColor: '#4A90E2'
      },
      {
        id: 3,
        name: 'Short Story',
        icon: '📖',
        description: 'Short stories to read with vocab words and quizzes.',
        totalStories: 3,
        timesPlayed: 0,
        avgScore: 0,
        color: '#FFD54F',
        iconBg: '#FFF9E5',
        accentColor: '#FFD54F'
      },
      {
        id: 4,
        name: 'Quiz',
        icon: '❓',
        description: 'Test your knowledge with multiple choice questions.',
        totalQuestions: 5,
        timesPlayed: 0,
        avgScore: 0,
        color: '#FFA726',
        iconBg: '#FFF5E5',
        accentColor: '#FFA726'
      },
      {
        id: 5,
        name: 'Type It!',
        icon: '⌨️',
        description: 'Listen to the word and type the correct word.',
        totalWords: 18,
        timesPlayed: 0,
        avgScore: 0,
        color: '#AB47BC',
        iconBg: '#F3E5FF',
        accentColor: '#AB47BC'
      },
      {
        id: 6,
        name: 'GuessWhat',
        icon: '🤔',
        description: 'Guess what the person is doing.',
        totalQuestions: 5,
        timesPlayed: 0,
        avgScore: 0,
        color: '#26C6DA',
        iconBg: '#E5F9FF',
        accentColor: '#26C6DA'
      },
    ];

    const getGameStats = (game) => {
      if (game.name === 'Flashcards') return `${game.totalWords} words`;
      if (game.name === 'Match Game') return `${game.totalPairs} pairs`;
      if (game.name === 'Short Story') return `${game.totalStories} stories`;
      if (game.name === 'Quiz') return `${game.totalQuestions} questions`;
      if (game.name === 'Type It!') return `${game.totalWords} words`;
      if (game.name === 'GuessWhat') return `${game.totalQuestions} questions`;
      return '0 items';
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', fontFamily: "'Poppins', sans-serif" }}>
            Game Management
          </h1>
          <span style={{ fontSize: '14px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>
            Total Games: {games.length}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {games.map((game) => (
            <div key={game.id} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
              fontFamily: "'Poppins', sans-serif",
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: game.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}>
                  {game.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px', fontFamily: "'Poppins', sans-serif" }}>
                    {game.name}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#666',
                    fontFamily: "'Poppins', sans-serif",
                    marginBottom: '8px',
                    lineHeight: '1.4',
                  }}>
                    {game.description}
                  </p>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: game.accentColor,
                    background: `${game.accentColor}15`,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {getGameStats(game)}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>Times Played:</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#333', fontFamily: "'Poppins', sans-serif" }}>{game.timesPlayed}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>Average Score:</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#999', fontFamily: "'Poppins', sans-serif" }}>{game.avgScore}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>Status:</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#4CAF50',
                    background: '#E8F5E9',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Active
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setEditingGame(game.id)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Edit Content
                </button>
                <button style={{
                  flex: 1,
                  padding: '10px',
                  background: '#f0f0f0',
                  color: '#666',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => e.target.style.background = '#e0e0e0'}
                onMouseOut={(e) => e.target.style.background = '#f0f0f0'}
                >
                  View Stats
                </button>
              </div>
            </div>
          ))}
        </div>

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
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              fontFamily: "'Poppins', sans-serif",
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>
                Edit Game Content
              </h2>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>
                This is where you can edit words, questions, and game settings.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setEditingGame(null)}
                  style={{
                    padding: '10px 20px',
                    background: '#f0f0f0',
                    color: '#666',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setEditingGame(null)}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Word Management Component - UPDATED with all vocabulary words
  const WordManagement = () => {
    const [showAddWord, setShowAddWord] = useState(false);
    const [newWord, setNewWord] = useState({ word: '', definition: '', difficulty: 'Easy', example: '', pronunciation: '' });

    // All vocabulary words from Word Library
    const words = [
      // EASY LEVEL - 6 words
      {
        id: 1,
        word: 'Happy',
        pronunciation: '/ˈhæp.i/',
        definition: 'Feeling or showing pleasure or contentment.',
        example: 'She felt happy when she received the good news.',
        difficulty: 'Easy',
        timesStudied: 0,
        color: '#4CAF50'
      },
      {
        id: 2,
        word: 'Bright',
        pronunciation: '/braɪt/',
        definition: 'Giving out or reflecting a lot of light; shining.',
        example: 'The sun was bright in the clear blue sky.',
        difficulty: 'Easy',
        timesStudied: 0,
        color: '#4CAF50'
      },
      {
        id: 3,
        word: 'Quick',
        pronunciation: '/kwɪk/',
        definition: 'Moving fast or doing something in a short time.',
        example: 'The rabbit was very quick and escaped easily.',
        difficulty: 'Easy',
        timesStudied: 0,
        color: '#4CAF50'
      },
      {
        id: 4,
        word: 'Calm',
        pronunciation: '/kɑːm/',
        definition: 'Not showing or feeling nervousness, anger, or other strong emotions.',
        example: 'She remained calm during the emergency.',
        difficulty: 'Easy',
        timesStudied: 0,
        color: '#4CAF50'
      },
      {
        id: 5,
        word: 'Kind',
        pronunciation: '/kaɪnd/',
        definition: 'Having or showing a friendly, generous, and considerate nature.',
        example: 'He was kind to everyone he met.',
        difficulty: 'Easy',
        timesStudied: 0,
        color: '#4CAF50'
      },
      {
        id: 6,
        word: 'Strong',
        pronunciation: '/strɒŋ/',
        definition: 'Having the power to move heavy weights or perform physically demanding tasks.',
        example: 'The athlete was strong enough to lift the heavy barbell.',
        difficulty: 'Easy',
        timesStudied: 0,
        color: '#4CAF50'
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
        color: '#FF9800'
      },
      {
        id: 8,
        word: 'Cautious',
        pronunciation: '/ˈkɔː.ʃəs/',
        definition: 'Careful to avoid potential problems or dangers.',
        example: 'He was cautious when crossing the busy street.',
        difficulty: 'Medium',
        timesStudied: 0,
        color: '#FF9800'
      },
      {
        id: 9,
        word: 'Diligent',
        pronunciation: '/ˈdɪl.ɪ.dʒənt/',
        definition: 'Having or showing care and conscientiousness in one\'s work or duties.',
        example: 'The diligent student completed all assignments on time.',
        difficulty: 'Medium',
        timesStudied: 0,
        color: '#FF9800'
      },
      {
        id: 10,
        word: 'Generous',
        pronunciation: '/ˈdʒen.ər.əs/',
        definition: 'Showing a readiness to give more than is necessary or expected.',
        example: 'Her generous donation helped many families in need.',
        difficulty: 'Medium',
        timesStudied: 0,
        color: '#FF9800'
      },
      {
        id: 11,
        word: 'Persistent',
        pronunciation: '/pəˈsɪs.tənt/',
        definition: 'Continuing firmly in a course of action despite difficulty or opposition.',
        example: 'His persistent efforts finally led to success.',
        difficulty: 'Medium',
        timesStudied: 0,
        color: '#FF9800'
      },
      {
        id: 12,
        word: 'Vibrant',
        pronunciation: '/ˈvaɪ.brənt/',
        definition: 'Full of energy and enthusiasm; bright and striking.',
        example: 'The city had a vibrant cultural scene.',
        difficulty: 'Medium',
        timesStudied: 0,
        color: '#FF9800'
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
        color: '#F44336'
      },
      {
        id: 14,
        word: 'Ubiquitous',
        pronunciation: '/juːˈbɪk.wɪ.təs/',
        definition: 'Present, appearing, or found everywhere.',
        example: 'Smartphones have become ubiquitous in modern society.',
        difficulty: 'Hard',
        timesStudied: 0,
        color: '#F44336'
      },
      {
        id: 15,
        word: 'Enigmatic',
        pronunciation: '/ˌen.ɪɡˈmæt.ɪk/',
        definition: 'Difficult to interpret or understand; mysterious.',
        example: 'The Mona Lisa\'s enigmatic smile has fascinated people for centuries.',
        difficulty: 'Hard',
        timesStudied: 0,
        color: '#F44336'
      },
      {
        id: 16,
        word: 'Meticulous',
        pronunciation: '/məˈtɪk.jə.ləs/',
        definition: 'Showing great attention to detail; very careful and precise.',
        example: 'The scientist was meticulous in recording every observation.',
        difficulty: 'Hard',
        timesStudied: 0,
        color: '#F44336'
      },
      {
        id: 17,
        word: 'Eloquent',
        pronunciation: '/ˈel.ə.kwənt/',
        definition: 'Fluent or persuasive in speaking or writing.',
        example: 'Her eloquent speech moved the entire audience to tears.',
        difficulty: 'Hard',
        timesStudied: 0,
        color: '#F44336'
      },
      {
        id: 18,
        word: 'Resilient',
        pronunciation: '/rɪˈzɪl.i.ənt/',
        definition: 'Able to recover quickly from difficulties; tough and adaptable.',
        example: 'The community proved resilient after the natural disaster.',
        difficulty: 'Hard',
        timesStudied: 0,
        color: '#F44336'
      },
    ];

    const handleAddWord = () => {
      if (newWord.word && newWord.definition) {
        alert(`Word "${newWord.word}" added successfully!`);
        setNewWord({ word: '', definition: '', difficulty: 'Easy', example: '', pronunciation: '' });
        setShowAddWord(false);
      } else {
        alert('Please fill in all required fields.');
      }
    };

    const handleDeleteWord = (id) => {
      if (window.confirm('Are you sure you want to delete this word?')) {
        alert('Word deleted successfully!');
      }
    };

    const getDifficultyColor = (difficulty) => {
      switch(difficulty) {
        case 'Easy': return '#4CAF50';
        case 'Medium': return '#FF9800';
        case 'Hard': return '#F44336';
        default: return '#666';
      }
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', fontFamily: "'Poppins', sans-serif" }}>
            Word Library
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>
              Total Words: {words.length}
            </span>
            <button
              onClick={() => setShowAddWord(true)}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              + Add New Word
            </button>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          border: '1px solid #f0f0f0',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Poppins', sans-serif" }}>
            <thead style={{ background: '#f8f7ff' }}>
              <tr>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>Word</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>Pronunciation</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>Definition</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>Example</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>Difficulty</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>Times Studied</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word) => (
                <tr key={word.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'all 0.2s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#faf9ff'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '15px 20px', fontSize: '14px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>{word.word}</td>
                  <td style={{ padding: '15px 20px', fontSize: '13px', color: '#666', fontStyle: 'italic', fontFamily: "'Poppins', sans-serif" }}>{word.pronunciation}</td>
                  <td style={{ padding: '15px 20px', fontSize: '13px', color: '#666', maxWidth: '250px', fontFamily: "'Poppins', sans-serif" }}>{word.definition}</td>
                  <td style={{ padding: '15px 20px', fontSize: '13px', color: '#999', fontStyle: 'italic', maxWidth: '250px', fontFamily: "'Poppins', sans-serif" }}>"{word.example}"</td>
                  <td style={{ padding: '15px 20px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: `${getDifficultyColor(word.difficulty)}20`,
                      color: getDifficultyColor(word.difficulty),
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {word.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>{word.timesStudied}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <button style={{
                      padding: '6px 12px',
                      background: '#f0f0f0',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      marginRight: '8px',
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => e.target.style.background = '#e0e0e0'}
                    onMouseOut={(e) => e.target.style.background = '#f0f0f0'}>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteWord(word.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#FFEBEE',
                        color: '#F44336',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif",
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => e.target.style.background = '#FFCDD2'}
                      onMouseOut={(e) => e.target.style.background = '#FFEBEE'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              fontFamily: "'Poppins', sans-serif",
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>
                Add New Word
              </h2>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#333', fontFamily: "'Poppins', sans-serif" }}>Word *</label>
                <input 
                  type="text" 
                  placeholder="Enter word" 
                  value={newWord.word}
                  onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    background: 'white',
                  }} 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#333', fontFamily: "'Poppins', sans-serif" }}>Pronunciation</label>
                <input 
                  type="text" 
                  placeholder="e.g., /ˈhæp.i/" 
                  value={newWord.pronunciation || ''}
                  onChange={(e) => setNewWord({...newWord, pronunciation: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    background: 'white',
                  }} 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#333', fontFamily: "'Poppins', sans-serif" }}>Definition *</label>
                <textarea 
                  placeholder="Enter definition" 
                  rows="3" 
                  value={newWord.definition}
                  onChange={(e) => setNewWord({...newWord, definition: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    background: 'white',
                    resize: 'vertical',
                  }} 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#333', fontFamily: "'Poppins', sans-serif" }}>Example Sentence</label>
                <textarea 
                  placeholder="Enter example sentence" 
                  rows="2" 
                  value={newWord.example}
                  onChange={(e) => setNewWord({...newWord, example: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    background: 'white',
                    resize: 'vertical',
                  }} 
                />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#333', fontFamily: "'Poppins', sans-serif" }}>Difficulty</label>
                <select
                  value={newWord.difficulty}
                  onChange={(e) => setNewWord({...newWord, difficulty: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    background: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowAddWord(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f0f0f0',
                    color: '#666',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => e.target.style.background = '#e0e0e0'}
                  onMouseOut={(e) => e.target.style.background = '#f0f0f0'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWord}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Add Word
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
            background: rgba(255, 255, 255, 0.15);
            border-left: 4px solid white;
            padding-left: 21px;
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
          width: '250px',
          background: 'linear-gradient(180deg, #8b7dd6 0%, #7c6fd6 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          padding: '0',
          fontFamily: "'Poppins', sans-serif",
        }}>
          {/* Logo */}
          <div style={{
            padding: '25px 20px',
            fontSize: '22px',
            fontWeight: '700',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            letterSpacing: '-0.5px',
            color: 'white',
            fontFamily: "'Poppins', sans-serif",
          }}>
            Admin Panel
          </div>

          {/* Menu Items */}
          <nav style={{ flex: 1, padding: '20px 0' }}>
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
                  padding: '12px 25px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: activeMenu === item.name ? '600' : '400',
                  color: 'white',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </nav>

          {/* Logout at bottom */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px 0',
          }}>
            <div
              className="admin-menu-item"
              onClick={handleLogout}
              style={{
                padding: '12px 25px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '400',
                color: 'white',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
             
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          marginLeft: '250px',
          padding: '25px 40px',
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
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Poppins', sans-serif",
              }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
            >
              <span style={{ fontSize: '18px' }}>👨‍🏫</span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#333', fontFamily: "'Poppins', sans-serif" }}>Admin</span>
              <span style={{ fontSize: '12px', color: '#999' }}>▼</span>
            </div>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                zIndex: 1000,
                minWidth: '200px',
                overflow: 'hidden',
                fontFamily: "'Poppins', sans-serif",
              }}>
                <div style={{
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: '#999',
                  borderBottom: '1px solid #f0f0f0',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Logged in as
                </div>
                <div style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  borderBottom: '1px solid #f0f0f0',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Admin
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
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