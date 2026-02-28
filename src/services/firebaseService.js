import { db } from '../pages/firebase';  
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

// ============ VOCABULARY SERVICES ============

// Get all words from Firebase
export const getAllWords = async () => {
  try {
    const wordsRef = collection(db, 'words');
    const snapshot = await getDocs(wordsRef);
    
    const words = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('✅ Fetched words from Firebase:', words.length);
    return words;
  } catch (error) {
    console.error('❌ Error fetching words:', error);
    return [];
  }
};

// Get words by category
export const getWordsByCategory = async (category) => {
  try {
    const wordsRef = collection(db, 'words');
    const q = query(wordsRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching words by category:', error);
    return [];
  }
};

// Get words by difficulty
export const getWordsByDifficulty = async (difficulty) => {
  try {
    const wordsRef = collection(db, 'words');
    const q = query(wordsRef, where('difficulty', '==', difficulty));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching words by difficulty:', error);
    return [];
  }
};

// ============ USER PROGRESS SERVICES ============

// Get user progress
export const getUserProgress = async (userId) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      console.log('✅ Found existing progress for user:', userId);
      return progressDoc.data();
    } else {
      // Create default progress
      const defaultProgress = {
        userId: userId,
        level: 1,
        xp: 0,
        totalPoints: 0,
        streak: 0,
        gamesPlayed: 0,
        wordsLearned: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        lastActive: new Date().toISOString(),
        flashcards: { cardsViewed: 0, knownWords: [], masteredWords: [], sessionsCompleted: 0 },
        quiz: { gamesCompleted: 0, correctAnswers: 0, totalQuestions: 0, bestScore: 0 },
        match: { gamesCompleted: 0, totalPairs: 0, totalMoves: 0, bestTime: 0, bestMoves: 0, perfectGames: 0 },
        guessWhat: { gamesCompleted: 0, correctAnswers: 0, totalQuestions: 0, bestScore: 0 },
        sentenceBuilder: { gamesCompleted: 0, correctAnswers: 0, totalSentences: 0, bestScore: 0 },
        shortStory: { chaptersRead: 0, quizzesPassed: 0, storiesCompleted: 0 },
        achievements: {
          firstGame: false,
          perfectScore: false,
          threeDayStreak: false,
          tenWords: false,
          masterLearner: false,
          speedDemon: false,
          vocabularyMaster: false
        }
      };
      
      await setDoc(progressRef, defaultProgress);
      console.log('✅ Created default progress for user:', userId);
      return defaultProgress;
    }
  } catch (error) {
    console.error('❌ Error getting user progress:', error);
    return null;
  }
};

// ============ FIXED VERSION - Update user progress ============
export const updateUserProgress = async (userId, updates) => {
  try {
    console.log('🔵 SAVING TO FIREBASE:', { userId, updates });
    
    const progressRef = doc(db, 'userProgress', userId);
    
    // Get current progress
    const progressDoc = await getDoc(progressRef);
    let currentProgress = {};
    
    if (progressDoc.exists()) {
      currentProgress = progressDoc.data();
    }
    
    // Merge updates with current progress
    const newProgress = {
      ...currentProgress,
      ...updates,
      lastUpdated: serverTimestamp(),
      lastActive: new Date().toISOString()
    };
    
    // Calculate level based on XP
    if (newProgress.xp !== undefined) {
      newProgress.level = Math.floor(newProgress.xp / 100) + 1;
    }
    
    // Update achievements
    if (!newProgress.achievements) {
      newProgress.achievements = {};
    }
    
    if (newProgress.gamesPlayed >= 1 && !newProgress.achievements.firstGame) {
      newProgress.achievements.firstGame = true;
    }
    if (newProgress.wordsLearned >= 10 && !newProgress.achievements.tenWords) {
      newProgress.achievements.tenWords = true;
    }
    if (updates.achievements?.perfectScore) {
      newProgress.achievements.perfectScore = true;
    }
    
    // SAVE TO FIRESTORE - use setDoc with merge:true
    await setDoc(progressRef, newProgress, { merge: true });
    
    console.log('✅ PROGRESS SAVED TO FIREBASE SUCCESSFULLY!');
    console.log('📊 New progress:', newProgress);
    
    return true;
    
  } catch (error) {
    console.error('❌ FIREBASE ERROR:', error);
    return false;
  }
};

// ============ SEED DATABASE FUNCTION ============
export const seedVocabulary = async () => {
  const vocabularyData = [
    { word: 'Participate', definition: 'To take part in an activity or discussion.', category: 'action', difficulty: 'easy', points: 5 },
    { word: 'Concentrate', definition: 'To focus all your attention on something.', category: 'focus', difficulty: 'easy', points: 5 },
    { word: 'Summarize', definition: 'To give a brief statement of the main points.', category: 'communication', difficulty: 'easy', points: 5 },
    { word: 'Analyze', definition: 'To examine something in detail.', category: 'analysis', difficulty: 'medium', points: 10 },
    { word: 'Collaborate', definition: 'To work together with others.', category: 'collaboration', difficulty: 'medium', points: 10 },
    { word: 'Demonstrate', definition: 'To show clearly with proof.', category: 'action', difficulty: 'medium', points: 10 },
    { word: 'Investigate', definition: 'To examine carefully to find facts.', category: 'analysis', difficulty: 'hard', points: 15 },
    { word: 'Communicate', definition: 'To share information with others.', category: 'communication', difficulty: 'hard', points: 15 },
    { word: 'Organize', definition: 'To arrange things in an orderly way.', category: 'action', difficulty: 'easy', points: 5 },
    { word: 'Observe', definition: 'To watch carefully and notice details.', category: 'focus', difficulty: 'easy', points: 5 },
    { word: 'Explain', definition: 'To make something clear.', category: 'communication', difficulty: 'easy', points: 5 },
    { word: 'Compare', definition: 'To find similarities and differences.', category: 'analysis', difficulty: 'medium', points: 10 },
    { word: 'Predict', definition: 'To say what will happen.', category: 'analysis', difficulty: 'medium', points: 10 },
    { word: 'Create', definition: 'To bring something into existence.', category: 'creativity', difficulty: 'easy', points: 5 },
    { word: 'Evaluate', definition: 'To judge the value of something.', category: 'analysis', difficulty: 'hard', points: 15 },
  ];

  try {
    const wordsRef = collection(db, 'words');
    
    for (const word of vocabularyData) {
      await addDoc(wordsRef, {
        ...word,
        createdAt: serverTimestamp()
      });
    }
    
    console.log('✅ Vocabulary seeded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding vocabulary:', error);
    return false;
  }
};