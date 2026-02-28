import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../pages/firebase';
import Leaderboards from '../components/Leaderboards';

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [games, setGames] = useState([
    { id: 1, name: 'Flashcards', icon: '📇', description: 'Master vocabulary through spaced repetition and active recall.', totalWords: 30, timesPlayed: 0, avgScore: 0, color: '#5E4B8C', iconBg: '#F3F1F9', accentColor: '#5E4B8C', category: 'vocab', difficulty: 'beginner', timeEstimate: '5-10 min', lastUpdated: new Date().toISOString(), content: { words: [] } },
    { id: 2, name: 'Match Game', icon: '🎯', description: 'Connect words with definitions in this fast-paced memory challenge.', totalPairs: 6, timesPlayed: 0, avgScore: 0, color: '#B83B5E', iconBg: '#FDF1F4', accentColor: '#B83B5E', category: 'vocab', difficulty: 'beginner', timeEstimate: '3-5 min', lastUpdated: new Date().toISOString(), content: { pairs: [] } },
    { id: 3, name: 'Short Story', icon: '📖', description: 'Immerse yourself in narratives while learning vocabulary in context.', totalStories: 5, timesPlayed: 0, avgScore: 0, color: '#2F5D62', iconBg: '#EEF3F3', accentColor: '#2F5D62', category: 'reading', difficulty: 'intermediate', timeEstimate: '15-20 min', lastUpdated: new Date().toISOString(), content: { stories: [] } },
    { id: 4, name: 'Quiz', icon: '❓', description: 'Test your knowledge with adaptive multiple choice questions.', totalQuestions: 10, timesPlayed: 0, avgScore: 0, color: '#1F4E5F', iconBg: '#E8EDF0', accentColor: '#1F4E5F', category: 'challenge', difficulty: 'intermediate', timeEstimate: '10-15 min', lastUpdated: new Date().toISOString(), content: { questions: [] } },
    { id: 5, name: 'GuessWhat', icon: '🤔', description: 'Deduce the correct word from visual context clues and sentences.', totalQuestions: 10, timesPlayed: 0, avgScore: 0, color: '#C44545', iconBg: '#FCEEEE', accentColor: '#C44545', category: 'challenge', difficulty: 'advanced', timeEstimate: '8-12 min', lastUpdated: new Date().toISOString(), content: { questions: [] } },
    { id: 6, name: 'Sentence Builder', icon: '📝', description: 'Construct grammatically correct sentences using vocabulary in context.', totalSentences: 5, timesPlayed: 0, avgScore: 0, color: '#3A6B6B', iconBg: '#EDF3F3', accentColor: '#3A6B6B', category: 'vocab', difficulty: 'beginner', timeEstimate: '6-10 min', lastUpdated: new Date().toISOString(), content: { sentences: [] } },
  ]);

  // Words state loaded from Firestore
  const [words, setWords] = useState([]);
  const [wordsLoading, setWordsLoading] = useState(true);

  // ─── Fetch words from Firestore on mount ─────────────────────────────────────
  useEffect(() => {
    const fetchWords = async () => {
      setWordsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'words'));
        const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setWords(fetched);
      } catch (err) {
        console.error('Error fetching words from Firestore:', err);
      } finally {
        setWordsLoading(false);
      }
    };
    fetchWords();
  }, []);

  // ─── Simulated students ───────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStudents([
        { id: 'student1', name: 'John Smith',    email: 'john.smith@example.com', avgScore: 85, gamesPlayed: 24, joinDate: '2024-01-15', lastActive: new Date().toISOString(), progress: { wordsLearned: 45, streak: 7,  level: 5 } },
        { id: 'student2', name: 'Emma Wilson',   email: 'emma.w@example.com',     avgScore: 92, gamesPlayed: 31, joinDate: '2024-01-20', lastActive: new Date().toISOString(), progress: { wordsLearned: 52, streak: 12, level: 6 } },
        { id: 'student3', name: 'Michael Chen',  email: 'michael.c@example.com',  avgScore: 78, gamesPlayed: 18, joinDate: '2024-02-01', lastActive: new Date().toISOString(), progress: { wordsLearned: 32, streak: 4,  level: 3 } },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  // ============================================================
  //  SHARED STYLES
  // ============================================================
  const inputStyle    = { width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', fontFamily: "'Poppins', sans-serif", outline: 'none' };
  const labelStyle    = { fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#475569' };
  const btnPrimary    = { flex: 1, padding: '12px', background: '#5c6ac4', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" };
  const btnSecondary  = { flex: 1, padding: '12px', background: '#f8fafc', color: '#7c8b9c', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" };

  const ModalWrapper = ({ children }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', maxWidth: '480px', width: '90%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', fontFamily: "'Poppins', sans-serif" }}>
        {children}
      </div>
    </div>
  );

  // ============================================================
  //  OVERVIEW
  // ============================================================
  const Overview = () => {
    const totalPlayed = games.reduce((a, g) => a + (g.timesPlayed || 0), 0);
    const avgScore    = students.length ? Math.round(students.reduce((a, s) => a + (s.avgScore || 0), 0) / students.length) : 0;

    const stats = [
      { label: 'Total Students', value: String(students.length), icon: '▣', color: '#7c6fd6', bg: '#f0edff', change: '+3 this month' },
      { label: 'Active Words',   value: String(words.length),    icon: '☰', color: '#2E7D32', bg: '#e8f5e9', change: `${words.length} total` },
      { label: 'Total Games',    value: String(games.length),    icon: '◉', color: '#B85C1A', bg: '#fff4e5', change: '6 active' },
      { label: 'Avg Score',      value: avgScore + '%',          icon: '▦', color: '#7c6fd6', bg: '#f0edff', change: 'Class average' },
    ];

    return (
      <div>
        <div style={{ marginBottom: '32px', borderBottom: '1px solid #eaeef2', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1a2634', marginBottom: '6px', fontFamily: "'Poppins', sans-serif" }}>Admin Overview</h1>
          <p style={{ fontSize: '15px', color: '#6b7a8d', margin: 0, fontWeight: '300' }}>Monitor your vocabulary learning platform</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px', marginBottom: '32px' }}>
          {stats.map((s, i) => (
            <div key={i}
              style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e6eaf0', transition: 'all .3s ease', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e6eaf0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: s.color }}>{s.icon}</div>
                <span style={{ fontSize: '11px', color: '#7c8b9c', background: '#f8fafc', padding: '4px 10px', borderRadius: '100px', border: '1px solid #e2e8f0' }}>{s.change}</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a2634', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '14px', color: '#6b7a8d' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e6eaf0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a2634', marginBottom: '20px' }}>Recent Activity</h3>
            {students.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {students.slice(0, 3).map((st, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c6fd6,#9b8de8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '14px', flexShrink: 0 }}>{st.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a2634' }}>{st.name} joined</div>
                      <div style={{ fontSize: '12px', color: '#7c8b9c' }}>{st.joinDate}</div>
                    </div>
                    <span style={{ fontSize: '11px', background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '100px', fontWeight: '600' }}>New</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: '#7c8b9c' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👋</div>
                <div style={{ fontSize: '14px' }}>No recent activity</div>
              </div>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e6eaf0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a2634', marginBottom: '20px' }}>Platform Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Easy Words',   value: words.filter(w => w.difficulty === 'Easy').length,   color: '#2e7d32', bg: '#e8f5e9' },
                { label: 'Medium Words', value: words.filter(w => w.difficulty === 'Medium').length, color: '#b85c1a', bg: '#fff4e5' },
                { label: 'Hard Words',   value: words.filter(w => w.difficulty === 'Hard').length,   color: '#a93226', bg: '#ffebee' },
                { label: 'Total Plays',  value: totalPlayed,                                          color: '#5c6ac4', bg: '#f0edff' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px', background: item.bg, borderRadius: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: '12px', color: item.color, fontWeight: '500', marginTop: '4px' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: students.length > 0 ? '24px' : '64px 32px', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', border: '1px solid #e6eaf0' }}>
          {students.length === 0 && <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>}
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a2634', marginBottom: '8px' }}>
            {students.length > 0 ? `${students.length} Active Student${students.length > 1 ? 's' : ''}` : 'No Students Yet'}
          </h3>
          <p style={{ fontSize: '14px', color: '#7c8b9c' }}>
            {students.length > 0 ? 'Students are actively learning vocabulary. Check the Students tab for detailed progress.' : 'No students have signed up yet. Students will appear here once they create an account and log in.'}
          </p>
          {students.length > 0 && (
            <button onClick={() => setActiveMenu('Students')} style={{ marginTop: '20px', padding: '10px 24px', background: '#5c6ac4', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '14px', cursor: 'pointer' }}>
              View All Students
            </button>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  //  STUDENTS
  // ============================================================
  const StudentsList = () => {
    const [searchTerm, setSearchTerm]       = useState('');
    const [selectedStudent, setSelected]    = useState(null);
    const [isEditing, setIsEditing]         = useState(false);
    const [isAdding, setIsAdding]           = useState(false);
    const [editForm, setEditForm]           = useState({ name: '', email: '' });
    const [newStudent, setNewStudent]       = useState({ name: '', email: '' });

    const filtered = students.filter(s =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addStudent = () => {
      if (!newStudent.name || !newStudent.email) return alert('Fill in all fields.');
      setStudents([...students, { ...newStudent, id: `student${Date.now()}`, avgScore: 0, gamesPlayed: 0, joinDate: new Date().toISOString().split('T')[0], lastActive: new Date().toISOString(), progress: { wordsLearned: 0, streak: 0, level: 1 } }]);
      setIsAdding(false);
      setNewStudent({ name: '', email: '' });
    };

    const updateStudent = () => {
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...editForm } : s));
      setIsEditing(false);
      setSelected(null);
    };

    const deleteStudent = (id) => {
      if (window.confirm('Remove this student?')) setStudents(students.filter(s => s.id !== id));
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid #eaeef2', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1a2634', marginBottom: '6px', fontFamily: "'Poppins', sans-serif" }}>Student Management</h1>
            <p style={{ fontSize: '15px', color: '#6b7a8d', margin: 0, fontWeight: '300' }}>Manage and monitor student accounts</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#7c8b9c', background: '#f8fafc', padding: '8px 16px', borderRadius: '90px', border: '1px solid #e2e8f0' }}>Total: {students.length} Students</span>
            <button onClick={() => setIsAdding(true)} style={{ padding: '10px 20px', background: '#5c6ac4', color: '#fff', border: 'none', borderRadius: '90px', fontSize: '14px', cursor: 'pointer' }}>+ Add Student</button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e6eaf0', borderRadius: '12px', padding: '4px 4px 4px 16px', marginBottom: '24px', maxWidth: '400px' }}>
          <span style={{ color: '#7c8b9c', marginRight: '8px' }}>🔍</span>
          <input type="text" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '12px 0', border: 'none', background: 'transparent', fontSize: '14px', outline: 'none', fontFamily: "'Poppins', sans-serif" }} />
          {searchTerm && <button onClick={() => setSearchTerm('')} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>✕</button>}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7c8b9c' }}>⏳ Loading Students...</div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '20px', border: '1px solid #e6eaf0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍🎓</div>
            <h3 style={{ fontSize: '20px', color: '#1a2634', marginBottom: '8px' }}>No Students Yet</h3>
            <button onClick={() => setIsAdding(true)} style={{ padding: '12px 28px', background: '#5c6ac4', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '14px', cursor: 'pointer' }}>Add First Student</button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #e6eaf0' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Poppins', sans-serif", minWidth: '900px' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    {['Student','Email','Avg Score','Games','Words','Streak','Join Date','Actions'].map(h => (
                      <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(student => (
                    <tr key={student.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'all .2s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c6fd6,#9b8de8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '14px', flexShrink: 0 }}>{student.name.charAt(0)}</div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a2634' }}>{student.name}</div>
                            <div style={{ fontSize: '12px', color: '#7c8b9c' }}>Level {student.progress?.level || 1}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#475569' }}>{student.email}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: student.avgScore >= 80 ? '#2e7d32' : '#ed6c02' }}>{student.avgScore}%</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#475569' }}>{student.gamesPlayed}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#475569' }}>{student.progress?.wordsLearned || 0}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: student.progress?.streak > 0 ? '#2e7d32' : '#64748b' }}>🔥 {student.progress?.streak || 0}</td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b' }}>{student.joinDate}</td>
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <button onClick={() => { setSelected(student); setEditForm({ name: student.name, email: student.email }); setIsEditing(true); }} style={{ padding: '6px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '12px', cursor: 'pointer', marginRight: '8px', color: '#475569' }}>Edit</button>
                        <button onClick={() => { setSelected(student); }} style={{ padding: '6px 14px', background: '#e8f5e9', border: 'none', borderRadius: '100px', fontSize: '12px', cursor: 'pointer', marginRight: '8px', color: '#2e7d32' }}>Progress</button>
                        <button onClick={() => deleteStudent(student.id)} style={{ padding: '6px 14px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isAdding && (
          <ModalWrapper>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1a2634' }}>Add New Student</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} placeholder="e.g., John Smith" style={inputStyle} autoFocus />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Email Address *</label>
              <input type="email" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} placeholder="student@example.com" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setIsAdding(false)} style={btnSecondary}>Cancel</button>
              <button onClick={addStudent} style={btnPrimary}>Add Student</button>
            </div>
          </ModalWrapper>
        )}

        {isEditing && (
          <ModalWrapper>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1a2634' }}>Edit Student</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Name</label>
              <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setIsEditing(false)} style={btnSecondary}>Cancel</button>
              <button onClick={updateStudent} style={btnPrimary}>Save Changes</button>
            </div>
          </ModalWrapper>
        )}

        {selectedStudent && !isEditing && (
          <ModalWrapper>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c6fd6,#9b8de8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '24px', margin: '0 auto 12px' }}>{selectedStudent.name.charAt(0)}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a2634', marginBottom: '4px' }}>{selectedStudent.name}</h3>
              <p style={{ fontSize: '14px', color: '#7c8b9c', margin: 0 }}>{selectedStudent.email}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Level',        value: selectedStudent.progress?.level || 1 },
                { label: 'Words Learned',value: selectedStudent.progress?.wordsLearned || 0 },
                { label: 'Games Played', value: selectedStudent.gamesPlayed },
                { label: 'Streak',       value: `${selectedStudent.progress?.streak || 0} 🔥` },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px', background: '#f8fafc', borderRadius: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a2634' }}>{item.value}</div>
                  <div style={{ fontSize: '12px', color: '#7c8b9c', marginTop: '4px' }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setIsEditing(true); setEditForm({ name: selectedStudent.name, email: selectedStudent.email }); }} style={btnSecondary}>Edit Profile</button>
              <button onClick={() => setSelected(null)} style={btnPrimary}>Close</button>
            </div>
          </ModalWrapper>
        )}
      </div>
    );
  };

  // ============================================================
  //  GAMES
  // ============================================================
  const GameManagement = () => {
    const [editingGame, setEditingGame] = useState(null);
    const [isAdding, setIsAdding]       = useState(false);
    const [editForm, setEditForm]       = useState({ description: '', totalItems: 0, category: 'vocab', difficulty: 'beginner', timeEstimate: '5-10 min' });
    const [newGame, setNewGame]         = useState({ name: '', icon: '🎮', description: '', totalWords: 0, totalPairs: 0, totalStories: 0, totalQuestions: 0, totalSentences: 0, category: 'vocab', difficulty: 'beginner', timeEstimate: '5-10 min' });

    const catColor = c => ({ vocab: '#5E4B8C', reading: '#2F5D62', challenge: '#B83B5E' }[c] || '#5E4B8C');
    const catBg    = c => ({ vocab: '#F3F1F9', reading: '#EEF3F3', challenge: '#FDF1F4' }[c] || '#F3F1F9');
    const getStats = g => {
      if (g.name === 'Flashcards')      return `${g.totalWords} words`;
      if (g.name === 'Match Game')       return `${g.totalPairs} pairs`;
      if (g.name === 'Short Story')      return `${g.totalStories} stories`;
      if (g.name === 'Quiz')             return `${g.totalQuestions} questions`;
      if (g.name === 'GuessWhat')        return `${g.totalQuestions} questions`;
      if (g.name === 'Sentence Builder') return `${g.totalSentences} sentences`;
      return '0 items';
    };

    const updateGame = () => {
      setGames(games.map(g => {
        if (g.id !== editingGame) return g;
        const n = parseInt(editForm.totalItems) || 0;
        const u = { ...g, description: editForm.description, category: editForm.category, difficulty: editForm.difficulty, timeEstimate: editForm.timeEstimate, color: catColor(editForm.category), iconBg: catBg(editForm.category), accentColor: catColor(editForm.category), lastUpdated: new Date().toISOString() };
        if (g.name === 'Flashcards')      u.totalWords     = n;
        if (g.name === 'Match Game')       u.totalPairs     = n;
        if (g.name === 'Short Story')      u.totalStories   = n;
        if (g.name === 'Quiz')             u.totalQuestions = n;
        if (g.name === 'GuessWhat')        u.totalQuestions = n;
        if (g.name === 'Sentence Builder') u.totalSentences = n;
        return u;
      }));
      setEditingGame(null);
    };

    const addGame = () => {
      if (!newGame.name || !newGame.description) return alert('Fill in required fields.');
      const color = catColor(newGame.category);
      setGames([...games, { id: Date.now(), ...newGame, timesPlayed: 0, avgScore: 0, color, iconBg: catBg(newGame.category), accentColor: color, lastUpdated: new Date().toISOString(), content: {} }]);
      setIsAdding(false);
      setNewGame({ name: '', icon: '🎮', description: '', totalWords: 0, totalPairs: 0, totalStories: 0, totalQuestions: 0, totalSentences: 0, category: 'vocab', difficulty: 'beginner', timeEstimate: '5-10 min' });
    };

    const selectStyle = { width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', fontFamily: "'Poppins', sans-serif" };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid #eaeef2', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1a2634', marginBottom: '6px', fontFamily: "'Poppins', sans-serif" }}>Game Management</h1>
            <p style={{ fontSize: '15px', color: '#6b7a8d', margin: 0, fontWeight: '300' }}>Manage and configure all learning games</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#7c8b9c', background: '#f8fafc', padding: '8px 16px', borderRadius: '90px', border: '1px solid #e2e8f0' }}>Total Games: {games.length}</span>
            <button onClick={() => setIsAdding(true)} style={{ padding: '10px 20px', background: '#5c6ac4', color: '#fff', border: 'none', borderRadius: '90px', fontSize: '14px', cursor: 'pointer' }}>+ Add Game</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '20px' }}>
          {games.map(game => (
            <div key={game.id}
              style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e6eaf0', transition: 'all .3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = game.accentColor + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e6eaf0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: game.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{game.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a2634', margin: 0 }}>{game.name}</h3>
                    <span style={{ fontSize: '11px', background: '#e8f5e9', color: '#2e7d32', padding: '2px 10px', borderRadius: '100px', fontWeight: '600' }}>Active</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#7c8b9c', margin: 0 }}>{game.description}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {[getStats(game), game.difficulty, `⏱️ ${game.timeEstimate}`].map((tag, i) => (
                  <span key={i} style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '100px' }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a2634' }}>{game.timesPlayed}</div>
                  <div style={{ fontSize: '11px', color: '#7c8b9c' }}>Times Played</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: game.avgScore >= 70 ? '#2e7d32' : '#ed6c02' }}>{game.avgScore > 0 ? `${game.avgScore}%` : '—'}</div>
                  <div style={{ fontSize: '11px', color: '#7c8b9c' }}>Avg Score</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#7c8b9c' }}>Updated</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{new Date(game.lastUpdated).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button onClick={() => { setEditingGame(game.id); setEditForm({ description: game.description, totalItems: game.totalWords || game.totalPairs || game.totalStories || game.totalQuestions || game.totalSentences || 0, category: game.category, difficulty: game.difficulty, timeEstimate: game.timeEstimate }); }} style={{ flex: 1, padding: '10px', background: '#5c6ac4', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '14px', cursor: 'pointer' }}>Edit Game</button>
                <button onClick={() => setGames(games.map(g => g.id === game.id ? { ...g, timesPlayed: (g.timesPlayed || 0) + 1 } : g))} style={{ padding: '10px 16px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '14px', cursor: 'pointer' }}>+1</button>
                <button onClick={() => { if (window.confirm('Delete this game?')) setGames(games.filter(g => g.id !== game.id)); }} style={{ padding: '10px 16px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', borderRadius: '100px', fontSize: '14px', cursor: 'pointer' }}>Delete</button>
              </div>
              <button onClick={() => { if (window.confirm('Reset stats?')) setGames(games.map(g => g.id === game.id ? { ...g, timesPlayed: 0, avgScore: 0 } : g)); }} style={{ width: '100%', padding: '8px', background: 'transparent', color: '#7c8b9c', border: '1px dashed #e2e8f0', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }}>Reset Stats</button>
            </div>
          ))}
        </div>

        {editingGame && (
          <ModalWrapper>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1a2634' }}>Edit Game Settings</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Description</label>
              <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows="3" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Category</label>
              <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={selectStyle}>
                {[['vocab','Vocabulary'],['reading','Reading'],['challenge','Challenge']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Difficulty</label>
              <select value={editForm.difficulty} onChange={e => setEditForm({ ...editForm, difficulty: e.target.value })} style={selectStyle}>
                {[['beginner','Beginner'],['intermediate','Intermediate'],['advanced','Advanced']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Time Estimate</label>
              <input type="text" value={editForm.timeEstimate} onChange={e => setEditForm({ ...editForm, timeEstimate: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Total Items</label>
              <input type="number" value={editForm.totalItems} onChange={e => setEditForm({ ...editForm, totalItems: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setEditingGame(null)} style={btnSecondary}>Cancel</button>
              <button onClick={updateGame} style={btnPrimary}>Save Changes</button>
            </div>
          </ModalWrapper>
        )}

        {isAdding && (
          <ModalWrapper>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1a2634' }}>Add New Game</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Game Name *</label>
              <input type="text" value={newGame.name} onChange={e => setNewGame({ ...newGame, name: e.target.value })} placeholder="e.g., Vocabulary Race" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Description *</label>
              <textarea value={newGame.description} onChange={e => setNewGame({ ...newGame, description: e.target.value })} rows="3" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Icon</label>
              <select value={newGame.icon} onChange={e => setNewGame({ ...newGame, icon: e.target.value })} style={selectStyle}>
                {[['🎮','Game'],['📇','Flashcards'],['🎯','Match'],['📖','Story'],['❓','Quiz'],['🤔','GuessWhat'],['📝','Sentence Builder']].map(([v,l]) => <option key={v} value={v}>{v} {l}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={newGame.category} onChange={e => setNewGame({ ...newGame, category: e.target.value })} style={selectStyle}>
                  {[['vocab','Vocabulary'],['reading','Reading'],['challenge','Challenge']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Difficulty</label>
                <select value={newGame.difficulty} onChange={e => setNewGame({ ...newGame, difficulty: e.target.value })} style={selectStyle}>
                  {[['beginner','Beginner'],['intermediate','Intermediate'],['advanced','Advanced']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Time Estimate</label>
              <input type="text" value={newGame.timeEstimate} onChange={e => setNewGame({ ...newGame, timeEstimate: e.target.value })} placeholder="e.g., 5-10 min" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setIsAdding(false)} style={btnSecondary}>Cancel</button>
              <button onClick={addGame} style={btnPrimary}>Add Game</button>
            </div>
          </ModalWrapper>
        )}
      </div>
    );
  };

  // ============================================================
  //  WORDS  ── Full Firestore CRUD
  // ============================================================
  const WordManagement = () => {
    const [showModal, setShowModal]     = useState(false);
    const [editingId, setEditingId]     = useState(null); // Firestore doc ID or null for add
    const [searchTerm, setSearchTerm]   = useState('');
    const [filterDiff, setFilterDiff]   = useState('all');
    const [saving, setSaving]           = useState(false);
    const [form, setForm]               = useState({ word: '', pronunciation: '', definition: '', example: '', difficulty: 'Easy' });

    const diffColor = d => ({ Easy: '#4CAF50', Medium: '#FF9800', Hard: '#F44336' }[d] || '#7c8b9c');
    const diffBg    = d => ({ Easy: '#e8f5e9', Medium: '#fff4e5', Hard: '#ffebee' }[d] || '#f1f5f9');

    const filtered = words.filter(w => {
      const s = w.word?.toLowerCase().includes(searchTerm.toLowerCase()) || w.definition?.toLowerCase().includes(searchTerm.toLowerCase());
      const d = filterDiff === 'all' || w.difficulty === filterDiff;
      return s && d;
    });

    const stats = {
      easy:   words.filter(w => w.difficulty === 'Easy').length,
      medium: words.filter(w => w.difficulty === 'Medium').length,
      hard:   words.filter(w => w.difficulty === 'Hard').length,
      total:  words.reduce((a, w) => a + (w.timesStudied || 0), 0),
    };

    const openAdd = () => {
      setEditingId(null);
      setForm({ word: '', pronunciation: '', definition: '', example: '', difficulty: 'Easy' });
      setShowModal(true);
    };

    const openEdit = (w) => {
      setEditingId(w.id);
      setForm({ word: w.word, pronunciation: w.pronunciation || '', definition: w.definition, example: w.example || '', difficulty: w.difficulty });
      setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingId(null); };

    // ── ADD to Firestore ─────────────────────────────────────────────────────
    const handleAdd = async () => {
      if (!form.word.trim() || !form.definition.trim()) return alert('Word and definition are required.');
      setSaving(true);
      try {
        const payload = {
          word: form.word.trim(),
          pronunciation: form.pronunciation.trim(),
          definition: form.definition.trim(),
          example: form.example.trim(),
          difficulty: form.difficulty,
          timesStudied: 0,
          color: diffColor(form.difficulty),
          dateAdded: new Date().toISOString(),
          lastReviewed: null,
          categories: [{ Easy: 'beginner', Medium: 'intermediate', Hard: 'advanced' }[form.difficulty]],
        };
        const ref = await addDoc(collection(db, 'words'), payload);
        setWords(prev => [...prev, { id: ref.id, ...payload }]);
        closeModal();
      } catch (err) {
        alert('Firestore error: ' + err.message);
      } finally {
        setSaving(false);
      }
    };

    // ── UPDATE in Firestore ──────────────────────────────────────────────────
    const handleUpdate = async () => {
      if (!form.word.trim() || !form.definition.trim()) return alert('Word and definition are required.');
      setSaving(true);
      try {
        const payload = {
          word: form.word.trim(),
          pronunciation: form.pronunciation.trim(),
          definition: form.definition.trim(),
          example: form.example.trim(),
          difficulty: form.difficulty,
          color: diffColor(form.difficulty),
          lastReviewed: new Date().toISOString(),
        };
        await updateDoc(doc(db, 'words', editingId), payload);
        setWords(prev => prev.map(w => w.id === editingId ? { ...w, ...payload } : w));
        closeModal();
      } catch (err) {
        alert('Firestore error: ' + err.message);
      } finally {
        setSaving(false);
      }
    };

    // ── DELETE from Firestore ────────────────────────────────────────────────
    const handleDelete = async (id) => {
      if (!window.confirm('Delete this word? This cannot be undone.')) return;
      try {
        await deleteDoc(doc(db, 'words', id));
        setWords(prev => prev.filter(w => w.id !== id));
      } catch (err) {
        alert('Firestore error: ' + err.message);
      }
    };

    // ── INCREMENT timesStudied ────────────────────────────────────────────────
    const handleIncrement = async (id) => {
      const word = words.find(w => w.id === id);
      const newCount = (word.timesStudied || 0) + 1;
      const now = new Date().toISOString();
      try {
        await updateDoc(doc(db, 'words', id), { timesStudied: newCount, lastReviewed: now });
        setWords(prev => prev.map(w => w.id === id ? { ...w, timesStudied: newCount, lastReviewed: now } : w));
      } catch (err) {
        alert('Firestore error: ' + err.message);
      }
    };

    return (
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid #eaeef2', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1a2634', marginBottom: '6px', fontFamily: "'Poppins', sans-serif" }}>Word Library</h1>
            <p style={{ fontSize: '15px', color: '#6b7a8d', margin: 0, fontWeight: '300' }}>Manage vocabulary words across all games</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#7c8b9c', background: '#f8fafc', padding: '8px 16px', borderRadius: '90px', border: '1px solid #e2e8f0' }}>Total: {words.length} Words</span>
            <button onClick={openAdd} style={{ padding: '10px 20px', background: '#5c6ac4', color: '#fff', border: 'none', borderRadius: '90px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(92,106,196,0.2)', fontFamily: "'Poppins', sans-serif" }}>
              + Add New Word
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', padding: '16px', background: '#fff', borderRadius: '16px', border: '1px solid #e6eaf0', flexWrap: 'wrap' }}>
          {[
            { label: 'Easy:',   val: stats.easy,   color: '#2e7d32', bg: '#e8f5e9' },
            { label: 'Medium:', val: stats.medium,  color: '#b85c1a', bg: '#fff4e5' },
            { label: 'Hard:',   val: stats.hard,    color: '#b71c1c', bg: '#ffebee' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: s.bg, borderRadius: '100px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: s.color }}>{s.label}</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: s.color }}>{s.val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f1f5f9', borderRadius: '100px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Total Studies:</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a2634' }}>{stats.total}</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e6eaf0', borderRadius: '12px', padding: '4px 4px 4px 16px', flex: 1, maxWidth: '400px' }}>
            <span style={{ color: '#7c8b9c', marginRight: '8px' }}>🔍</span>
            <input type="text" placeholder="Search words..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '12px 0', border: 'none', background: 'transparent', fontSize: '15px', outline: 'none', fontFamily: "'Poppins', sans-serif" }} />
          </div>
          <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} style={{ padding: '12px 24px', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '13px', background: '#fff', color: '#1a2634', cursor: 'pointer', outline: 'none', fontFamily: "'Poppins', sans-serif" }}>
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <span style={{ fontSize: '13px', color: '#7c8b9c', background: '#f8fafc', padding: '8px 16px', borderRadius: '100px', border: '1px solid #e2e8f0' }}>{filtered.length} of {words.length} shown</span>
        </div>

        {/* Table / Empty States */}
        {wordsLoading ? (
          <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '20px', border: '1px solid #e6eaf0' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <div style={{ fontSize: '16px', color: '#7c8b9c' }}>Loading words from Firestore...</div>
          </div>
        ) : words.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '20px', border: '1px solid #e6eaf0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '20px', color: '#1a2634', marginBottom: '8px' }}>No Words Yet</h3>
            <p style={{ fontSize: '14px', color: '#7c8b9c', marginBottom: '24px' }}>Add your first vocabulary word to get started.</p>
            <button onClick={openAdd} style={{ padding: '12px 28px', background: '#5c6ac4', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '14px', cursor: 'pointer' }}>Add First Word</button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #e6eaf0' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Poppins', sans-serif", minWidth: '1100px' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    {['Word','Pronunciation','Definition','Example','Difficulty','Times Studied','Last Reviewed','Actions'].map(h => (
                      <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#7c8b9c' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(word => (
                    <tr key={word.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'all .2s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                      <td style={{ padding: '16px 20px', fontSize: '15px', fontWeight: '600', color: '#1a2634' }}>{word.word}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7a8d', fontStyle: 'italic' }}>{word.pronunciation}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', maxWidth: '240px', lineHeight: '1.5' }}>{word.definition}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#7c8b9c', fontStyle: 'italic', maxWidth: '240px' }}>"{word.example}"</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', background: diffBg(word.difficulty), color: diffColor(word.difficulty) }}>{word.difficulty}</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a2634' }}>{word.timesStudied || 0}</span>
                          <button onClick={() => handleIncrement(word.id)} style={{ padding: '4px 10px', background: '#e8f5e9', border: 'none', borderRadius: '6px', fontSize: '11px', color: '#2e7d32', cursor: 'pointer' }}>+1</button>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b' }}>{word.lastReviewed ? new Date(word.lastReviewed).toLocaleDateString() : 'Never'}</td>
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <button onClick={() => openEdit(word)} style={{ padding: '6px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '12px', cursor: 'pointer', marginRight: '8px', color: '#475569' }}>Edit</button>
                        <button onClick={() => handleDelete(word.id)} style={{ padding: '6px 16px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add / Edit Modal */}
        {showModal && (
          <ModalWrapper>
            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: '#1a2634' }}>{editingId ? 'Edit Word' : 'Add New Word'}</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Word *</label>
              <input type="text" placeholder="Enter word" value={form.word} onChange={e => setForm({ ...form, word: e.target.value })} style={inputStyle} autoFocus />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Pronunciation</label>
              <input type="text" placeholder="e.g., /ˈhæp.i/" value={form.pronunciation} onChange={e => setForm({ ...form, pronunciation: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Definition *</label>
              <textarea placeholder="Enter definition" rows="3" value={form.definition} onChange={e => setForm({ ...form, definition: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Example Sentence</label>
              <textarea placeholder="Enter example sentence" rows="2" value={form.example} onChange={e => setForm({ ...form, example: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={closeModal} style={btnSecondary}>Cancel</button>
              <button onClick={editingId ? handleUpdate : handleAdd} disabled={saving}
                style={{ ...btnPrimary, background: saving ? '#a5b4fc' : '#5c6ac4', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : editingId ? 'Update Word' : 'Add Word'}
              </button>
            </div>
          </ModalWrapper>
        )}
      </div>
    );
  };

  // ============================================================
  //  MAIN RENDER
  // ============================================================
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #f5f5f7; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f7', fontFamily: "'Poppins', sans-serif" }}>

        {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
        <div style={{ width: '260px', background: 'linear-gradient(180deg,#8b7dd6 0%,#7c6fd6 50%,#6b5ec5 100%)', color: '#fff', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', left: 0, top: 0, boxShadow: '4px 0 20px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <div style={{ padding: '30px 25px', fontSize: '27px', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.1)', letterSpacing: '-0.5px', background: 'rgba(255,255,255,0.05)' }}>
            Admin Panel
          </div>

          <nav style={{ flex: 1, padding: '25px 0' }}>
            {[
              { name: 'Overview', icon: '▣' },
              { name: 'Students', icon: '☰' },
              { name: 'Games',    icon: '◉' },
              { name: 'Words',    icon: '▦' },
              { name: 'Leaderboards', icon: '🏆' },
            ].map(item => (
              <div key={item.name} onClick={() => setActiveMenu(item.name)}
                style={{ padding: '14px 25px', margin: '5px 15px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: activeMenu === item.name ? '600' : '500', color: '#fff', background: activeMenu === item.name ? 'linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.15))' : 'transparent', borderRadius: '12px', transition: 'all .3s ease', boxShadow: activeMenu === item.name ? '0 4px 12px rgba(0,0,0,0.15)' : 'none' }}
                onMouseOver={e => { if (activeMenu !== item.name) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateX(5px)'; } }}
                onMouseOut={e => { if (activeMenu !== item.name) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; } }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </nav>

          <div style={{ padding: '20px 15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div onClick={handleLogout}
              style={{ padding: '14px 25px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', fontSize: '16px', color: '#fff', borderRadius: '12px', transition: 'all .3s ease' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: '20px' }}>🚪</span>
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* ── Main Content ─────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, marginLeft: '260px', padding: '30px 40px', overflowY: 'auto' }}>

          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px', position: 'relative' }}>
            <div style={{ background: '#fff', padding: '10px 20px', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 12px rgba(124,111,214,0.15)', border: '2px solid #f0f0f0', cursor: 'pointer', transition: 'all .3s ease' }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,111,214,0.25)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,111,214,0.15)'; }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c6fd6,#9b8de8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👨‍🏫</div>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>Admin</span>
              <span style={{ fontSize: '12px', color: '#999' }}>▼</span>
            </div>

            {showProfileMenu && (
              <div style={{ position: 'absolute', top: '55px', right: 0, background: '#fff', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 1000, minWidth: '200px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                <div style={{ padding: '14px 18px', fontSize: '13px', color: '#999', borderBottom: '1px solid #f5f5f5' }}>Logged in as</div>
                <div style={{ padding: '14px 18px', fontSize: '15px', fontWeight: '600', color: '#1a1a1a', borderBottom: '1px solid #f5f5f5', background: 'linear-gradient(135deg,#f8f7ff,#fff)' }}>Admin</div>
                <button onClick={handleLogout} style={{ width: '100%', padding: '14px 18px', border: 'none', background: 'none', fontSize: '15px', fontWeight: '600', color: '#ff6b6b', cursor: 'pointer', textAlign: 'left', fontFamily: "'Poppins', sans-serif" }}
                  onMouseOver={e => e.currentTarget.style.background = '#fff5f5'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Views */}
          {activeMenu === 'Overview'  && <Overview />}
          {activeMenu === 'Students'  && <StudentsList />}
          {activeMenu === 'Games'     && <GameManagement />}
          {activeMenu === 'Words'     && <WordManagement />}
          {activeMenu === 'Leaderboards' && <Leaderboards onBack={() => setActiveMenu('Overview')} isAdmin={true} />}

        </div>
      </div>
    </>
  );
};  

export default AdminDashboard;