import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import images (adjust paths based on your project structure)
const brushingImage = '/assets/brushing.png';
const cookingImage = '/assets/cooking.png';
const bokaWelcomingImage = '/assets/bokawelcoming.jpg';
const bokaSadFavoriteImage = '/assets/bokasadfavorite.jpg';
const sadHeartImage = '/assets/sadheart.jpg';

// UNIFIED VOCABULARY DATABASE
const UNIFIED_VOCABULARY = [
  { id: 1, word: 'Participate', definition: 'To take part in an activity or discussion.' },
  { id: 2, word: 'Concentrate', definition: 'To focus all your attention on something.' },
  { id: 3, word: 'Summarize', definition: 'To give a brief statement of the main points.' },
  { id: 4, word: 'Analyze', definition: 'To examine something in detail to understand it better.' },
  { id: 5, word: 'Collaborate', definition: 'To work together with others on a project.' },
  { id: 6, word: 'Demonstrate', definition: 'To show clearly by giving proof or evidence.' },
  { id: 7, word: 'Review', definition: 'To look over or study again to remember better.' },
  { id: 8, word: 'Practice', definition: 'To do something repeatedly to improve your skill.' },
  { id: 9, word: 'Observe', definition: 'To watch carefully and notice details.' },
  { id: 10, word: 'Organize', definition: 'To arrange things in an orderly and structured way.' },
  { id: 11, word: 'Revise', definition: 'To make changes to improve your work.' },
  { id: 12, word: 'Discuss', definition: 'To talk about a topic with others to share ideas.' },
  { id: 13, word: 'Explain', definition: 'To make something clear and easy to understand.' },
  { id: 14, word: 'Compare', definition: 'To examine the similarities and differences between things.' },
  { id: 15, word: 'Identify', definition: 'To recognize and name something correctly.' },
  { id: 16, word: 'Evaluate', definition: 'To judge the value or quality of something.' },
  { id: 17, word: 'Research', definition: 'To study and investigate a topic carefully.' },
  { id: 18, word: 'Present', definition: 'To show or introduce information to others.' },
  { id: 19, word: 'Complete', definition: 'To finish something that was started.' },
  { id: 20, word: 'Illustrate', definition: 'To explain or make clear by using examples or pictures.' },
  { id: 21, word: 'Communicate', definition: 'To share information, ideas, or feelings with others.' },
  { id: 22, word: 'Calculate', definition: 'To find an answer using mathematics.' },
  { id: 23, word: 'Investigate', definition: 'To examine or study something carefully to find facts.' },
  { id: 24, word: 'Apply', definition: 'To use knowledge or skills in a particular situation.' },
  { id: 25, word: 'Predict', definition: 'To say what you think will happen in the future.' },
  { id: 26, word: 'Experiment', definition: 'To try something to see what happens or to test an idea.' },
  { id: 27, word: 'Record', definition: 'To write down information to remember it.' },
  { id: 28, word: 'Classify', definition: 'To arrange things into groups based on their features.' },
  { id: 29, word: 'Interpret', definition: 'To explain the meaning of something.' },
  { id: 30, word: 'Respond', definition: 'To answer or react to something.' },
];

