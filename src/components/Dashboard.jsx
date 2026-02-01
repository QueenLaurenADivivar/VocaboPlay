import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Game Components
const Flashcards = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);

  const flashcards = [
    { word: 'Ephemeral', definition: 'Lasting for a very short time; temporary.' },
    { word: 'Serendipity', definition: 'Finding good things by chance; luck.' },
    { word: 'Resilient', definition: 'Able to recover quickly from difficulties.' },
    { word: 'Eloquent', definition: 'Fluent and persuasive in speaking or writing.' },
    { word: 'Ambiguous', definition: 'Open to more than one interpretation.' },
    { word: 'Benevolent', definition: 'Kind, generous, and helpful.' },
  ];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnew = () => {
    setScore(score + 1);
    handleNext();
  };

  const current = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={onBack} style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', fontFamily: "'Poppins', sans-serif" }}>← Back</button>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0', fontFamily: "'Poppins', sans-serif" }}>Flashcards</h1>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>Score: {score}/{flashcards.length}</div>
      </div>

      <div style={{ width: '100%', height: '4px', background: '#e0e0e0', borderRadius: '2px', marginBottom: '30px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c6fd6 0%, #9b8de8 100%)', width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
      </div>

      <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          <div className="flashcard-front" style={{ padding: '30px', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '15px', fontWeight: '500' }}>Word</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>{current.word}</div>
            <div style={{ fontSize: '12px', opacity: 0.6 }}>Click to flip</div>
          </div>
          <div className="flashcard-back" style={{ padding: '30px', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '15px', fontWeight: '500' }}>Definition</div>
            <div style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.5' }}>{current.definition}</div>
            <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '20px' }}>Click to flip back</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={handlePrevious} disabled={currentIndex === 0} style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', flex: 1, opacity: currentIndex === 0 ? 0.5 : 1, fontFamily: "'Poppins', sans-serif" }}>← Previous</button>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#666', fontFamily: "'Poppins', sans-serif" }}>{currentIndex + 1} / {flashcards.length}</span>
        <button onClick={handleNext} disabled={currentIndex === flashcards.length - 1} style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', flex: 1, opacity: currentIndex === flashcards.length - 1 ? 0.5 : 1, fontFamily: "'Poppins', sans-serif" }}>Next →</button>
      </div>

      <button onClick={handleKnew} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s ease', fontFamily: "'Poppins', sans-serif" }}>I knew this word ✓</button>
    </div>
  );
};

const Quiz = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const quizzes = [
    {
      question: 'What does "Ephemeral" mean?',
      options: ['Lasting for a very short time', 'Permanent and long-lasting', 'Extremely important', 'Hard to understand'],
      correct: 0
    },
    {
      question: 'What does "Serendipity" mean?',
      options: ['Bad luck and misfortune', 'Finding good things by chance', 'Planning carefully', 'Being sad'],
      correct: 1
    },
    {
      question: 'What does "Resilient" mean?',
      options: ['Weak and fragile', 'Very smart', 'Able to recover quickly from difficulties', 'Silent'],
      correct: 2
    },
    {
      question: 'What does "Eloquent" mean?',
      options: ['Quiet and shy', 'Fluent and persuasive in speaking', 'Confused', 'Angry'],
      correct: 1
    },
    {
      question: 'What does "Ambiguous" mean?',
      options: ['Very clear', 'Open to more than one interpretation', 'Simple', 'Complex'],
      correct: 1
    }
  ];

  const current = quizzes[currentIndex];
  const progress = ((currentIndex + 1) / quizzes.length) * 100;

  const handleAnswer = (index) => {
    if (!answered) {
      setSelectedAnswer(index);
      setAnswered(true);
      if (index === current.correct) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={onBack} style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', fontFamily: "'Poppins', sans-serif" }}>← Back</button>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0', fontFamily: "'Poppins', sans-serif" }}>Quiz</h1>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>Score: {score}/{quizzes.length}</div>
      </div>

      <div style={{ width: '100%', height: '4px', background: '#e0e0e0', borderRadius: '2px', marginBottom: '30px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c6fd6 0%, #9b8de8 100%)', width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <div style={{ fontSize: '12px', color: '#999', fontWeight: '500', marginBottom: '12px', fontFamily: "'Poppins', sans-serif" }}>Question {currentIndex + 1} of {quizzes.length}</div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '25px', fontFamily: "'Poppins', sans-serif" }}>{current.question}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {current.options.map((option, idx) => {
            let bgColor = '#f8f7ff';
            let borderColor = '#e0e0e0';

            if (answered) {
              if (idx === current.correct) {
                bgColor = '#e8f5e9';
                borderColor = '#4CAF50';
              } else if (idx === selectedAnswer && idx !== current.correct) {
                bgColor = '#ffebee';
                borderColor = '#f44336';
              }
            }

            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', border: '2px solid ' + borderColor, borderRadius: '10px', background: bgColor, textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#333', transition: 'all 0.2s ease', fontFamily: "'Poppins', sans-serif", cursor: answered ? 'default' : 'pointer', opacity: answered && idx !== current.correct && idx !== selectedAnswer ? 0.5 : 1 }}>
                <span style={{ fontWeight: '700', color: '#7c6fd6', minWidth: '20px' }}>{String.fromCharCode(65 + idx)}.</span>
                <span>{option}</span>
                {answered && idx === current.correct && <span style={{ marginLeft: 'auto' }}>✓</span>}
                {answered && idx === selectedAnswer && idx !== current.correct && <span style={{ marginLeft: 'auto' }}>✗</span>}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <button onClick={handleNext} disabled={currentIndex === quizzes.length - 1} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s ease', fontFamily: "'Poppins', sans-serif" }}>
          {currentIndex === quizzes.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      )}
    </div>
  );
};

