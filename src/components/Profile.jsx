import React, { useState, useEffect } from 'react';
import { auth, db } from '../pages/firebase'; // Remove storage
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const Profile = ({ onBack }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    avatar: '/avatars/avatar1.png',
    email: '',
    phone: '',
    location: '',
    website: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    settings: {
      emailNotifications: true,
      darkMode: false,
      language: 'en'
    }
  });

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Avatar options - images!
  const avatarOptions = [
    'src/image/a1.png', 'src/image/A2.png', 'src/image/A3.png', 'src/image/A4.png', 'src/image/A5.png',
    'src/image/A6.png', 'src/image/A7.png', 'src/image/A8.png', 'src/image/A9.png', 'src/image/A10.png',
    'src/image/A11.png', 'src/image/A12.png', 'src/image/A13.png', 'src/image/A14.png', 'src/image/15.png',
    'src/image/A16.png', 'src/image/A17.png', 'src/image/A18.png', 'src/image/A19.png', 'src/image/A20.png',
    'src/image/A21.png', 'src/image/A22.png', 'src/image/A23.png', 'src/image/A24.png', 'src/image/A25.png',
    'src/image/A26.png', 'src/image/A27.png', 'src/image/A28.png', 'src/image/A29.png', 'src/image/A30.png',
    'src/image/A31.png', 'src/image/A32.png'
  ];

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage({ type: 'error', text: 'No user logged in' });
        return;
      }

      // Get from localStorage first for speed
      const localProfile = localStorage.getItem('userProfile');
      if (localProfile) {
        const parsed = JSON.parse(localProfile);
        setUserProfile(parsed);
        setFormData({
          displayName: parsed.displayName || '',
          username: parsed.username || '',
          bio: parsed.bio || '',
          avatar: parsed.avatar || '/avatars/avatar1.png',
          email: parsed.email || user.email || '',
          phone: parsed.phone || '',
          location: parsed.location || '',
          website: parsed.website || '',
          socialLinks: parsed.socialLinks || { twitter: '', instagram: '', linkedin: '' },
          settings: parsed.settings || { emailNotifications: true, darkMode: false, language: 'en' }
        });
      }

      // Then get from Firestore for latest data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        const updatedProfile = {
          ...firestoreData,
          uid: user.uid,
          email: user.email
        };
        
        setUserProfile(updatedProfile);
        setFormData({
          displayName: firestoreData.displayName || '',
          username: firestoreData.username || '',
          bio: firestoreData.bio || '',
          avatar: firestoreData.avatar || '/avatars/avatar1.png',
          email: user.email || '',
          phone: firestoreData.phone || '',
          location: firestoreData.location || '',
          website: firestoreData.website || '',
          socialLinks: firestoreData.socialLinks || { twitter: '', instagram: '', linkedin: '' },
          settings: firestoreData.settings || { emailNotifications: true, darkMode: false, language: 'en' }
        });

        // Update localStorage
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSettingChange = (setting, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value
      }
    }));
  };

  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({
      ...prev,
      avatar
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updatePasswordHandler = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser;
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, passwordData.newPassword);
      
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setShowPasswordChange(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Current password is incorrect' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update password' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Prepare profile data
      const profileData = {
        displayName: formData.displayName,
        username: formData.username,
        bio: formData.bio,
        avatar: formData.avatar, // This will be an image path
        phone: formData.phone,
        location: formData.location,
        website: formData.website,
        socialLinks: formData.socialLinks,
        settings: formData.settings,
        updatedAt: new Date().toISOString()
      };

      // Update in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, profileData);

      // Get current progress data
      const savedProgress = localStorage.getItem('vocaboplay_progress');
      const progress = savedProgress ? JSON.parse(savedProgress) : {};

      // Update localStorage
      const updatedProfile = {
        ...userProfile,
        ...profileData,
        email: user.email,
        wordsLearned: progress.wordsLearned || 0,
        gamesPlayed: progress.gamesPlayed || 0,
        streak: progress.streak || 0,
        totalPoints: progress.totalPoints || 0,
        level: progress.level || 1
      };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

      // Update sessionStorage if exists
      const sessionProfile = sessionStorage.getItem('userProfile');
      if (sessionProfile) {
        sessionStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      }

      // Dispatch update event
      const event = new CustomEvent('profileUpdated', { detail: updatedProfile });
      window.dispatchEvent(event);

      setUserProfile(updatedProfile);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back
        </button>
        <h1 style={styles.title}>My Profile</h1>
        {!editMode ? (
          <button onClick={() => setEditMode(true)} style={styles.editButton}>
            Edit Profile
          </button>
        ) : (
          <div style={styles.editActions}>
            <button 
              onClick={() => setEditMode(false)} 
              style={styles.cancelButton}
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveProfile} 
              style={styles.saveButton}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === 'success' ? '#e8f5e9' : '#fee',
          color: message.type === 'success' ? '#2e7d32' : '#c33',
          borderColor: message.type === 'success' ? '#a5d6a7' : '#fcc',
        }}>
          {message.text}
        </div>
      )}

      {/* Profile Content */}
      <div style={styles.content}>
        {/* Avatar Section - Images */}
        <div style={styles.avatarSection}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatarWrapper}>
              <img 
                src={formData.avatar}
                alt="Profile Avatar"
                style={styles.avatar}
                onError={(e) => {
                  e.target.src = '/avatars/avatar1.png'; // Fallback
                }}
              />
            </div>
          </div>

          {editMode && (
            <div style={styles.avatarOptions}>
              <p style={styles.avatarOptionsTitle}>Choose your avatar:</p>
              <div style={styles.avatarGrid}>
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(avatar)}
                    style={{
                      ...styles.avatarOption,
                      border: formData.avatar === avatar ? '2px solid #7c6fd6' : '2px solid transparent',
                    }}
                  >
                    <img 
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.src = '/avatars/avatar1.png'; // Fallback
                      }}
                    />
                  </button>
                ))}
              </div>
              <p style={styles.avatarNote}>
                Click an image to set as your avatar
              </p>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div style={styles.infoSection}>
          {/* Basic Info */}
          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Basic Information</h2>
            
            <div style={styles.infoRow}>
              <label style={styles.label}>Display Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Your display name"
                />
              ) : (
                <p style={styles.infoValue}>{userProfile?.displayName || 'Not set'}</p>
              )}
            </div>

            <div style={styles.infoRow}>
              <label style={styles.label}>Username</label>
              {editMode ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Your username"
                />
              ) : (
                <p style={styles.infoValue}>@{userProfile?.username || 'Not set'}</p>
              )}
            </div>

            <div style={styles.infoRow}>
              <label style={styles.label}>Email</label>
              <p style={styles.infoValue}>{userProfile?.email}</p>
            </div>

            <div style={styles.infoRow}>
              <label style={styles.label}>Bio</label>
              {editMode ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Tell us about yourself"
                  rows="3"
                />
              ) : (
                <p style={styles.infoValue}>{userProfile?.bio || 'No bio yet'}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Contact Information</h2>

            <div style={styles.infoRow}>
              <label style={styles.label}>Phone</label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Your phone number"
                />
              ) : (
                <p style={styles.infoValue}>{userProfile?.phone || 'Not set'}</p>
              )}
            </div>

            <div style={styles.infoRow}>
              <label style={styles.label}>Location</label>
              {editMode ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="City, Country"
                />
              ) : (
                <p style={styles.infoValue}>{userProfile?.location || 'Not set'}</p>
              )}
            </div>

            <div style={styles.infoRow}>
              <label style={styles.label}>Website</label>
              {editMode ? (
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="https://yourwebsite.com"
                />
              ) : (
                <p style={styles.infoValue}>
                  {userProfile?.website ? (
                    <a href={userProfile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#7c6fd6', textDecoration: 'none' }}>
                      {userProfile.website}
                    </a>
                  ) : 'Not set'}
                </p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Social Links</h2>

            <div style={styles.infoRow}>
              <label style={styles.label}>Twitter</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  style={styles.input}
                  placeholder="@username"
                />
              ) : (
                <p style={styles.infoValue}>{userProfile?.socialLinks?.twitter || 'Not set'}</p>
              )}
            </div>

            <div style={styles.infoRow}>
              <label style={styles.label}>Instagram</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  style={styles.input}
                  placeholder="@username"
                />
              ) : (
                <p style={styles.infoValue}>{userProfile?.socialLinks?.instagram || 'Not set'}</p>
              )}
            </div>

            <div style={styles.infoRow}>
              <label style={styles.label}>LinkedIn</label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  style={styles.input}
                  placeholder="LinkedIn URL"
                />
              ) : (
                <p style={styles.infoValue}>{userProfile?.socialLinks?.linkedin || 'Not set'}</p>
              )}
            </div>
          </div>

          {/* Settings */}
          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Settings</h2>

            <div style={styles.infoRow}>
              <label style={styles.label}>Email Notifications</label>
              {editMode ? (
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    style={styles.checkbox}
                  />
                  Receive email notifications
                </label>
              ) : (
                <p style={styles.infoValue}>
                  {userProfile?.settings?.emailNotifications ? 'Enabled' : 'Disabled'}
                </p>
              )}
            </div>

            <div style={styles.infoRow}>
              <label style={styles.label}>Dark Mode</label>
              {editMode ? (
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.settings.darkMode}
                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    style={styles.checkbox}
                  />
                  Enable dark mode
                </label>
              ) : (
                <p style={styles.infoValue}>
                  {userProfile?.settings?.darkMode ? 'Enabled' : 'Disabled'}
                </p>
              )}
            </div>

            <div style={styles.infoRow}>
              <label style={styles.label}>Language</label>
              {editMode ? (
                <select
                  value={formData.settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  style={styles.select}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                </select>
              ) : (
                <p style={styles.infoValue}>
                  {userProfile?.settings?.language === 'en' ? 'English' :
                   userProfile?.settings?.language === 'es' ? 'Español' :
                   userProfile?.settings?.language === 'fr' ? 'Français' :
                   userProfile?.settings?.language === 'de' ? 'Deutsch' :
                   userProfile?.settings?.language === 'zh' ? '中文' :
                   userProfile?.settings?.language === 'ja' ? '日本語' : 'English'}
                </p>
              )}
            </div>
          </div>

          {/* Password Change */}
          {!editMode && (
            <div style={styles.infoCard}>
              <div style={styles.passwordHeader}>
                <h2 style={styles.sectionTitle}>Password</h2>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  style={styles.changePasswordButton}
                >
                  {showPasswordChange ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {showPasswordChange && (
                <div style={styles.passwordForm}>
                  <div style={styles.infoRow}>
                    <label style={styles.label}>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      style={styles.input}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div style={styles.infoRow}>
                    <label style={styles.label}>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      style={styles.input}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div style={styles.infoRow}>
                    <label style={styles.label}>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      style={styles.input}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button
                    onClick={updatePasswordHandler}
                    style={styles.updatePasswordButton}
                    disabled={saving}
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsSection}>
        <h2 style={styles.sectionTitle}>Account Statistics</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📚</span>
            <span style={styles.statValue}>{userProfile?.wordsLearned || 0}</span>
            <span style={styles.statLabel}>Words Learned</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🎮</span>
            <span style={styles.statValue}>{userProfile?.gamesPlayed || 0}</span>
            <span style={styles.statLabel}>Games Played</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🔥</span>
            <span style={styles.statValue}>{userProfile?.streak || 0}</span>
            <span style={styles.statLabel}>Day Streak</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>⭐</span>
            <span style={styles.statValue}>{userProfile?.totalPoints || 0}</span>
            <span style={styles.statLabel}>Total Points</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: '#8f9aab',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '2px solid #f0f0f0',
    borderTop: '2px solid #7c6fd6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    paddingBottom: '16px',
    borderBottom: '1px solid #eaedf2',
  },
  backButton: {
    background: 'white',
    border: '1px solid #eaedf2',
    padding: '8px 18px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '400',
    color: '#5a6270',
    fontFamily: "'Inter', 'Poppins', sans-serif",
    transition: 'all 0.2s ease',
  },
  title: {
    fontSize: '22px',
    fontWeight: '500',
    color: '#2c3440',
    margin: '0',
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },
  editButton: {
    padding: '8px 22px',
    background: '#7c6fd6',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontSize: '13px',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },
  editActions: {
    display: 'flex',
    gap: '10px',
  },
  cancelButton: {
    padding: '8px 18px',
    background: 'white',
    color: '#5a6270',
    border: '1px solid #eaedf2',
    borderRadius: '30px',
    fontSize: '13px',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },
  saveButton: {
    padding: '8px 22px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontSize: '13px',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },
  message: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid',
    marginBottom: '20px',
    fontSize: '13px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '20px',
    marginBottom: '28px',
  },
  avatarSection: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #eaedf2',
    height: 'fit-content',
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
    boxShadow: '0 4px 12px rgba(124, 111, 214, 0.2)',
  },
  avatarOptions: {
    borderTop: '1px solid #eaedf2',
    paddingTop: '16px',
  },
  avatarOptionsTitle: {
    fontSize: '12px',
    color: '#6f7887',
    marginBottom: '10px',
    fontWeight: '500',
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px',
  },
  avatarOption: {
    aspectRatio: '1',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    background: 'transparent',
  },
  avatarNote: {
    fontSize: '11px',
    color: '#8f9aab',
    marginTop: '14px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #eaedf2',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2c3440',
    margin: '0 0 16px 0',
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },
  infoRow: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '500',
    color: '#6f7887',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  infoValue: {
    fontSize: '14px',
    color: '#2c3440',
    margin: '0',
    padding: '2px 0',
    wordBreak: 'break-word',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #eaedf2',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: "'Inter', 'Poppins', sans-serif",
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #eaedf2',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: "'Inter', 'Poppins', sans-serif",
    resize: 'vertical',
    minHeight: '70px',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #eaedf2',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: "'Inter', 'Poppins', sans-serif",
    backgroundColor: 'white',
    outline: 'none',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#5a6270',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#7c6fd6',
  },
  passwordHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  changePasswordButton: {
    padding: '5px 14px',
    background: 'white',
    color: '#7c6fd6',
    border: '1px solid #7c6fd6',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  passwordForm: {
    marginTop: '14px',
    padding: '14px',
    background: '#f8fafc',
    borderRadius: '10px',
  },
  updatePasswordButton: {
    width: '100%',
    padding: '10px',
    background: '#7c6fd6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
  },
  statsSection: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #eaedf2',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    background: '#faf9ff',
    borderRadius: '12px',
    border: '1px solid #eae8f0',
  },
  statIcon: {
    fontSize: '28px',
    marginBottom: '8px',
    color: '#7c6fd6',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '500',
    color: '#2c3440',
    marginBottom: '2px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#6f7887',
    textAlign: 'center',
  },
};

// Add this CSS animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Profile;