// Progress Update Helper
const updateProgress = (updates) => {
  const savedProgress = localStorage.getItem('vocaboplay_progress');
  const currentProgress = savedProgress ? JSON.parse(savedProgress) : {
    level: 1,
    xp: 0,
    totalPoints: 0,
    streak: 0,
    gamesPlayed: 0,
    wordsLearned: 0,
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

  const newProgress = { ...currentProgress, ...updates };
  
  // Check for achievements
  if (!currentProgress.achievements.firstGame && newProgress.gamesPlayed >= 1) {
    newProgress.achievements.firstGame = true;
  }
  if (!currentProgress.achievements.tenWords && newProgress.wordsLearned >= 10) {
    newProgress.achievements.tenWords = true;
  }
  if (!currentProgress.achievements.perfectScore && updates.achievements?.perfectScore) {
    newProgress.achievements.perfectScore = true;
  }
  
  // Calculate level based on XP
  newProgress.level = Math.floor(newProgress.xp / 100) + 1;
  
  localStorage.setItem('vocaboplay_progress', JSON.stringify(newProgress));
  
  const event = new CustomEvent('progressUpdate', { detail: newProgress });
  window.dispatchEvent(event);
  
  return newProgress;
};

// Game Components
const Flashcards = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [shake, setShake] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [studyMode, setStudyMode] = useState('sequential');

  const flashcards = UNIFIED_VOCABULARY;

  const categories = [
    { id: 'all', name: 'All Words', icon: '📚', count: flashcards.length, color: '#7c6fd6' },
    { id: 'easy', name: 'Beginner', icon: '🌱', count: 6, color: '#2E7D32' },
    { id: 'medium', name: 'Intermediate', icon: '⚡', count: 6, color: '#B85C1A' },
    { id: 'hard', name: 'Advanced', icon: '🔥', count: 6, color: '#B91C1C' },
    { id: 'action', name: 'Action', icon: '🏃', count: 6, color: '#9b8de8' },
    { id: 'academic', name: 'Academic', icon: '📖', count: 6, color: '#2563eb' },
  ];

  useEffect(() => {
    let filtered = [];
    if (selectedCategory === 'all') {
      filtered = flashcards;
    } else if (selectedCategory === 'easy') {
      filtered = flashcards.slice(0, 6);
    } else if (selectedCategory === 'medium') {
      filtered = flashcards.slice(6, 12);
    } else if (selectedCategory === 'hard') {
      filtered = flashcards.slice(12, 18);
    } else if (selectedCategory === 'action') {
      filtered = flashcards.filter((_, index) => index % 3 === 0).slice(0, 6);
    } else if (selectedCategory === 'academic') {
      filtered = flashcards.filter((_, index) => index % 3 === 2).slice(0, 6);
    }
    
    setFilteredFlashcards(studyMode === 'random' 
      ? [...filtered].sort(() => Math.random() - 0.5) 
      : filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, studyMode]);

  const handleNext = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKnew = () => {
    setScore(score + 1);
    
    const savedProgress = localStorage.getItem('vocaboplay_progress');
    const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
    
    if (currentProgress) {
      const isNewWord = !currentProgress.flashcards?.knownWords?.includes(filteredFlashcards[currentIndex]?.id);
      
      const updates = {
        xp: (currentProgress.xp || 0) + 5,
        totalPoints: (currentProgress.totalPoints || 0) + 10,
        correctAnswers: (currentProgress.correctAnswers || 0) + 1,
        totalAnswers: (currentProgress.totalAnswers || 0) + 1,
        wordsLearned: isNewWord ? (currentProgress.wordsLearned || 0) + 1 : (currentProgress.wordsLearned || 0),
        flashcards: {
          cardsViewed: (currentProgress.flashcards?.cardsViewed || 0) + 1,
          knownWords: [...(currentProgress.flashcards?.knownWords || []), filteredFlashcards[currentIndex]?.id]
        }
      };
      
      updateProgress(updates);
    }
    
    if (currentIndex < filteredFlashcards.length - 1) {
      handleNext();
    }
  };

  const handleDidntKnow = () => {
    const savedProgress = localStorage.getItem('vocaboplay_progress');
    const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
    
    if (currentProgress) {
      updateProgress({
        totalAnswers: (currentProgress.totalAnswers || 0) + 1,
        flashcards: {
          ...currentProgress.flashcards,
          cardsViewed: (currentProgress.flashcards?.cardsViewed || 0) + 1
        }
      });
    }
    
    if (currentIndex < filteredFlashcards.length - 1) {
      handleNext();
    }
  };

  useEffect(() => {
    const isLastCard = currentIndex === filteredFlashcards.length - 1;
    if (isLastCard && score > 0 && filteredFlashcards.length > 0) {
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
      
      if (currentProgress) {
        const updates = {
          gamesPlayed: (currentProgress.gamesPlayed || 0) + 1,
          xp: (currentProgress.xp || 0) + 20,
          totalPoints: (currentProgress.totalPoints || 0) + 50
        };
        
        if (score === filteredFlashcards.length) {
          updates.achievements = {
            ...currentProgress.achievements,
            perfectScore: true
          };
        }
        
        updateProgress(updates);
      }
    }
  }, [currentIndex, score, filteredFlashcards.length]);

  const current = filteredFlashcards[currentIndex];
  const progress = filteredFlashcards.length > 0 ? ((currentIndex + 1) / filteredFlashcards.length) * 100 : 0;
  const isLastCard = currentIndex === filteredFlashcards.length - 1;
  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

  // Welcome Screen - Matching MatchGame style
  if (showWelcome) {
    return (
      <div style={{ 
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '24px',
        color: '#1e293b'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          borderBottom: '1px solid #edf2f7',
          paddingBottom: '16px',
        }}>        
          <div style={{ 
            background: '#f8fafc',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            color: '#475569',
            fontWeight: '500'
          }}>
          </div>
        </div>

        {/* Hero Section - Matching MatchGame style */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #e6e0ff',
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>📇</div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '12px', 
            fontFamily: "'Inter', 'Poppins', sans-serif"
          }}>
            Flashcards
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#475569', 
            lineHeight: '1.6', 
            marginBottom: '24px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            maxWidth: '600px',
            margin: '0 auto 24px'
          }}>
            Choose a category and start learning
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>{flashcards.length}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Words</div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>6</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Categories</div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>+5</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>XP</div>
            </div>
          </div>
        </div>

        {/* Categories Section - Matching MatchGame style */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '16px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Categories
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  background: selectedCategory === category.id ? category.color : '#ffffff',
                  border: `1px solid ${selectedCategory === category.id ? category.color : '#e2e8f0'}`,
                  borderRadius: '16px',
                  padding: '16px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: selectedCategory === category.id ? '0 4px 12px rgba(124, 111, 214, 0.2)' : 'none',
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                <span style={{ fontSize: '28px', marginBottom: '4px' }}>{category.icon}</span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: selectedCategory === category.id ? 'white' : '#0f172a',
                  fontFamily: "'Inter', 'Poppins', sans-serif"
                }}>
                  {category.name}
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: selectedCategory === category.id ? 'rgba(255,255,255,0.9)' : '#64748b',
                  background: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  padding: '4px 10px',
                  borderRadius: '100px',
                }}>
                  {category.count} {category.count === 1 ? 'word' : 'words'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button - Matching MatchGame style */}
        <button 
          onClick={() => setShowWelcome(false)} 
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: '500', 
            transition: 'all 0.2s ease', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            boxShadow: '0 8px 20px rgba(124, 111, 214, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 111, 214, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 111, 214, 0.3)';
          }}
        >
          Start Game
        </button>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  if (!current) {
    return (
      <div style={{ 
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '24px'
      }}>
        <div style={{ 
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          border: '1px solid #edf2f7',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', color: '#94a3b8' }}>📭</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
            No Cards
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
            Try another category
          </p>
          <button
            onClick={() => setShowWelcome(true)}
            style={{
              padding: '12px 28px',
              background: '#7c6fd6',
              color: 'white',
              border: 'none',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#6b5ec5';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#7c6fd6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  // Playing Screen - Matching MatchGame style
  return (
    <div style={{ 
      fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
      maxWidth: '720px', 
      margin: '0 auto',
      padding: '24px'
    }}>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          .flashcard-container {
            perspective: 1000px;
            margin-bottom: 24px;
            cursor: pointer;
          }
          
          .flashcard-inner {
            position: relative;
            width: 100%;
            height: 360px;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          
          .flashcard-inner.shake {
            animation: shake 0.5s ease;
          }
          
          .flashcard-inner.flipped {
            transform: rotateY(180deg);
          }
          
          .flashcard-front, .flashcard-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 24px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-shadow: 0 8px 24px rgba(124, 111, 214, 0.12);
          }
          
          .flashcard-front {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: white;
            border: 1px solid #334155;
          }
          
          .flashcard-back {
            background: white;
            color: #0f172a;
            transform: rotateY(180deg);
            border: 1px solid #e6e0ff;
          }
        `}
      </style>

      {/* Header - Matching MatchGame style */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '20px',
      }}>
        <button 
          onClick={() => setShowWelcome(true)} 
          style={{ 
            background: 'white', 
            border: '1px solid #e2e8f0', 
            padding: '8px 20px', 
            borderRadius: '100px', 
            cursor: 'pointer', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#475569', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          Exit
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px', color: currentCategory.color }}>{currentCategory.icon}</span>
          <h1 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#0f172a', 
            margin: '0', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            {currentCategory.name}
          </h1>
        </div>
        
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          background: '#f8f7ff',
          color: '#7c6fd6',
          padding: '8px 16px',
          borderRadius: '100px',
          border: '1px solid #e6e0ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓ {score}</span>
        </div>
      </div>

      {/* Progress Bar - Matching MatchGame style */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '13px',
          color: '#64748b',
        }}>
          <span>Card {currentIndex + 1} of {filteredFlashcards.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '6px', 
          background: '#f1f5f9', 
          borderRadius: '100px', 
          overflow: 'hidden',
        }}>
          <div style={{ 
            height: '100%', 
            background: `linear-gradient(90deg, ${currentCategory.color}, ${currentCategory.color}dd)`, 
            width: `${progress}%`, 
            transition: 'width 0.3s ease',
            borderRadius: '100px',
          }} />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''} ${shake ? 'shake' : ''}`}>
          <div className="flashcard-front">
            <div style={{ 
              fontSize: '12px', 
              opacity: 0.7, 
              marginBottom: '16px', 
              fontWeight: '600', 
              letterSpacing: '1px', 
              textTransform: 'uppercase',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 16px',
              borderRadius: '100px',
              backdropFilter: 'blur(4px)'
            }}>
              Word
            </div>
            <div style={{ 
              fontSize: '42px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              padding: '0 24px',
              textAlign: 'center',
              lineHeight: '1.3',
              wordBreak: 'break-word',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {current.word}
            </div>
            <div style={{ 
              fontSize: '13px', 
              opacity: 0.6, 
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '6px 16px',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>👆</span> Tap to flip
            </div>
          </div>
          <div className="flashcard-back">
            <div style={{ 
              fontSize: '12px', 
              marginBottom: '16px', 
              fontWeight: '600', 
              letterSpacing: '1px', 
              textTransform: 'uppercase', 
              color: '#7c6fd6',
              background: '#f8f7ff',
              padding: '6px 16px',
              borderRadius: '100px',
              border: '1px solid #e6e0ff'
            }}>
              Definition
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '500', 
              lineHeight: '1.6', 
              textAlign: 'center', 
              padding: '0 28px', 
              color: '#1e293b',
              marginBottom: '24px',
              maxWidth: '500px'
            }}>
              {current.definition}
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: '#94a3b8',
              padding: '6px 16px',
              borderRadius: '100px',
              border: '1px solid #e2e8f0',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>👆</span> Tap to flip back
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Matching MatchGame style */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px', 
        margin: '24px 0 20px'
      }}>
        <button 
          onClick={handlePrevious} 
          disabled={currentIndex === 0} 
          style={{ 
            padding: '10px 24px', 
            border: '1px solid #e2e8f0', 
            background: 'white', 
            borderRadius: '100px', 
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#475569', 
            opacity: currentIndex === 0 ? 0.4 : 1, 
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (currentIndex !== 0) {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#7c6fd6';
              e.currentTarget.style.color = '#7c6fd6';
            }
          }}
          onMouseOut={(e) => {
            if (currentIndex !== 0) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#475569';
            }
          }}
        >
          ← Previous
        </button>
        
        <button 
          onClick={handleNext} 
          disabled={isLastCard} 
          style={{ 
            padding: '10px 24px', 
            border: '1px solid #e2e8f0', 
            background: 'white', 
            borderRadius: '100px', 
            cursor: isLastCard ? 'not-allowed' : 'pointer', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#475569', 
            opacity: isLastCard ? 0.4 : 1, 
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!isLastCard) {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#7c6fd6';
              e.currentTarget.style.color = '#7c6fd6';
            }
          }}
          onMouseOut={(e) => {
            if (!isLastCard) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#475569';
            }
          }}
        >
          Next →
        </button>
      </div>

      {/* Action Buttons - Matching MatchGame style */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={handleDidntKnow} 
          disabled={isLastCard}
          style={{ 
            flex: 1,
            padding: '14px', 
            background: 'white', 
            color: '#b91c1c',
            border: '1px solid #fee2e2', 
            borderRadius: '100px', 
            cursor: isLastCard ? 'not-allowed' : 'pointer', 
            fontSize: '14px', 
            fontWeight: '600', 
            transition: 'all 0.2s ease', 
            opacity: isLastCard ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!isLastCard) {
              e.currentTarget.style.background = '#fee2e2';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLastCard) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <span style={{ fontSize: '18px' }}>🔄</span>
          Need Review
        </button>
        <button 
          onClick={handleKnew} 
          disabled={isLastCard}
          style={{ 
            flex: 1,
            padding: '14px', 
            background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '100px', 
            cursor: isLastCard ? 'not-allowed' : 'pointer', 
            fontSize: '14px', 
            fontWeight: '600', 
            transition: 'all 0.2s ease', 
            opacity: isLastCard ? 0.4 : 1,
            boxShadow: '0 4px 12px rgba(124, 111, 214, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!isLastCard) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #6b5ec5 0%, #5a4db4 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(124, 111, 214, 0.3)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLastCard) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 111, 214, 0.2)';
            }
          }}
        >
          <span style={{ fontSize: '18px' }}>✓</span>
          Know It
        </button>
      </div>

      {/* Completion Modal - Matching MatchGame style */}
      {isLastCard && (
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
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(124, 111, 214, 0.2)',
            textAlign: 'center',
            border: '1px solid #e6e0ff'
          }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '20px',
              animation: 'float 3s ease-in-out infinite'
            }}>🏆</div>
            <h2 style={{ 
              fontSize: '26px', 
              fontWeight: '700', 
              color: '#0f172a', 
              margin: '0 0 8px 0',
              fontFamily: "'Inter', 'Poppins', sans-serif"
            }}>
              Complete!
            </h2>
            <p style={{ 
              fontSize: '15px', 
              color: '#475569', 
              marginBottom: '28px'
            }}>
              You reviewed {filteredFlashcards.length} cards
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div style={{
                background: '#f8f7ff',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid #e6e0ff'
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Score</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#7c6fd6' }}>{score}</div>
              </div>
              <div style={{
                background: '#f8f7ff',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid #e6e0ff'
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Accuracy</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#7c6fd6' }}>
                  {Math.round((score / filteredFlashcards.length) * 100)}%
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => {
                  setCurrentIndex(0);
                  setIsFlipped(false);
                  setScore(0);
                }} 
                style={{ 
                  flex: 1,
                  padding: '14px', 
                  background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '100px', 
                  cursor: 'pointer', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(124, 111, 214, 0.2)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #6b5ec5 0%, #5a4db4 100%)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(124, 111, 214, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 111, 214, 0.2)';
                }}
              >
                <span style={{ fontSize: '18px' }}>🔄</span>
                Again
              </button>
              <button 
                onClick={() => setShowWelcome(true)} 
                style={{ 
                  flex: 1,
                  padding: '14px', 
                  background: 'white', 
                  color: '#475569', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '100px', 
                  cursor: 'pointer', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#7c6fd6';
                  e.currentTarget.style.color = '#7c6fd6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#475569';
                }}
              >                Categories
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Quiz = ({ onBack }) => {
  const [gameState, setGameState] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [dailySeed, setDailySeed] = useState('');

  // Define categories - matching MatchGame style
  const categories = [
    { id: 'all', name: 'All Words', icon: '📚', color: '#7c6fd6' },
    { id: 'beginner', name: 'Beginner', icon: '🌱', color: '#2E7D32' },
    { id: 'intermediate', name: 'Intermediate', icon: '⚡', color: '#B85C1A' },
    { id: 'advanced', name: 'Advanced', icon: '🔥', color: '#B91C1C' },
    { id: 'action', name: 'Action', icon: '🏃', color: '#9b8de8' },
    { id: 'academic', name: 'Academic', icon: '📖', color: '#2563eb' },
  ];

  // Create daily seed based on date
  useEffect(() => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    setDailySeed(dateString);
  }, []);

  // Generate quiz based on daily seed
  const generateDailyQuiz = () => {
    // Use the daily seed to create consistent random selection for the day
    const seed = dailySeed || new Date().toDateString();
    let seedValue = 0;
    for (let i = 0; i < seed.length; i++) {
      seedValue += seed.charCodeAt(i);
    }
    
    // Simple seeded random function
    const seededRandom = (max) => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return Math.floor((seedValue / 233280) * max);
    };

    // Get 10 random words from UNIFIED_VOCABULARY
    const shuffled = [...UNIFIED_VOCABULARY];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = seededRandom(i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const selectedWords = shuffled.slice(0, 10);
    
    // Create quiz questions
    return selectedWords.map((word) => {
      // Get 3 random wrong answers from other words
      const otherWords = UNIFIED_VOCABULARY.filter(w => w.id !== word.id);
      const wrongIndices = [];
      for (let i = 0; i < 3; i++) {
        let idx;
        do {
          idx = seededRandom(otherWords.length);
        } while (wrongIndices.includes(idx));
        wrongIndices.push(idx);
      }
      const wrongAnswers = wrongIndices.map(idx => otherWords[idx].definition);
      
      const allAnswers = [word.definition, ...wrongAnswers];
      // Shuffle answers
      for (let i = allAnswers.length - 1; i > 0; i--) {
        const j = seededRandom(i + 1);
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
      }
      
      const correctIndex = allAnswers.indexOf(word.definition);
      
      // Assign difficulty based on word id
      let difficulty = 'intermediate';
      if (word.id <= 6) difficulty = 'beginner';
      else if (word.id >= 13) difficulty = 'advanced';
      
      // Assign category based on word id
      let category = 'all';
      if (word.id % 3 === 0) category = 'action';
      else if (word.id % 3 === 1) category = 'academic';
      else category = 'all';
      
      return {
        id: word.id,
        question: `What does "${word.word}" mean?`,
        options: allAnswers,
        correct: correctIndex,
        word: word.word,
        definition: word.definition,
        difficulty: difficulty,
        category: category
      };
    });
  };

  // Filter quizzes based on category
  useEffect(() => {
    const dailyQuiz = generateDailyQuiz();
    
    if (selectedCategory === 'all') {
      setFilteredQuizzes(dailyQuiz);
    } else {
      setFilteredQuizzes(dailyQuiz.filter(q => q.category === selectedCategory || 
        (selectedCategory === 'beginner' && q.difficulty === 'beginner') ||
        (selectedCategory === 'intermediate' && q.difficulty === 'intermediate') ||
        (selectedCategory === 'advanced' && q.difficulty === 'advanced')));
    }
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  }, [selectedCategory, dailySeed]);

  const current = filteredQuizzes[currentIndex];
  const progress = filteredQuizzes.length > 0 ? ((currentIndex + 1) / filteredQuizzes.length) * 100 : 0;

  const handleAnswer = (index) => {
    if (!answered && current) {
      setSelectedAnswer(index);
      setAnswered(true);
      
      const isCorrect = index === current.correct;
      if (isCorrect) {
        setScore(score + 1);
      }
      
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
      
      if (currentProgress) {
        const updates = {
          totalAnswers: (currentProgress.totalAnswers || 0) + 1,
          quiz: {
            ...currentProgress.quiz,
            totalQuestions: (currentProgress.quiz?.totalQuestions || 0) + 1,
            correctAnswers: isCorrect 
              ? (currentProgress.quiz?.correctAnswers || 0) + 1 
              : (currentProgress.quiz?.correctAnswers || 0)
          }
        };
        
        if (isCorrect) {
          updates.correctAnswers = (currentProgress.correctAnswers || 0) + 1;
          updates.totalPoints = (currentProgress.totalPoints || 0) + 10;
          updates.xp = (currentProgress.xp || 0) + 5;
          updates.wordsLearned = (currentProgress.wordsLearned || 0) + 1;
        }
        
        updateProgress(updates);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setGameState('finished');
    }
  };

  const handleRestart = () => {
    setGameState('intro');
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  useEffect(() => {
    if (gameState === 'finished' && filteredQuizzes.length > 0) {
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
      
      if (currentProgress) {
        const updates = {
          gamesPlayed: (currentProgress.gamesPlayed || 0) + 1,
          quiz: {
            ...currentProgress.quiz,
            gamesCompleted: (currentProgress.quiz?.gamesCompleted || 0) + 1
          }
        };
        
        if (score === filteredQuizzes.length) {
          updates.achievements = {
            ...currentProgress.achievements,
            perfectScore: true
          };
          updates.xp = (currentProgress.xp || 0) + 30;
          updates.totalPoints = (currentProgress.totalPoints || 0) + 100;
        } else {
          updates.xp = (currentProgress.xp || 0) + 15;
          updates.totalPoints = (currentProgress.totalPoints || 0) + 40;
        }
        
        updateProgress(updates);
      }
    }
  }, [gameState, score, filteredQuizzes.length]);

  // Welcome Screen - Matching MatchGame style
  if (gameState === 'intro') {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return (
      <div style={{ 
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '24px',
        color: '#1e293b'
      }}>
     

        {/* Hero Section - Matching MatchGame style */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #e6e0ff',
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>📝</div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '12px', 
            fontFamily: "'Inter', 'Poppins', sans-serif"
          }}>
            Daily Vocabulary Quiz
          </h2>
          <p style={{ 
            fontSize: '13px', 
            color: '#475569', 
            lineHeight: '1.6', 
            marginBottom: '24px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            maxWidth: '600px',
            margin: '0 auto 24px'
          }}>
            Test your knowledge with 10 new words every day
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>10</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Questions</div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>+5</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>XP Each</div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>Daily</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Challenge</div>
            </div>
          </div>
        </div>

        {/* Categories Section - Matching MatchGame style */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '16px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Filter by Category
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {categories.map(category => {
              const count = category.id === 'all' ? 10 : 
                category.id === 'beginner' ? filteredQuizzes.filter(q => q.difficulty === 'beginner').length :
                category.id === 'intermediate' ? filteredQuizzes.filter(q => q.difficulty === 'intermediate').length :
                category.id === 'advanced' ? filteredQuizzes.filter(q => q.difficulty === 'advanced').length :
                filteredQuizzes.filter(q => q.category === category.id).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    background: selectedCategory === category.id ? category.color : '#ffffff',
                    border: `1px solid ${selectedCategory === category.id ? category.color : '#e2e8f0'}`,
                    borderRadius: '16px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: selectedCategory === category.id ? '0 4px 12px rgba(124, 111, 214, 0.2)' : 'none',
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  <span style={{ fontSize: '28px', marginBottom: '4px' }}>{category.icon}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: selectedCategory === category.id ? 'white' : '#0f172a',
                    fontFamily: "'Inter', 'Poppins', sans-serif"
                  }}>
                    {category.name}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: selectedCategory === category.id ? 'rgba(255,255,255,0.9)' : '#64748b',
                    background: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: '100px',
                  }}>
                    {count} {count === 1 ? 'question' : 'questions'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Challenge Note - Matching MatchGame style */}
        <div style={{ 
          marginBottom: '24px',
          background: '#f8f7ff',
          borderRadius: '14px',
          padding: '15px',
          border: '1px solid #e6e0ff'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#0f172a', 
                margin: '0 0 4px 0'
              }}>
                Daily Challenge
              </h4>
              <p style={{ 
                fontSize: '13px', 
                color: '#475569', 
                margin: '0'
              }}>
                A new set of 10 questions every day. Come back tomorrow for a fresh challenge!
              </p>
            </div>
          </div>
        </div>

        {/* Start Button - Matching MatchGame style */}
        <button 
          onClick={() => setGameState('playing')} 
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: '500', 
            transition: 'all 0.2s ease', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            boxShadow: '0 8px 20px rgba(124, 111, 214, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 111, 214, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 111, 214, 0.3)';
          }}
        >
          Start Daily Quiz
        </button>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  // Playing Screen - Matching MatchGame style
  if (gameState === 'playing') {
    if (!current) {
      return (
        <div style={{ 
          fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
          maxWidth: '600px', 
          margin: '0 auto', 
          padding: '24px'
        }}>
          <div style={{ 
            background: 'white',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid #edf2f7',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: '#94a3b8' }}>📭</div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
              No Questions
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              Try another category
            </p>
            <button
              onClick={() => setGameState('intro')}
              style={{
                padding: '12px 28px',
                background: '#7c6fd6',
                color: 'white',
                border: 'none',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#6b5ec5';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#7c6fd6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Back to Categories
            </button>
          </div>
        </div>
      );
    }

    const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

    return (
      <div style={{ 
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
        maxWidth: '720px', 
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Header - Matching MatchGame style */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}>
          <button 
            onClick={() => setGameState('intro')} 
            style={{ 
              background: 'white', 
              border: '1px solid #e2e8f0', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#475569', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Exit
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', color: currentCategory.color }}>{currentCategory.icon}</span>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              color: '#0f172a', 
              margin: '0', 
              fontFamily: "'Inter', 'Poppins', sans-serif" 
            }}>
              {currentCategory.name}
            </h1>
          </div>
          
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            background: '#f8f7ff',
            color: '#7c6fd6',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid #e6e0ff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎯 {score}/{filteredQuizzes.length}</span>
          </div>
        </div>

        {/* Progress Bar - Matching MatchGame style */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '13px',
            color: '#64748b',
          }}>
            <span>Question {currentIndex + 1} of {filteredQuizzes.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: '#f1f5f9', 
            borderRadius: '100px', 
            overflow: 'hidden',
          }}>
            <div style={{ 
              height: '100%', 
              background: `linear-gradient(90deg, ${currentCategory.color}, ${currentCategory.color}dd)`, 
              width: `${progress}%`, 
              transition: 'width 0.3s ease',
              borderRadius: '100px',
            }} />
          </div>
        </div>

        {/* Question Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '24px', 
          padding: '32px', 
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          border: '1px solid #e6e0ff',
          marginBottom: '24px'
        }}>
          {/* Difficulty Badge */}
          {current.difficulty && (
            <div style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: '600',
              background: current.difficulty === 'beginner' ? '#e8f5e9' : 
                         current.difficulty === 'intermediate' ? '#fff4e5' : '#ffebee',
              color: current.difficulty === 'beginner' ? '#2e7d32' : 
                     current.difficulty === 'intermediate' ? '#b85c1a' : '#b91c1c',
              marginBottom: '20px'
            }}>
              {current.difficulty}
            </div>
          )}

          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '28px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            lineHeight: '1.5'
          }}>
            {current.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {current.options.map((option, idx) => {
              let bgColor = 'white';
              let borderColor = '#e2e8f0';
              let textColor = '#1e293b';

              if (answered) {
                if (idx === current.correct) {
                  bgColor = '#e8f5e9';
                  borderColor = '#4ade80';
                  textColor = '#166534';
                } else if (idx === selectedAnswer && idx !== current.correct) {
                  bgColor = '#fee2e2';
                  borderColor = '#fecaca';
                  textColor = '#991b1b';
                } else {
                  bgColor = '#f8fafc';
                  borderColor = '#e2e8f0';
                  textColor = '#94a3b8';
                }
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(idx)} 
                  disabled={answered}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    padding: '16px 20px', 
                    border: `2px solid ${borderColor}`, 
                    borderRadius: '16px', 
                    background: bgColor, 
                    textAlign: 'left', 
                    fontSize: '15px', 
                    fontWeight: '500', 
                    color: textColor, 
                    transition: 'all 0.2s ease', 
                    fontFamily: "'Inter', 'Poppins', sans-serif", 
                    cursor: answered ? 'default' : 'pointer',
                    width: '100%',
                    boxShadow: !answered && !borderColor.includes('e2') ? '0 4px 12px rgba(124, 111, 214, 0.1)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (!answered) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#7c6fd6';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(124, 111, 214, 0.15)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!answered) {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <span style={{ 
                    fontWeight: '700', 
                    color: answered ? (idx === current.correct ? '#22c55e' : idx === selectedAnswer ? '#ef4444' : '#94a3b8') : '#7c6fd6', 
                    minWidth: '28px',
                    fontSize: '16px'
                  }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span style={{ flex: 1 }}>{option}</span>
                  {answered && idx === current.correct && <span style={{ color: '#22c55e', fontSize: '20px' }}>✓</span>}
                  {answered && idx === selectedAnswer && idx !== current.correct && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Button - Matching MatchGame style */}
        {answered && (
          <button 
            onClick={handleNext}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50px', 
              cursor: 'pointer', 
              fontSize: '16px', 
              fontWeight: '500',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(124, 111, 214, 0.3)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 111, 214, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 111, 214, 0.3)';
            }}
          >
            {currentIndex === filteredQuizzes.length - 1 ? 'Finish Quiz' : 'Next Question'}
            {currentIndex < filteredQuizzes.length - 1 && <span style={{ fontSize: '18px' }}>→</span>}
          </button>
        )}
      </div>
    );
  }

  // Finished Screen - Matching MatchGame style
  if (gameState === 'finished') {
    const percentage = Math.round((score / filteredQuizzes.length) * 100);
    const today = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });

    return (
      <div style={{ 
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '24px'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}>
          <button 
            onClick={() => setGameState('intro')} 
            style={{ 
              background: 'white', 
              border: '1px solid #e2e8f0', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#475569', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Back
          </button>
          
          <h1 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#0f172a', 
            margin: '0', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            Quiz Complete!
          </h1>
          
          <div style={{ width: '40px' }}></div>
        </div>

        {/* Results Card */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '40px', 
          textAlign: 'center', 
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          border: '1px solid #e6e0ff',
        }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            {percentage === 100 ? '🏆' : '🎉'}
          </div>
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '8px', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            {percentage === 100 ? 'Perfect Score!' : 'Great Job!'}
          </h2>
          
          <p style={{ 
            fontSize: '16px', 
            color: '#475569', 
            marginBottom: '24px', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            {today}'s daily quiz
          </p>
          
          {/* Score Circle */}
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: `conic-gradient(#7c6fd6 0% ${percentage}%, #f1f5f9 ${percentage}% 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '700',
              color: '#7c6fd6'
            }}>
              {percentage}%
            </div>
          </div>
          
          {/* Score Details */}
          <div style={{ 
            background: '#f8f7ff', 
            borderRadius: '16px', 
            padding: '20px', 
            marginBottom: '28px',
            border: '1px solid #e6e0ff'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '12px',
              fontSize: '15px'
            }}>
              <span style={{ color: '#475569' }}>Your Score</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{score}/{filteredQuizzes.length}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '15px'
            }}>
              <span style={{ color: '#475569' }}>XP Earned</span>
              <span style={{ fontWeight: '600', color: '#7c6fd6' }}>
                +{score === filteredQuizzes.length ? 30 : 15}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleRestart} 
              style={{ 
                flex: 1, 
                padding: '14px', 
                background: '#7c6fd6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '100px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: '600', 
                fontFamily: "'Inter', 'Poppins', sans-serif",
                boxShadow: '0 4px 12px rgba(124, 111, 214, 0.2)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#6b5ec5';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#7c6fd6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '18px' }}>🔄</span>
              Play Again
            </button>
            
            <button 
              onClick={onBack} 
              style={{ 
                flex: 1, 
                padding: '14px', 
                background: 'white', 
                color: '#475569', 
                border: '1px solid #e2e8f0', 
                borderRadius: '100px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: '600', 
                fontFamily: "'Inter', 'Poppins', sans-serif",
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#7c6fd6';
                e.currentTarget.style.color = '#7c6fd6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <span style={{ fontSize: '18px' }}>🎮</span>
              More Games
            </button>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }
};

const MatchGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('intro');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredPairs, setFilteredPairs] = useState([]);

  // Define categories - matching GuessWhat style
  const categories = [
    { id: 'all', name: 'All Images', icon: '🖼️', color: '#7c6fd6' },
    { id: 'animals', name: 'Animals', icon: '🐾', color: '#9b8de8' },
    { id: 'food', name: 'Food & Drinks', icon: '🍜', color: '#ff9f4b' },
    { id: 'nature', name: 'Nature', icon: '🌿', color: '#ff6b6b' },
    { id: 'objects', name: 'Everyday Objects', icon: '📱', color: '#4ecdc4' },
    { id: 'people', name: 'People & Professions', icon: '👥', color: '#a06cd5' },
  ];

  // Image library with categories
  const imageLibrary = [
    // Animals
    { id: 101, word: 'Lion', imageUrl: 'https://placehold.co/400x400/9b8de8/white?text=Lion', category: 'animals' },
    { id: 102, word: 'Elephant', imageUrl: 'https://placehold.co/400x400/9b8de8/white?text=Elephant', category: 'animals' },
    { id: 103, word: 'Giraffe', imageUrl: 'https://placehold.co/400x400/9b8de8/white?text=Giraffe', category: 'animals' },
    { id: 104, word: 'Penguin', imageUrl: 'https://placehold.co/400x400/9b8de8/white?text=Penguin', category: 'animals' },
    { id: 105, word: 'Kangaroo', imageUrl: 'https://placehold.co/400x400/9b8de8/white?text=Kangaroo', category: 'animals' },
    { id: 106, word: 'Dolphin', imageUrl: 'https://placehold.co/400x400/9b8de8/white?text=Dolphin', category: 'animals' },

    // Food & Drinks
    { id: 201, word: 'Pizza', imageUrl: 'https://placehold.co/400x400/ff9f4b/white?text=Pizza', category: 'food' },
    { id: 202, word: 'Sushi', imageUrl: 'https://placehold.co/400x400/ff9f4b/white?text=Sushi', category: 'food' },
    { id: 203, word: 'Coffee', imageUrl: 'https://placehold.co/400x400/ff9f4b/white?text=Coffee', category: 'food' },
    { id: 204, word: 'Pasta', imageUrl: 'https://placehold.co/400x400/ff9f4b/white?text=Pasta', category: 'food' },
    { id: 205, word: 'Taco', imageUrl: 'https://placehold.co/400x400/ff9f4b/white?text=Taco', category: 'food' },
    { id: 206, word: 'Croissant', imageUrl: 'https://placehold.co/400x400/ff9f4b/white?text=Croissant', category: 'food' },

    // Nature
    { id: 301, word: 'Mountain', imageUrl: 'https://placehold.co/400x400/ff6b6b/white?text=Mountain', category: 'nature' },
    { id: 302, word: 'Ocean', imageUrl: 'https://placehold.co/400x400/ff6b6b/white?text=Ocean', category: 'nature' },
    { id: 303, word: 'Forest', imageUrl: 'https://placehold.co/400x400/ff6b6b/white?text=Forest', category: 'nature' },
    { id: 304, word: 'Waterfall', imageUrl: 'https://placehold.co/400x400/ff6b6b/white?text=Waterfall', category: 'nature' },
    { id: 305, word: 'Desert', imageUrl: 'https://placehold.co/400x400/ff6b6b/white?text=Desert', category: 'nature' },
    { id: 306, word: 'Aurora', imageUrl: 'https://placehold.co/400x400/ff6b6b/white?text=Aurora', category: 'nature' },

    // Everyday Objects
    { id: 401, word: 'Laptop', imageUrl: 'https://placehold.co/400x400/4ecdc4/white?text=Laptop', category: 'objects' },
    { id: 402, word: 'Watch', imageUrl: 'https://placehold.co/400x400/4ecdc4/white?text=Watch', category: 'objects' },
    { id: 403, word: 'Book', imageUrl: 'https://placehold.co/400x400/4ecdc4/white?text=Book', category: 'objects' },
    { id: 404, word: 'Camera', imageUrl: 'https://placehold.co/400x400/4ecdc4/white?text=Camera', category: 'objects' },
    { id: 405, word: 'Headphones', imageUrl: 'https://placehold.co/400x400/4ecdc4/white?text=Headphones', category: 'objects' },
    { id: 406, word: 'Lamp', imageUrl: 'https://placehold.co/400x400/4ecdc4/white?text=Lamp', category: 'objects' },

    // People & Professions
    { id: 501, word: 'Doctor', imageUrl: 'https://placehold.co/400x400/a06cd5/white?text=Doctor', category: 'people' },
    { id: 502, word: 'Teacher', imageUrl: 'https://placehold.co/400x400/a06cd5/white?text=Teacher', category: 'people' },
    { id: 503, word: 'Chef', imageUrl: 'https://placehold.co/400x400/a06cd5/white?text=Chef', category: 'people' },
    { id: 504, word: 'Artist', imageUrl: 'https://placehold.co/400x400/a06cd5/white?text=Artist', category: 'people' },
    { id: 505, word: 'Musician', imageUrl: 'https://placehold.co/400x400/a06cd5/white?text=Musician', category: 'people' },
    { id: 506, word: 'Astronaut', imageUrl: 'https://placehold.co/400x400/a06cd5/white?text=Astronaut', category: 'people' },
  ];

  // Update filtered pairs when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPairs(imageLibrary.slice(0, 8)); // Take first 8 for all categories
    } else {
      setFilteredPairs(imageLibrary.filter(img => img.category === selectedCategory).slice(0, 6));
    }
    resetGame();
  }, [selectedCategory]);

  const resetGame = () => {
    setCards([]);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMoves(0);
  };

  const initializeGame = () => {
    const pairs = filteredPairs.length > 0 ? filteredPairs : imageLibrary.slice(0, 6);
    
    const gameCards = [];
    pairs.forEach(item => {
      // Image card
      gameCards.push({ 
        id: `img-${item.id}`, 
        type: 'image', 
        imageUrl: item.imageUrl,
        word: item.word,
        pairId: item.id 
      });
      // Word card
      gameCards.push({ 
        id: `word-${item.id}`, 
        type: 'word', 
        text: item.word,
        pairId: item.id 
      });
    });
    
    // Shuffle cards
    const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const handleStartGame = () => {
    initializeGame();
    setGameState('playing');
  };

  const handleRestart = () => {
    initializeGame();
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMoves(0);
  };

  const handleBackToIntro = () => {
    setGameState('intro');
    resetGame();
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);
      
      const [first, second] = flipped;
      const isMatch = cards[first].pairId === cards[second].pairId;
      
      if (isMatch) {
        setMatched([...matched, cards[first].pairId]);
        setScore(prev => prev + 1);
        
        // Update progress
        const savedProgress = localStorage.getItem('vocaboplay_progress');
        const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
        
        if (currentProgress) {
          updateProgress({
            totalPoints: (currentProgress.totalPoints || 0) + 12,
            xp: (currentProgress.xp || 0) + 6,
            correctAnswers: (currentProgress.correctAnswers || 0) + 1,
          });
        }
        
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }, [flipped, cards, matched, moves]);

  const handleCardClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(cards[index].pairId)) {
      setFlipped([...flipped, index]);
    }
  };

  useEffect(() => {
    if (matched.length > 0 && matched.length === filteredPairs.length) {
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
      
      if (currentProgress) {
        const efficiencyBonus = moves <= filteredPairs.length * 1.5 ? 20 : moves <= filteredPairs.length * 2 ? 10 : 5;
        const totalXP = 15 + efficiencyBonus;
        
        updateProgress({
          gamesPlayed: (currentProgress.gamesPlayed || 0) + 1,
          xp: (currentProgress.xp || 0) + totalXP,
          totalPoints: (currentProgress.totalPoints || 0) + (totalXP * 2),
          match: {
            ...currentProgress.match,
            gamesCompleted: (currentProgress.match?.gamesCompleted || 0) + 1,
          }
        });
      }
    }
  }, [matched, moves, filteredPairs.length]);

  const progress = filteredPairs.length > 0 ? (matched.length / filteredPairs.length) * 100 : 0;
  const isComplete = matched.length === filteredPairs.length;
  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

  // Intro Screen - Matching GuessWhat style exactly
  if (gameState === 'intro') {
    return (
      <div style={{ fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '900px', margin: '0 auto', padding: '24px' }}>

        {/* Hero Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #e6e0ff',
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>🎴</div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '12px', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            Welcome to MatchGame!
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#475569', 
            lineHeight: '1.6', 
            marginBottom: '24px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            maxWidth: '600px',
            margin: '0 auto 24px'
          }}>
            Test your memory by matching each image with its correct word. Find all pairs to win!
          </p>
          
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '16px', 
            padding: '24px', 
            marginBottom: '28px', 
            textAlign: 'left',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#7c6fd6', 
              marginBottom: '16px', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              How to Play:
            </h3>
            <ul style={{ 
              paddingLeft: '20px', 
              fontSize: '14px', 
              color: '#475569', 
              lineHeight: '1.8',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              margin: 0
            }}>
              <li>Choose a category below or play with all images</li>
              <li>Click on cards to reveal the image or word</li>
              <li>Match each image with its correct word</li>
              <li>Complete the game with fewer moves for bonus points!</li>
            </ul>
          </div>
        </div>

        {/* Categories Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '16px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Choose a Category
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {categories.map(category => {
              const count = category.id === 'all' 
                ? 8 
                : imageLibrary.filter(img => img.category === category.id).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    background: selectedCategory === category.id ? category.color : '#ffffff',
                    border: `1px solid ${selectedCategory === category.id ? category.color : '#e2e8f0'}`,
                    borderRadius: '16px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: selectedCategory === category.id ? '0 4px 12px rgba(124, 111, 214, 0.2)' : 'none',
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  <span style={{ fontSize: '28px', marginBottom: '4px' }}>{category.icon}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: selectedCategory === category.id ? 'white' : '#0f172a',
                    fontFamily: "'Inter', 'Poppins', sans-serif"
                  }}>
                    {category.name}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: selectedCategory === category.id ? 'rgba(255,255,255,0.9)' : '#64748b',
                    background: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: '100px',
                  }}>
                    {count} {count === 1 ? 'pair' : 'pairs'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button 
          onClick={handleStartGame} 
          style={{ 
            width: '100%', 
            padding: '10px', 
            background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: '400', 
            transition: 'all 0.2s ease', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            boxShadow: '0 8px 20px rgba(124, 111, 214, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 111, 214, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 111, 214, 0.3)';
          }}
        >
          Start {selectedCategory === 'all' ? 'Game' : categories.find(c => c.id === selectedCategory)?.name || 'Game'}
        </button>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  // Playing Screen - Matching GuessWhat style
  if (gameState === 'playing') {
    const gridCols = 4; // 4x4 grid for 8 pairs

    return (
      <div style={{ fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}>
          <button 
            onClick={handleBackToIntro} 
            style={{ 
              background: 'white', 
              border: '1px solid #e2e8f0', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#475569', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Exit
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', color: currentCategory.color }}>{currentCategory.icon}</span>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              color: '#0f172a', 
              margin: '0', 
              fontFamily: "'Inter', 'Poppins', sans-serif" 
            }}>
              {currentCategory.name}
            </h1>
          </div>
          
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            background: '#f8f7ff',
            color: '#7c6fd6',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid #e6e0ff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎯 {score}/{filteredPairs.length}</span>
            <span>🔄 {moves}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '13px',
            color: '#64748b',
          }}>
            <span>{matched.length} of {filteredPairs.length * 2} cards matched</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: '#f1f5f9', 
            borderRadius: '100px', 
            overflow: 'hidden',
          }}>
            <div style={{ 
              height: '100%', 
              background: `linear-gradient(90deg, ${currentCategory.color}, ${currentCategory.color}dd)`, 
              width: `${progress}%`, 
              transition: 'width 0.3s ease',
              borderRadius: '100px',
            }} />
          </div>
        </div>

        {/* Game Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`, 
          gap: '12px', 
          marginBottom: '24px'
        }}>
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(card.pairId);
            const isMatched = matched.includes(card.pairId);
            
            return (
              <div 
                key={`${card.id}-${index}`} 
                onClick={() => !isMatched && handleCardClick(index)} 
                style={{ 
                  aspectRatio: '1', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: isMatched ? 'default' : 'pointer', 
                  transition: 'all 0.2s ease', 
                  background: isFlipped 
                    ? 'white' 
                    : `linear-gradient(135deg, ${currentCategory.color}, ${currentCategory.color}dd)`, 
                  opacity: isMatched ? 0.5 : 1, 
                  border: isFlipped ? '1px solid #e2e8f0' : 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  if (!isFlipped && !isMatched) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 111, 214, 0.2)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isFlipped && !isMatched) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  }
                }}
              >
                {isFlipped ? (
                  card.type === 'image' ? (
                    <img 
                      src={card.imageUrl} 
                      alt={card.word}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: '16px'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      textAlign: 'center',
                      padding: '8px'
                    }}>
                      {card.text}
                    </div>
                  )
                ) : (
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: '500', 
                    color: 'white'
                  }}>
                    ?
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Restart Button */}
        {!isComplete && (
          <button 
            onClick={handleRestart}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'white', 
              color: '#475569', 
              border: '1px solid #e2e8f0', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = currentCategory.color;
              e.currentTarget.style.color = currentCategory.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <span style={{ fontSize: '18px' }}>🔄</span>
            Shuffle Cards
          </button>
        )}
      </div>
    );
  }

  // Finished Screen - Matching GuessWhat style
  const percentage = filteredPairs.length > 0 ? Math.round((score / filteredPairs.length) * 100) : 0;
  
  return (
    <div style={{ fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '20px',
      }}>
        <button 
          onClick={handleBackToIntro} 
          style={{ 
            background: 'white', 
            border: '1px solid #e2e8f0', 
            padding: '8px 20px', 
            borderRadius: '100px', 
            cursor: 'pointer', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#475569', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          Back
        </button>
        
        <h1 style={{ 
          fontSize: '22px', 
          fontWeight: '600', 
          color: '#0f172a', 
          margin: '0', 
          fontFamily: "'Inter', 'Poppins', sans-serif" 
        }}>
          Game Complete!
        </h1>
        
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Results Card */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '24px', 
        padding: '40px', 
        textAlign: 'center', 
        boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
        border: '1px solid #e6e0ff',
      }}>
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '20px',
          animation: 'float 3s ease-in-out infinite'
        }}>
          {percentage === 100 ? '🏆' : '🎉'}
        </div>
        
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          color: '#0f172a', 
          marginBottom: '8px', 
          fontFamily: "'Inter', 'Poppins', sans-serif" 
        }}>
          {percentage === 100 ? 'Perfect Match!' : 'Great Memory!'}
        </h2>
        
        <p style={{ 
          fontSize: '16px', 
          color: '#475569', 
          marginBottom: '24px', 
          fontFamily: "'Inter', 'Poppins', sans-serif" 
        }}>
          You found {score} out of {filteredPairs.length} pairs in {moves} moves
        </p>
        
        {/* Score Circle */}
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: `conic-gradient(#7c6fd6 0% ${percentage}%, #f1f5f9 ${percentage}% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: '700',
            color: '#7c6fd6'
          }}>
            {percentage}%
          </div>
        </div>
        
        {/* Message */}
        <div style={{ 
          background: '#f8f7ff', 
          borderRadius: '16px', 
          padding: '20px', 
          marginBottom: '28px',
          border: '1px solid #e6e0ff'
        }}>
          <p style={{ 
            fontSize: '15px', 
            color: '#475569', 
            margin: 0,
            fontFamily: "'Inter', 'Poppins', sans-serif",
            lineHeight: '1.6'
          }}>
            {score === filteredPairs.length ? 'Amazing! You found all pairs! 🏆' : 
             score >= filteredPairs.length / 2 ? 'Great work! Keep practicing to improve! 👍' : 
             'Good start! Practice makes perfect! 💪'}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleRestart} 
            style={{ 
              flex: 1, 
              padding: '14px', 
              background: '#7c6fd6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '600', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              boxShadow: '0 4px 12px rgba(124, 111, 214, 0.2)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#6b5ec5';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#7c6fd6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '18px' }}>🔄</span>
            Play Again
          </button>
          
          <button 
            onClick={onBack} 
            style={{ 
              flex: 1, 
              padding: '14px', 
              background: 'white', 
              color: '#475569', 
              border: '1px solid #e2e8f0', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '600', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#7c6fd6';
              e.currentTarget.style.color = '#7c6fd6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <span style={{ fontSize: '18px' }}>🎮</span>
            More Games
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const GuessWhatGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // Define categories
  const categories = [
    { id: 'all', name: 'All Words', icon: '📚', color: '#7c6fd6' },
    { id: 'action', name: 'Action Words', icon: '🏃', color: '#9b8de8' },
    { id: 'focus', name: 'Focus & Attention', icon: '🎯', color: '#ff9f4b' },
    { id: 'collaboration', name: 'Collaboration', icon: '🤝', color: '#ff6b6b' },
    { id: 'analysis', name: 'Analysis', icon: '🔍', color: '#4ecdc4' },
    { id: 'communication', name: 'Communication', icon: '💬', color: '#a06cd5' },
    { id: 'problem-solving', name: 'Problem Solving', icon: '🧩', color: '#45b7d1' },
    { id: 'creativity', name: 'Creativity', icon: '🎨', color: '#f9ca24' },
    { id: 'leadership', name: 'Leadership', icon: '👑', color: '#e67e22' },
    { id: 'technology', name: 'Technology', icon: '💻', color: '#3498db' },
  ];

  // Enhanced questions with categories
  const allQuestions = [
    // Action Words Category (existing)
    {
      id: 1,
      question: 'Which word describes being actively involved in something?',
      image: 'src/assets/brushing.png',
      sentence: 'Students who ______ in class discussions often understand the material better.',
      answer: 'Participate',
      options: ['Engage', 'Observe', 'Listen', 'Participate', 'Watch'],
      category: 'action',
      difficulty: 'beginner',
      hint: 'Being part of an activity'
    },
    {
      id: 2,
      question: 'What word means working jointly with others?',
      image: 'https://via.placeholder.com/300x200/4ECDC4/ffffff?text=Team+Work',
      sentence: 'The two companies decided to ______ on the new project to combine their expertise.',
      answer: 'Collaborate',
      options: ['Compete', 'Collaborate', 'Ignore', 'Avoid', 'Separate'],
      category: 'collaboration',
      difficulty: 'beginner',
      hint: 'Team up'
    },
    {
      id: 3,
      question: 'Which word means to put things in a systematic order?',
      image: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Arrange+Items',
      sentence: 'Before the big presentation, she needed to ______ her thoughts and materials.',
      answer: 'Organize',
      options: ['Scatter', 'Organize', 'Confuse', 'Mix', 'Randomize'],
      category: 'action',
      difficulty: 'intermediate',
      hint: 'Put in order'
    },
    
    // Focus & Attention Category (existing)
    {
      id: 4,
      question: 'What word describes directing all your mental energy toward one thing?',
      image: 'src/assets/cooking.png',
      sentence: 'To solve complex problems, you need to ______ fully on the task at hand.',
      answer: 'Concentrate',
      options: ['Distract', 'Concentrate', 'Ignore', 'Forget', 'Wander'],
      category: 'focus',
      difficulty: 'beginner',
      hint: 'Pay attention'
    },
    {
      id: 5,
      question: 'What does it mean to watch something carefully?',
      image: 'https://via.placeholder.com/300x200/FF6B6B/ffffff?text=Watch+Carefully',
      sentence: 'The scientist used a microscope to ______ the behavior of the tiny organisms.',
      answer: 'Observe',
      options: ['Ignore', 'Observe', 'Forget', 'Miss', 'Overlook'],
      category: 'focus',
      difficulty: 'intermediate',
      hint: 'Watch carefully'
    },
    
    // Analysis Category (existing)
    {
      id: 6,
      question: 'What word means to examine something methodically?',
      image: 'https://via.placeholder.com/300x200/FFE66D/333333?text=Think+Deeply',
      sentence: 'The detective needed to ______ all the evidence before solving the mystery.',
      answer: 'Analyze',
      options: ['Guess', 'Analyze', 'Ignore', 'Skip', 'Assume'],
      category: 'analysis',
      difficulty: 'intermediate',
      hint: 'Examine carefully'
    },
    {
      id: 7,
      question: 'What does it mean to look for similarities and differences?',
      image: 'https://via.placeholder.com/300x200/9C27B0/ffffff?text=Find+Similarities',
      sentence: 'When shopping for a new phone, it helps to ______ different models before deciding.',
      answer: 'Compare',
      options: ['Buy', 'Compare', 'Ignore', 'Choose', 'Pick'],
      category: 'analysis',
      difficulty: 'intermediate',
      hint: 'Find similarities and differences'
    },
    
    // Communication Category (existing)
    {
      id: 8,
      question: 'What word means to exchange information with others?',
      image: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=Share+Ideas',
      sentence: 'In today\'s global world, it\'s essential to ______ effectively across cultures.',
      answer: 'Communicate',
      options: ['Hide', 'Communicate', 'Keep', 'Withhold', 'Silence'],
      category: 'communication',
      difficulty: 'intermediate',
      hint: 'Share information'
    },
    {
      id: 9,
      question: 'What does it mean to make something clear and understandable?',
      image: 'https://via.placeholder.com/300x200/3F51B5/ffffff?text=Make+Clear',
      sentence: 'The teacher asked the student to ______ the answer so everyone could understand.',
      answer: 'Explain',
      options: ['Confuse', 'Explain', 'Hide', 'Mislead', 'Complicate'],
      category: 'communication',
      difficulty: 'beginner',
      hint: 'Make clear'
    },
    {
      id: 10,
      question: 'What word means to give a brief account of main points?',
      image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Main+Points',
      sentence: 'After the long meeting, the secretary will ______ the key decisions in an email.',
      answer: 'Summarize',
      options: ['Expand', 'Summarize', 'Detail', 'Elaborate', 'Prolong'],
      category: 'communication',
      difficulty: 'intermediate',
      hint: 'Brief statement'
    },
    
    // More Action Words (existing)
    {
      id: 11,
      question: 'What word means to show something with proof?',
      image: 'https://via.placeholder.com/300x200/FF6B6B/ffffff?text=Show+Example',
      sentence: 'The scientist will ______ how the new medicine works through a series of experiments.',
      answer: 'Demonstrate',
      options: ['Hide', 'Demonstrate', 'Conceal', 'Deny', 'Refute'],
      category: 'action',
      difficulty: 'intermediate',
      hint: 'Show how'
    },
    {
      id: 12,
      question: 'What word means to establish the identity of something?',
      image: 'https://via.placeholder.com/300x200/009688/ffffff?text=Recognize',
      sentence: 'Using the key features, you can ______ the different species of birds.',
      answer: 'Identify',
      options: ['Confuse', 'Identify', 'Mix', 'Mislead', 'Mistake'],
      category: 'analysis',
      difficulty: 'intermediate',
      hint: 'Point out'
    },
    {
      id: 13,
      question: 'What word means to carry out a systematic inquiry?',
      image: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Search',
      sentence: 'The journalist traveled to three countries to ______ the story thoroughly.',
      answer: 'Investigate',
      options: ['Ignore', 'Investigate', 'Avoid', 'Overlook', 'Skip'],
      category: 'analysis',
      difficulty: 'advanced',
      hint: 'Look into'
    },
    {
      id: 14,
      question: 'What word means to say what will happen in advance?',
      image: 'https://via.placeholder.com/300x200/9C27B0/ffffff?text=Future',
      sentence: 'Based on current data, economists ______ that the market will improve next quarter.',
      answer: 'Predict',
      options: ['Guess', 'Predict', 'Assume', 'Wonder', 'Doubt'],
      category: 'analysis',
      difficulty: 'intermediate',
      hint: 'Forecast'
    },
    {
      id: 15,
      question: 'What word means to reply or react to something?',
      image: 'https://via.placeholder.com/300x200/4ECDC4/ffffff?text=Reply',
      sentence: 'When someone asks you a question, it\'s polite to ______ promptly.',
      answer: 'Respond',
      options: ['Ignore', 'Respond', 'Delay', 'Avoid', 'Silence'],
      category: 'communication',
      difficulty: 'beginner',
      hint: 'Reply'
    },

    // NEW CATEGORIES

    // Problem Solving Category
    {
      id: 16,
      question: 'What word means to find a solution to a problem?',
      image: 'https://via.placeholder.com/300x200/45b7d1/ffffff?text=Solve',
      sentence: 'The team worked together to ______ the complex equation.',
      answer: 'Solve',
      options: ['Create', 'Solve', 'Make', 'Build', 'Form'],
      category: 'problem-solving',
      difficulty: 'beginner',
      hint: 'Find the answer'
    },
    {
      id: 17,
      question: 'What word means to think of a new idea or method?',
      image: 'https://via.placeholder.com/300x200/45b7d1/ffffff?text=Innovate',
      sentence: 'Companies must constantly ______ to stay ahead in the competitive market.',
      answer: 'Innovate',
      options: ['Copy', 'Innovate', 'Repeat', 'Imitate', 'Duplicate'],
      category: 'problem-solving',
      difficulty: 'intermediate',
      hint: 'Create something new'
    },
    {
      id: 18,
      question: 'What word means to judge the value or condition of something?',
      image: 'https://via.placeholder.com/300x200/45b7d1/ffffff?text=Evaluate',
      sentence: 'The manager will ______ each employee\'s performance during the review.',
      answer: 'Evaluate',
      options: ['Ignore', 'Evaluate', 'Forget', 'Overlook', 'Miss'],
      category: 'problem-solving',
      difficulty: 'intermediate',
      hint: 'Assess or judge'
    },
    {
      id: 19,
      question: 'What word means to come to a conclusion after reasoning?',
      image: 'https://via.placeholder.com/300x200/45b7d1/ffffff?text=Conclude',
      sentence: 'After reviewing all the evidence, the jury will ______ their deliberation.',
      answer: 'Conclude',
      options: ['Start', 'Conclude', 'Begin', 'Open', 'Initiate'],
      category: 'problem-solving',
      difficulty: 'advanced',
      hint: 'Finish or decide'
    },

    // Creativity Category
    {
      id: 20,
      question: 'What word means to bring something into existence?',
      image: 'https://via.placeholder.com/300x200/f9ca24/ffffff?text=Create',
      sentence: 'Artists have the ability to ______ beautiful works from imagination.',
      answer: 'Create',
      options: ['Destroy', 'Create', 'Break', 'Ruin', 'Spoil'],
      category: 'creativity',
      difficulty: 'beginner',
      hint: 'Make something new'
    },
    {
      id: 21,
      question: 'What word means to form a mental image of something?',
      image: 'https://via.placeholder.com/300x200/f9ca24/ffffff?text=Imagine',
      sentence: 'Close your eyes and ______ a world where anything is possible.',
      answer: 'Imagine',
      options: ['Forget', 'Imagine', 'Ignore', 'Dismiss', 'Reject'],
      category: 'creativity',
      difficulty: 'beginner',
      hint: 'Picture in your mind'
    },
    {
      id: 22,
      question: 'What word means to improve or bring up to date?',
      image: 'https://via.placeholder.com/300x200/f9ca24/ffffff?text=Enhance',
      sentence: 'The software update will ______ the app\'s performance and add new features.',
      answer: 'Enhance',
      options: ['Reduce', 'Enhance', 'Decrease', 'Lessen', 'Diminish'],
      category: 'creativity',
      difficulty: 'intermediate',
      hint: 'Make better'
    },
    {
      id: 23,
      question: 'What word means to change or improve something?',
      image: 'https://via.placeholder.com/300x200/f9ca24/ffffff?text=Transform',
      sentence: 'The renovation will completely ______ the old building into a modern space.',
      answer: 'Transform',
      options: ['Keep', 'Transform', 'Maintain', 'Preserve', 'Retain'],
      category: 'creativity',
      difficulty: 'intermediate',
      hint: 'Change completely'
    },

    // Leadership Category
    {
      id: 24,
      question: 'What word means to guide or direct a group?',
      image: 'https://via.placeholder.com/300x200/e67e22/ffffff?text=Lead',
      sentence: 'A good manager knows how to ______ their team toward success.',
      answer: 'Lead',
      options: ['Follow', 'Lead', 'Trail', 'Pursue', 'Chase'],
      category: 'leadership',
      difficulty: 'beginner',
      hint: 'Guide others'
    },
    {
      id: 25,
      question: 'What word means to give someone confidence or purpose?',
      image: 'https://via.placeholder.com/300x200/e67e22/ffffff?text=Inspire',
      sentence: 'Great speeches have the power to ______ people to take action.',
      answer: 'Inspire',
      options: ['Discourage', 'Inspire', 'Dismay', 'Dishearten', 'Demoralize'],
      category: 'leadership',
      difficulty: 'intermediate',
      hint: 'Motivate others'
    },
    {
      id: 26,
      question: 'What word means to give tasks or responsibilities to others?',
      image: 'https://via.placeholder.com/300x200/e67e22/ffffff?text=Delegate',
      sentence: 'Effective leaders know how to ______ tasks to their team members.',
      answer: 'Delegate',
      options: ['Hoard', 'Delegate', 'Keep', 'Retain', 'Withhold'],
      category: 'leadership',
      difficulty: 'advanced',
      hint: 'Assign to others'
    },
    {
      id: 27,
      question: 'What word means to settle a dispute by mutual concession?',
      image: 'https://via.placeholder.com/300x200/e67e22/ffffff?text=Negotiate',
      sentence: 'The two countries will ______ a peace treaty to end the conflict.',
      answer: 'Negotiate',
      options: ['Fight', 'Negotiate', 'Argue', 'Battle', 'Struggle'],
      category: 'leadership',
      difficulty: 'advanced',
      hint: 'Discuss terms'
    },

    // Technology Category
    {
      id: 28,
      question: 'What word means to write computer programs?',
      image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Code',
      sentence: 'Software engineers ______ applications that millions of people use daily.',
      answer: 'Code',
      options: ['Write', 'Code', 'Type', 'Print', 'Draw'],
      category: 'technology',
      difficulty: 'beginner',
      hint: 'Program computers'
    },
    {
      id: 29,
      question: 'What word means to make a machine or system work?',
      image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Operate',
      sentence: 'You need special training to ______ heavy machinery safely.',
      answer: 'Operate',
      options: ['Break', 'Operate', 'Stop', 'Halt', 'Cease'],
      category: 'technology',
      difficulty: 'intermediate',
      hint: 'Control or run'
    },
    {
      id: 30,
      question: 'What word means to set up hardware or software for use?',
      image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Install',
      sentence: 'The technician will ______ the new operating system on all computers.',
      answer: 'Install',
      options: ['Remove', 'Install', 'Delete', 'Uninstall', 'Eliminate'],
      category: 'technology',
      difficulty: 'intermediate',
      hint: 'Set up'
    },
    {
      id: 31,
      question: 'What word means to make something work more efficiently?',
      image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Optimize',
      sentence: 'Programmers constantly ______ code to make applications run faster.',
      answer: 'Optimize',
      options: ['Slow', 'Optimize', 'Worsen', 'Degrade', 'Damage'],
      category: 'technology',
      difficulty: 'advanced',
      hint: 'Make better'
    },

    // Additional Action Words
    {
      id: 32,
      question: 'What word means to carry out or accomplish something?',
      image: 'https://via.placeholder.com/300x200/9b8de8/ffffff?text=Achieve',
      sentence: 'With hard work and dedication, you can ______ your goals.',
      answer: 'Achieve',
      options: ['Fail', 'Achieve', 'Miss', 'Lose', 'Forfeit'],
      category: 'action',
      difficulty: 'intermediate',
      hint: 'Accomplish'
    },
    {
      id: 33,
      question: 'What word means to help or encourage someone?',
      image: 'https://via.placeholder.com/300x200/9b8de8/ffffff?text=Support',
      sentence: 'Friends should ______ each other during difficult times.',
      answer: 'Support',
      options: ['Oppose', 'Support', 'Hinder', 'Block', 'Prevent'],
      category: 'action',
      difficulty: 'beginner',
      hint: 'Give help'
    },

    // Additional Communication
    {
      id: 34,
      question: 'What word means to express an opinion or idea?',
      image: 'https://via.placeholder.com/300x200/a06cd5/ffffff?text=State',
      sentence: 'Please ______ your position clearly so everyone understands.',
      answer: 'State',
      options: ['Hide', 'State', 'Conceal', 'Withhold', 'Suppress'],
      category: 'communication',
      difficulty: 'beginner',
      hint: 'Say or express'
    },
    {
      id: 35,
      question: 'What word means to make a formal request?',
      image: 'https://via.placeholder.com/300x200/a06cd5/ffffff?text=Request',
      sentence: 'You can ______ additional information by filling out this form.',
      answer: 'Request',
      options: ['Demand', 'Request', 'Order', 'Command', 'Require'],
      category: 'communication',
      difficulty: 'intermediate',
      hint: 'Ask for'
    }
  ];

  // Process questions to ensure correct options
  const processedQuestions = allQuestions.map((q) => {
    // Shuffle options
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    return {
      ...q,
      options: shuffledOptions
    };
  });

  // Update filtered questions when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredQuestions(processedQuestions);
    } else {
      setFilteredQuestions(processedQuestions.filter(q => q.category === selectedCategory));
    }
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  }, [selectedCategory]);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleAnswer = (answer) => {
    if (!answered) {
      setSelectedAnswer(answer);
      setAnswered(true);
      
      const isCorrect = answer === filteredQuestions[currentQuestion].answer;
      if (isCorrect) {
        setScore(score + 1);
      }
      
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
      
      if (currentProgress) {
        const updates = {
          totalAnswers: (currentProgress.totalAnswers || 0) + 1,
          guessWhat: {
            ...currentProgress.guessWhat,
            totalQuestions: (currentProgress.guessWhat?.totalQuestions || 0) + 1,
            correctAnswers: isCorrect 
              ? (currentProgress.guessWhat?.correctAnswers || 0) + 1 
              : (currentProgress.guessWhat?.correctAnswers || 0)
          }
        };
        
        if (isCorrect) {
          updates.correctAnswers = (currentProgress.correctAnswers || 0) + 1;
          updates.totalPoints = (currentProgress.totalPoints || 0) + 12;
          updates.xp = (currentProgress.xp || 0) + 6;
          updates.wordsLearned = (currentProgress.wordsLearned || 0) + 1;
        }
        
        updateProgress(updates);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setGameState('finished');
    }
  };

  const handleRestart = () => {
    setGameState('intro');
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  useEffect(() => {
    if (gameState === 'finished') {
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
      
      if (currentProgress) {
        const updates = {
          gamesPlayed: (currentProgress.gamesPlayed || 0) + 1,
          guessWhat: {
            ...currentProgress.guessWhat,
            gamesCompleted: (currentProgress.guessWhat?.gamesCompleted || 0) + 1
          }
        };
        
        if (score === filteredQuestions.length) {
          updates.xp = (currentProgress.xp || 0) + 35;
          updates.totalPoints = (currentProgress.totalPoints || 0) + 80;
          updates.achievements = {
            ...currentProgress.achievements,
            perfectScore: true
          };
        } else {
          updates.xp = (currentProgress.xp || 0) + 15;
          updates.totalPoints = (currentProgress.totalPoints || 0) + 35;
        }
        
        updateProgress(updates);
      }
    }
  }, [gameState, score, filteredQuestions.length]);

  // Intro Screen with Categories
  if (gameState === 'intro') {
    return (
      <div style={{ fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '900px', margin: '0 auto', padding: '24px' }}>

        {/* Hero Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #e6e0ff',
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>🤔</div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '12px', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            Welcome to GuessWhat!
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#475569', 
            lineHeight: '1.6', 
            marginBottom: '24px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            maxWidth: '600px',
            margin: '0 auto 24px'
          }}>
            Test your vocabulary skills by guessing the correct word from context clues and images.
          </p>
          
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '16px', 
            padding: '24px', 
            marginBottom: '28px', 
            textAlign: 'left',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#7c6fd6', 
              marginBottom: '16px', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              How to Play:
            </h3>
            <ul style={{ 
              paddingLeft: '20px', 
              fontSize: '14px', 
              color: '#475569', 
              lineHeight: '1.8',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              margin: 0
            }}>
              <li>Choose a category below or play with all words</li>
              <li>Read the sentence with the blank</li>
              <li>Look at the context clue image</li>
              <li>Choose the correct word from the options</li>
              <li>Earn points for each correct answer!</li>
            </ul>
          </div>
        </div>

        {/* Categories Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '16px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Choose a Category
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {categories.map(category => {
              const count = category.id === 'all' 
                ? processedQuestions.length 
                : processedQuestions.filter(q => q.category === category.id).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    background: selectedCategory === category.id ? category.color : '#ffffff',
                    border: `1px solid ${selectedCategory === category.id ? category.color : '#e2e8f0'}`,
                    borderRadius: '16px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: selectedCategory === category.id ? '0 4px 12px rgba(124, 111, 214, 0.2)' : 'none',
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  <span style={{ fontSize: '28px', marginBottom: '4px' }}>{category.icon}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: selectedCategory === category.id ? 'white' : '#0f172a',
                    fontFamily: "'Inter', 'Poppins', sans-serif"
                  }}>
                    {category.name}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: selectedCategory === category.id ? 'rgba(255,255,255,0.9)' : '#64748b',
                    background: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: '100px',
                  }}>
                    {count} {count === 1 ? 'question' : 'questions'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button 
          onClick={handleStartGame} 
          style={{ 
            width: '100%', 
            padding: '10px', 
            background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: '400', 
            transition: 'all 0.2s ease', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            boxShadow: '0 8px 20px rgba(124, 111, 214, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 111, 214, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 111, 214, 0.3)';
          }}
        >
          Start {selectedCategory === 'all' ? 'Game' : categories.find(c => c.id === selectedCategory)?.name || 'Game'}
        </button>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  // Playing Screen - Redesigned
  if (gameState === 'playing') {
    const current = filteredQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;
    const currentCategory = categories.find(c => c.id === current.category) || categories[0];

    return (
      <div style={{ fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: 'white', 
              border: '1px solid #e2e8f0', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#475569', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Exit
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', color: currentCategory.color }}>{currentCategory.icon}</span>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              color: '#0f172a', 
              margin: '0', 
              fontFamily: "'Inter', 'Poppins', sans-serif" 
            }}>
              {currentCategory.name}
            </h1>
          </div>
          
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            background: '#f8f7ff',
            color: '#7c6fd6',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid #e6e0ff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {score}/{filteredQuestions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '13px',
            color: '#64748b',
          }}>
            <span>Question {currentQuestion + 1} of {filteredQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: '#f1f5f9', 
            borderRadius: '100px', 
            overflow: 'hidden',
          }}>
            <div style={{ 
              height: '100%', 
              background: `linear-gradient(90deg, ${currentCategory.color}, ${currentCategory.color}dd)`, 
              width: `${progress}%`, 
              transition: 'width 0.3s ease',
              borderRadius: '100px',
            }} />
          </div>
        </div>

        {/* Question Card */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '32px', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
          border: '1px solid #e2e8f0',
        }}>
          {/* Difficulty Badge */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: '600',
              background: current.difficulty === 'beginner' ? '#e8f5e9' : 
                         current.difficulty === 'intermediate' ? '#fff4e5' : '#ffebee',
              color: current.difficulty === 'beginner' ? '#2e7d32' : 
                     current.difficulty === 'intermediate' ? '#b85c1a' : '#b91c1c',
              textTransform: 'capitalize',
            }}>
              {current.difficulty}
            </span>
            <span style={{
              padding: '4px 12px',
              background: '#f8f7ff',
              borderRadius: '100px',
              fontSize: '12px',
              color: '#7c6fd6',
              fontWeight: '500',
            }}>
              {currentCategory.name}
            </span>
          </div>

          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '24px', 
            textAlign: 'center', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            lineHeight: '1.5'
          }}>
            {current.question}
          </h2>

          {/* Image */}
          <div style={{ 
            marginBottom: '24px', 
            textAlign: 'center' 
          }}>
            <div style={{ 
              width: '280px', 
              height: '180px', 
              margin: '0 auto', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <img 
                src={current.image} 
                alt="Context Clue" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />
            </div>
            <p style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#0f172a', 
              fontFamily: "'Inter', 'Poppins', sans-serif", 
              marginTop: '16px',
              padding: '12px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              {current.sentence}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {current.options.map((option, idx) => {
              let bgColor = '#ffffff';
              let borderColor = '#e2e8f0';
              let textColor = '#0f172a';

              if (answered) {
                if (option === current.answer) {
                  bgColor = '#f0fdf4';
                  borderColor = '#4ade80';
                  textColor = '#166534';
                } else if (option === selectedAnswer && option !== current.answer) {
                  bgColor = '#fef2f2';
                  borderColor = '#fecaca';
                  textColor = '#991b1b';
                }
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  style={{ 
                    padding: '16px 20px',
                    border: `1px solid ${borderColor}`, 
                    borderRadius: '14px', 
                    background: bgColor, 
                    fontSize: '15px', 
                    fontWeight: '500', 
                    color: textColor,
                    cursor: answered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Inter', 'Poppins', sans-serif",
                    textAlign: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseOver={(e) => {
                    if (!answered) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = currentCategory.color;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!answered) {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span>{option}</span>
                  {answered && option === current.answer && <span style={{ color: '#22c55e', fontSize: '20px' }}>✓</span>}
                  {answered && option === selectedAnswer && option !== current.answer && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {answered && (
            <button 
              onClick={handleNextQuestion}
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: '#0f172a', 
                color: 'white', 
                border: 'none', 
                borderRadius: '100px', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontWeight: '600',
                fontFamily: "'Inter', 'Poppins', sans-serif",
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#1e293b';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#0f172a';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              {currentQuestion === filteredQuestions.length - 1 ? (
                <>
                  Finish Game
                </>
              ) : (
                <>
                  <span>Next Question</span>
                  <span style={{ fontSize: '18px' }}>→</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Finished Screen - Redesigned
  if (gameState === 'finished') {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    
    return (
      <div style={{ fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: 'white', 
              border: '1px solid #e2e8f0', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#475569', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Back
          </button>
          
          <h1 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#0f172a', 
            margin: '0', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            Game Complete!
          </h1>
          
          <div style={{ width: '40px' }}></div>
        </div>

        {/* Results Card */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '40px', 
          textAlign: 'center', 
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          border: '1px solid #e6e0ff',
        }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            {percentage === 100 ? '🏆' : '🎉'}
          </div>
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '8px', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            {percentage === 100 ? 'Perfect Score!' : 'Great Job!'}
          </h2>
          
          <p style={{ 
            fontSize: '16px', 
            color: '#475569', 
            marginBottom: '24px', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            You scored {score} out of {filteredQuestions.length}
          </p>
          
          {/* Score Circle */}
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: `conic-gradient(#7c6fd6 0% ${percentage}%, #f1f5f9 ${percentage}% 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '700',
              color: '#7c6fd6'
            }}>
              {percentage}%
            </div>
          </div>
          
          {/* Message */}
          <div style={{ 
            background: '#f8f7ff', 
            borderRadius: '16px', 
            padding: '20px', 
            marginBottom: '28px',
            border: '1px solid #e6e0ff'
          }}>
            <p style={{ 
              fontSize: '15px', 
              color: '#475569', 
              margin: 0,
              fontFamily: "'Inter', 'Poppins', sans-serif",
              lineHeight: '1.6'
            }}>
              {score === filteredQuestions.length ? 'Amazing! You got all questions right! 🏆' : 
               score >= filteredQuestions.length / 2 ? 'Great work! Keep practicing to improve! 👍' : 
               'Good start! Practice makes perfect! 💪'}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleRestart} 
              style={{ 
                flex: 1, 
                padding: '14px', 
                background: '#7c6fd6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '100px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: '600', 
                fontFamily: "'Inter', 'Poppins', sans-serif",
                boxShadow: '0 4px 12px rgba(124, 111, 214, 0.2)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#6b5ec5';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#7c6fd6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '18px' }}>🔄</span>
              Play Again
            </button>
            
            <button 
              onClick={onBack} 
              style={{ 
                flex: 1, 
                padding: '14px', 
                background: 'white', 
                color: '#475569', 
                border: '1px solid #e2e8f0', 
                borderRadius: '100px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: '600', 
                fontFamily: "'Inter', 'Poppins', sans-serif",
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#7c6fd6';
                e.currentTarget.style.color = '#7c6fd6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <span style={{ fontSize: '18px' }}>🎮</span>
              More Games
            </button>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }
};

// ============= FIXED & ENHANCED SHORT STORY GAME COMPONENT =============
const ShortStoryGame = ({ onBack }) => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [storyPoints, setStoryPoints] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showVocabHint, setShowVocabHint] = useState(false);
  const [fontSize, setFontSize] = useState('medium');

  const stories = [
    {
      id: 1,
      title: 'The Learning Journey',
      genre: 'Education',
      author: 'VocaboPlay Team',
      description: 'Join Maya and her friends as they discover the power of words!',
      coverEmoji: '📚',
      totalChapters: 5,
      chapters: [
        {
          title: 'Chapter 1: The Curious Classroom',
          content: `The morning sun streamed through the windows of Mrs. Chen's classroom, casting warm golden squares on the wooden floor. Maya sat at her desk, fidgeting with her pencil, when Mrs. Chen wrote a big word on the board: <span class="vocab-word vocab-participate">Participate</span>.

"Today," Mrs. Chen announced, "we're going to learn about <span class="vocab-word vocab-participate">Participate</span> - it means to take part in an activity or discussion. Who can tell me what they did this weekend?"

Maya's heart raced. She wanted to raise her hand, but something held her back. Across the room, her friend Jamal raised his hand confidently. "I went to the science museum with my dad!"

"Excellent, Jamal! Thank you for <span class="vocab-word vocab-participate">participating</span>," Mrs. Chen smiled.

That's when Maya remembered her grandmother's words: "Your voice matters, mija. Don't be afraid to share it."

Slowly, Maya raised her hand. "I... I helped my grandmother bake cookies for the neighborhood."

Mrs. Chen's face lit up. "Wonderful, Maya! That's exactly what we mean by <span class="vocab-word vocab-participate">participate</span> - you took part and shared something meaningful!"

Maya felt a warmth spread through her chest. It wasn't so scary after all. She learned that to <span class="vocab-word vocab-participate">participate</span> isn't just about talking - it's about contributing your unique voice to the world.

Later, when Mrs. Chen asked students to <span class="vocab-word vocab-concentrate">Concentrate</span> on their writing assignment, Maya knew exactly what to do. She put her elbows on the desk, held her pencil firmly, and focused all her attention on the paper in front of her.

"<span class="vocab-word vocab-concentrate">Concentrate</span> means to focus all your attention on something," Mrs. Chen explained as she walked around the room. "When you concentrate, you're giving your brain the gift of deep thinking."

Maya wrote about her grandmother's kitchen - the smell of cinnamon, the sound of the mixer, the warmth of the oven. She concentrated so deeply that she didn't even notice the bell ringing at the end of class.

"Time to <span class="vocab-word vocab-summarize">Summarize</span> what we learned today," Mrs. Chen said, clapping her hands. "Who can give me a brief summary of our lesson?"

Maya's hand shot up. "We learned that <span class="vocab-word vocab-participate">participate</span> means to join in, and <span class="vocab-word vocab-concentrate">concentrate</span> means to focus. To <span class="vocab-word vocab-summarize">summarize</span> is to tell the main points in a short way."

"Perfect summary, Maya!" Mrs. Chen beamed. "You've mastered three important words today!"

As Maya packed her backpack, she smiled to herself. Words weren't just letters on a page - they were tools to express ideas, share stories, and connect with others. And she was just beginning her learning journey.`
        },
        {
          title: 'Chapter 2: The Science Fair Challenge',
          content: `"This year's science fair theme is 'Our Changing Planet,'" Mrs. Chen announced. "You'll work in teams, which means you'll need to <span class="vocab-word vocab-collaborate">Collaborate</span> with your classmates."

Maya teamed up with Jamal and their new classmate, Lei. Their topic: How does pollution affect local plants?

"<span class="vocab-word vocab-collaborate">Collaborate</span> means to work together with others on a project," Mrs. Chen reminded them. "Everyone's contribution matters."

The first week was chaotic. Jamal wanted to test three different plants, Lei wanted to test five, and Maya thought they should start with just one. They couldn't agree on anything.

"My brother said that scientists always start with a hypothesis," Jamal argued.

"But we need enough data!" Lei insisted.

Maya remembered her grandmother's advice about collaboration: "When you work with others, you don't all have to think the same way. You just have to find a way forward together."

"Okay," Maya said slowly. "What if we start with two plants - one in clean water, one in polluted water? That way we have something to <span class="vocab-word vocab-compare">compare</span>."

Jamal and Lei looked at each other, then nodded.

"Great!" Jamal grinned. "Now we need to <span class="vocab-word vocab-analyze">Analyze</span> the data. That means we examine everything carefully to understand what it tells us."

Over the next two weeks, they measured plant growth, counted leaves, and recorded observations. Every day after school, they met in the library to <span class="vocab-word vocab-analyze">analyze</span> their findings.

"Look!" Lei pointed at her notebook. "The plant in clean water grew 5 centimeters, but the one in polluted water only grew 2 centimeters!"

"Let's <span class="vocab-word vocab-analyze">analyze</span> this pattern," Maya said, feeling like a real scientist. "What does this tell us?"

They created charts, drew graphs, and discussed every detail. Mrs. Chen stopped by their table. "I'm impressed by how you're learning to <span class="vocab-word vocab-analyze">analyze</span> information. This is what real researchers do!"

The day before the science fair, they needed to <span class="vocab-word vocab-demonstrate">Demonstrate</span> their findings to the class.

"<span class="vocab-word vocab-demonstrate">Demonstrate</span> means to show clearly by giving proof or evidence," Mrs. Chen explained. "How will you show what you discovered?"

Maya suggested building a small model. Jamal wanted to create a slideshow. Lei thought they should act out the experiment.

"Why don't we do all three?" Maya proposed. "We can <span class="vocab-word vocab-demonstrate">demonstrate</span> our findings in different ways so everyone understands."

On presentation day, Maya's team stood before the class. They showed their model, displayed their charts, and explained their experiment step by step.

"Our data demonstrates that water pollution significantly affects plant growth," Maya concluded confidently.

The class erupted in applause. Mrs. Chen wrote on the board: "Teamwork + Collaboration = Success!"

As they packed up their project, Jamal turned to Maya and Lei. "You know what? <span class="vocab-word vocab-collaborate">Collaborating</span> isn't just about getting work done. It's about making something better together than we could alone."

Maya smiled. She was learning that every word held a bigger lesson - and she couldn't wait to discover more.`
        },
        {
          title: 'Chapter 3: The Mystery of the Missing Books',
          content: `"Something terrible has happened!" Mr. Thompson, the librarian, rushed into Mrs. Chen's classroom. "Three of our new encyclopedias are missing!"

The class gasped. The encyclopedias had arrived just last week - shiny, colorful volumes filled with knowledge.

"We need to <span class="vocab-word vocab-investigate">Investigate</span>," Mrs. Chen said calmly. "To investigate means to examine or study something carefully to find facts."

Maya's hand shot up. "Can we help? Please?"

Mrs. Chen smiled. "This is a perfect opportunity to practice our vocabulary words. Class, you're now official investigators!"

The students split into teams. Maya, Jamal, and Lei huddled together, ready to <span class="vocab-word vocab-investigate">investigate</span> the mystery.

"First, we need to <span class="vocab-word vocab-organize">Organize</span> our thoughts," Lei suggested, pulling out a notebook. "<span class="vocab-word vocab-organize">Organize</span> means to arrange things in an orderly way."

They created three columns: Facts, Questions, and Suspects.

"Fact: The books were here yesterday," Jamal said.
"Fact: Mr. Thompson locked the library at 5 PM," Maya added.
"Question: Who has a key?" Lei wrote.

Just then, a fifth grader named Carlos walked by. He was known for playing pranks.

"We should <span class="vocab-word vocab-observe">Observe</span> him," Maya whispered. "<span class="vocab-word vocab-observe">Observe</span> means to watch carefully and notice details."

The team watched Carlos for ten minutes. He wasn't acting suspicious - he was actually helping a first grader find a picture book.

"Maybe we need to <span class="vocab-word vocab-revise">Revise</span> our theory," Jamal said. "<span class="vocab-word vocab-revise">Revise</span> means to make changes to improve your work."

Lei crossed out Carlos's name. "You're right. We shouldn't jump to conclusions."

Suddenly, Maya had an idea. "Let's <span class="vocab-word vocab-review">Review</span> everything from the beginning. <span class="vocab-word vocab-review">Review</span> means to look over or study again to remember better."

They reviewed their notes, walked through the library, and retraced Mr. Thompson's steps from yesterday.

"There!" Lei pointed to a shelf behind the circulation desk. "What's that blue spine?"

Maya climbed on a step stool and reached behind a row of dictionaries. "It's the encyclopedias! They got pushed back by accident!"

Mr. Thompson rushed over, his face brightening. "Oh my! When I reshelved the new astronomy books, I must have pushed the encyclopedias too far back. Case solved!"

The class cheered. Mrs. Chen gathered everyone together. "What did we learn today?"

"We learned to <span class="vocab-word vocab-investigate">investigate</span> before accusing anyone," Jamal said.
"We learned to <span class="vocab-word vocab-organize">organize</span> our information," Lei added.
"And we learned to <span class="vocab-word vocab-revise">revise</span> our ideas when we find new evidence," Maya finished.

Mrs. Chen nodded proudly. "You've discovered something even more important than missing books. You've discovered how to think like detectives, scientists, and scholars - all by using your vocabulary words!"

That afternoon, Mr. Thompson let each of the investigators check out an extra book. Maya chose a book about famous inventors.

"These are the people who learned to <span class="vocab-word vocab-apply">Apply</span> their knowledge," Mr. Thompson said. "<span class="vocab-word vocab-apply">Apply</span> means to use knowledge or skills in a particular situation. Just like you did today."

Maya hugged her book tightly. Every word she learned was like a new tool in her toolbox, ready to be applied to whatever mystery or challenge came next.`
        },
        {
          title: 'Chapter 4: The Great Debate',
          content: `"Welcome to the Annual Vocabulary Debate!" Principal Rodriguez announced to the packed auditorium. "Today, our fifth graders will <span class="vocab-word vocab-demonstrate">Demonstrate</span> their mastery of persuasive language."

Maya's stomach fluttered. She, Jamal, and Lei had been chosen to represent their class. Their topic: "Should recess be longer?"

"This isn't just about winning," Mrs. Chen reminded them. "It's about learning to <span class="vocab-word vocab-communicate">Communicate</span> effectively. To communicate means to share information, ideas, or feelings with others."

The team spent a week preparing. They needed to <span class="vocab-word vocab-research">Research</span> their topic thoroughly.

"<span class="vocab-word vocab-research">Research</span> means to study and investigate a topic carefully," Lei read from her notes. "I found a study that says physical activity helps kids concentrate better in class."

"Perfect!" Maya said. "That's evidence we can use."

Jamal worked on their opening statement. "We need to <span class="vocab-word vocab-present">Present</span> our argument clearly. <span class="vocab-word vocab-present">Present</span> means to show or introduce information to others."

The day of the debate arrived. Maya's team sat on one side of the stage, and their opponents - a team from Mrs. Davis's class - sat on the other.

"Today's first speaker is Maya," Principal Rodriguez announced.

Maya walked to the podium, her hands slightly shaky. She took a deep breath and remembered Mrs. Chen's words about <span class="vocab-word vocab-communicate">communicating</span>.

"Good morning," she began. "We believe recess should be longer because it helps students <span class="vocab-word vocab-concentrate">concentrate</span> better in class. According to our research, students who have 30 minutes of physical activity show improved focus."

The opposing team presented their argument: longer recess would mean less instructional time.

Now it was time to <span class="vocab-word vocab-respond">Respond</span>. "<span class="vocab-word vocab-respond">Respond</span> means to answer or react to something," Mrs. Chen had taught them.

Jamal stepped up. "We understand your concern about instructional time. However, our research shows that quality of learning matters more than quantity. Students who are well-rested and active learn more effectively in less time."

The audience murmured thoughtfully.

For the final round, each team had to <span class="vocab-word vocab-summarize">Summarize</span> their position.

Lei took the podium. "To <span class="vocab-word vocab-summarize">summarize</span>: Longer recess leads to better concentration, improved physical health, and stronger social skills. These benefits outweigh the small reduction in classroom time."

The judges huddled together, whispering. Maya gripped Jamal's hand.

"And the winner is..." Principal Rodriguez opened the envelope, "...Mrs. Chen's class!"

The auditorium erupted in cheers. Maya's team hugged each other, jumping up and down.

But the best moment came afterward, when a shy third grader approached Maya.

"I was scared to <span class="vocab-word vocab-participate">participate</span> in my class debate next week," the girl said quietly. "But watching you guys... you made it look like you were having fun, not just being nervous."

Maya knelt down. "You know what? I WAS nervous. Everyone is. But when you focus on <span class="vocab-word vocab-communicate">communicating</span> your ideas instead of being perfect, it gets easier."

The girl smiled. "I think I can do it now."

That evening, Maya wrote in her journal: "Words aren't just for tests. They're for connecting, persuading, and helping others find their voice. Today, I learned that <span class="vocab-word vocab-communicate">communicating</span> well isn't about having the fanciest vocabulary - it's about saying something that matters, in a way others can understand."`
        },
        {
          title: 'Chapter 5: The Learning Celebration',
          content: `The end of the school year approached, and Mrs. Chen had one final surprise for her class.

"Next week, we're hosting a Learning Celebration," she announced. "Each of you will <span class="vocab-word vocab-present">Present</span> a project about your favorite vocabulary word and how you've applied it this year."

Maya immediately knew her word: <span class="vocab-word vocab-persevere">Persevere</span>. It wasn't on their original list, but she'd learned it from her grandmother.

"<span class="vocab-word vocab-persevere">Persevere</span> means to continue trying despite difficulties," Maya explained to her classmates. "My grandmother taught me that learning isn't always easy, but when you persevere, you grow stronger."

For her project, Maya decided to <span class="vocab-word vocab-illustrate">Illustrate</span> her journey. "<span class="vocab-word vocab-illustrate">Illustrate</span> means to explain or make clear by using examples or pictures."

She created a timeline of her school year:

September: Too shy to <span class="vocab-word vocab-participate">participate</span> in class
October: Learned to <span class="vocab-word vocab-concentrate">concentrate</span> during writing time
November: Discovered how to <span class="vocab-word vocab-collaborate">collaborate</span> on the science fair
December: Helped <span class="vocab-word vocab-investigate">investigate</span> the library mystery
January: <span class="vocab-word vocab-analyze">Analyzed</span> data for the science fair
February: Learned to <span class="vocab-word vocab-revise">revise</span> her writing
March: <span class="vocab-word vocab-communicate">Communicated</span> ideas in the debate
April: <span class="vocab-word vocab-organize">Organized</span> the class community garden project
May: <span class="vocab-word vocab-demonstrate">Demonstrated</span> leadership during group work
June: Ready to <span class="vocab-word vocab-persevere">persevere</span> through any challenge

On the day of the Learning Celebration, the classroom transformed into a gallery of knowledge. Parents walked from desk to desk, watching students <span class="vocab-word vocab-present">present</span> their projects.

Maya's grandmother arrived, her eyes shining. "Show me what you've learned, mija."

Maya walked her through the timeline, explaining each word and its story. When she reached the last card - "Persevere" - her grandmother pulled her into a warm hug.

"Do you know why I chose that word for you?" her grandmother asked softly. "Because every time you fall, every time something is hard, every time you want to give up - you don't. That's perseverance. And that's who you are."

Mrs. Chen gathered everyone for the closing ceremony. "This year, you haven't just learned vocabulary words. You've learned how to think, how to work together, and how to face challenges. These words aren't just definitions in a book - they're tools you'll use for the rest of your lives."

She held up a large, beautifully framed certificate.

"This year's Vocabulary Champion award goes to someone who started the year quietly but found her voice; someone who learned to <span class="vocab-word vocab-collaborate">collaborate</span>, <span class="vocab-word vocab-analyze">analyze</span>, and <span class="vocab-word vocab-communicate">communicate</span>; someone who demonstrates perseverance every single day. The award goes to Maya Rodriguez."

Maya walked to the front of the room in a daze. As Mrs. Chen placed the certificate in her hands, the entire class burst into applause.

"<span class="vocab-word vocab-respond">Respond</span>," Jamal whispered. "You know how to respond."

Maya smiled and faced her classmates. "Thank you. But this award isn't just mine. Every time I learned a new word, it was because someone taught me - Mrs. Chen, my grandmother, all of you. Words are gifts, but they only matter when we share them."

As the celebration continued, Maya looked around the room - at her friends presenting their projects, at her grandmother beaming with pride, at Mrs. Chen organizing the potluck lunch.

She thought about all the words she'd learned this year: <span class="vocab-word vocab-participate">Participate</span>. <span class="vocab-word vocab-concentrate">Concentrate</span>. <span class="vocab-word vocab-summarize">Summarize</span>. <span class="vocab-word vocab-analyze">Analyze</span>. <span class="vocab-word vocab-collaborate">Collaborate</span>. <span class="vocab-word vocab-demonstrate">Demonstrate</span>. <span class="vocab-word vocab-organize">Organize</span>. <span class="vocab-word vocab-review">Review</span>. <span class="vocab-word vocab-revise">Revise</span>. <span class="vocab-word vocab-communicate">Communicate</span>. <span class="vocab-word vocab-investigate">Investigate</span>. <span class="vocab-word vocab-apply">Apply</span>. <span class="vocab-word vocab-persevere">Persevere</span>.

But the most important word she'd learned wasn't in any dictionary. It was the word her grandmother taught her, written not in ink but in action:

Believe.`
        }
      ],
      quiz: [
        {
          question: 'What does it mean to "Participate" in class?',
          options: ['To sit quietly and listen', 'To take part in an activity or discussion', 'To leave the room', 'To read by yourself'],
          correct: 1
        },
        {
          question: 'What does "Collaborate" mean?',
          options: ['To work alone', 'To work together with others', 'To compete against others', 'To ignore your teammates'],
          correct: 1
        },
        {
          question: 'What does "Analyze" mean?',
          options: ['To ignore details', 'To examine something carefully', 'To guess randomly', 'To memorize quickly'],
          correct: 1
        },
        {
          question: 'What does "Concentrate" mean?',
          options: ['To focus all your attention', 'To daydream', 'To talk to friends', 'To eat a snack'],
          correct: 0
        },
        {
          question: 'What does "Summarize" mean?',
          options: ['To write word for word', 'To give a brief statement of main points', 'To draw a picture', 'To act it out'],
          correct: 1
        },
        {
          question: 'What does "Demonstrate" mean?',
          options: ['To hide your work', 'To show clearly with proof', 'To delete everything', 'To forget the steps'],
          correct: 1
        },
        {
          question: 'What does "Investigate" mean?',
          options: ['To ignore the facts', 'To examine carefully to find facts', 'To guess without evidence', 'To give up quickly'],
          correct: 1
        },
        {
          question: 'What does "Communicate" mean?',
          options: ['To keep ideas to yourself', 'To share information with others', 'To speak in code', 'To stay silent'],
          correct: 1
        },
        {
          question: 'What does "Persevere" mean?',
          options: ['To give up easily', 'To continue trying despite difficulties', 'To let others do the work', 'To avoid challenges'],
          correct: 1
        },
        {
          question: 'What does "Organize" mean?',
          options: ['To make a mess', 'To arrange things in an orderly way', 'To throw everything away', 'To hide your things'],
          correct: 1
        }
      ]
    },
    {
      id: 2,
      title: 'The Garden Adventure',
      genre: 'Nature',
      author: 'VocaboPlay Team',
      description: 'Discover the magic of gardening with Leo and his grandmother!',
      coverEmoji: '🌱',
      totalChapters: 3,
      chapters: [
        {
          title: 'Chapter 1: Planting Seeds',
          content: `Leo loved visiting his grandmother's house. Her garden was full of colors and sweet smells. One sunny Saturday, Grandma handed Leo a small packet.

"Today, we're going to <span class="vocab-word vocab-plant">Plant</span> these seeds," she said with a smile. "<span class="vocab-word vocab-plant">Plant</span> means to put something in the ground to grow."

Leo opened the packet and looked at the tiny brown seeds. "These little things will become flowers?"

Grandma laughed. "Patience, my dear. First, we need to <span class="vocab-word vocab-prepare">Prepare</span> the soil. <span class="vocab-word vocab-prepare">Prepare</span> means to get everything ready."

They worked together, digging and turning the dark earth. Leo felt the cool soil between his fingers. It was messy, but fun!

"Now we must <span class="vocab-word vocab-arrange">Arrange</span> the seeds in rows," Grandma instructed. "<span class="vocab-word vocab-arrange">Arrange</span> means to put things in a particular order."

Leo carefully placed each seed, counting as he went. Ten rows of five seeds each.

"Perfect!" Grandma clapped her hands. "You're a natural gardener."

That night, Leo dreamed of colorful flowers blooming everywhere.`
        },
        {
          title: 'Chapter 2: Daily Care',
          content: `Every day after school, Leo biked to Grandma's house to check on their garden. He learned that plants need daily <span class="vocab-word vocab-maintain">Maintain</span>.

"<span class="vocab-word vocab-maintain">Maintain</span> means to keep something in good condition," Grandma explained. "We must water, weed, and watch over our garden."

Leo grabbed the watering can. He made sure to <span class="vocab-word vocab-distribute">Distribute</span> the water evenly.

"<span class="vocab-word vocab-distribute">Distribute</span> means to spread or share something out," Grandma said. "Every plant needs its fair share."

One afternoon, Leo noticed something worrying. Some leaves had tiny holes.

"Oh no! Bugs are eating our plants!" he cried.

Grandma examined the leaves carefully. "We need to <span class="vocab-word vocab-protect">Protect</span> them. <span class="vocab-word vocab-protect">Protect</span> means to keep something safe from harm."

Together, they made a natural spray with soap and water. Leo gently sprayed each plant, making sure to <span class="vocab-word vocab-protect">protect</span> them from the hungry bugs.

A few days later, tiny green shoots appeared above the soil.

"Look, Grandma! They're growing!" Leo shouted with joy.`
        },
        {
          title: 'Chapter 3: The Beautiful Bloom',
          content: `Weeks passed, and Leo's garden transformed. The tiny shoots grew tall and strong. Soon, colorful buds began to appear.

"Any day now, they will <span class="vocab-word vocab-bloom">Bloom</span>," Grandma said. "<span class="vocab-word vocab-bloom">Bloom</span> means for flowers to open up."

Leo could hardly wait. He came every morning, hoping to see the flowers open.

Then one Saturday, it happened. Leo walked into the garden and gasped. The flowers had <span class="vocab-word vocab-bloom">bloomed</span> overnight! Red, yellow, purple, and pink petals covered the garden like a rainbow.

"Grandma! Come quick!" he shouted.

Grandma came out, wiping her hands on her apron. Her face lit up with joy. "Oh, Leo! You did it! Your hard work helped these flowers <span class="vocab-word vocab-bloom">bloom</span> beautifully."

Leo ran through the garden, touching each flower gently. He felt so proud.

"This is amazing! I want to <span class="vocab-word vocab-share">Share</span> them with everyone," he said.

"<span class="vocab-word vocab-share">Share</span> means to give a portion to others," Grandma nodded. "That's a wonderful idea."

They picked a big basket of flowers. Leo <span class="vocab-word vocab-share">shared</span> them with his neighbors, his teacher, and even the mail carrier. Everyone smiled when they received a flower.

That evening, Leo wrote in his journal: "Today, my flowers <span class="vocab-word vocab-bloom">bloomed</span>. I learned that when you <span class="vocab-word vocab-plant">plant</span> seeds, <span class="vocab-word vocab-prepare">prepare</span> the soil, <span class="vocab-word vocab-maintain">maintain</span> the garden, and <span class="vocab-word vocab-protect">protect</span> the plants, beautiful things grow. And the best part is <span class="vocab-word vocab-share">sharing</span> them with others."`
        }
      ],
      quiz: [
        {
          question: 'What does it mean to "Plant" seeds?',
          options: ['To water them', 'To put them in the ground to grow', 'To pick them', 'To eat them'],
          correct: 1
        },
        {
          question: 'What does "Maintain" mean?',
          options: ['To ignore something', 'To keep something in good condition', 'To throw something away', 'To hide something'],
          correct: 1
        },
        {
          question: 'What does "Protect" mean?',
          options: ['To harm something', 'To keep something safe', 'To forget about something', 'To give something away'],
          correct: 1
        },
        {
          question: 'What does "Bloom" mean?',
          options: ['For flowers to open up', 'For flowers to close', 'For flowers to die', 'For flowers to be picked'],
          correct: 0
        },
        {
          question: 'What does "Share" mean?',
          options: ['To keep everything', 'To give a portion to others', 'To throw away', 'To hide from others'],
          correct: 1
        }
      ]
    },
    {
      id: 3,
      title: 'The Lost Puppy',
      genre: 'Adventure',
      author: 'VocaboPlay Team',
      description: 'Join Sofia and her friends as they search for a lost puppy!',
      coverEmoji: '🐕',
      totalChapters: 3,
      chapters: [
        {
          title: 'Chapter 1: A Surprise Visitor',
          content: `Sofia was playing in her backyard when she heard a strange noise. Whimper, whimper, whimper.

She looked around and found a small, fluffy puppy hiding behind the bushes. He was shaking and looked scared.

"Oh, you poor thing!" Sofia knelt down slowly. She didn't want to <span class="vocab-word vocab-frighten">Frighten</span> him.

"<span class="vocab-word vocab-frighten">Frighten</span> means to make someone afraid," Sofia remembered from school.

The puppy looked up with big, sad eyes. Sofia held out her hand gently. "It's okay, little one. I won't <span class="vocab-word vocab-frighten">frighten</span> you."

The puppy sniffed her fingers, then licked them. Sofia giggled.

"You must be lost," she said. "I need to <span class="vocab-word vocab-locate">Locate</span> your owner. <span class="vocab-word vocab-locate">Locate</span> means to find where someone or something is."

Sofia picked up the puppy carefully. He was soft and warm. She carried him inside to show her mom.

"Mom! Look what I found!" she called out. "Can we keep him?"

Her mom smiled but shook her head. "We can't keep him, sweetie. Someone is probably very worried. We need to help <span class="vocab-word vocab-locate">locate</span> his family."

Sofia nodded. The adventure was just beginning.`
        },
        {
          title: 'Chapter 2: The Search Begins',
          content: `Sofia and her mom made a plan to <span class="vocab-word vocab-search">Search</span> for the puppy's owner.

"<span class="vocab-word vocab-search">Search</span> means to look carefully for something," Mom explained.

First, they made posters. Sofia drew a picture of the puppy and wrote: "Found: Sweet puppy. Call Sofia."

They needed to <span class="vocab-word vocab-describe">Describe</span> the puppy accurately.

"<span class="vocab-word vocab-describe">Describe</span> means to tell what something looks like," Mom said.

Sofia wrote: "Small, fluffy, brown with white paws and a pink nose."

They hung posters all around the neighborhood. Sofia felt like a real detective.

Next, they visited the neighbors to ask questions.

"Have you seen this puppy before?" Sofia asked, showing the picture.

Mrs. Garcia looked closely. "I think I've seen a similar dog at the park. You should <span class="vocab-word vocab-investigate">Investigate</span> there."

"<span class="vocab-word vocab-investigate">Investigate</span> means to search and ask questions to find information," Sofia told Mrs. Garcia proudly.

Mrs. Garcia smiled. "You're very smart! I hope you find his home."

At the park, Sofia asked everyone she met. She showed the puppy to people, hoping someone would <span class="vocab-word vocab-recognize">Recognize</span> him.

"<span class="vocab-word vocab-recognize">Recognize</span> means to know someone because you've seen them before," Sofia explained to the puppy. "Someone will <span class="vocab-word vocab-recognize">recognize</span> you, I know it."`
        },
        {
          title: 'Chapter 3: A Happy Reunion',
          content: `Three days passed. Sofia had almost given up hope. She was sitting on her porch, cuddling the puppy, when a car pulled up.

A little girl jumped out, crying. "Buster! That's my Buster!"

The puppy's ears perked up. He started wagging his tail like crazy and jumped out of Sofia's arms, running to the girl.

Sofia watched as the girl hugged the puppy tightly. "I've been so worried! I thought I'd never find you!"

Sofia felt happy but also a little sad. She would miss the puppy.

A woman got out of the car and walked over to Sofia. "Thank you so much for taking care of Buster. We were on vacation and our pet sitter accidentally left the gate open. We've been searching everywhere."

"I'm so glad you came," Sofia said. "I was hoping someone would <span class="vocab-word vocab-claim">Claim</span> him."

"<span class="vocab-word vocab-claim">Claim</span> means to say that something belongs to you," Sofia explained.

The woman smiled. "You're such a kind girl. We'd like to <span class="vocab-word vocab-reward">Reward</span> you for your help."

"<span class="vocab-word vocab-reward">Reward</span> means to give something for doing something good," Sofia thought.

The woman handed Sofia $20. Sofia's eyes went wide.

The little girl came over with Buster. "Thank you for finding my puppy. Can we be friends? You can visit Buster anytime!"

Sofia beamed. "I'd love that!"

That night, Sofia wrote in her journal: "Today, I learned that helping others feels better than any <span class="vocab-word vocab-reward">reward</span>. When you <span class="vocab-word vocab-search">search</span> for something with all your heart, and you don't give up, good things happen. Buster is home, and I made a new friend."`
        }
      ],
      quiz: [
        {
          question: 'What does "Frighten" mean?',
          options: ['To make someone happy', 'To make someone afraid', 'To make someone laugh', 'To make someone sleepy'],
          correct: 1
        },
        {
          question: 'What does "Locate" mean?',
          options: ['To lose something', 'To find where something is', 'To hide something', 'To buy something'],
          correct: 1
        },
        {
          question: 'What does "Search" mean?',
          options: ['To give up', 'To look carefully for something', 'To ignore something', 'To forget something'],
          correct: 1
        },
        {
          question: 'What does "Recognize" mean?',
          options: ['To forget someone', 'To know someone because you\'ve seen them before', 'To meet someone new', 'To say goodbye to someone'],
          correct: 1
        },
        {
          question: 'What does "Claim" mean?',
          options: ['To lose something', 'To say something belongs to you', 'To give something away', 'To hide something'],
          correct: 1
        }
      ]
    }
  ];

  const calculateStoryPoints = () => {
    const totalQuestions = selectedStory.quiz.length;
    const correctAnswers = quizScore;
    return correctAnswers === totalQuestions ? 5 : 2;
  };

  const handleQuizAnswer = (answerIndex) => {
    if (!quizAnswered) {
      setQuizAnswered(true);
      
      const currentQuiz = selectedStory.quiz[currentChapter] || selectedStory.quiz[0];
      const isCorrect = answerIndex === currentQuiz.correct;
      
      if (isCorrect) {
        setQuizScore(prevScore => prevScore + 1);
      }
      
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
      
      if (currentProgress) {
        const updates = {
          totalAnswers: (currentProgress.totalAnswers || 0) + 1,
          correctAnswers: isCorrect 
            ? (currentProgress.correctAnswers || 0) + 1 
            : (currentProgress.correctAnswers || 0),
          shortStory: {
            ...currentProgress.shortStory,
            quizzesPassed: isCorrect 
              ? (currentProgress.shortStory?.quizzesPassed || 0) + 1 
              : (currentProgress.shortStory?.quizzesPassed || 0)
          }
        };
        
        if (isCorrect) {
          updates.totalPoints = (currentProgress.totalPoints || 0) + 15;
          updates.xp = (currentProgress.xp || 0) + 7;
          updates.wordsLearned = (currentProgress.wordsLearned || 0) + 1;
        }
        
        updateProgress(updates);
      }
    }
  };

  const handleContinueStory = () => {
    setShowQuiz(false);
    setQuizAnswered(false);
    
    const savedProgress = localStorage.getItem('vocaboplay_progress');
    const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
    
    if (currentProgress) {
      updateProgress({
        shortStory: {
          ...currentProgress.shortStory,
          chaptersRead: (currentProgress.shortStory?.chaptersRead || 0) + 1
        },
        xp: (currentProgress.xp || 0) + 3,
        totalPoints: (currentProgress.totalPoints || 0) + 5
      });
    }
    
    if (currentChapter === selectedStory.chapters.length - 1) {
      const points = calculateStoryPoints();
      setStoryPoints(points);
      setShowCompletion(true);
      
      const progress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = progress ? JSON.parse(progress) : null;
      
      if (currentProgress) {
        updateProgress({
          totalPoints: (currentProgress.totalPoints || 0) + (points * 10),
          xp: (currentProgress.xp || 0) + (points * 2),
          shortStory: {
            ...currentProgress.shortStory,
            storiesCompleted: (currentProgress.shortStory?.storiesCompleted || 0) + 1
          }
        });
      }
    } else {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const handleCompleteStory = () => {
    setShowCompletion(false);
    setCurrentChapter(0);
    setSelectedStory(null);
    setQuizScore(0);
    setStoryPoints(0);
  };

  if (!selectedStory) {
    return (
      <div style={{ 
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '32px 24px',
        color: '#0f172a',
      }}>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .vocab-word {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: 600;
            transition: all 0.2s ease;
            cursor: help;
            margin: 0 2px;
            border: 1px solid transparent;
          }
          .vocab-word:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(124, 111, 214, 0.2);
          }
          .vocab-participate { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-concentrate { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-summarize { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-collaborate { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-analyze { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-demonstrate { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-organize { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-review { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-revise { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-communicate { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-investigate { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-apply { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-persevere { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-compare { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-observe { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-present { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-respond { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-research { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-illustrate { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-plant { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-prepare { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-arrange { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-maintain { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-distribute { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-protect { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-bloom { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-share { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-frighten { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-locate { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-search { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-describe { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-recognize { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
          .vocab-claim { background: #e6e0ff; color: #6b5ec5; border-color: #6b5ec5; }
          .vocab-reward { background: #f0edff; color: #7c6fd6; border-color: #7c6fd6; }
        `}</style>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '24px',
        }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#475569', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            ← Back
          </button>
          
          <div style={{ 
            background: '#f8fafc',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            color: '#0f172a',
            fontWeight: '500',
          }}>
            {stories.length} Stories Available
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginBottom: '48px',
        }}>
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            color: '#0f172a', 
            marginBottom: '12px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
          }}>
            Choose Your Reading Adventure
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#475569', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Immerse yourself in stories while learning vocabulary in context
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
          gap: '24px' 
        }}>
          {stories.map((story, index) => (
            <div 
              key={story.id}
              onClick={() => setSelectedStory(story)}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '28px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 6px -2px rgba(0,0,0,0.02)',
                fontFamily: "'Inter', 'Poppins', sans-serif",
                animation: `slideIn 0.5s ease-out ${index * 0.1}s backwards`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(124, 111, 214, 0.2)';
                e.currentTarget.style.borderColor = '#7c6fd6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -2px rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#f8f7ff',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  color: '#7c6fd6',
                }}>
                  {story.coverEmoji || '📚'}
                </div>
                
                <span style={{ 
                  padding: '6px 14px', 
                  borderRadius: '100px', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  background: '#f0edff', 
                  color: '#7c6fd6',
                  border: '1px solid #e6e0ff',
                }}>
                  {story.genre}
                </span>
              </div>
              
              <h3 style={{ 
                fontSize: '22px', 
                fontWeight: '600', 
                color: '#0f172a', 
                marginBottom: '8px',
                fontFamily: "'Inter', 'Poppins', sans-serif",
              }}>
                {story.title}
              </h3>
              
              <p style={{ 
                fontSize: '14px', 
                color: '#475569', 
                marginBottom: '20px', 
                fontFamily: "'Inter', 'Poppins', sans-serif",
                lineHeight: '1.6',
              }}>
                {story.description}
              </p>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '16px 0',
                borderTop: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px', 
                  color: '#64748b',
                }}>
                  <span style={{ fontSize: '18px' }}>✍️</span>
                  {story.author}
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  fontSize: '13px', 
                  fontWeight: '600',
                  color: '#7c6fd6',
                  background: '#f8f7ff',
                  padding: '6px 14px',
                  borderRadius: '100px',
                }}>
                  <span style={{ fontSize: '16px' }}>📖</span>
                  {story.chapters.length} Chapters
                </div>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#475569',
                }}>
                  <span style={{ fontSize: '18px', color: '#7c6fd6' }}>🎯</span>
                  <span>{story.totalChapters || story.chapters.length} lessons</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#7c6fd6',
                  fontSize: '14px',
                  fontWeight: '500',
                }}>
                  <span>Start Reading</span>
                  <span style={{ fontSize: '18px' }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentChapterData = selectedStory.chapters[currentChapter];
  const isLastChapter = currentChapter === selectedStory.chapters.length - 1;

  if (showCompletion) {
    const totalQuestions = selectedStory.quiz.length;
    const correctAnswers = quizScore;
    const pointsEarned = storyPoints;
    const isPerfect = correctAnswers === totalQuestions;

    return (
      <div style={{ 
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
        maxWidth: '600px', 
        margin: '0 auto',
        padding: '24px',
        color: '#0f172a',
      }}>
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '40px', 
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          border: '1px solid #e6e0ff',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            {isPerfect ? '🏆' : '📚'}
          </div>
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '8px',
            fontFamily: "'Inter', 'Poppins', sans-serif"
          }}>
            {isPerfect ? 'Perfect Story!' : 'Story Complete!'}
          </h2>
          
          <p style={{ 
            fontSize: '16px', 
            color: '#475569', 
            marginBottom: '24px'
          }}>
            You've finished "{selectedStory.title}"
          </p>
          
          <div style={{ 
            background: '#f8f7ff', 
            borderRadius: '16px', 
            padding: '24px', 
            marginBottom: '28px',
            border: '1px solid #e6e0ff'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '16px',
              fontSize: '15px'
            }}>
              <span style={{ color: '#475569' }}>Questions Correct</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{correctAnswers}/{totalQuestions}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '16px',
              fontSize: '15px'
            }}>
              <span style={{ color: '#475569' }}>Performance</span>
              <span style={{ 
                fontWeight: '600', 
                color: isPerfect ? '#22c55e' : '#7c6fd6' 
              }}>
                {isPerfect ? 'Perfect!' : 'Good Job!'}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              paddingTop: '16px',
              borderTop: '1px solid #e6e0ff',
              fontSize: '18px',
              fontWeight: '700'
            }}>
              <span style={{ color: '#475569' }}>Points Earned</span>
              <span style={{ color: '#7c6fd6' }}>{pointsEarned} / 5</span>
            </div>
          </div>
          
          <button 
            onClick={handleCompleteStory}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '16px', 
              fontWeight: '600',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              boxShadow: '0 8px 20px rgba(124, 111, 214, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 111, 214, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 111, 214, 0.3)';
            }}
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    const quizQuestion = selectedStory.quiz[currentChapter] || selectedStory.quiz[0];
    const totalQuestions = selectedStory.quiz.length;
    const isLastQuiz = currentChapter === totalQuestions - 1;

    return (
      <div style={{ 
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '24px',
        color: '#0f172a',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}>
          <button 
            onClick={() => setShowQuiz(false)} 
            style={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#475569', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            ← Back to Story
          </button>
          
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            background: '#f8f7ff',
            color: '#7c6fd6',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid #e6e0ff',
          }}>
            Score: {quizScore}/{totalQuestions}
          </div>
        </div>

        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '32px', 
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          border: '1px solid #e6e0ff',
        }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '32px' 
          }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              animation: 'float 3s ease-in-out infinite'
            }}>
              🤔
            </div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#0f172a',
              marginBottom: '8px', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
            }}>
              Chapter {currentChapter + 1} Quiz
            </h2>
            {isLastQuiz && (
              <div style={{
                background: '#f0edff',
                padding: '8px 16px',
                borderRadius: '100px',
                display: 'inline-block',
                marginTop: '8px',
                fontSize: '13px',
                color: '#7c6fd6',
                fontWeight: '500'
              }}>
                ⭐ Final Quiz - Complete for Story Points!
              </div>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{
              background: '#f8fafc',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#0f172a', 
                marginBottom: '0', 
                fontFamily: "'Inter', 'Poppins', sans-serif",
                lineHeight: '1.5',
                textAlign: 'center'
              }}>
                {quizQuestion.question}
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizQuestion.options.map((option, idx) => {
                let bgColor = '#ffffff';
                let borderColor = '#e2e8f0';
                let textColor = '#0f172a';

                if (quizAnswered) {
                  if (idx === quizQuestion.correct) {
                    bgColor = '#f0fdf4';
                    borderColor = '#4ade80';
                    textColor = '#166534';
                  } else {
                    bgColor = '#fef2f2';
                    borderColor = '#fecaca';
                    textColor = '#991b1b';
                  }
                }

                return (
                  <button 
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    disabled={quizAnswered}
                    style={{
                      padding: '16px 20px',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '14px',
                      background: bgColor,
                      textAlign: 'left',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: textColor,
                      cursor: quizAnswered ? 'default' : 'pointer',
                      fontFamily: "'Inter', 'Poppins', sans-serif",
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                    onMouseOver={(e) => {
                      if (!quizAnswered) {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#7c6fd6';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!quizAnswered) {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <span style={{ 
                      fontWeight: '600', 
                      color: quizAnswered ? (idx === quizQuestion.correct ? '#22c55e' : '#ef4444') : '#7c6fd6', 
                      fontSize: '16px',
                      minWidth: '28px',
                    }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span style={{ flex: 1 }}>{option}</span>
                    {quizAnswered && idx === quizQuestion.correct && (
                      <span style={{ color: '#22c55e', fontSize: '20px' }}>✓</span>
                    )}
                    {quizAnswered && idx !== quizQuestion.correct && (
                      <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {quizAnswered && (
            <div style={{ textAlign: 'center' }}>
              {isLastQuiz && (
                <div style={{
                  background: '#f0edff',
                  padding: '16px',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  border: '1px solid #e6e0ff',
                }}>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#7c6fd6',
                    margin: 0,
                  }}>
                    ⭐ Complete all quizzes to earn story points!
                  </p>
                </div>
              )}
              
              <button 
                onClick={handleContinueStory}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#1e293b';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#0f172a';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                {isLastQuiz ? 'Complete Story' : 'Continue to Next Chapter'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
      maxWidth: '900px', 
      margin: '0 auto',
      padding: '24px',
      color: '#0f172a',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '20px',
      }}>
        <button 
          onClick={() => setSelectedStory(null)} 
          style={{ 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            padding: '8px 20px', 
            borderRadius: '100px', 
            cursor: 'pointer', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#475569', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          ← Back to Library
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px', color: '#7c6fd6' }}>{selectedStory.coverEmoji || '📚'}</span>
          <h1 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#0f172a', 
            margin: '0', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
          }}>
            {selectedStory.title}
          </h1>
        </div>
        
        <div style={{ 
          fontSize: '14px', 
          fontWeight: '500', 
          background: '#f8f7ff',
          color: '#7c6fd6',
          padding: '8px 16px',
          borderRadius: '100px',
          border: '1px solid #e6e0ff',
        }}>
          Chapter {currentChapter + 1}/{selectedStory.chapters.length}
        </div>
      </div>

      <div style={{ 
        marginBottom: '32px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '13px',
          color: '#64748b',
        }}>
          <span>Reading Progress</span>
          <span>{Math.round(((currentChapter + 1) / selectedStory.chapters.length) * 100)}%</span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '6px', 
          background: '#f1f5f9', 
          borderRadius: '100px', 
          overflow: 'hidden',
        }}>
          <div style={{ 
            height: '100%', 
            background: 'linear-gradient(90deg, #7c6fd6, #9b8de8)', 
            width: `${((currentChapter + 1) / selectedStory.chapters.length) * 100}%`, 
            transition: 'width 0.3s ease',
            borderRadius: '100px',
          }} />
        </div>
      </div>

      <div style={{ 
        background: '#ffffff', 
        borderRadius: '24px', 
        padding: '40px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '32px',
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a',
            marginBottom: '12px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
          }}>
            {currentChapterData.title}
          </h2>
          <div style={{ 
            padding: '8px 20px', 
            borderRadius: '100px', 
            fontSize: '13px', 
            fontWeight: '500', 
            background: '#f8f7ff',
            color: '#7c6fd6',
            display: 'inline-block',
            border: '1px solid #e6e0ff',
          }}>
            {selectedStory.genre} • Part {currentChapter + 1}
          </div>
        </div>

        <div style={{ 
          fontSize: '16px', 
          lineHeight: '1.8', 
          color: '#334155', 
          marginBottom: '40px', 
          fontFamily: "'Inter', 'Poppins', sans-serif", 
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}>
          <div dangerouslySetInnerHTML={{ __html: currentChapterData.content }} />
        </div>

        <div style={{ 
          background: '#f8f7ff', 
          borderRadius: '20px', 
          padding: '28px', 
          marginBottom: '28px',
          border: '1px solid #e6e0ff',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '24px',
            background: '#7c6fd6',
            padding: '6px 20px',
            borderRadius: '100px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 4px 10px rgba(124, 111, 214, 0.2)',
          }}>
            Words to Remember
          </div>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '20px'
          }}>
            {(() => {
              const wordMatches = currentChapterData.content.match(/<span class="vocab-word[^"]*"[^>]*>([^<]+)<\/span>/g);
              if (wordMatches) {
                const uniqueWords = [...new Set(wordMatches.map(match => match.replace(/<[^>]+>/g, '')))];
                return uniqueWords.map((word, i) => (
                  <span key={i} style={{
                    background: 'white',
                    padding: '8px 20px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#7c6fd6',
                    border: '1px solid #e6e0ff',
                    boxShadow: '0 2px 6px rgba(124, 111, 214, 0.05)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    cursor: 'default',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f0edff';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}>
                    {word}
                  </span>
                ));
              }
              return null;
            })()}
          </div>
          
          <p style={{ 
            fontSize: '13px', 
            color: '#64748b', 
            marginTop: '24px',
            marginBottom: '0',
            fontStyle: 'italic',
          }}>
            Hover over highlighted words in the story to see their meanings!
          </p>
        </div>

        <button 
          onClick={() => setShowQuiz(true)}
          style={{
            width: '100%',
            padding: '16px',
            background: '#0f172a',
            color: 'white',
            border: 'none',
            borderRadius: '100px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: "'Inter', 'Poppins', sans-serif",
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#1e293b';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#0f172a';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
        >
          Chapter Quiz
          {isLastChapter && (
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: '500',
              marginLeft: '8px'
            }}>
              Final Quiz
            </span>
          )}
        </button>
      </div>

      {isLastChapter && !showQuiz && (
        <div style={{
          background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%)',
          borderRadius: '24px',
          padding: '32px',
          textAlign: 'center',
          border: '2px solid #e6e0ff',
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.1)',
          marginTop: '20px',
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#0f172a', 
            margin: '0 0 8px 0',
          }}>
            Almost a Story Master!
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#475569', 
            marginBottom: '20px',
            lineHeight: '1.6',
          }}>
            Complete the final quiz to earn story points!
          </p>
          <div style={{
            background: '#f0edff',
            padding: '12px',
            borderRadius: '100px',
            display: 'inline-block',
            fontSize: '14px',
            color: '#7c6fd6',
            fontWeight: '500'
          }}>
            ⭐ Complete all quizzes correctly for 5 points
          </div>
        </div>
      )}
    </div>
  );
};

const SentenceBuilder = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Define categories matching GuessWhat style
  const categories = [
    { id: 'all', name: 'All Sentences', icon: '📝', color: '#7c6fd6' },
    { id: 'collaboration', name: 'Collaboration', icon: '🤝', color: '#ff6b6b' },
    { id: 'analysis', name: 'Analysis', icon: '🔍', color: '#4ecdc4' },
    { id: 'participation', name: 'Participation', icon: '🎯', color: '#ff9f4b' },
    { id: 'focus', name: 'Focus', icon: '⚡', color: '#9b8de8' },
    { id: 'summary', name: 'Summary', icon: '📋', color: '#a06cd5' },
  ];

  // Enhanced sentences with categories matching GuessWhat structure
  const allSentences = [
    {
      id: 1,
      sentence: "To succeed in group projects, you need to ______ with your classmates.",
      correct: "Collaborate",
      options: UNIFIED_VOCABULARY.slice(4, 8).map(w => w.word),
      hint: 'Work together with others',
      category: 'collaboration',
      difficulty: 'beginner'
    },
    {
      id: 2,
      sentence: "Before making conclusions, you should ______ all the evidence carefully.",
      correct: "Analyze",
      options: UNIFIED_VOCABULARY.slice(2, 6).map(w => w.word),
      hint: 'Examine something in detail',
      category: 'analysis',
      difficulty: 'intermediate'
    },
    {
      id: 3,
      sentence: "In class discussions, it's important to ______ actively.",
      correct: "Participate",
      options: UNIFIED_VOCABULARY.slice(0, 4).map(w => w.word),
      hint: 'Take part in activities',
      category: 'participation',
      difficulty: 'beginner'
    },
    {
      id: 4,
      sentence: "When studying, you should ______ on one task at a time.",
      correct: "Concentrate",
      options: UNIFIED_VOCABULARY.slice(1, 5).map(w => w.word),
      hint: 'Focus all your attention',
      category: 'focus',
      difficulty: 'beginner'
    },
    {
      id: 5,
      sentence: "At the end of a chapter, you should ______ what you learned.",
      correct: "Summarize",
      options: UNIFIED_VOCABULARY.slice(2, 6).map(w => w.word),
      hint: 'Give a brief statement of main points',
      category: 'summary',
      difficulty: 'intermediate'
    },
    {
      id: 6,
      sentence: "The scientist will ______ the results to find patterns.",
      correct: "Analyze",
      options: UNIFIED_VOCABULARY.slice(2, 6).map(w => w.word),
      hint: 'Examine data',
      category: 'analysis',
      difficulty: 'intermediate'
    },
    {
      id: 7,
      sentence: "Team members must ______ effectively to complete the project.",
      correct: "Collaborate",
      options: UNIFIED_VOCABULARY.slice(4, 8).map(w => w.word),
      hint: 'Work as a team',
      category: 'collaboration',
      difficulty: 'beginner'
    },
    {
      id: 8,
      sentence: "Please ______ in the class discussion by sharing your ideas.",
      correct: "Participate",
      options: UNIFIED_VOCABULARY.slice(0, 4).map(w => w.word),
      hint: 'Join the conversation',
      category: 'participation',
      difficulty: 'beginner'
    },
    {
      id: 9,
      sentence: "To do well on the test, you need to ______ during the lecture.",
      correct: "Concentrate",
      options: UNIFIED_VOCABULARY.slice(1, 5).map(w => w.word),
      hint: 'Pay attention',
      category: 'focus',
      difficulty: 'beginner'
    },
    {
      id: 10,
      sentence: "Can you ______ the main points of the article in a few sentences?",
      correct: "Summarize",
      options: UNIFIED_VOCABULARY.slice(2, 6).map(w => w.word),
      hint: 'Briefly restate',
      category: 'summary',
      difficulty: 'intermediate'
    }
  ].map((sentence, idx) => {
    if (!sentence.options.includes(sentence.correct)) {
      sentence.options[0] = sentence.correct;
    }
    sentence.options = sentence.options.sort(() => Math.random() - 0.5);
    return sentence;
  });

  // Filter sentences based on category
  const sentences = selectedCategory === 'all' 
    ? allSentences 
    : allSentences.filter(s => s.category === selectedCategory);

  const current = sentences[currentIndex];
  const progress = sentences.length > 0 ? ((currentIndex + 1) / sentences.length) * 100 : 0;

  const handleAnswer = (word) => {
    if (!answered) {
      setSelectedWord(word);
      setAnswered(true);
      
      const isCorrect = word === current.correct;
      if (isCorrect) {
        setScore(score + 1);
      }
      
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
      
      if (currentProgress) {
        const updates = {
          totalAnswers: (currentProgress.totalAnswers || 0) + 1,
          sentenceBuilder: {
            ...currentProgress.sentenceBuilder,
            totalSentences: (currentProgress.sentenceBuilder?.totalSentences || 0) + 1,
            correctAnswers: isCorrect 
              ? (currentProgress.sentenceBuilder?.correctAnswers || 0) + 1 
              : (currentProgress.sentenceBuilder?.correctAnswers || 0)
          }
        };
        
        if (isCorrect) {
          updates.correctAnswers = (currentProgress.correctAnswers || 0) + 1;
          updates.totalPoints = (currentProgress.totalPoints || 0) + 10;
          updates.xp = (currentProgress.xp || 0) + 5;
          updates.wordsLearned = (currentProgress.wordsLearned || 0) + 1;
        }
        
        updateProgress(updates);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedWord(null);
    } else {
      setGameState('finished');
    }
  };

  const [gameState, setGameState] = useState('intro');

  const handleRestart = () => {
    setGameState('intro');
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedWord(null);
  };

  useEffect(() => {
    if (currentIndex === sentences.length - 1 && answered && sentences.length > 0) {
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : null;
      
      if (currentProgress) {
        const updates = {
          gamesPlayed: (currentProgress.gamesPlayed || 0) + 1,
          sentenceBuilder: {
            ...currentProgress.sentenceBuilder,
            gamesCompleted: (currentProgress.sentenceBuilder?.gamesCompleted || 0) + 1
          }
        };
        
        if (score === sentences.length) {
          updates.xp = (currentProgress.xp || 0) + 30;
          updates.totalPoints = (currentProgress.totalPoints || 0) + 70;
          updates.achievements = {
            ...currentProgress.achievements,
            perfectScore: true
          };
        } else {
          updates.xp = (currentProgress.xp || 0) + 15;
          updates.totalPoints = (currentProgress.totalPoints || 0) + 35;
        }
        
        updateProgress(updates);
      }
    }
  }, [currentIndex, answered, score, sentences.length]);

  // Intro Screen - Matching GuessWhat exactly
  if (gameState === 'intro') {
    return (
      <div style={{ fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '900px', margin: '0 auto', padding: '24px' }}>

        {/* Hero Section - Matching GuessWhat */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #e6e0ff',
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>📝</div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '12px', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            Welcome to Sentence Builder!
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#475569', 
            lineHeight: '1.6', 
            marginBottom: '24px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            maxWidth: '600px',
            margin: '0 auto 24px'
          }}>
            Complete each sentence by choosing the correct vocabulary word. Practice using words in context.
          </p>
          
          {/* How to Play - Matching GuessWhat */}
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '16px', 
            padding: '24px', 
            marginBottom: '28px', 
            textAlign: 'left',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#7c6fd6', 
              marginBottom: '16px', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              How to Play:
            </h3>
            <ul style={{ 
              paddingLeft: '20px', 
              fontSize: '14px', 
              color: '#475569', 
              lineHeight: '1.8',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              margin: 0
            }}>
              <li>Choose a category below or practice with all sentences</li>
              <li>Read the sentence and identify the missing word</li>
              <li>Select the correct word from the options</li>
              <li>Use the hint if you need help</li>
              <li>Earn points for each correct answer!</li>
            </ul>
          </div>
        </div>

        {/* Categories Section - Matching GuessWhat exactly */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '16px', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Choose a Category
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {categories.map(category => {
              const count = category.id === 'all' 
                ? allSentences.length 
                : allSentences.filter(s => s.category === category.id).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setGameState('intro');
                  }}
                  style={{
                    background: selectedCategory === category.id ? category.color : '#ffffff',
                    border: `1px solid ${selectedCategory === category.id ? category.color : '#e2e8f0'}`,
                    borderRadius: '16px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: selectedCategory === category.id ? '0 4px 12px rgba(124, 111, 214, 0.2)' : 'none',
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  <span style={{ fontSize: '28px', marginBottom: '4px' }}>{category.icon}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: selectedCategory === category.id ? 'white' : '#0f172a',
                    fontFamily: "'Inter', 'Poppins', sans-serif"
                  }}>
                    {category.name}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: selectedCategory === category.id ? 'rgba(255,255,255,0.9)' : '#64748b',
                    background: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: '100px',
                  }}>
                    {count} {count === 1 ? 'sentence' : 'sentences'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button - Matching GuessWhat exactly */}
        <button 
          onClick={() => {
            setGameState('playing');
            setCurrentIndex(0);
            setScore(0);
            setAnswered(false);
            setSelectedWord(null);
          }} 
          style={{ 
            width: '100%', 
            padding: '10px', 
            background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: '400', 
            transition: 'all 0.2s ease', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            boxShadow: '0 8px 20px rgba(124, 111, 214, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 111, 214, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 111, 214, 0.3)';
          }}
        >
          Start {selectedCategory === 'all' ? 'Game' : categories.find(c => c.id === selectedCategory)?.name || 'Game'}
        </button>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  // No sentences available
  if (!current) {
    return (
      <div style={{ 
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '24px'
      }}>
        <div style={{ 
          background: '#ffffff',
          borderRadius: '24px',
          padding: '48px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', color: '#94a3b8' }}>📭</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
            No Sentences Available
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '24px' }}>
            Try selecting a different category
          </p>
          <button
            onClick={() => setGameState('intro')}
            style={{
              padding: '12px 32px',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  // Playing Screen - Matching GuessWhat exactly
  if (gameState === 'playing') {
    const currentCategory = categories.find(c => c.id === current.category) || categories[0];

    return (
      <div style={{ fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        {/* Header - Matching GuessWhat */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}>
          <button 
            onClick={() => setGameState('intro')} 
            style={{ 
              background: 'white', 
              border: '1px solid #e2e8f0', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#475569', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Exit
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', color: currentCategory.color }}>{currentCategory.icon}</span>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              color: '#0f172a', 
              margin: '0', 
              fontFamily: "'Inter', 'Poppins', sans-serif" 
            }}>
              {currentCategory.name}
            </h1>
          </div>
          
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            background: '#f8f7ff',
            color: '#7c6fd6',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid #e6e0ff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {score}/{sentences.length}
          </div>
        </div>

        {/* Progress Bar - Matching GuessWhat */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '13px',
            color: '#64748b',
          }}>
            <span>Sentence {currentIndex + 1} of {sentences.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: '#f1f5f9', 
            borderRadius: '100px', 
            overflow: 'hidden',
          }}>
            <div style={{ 
              height: '100%', 
              background: `linear-gradient(90deg, ${currentCategory.color}, ${currentCategory.color}dd)`, 
              width: `${progress}%`, 
              transition: 'width 0.3s ease',
              borderRadius: '100px',
            }} />
          </div>
        </div>

        {/* Sentence Card - Matching GuessWhat question card style */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '32px', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
          border: '1px solid #e2e8f0',
        }}>
          {/* Difficulty Badge - Matching GuessWhat */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: '600',
              background: current.difficulty === 'beginner' ? '#e8f5e9' : 
                         current.difficulty === 'intermediate' ? '#fff4e5' : '#ffebee',
              color: current.difficulty === 'beginner' ? '#2e7d32' : 
                     current.difficulty === 'intermediate' ? '#b85c1a' : '#b91c1c',
              textTransform: 'capitalize',
            }}>
              {current.difficulty}
            </span>
            <span style={{
              padding: '4px 12px',
              background: '#f8f7ff',
              borderRadius: '100px',
              fontSize: '12px',
              color: '#7c6fd6',
              fontWeight: '500',
            }}>
              {currentCategory.name}
            </span>
          </div>

          {/* Sentence */}
          <div style={{ 
            marginBottom: '24px', 
            textAlign: 'center' 
          }}>
            <div style={{ 
              background: '#f8fafc', 
              borderRadius: '16px', 
              padding: '30px', 
              marginBottom: '20px',
              border: '1px solid #e2e8f0',
            }}>
              <h2 style={{ 
                fontSize: '22px', 
                fontWeight: '600', 
                color: '#0f172a', 
                lineHeight: '1.6',
                fontFamily: "'Inter', 'Poppins', sans-serif",
                margin: 0
              }}>
                {current.sentence}
              </h2>
            </div>
          </div>

          {/* Hint - Styled like GuessWhat image/sentence area */}
          <div style={{ 
            marginBottom: '24px',
            padding: '16px',
            background: '#f8f7ff',
            borderRadius: '12px',
            border: '1px solid #e6e0ff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px', color: '#7c6fd6' }}>💡</span>
            <p style={{ 
              fontSize: '15px', 
              color: '#475569', 
              fontStyle: 'italic',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              margin: 0
            }}>
              <strong>Hint:</strong> {current.hint}
            </p>
          </div>

          {/* Options - Matching GuessWhat exactly */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {current.options.map((option, idx) => {
              let bgColor = '#ffffff';
              let borderColor = '#e2e8f0';
              let textColor = '#0f172a';

              if (answered) {
                if (option === current.correct) {
                  bgColor = '#f0fdf4';
                  borderColor = '#4ade80';
                  textColor = '#166534';
                } else if (option === selectedWord && option !== current.correct) {
                  bgColor = '#fef2f2';
                  borderColor = '#fecaca';
                  textColor = '#991b1b';
                }
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  style={{ 
                    padding: '16px 20px',
                    border: `1px solid ${borderColor}`, 
                    borderRadius: '14px', 
                    background: bgColor, 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    color: textColor,
                    cursor: answered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Inter', 'Poppins', sans-serif",
                    textAlign: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gridColumn: idx >= 2 ? 'span 1' : 'auto'
                  }}
                  onMouseOver={(e) => {
                    if (!answered) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = currentCategory.color;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!answered) {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span>{option}</span>
                  {answered && option === current.correct && <span style={{ color: '#22c55e', fontSize: '20px' }}>✓</span>}
                  {answered && option === selectedWord && option !== current.correct && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                </button>
              );
            })}
          </div>

          {/* Next Button - Matching GuessWhat exactly */}
          {answered && (
            <button 
              onClick={handleNext}
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: '#0f172a', 
                color: 'white', 
                border: 'none', 
                borderRadius: '100px', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontWeight: '600',
                fontFamily: "'Inter', 'Poppins', sans-serif",
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#1e293b';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#0f172a';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              {currentIndex === sentences.length - 1 ? (
                'Finish Game'
              ) : (
                <>
                  <span>Next Sentence</span>
                  <span style={{ fontSize: '18px' }}>→</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Finished Screen - Matching GuessWhat exactly
  if (gameState === 'finished') {
    const percentage = Math.round((score / sentences.length) * 100);
    
    return (
      <div style={{ fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
        {/* Header - Matching GuessWhat */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: 'white', 
              border: '1px solid #e2e8f0', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#475569', 
              fontFamily: "'Inter', 'Poppins', sans-serif",
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Back
          </button>
          
          <h1 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#0f172a', 
            margin: '0', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            Game Complete!
          </h1>
          
          <div style={{ width: '40px' }}></div>
        </div>

        {/* Results Card - Matching GuessWhat exactly */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '40px', 
          textAlign: 'center', 
          boxShadow: '0 8px 24px rgba(124, 111, 214, 0.08)',
          border: '1px solid #e6e0ff',
        }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            {percentage === 100 ? '🏆' : '🎉'}
          </div>
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#0f172a', 
            marginBottom: '8px', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            {percentage === 100 ? 'Perfect Score!' : 'Great Job!'}
          </h2>
          
          <p style={{ 
            fontSize: '16px', 
            color: '#475569', 
            marginBottom: '24px', 
            fontFamily: "'Inter', 'Poppins', sans-serif" 
          }}>
            You scored {score} out of {sentences.length}
          </p>
          
          {/* Score Circle - Matching GuessWhat */}
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: `conic-gradient(#7c6fd6 0% ${percentage}%, #f1f5f9 ${percentage}% 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '700',
              color: '#7c6fd6'
            }}>
              {percentage}%
            </div>
          </div>
          
          {/* Message - Matching GuessWhat */}
          <div style={{ 
            background: '#f8f7ff', 
            borderRadius: '16px', 
            padding: '20px', 
            marginBottom: '28px',
            border: '1px solid #e6e0ff'
          }}>
            <p style={{ 
              fontSize: '15px', 
              color: '#475569', 
              margin: 0,
              fontFamily: "'Inter', 'Poppins', sans-serif",
              lineHeight: '1.6'
            }}>
              {score === sentences.length ? 'Amazing! You got all sentences right! 🏆' : 
               score >= sentences.length / 2 ? 'Great work! Keep practicing to improve! 👍' : 
               'Good start! Practice makes perfect! 💪'}
            </p>
          </div>

          {/* Action Buttons - Matching GuessWhat exactly */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleRestart} 
              style={{ 
                flex: 1, 
                padding: '14px', 
                background: '#7c6fd6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '100px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: '600', 
                fontFamily: "'Inter', 'Poppins', sans-serif",
                boxShadow: '0 4px 12px rgba(124, 111, 214, 0.2)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#6b5ec5';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#7c6fd6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '18px' }}>🔄</span>
              Play Again
            </button>
            
            <button 
              onClick={onBack} 
              style={{ 
                flex: 1, 
                padding: '14px', 
                background: 'white', 
                color: '#475569', 
                border: '1px solid #e2e8f0', 
                borderRadius: '100px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: '600', 
                fontFamily: "'Inter', 'Poppins', sans-serif",
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#7c6fd6';
                e.currentTarget.style.color = '#7c6fd6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <span style={{ fontSize: '18px' }}></span>
              More Games
            </button>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }
};

// MyProgress Component
const MyProgress = () => {
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('vocaboplay_progress');
    return savedProgress ? JSON.parse(savedProgress) : {
      level: 1,
      xp: 0,
      totalPoints: 0,
      streak: 0,
      gamesPlayed: 0,
      wordsLearned: 0,
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
  });

  useEffect(() => {
    const handleProgressUpdate = (event) => {
      setProgress(event.detail);
    };

    window.addEventListener('progressUpdate', handleProgressUpdate);
    return () => window.removeEventListener('progressUpdate', handleProgressUpdate);
  }, []);

  const accuracy = progress.totalAnswers > 0 
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100) 
    : 0;

  const xpToNextLevel = 100;
  const currentLevelXp = progress.xp % xpToNextLevel;
  const levelProgress = (currentLevelXp / xpToNextLevel) * 100;

  const achievements = [
    { 
      id: 'firstGame', 
      emoji: '🎮', 
      label: 'First Game', 
      unlocked: progress.achievements.firstGame,
      description: 'Play your first game'
    },
    { 
      id: 'perfectScore', 
      emoji: '🏆', 
      label: 'Perfect Score', 
      unlocked: progress.achievements.perfectScore,
      description: 'Get 100% on any game'
    },
    { 
      id: 'threeDayStreak', 
      emoji: '🔥', 
      label: '3 Day Streak', 
      unlocked: progress.achievements.threeDayStreak,
      description: 'Play 3 days in a row'
    },
    { 
      id: 'tenWords', 
      emoji: '📚', 
      label: '10 Words', 
      unlocked: progress.achievements.tenWords,
      description: 'Learn 10 vocabulary words'
    },
    { 
      id: 'masterLearner', 
      emoji: '⭐', 
      label: 'Master Learner', 
      unlocked: progress.achievements.masterLearner,
      description: 'Complete all games'
    }
  ];

return (
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '32px 20px',
    color: '#0f172a',
  }}>
    {/* Header Section - Matching Games/Word Library style */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: '32px',
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: '24px',
    }}>
      <div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#0f172a',
          margin: '0 0 8px 0',
          letterSpacing: '-0.01em',
          fontFamily: "'Inter', 'Poppins', sans-serif",
        }}>
          Learning Progress
        </h1>
        <p style={{
          fontSize: '15px',
          color: '#475569',
          margin: '0',
          fontWeight: '200',
        }}>
          Track your vocabulary mastery journey
        </p>
      </div>
      
  
    </div>

    {/* Main Stats Grid - 3 cards in a row like Games page */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '32px',
    }}>
      {/* Level Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#7c6fd6';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 111, 214, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#f8f7ff',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#7c6fd6',
          }}>🎯</div>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: '400',
              color: '#64748b',
              marginBottom: '4px',
            }}>Current Level</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#0f172a',
              lineHeight: '1',
            }}>{progress.level}</div>
          </div>
        </div>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '12px',
          }}>
            <span style={{ color: '#475569' }}>XP Progress</span>
            <span style={{ color: '#7c6fd6', fontWeight: '400' }}>
              {progress.xp} / {xpToNextLevel}
            </span>
          </div>
          <div style={{
            background: '#f1f5f9',
            height: '6px',
            borderRadius: '100px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #7c6fd6, #9b8de8)',
              width: `${levelProgress}%`,
              borderRadius: '100px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Points Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#7c6fd6';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 111, 214, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#f8f7ff',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#7c6fd6',
          }}>⭐</div>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: '400',
              color: '#64748b',
              marginBottom: '4px',
            }}>Total Points</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#0f172a',
              lineHeight: '1',
            }}>{progress.totalPoints}</div>
          </div>
        </div>
        <div style={{
          fontSize: '13px',
          color: '#475569',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ color: '#7c6fd6' }}>●</span>
          {progress.gamesPlayed} games played
        </div>
      </div>

      {/* Streak Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#7c6fd6';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 111, 214, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#f8f7ff',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#7c6fd6',
          }}>🔥</div>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: '400',
              color: '#64748b',
              marginBottom: '4px',
            }}>Current Streak</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#0f172a',
              lineHeight: '1',
            }}>{progress.streak}</div>
          </div>
        </div>
        <div style={{
          fontSize: '13px',
          color: '#475569',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '12px',
        }}>
          {progress.streak === 0 
            ? '✨ Start your streak today!' 
            : `🔥 ${progress.streak} days in a row`}
        </div>
      </div>
    </div>

    {/* Learning Stats - 4 cards in a row like Word Library stats */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '32px',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: '#f8f7ff',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          color: '#7c6fd6',
        }}>📚</div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', lineHeight: '1.2' }}>
            {progress.wordsLearned}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '400' }}>
            Words Learned
          </div>
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: '#f8f7ff',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          color: '#7c6fd6',
        }}>✅</div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', lineHeight: '1.2' }}>
            {accuracy}%
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '400' }}>
            Accuracy
          </div>
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: '#f8f7ff',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          color: '#7c6fd6',
        }}>🎮</div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', lineHeight: '1.2' }}>
            {progress.gamesPlayed}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '400' }}>
            Games Played
          </div>
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: '#f8f7ff',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          color: '#7c6fd6',
        }}>🏆</div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', lineHeight: '1.2' }}>
            {progress.correctAnswers}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '400' }}>
            Correct Answers
          </div>
        </div>
      </div>
    </div>

    {/* Game Performance - Clean table style like Word Library */}
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      marginBottom: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    }}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#0f172a',
          margin: 0,
          fontFamily: "'Inter', 'Poppins', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>          Game Performance
        </h2>
      </div>

      <div style={{ padding: '8px 0' }}>
        {/* Flashcards */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          transition: 'background 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: '160px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px', color: '#7c6fd6' }}>📇</span>
            <span style={{ fontSize: '14px', fontWeight: '400', color: '#0f172a' }}>Flashcards</span>
          </div>
          <div style={{ flex: 1, marginRight: '24px' }}>
            <div style={{
              background: '#f1f5f9',
              height: '8px',
              borderRadius: '100px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #7c6fd6, #9b8de8)',
                width: `${progress.flashcards.cardsViewed > 0 ? (progress.flashcards.knownWords.length / 30) * 100 : 0}%`,
                borderRadius: '100px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
          <div style={{ width: '100px', textAlign: 'right' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '400',
              color: '#7c6fd6',
              background: '#f8f7ff',
              padding: '4px 12px',
              borderRadius: '100px',
            }}>
              {progress.flashcards.knownWords.length}/30
            </span>
          </div>
        </div>

        {/* Quiz */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          transition: 'background 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: '160px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px', color: '#7c6fd6' }}>❓</span>
            <span style={{ fontSize: '14px', fontWeight: '400', color: '#0f172a' }}>Quiz Master</span>
          </div>
          <div style={{ flex: 1, marginRight: '24px' }}>
            <div style={{
              background: '#f1f5f9',
              height: '8px',
              borderRadius: '100px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #7c6fd6, #9b8de8)',
                width: `${progress.quiz.totalQuestions > 0 ? (progress.quiz.correctAnswers / progress.quiz.totalQuestions) * 100 : 0}%`,
                borderRadius: '100px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
          <div style={{ width: '100px', textAlign: 'right' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '400',
              color: '#7c6fd6',
              background: '#f8f7ff',
              padding: '4px 12px',
              borderRadius: '100px',
            }}>
              {progress.quiz.gamesCompleted} games
            </span>
          </div>
        </div>

        {/* Match Game */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          transition: 'background 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: '160px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px', color: '#7c6fd6' }}>🎯</span>
            <span style={{ fontSize: '14px', fontWeight: '400', color: '#0f172a' }}>Match Game</span>
          </div>
          <div style={{ flex: 1, marginRight: '24px' }}>
            <div style={{
              background: '#f1f5f9',
              height: '8px',
              borderRadius: '100px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #7c6fd6, #9b8de8)',
                width: `${progress.match.totalPairs > 0 ? (progress.match.totalPairs / 6) * 100 : 0}%`,
                borderRadius: '100px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
          <div style={{ width: '100px', textAlign: 'right' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '400',
              color: '#7c6fd6',
              background: '#f8f7ff',
              padding: '4px 12px',
              borderRadius: '100px',
            }}>
              {progress.match.totalPairs}/6
            </span>
          </div>
        </div>

        {/* GuessWhat */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          transition: 'background 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: '160px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px', color: '#7c6fd6' }}>🤔</span>
            <span style={{ fontSize: '14px', fontWeight: '400', color: '#0f172a' }}>GuessWhat</span>
          </div>
          <div style={{ flex: 1, marginRight: '24px' }}>
            <div style={{
              background: '#f1f5f9',
              height: '8px',
              borderRadius: '100px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #7c6fd6, #9b8de8)',
                width: `${progress.guessWhat.totalQuestions > 0 ? (progress.guessWhat.correctAnswers / progress.guessWhat.totalQuestions) * 100 : 0}%`,
                borderRadius: '100px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
          <div style={{ width: '100px', textAlign: 'right' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '400',
              color: '#7c6fd6',
              background: '#f8f7ff',
              padding: '4px 12px',
              borderRadius: '100px',
            }}>
              {progress.guessWhat.correctAnswers}/{progress.guessWhat.totalQuestions}
            </span>
          </div>
        </div>

        {/* Sentence Builder */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 24px',
          transition: 'background 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: '160px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px', color: '#7c6fd6' }}>📝</span>
            <span style={{ fontSize: '14px', fontWeight: '400', color: '#0f172a' }}>Sentence Builder</span>
          </div>
          <div style={{ flex: 1, marginRight: '24px' }}>
            <div style={{
              background: '#f1f5f9',
              height: '8px',
              borderRadius: '100px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #7c6fd6, #9b8de8)',
                width: `${progress.sentenceBuilder.totalSentences > 0 ? (progress.sentenceBuilder.correctAnswers / progress.sentenceBuilder.totalSentences) * 100 : 0}%`,
                borderRadius: '100px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
          <div style={{ width: '100px', textAlign: 'right' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '400',
              color: '#7c6fd6',
              background: '#f8f7ff',
              padding: '4px 12px',
              borderRadius: '100px',
            }}>
              {progress.sentenceBuilder.correctAnswers}/{progress.sentenceBuilder.totalSentences}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Achievements - Grid like Word Library cards */}
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      marginBottom: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#0f172a',
          margin: 0,
          fontFamily: "'Inter', 'Poppins', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '20px', color: '#7c6fd6' }}>🏅</span>
          Achievements
        </h2>
        <span style={{
          fontSize: '13px',
          color: '#64748b',
          background: '#f8fafc',
          padding: '6px 14px',
          borderRadius: '100px',
          border: '1px solid #e2e8f0',
        }}>
          {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            style={{
              background: achievement.unlocked ? '#f8f7ff' : '#ffffff',
              border: `1px solid ${achievement.unlocked ? '#7c6fd6' : '#e2e8f0'}`,
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              opacity: achievement.unlocked ? 1 : 0.7,
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              if (achievement.unlocked) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 111, 214, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (achievement.unlocked) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <div style={{
              fontSize: '28px',
              filter: achievement.unlocked ? 'none' : 'grayscale(1)',
            }}>
              {achievement.emoji}
            </div>
            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: achievement.unlocked ? '#7c6fd6' : '#64748b',
                marginBottom: '2px',
              }}>
                {achievement.label}
              </div>
              <div style={{
                fontSize: '11px',
                color: achievement.unlocked ? '#94a3b8' : '#94a3b8',
              }}>
                {achievement.unlocked ? '✓ Unlocked' : achievement.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Empty State - Clean like Games page */}
    {progress.gamesPlayed === 0 && (
      <div style={{
        textAlign: 'center',
        padding: '64px 40px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        maxWidth: '500px',
        margin: '0 auto',
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
          fontSize: '36px',
          color: '#7c6fd6',
        }}>
          🎮
        </div>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '8px',
        }}>
          Start Your Learning Journey!
        </h3>
        <p style={{
          fontSize: '15px',
          color: '#64748b',
          marginBottom: '24px',
          lineHeight: '1.6',
        }}>
          Play games to track your progress, earn achievements, and master vocabulary words.
        </p>
        <button
          onClick={() => setActiveMenu('Games')}
          style={{
            padding: '12px 32px',
            background: '#0f172a',
            color: 'white',
            border: 'none',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1e293b';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0f172a';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Browse Games →
        </button>
      </div>
    )}
  </div>
);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const savedProgress = localStorage.getItem('vocaboplay_progress');
    if (!savedProgress) {
      const initialProgress = {
        level: 1,
        xp: 0,
        totalPoints: 0,
        streak: 0,
        gamesPlayed: 0,
        wordsLearned: 0,
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
      localStorage.setItem('vocaboplay_progress', JSON.stringify(initialProgress));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // FIXED: Now sets activeMenu to null to hide dashboard
  const startGame = (gameId) => {
    console.log('Starting game:', gameId);
    setCurrentGame(gameId);
    setActiveMenu(null); // ← THIS IS THE KEY FIX
    setIsSidebarVisible(false);
    window.scrollTo(0, 0);
  };

  // FIXED: Restores dashboard when exiting game
  const exitGame = () => {
    console.log('Exiting game');
    setCurrentGame(null);
    setActiveMenu('Dashboard'); // ← RESTORE DASHBOARD
    setIsSidebarVisible(true);
  };

  const PlayGames = () => {
    const [filter, setFilter] = useState('all');
    const [hoveredGame, setHoveredGame] = useState(null);
    
    const games = [
      {
        id: 'flashcards',
        name: 'Flashcards',
        description: 'Master vocabulary through spaced repetition and active recall.',
        icon: '📇',
        accentColor: '#5E4B8C',
        lightColor: '#F3F1F9',
        category: 'vocab',
        timeEstimate: '5-10 min',
        difficulty: 'beginner',
        players: '1 player',
        available: true
      },
      {
        id: 'match',
        name: 'Match Game',
        description: 'Connect words with definitions in this fast-paced memory challenge.',
        icon: '🎯',
        accentColor: '#B83B5E',
        lightColor: '#FDF1F4',
        category: 'vocab',
        timeEstimate: '3-5 min',
        difficulty: 'beginner',
        players: '1 player',
        available: true
      },
      {
        id: 'short-story',
        name: 'Short Story',
        description: 'Immerse yourself in narratives while learning vocabulary in context.',
        icon: '📖',
        accentColor: '#2F5D62',
        lightColor: '#EEF3F3',
        category: 'reading',
        timeEstimate: '15-20 min',
        difficulty: 'intermediate',
        players: '1 player',
        available: true
      },
      {
        id: 'quiz',
        name: 'Quiz Master',
        description: 'Test your knowledge with adaptive multiple choice questions.',
        icon: '❓',
        accentColor: '#1F4E5F',
        lightColor: '#E8EDF0',
        category: 'challenge',
        timeEstimate: '10-15 min',
        difficulty: 'intermediate',
        players: '1 player',
        available: true
      },
      {
        id: 'guesswhat',
        name: 'GuessWhat',
        description: 'Deduce the correct word from visual context clues and sentences.',
        icon: '🤔',
        accentColor: '#C44545',
        lightColor: '#FCEEEE',
        category: 'challenge',
        timeEstimate: '8-12 min',
        difficulty: 'advanced',
        players: '1 player',
        available: true
      },
      {
        id: 'sentence-builder',
        name: 'Sentence Builder',
        description: 'Construct grammatically correct sentences using vocabulary in context.',
        icon: '📝',
        accentColor: '#3A6B6B',
        lightColor: '#EDF3F3',
        category: 'vocab',
        timeEstimate: '6-10 min',
        difficulty: 'beginner',
        players: '1 player',
        available: true
      },
    ];

    const categories = [
      { id: 'all', name: 'All Games', icon: '🎮', color: '#0f172a' },
      { id: 'vocab', name: 'Vocabulary', icon: '📚', color: '#5E4B8C' },
      { id: 'reading', name: 'Reading', icon: '📖', color: '#2F5D62' },
      { id: 'challenge', name: 'Challenge', icon: '⚡', color: '#B83B5E' },
    ];

    const filteredGames = filter === 'all' 
      ? games 
      : games.filter(game => game.category === filter);

    const getDifficultyColor = (difficulty) => {
      switch(difficulty) {
        case 'beginner': return '#2E7D32';
        case 'intermediate': return '#B85C1A';
        case 'advanced': return '#A93226';
        default: return '#64748b';
      }
    };

    return (
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px',
        fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#0f172a',
      }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '24px',
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 8px 0',
              letterSpacing: '-0.01em',
              fontFamily: "'Inter', 'Poppins', sans-serif",
            }}>
              Learning Games
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#475569',
              margin: '0',
              fontWeight: '300',
            }}>
              Choose your adventure • All games use your vocabulary library
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px',
          }}>
          </div>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '100px',
          }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: filter === cat.id ? '#ffffff' : 'transparent',
                  color: filter === cat.id ? cat.color : '#475569',
                  boxShadow: filter === cat.id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                {cat.name}
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
            {filteredGames.length} games available
          </span>
        </div>

        {/* Games Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}>
          {filteredGames.map((game, index) => (
            <div
              key={game.id}
              onClick={() => game.available && startGame(game.id)}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              style={{
                background: '#ffffff',
                border: `1px solid ${hoveredGame === game.id ? game.accentColor : '#e2e8f0'}`,
                borderRadius: '20px',
                padding: '28px',
                cursor: game.available ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: hoveredGame === game.id 
                  ? `0 20px 30px -10px ${game.accentColor}20`
                  : '0 4px 6px -2px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                opacity: game.available ? 1 : 0.5,
              }}
            >
              {/* Subtle gradient overlay on hover */}
              {hoveredGame === game.id && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${game.accentColor}, ${game.accentColor}80)`,
                }} />
              )}

              {/* Icon and Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: game.lightColor,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease',
                  transform: hoveredGame === game.id ? 'scale(1.05)' : 'scale(1)',
                }}>
                  <span style={{
                    fontSize: '32px',
                  }}>
                    {game.icon}
                  </span>
                </div>
                
                {!game.available && (
                  <span style={{
                    padding: '4px 12px',
                    background: '#f1f5f9',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#64748b',
                  }}>
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Game Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0',
                    fontFamily: "'Inter', 'Poppins', sans-serif",
                    letterSpacing: '-0.01em',
                  }}>
                    {game.name}
                  </h3>
                  
                  {/* Difficulty Badge */}
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: '400',
                    background: `${getDifficultyColor(game.difficulty)}10`,
                    color: getDifficultyColor(game.difficulty),
                    textTransform: 'capitalize',
                  }}>
                    {game.difficulty}
                  </span>
                </div>
                
                <p style={{
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: '0 0 16px 0',
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                }}>
                  {game.description}
                </p>
              </div>

              {/* Metadata and CTA */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  fontSize: '12px',
                  color: '#64748b',
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ fontSize: '14px' }}>⏱️</span>
                    {game.timeEstimate}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: game.available ? game.accentColor : '#94a3b8',
                  fontSize: '14px',
                  fontWeight: '500',
                }}>
                  <span>{game.available ? 'Start Game' : 'Unavailable'}</span>
                  <span style={{
                    fontSize: '18px',
                    transition: 'transform 0.2s ease',
                    transform: hoveredGame === game.id && game.available ? 'translateX(4px)' : 'translateX(0)',
                  }}>
                    {game.available ? '→' : '⏳'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            maxWidth: '500px',
            margin: '40px auto',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#f1f5f9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <span style={{ fontSize: '32px' }}>🎮</span>
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '8px',
            }}>
              No games in this category
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#64748b',
              marginBottom: '24px',
            }}>
              Try selecting a different filter
            </p>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '10px 24px',
                background: '#0f172a',
                color: 'white',
                border: 'none',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
              onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
            >
              View all games
            </button>
          </div>
        )}

        {/* Footer Stats */}
        {filteredGames.length > 0 && (
          <div style={{
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: '#64748b',
          }}>
            <div style={{
              display: 'flex',
              gap: '24px',
            }}>
              <span>🎮 {games.filter(g => g.available).length} available</span>
              <span>📚 {games.filter(g => g.category === 'vocab').length} vocabulary games</span>
              <span>📖 {games.filter(g => g.category === 'reading').length} reading games</span>
              <span>⚡ {games.filter(g => g.category === 'challenge').length} challenge games</span>
            </div>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span style={{ fontSize: '14px' }}>✨</span>
              New games added regularly
            </span>
          </div>
        )}

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .game-card {
            animation: fadeInUp 0.5s ease-out backwards;
          }
        `}</style>
      </div>
    );
  };

  const WordLibrary = () => {
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [localFavorites, setLocalFavorites] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('word');
    const [selectedWord, setSelectedWord] = useState(null);
    const [showWordDetails, setShowWordDetails] = useState(false);

    const toggleFavorite = (wordId) => {
      setLocalFavorites(prev => 
        prev.includes(wordId) 
          ? prev.filter(id => id !== wordId)
          : [...prev, wordId]
      );
    };

    // Enhanced word data with A-Z complete dictionary
    const words = [
      // A Words
      { id: 1, word: 'Analyze', definition: 'To examine carefully and in detail' },
      { id: 2, word: 'Adapt', definition: 'To adjust to new conditions or situations' },
      { id: 3, word: 'Advocate', definition: 'To publicly support or recommend' },
      { id: 4, word: 'Articulate', definition: 'To express ideas clearly and effectively' },
      { id: 5, word: 'Assess', definition: 'To evaluate or estimate the nature of something' },
      
      // B Words
      { id: 6, word: 'Brainstorm', definition: 'To generate ideas through spontaneous discussion' },
      { id: 7, word: 'Beneficial', definition: 'Producing good or helpful results' },
      { id: 8, word: 'Brief', definition: 'Concise and using few words' },
      { id: 9, word: 'Broaden', definition: 'To expand or make wider' },
      { id: 10, word: 'Build', definition: 'To construct or develop gradually' },
      
      // C Words
      { id: 11, word: 'Collaborate', definition: 'To work jointly on an activity or project' },
      { id: 12, word: 'Concentrate', definition: 'To focus all attention on something' },
      { id: 13, word: 'Communicate', definition: 'To share or exchange information' },
      { id: 14, word: 'Comprehend', definition: 'To grasp mentally or understand' },
      { id: 15, word: 'Create', definition: 'To bring something into existence' },
      
      // D Words
      { id: 16, word: 'Demonstrate', definition: 'To show clearly and deliberately' },
      { id: 17, word: 'Debate', definition: 'To discuss opposing viewpoints' },
      { id: 18, word: 'Define', definition: 'To state the exact meaning of something' },
      { id: 19, word: 'Develop', definition: 'To grow or cause to grow gradually' },
      { id: 20, word: 'Discover', definition: 'To find or learn something for the first time' },
      
      // E Words
      { id: 21, word: 'Evaluate', definition: 'To determine the significance or worth of' },
      { id: 22, word: 'Engage', definition: 'To occupy or attract attention' },
      { id: 23, word: 'Enhance', definition: 'To improve or increase in value' },
      { id: 24, word: 'Explain', definition: 'To make something clear and understandable' },
      { id: 25, word: 'Explore', definition: 'To travel through for discovery' },
      
      // F Words
      { id: 26, word: 'Facilitate', definition: 'To make an action or process easier' },
      { id: 27, word: 'Focus', definition: 'To concentrate attention or effort' },
      { id: 28, word: 'Formulate', definition: 'To create or prepare carefully' },
      { id: 29, word: 'Foster', definition: 'To encourage or promote development' },
      { id: 30, word: 'Function', definition: 'To work or operate properly' },
      
      // G Words
      { id: 31, word: 'Generate', definition: 'To produce or create something' },
      { id: 32, word: 'Grasp', definition: 'To understand something completely' },
      { id: 33, word: 'Guide', definition: 'To direct or influence behavior' },
      { id: 34, word: 'Gather', definition: 'To collect or bring together' },
      { id: 35, word: 'Graduate', definition: 'To successfully complete a level of study' },
      
      // H Words
      { id: 36, word: 'Hypothesize', definition: 'To put forward a supposition or conjecture' },
      { id: 37, word: 'Highlight', definition: 'To emphasize or make prominent' },
      { id: 38, word: 'Help', definition: 'To make it easier for someone to do something' },
      { id: 39, word: 'Handle', definition: 'To manage or deal with effectively' },
      { id: 40, word: 'Hone', definition: 'To refine or perfect something over time' },
      
      // I Words
      { id: 41, word: 'Interpret', definition: 'To explain the meaning of information' },
      { id: 42, word: 'Investigate', definition: 'To carry out a systematic inquiry' },
      { id: 43, word: 'Illustrate', definition: 'To explain or clarify with examples' },
      { id: 44, word: 'Implement', definition: 'To put a plan into effect' },
      { id: 45, word: 'Improve', definition: 'To make or become better' },
      
      // J Words
      { id: 46, word: 'Justify', definition: 'To show or prove to be right' },
      { id: 47, word: 'Join', definition: 'To link or connect together' },
      { id: 48, word: 'Juggle', definition: 'To manage multiple tasks at once' },
      { id: 49, word: 'Judge', definition: 'To form an opinion or conclusion' },
      { id: 50, word: 'Jot', definition: 'To write down quickly and briefly' },
      
      // K Words
      { id: 51, word: 'Know', definition: 'To have information in your mind' },
      { id: 52, word: 'Keep', definition: 'To continue in a specified condition' },
      { id: 53, word: 'Kickstart', definition: 'To initiate something with energy' },
      { id: 54, word: 'Kin', definition: 'To be related or connected' },
      { id: 55, word: 'Knit', definition: 'To join closely and firmly' },
      
      // L Words
      { id: 56, word: 'Learn', definition: 'To gain knowledge through study or experience' },
      { id: 57, word: 'Listen', definition: 'To pay attention to sound or speech' },
      { id: 58, word: 'Lead', definition: 'To guide or direct in a course' },
      { id: 59, word: 'Lecture', definition: 'To deliver an educational talk' },
      { id: 60, word: 'Link', definition: 'To connect or join together' },
      
      // M Words
      { id: 61, word: 'Memorize', definition: 'To commit something to memory' },
      { id: 62, word: 'Motivate', definition: 'To provide with a reason to act' },
      { id: 63, word: 'Modify', definition: 'To make partial changes to' },
      { id: 64, word: 'Mentor', definition: 'To advise or guide someone' },
      { id: 65, word: 'Master', definition: 'To gain comprehensive knowledge of' },
      
      // N Words
      { id: 66, word: 'Navigate', definition: 'To plan and direct a course' },
      { id: 67, word: 'Negotiate', definition: 'To reach agreement through discussion' },
      { id: 68, word: 'Note', definition: 'To record or observe carefully' },
      { id: 69, word: 'Nurture', definition: 'To care for and encourage growth' },
      { id: 70, word: 'Name', definition: 'To identify or specify' },
      
      // O Words
      { id: 71, word: 'Organize', definition: 'To arrange systematically' },
      { id: 72, word: 'Observe', definition: 'To watch carefully and attentively' },
      { id: 73, word: 'Obtain', definition: 'To get or acquire something' },
      { id: 74, word: 'Offer', definition: 'To present for acceptance or rejection' },
      { id: 75, word: 'Operate', definition: 'To control the functioning of' },
      
      // P Words
      { id: 76, word: 'Participate', definition: 'To take part in an activity' },
      { id: 77, word: 'Persevere', definition: 'To continue despite difficulty' },
      { id: 78, word: 'Plan', definition: 'To decide on and arrange in advance' },
      { id: 79, word: 'Practice', definition: 'To perform repeatedly to gain skill' },
      { id: 80, word: 'Present', definition: 'To show or display formally' },
      
      // Q Words
      { id: 81, word: 'Question', definition: 'To ask or inquire about something' },
      { id: 82, word: 'Quantify', definition: 'To express or measure the quantity of' },
      { id: 83, word: 'Qualify', definition: 'To meet the necessary standards' },
      { id: 84, word: 'Quote', definition: 'To repeat exactly words from a source' },
      { id: 85, word: 'Query', definition: 'To ask a question about something' },
      
      // R Words
      { id: 86, word: 'Research', definition: 'To investigate systematically' },
      { id: 87, word: 'Read', definition: 'To look at and comprehend written text' },
      { id: 88, word: 'Reflect', definition: 'To think deeply or carefully about' },
      { id: 89, word: 'Review', definition: 'To assess or examine again' },
      { id: 90, word: 'Reason', definition: 'To think logically to form conclusions' },
      
      // S Words
      { id: 91, word: 'Summarize', definition: 'To give a brief statement of main points' },
      { id: 92, word: 'Study', definition: 'To devote time and attention to learning' },
      { id: 93, word: 'Solve', definition: 'To find an answer to a problem' },
      { id: 94, word: 'Share', definition: 'To have or use something jointly' },
      { id: 95, word: 'Support', definition: 'To give assistance or encouragement' },
      
      // T Words
      { id: 96, word: 'Teach', definition: 'To impart knowledge or skill' },
      { id: 97, word: 'Think', definition: 'To have a particular belief or idea' },
      { id: 98, word: 'Test', definition: 'To examine through trial or use' },
      { id: 99, word: 'Track', definition: 'To follow the progress of' },
      { id: 100, word: 'Translate', definition: 'To express in another language' },
      
      // U Words
      { id: 101, word: 'Understand', definition: 'To perceive the meaning of' },
      { id: 102, word: 'Use', definition: 'To employ for a purpose' },
      { id: 103, word: 'Uncover', definition: 'To discover or reveal' },
      { id: 104, word: 'Update', definition: 'To bring up to date' },
      { id: 105, word: 'Utilize', definition: 'To make practical use of' },
      
      // V Words
      { id: 106, word: 'Verify', definition: 'To confirm the truth or accuracy of' },
      { id: 107, word: 'Visualize', definition: 'To form a mental image of' },
      { id: 108, word: 'Volunteer', definition: 'To offer oneself for a service' },
      { id: 109, word: 'Vocalize', definition: 'To express in words' },
      { id: 110, word: 'Value', definition: 'To consider important or worthwhile' },
      
      // W Words
      { id: 111, word: 'Write', definition: 'To mark letters or words on surface' },
      { id: 112, word: 'Work', definition: 'To exert effort to achieve something' },
      { id: 113, word: 'Wonder', definition: 'To desire to know something' },
      { id: 114, word: 'Witness', definition: 'To see something happen' },
      { id: 115, word: 'Welcome', definition: 'To greet or accept gladly' },
      
      // X Words
      { id: 116, word: 'Xerox', definition: 'To make a copy of document' },
      { id: 117, word: 'X-ray', definition: 'To examine with X-rays' },
      { id: 118, word: 'Xeriscape', definition: 'To landscape with minimal water use' },
      { id: 119, word: 'Xylophone', definition: 'To play a musical instrument with bars' },
      { id: 120, word: 'Xenodochy', definition: 'To show hospitality to strangers' },
      
      // Y Words
      { id: 121, word: 'Yield', definition: 'To produce or provide results' },
      { id: 122, word: 'Yearn', definition: 'To have an intense longing for' },
      { id: 123, word: 'Yell', definition: 'To shout or cry out loudly' },
      { id: 124, word: 'Yoke', definition: 'To join or link together' },
      { id: 125, word: 'Yawn', definition: 'To open mouth wide with tiredness' },
      
      // Z Words
      { id: 126, word: 'Zoom', definition: 'To move or travel very quickly' },
      { id: 127, word: 'Zero', definition: 'To focus attention or adjust to a target' },
      { id: 128, word: 'Zest', definition: 'To approach with enthusiasm' },
      { id: 129, word: 'Zone', definition: 'To divide into areas for specific use' },
      { id: 130, word: 'Zigzag', definition: 'To move in sharp alternate directions' }
    ].map((word, index) => {
      let difficulty = 'beginner';
      let color = '#2E7D32';
      if (index >= 30 && index <= 70) {
        difficulty = 'intermediate';
        color = '#B85C1A';
      } else if (index > 70) {
        difficulty = 'advanced';
        color = '#A93226';
      }

      let category = 'academic';
      let partOfSpeech = 'verb';
      let synonyms = [];
      let antonyms = [];
      let example1 = '';
      let example2 = '';
      let example3 = '';
      
      if (index % 3 === 0) {
        category = 'action verbs';
        partOfSpeech = 'verb';
        synonyms = ['execute', 'perform', 'accomplish'];
        antonyms = ['ignore', 'neglect', 'avoid'];
      }
      if (index % 3 === 1) {
        category = 'learning strategies';
        partOfSpeech = 'noun';
        synonyms = ['technique', 'method', 'approach'];
        antonyms = ['ignorance', 'neglect', 'oversight'];
      }
      if (index % 3 === 2) {
        category = 'academic';
        partOfSpeech = 'adjective';
        synonyms = ['scholarly', 'educational', 'intellectual'];
        antonyms = ['uneducated', 'ignorant', 'unschooled'];
      }

      // Customize based on specific words (maintaining original customization)
      const wordLower = word.word.toLowerCase();
      
      // Define synonyms and antonyms based on word
      const wordData = {
        'analyze': { synonyms: ['examine', 'study', 'investigate'], antonyms: ['ignore', 'overlook', 'neglect'] },
        'collaborate': { synonyms: ['cooperate', 'team up', 'work together'], antonyms: ['compete', 'oppose', 'work alone'] },
        'concentrate': { synonyms: ['focus', 'attend', 'fixate'], antonyms: ['distract', 'ignore', 'wander'] },
        'communicate': { synonyms: ['convey', 'express', 'share'], antonyms: ['withhold', 'conceal', 'suppress'] },
        'demonstrate': { synonyms: ['show', 'display', 'illustrate'], antonyms: ['hide', 'conceal', 'obscure'] },
        'investigate': { synonyms: ['examine', 'inspect', 'probe'], antonyms: ['ignore', 'neglect', 'overlook'] },
        'participate': { synonyms: ['join', 'engage', 'take part'], antonyms: ['abstain', 'avoid', 'withdraw'] },
        'persevere': { synonyms: ['persist', 'endure', 'continue'], antonyms: ['give up', 'quit', 'surrender'] },
        'organize': { synonyms: ['arrange', 'sort', 'order'], antonyms: ['disorganize', 'mess up', 'scatter'] },
        'summarize': { synonyms: ['outline', 'recap', 'condense'], antonyms: ['elaborate', 'expand', 'detail'] }
      };

      if (wordData[wordLower]) {
        synonyms = wordData[wordLower].synonyms;
        antonyms = wordData[wordLower].antonyms;
        example1 = `"The students learned to ${wordLower} effectively in class."`;
        example2 = `"She ${wordLower}s with great skill and precision."`;
        example3 = `"It's important to ${wordLower} when approaching complex tasks."`;
      } else {
        // Default examples for other words
        example1 = `"The students learned to ${wordLower} in class."`;
        example2 = `"She ${wordLower}s effectively with her peers."`;
        example3 = `"It's important to ${wordLower} in academic settings."`;
      }

      return {
        id: word.id,
        word: word.word,
        pronunciation: `/ˈ${wordLower}/`,
        partOfSpeech: partOfSpeech,
        definition: word.definition,
        examples: [example1, example2, example3],
        synonyms: synonyms,
        antonyms: antonyms,
        difficulty: difficulty,
        color: color,
        category: category,
        teacherNote: 'Essential vocabulary for academic success'
      };
    });

    const categories = [
      { id: 'all', name: 'All Categories', color: '#5E4B8C' },
      { id: 'action verbs', name: 'Action Verbs', color: '#B83B5E' },
      { id: 'learning strategies', name: 'Learning Strategies', color: '#2F5D62' },
      { id: 'academic', name: 'Academic', color: '#1F4E5F' }
    ];

    const difficultyLevels = [
      { id: 'all', name: 'All Levels', color: '#5E4B8C' },
      { id: 'beginner', name: 'Beginner', color: '#2E7D32' },
      { id: 'intermediate', name: 'Intermediate', color: '#B85C1A' },
      { id: 'advanced', name: 'Advanced', color: '#A93226' },
      { id: 'favorites', name: 'Favorites', color: '#C44545' }
    ];

    const sortWords = (wordsToSort) => {
      switch(sortBy) {
        case 'word':
          return [...wordsToSort].sort((a, b) => a.word.localeCompare(b.word));
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          return [...wordsToSort].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        case 'category':
          return [...wordsToSort].sort((a, b) => a.category.localeCompare(b.category));
        default:
          return wordsToSort;
      }
    };

    const filteredWords = words.filter(word => {
      const matchesDifficulty = selectedDifficulty === 'all' 
        ? true 
        : selectedDifficulty === 'favorites' 
          ? localFavorites.includes(word.id)
          : word.difficulty === selectedDifficulty;
      
      const matchesCategory = selectedCategory === 'all' 
        ? true 
        : word.category === selectedCategory;
      
      const matchesSearch = searchTerm === '' 
        ? true 
        : word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.partOfSpeech.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesDifficulty && matchesCategory && matchesSearch;
    });

    const sortedAndFilteredWords = sortWords(filteredWords);

    const totalWords = words.length;
    const masteredWords = localFavorites.length;
    const beginnerWords = words.filter(w => w.difficulty === 'beginner').length;
    const intermediateWords = words.filter(w => w.difficulty === 'intermediate').length;
    const advancedWords = words.filter(w => w.difficulty === 'advanced').length;

    // Word Details Modal (keeping exactly the same as original)
    const WordDetailsModal = ({ word, onClose }) => (
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
        zIndex: 2000,
        backdropFilter: 'blur(4px)',
        padding: '20px',
      }} onClick={onClose}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(124, 111, 214, 0.2)',
          border: '1px solid #e6e0ff',
          position: 'relative',
        }} onClick={(e) => e.stopPropagation()}>
          
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#f1f5f9',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e2e8f0';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            ✕
          </button>

          {/* Word Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
            paddingRight: '40px',
          }}>
            <div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 8px 0',
                fontFamily: "'Inter', 'Poppins', sans-serif",
                letterSpacing: '-0.02em',
              }}>
                {word.word}
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontSize: '16px',
                  color: '#64748b',
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                }}>
                  {word.pronunciation}
                </span>
                <span style={{
                  padding: '4px 12px',
                  background: '#f1f5f9',
                  borderRadius: '100px',
                  fontSize: '14px',
                  color: '#475569',
                  fontWeight: '500',
                }}>
                  {word.partOfSpeech}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(word.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '32px',
                color: localFavorites.includes(word.id) ? '#FFD700' : '#94a3b8',
                transition: 'all 0.2s ease',
                padding: '8px',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {localFavorites.includes(word.id) ? '★' : '☆'}
            </button>
          </div>

          {/* Definition */}
          <div style={{
            background: '#f8f7ff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '28px',
            border: '1px solid #e6e0ff',
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#7c6fd6',
              margin: '0 0 8px 0',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Definition
            </h3>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: '#0f172a',
              margin: '0',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              fontWeight: '500',
            }}>
              {word.definition}
            </p>
          </div>

          {/* Example Sentences */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#475569',
              margin: '0 0 16px 0',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Example Sentences
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {word.examples.map((example, idx) => (
                <div key={idx} style={{
                  background: '#ffffff',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontStyle: 'italic',
                  fontSize: '15px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  position: 'relative',
                  paddingLeft: '32px',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '16px',
                    color: '#7c6fd6',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>#{idx + 1}</span>
                  {example}
                </div>
              ))}
            </div>
          </div>

          {/* Synonyms and Antonyms */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '28px',
          }}>
            {/* Synonyms */}
            <div style={{
              background: '#f0fdf4',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #bbf7d0',
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#166534',
                margin: '0 0 12px 0',
                fontFamily: "'Inter', 'Poppins', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ fontSize: '18px' }}>↗️</span>
                Synonyms
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {word.synonyms.length > 0 ? word.synonyms.map((syn, idx) => (
                  <span key={idx} style={{
                    padding: '6px 14px',
                    background: '#ffffff',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                  }}>
                    {syn}
                  </span>
                )) : (
                  <span style={{ color: '#64748b', fontSize: '14px' }}>No synonyms available</span>
                )}
              </div>
            </div>

            {/* Antonyms */}
            <div style={{
              background: '#fef2f2',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #fecaca',
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#991b1b',
                margin: '0 0 12px 0',
                fontFamily: "'Inter', 'Poppins', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ fontSize: '18px' }}>↘️</span>
                Antonyms
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {word.antonyms.length > 0 ? word.antonyms.map((ant, idx) => (
                  <span key={idx} style={{
                    padding: '6px 14px',
                    background: '#ffffff',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                  }}>
                    {ant}
                  </span>
                )) : (
                  <span style={{ color: '#64748b', fontSize: '14px' }}>No antonyms available</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: '600',
                background: `${word.color}10`,
                color: word.color,
                textTransform: 'capitalize',
              }}>
                {word.difficulty}
              </span>
              <span style={{
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: '500',
                background: '#f1f5f9',
                color: '#475569',
                textTransform: 'capitalize',
              }}>
                {word.category}
              </span>
            </div>
            <span style={{
              fontSize: '13px',
              color: '#94a3b8',
              fontStyle: 'italic',
            }}>
              {word.teacherNote}
            </span>
          </div>
        </div>
      </div>
    );

    return (
      <>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
          `}
        </style>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 24px',
          fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
          color: '#1e293b',
        }}>
          {/* Word Details Modal */}
          {showWordDetails && selectedWord && (
            <WordDetailsModal 
              word={selectedWord} 
              onClose={() => {
                setShowWordDetails(false);
                setSelectedWord(null);
              }} 
            />
          )}

          {/* Header Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '24px',
          }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 8px 0',
                letterSpacing: '-0.01em',
                fontFamily: "'Inter', 'Poppins', sans-serif",
              }}>
Word Library              </h1>
              <p style={{
                fontSize: '15px',
                color: '#475569',
                margin: '0',
                fontWeight: '400',
              }}>
                A comprehensive collection of {totalWords} essential words
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
            }}>
              <div style={{
                background: '#f8fafc',
                borderRadius: '100px',
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                color: '#0f172a',
                fontWeight: '300',
              }}>
                 {totalWords} words
              </div>
              <div style={{
                background: '#f8fafc',
                borderRadius: '100px',
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                color: '#0f172a',
                fontWeight: '300',
              }}>
                ⭐ {masteredWords} mastered
              </div>
            </div>
          </div>

          {/* Search and Filter Bar - keeping exactly the same as original */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}>
            {/* Search */}
            <div style={{
              marginBottom: '24px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '4px 4px 4px 16px',
                transition: 'all 0.2s ease',
              }}>
                <span style={{ color: '#64748b', fontSize: '18px', marginRight: '8px' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by word, definition, category, or part of speech..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 0',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '15px',
                    fontFamily: "'Inter', 'Poppins', sans-serif",
                    outline: 'none',
                    color: '#0f172a',
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
            </div>

            {/* Filters Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              alignItems: 'flex-start',
            }}>
              {/* Categories */}
              <div style={{ flex: '1 1 300px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#475569',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}>
                  Category
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Inter', 'Poppins', sans-serif",
                        background: selectedCategory === category.id ? category.color : 'transparent',
                        color: selectedCategory === category.id ? 'white' : '#475569',
                        border: selectedCategory === category.id 
                          ? `1px solid ${category.color}`
                          : '1px solid #e2e8f0',
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Levels */}
              <div style={{ flex: '1 1 300px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#475569',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}>
                  Difficulty
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}>
                  {difficultyLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedDifficulty(level.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Inter', 'Poppins', sans-serif",
                        background: selectedDifficulty === level.id ? level.color : 'transparent',
                        color: selectedDifficulty === level.id ? 'white' : '#475569',
                        border: selectedDifficulty === level.id 
                          ? `1px solid ${level.color}`
                          : '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {level.id === 'favorites' && '⭐'}
                      {level.name}
                      {level.id === 'favorites' && localFavorites.length > 0 && (
                        <span style={{
                          background: selectedDifficulty === 'favorites' ? 'rgba(255,255,255,0.2)' : '#C44545',
                          color: 'white',
                          borderRadius: '100px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          {localFavorites.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort & View Options */}
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#475569',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}>
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '8px 32px 8px 16px',
                      borderRadius: '100px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#0f172a',
                      background: '#ffffff',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475669' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                    }}
                  >
                    <option value="word">Word (A-Z)</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="category">Category</option>
                  </select>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#475569',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}>
                    View
                  </label>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    padding: '4px',
                    background: '#f1f5f9',
                    borderRadius: '100px',
                  }}>
                    <button
                      onClick={() => setViewMode('grid')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                        color: viewMode === 'grid' ? '#0f172a' : '#64748b',
                        boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        background: viewMode === 'list' ? '#ffffff' : 'transparent',
                        color: viewMode === 'list' ? '#0f172a' : '#64748b',
                        boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchTerm) && (
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontSize: '13px',
                  color: '#475569',
                  fontWeight: '500',
                }}>
                  Active filters:
                </span>
                {selectedCategory !== 'all' && (
                  <span style={{
                    padding: '4px 12px',
                    background: '#f1f5f9',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    Category: {categories.find(c => c.id === selectedCategory)?.name}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#64748b',
                        padding: '0 2px',
                      }}
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedDifficulty !== 'all' && (
                  <span style={{
                    padding: '4px 12px',
                    background: '#f1f5f9',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    Level: {difficultyLevels.find(d => d.id === selectedDifficulty)?.name}
                    <button
                      onClick={() => setSelectedDifficulty('all')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#64748b',
                        padding: '0 2px',
                      }}
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span style={{
                    padding: '4px 12px',
                    background: '#f1f5f9',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#64748b',
                        padding: '0 2px',
                      }}
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setSearchTerm('');
                  }}
                  style={{
                    padding: '4px 12px',
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: '#475569',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#475569',
              margin: '0',
            }}>
              Showing <span style={{ fontWeight: '600', color: '#0f172a' }}>{sortedAndFilteredWords.length}</span> of <span style={{ fontWeight: '600', color: '#0f172a' }}>{totalWords}</span> words
            </p>
            {selectedDifficulty === 'favorites' && localFavorites.length === 0 && (
              <p style={{
                fontSize: '14px',
                color: '#C44545',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span>⭐</span> No favorites yet
              </p>
            )}
          </div>

          {/* Empty State - Favorites */}
          {selectedDifficulty === 'favorites' && localFavorites.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              maxWidth: '500px',
              margin: '40px auto',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <span style={{ fontSize: '32px' }}>⭐</span>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '8px',
                fontFamily: "'Inter', 'Poppins', sans-serif",
              }}>
                No favorites yet
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#64748b',
                marginBottom: '24px',
                fontFamily: "'Inter', 'Poppins', sans-serif",
              }}>
                Click the star icon on any word to add it to your favorites list
              </p>
              <button
                onClick={() => setSelectedDifficulty('all')}
                style={{
                  padding: '10px 24px',
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
              >
                Browse all words
              </button>
            </div>
          ) : sortedAndFilteredWords.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              maxWidth: '500px',
              margin: '40px auto',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#f1f5f9',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <span style={{ fontSize: '32px' }}>🔍</span>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '8px',
              }}>
                No words found
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#64748b',
                marginBottom: '24px',
              }}>
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
                style={{
                  padding: '10px 24px',
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div style={{
              display: viewMode === 'grid' 
                ? 'grid'
                : 'flex',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : 'none',
              flexDirection: viewMode === 'list' ? 'column' : 'none',
              gap: viewMode === 'grid' ? '20px' : '12px',
            }}>
              {sortedAndFilteredWords.map((word) => (
                <div 
                  key={word.id} 
                  style={viewMode === 'grid' ? {
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Inter', 'Poppins', sans-serif",
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                  } : {
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '20px 24px',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Inter', 'Poppins', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedWord(word);
                    setShowWordDetails(true);
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                  }}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#0f172a',
                            margin: '0 0 4px 0',
                            fontFamily: "'Inter', 'Poppins', sans-serif",
                            letterSpacing: '-0.01em',
                          }}>
                            {word.word}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p style={{
                              fontSize: '12px',
                              color: '#64748b',
                              margin: '0',
                              fontFamily: "'Inter', 'Poppins', sans-serif",
                            }}>
                              {word.pronunciation}
                            </p>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              background: '#f1f5f9',
                              borderRadius: '100px',
                              color: '#475569',
                            }}>
                              {word.partOfSpeech}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(word.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '20px',
                            padding: '4px',
                            color: localFavorites.includes(word.id) ? '#FFD700' : '#94a3b8',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          {localFavorites.includes(word.id) ? '★' : '☆'}
                        </button>
                      </div>
                      
                      <p style={{
                        fontSize: '14px',
                        color: '#334155',
                        lineHeight: '1.6',
                        marginBottom: '16px',
                        fontFamily: "'Inter', 'Poppins', sans-serif",
                      }}>
                        {word.definition}
                      </p>
                      
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: '10px',
                        padding: '14px',
                        marginBottom: '16px',
                        borderLeft: `3px solid ${word.color}`,
                      }}>
                        <p style={{
                          fontSize: '13px',
                          color: '#475569',
                          margin: '0',
                          fontStyle: 'italic',
                          fontFamily: "'Inter', 'Poppins', sans-serif",
                        }}>
                          {word.examples[0]}
                        </p>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto',
                      }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: `${word.color}10`,
                          color: word.color,
                          fontFamily: "'Inter', 'Poppins', sans-serif",
                          textTransform: 'capitalize',
                        }}>
                          {word.difficulty}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: '#f1f5f9',
                          color: '#475569',
                          fontFamily: "'Inter', 'Poppins', sans-serif",
                          textTransform: 'capitalize',
                        }}>
                          {word.category}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flex: '0 0 250px',
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(word.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '20px',
                            padding: '0',
                            color: localFavorites.includes(word.id) ? '#FFD700' : '#94a3b8',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {localFavorites.includes(word.id) ? '★' : '☆'}
                        </button>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: '#0f172a',
                              margin: '0',
                              fontFamily: "'Inter', 'Poppins', sans-serif",
                            }}>
                              {word.word}
                            </h3>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              background: '#f1f5f9',
                              borderRadius: '100px',
                              color: '#475569',
                            }}>
                              {word.partOfSpeech}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '12px',
                            color: '#64748b',
                            margin: '0',
                          }}>
                            {word.pronunciation}
                          </p>
                        </div>
                      </div>
                      
                      <p style={{
                        fontSize: '14px',
                        color: '#334155',
                        margin: '0',
                        flex: '1',
                        fontFamily: "'Inter', 'Poppins', sans-serif",
                      }}>
                        {word.definition}
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        flex: '0 0 200px',
                        justifyContent: 'flex-end',
                      }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: `${word.color}10`,
                          color: word.color,
                          textTransform: 'capitalize',
                        }}>
                          {word.difficulty}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: '#f1f5f9',
                          color: '#475569',
                          textTransform: 'capitalize',
                        }}>
                          {word.category}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {sortedAndFilteredWords.length > 0 && (
            <div style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              color: '#64748b',
            }}>
              <span>
                📊 {beginnerWords} Beginner · {intermediateWords} Intermediate · {advancedWords} Advanced
              </span>
              <span>
                ⭐ {masteredWords} mastered · 🎯 {totalWords - masteredWords} to learn
              </span>
            </div>
          )}
        </div>
      </>
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
          }
          
          .menu-item {
            transition: all 0.3s ease;
          }
          
          .menu-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(5px);
          }
          
          .menu-item.active {
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
        fontFamily: 'Poppins, sans-serif',
      }}>
        {/* Sidebar */}
        {isSidebarVisible && (
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
              fontSize: '26px',
              fontWeight: '800',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              letterSpacing: '-0.5px',
              color: 'white',
              fontFamily: "'Poppins', sans-serif",
              background: 'rgba(255, 255, 255, 0.05)',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ 
                  fontSize: '32px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}></span>
                VocaboPlay
              </div>
            </div>

            {/* Menu Items */}
            <nav style={{ flex: 1, padding: '25px 0' }}>
              {[
                { name: 'Dashboard', icon: '▣'},
                { name: 'Word Library', icon: '☰'},
                { name: 'Games', icon: '◉'},
                { name: 'My Progress', icon: '▦'},
                { name: 'Favorites', icon: '★' },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`menu-item ${activeMenu === item.name ? 'active' : ''}`}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setCurrentGame(null);
                  }}
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
                    borderLeft: activeMenu === item.name ? `4px solid ${item.color}` : '4px solid transparent',
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

            {/* Settings at bottom */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.32)',
              padding: '20px 0',
            }}>
              <div
                className="menu-item"
                onClick={() => setActiveMenu('Settings')}
                style={{
                  padding: '14px 25px',
                  margin: '0 15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: activeMenu === 'Settings' ? '600' : '500',
                  color: 'white',
                  fontFamily: "'Poppins', sans-serif",
                  background: activeMenu === 'Settings' 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)' 
                    : 'transparent',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  if (activeMenu !== 'Settings') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeMenu !== 'Settings') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>⚙</span>
                <span>Settings</span>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Toggle Button */}
        {!isSidebarVisible && (
          <button
            onClick={() => setIsSidebarVisible(true)}
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              zIndex: 1001,
              background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(124, 111, 214, 0.4)',
              transition: 'all 0.3s ease',
              fontFamily: "'Poppins', sans-serif",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 111, 214, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 111, 214, 0.4)';
            }}
          >
            ☰
          </button>
        )}

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          marginLeft: isSidebarVisible ? '280px' : '0',
          padding: '25px 40px',
          overflowY: 'auto',
          transition: 'margin-left 0.3s ease',
        }}>
          {/* Top Bar with User Profile */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '40px',
            gap: '15px',
            position: 'relative',
          }}>
            {/* Close Sidebar Button when sidebar is visible */}
            {isSidebarVisible && currentGame && (
              <button
                onClick={() => setIsSidebarVisible(false)}
                style={{
                  position: 'absolute',
                  left: '0',
                  background: 'white',
                  border: '2px solid #7c6fd6',
                  color: '#7c6fd6',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Poppins', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#7c6fd6';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#7c6fd6';
                }}
              >
                ← 
              </button>
            )}

            <div
              style={{
                background: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 12px rgba(124, 111, 214, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Poppins', sans-serif",
                border: '2px solid #f0f0f0',
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
              }}>👤</div>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#333', fontFamily: "'Poppins', sans-serif" }}>kwekwek</span>
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
                  kwekwek
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

         {/* Game Components */}
{currentGame === 'flashcards' && (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
    <Flashcards onBack={exitGame} />
  </div>
)}

{currentGame === 'quiz' && (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
    <Quiz onBack={exitGame} />
  </div>
)}

{currentGame === 'match' && (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
    <MatchGame onBack={exitGame} />
  </div>
)}

{currentGame === 'guesswhat' && (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
    <GuessWhatGame onBack={exitGame} />
  </div>
)}

{currentGame === 'short-story' && (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
    <ShortStoryGame onBack={exitGame} />
  </div>
)}

{currentGame === 'sentence-builder' && (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
    <SentenceBuilder onBack={exitGame} />
  </div>
)}

         {/* Main Menu Components - these only show when no game is active AND activeMenu matches */}
    {!currentGame && activeMenu === 'Word Library' && <WordLibrary />}
    {!currentGame && activeMenu === 'Games' && <PlayGames />}
    {!currentGame && activeMenu === 'My Progress' && <MyProgress />}

       {/* Dashboard - only shows when no game is active AND activeMenu is 'Dashboard' */}
{!currentGame && activeMenu === 'Dashboard' && (
  <div style={{
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#0f172a',
  }}>
              {/* Welcome Section - Enhanced with Purple Theme */}
<div style={{
  background: 'linear-gradient(135deg, #7c6fd6 0%, #6b5ec5 50%, #5a4db4 100%)',
  borderRadius: '24px',
  padding: '30px 40px',
  marginBottom: '40px',
  display: 'flex',
  gap: '35px',
  alignItems: 'center',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.15)',
  boxShadow: '0 12px 40px rgba(124, 111, 214, 0.25)',
  position: 'relative',
  overflow: 'hidden',
}}>
  {/* Subtle decorative elements */}
  <div style={{
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '200px',
    height: '200px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '50%',
    zIndex: 0,
  }}></div>
  <div style={{
    position: 'absolute',
    bottom: '-30px',
    left: '-30px',
    width: '150px',
    height: '150px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '50%',
    zIndex: 0,
  }}></div>
  
  <div style={{
    width: '120px',
    height: '120px',
    background: 'white',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
    border: '3px solid rgba(255,255,255,0.3)',
    position: 'relative',
    zIndex: 1,
  }}>
    <img
      src="src/assets/bokawelcoming.jpg"
      alt="VocaboPlay Mascot"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '17px',
        objectFit: 'cover',
      }}
    />
  </div>
  <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
      flexWrap: 'wrap',
    }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: '700',
        margin: '0',
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: '-0.5px',
        color: 'white',
        textShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        Welcome back, kwekwek
      </h2>
      <span style={{
        fontSize: '32px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>👋</span>
    </div>
    <p style={{
      fontSize: '15px',
      opacity: '0.9',
      lineHeight: '1.6',
      marginBottom: '28px',
      maxWidth: '600px',
      color: 'rgba(255,255,255,0.95)',
      fontWeight: '300',
    }}>
     Continue your vocabulary journey with <strong style={{ fontWeight: '700', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '20px' }}>{UNIFIED_VOCABULARY.length} words</strong> to master.
    </p>
    <div style={{
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      <button
        onClick={() => setActiveMenu('Games')}
        style={{
          background: 'white',
          color: '#5a4db4',
          border: 'none',
          padding: '12px 28px',
          borderRadius: '100px',
          fontSize: '14px',
          fontWeight: '400',
          cursor: 'pointer',
          fontFamily: "'Poppins', sans-serif",
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f0edff';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
        }}
      >
        Continue Learning
      </button>
      <button
        onClick={() => setActiveMenu('Word Library')}
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '12px 28px',
          borderRadius: '100px',
          fontSize: '14px',
          fontWeight: '400',
          cursor: 'pointer',
          fontFamily: "'Poppins', sans-serif",
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Browse Library
      </button>
    </div>
  </div>
</div>

{/* Stats Grid - Purple Theme */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
  gap: '20px',
  marginBottom: '45px',
}}>
  {[
    { 
      label: 'Words Learned', 
      value: `${JSON.parse(localStorage.getItem('vocaboplay_progress') || '{"wordsLearned":0}').wordsLearned}`, 
      icon: '📚', 
      color: '#7c6fd6', 
      bg: '#f0edff',
      trend: 'Mastered so far'
    },
    { 
      label: 'Games Played', 
      value: `${JSON.parse(localStorage.getItem('vocaboplay_progress') || '{"gamesPlayed":0}').gamesPlayed}`, 
      icon: '🎮', 
      color: '#9b8de8', 
      bg: '#f3f0ff',
      trend: 'Total sessions'
    },
    { 
      label: 'Current Streak', 
      value: `${JSON.parse(localStorage.getItem('vocaboplay_progress') || '{"streak":0}').streak}`, 
      icon: '🔥', 
      color: '#ff9f4b', 
      bg: '#fff1e6',
      unit: 'days',
      trend: 'Keep it up!'
    },
    { 
      label: 'Total Points', 
      value: `${JSON.parse(localStorage.getItem('vocaboplay_progress') || '{"totalPoints":0}').totalPoints}`, 
      icon: '⭐', 
      color: '#ffb84d', 
      bg: '#fff8e7',
      trend: 'Keep earning'
    },
  ].map((stat, i) => {
    const progress = JSON.parse(localStorage.getItem('vocaboplay_progress') || '{"xp":0}');
    const xpToNextLevel = 100;
    const currentLevelXp = progress.xp % xpToNextLevel;
    const levelProgress = (currentLevelXp / xpToNextLevel) * 100;
    
    return (
      <div 
        key={i} 
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e6e0ff',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(124, 111, 214, 0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#7c6fd6';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 111, 214, 0.15)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e6e0ff';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 111, 214, 0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: stat.bg,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: stat.color,
          }}>
            {stat.icon}
          </div>
          {stat.label === 'Total Points' && (
            <span style={{
              padding: '4px 12px',
              background: '#f0edff',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#7c6fd6',
            }}>
              Level {progress.level || 1}
            </span>
          )}
        </div>
        
        <div style={{ marginBottom: '4px' }}>
          <span style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1a1a2c',
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.5px',
            lineHeight: 1,
          }}>
            {stat.value}
          </span>
          {stat.unit && (
            <span style={{
              fontSize: '16px',
              color: '#8880b0',
              marginLeft: '4px',
              fontWeight: '500',
            }}>
              {stat.unit}
            </span>
          )}
        </div>
        
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#6b63a0',
          marginBottom: stat.label === 'Total Points' ? '12px' : '8px',
        }}>
          {stat.label}
        </div>
        
        <div style={{
          fontSize: '12px',
          color: '#9a94c0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: 'auto',
        }}>
          <span style={{ color: stat.color }}>●</span>
          {stat.trend}
        </div>

        {stat.label === 'Total Points' && (
          <div style={{
            marginTop: '16px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
              fontSize: '12px',
            }}>
              <span style={{ color: '#6b63a0' }}>XP to next level</span>
              <span style={{ color: '#7c6fd6', fontWeight: '600' }}>
                {currentLevelXp}/{xpToNextLevel}
              </span>
            </div>
            <div style={{
              background: '#f0edff',
              height: '8px',
              borderRadius: '100px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${levelProgress}%`,
                background: 'linear-gradient(90deg, #7c6fd6, #9b8de8)',
                borderRadius: '100px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}
      </div>
    );
  })}
</div>

{/* Quick Actions & Activity */}
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  marginBottom: '40px',
}}>
  {/* Quick Actions */}
  <div style={{
    background: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid #e6e0ff',
    boxShadow: '0 4px 12px rgba(124, 111, 214, 0.08)',
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a2c',
        margin: '0',
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: '-0.3px',
      }}>
        Quick Actions
      </h3>
    
    </div>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    }}>
      {[
        { label: 'Flashcards', icon: '🃏', color: '#7c6fd6', action: () => startGame('flashcards'), bg: '#f0edff' },
        { label: 'Match Game', icon: '🎯', color: '#9b8de8', action: () => startGame('match'), bg: '#f3f0ff' },
        { label: 'Quiz', icon: '📝', color: '#9b8de8', action: () => startGame('quiz'), bg: '#f6f3ff' },
        { label: 'Story', icon: '📖', color: '#8f81d9', action: () => startGame('short-story'), bg: '#f0edff' },
      ].map((action, i) => (
        <button
          key={i}
          onClick={action.action}
          style={{
            padding: '20px 12px',
            background: action.bg,
            border: '1px solid transparent',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '14px',
            fontWeight: '400',
            color: action.color,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = action.color;
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 12px 24px ${action.color}30`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = action.bg;
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: '28px' }}>{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
    
    <button
      onClick={() => setActiveMenu('Games')}
      style={{
        width: '98%',
        marginTop: '20px',
        padding: '14px',
        background: '#f8f6ff',
        border: '1px solid #e6e0ff',
        borderRadius: '100px',
        fontSize: '13px',
        fontWeight: '500',
        color: '#7c6fd6',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#7c6fd6';
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.borderColor = '#7c6fd6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f8f6ff';
        e.currentTarget.style.color = '#7c6fd6';
        e.currentTarget.style.borderColor = '#e6e0ff';
      }}
    >
      View All Games
    </button>
  </div>

  {/* Recent Activity */}
  <div style={{
    background: '#ffffff',
    borderRadius: '20px',
    padding: '25px',
    border: '1px solid #e6e0ff',
    boxShadow: '0 4px 12px rgba(124, 111, 214, 0.08)',
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a2c',
        margin: '0',
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: '-0.3px',
      }}>
        Recent Activity
      </h3>

    </div>

    {JSON.parse(localStorage.getItem('vocaboplay_progress') || '{"gamesPlayed":0}').gamesPlayed === 0 ? (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        textAlign: 'center',
        background: '#f8f6ff',
        borderRadius: '16px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#f0edff',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          fontSize: '32px',
          color: '#7c6fd6',
        }}>
          🎮
        </div>
        <p style={{
          fontSize: '15px',
          color: '#1a1a2c',
          marginBottom: '8px',
          fontWeight: '600',
        }}>
          No activity yet
        </p>
        <p style={{
          fontSize: '13px',
          color: '#8880b0',
          marginBottom: '16px',
        }}>
          Start playing to see your progress
        </p>
        <button
          onClick={() => setActiveMenu('Games')}
          style={{
            padding: '10px 24px',
            background: '#7c6fd6',
            color: 'white',
            border: 'none',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#6b5ec5'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#7c6fd6'}
        >
          Browse Games
        </button>
      </div>
    ) : (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '14px',
          background: '#f8f6ff',
          borderRadius: '16px',
          border: '1px solid #f0edff',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: '#f0edff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            color: '#7c6fd6',
          }}>
            🃏
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '400',
              color: '#1a1a2c',
            }}>
              Completed Flashcard session
            </div>
            <div style={{
              fontSize: '12px',
              color: '#8880b0',
              fontWeight: '50',

            }}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

{/* Learning Goals & Recommendations */}
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
}}>
  {/* Daily Goal */}
  <div style={{
    background: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid #e6e0ff',
    boxShadow: '0 4px 12px rgba(124, 111, 214, 0.08)',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '20px',
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        background: '#f0edff',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '26px',
        color: '#7c6fd6',
      }}>
        🎯
      </div>
      <div>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#1a1a2c',
          margin: '0 0 4px 0',
        }}>
          Daily Goal
        </h4>
        <p style={{
          fontSize: '13px',
          color: '#8880b0',
          margin: '0',
          fontWeight: '50',

        }}>
          Learn 10 words today
        </p>
      </div>
    </div>
    
    <div style={{
      marginBottom: '20px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '13px',
      }}>
        <span style={{ color: '#6b63a0' }}>Progress</span>
        <span style={{ color: '#7c6fd6', fontWeight: '700' }}>0/10</span>
      </div>
      <div style={{
        background: '#f0edff',
        height: '10px',
        borderRadius: '100px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: '0%',
          background: 'linear-gradient(90deg, #7c6fd6, #9b8de8)',
          borderRadius: '100px',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
    
    <button
      onClick={() => startGame('flashcards')}
      style={{
        width: '100%',
        padding: '13px',
        background: '#7c6fd6',
        color: 'white',
        border: 'none',
        borderRadius: '100px',
        fontSize: '14px',
        fontWeight: '400',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 8px 20px rgba(124, 111, 214, 0.25)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#6b5ec5';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(124, 111, 214, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#7c6fd6';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 111, 214, 0.25)';
      }}
    >
      Start learning
    </button>
  </div>

  {/* Recommended for You */}
  <div style={{
    background: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid #e6e0ff',
    boxShadow: '0 4px 12px rgba(124, 111, 214, 0.08)',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '20px',
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        background: '#f0edff',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '26px',
        color: '#7c6fd6',
      }}>
        ✨
      </div>
      <div>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#1a1a2c',
          margin: '0 0 4px 0',
        }}>
          Recommended
        </h4>
        <p style={{
          fontSize: '13px',
          color: '#8880b0',
          margin: '0',

        }}>
          Based on your progress
        </p>
      </div>
    </div>
    
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px',
        background: '#f8f6ff',
        borderRadius: '16px',
        border: '1px solid #f0edff',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <span style={{ fontSize: '24px', color: '#7c6fd6' }}>📖</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2c' }}>
              The Learning Journey
            </div>
            <div style={{ fontSize: '12px', color: '#8880b0' }}>
              Chapter 1: Classroom Adventures
            </div>
          </div>
        </div>
        <button
          onClick={() => startGame('short-story')}
          style={{
            padding: '8px 18px',
            background: 'white',
            border: '1px solid #e6e0ff',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#7c6fd6',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#7c6fd6';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = '#7c6fd6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#7c6fd6';
            e.currentTarget.style.borderColor = '#e6e0ff';
          }}
        >
          Continue
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px',
        background: '#f8f6ff',
        borderRadius: '16px',
        border: '1px solid #f0edff',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <span style={{ fontSize: '24px', color: '#7c6fd6' }}>🃏</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2c' }}>
              Flashcards
            </div>
            <div style={{ fontSize: '12px', color: '#8880b0' }}>
              30 words to review
            </div>
          </div>
        </div>
        <button
          onClick={() => startGame('flashcards')}
          style={{
            padding: '8px 18px',
            background: 'white',
            border: '1px solid #e6e0ff',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#7c6fd6',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#7c6fd6';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = '#7c6fd6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#7c6fd6';
            e.currentTarget.style.borderColor = '#e6e0ff';
          }}
        >
          Start
        </button>
      </div>
    </div>
  </div>
</div>
  </div>
)}

{/* Favorites - Professional List View */}
{!currentGame && activeMenu === 'Favorites' && (
  <div style={{
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  }}>
    {/* Header */}
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
          marginBottom: '6px',
          fontFamily: "'Inter', 'Poppins', sans-serif",
          letterSpacing: '-0.01em',
        }}>
          My Favorite Words
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          margin: '0',
          fontFamily: "'Inter', 'Poppins', sans-serif",
        }}>
          Quickly access words you've starred for focused practice
        </p>
      </div>
      
      {/* Stats and Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{
          background: '#f8fafc',
          padding: '7px 16px',
          borderRadius: '100px',
          border: '1px solid #e2e8f0',
          fontSize: '13px',
          color: '#64748b',
          fontWeight: '200',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>          8 words
        </div>
      </div>
    </div>

    {/* List View Table */}
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '24px',
    }}>
      {/* Table Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr 1fr 80px',
        gap: '16px',
        padding: '16px 24px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        fontSize: '13px',
        fontWeight: '400',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}>
        <div>Word</div>
        <div>Difficulty</div>
        <div>Definition</div>
        <div>Category</div>
        <div style={{ textAlign: 'center' }}>Action</div>
      </div>

      {/* Favorite Items */}
      {/* Item 1 - Participate */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr 1fr 80px',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background 0.2s ease',
        alignItems: 'center',
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
        <div>
          <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Participate</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>/pɑːrˈtɪsɪpeɪt/</div>
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '600',
            background: '#e8f5e9',
            color: '#2e7d32',
            display: 'inline-block',
          }}>
            Beginner
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
          To take part in an activity or discussion.
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            background: '#f1f5f9',
            color: '#475569',
            display: 'inline-block',
          }}>
            Action
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={() => startGame('flashcards')}
            style={{
              padding: '6px 12px',
              background: '#7c6fd6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6b5ec5'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c6fd6'}
          >
            Study
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#FFD700',
              padding: '0 4px',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ★
          </button>
        </div>
      </div>

      {/* Item 2 - Analyze */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr 1fr 80px',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background 0.2s ease',
        alignItems: 'center',
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
        <div>
          <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Analyze</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>/ˈæn.əl.aɪz/</div>
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '600',
            background: '#fff4e5',
            color: '#b85c1a',
            display: 'inline-block',
          }}>
            Intermediate
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
          To examine something in detail to understand it better.
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            background: '#f1f5f9',
            color: '#475569',
            display: 'inline-block',
          }}>
            Analysis
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={() => startGame('flashcards')}
            style={{
              padding: '6px 12px',
              background: '#7c6fd6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6b5ec5'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c6fd6'}
          >
            Study
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#FFD700',
              padding: '0 4px',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ★
          </button>
        </div>
      </div>

      {/* Item 3 - Concentrate */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr 1fr 80px',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background 0.2s ease',
        alignItems: 'center',
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
        <div>
          <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Concentrate</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>/ˈkɑːn.sən.treɪt/</div>
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '600',
            background: '#e8f5e9',
            color: '#2e7d32',
            display: 'inline-block',
          }}>
            Beginner
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
          To focus all your attention on something.
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            background: '#f1f5f9',
            color: '#475569',
            display: 'inline-block',
          }}>
            Focus
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={() => startGame('flashcards')}
            style={{
              padding: '6px 12px',
              background: '#7c6fd6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6b5ec5'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c6fd6'}
          >
            Study
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#FFD700',
              padding: '0 4px',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ★
          </button>
        </div>
      </div>

      {/* Item 4 - Collaborate */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr 1fr 80px',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background 0.2s ease',
        alignItems: 'center',
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
        <div>
          <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Collaborate</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>/kəˈlæb.ə.reɪt/</div>
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '600',
            background: '#fff4e5',
            color: '#b85c1a',
            display: 'inline-block',
          }}>
            Intermediate
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
          To work together with others on a project.
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            background: '#f1f5f9',
            color: '#475569',
            display: 'inline-block',
          }}>
            Collaboration
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={() => startGame('flashcards')}
            style={{
              padding: '6px 12px',
              background: '#7c6fd6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6b5ec5'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c6fd6'}
          >
            Study
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#FFD700',
              padding: '0 4px',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ★
          </button>
        </div>
      </div>

      {/* Item 5 - Summarize */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr 1fr 80px',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background 0.2s ease',
        alignItems: 'center',
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
        <div>
          <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Summarize</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>/ˈsʌm.ə.raɪz/</div>
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '600',
            background: '#fff4e5',
            color: '#b85c1a',
            display: 'inline-block',
          }}>
            Intermediate
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
          To give a brief statement of the main points.
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            background: '#f1f5f9',
            color: '#475569',
            display: 'inline-block',
          }}>
            Summary
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={() => startGame('flashcards')}
            style={{
              padding: '6px 12px',
              background: '#7c6fd6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6b5ec5'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c6fd6'}
          >
            Study
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#FFD700',
              padding: '0 4px',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ★
          </button>
        </div>
      </div>

      {/* Item 6 - Demonstrate */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr 1fr 80px',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background 0.2s ease',
        alignItems: 'center',
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
        <div>
          <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Demonstrate</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>/ˈdem.ən.streɪt/</div>
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '600',
            background: '#fff4e5',
            color: '#b85c1a',
            display: 'inline-block',
          }}>
            Intermediate
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
          To show clearly by giving proof or evidence.
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            background: '#f1f5f9',
            color: '#475569',
            display: 'inline-block',
          }}>
            Action
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={() => startGame('flashcards')}
            style={{
              padding: '6px 12px',
              background: '#7c6fd6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6b5ec5'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c6fd6'}
          >
            Study
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#FFD700',
              padding: '0 4px',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ★
          </button>
        </div>
      </div>

      {/* Item 7 - Organize */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr 1fr 80px',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background 0.2s ease',
        alignItems: 'center',
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
        <div>
          <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Organize</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>/ˈɔːr.ɡən.aɪz/</div>
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '600',
            background: '#e8f5e9',
            color: '#2e7d32',
            display: 'inline-block',
          }}>
            Beginner
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
          To arrange things in an orderly and structured way.
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            background: '#f1f5f9',
            color: '#475569',
            display: 'inline-block',
          }}>
            Action
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={() => startGame('flashcards')}
            style={{
              padding: '6px 12px',
              background: '#7c6fd6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6b5ec5'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c6fd6'}
          >
            Study
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#FFD700',
              padding: '0 4px',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ★
          </button>
        </div>
      </div>

      {/* Item 8 - Communicate */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr 1fr 80px',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: 'none',
        transition: 'background 0.2s ease',
        alignItems: 'center',
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
        <div>
          <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Communicate</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>/kəˈmjuː.nɪ.keɪt/</div>
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '600',
            background: '#fff4e5',
            color: '#b85c1a',
            display: 'inline-block',
          }}>
            Intermediate
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
          To share information, ideas, or feelings with others.
        </div>
        <div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            background: '#f1f5f9',
            color: '#475569',
            display: 'inline-block',
          }}>
            Communication
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={() => startGame('flashcards')}
            style={{
              padding: '6px 12px',
              background: '#7c6fd6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6b5ec5'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c6fd6'}
          >
            Study
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#FFD700',
              padding: '0 4px',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ★
          </button>
        </div>
      </div>
    </div>

    {/* Footer Actions */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '16px',
      borderTop: '1px solid #e2e8f0',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12px',
        color: '#64748b',
      }}>
        <span style={{ color: '#7c6fd6' }}>⭐</span>
        <span>8 words • Last added: Participate</span>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setActiveMenu('Word Library')}
          style={{
            padding: '10px 24px',
            background: 'white',
            color: '#475569',
            border: '1px solid #e2e8f0',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >          Browse Library
        </button>
        
        <button
          onClick={() => startGame('flashcards')}
          style={{
           padding: '10px 24px',
            background: 'white',
            color: '#475569',
            border: '1px solid #e2e8f0',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >          Study All
        </button>
      </div>
    </div>
  </div>
)}

         {/* Settings - Clean Minimal Style with Poppins */}
{activeMenu === 'Settings' && (
  <div style={{
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 24px',
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: '#ffffff',
  }}>
    {/* Header */}
    <div style={{
      marginBottom: '32px',
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '300',
        color: '#000000',
        marginBottom: '4px',
        letterSpacing: '-0.02em',
        fontFamily: "'Poppins', sans-serif",
      }}>
        Account
      </h1>
      <p style={{
        fontSize: '13px',
        fontWeight: '300',
        color: '#8e8e8e',
        margin: '0',
        fontFamily: "'Poppins', sans-serif",
      }}>
        Manage your profile information
      </p>
    </div>

    {/* Profile Section */}
    <div style={{
      marginBottom: '32px',
      borderBottom: '1px solid #f0f0f0',
      paddingBottom: '24px',
    }}>
      {/* Profile Picture Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '24px', color: '#a0a0a0', fontWeight: '200' }}>○</span>
        </div>
        <div>
          <button 
            onClick={() => document.getElementById('fileInput').click()}
            style={{
            padding: '6px 16px',
            backgroundColor: '#f5f5f5',
            border: 'none',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: '300',
            color: '#000000',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <span style={{ fontSize: '14px', fontWeight: '200' }}>+</span> Change photo
          </button>
          <input type="file" id="fileInput" accept="image/*" style={{ display: 'none' }} />
          <p style={{
            fontSize: '10px',
            fontWeight: '300',
            color: '#c0c0c0',
            marginTop: '6px',
            marginBottom: '0',
            fontFamily: "'Poppins', sans-serif",
          }}>
            JPG or PNG • Max 5MB
          </p>
        </div>
      </div>

      {/* Username Field */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          fontSize: '11px',
          fontWeight: '300',
          color: '#8e8e8e',
          display: 'block',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: "'Poppins', sans-serif",
        }}>
          Username
        </label>
        <input
          type="text"
          defaultValue="kwekwek"
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '8px 0',
            border: 'none',
            borderBottom: '1px solid #eaeaea',
            fontSize: '14px',
            fontWeight: '300',
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: 'transparent',
            color: '#000000',
            outline: 'none',
          }}
          onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
          onBlur={(e) => e.target.style.borderBottomColor = '#eaeaea'}
        />
      </div>

      {/* Display Name Field */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          fontSize: '11px',
          fontWeight: '300',
          color: '#8e8e8e',
          display: 'block',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: "'Poppins', sans-serif",
        }}>
          Display name
        </label>
        <input
          type="text"
          defaultValue="John Doe"
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '8px 0',
            border: 'none',
            borderBottom: '1px solid #eaeaea',
            fontSize: '14px',
            fontWeight: '300',
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: 'transparent',
            color: '#000000',
            outline: 'none',
          }}
          onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
          onBlur={(e) => e.target.style.borderBottomColor = '#eaeaea'}
        />
      </div>

      {/* Email Field */}
      <div>
        <label style={{
          fontSize: '11px',
          fontWeight: '300',
          color: '#8e8e8e',
          display: 'block',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: "'Poppins', sans-serif",
        }}>
          Email
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <input
            type="email"
            defaultValue="user@example.com"
            readOnly
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '8px 0',
              border: 'none',
              borderBottom: '1px solid #eaeaea',
              fontSize: '14px',
              fontWeight: '300',
              fontFamily: "'Poppins', sans-serif",
              backgroundColor: 'transparent',
              color: '#8e8e8e',
              outline: 'none',
            }}
          />
          <span style={{
            fontSize: '10px',
            fontWeight: '300',
            color: '#a0a0a0',
            fontFamily: "'Poppins', sans-serif",
          }}>
            verified
          </span>
        </div>
      </div>
    </div>

    {/* Security Section */}
    <div style={{
      marginBottom: '32px',
      borderBottom: '1px solid #f0f0f0',
      paddingBottom: '24px',
    }}>
      <h2 style={{
        fontSize: '15px',
        fontWeight: '300',
        color: '#000000',
        marginBottom: '16px',
        letterSpacing: '-0.01em',
        fontFamily: "'Poppins', sans-serif",
      }}>
        Security
      </h2>

      <button
        onClick={() => {
          if (window.confirm('Send password reset email to user@example.com?')) {
            alert('Password reset email sent!');
          }
        }}
        style={{
          padding: '6px 0',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '13px',
          fontWeight: '300',
          color: '#000000',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <span style={{ fontSize: '14px', color: '#a0a0a0', fontWeight: '200' }}>⌄</span>
        Change password
      </button>
    </div>

    {/* Account Actions */}
    <div style={{
      marginBottom: '40px',
      borderBottom: '1px solid #f0f0f0',
      paddingBottom: '24px',
    }}>
      <h2 style={{
        fontSize: '15px',
        fontWeight: '300',
        color: '#000000',
        marginBottom: '16px',
        letterSpacing: '-0.01em',
        fontFamily: "'Poppins', sans-serif",
      }}>
        Account
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '6px 0',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '13px',
            fontWeight: '300',
            color: '#000000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Poppins', sans-serif",
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '14px', color: '#a0a0a0', fontWeight: '200' }}>↪</span>
          Sign out
        </button>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
              alert('Account deletion request sent');
            }
          }}
          style={{
            padding: '6px 0',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '13px',
            fontWeight: '300',
            color: '#b0b0b0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Poppins', sans-serif",
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '14px', color: '#d0d0d0', fontWeight: '200' }}>✕</span>
          Delete account
        </button>
      </div>
    </div>

    {/* Save Bar */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '8px',
    }}>
      <span style={{
        fontSize: '11px',
        fontWeight: '300',
        color: '#c0c0c0',
        fontFamily: "'Poppins', sans-serif",
      }}>
        Changes saved automatically
      </span>
      
      <button
        onClick={() => alert('Changes saved')}
        style={{
          padding: '6px 24px',
          backgroundColor: '#f5f5f5',
          border: 'none',
          borderRadius: '30px',
          fontSize: '12px',
          fontWeight: '300',
          color: '#000000',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
          fontFamily: "'Poppins', sans-serif",
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        Save
      </button>
    </div>
  </div>
)}
          
        </div>
      </div>
    </>
  );
};

export default Dashboard;