const MatchGame = ({ onBack }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  const pairs = [
    { id: 1, word: 'Ephemeral', definition: 'Temporary' },
    { id: 2, word: 'Serendipity', definition: 'Lucky chance' },
    { id: 3, word: 'Resilient', definition: 'Strong' },
    { id: 4, word: 'Eloquent', definition: 'Articulate' },
    { id: 5, word: 'Ambiguous', definition: 'Unclear' },
    { id: 6, word: 'Benevolent', definition: 'Kind' },
  ];

  React.useEffect(() => {
    const gameCards = [];
    pairs.forEach(pair => {
      gameCards.push({ id: pair.id, type: 'word', text: pair.word });
      gameCards.push({ id: pair.id, type: 'definition', text: pair.definition });
    });
    setCards(gameCards.sort(() => Math.random() - 0.5));
  }, []);

  React.useEffect(() => {
    if (flipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = flipped;
      
      if (cards[first].id === cards[second].id) {
        setMatched([...matched, cards[first].id]);
        setScore(score + 1);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [flipped, cards, matched, score, moves]);

  const handleCardClick = (index) => {
    if (!flipped.includes(index) && !matched.includes(cards[index].id)) {
      setFlipped([...flipped, index]);
    }
  };

  const progress = cards.length > 0 ? (matched.length / (pairs.length)) * 100 : 0;
  const isComplete = matched.length === pairs.length;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={onBack} style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', fontFamily: "'Poppins', sans-serif" }}>← Back</button>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0', fontFamily: "'Poppins', sans-serif" }}>Match Game</h1>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '600', color: '#7c6fd6', fontFamily: "'Poppins', sans-serif" }}>
          <div>Score: {score}</div>
          <div>Moves: {moves}</div>
        </div>
      </div>

      <div style={{ width: '100%', height: '4px', background: '#e0e0e0', borderRadius: '2px', marginBottom: '30px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c6fd6 0%, #9b8de8 100%)', width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        {cards.map((card, index) => (
          <div key={index} onClick={() => handleCardClick(index)} style={{ aspectRatio: '1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: matched.includes(card.id) ? 'default' : 'pointer', fontSize: '13px', fontWeight: '500', textAlign: 'center', padding: '15px', transition: 'all 0.3s ease', background: flipped.includes(index) || matched.includes(card.id) ? 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)' : '#f0f0f0', color: flipped.includes(index) || matched.includes(card.id) ? 'white' : '#999', opacity: matched.includes(card.id) ? 0.7 : 1, fontFamily: "'Poppins', sans-serif" }}>
            {flipped.includes(index) || matched.includes(card.id) ? (
              <div>
                <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '8px' }}>{card.type === 'word' ? 'Word' : 'Definition'}</div>
                <div style={{ fontSize: '12px', fontWeight: '600' }}>{card.text}</div>
              </div>
            ) : (
              <div style={{ fontSize: '32px', fontWeight: '700' }}>?</div>
            )}
          </div>
        ))}
      </div>

      {isComplete && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8f7ff', borderRadius: '12px', fontFamily: "'Poppins', sans-serif" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif" }}>Complete! 🎉</h2>
          <p style={{ fontFamily: "'Poppins', sans-serif" }}>Matched all pairs in {moves} moves</p>
          <button onClick={onBack} style={{ marginTop: '20px', padding: '12px 30px', background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', fontFamily: "'Poppins', sans-serif" }}>Back to Games</button>
        </div>
      )}
    </div>
  );
};

// NEW: GuessWhat Game Component
const GuessWhatGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'finished'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      question: 'What am I doing?',
      image: 'src/assets/brushing.png',
      sentence: 'I am ______ my hair.',
      answer: 'brushing',
      options: ['washing', 'brushing', 'cutting', 'drying']
    },
    {
      question: 'What am I doing?',
      image: 'src/assets/cooking.png',
      sentence: 'I am ______ dinner.',
      answer: 'cooking',
      options: ['eating', 'cooking', 'preparing', 'serving']
    },
    {
      question: 'What am I doing?',
      image: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Person+Reading+Book',
      sentence: 'I am ______ a book.',
      answer: 'reading',
      options: ['reading', 'writing', 'buying', 'holding']
    },
    {
      question: 'What am I doing?',
      image: 'https://via.placeholder.com/300x200/F44336/ffffff?text=Person+Running',
      sentence: 'I am ______ in the park.',
      answer: 'running',
      options: ['walking', 'running', 'sitting', 'playing']
    },
    {
      question: 'What am I doing?',
      image: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=Person+Swimming',
      sentence: 'I am ______ in the pool.',
      answer: 'swimming',
      options: ['swimming', 'diving', 'floating', 'splashing']
    }
  ];

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleAnswer = (answer) => {
    if (!answered) {
      setSelectedAnswer(answer);
      setAnswered(true);
      if (answer === questions[currentQuestion].answer) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
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

  if (gameState === 'intro') {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif", maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={onBack} style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', fontFamily: "'Poppins', sans-serif" }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0', fontFamily: "'Poppins', sans-serif" }}>GuessWhat</h1>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤔</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '15px', fontFamily: "'Poppins', sans-serif" }}>Welcome to GuessWhat!</h2>
          <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>
            Guess what the person in the image is doing! You'll see a picture and a sentence with a blank. Choose the correct word from the options below.
          </p>
          
          <div style={{ background: '#f8f7ff', borderRadius: '12px', padding: '20px', marginBottom: '30px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#7c6fd6', marginBottom: '10px', fontFamily: "'Poppins', sans-serif" }}>How to Play:</h3>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
              <li>Look at the image carefully</li>
              <li>Read the sentence with the blank</li>
              <li>Choose the correct word from 3 options</li>
              <li>Get it right to earn points!</li>
            </ul>
          </div>

          <button onClick={handleStartGame} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', transition: 'all 0.2s ease', fontFamily: "'Poppins', sans-serif" }}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const current = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div style={{ fontFamily: "'Poppins', sans-serif", maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={onBack} style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', fontFamily: "'Poppins', sans-serif" }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0', fontFamily: "'Poppins', sans-serif" }}>GuessWhat</h1>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#26C6DA', fontFamily: "'Poppins', sans-serif" }}>Score: {score}/{questions.length}</div>
        </div>

        <div style={{ width: '100%', height: '4px', background: '#e0e0e0', borderRadius: '2px', marginBottom: '30px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #26C6DA 0%, #00BCD4 100%)', width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '12px', color: '#999', fontWeight: '500', marginBottom: '12px', fontFamily: "'Poppins', sans-serif" }}>Question {currentQuestion + 1} of {questions.length}</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '25px', textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}>{current.question}</h2>

          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <div style={{ width: '300px', height: '200px', margin: '0 auto 20px', borderRadius: '12px', overflow: 'hidden', background: '#f0f0f0' }}>
              <img src={current.image} alt="Action" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#333', fontFamily: "'Poppins', sans-serif" }}>
              {current.sentence.replace('______', '______')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {current.options.map((option, idx) => {
              let bgColor = '#f0f0f0';
              let borderColor = '#ddd';

              if (answered) {
                if (option === current.answer) {
                  bgColor = '#e8f5e9';
                  borderColor = '#4CAF50';
                } else if (option === selectedAnswer && option !== current.answer) {
                  bgColor = '#ffebee';
                  borderColor = '#f44336';
                }
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  style={{ 
                    padding: '16px', 
                    border: `2px solid ${borderColor}`, 
                    borderRadius: '10px', 
                    background: bgColor, 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    color: '#333',
                    cursor: answered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  {option}
                  {answered && option === current.answer && <span style={{ float: 'right', color: '#4CAF50' }}>✓</span>}
                  {answered && option === selectedAnswer && option !== current.answer && <span style={{ float: 'right', color: '#f44336' }}>✗</span>}
                </button>
              );
            })}
          </div>

          {answered && (
            <button 
              onClick={handleNextQuestion}
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontWeight: '600', 
                marginTop: '20px',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Game' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif", maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={onBack} style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', fontFamily: "'Poppins', sans-serif" }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0', fontFamily: "'Poppins', sans-serif" }}>GuessWhat</h1>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '15px', fontFamily: "'Poppins', sans-serif" }}>Game Complete!</h2>
          <p style={{ fontSize: '15px', color: '#666', marginBottom: '30px', fontFamily: "'Poppins', sans-serif" }}>
            You scored {score} out of {questions.length}!
          </p>
          
          <div style={{ background: '#f8f7ff', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#7c6fd6', marginBottom: '10px', fontFamily: "'Poppins', sans-serif" }}>Your Score:</h3>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#26C6DA' }}>{score}/{questions.length}</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              {score === questions.length ? 'Perfect! Amazing job! 🏆' : 
               score >= questions.length/2 ? 'Great work! Keep going! 👍' : 
               'Good start! Practice makes perfect! 💪'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={handleRestart} style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', fontFamily: "'Poppins', sans-serif" }}>
              Play Again
            </button>
            <button onClick={onBack} style={{ flex: 1, padding: '16px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', fontFamily: "'Poppins', sans-serif" }}>
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }
};

// NEW: Short Story Game Component (RESTORED)
const ShortStoryGame = ({ onBack }) => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const stories = [
    {
      id: 1,
      title: 'The Mysterious Forest',
      genre: 'Adventure',
      author: 'Emily Writer',
      description: 'A magical journey through an enchanted forest',
      chapters: [
        {
          title: 'Chapter 1: The Beginning',
          content: `Once upon a time, a young girl named Lily discovered a <span style="background-color: #FFE5E5; padding: 2px 4px; border-radius: 3px;">mysterious</span> path in the woods. She felt both <span style="background-color: #E5F3FF; padding: 2px 4px; border-radius: 3px;">curious</span> and <span style="background-color: #FFF9E5; padding: 2px 4px; border-radius: 3px;">apprehensive</span>. The trees seemed to whisper secrets, and the air was filled with <span style="background-color: #F3E5FF; padding: 2px 4px; border-radius: 3px;">magical</span> energy.`
        },
        {
          title: 'Chapter 2: The Hidden Cottage',
          content: `As Lily ventured deeper, she found a <span style="background-color: #E5F9FF; padding: 2px 4px; border-radius: 3px;">quaint</span> cottage hidden among the trees. It was <span style="background-color: #FFE5E5; padding: 2px 4px; border-radius: 3px;">ancient</span> but well-maintained. She knocked on the door, her heart <span style="background-color: #FFF9E5; padding: 2px 4px; border-radius: 3px;">pounding</span> with excitement.`
        },
        {
          title: 'Chapter 3: The Wise Old Woman',
          content: `An <span style="background-color: #E5F3FF; padding: 2px 4px; border-radius: 3px;">elderly</span> woman answered, her eyes twinkling with <span style="background-color: #F3E5FF; padding: 2px 4px; border-radius: 3px;">wisdom</span>. "I've been expecting you," she said with a <span style="background-color: #E5F9FF; padding: 2px 4px; border-radius: 3px;">gentle</span> smile. She offered Lily a cup of <span style="background-color: #FFE5E5; padding: 2px 4px; border-radius: 3px;">steaming</span> tea.`
        }
      ],
      quiz: [
        {
          question: 'What does "mysterious" mean?',
          options: ['Easy to understand', 'Difficult to explain or understand', 'Very common', 'Boring'],
          correct: 1
        },
        {
          question: 'What does "apprehensive" mean?',
          options: ['Excited', 'Angry', 'Anxious or fearful about the future', 'Happy'],
          correct: 2
        },
        {
          question: 'What does "quaint" mean?',
          options: ['Modern', 'Ugly', 'Attractively unusual or old-fashioned', 'Large'],
          correct: 2
        }
      ]
    },
    {
      id: 2,
      title: 'Space Explorer',
      genre: 'Science Fiction',
      author: 'Alex Stargazer',
      description: 'An intergalactic adventure across the cosmos',
      chapters: [
        {
          title: 'Chapter 1: Launch Day',
          content: `Captain Zara stood before her <span style="background-color: #E5F3FF; padding: 2px 4px; border-radius: 3px;">spaceship</span>, feeling a mix of <span style="background-color: #FFF9E5; padding: 2px 4px; border-radius: 3px;">anticipation</span> and <span style="background-color: #FFE5E5; padding: 2px 4px; border-radius: 3px;">trepidation</span>. This was the most <span style="background-color: #F3E5FF; padding: 2px 4px; border-radius: 3px;">ambitious</span> mission humanity had ever attempted.`
        },
        {
          title: 'Chapter 2: Alien Encounter',
          content: `As they entered a new galaxy, they detected <span style="background-color: #E5F9FF; padding: 2px 4px; border-radius: 3px;">peculiar</span> signals. Suddenly, a <span style="background-color: #FFE5E5; padding: 2px 4px; border-radius: 3px;">luminous</span> spacecraft appeared. The aliens were both <span style="background-color: #E5F3FF; padding: 2px 4px; border-radius: 3px;">intriguing</span> and <span style="background-color: #FFF9E5; padding: 2px 4px; border-radius: 3px;">formidable</span>.`
        }
      ],
      quiz: [
        {
          question: 'What does "trepidation" mean?',
          options: ['Happiness', 'Fear or anxiety about something', 'Confidence', 'Boredom'],
          correct: 1
        },
        {
          question: 'What does "luminous" mean?',
          options: ['Dark', 'Emitting or reflecting light', 'Small', 'Noisy'],
          correct: 1
        }
      ]
    },
    {
      id: 3,
      title: 'The Lost Treasure',
      genre: 'Mystery',
      author: 'Sam Detective',
      description: 'Solve clues to find ancient treasure',
      chapters: [
        {
          title: 'Chapter 1: The Old Map',
          content: `In the dusty attic, Max discovered an <span style="background-color: #FFE5E5; padding: 2px 4px; border-radius: 3px;">ancient</span> map with <span style="background-color: #E5F3FF; padding: 2px 4px; border-radius: 3px;">cryptic</span> symbols. His <span style="background-color: #FFF9E5; padding: 2px 4px; border-radius: 3px;">intuition</span> told him this was <span style="background-color: #F3E5FF; padding: 2px 4px; border-radius: 3px;">significant</span>. The quest would require both <span style="background-color: #E5F9FF; padding: 2px 4px; border-radius: 3px;">courage</span> and <span style="background-color: #FFE5E5; padding: 2px 4px; border-radius: 3px;">perseverance</span>.`
        }
      ],
      quiz: [
        {
          question: 'What does "cryptic" mean?',
          options: ['Clear and obvious', 'Having a meaning that is mysterious or obscure', 'Colorful', 'Modern'],
          correct: 1
        },
        {
          question: 'What does "perseverance" mean?',
          options: ['Giving up easily', 'Continuing in a course of action despite difficulty', 'Being lazy', 'Acting quickly'],
          correct: 1
        }
      ]
    }
  ];

  // Story Selection Screen
  if (!selectedStory) {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={onBack} style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', fontFamily: "'Poppins', sans-serif" }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0', fontFamily: "'Poppins', sans-serif" }}>Short Stories</h1>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px', fontFamily: "'Poppins', sans-serif" }}>Choose a Story</h2>
          <p style={{ fontSize: '15px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>Read engaging stories and learn vocabulary through context!</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {stories.map((story) => (
            <div 
              key={story.id}
              onClick={() => setSelectedStory(story)}
              style={{
                background: 'white',
                border: '2px solid #f0f0f0',
                borderRadius: '16px',
                padding: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                fontFamily: "'Poppins', sans-serif"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#FFD54F';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#f0f0f0';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', fontFamily: "'Poppins', sans-serif" }}>{story.title}</h3>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  background: '#FFF9E5', 
                  color: '#FFA726',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  {story.genre}
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px', fontFamily: "'Poppins', sans-serif" }}>{story.description}</p>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '15px', fontFamily: "'Poppins', sans-serif" }}>
                By {story.author} • {story.chapters.length} chapters
              </div>
              <div style={{ fontSize: '13px', color: '#7c6fd6', fontWeight: '600', fontFamily: "'Poppins', sans-serif" }}>
                Vocabulary words highlighted in color!
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Story Reading Screen
  const currentChapterData = selectedStory.chapters[currentChapter];
  const isLastChapter = currentChapter === selectedStory.chapters.length - 1;

  if (showQuiz) {
    const quizQuestion = selectedStory.quiz[0]; // Simple one-question quiz per chapter

    const handleQuizAnswer = (answerIndex) => {
      if (!quizAnswered) {
        setQuizAnswered(true);
        if (answerIndex === quizQuestion.correct) {
          setQuizScore(quizScore + 1);
        }
      }
    };

    const handleContinueStory = () => {
      setShowQuiz(false);
      setQuizAnswered(false);
      if (isLastChapter) {
        // Go to completion screen
        setCurrentChapter(0);
        setSelectedStory(null);
        setQuizScore(0);
      } else {
        setCurrentChapter(currentChapter + 1);
      }
    };

    return (
      <div style={{ fontFamily: "'Poppins', sans-serif", maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={() => setShowQuiz(false)} style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', fontFamily: "'Poppins', sans-serif" }}>← Back</button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0', fontFamily: "'Poppins', sans-serif" }}>Vocabulary Quiz</h1>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFD54F', fontFamily: "'Poppins', sans-serif" }}>Score: {quizScore}</div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '36px', marginBottom: '15px' }}>📝</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px', fontFamily: "'Poppins', sans-serif" }}>Chapter Quiz</h2>
            <p style={{ fontSize: '14px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>
              Answer correctly to continue to the next chapter!
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>
              {quizQuestion.question}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizQuestion.options.map((option, idx) => {
                let bgColor = '#f8f7ff';
                let borderColor = '#e0e0e0';

                if (quizAnswered) {
                  if (idx === quizQuestion.correct) {
                    bgColor = '#e8f5e9';
                    borderColor = '#4CAF50';
                  } else if (idx !== quizQuestion.correct) {
                    bgColor = '#ffebee';
                    borderColor = '#f44336';
                  }
                }

                return (
                  <button 
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    disabled={quizAnswered}
                    style={{
                      padding: '16px',
                      border: `2px solid ${borderColor}`,
                      borderRadius: '10px',
                      background: bgColor,
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#333',
                      cursor: quizAnswered ? 'default' : 'pointer',
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    <span style={{ fontWeight: '700', color: '#FFD54F', marginRight: '10px' }}>{String.fromCharCode(65 + idx)}.</span>
                    {option}
                    {quizAnswered && idx === quizQuestion.correct && <span style={{ float: 'right', color: '#4CAF50' }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {quizAnswered && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', color: '#666', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>
                {quizQuestion.options[quizQuestion.correct] === quizQuestion.options[quizQuestion.correct] ? 
                 'Correct! You can continue to the next chapter.' : 
                 'Good try! The correct answer was highlighted.'}
              </p>
              <button 
                onClick={handleContinueStory}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #FFD54F 0%, #FFA726 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {isLastChapter ? 'Finish Story' : 'Continue to Next Chapter'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Story Reading View
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => setSelectedStory(null)} style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#666', fontFamily: "'Poppins', sans-serif" }}>← Back to Stories</button>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0', fontFamily: "'Poppins', sans-serif" }}>{selectedStory.title}</h1>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFD54F', fontFamily: "'Poppins', sans-serif" }}>Chapter {currentChapter + 1}/{selectedStory.chapters.length}</div>
      </div>

      <div style={{ width: '100%', height: '4px', background: '#e0e0e0', borderRadius: '2px', marginBottom: '30px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #FFD54F 0%, #FFA726 100%)', width: `${((currentChapter + 1) / selectedStory.chapters.length) * 100}%`, transition: 'width 0.3s ease' }}></div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px', fontFamily: "'Poppins', sans-serif" }}>
            {currentChapterData.title}
          </h2>
          <div style={{ 
            padding: '4px 16px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '600', 
            background: '#FFF9E5', 
            color: '#FFA726',
            display: 'inline-block',
            fontFamily: "'Poppins', sans-serif"
          }}>
            {selectedStory.genre}
          </div>
        </div>

        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '40px', fontFamily: "'Poppins', sans-serif" }}>
          <div dangerouslySetInnerHTML={{ __html: currentChapterData.content }} />
        </div>

        <div style={{ background: '#FFF9E5', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#FFA726', marginBottom: '10px', fontFamily: "'Poppins', sans-serif" }}>Vocabulary Words</h3>
          <p style={{ fontSize: '14px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>
            Highlighted words are vocabulary words. Pay attention to their context in the story!
          </p>
        </div>

        <button 
          onClick={() => setShowQuiz(true)}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #FFD54F 0%, #FFA726 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Continue to Chapter Quiz
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleFavorite = (wordId) => {
    setFavorites(prev => {
      if (prev.includes(wordId)) {
        return prev.filter(id => id !== wordId);
      } else {
        return [...prev, wordId];
      }
    });
  };

  // PlayGames Component - UPDATED to include new games
  const PlayGames = () => {
    const games = [
      {
        id: 'flashcards',
        name: 'Flashcards',
        description: 'Flip cards to learn new words and their definitions.',
        iconBg: '#FFE5E5',
        icon: '📇',
        accentColor: '#FF6B6B'
      },
      {
        id: 'match',
        name: 'Match Game',
        description: 'Connect words with their correct definitions.',
        iconBg: '#E5F3FF',
        icon: '🎯',
        accentColor: '#4A90E2'
      },
      {
        id: 'short-story',
        name: 'Short Story',
        description: 'Short stories to read with vocab words and quizzes.',
        iconBg: '#FFF9E5',
        icon: '📖',
        accentColor: '#FFD54F'
      },
      {
        id: 'quiz',
        name: 'Quiz',
        description: 'Test your knowledge with multiple choice questions.',
        iconBg: '#FFF5E5',
        icon: '❓',
        accentColor: '#FFA726'
      },
      {
        id: 'type-it',
        name: 'Type It!',
        description: 'Listen to the word and type the correct word.',
        iconBg: '#F3E5FF',
        icon: '⌨️',
        accentColor: '#AB47BC'
      },
      {
        id: 'guesswhat',
        name: 'GuessWhat',
        description: 'Guess what the person is doing.',
        iconBg: '#E5F9FF',
        icon: '🤔',
        accentColor: '#26C6DA'
      },
    ];

    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '12px',
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif",
        }}>Choose Your Game</h1>
        <p style={{
          fontSize: '15px',
          color: '#999',
          textAlign: 'center',
          marginBottom: '50px',
          fontFamily: "'Poppins', sans-serif",
        }}>Pick a fun way to learn vocabulary!</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {games.map((game) => (
            <div 
              key={game.id} 
              onClick={() => {
                // UPDATED: Include new games in the click handler
                if (game.id === 'flashcards' || game.id === 'match' || game.id === 'quiz' || game.id === 'guesswhat' || game.id === 'short-story') {
                  setCurrentGame(game.id);
                } else {
                  alert(`${game.name} - Coming soon!`);
                }
              }}
              style={{
                background: 'white',
                border: '2px solid #f0f0f0',
                borderRadius: '20px',
                padding: '32px 28px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = game.accentColor;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#f0f0f0';
              }}
            >
              <div style={{
                width: '90px',
                height: '90px',
                background: game.iconBg,
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                position: 'relative',
              }}>
                {/* Icon container with emoji placeholder */}
                <div style={{
                  fontSize: '48px',
                }}>
                  {game.icon}
                </div>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '10px',
                fontFamily: "'Poppins', sans-serif",
              }}>{game.name}</h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.7',
                fontFamily: "'Poppins', sans-serif",
              }}>{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // WordLibrary Component
  const WordLibrary = () => {
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState([]);

    const toggleFavorite = (wordId) => {
      setFavorites(prev => 
        prev.includes(wordId) 
          ? prev.filter(id => id !== wordId)
          : [...prev, wordId]
      );
    };

    const words = [
      // EASY LEVEL - 6 words
      {
        id: 1,
        word: 'Happy',
        pronunciation: '/ˈhæp.i/',
        definition: 'Feeling or showing pleasure or contentment.',
        example: 'She felt happy when she received the good news.',
        difficulty: 'easy',
        color: '#4CAF50'
      },
      {
        id: 2,
        word: 'Bright',
        pronunciation: '/braɪt/',
        definition: 'Giving out or reflecting a lot of light; shining.',
        example: 'The sun was bright in the clear blue sky.',
        difficulty: 'easy',
        color: '#4CAF50'
      },
      {
        id: 3,
        word: 'Quick',
        pronunciation: '/kwɪk/',
        definition: 'Moving fast or doing something in a short time.',
        example: 'The rabbit was very quick and escaped easily.',
        difficulty: 'easy',
        color: '#4CAF50'
      },
      {
        id: 4,
        word: 'Calm',
        pronunciation: '/kɑːm/',
        definition: 'Not showing or feeling nervousness, anger, or other strong emotions.',
        example: 'She remained calm during the emergency.',
        difficulty: 'easy',
        color: '#4CAF50'
      },
      {
        id: 5,
        word: 'Kind',
        pronunciation: '/kaɪnd/',
        definition: 'Having or showing a friendly, generous, and considerate nature.',
        example: 'He was kind to everyone he met.',
        difficulty: 'easy',
        color: '#4CAF50'
      },
      {
        id: 6,
        word: 'Strong',
        pronunciation: '/strɒŋ/',
        definition: 'Having the power to move heavy weights or perform physically demanding tasks.',
        example: 'The athlete was strong enough to lift the heavy barbell.',
        difficulty: 'easy',
        color: '#4CAF50'
      },
      
      // MODERATE LEVEL - 6 words
      {
        id: 7,
        word: 'Ambitious',
        pronunciation: '/æmˈbɪʃ.əs/',
        definition: 'Having or showing a strong desire and determination to succeed.',
        example: 'She was ambitious and worked hard to achieve her goals.',
        difficulty: 'moderate',
        color: '#FF9800'
      },
      {
        id: 8,
        word: 'Cautious',
        pronunciation: '/ˈkɔː.ʃəs/',
        definition: 'Careful to avoid potential problems or dangers.',
        example: 'He was cautious when crossing the busy street.',
        difficulty: 'moderate',
        color: '#FF9800'
      },
      {
        id: 9,
        word: 'Diligent',
        pronunciation: '/ˈdɪl.ɪ.dʒənt/',
        definition: 'Having or showing care and conscientiousness in one\'s work or duties.',
        example: 'The diligent student completed all assignments on time.',
        difficulty: 'moderate',
        color: '#FF9800'
      },
      {
        id: 10,
        word: 'Generous',
        pronunciation: '/ˈdʒen.ər.əs/',
        definition: 'Showing a readiness to give more than is necessary or expected.',
        example: 'Her generous donation helped many families in need.',
        difficulty: 'moderate',
        color: '#FF9800'
      },
      {
        id: 11,
        word: 'Persistent',
        pronunciation: '/pəˈsɪs.tənt/',
        definition: 'Continuing firmly in a course of action despite difficulty or opposition.',
        example: 'His persistent efforts finally led to success.',
        difficulty: 'moderate',
        color: '#FF9800'
      },
      {
        id: 12,
        word: 'Vibrant',
        pronunciation: '/ˈvaɪ.brənt/',
        definition: 'Full of energy and enthusiasm; bright and striking.',
        example: 'The city had a vibrant cultural scene.',
        difficulty: 'moderate',
        color: '#FF9800'
      },
      
      // ADVANCED LEVEL - 6 words
      {
        id: 13,
        word: 'Ephemeral',
        pronunciation: '/ɪˈfem.ər.əl/',
        definition: 'Lasting for a very short time; temporary.',
        example: 'The beauty of cherry blossoms is ephemeral.',
        difficulty: 'advanced',
        color: '#F44336'
      },
      {
        id: 14,
        word: 'Ubiquitous',
        pronunciation: '/juːˈbɪk.wɪ.təs/',
        definition: 'Present, appearing, or found everywhere.',
        example: 'Smartphones have become ubiquitous in modern society.',
        difficulty: 'advanced',
        color: '#F44336'
      },
      {
        id: 15,
        word: 'Enigmatic',
        pronunciation: '/ˌen.ɪɡˈmæt.ɪk/',
        definition: 'Difficult to interpret or understand; mysterious.',
        example: 'The Mona Lisa\'s enigmatic smile has fascinated people for centuries.',
        difficulty: 'advanced',
        color: '#F44336'
      },
      {
        id: 16,
        word: 'Meticulous',
        pronunciation: '/məˈtɪk.jə.ləs/',
        definition: 'Showing great attention to detail; very careful and precise.',
        example: 'The scientist was meticulous in recording every observation.',
        difficulty: 'advanced',
        color: '#F44336'
      },
      {
        id: 17,
        word: 'Eloquent',
        pronunciation: '/ˈel.ə.kwənt/',
        definition: 'Fluent or persuasive in speaking or writing.',
        example: 'Her eloquent speech moved the entire audience to tears.',
        difficulty: 'advanced',
        color: '#F44336'
      },
      {
        id: 18,
        word: 'Resilient',
        pronunciation: '/rɪˈzɪl.i.ənt/',
        definition: 'Able to recover quickly from difficulties; tough and adaptable.',
        example: 'The community proved resilient after the natural disaster.',
        difficulty: 'advanced',
        color: '#F44336'
      },
    ];

    // Filter words based on selected difficulty and search term
    const filteredWords = words.filter(word => {
      const matchesDifficulty = selectedDifficulty === 'all' 
        ? true 
        : selectedDifficulty === 'favorites' 
          ? favorites.includes(word.id)
          : word.difficulty === selectedDifficulty;
      const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           word.definition.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDifficulty && matchesSearch;
    });

    const favoriteWords = words.filter(word => favorites.includes(word.id));

    return (
      <div style={wordStyles.container}>
        <h1 style={wordStyles.title}>Word Library</h1>
        <p style={wordStyles.subtitle}>Explore and learn new vocabulary</p>

        <div style={wordStyles.filterSection}>
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={wordStyles.searchInput}
          />
          
          <div style={wordStyles.filterButtons}>
            <button
              style={{
                ...wordStyles.filterButton,
                background: selectedDifficulty === 'all' ? '#7c6fd6' : '#f0f0f0',
                color: selectedDifficulty === 'all' ? 'white' : '#666',
              }}
              onClick={() => setSelectedDifficulty('all')}
            >
              All Words
            </button>
            <button
              style={{
                ...wordStyles.filterButton,
                background: selectedDifficulty === 'easy' ? '#4CAF50' : '#f0f0f0',
                color: selectedDifficulty === 'easy' ? 'white' : '#666',
              }}
              onClick={() => setSelectedDifficulty('easy')}
            >
              Easy
            </button>
            <button
              style={{
                ...wordStyles.filterButton,
                background: selectedDifficulty === 'moderate' ? '#FF9800' : '#f0f0f0',
                color: selectedDifficulty === 'moderate' ? 'white' : '#666',
              }}
              onClick={() => setSelectedDifficulty('moderate')}
            >
              Moderate
            </button>
            <button
              style={{
                ...wordStyles.filterButton,
                background: selectedDifficulty === 'advanced' ? '#F44336' : '#f0f0f0',
                color: selectedDifficulty === 'advanced' ? 'white' : '#666',
              }}
              onClick={() => setSelectedDifficulty('advanced')}
            >
              Advanced
            </button>
            <button
              style={{
                ...wordStyles.filterButton,
                background: selectedDifficulty === 'favorites' ? '#FF1744' : '#f0f0f0',
                color: selectedDifficulty === 'favorites' ? 'white' : '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onClick={() => setSelectedDifficulty('favorites')}
            >
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span style={{
                  background: selectedDifficulty === 'favorites' ? 'rgba(255,255,255,0.3)' : '#FF1744',
                  color: selectedDifficulty === 'favorites' ? 'white' : 'white',
                  borderRadius: '10px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  fontWeight: '700',
                }}>
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Show empty state for favorites */}
        {selectedDifficulty === 'favorites' && favorites.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            margin: '20px 0',
          }}>
           <div style={{ fontSize: '40px', marginBottom: '20px' }}>
  <img 
    src="src/assets/sadheart.jpg" 
    alt="Heart Icon"
    style={{
      width: '60px',
      height: '60px',
      display: 'block',
      margin: '0 auto'
    }}
  />
</div>
<h3 style={{
  fontSize: '15px',
  fontWeight: '800',
  color: '#333',
  marginBottom: '12px',
  fontFamily: 'Poppins, sans-serif'
}}>
              No favorites, add one!
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#999',
              fontFamily: 'Poppins, sans-serif',
            }}>
              Click the heart icon on any word to add it to your favorites
            </p>
          </div>
        ) : (
          <div style={wordStyles.wordsGrid}>
            {filteredWords.map((word) => (
              <div key={word.id} style={wordStyles.wordCard}>
                <div style={{ marginBottom: '15px' }}>
                  <div>
                    <h3 style={wordStyles.wordName}>{word.word}</h3>
                    <p style={wordStyles.pronunciation}>{word.pronunciation}</p>
                  </div>
                  <p style={wordStyles.wordDefinition}>{word.definition}</p>
                  <p style={wordStyles.wordExample}>
                    <span style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>Ex: </span>
                    <span style={{ fontStyle: 'italic' }}>"{word.example}"</span>
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: word.color + '20',
                    color: word.color,
                    fontFamily: 'Poppins, sans-serif',
                  }}>
                    {word.difficulty.charAt(0).toUpperCase() + word.difficulty.slice(1)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(word.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '22px',
                      padding: '0',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {favorites.includes(word.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredWords.length === 0 && selectedDifficulty !== 'favorites' && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999',
            fontFamily: 'Poppins, sans-serif',
          }}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>No words found</p>
            <p style={{ fontSize: '14px' }}>Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    );
  };
  // MyProgress Component - UPDATED WITH SMALLER, MORE PRESENTABLE CARDS
  const MyProgress = () => {
    return (
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: "'Poppins', sans-serif",
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <h1 style={{
            color: '#7c3aed',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '6px',
            fontFamily: "'Poppins', sans-serif",
          }}>Your Progress</h1>
          <p style={{
            color: '#6b7280',
            fontSize: '15px',
            fontFamily: "'Poppins', sans-serif",
          }}>Keep up the great work! 🎉</p>
        </div>

        {/* Main Stats Grid - SMALLER CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {/* Level Card */}
          <div style={{
            background: 'white',
            borderRadius: '14px',
            padding: '18px',
            boxShadow: '0 2px 12px rgba(139, 92, 246, 0.06)',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>🎯</div>
            <div style={{
              color: '#9ca3af',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
            }}>Level</div>
            <div style={{
              color: '#1f2937',
              fontSize: '26px',
              fontWeight: '700',
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
            }}>0</div>
            <div style={{ marginTop: '8px' }}>
              <div style={{
                background: '#f3f4f6',
                height: '6px',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '4px',
              }}>
                <div style={{
                  height: '100%',
                  borderRadius: '6px',
                  background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                  width: '0%',
                  transition: 'width 1s ease',
                }}></div>
              </div>
              <div style={{
                color: '#9ca3af',
                fontSize: '11px',
                fontWeight: '500',
                fontFamily: "'Poppins', sans-serif",
              }}>0/100 XP</div>
            </div>
          </div>

          {/* Points Card */}
          <div style={{
            background: 'white',
            borderRadius: '14px',
            padding: '18px',
            boxShadow: '0 2px 12px rgba(139, 92, 246, 0.06)',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>⭐</div>
            <div style={{
              color: '#9ca3af',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
            }}>Total Points</div>
            <div style={{
              color: '#1f2937',
              fontSize: '26px',
              fontWeight: '700',
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
            }}>0</div>
            <div style={{
              color: '#d1d5db',
              fontSize: '12px',
              marginTop: '8px',
              fontFamily: "'Poppins', sans-serif",
            }}>Keep earning!</div>
          </div>

          {/* Streak Card */}
          <div style={{
            background: 'white',
            borderRadius: '14px',
            padding: '18px',
            boxShadow: '0 2px 12px rgba(139, 92, 246, 0.06)',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>🔥</div>
            <div style={{
              color: '#9ca3af',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
            }}>Day Streak</div>
            <div style={{
              color: '#1f2937',
              fontSize: '26px',
              fontWeight: '700',
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
            }}>0</div>
            <div style={{
              color: '#d1d5db',
              fontSize: '12px',
              marginTop: '8px',
              fontFamily: "'Poppins', sans-serif",
            }}>Start your journey!</div>
          </div>

          {/* Stories Card */}
          <div style={{
            background: 'white',
            borderRadius: '14px',
            padding: '18px',
            boxShadow: '0 2px 12px rgba(139, 92, 246, 0.06)',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>📚</div>
            <div style={{
              color: '#9ca3af',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
            }}>Stories Completed</div>
            <div style={{
              color: '#1f2937',
              fontSize: '26px',
              fontWeight: '700',
              marginBottom: '6px',
              fontFamily: "'Poppins', sans-serif",
            }}>0/50</div>
            <div style={{ marginTop: '8px' }}>
              <div style={{
                background: '#f3f4f6',
                height: '6px',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '4px',
              }}>
                <div style={{
                  height: '100%',
                  borderRadius: '6px',
                  background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                  width: '0%',
                  transition: 'width 1s ease',
                }}></div>
              </div>
              <div style={{
                color: '#9ca3af',
                fontSize: '11px',
                fontWeight: '500',
                fontFamily: "'Poppins', sans-serif",
              }}>0% complete</div>
            </div>
          </div>
        </div>

        {/* Secondary Stats - SMALLER CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '28px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
            border: '1.5px solid #e9d5ff',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <div style={{ fontSize: '24px' }}>🎯</div>
            <div>
              <div style={{
                color: '#7c3aed',
                fontSize: '22px',
                fontWeight: '700',
                marginBottom: '2px',
                fontFamily: "'Poppins', sans-serif",
              }}>0%</div>
              <div style={{
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: "'Poppins', sans-serif",
              }}>Accuracy</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
            border: '1.5px solid #e9d5ff',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <div style={{ fontSize: '24px' }}>📝</div>
            <div>
              <div style={{
                color: '#7c3aed',
                fontSize: '22px',
                fontWeight: '700',
                marginBottom: '2px',
                fontFamily: "'Poppins', sans-serif",
              }}>0</div>
              <div style={{
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: "'Poppins', sans-serif",
              }}>Words Learned</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
            border: '1.5px solid #e9d5ff',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
          }}>
            <div style={{ fontSize: '24px' }}>✅</div>
            <div>
              <div style={{
                color: '#7c3aed',
                fontSize: '22px',
                fontWeight: '700',
                marginBottom: '2px',
                fontFamily: "'Poppins', sans-serif",
              }}>0</div>
              <div style={{
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: "'Poppins', sans-serif",
              }}>Correct Answers</div>
            </div>
          </div>
        </div>

        {/* Achievements - SMALLER CARDS */}
        <h2 style={{
          color: '#1f2937',
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '16px',
          fontFamily: "'Poppins', sans-serif",
        }}>Achievements</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: '12px',
          marginBottom: '28px',
        }}>
          {[
            { emoji: '📖', label: '0 Stories', unlocked: false },
            { emoji: '📚', label: '5 Stories', unlocked: false },
            { emoji: '🎓', label: '10 Stories', unlocked: false },
            { emoji: '🔥', label: '0 Day Streak', unlocked: false },
            { emoji: '⭐', label: 'Perfect Score', unlocked: false },
            { emoji: '📝', label: '0 Words', unlocked: false },
          ].map((achievement, index) => (
            <div key={index} style={{
              background: achievement.unlocked 
                ? 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' 
                : 'white',
              border: achievement.unlocked 
                ? '1.5px solid #a78bfa' 
                : '1.5px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px 12px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              position: 'relative',
              opacity: achievement.unlocked ? 1 : 0.4,
              fontFamily: "'Poppins', sans-serif",
            }}>
              <div style={{
                fontSize: '36px',
                marginBottom: '8px',
                filter: achievement.unlocked ? 'grayscale(0%)' : 'grayscale(100%)',
                transition: 'filter 0.3s ease',
              }}>{achievement.emoji}</div>
              <div style={{
                color: achievement.unlocked ? '#7c3aed' : '#6b7280',
                fontSize: '11px',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
              }}>{achievement.label}</div>
              {achievement.unlocked && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: '#10b981',
                  color: 'white',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: "'Poppins', sans-serif",
                }}>✓</div>
              )}
            </div>
          ))}
        </div>

        {/* Motivation Card - SMALLER */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)',
        }}>
          <div style={{ fontSize: '36px' }}>💪</div>
          <div style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: "'Poppins', sans-serif",
          }}>Ready to start your learning journey! Let's go! 🚀</div>
        </div>
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

          .flashcard-container {
            perspective: 1000px;
          }

          .flashcard-inner {
            position: relative;
            width: 100%;
            min-height: 300px;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }

          .flashcard-inner.flipped {
            transform: rotateY(180deg);
          }

          .flashcard-front, .flashcard-back {
            position: absolute;
            width: 100%;
            min-height: 300px;
            backface-visibility: hidden;
            display: flex;
            align-items: 'center',
            justifyContent: 'center',
            flex-direction: 'column',
            background: linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%);
            color: white;
            border-radius: 16px;
            cursor: pointer;
          }

          .flashcard-back {
            transform: rotateY(180deg);
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
            VocaboPlay
          </div>

          {/* Menu Items */}
          <nav style={{ flex: 1, padding: '20px 0' }}>
            {[
              { name: 'Dashboard', icon: '▣' },
              { name: 'Word Library', icon: '☰' },
              { name: 'Games', icon: '◉' },
              { name: 'My Progress', icon: '▦' },
              { name: 'Favorites', icon: '★' },
            ].map((item) => (
              <div
                key={item.name}
                className={`menu-item ${activeMenu === item.name ? 'active' : ''}`}
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

          {/* Settings at bottom */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px 0',
          }}>
            <div
              className="menu-item"
              onClick={() => setActiveMenu('Settings')}
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
              <span style={{ fontSize: '18px' }}>⚙</span>
              <span>Settings</span>
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
          {/* Top Bar with User Profile */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '40px',
            gap: '15px',
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
            >
              <span style={{ fontSize: '18px' }}>👤</span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#333', fontFamily: "'Poppins', sans-serif" }}>kwekwek</span>
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
                  kwekwek
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/');
                  }}
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
          {currentGame === 'flashcards' && (
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: '30px 40px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <Flashcards onBack={() => setCurrentGame(null)} />
            </div>
          )}
          
          {currentGame === 'quiz' && (
            <div style={{
              maxWidth: '700px',
              margin: '0 auto',
              padding: '30px 40px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <Quiz onBack={() => setCurrentGame(null)} />
            </div>
          )}
          
          {currentGame === 'match' && (
            <div style={{
              padding: '30px 40px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <MatchGame onBack={() => setCurrentGame(null)} />
            </div>
          )}

          {/* NEW: Add conditions for GuessWhat and Short Story games */}
          {currentGame === 'guesswhat' && (
            <div style={{
              padding: '30px 40px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <GuessWhatGame onBack={() => setCurrentGame(null)} />
            </div>
          )}

          {currentGame === 'short-story' && (
            <div style={{
              padding: '30px 40px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <ShortStoryGame onBack={() => setCurrentGame(null)} />
            </div>
          )}

          {!currentGame && activeMenu === 'Word Library' && <WordLibrary />}
          {!currentGame && activeMenu === 'Games' && <PlayGames />}
          {!currentGame && activeMenu === 'My Progress' && <MyProgress />}

          {activeMenu === 'Dashboard' && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '35px 40px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                maxWidth: '550px',
                display: 'flex',
                gap: '30px',
                alignItems: 'center',
                fontFamily: "'Poppins', sans-serif",
              }}>
                <div style={{
                  width: '250px',
                  height: '200px',
                  background: 'linear-gradient(135deg, #e8e4f3 0%, #f0edfa 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <img
                    src="src/assets/bokawelcoming.jpg"
                    alt="VocaboPlay Mascot"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      justifyContent: 'center',
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    marginBottom: '12px',
                    fontFamily: "'Poppins', sans-serif",
                    
                  }}>
                    Welcome to VocaboPlay!
                  </h2>
                  <p style={{
                    fontSize: '13px',
                    color: '#666',
                    lineHeight: '1.6',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Thanks for joining our fun and interactive learning community! Join students and educators who are enhancing vocabulary skills.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!currentGame && activeMenu === 'Favorites' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '60px 40px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '500px',
              textAlign: 'center',
              fontFamily: "'Poppins', sans-serif",
            }}>
              <div style={{
                width: '150px',
                height: '150px',
                background: 'linear-gradient(135deg, #e8e4f3 0%, #f0edfa 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '25px',
              }}>
                <img
                  src="src/assets/bokasadfavorite.jpg"
                  alt="Favorites Placeholder"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '12px',
                fontFamily: "'Poppins', sans-serif",
              }}>
                No favorites yet...
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#999',
                fontFamily: "'Poppins', sans-serif",
              }}>
                Start marking words as favorites to see them here!
              </p>
            </div>
          )}

          {activeMenu === 'Settings' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px 40px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              maxWidth: '800px',
              fontFamily: "'Poppins', sans-serif",
            }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '8px',
                fontFamily: "'Poppins', sans-serif",
              }}>
                Profile Setting
              </h1>
              <p style={{
                fontSize: '13px',
                color: '#999',
                marginBottom: '40px',
                fontFamily: "'Poppins', sans-serif",
              }}>
                Customize your profile
              </p>

              {/* Avatar Section */}
              <div style={{ marginBottom: '50px' }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '20px',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Avatar
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                  maxWidth: '400px',
                }}>
                  {['🐮', '🦌', '🐼', '🦆', '🦎', '🐻'].map((avatar, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '40px',
                        cursor: 'pointer',
                        border: '2px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#7c6fd6';
                        e.currentTarget.style.background = '#f8f7ff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.background = '#f0f0f0';
                      }}
                    >
                      {avatar}
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Information */}
              <div style={{ marginTop: '50px' }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '25px',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Profile Information
                </h2>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#333',
                    display: 'block',
                    marginBottom: '8px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue="kwekwek"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      padding: '12px 14px',
                      border: '1px solid #d0d0d0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: "'Poppins', sans-serif",
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#333',
                    display: 'block',
                    marginBottom: '8px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="glamer25@gmail.com"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      padding: '12px 14px',
                      border: '1px solid #d0d0d0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: "'Poppins', sans-serif",
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Save Changes Button */}
                <button
                  style={{
                    marginTop: '30px',
                    padding: '14px 40px',
                    background: 'linear-gradient(135deg, #7c6fd6 0%, #9b8de8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  onClick={() => alert('Changes saved successfully!')}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Word Library Styles
const wordStyles = {
  container: {
    padding: '30px 40px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    fontSize: '13px',
    color: '#999',
    marginBottom: '25px',
    fontFamily: "'Poppins', sans-serif",
  },
  filterSection: {
    marginBottom: '30px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '15px',
    fontFamily: "'Poppins', sans-serif",
    boxSizing: 'border-box',
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Poppins', sans-serif",
  },
  wordsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  wordCard: {
    border: '1px solid #e8e4f3',
    borderRadius: '12px',
    padding: '20px',
    background: '#f9f8fc',
    position: 'relative',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
  },
  wordName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#7c6fd6',
    marginBottom: '4px',
    fontFamily: "'Poppins', sans-serif",
  },
  pronunciation: {
    fontSize: '12px',
    color: '#999',
    fontStyle: 'italic',
    marginBottom: '8px',
    fontFamily: "'Poppins', sans-serif",
  },
  wordDefinition: {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '8px',
    fontFamily: "'Poppins', sans-serif",
  },
  wordExample: {
    fontSize: '12px',
    color: '#888',
    lineHeight: '1.4',
    fontFamily: "'Poppins', sans-serif",
  }
};

export default Dashboard;