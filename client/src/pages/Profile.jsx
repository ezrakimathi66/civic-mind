import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const { data } = await axios.put('/api/users/profile', payload);
      updateUser(data);
      setMessage('✅ Profile updated successfully!');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <>
      <div className="page-header fade-up fade-up-1">
        <div>
          <h1 className="page-title">⚙️ Profile</h1>
          <p className="page-sub">Manage your account and preferences</p>
        </div>
      </div>

      <div className="profile-layout fade-up fade-up-2">
        <div className="profile-sidebar-card">
          <div className="profile-avatar-big" style={{ background: 'linear-gradient(135deg,#4f46e5,#f97316)' }}>
            {user?.initials || 'U'}
          </div>
          <div className="profile-name">{user?.name}</div>
          <div className="profile-email">{user?.email}</div>
          <div className="profile-stats">
            <div className="pstat">
              <div className="pstat-val">{user?.xp || 0}</div>
              <div className="pstat-label">XP</div>
            </div>
            <div className="pstat">
              <div className="pstat-val">{user?.streak || 0}🔥</div>
              <div className="pstat-label">Streak</div>
            </div>
            <div className="pstat">
              <div className="pstat-val">{user?.badges?.length || 0}</div>
              <div className="pstat-label">Badges</div>
            </div>
          </div>
          <button className="btn-secondary logout-btn" onClick={() => setShowLogoutConfirm(true)}>Sign Out →</button>
        </div>

        <div className="profile-form-card">
          <h2 className="form-section-title">Edit Profile</h2>
          {message && <div className="success-banner">{message}</div>}
          {error && <div className="error-banner">{error}</div>}
          <form onSubmit={handleSave} className="edit-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>New Password <span style={{ fontWeight: 400, opacity: 0.5 }}>(leave blank to keep current)</span></label>
              <input type="password" placeholder="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
<h2 className="form-section-title" style={{ marginTop: 36 }}>⚙️ Settings</h2>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-left">
                <div className="setting-label">{isDark ? '🌙 Night Mode' : '☀️ Light Mode'}</div>
                <div className="setting-desc">Switch between light and dark themes</div>
              </div>
              <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                <span className="toggle-track">
                  <span className={`toggle-thumb ${isDark ? 'active' : ''}`}></span>
                </span>
              </button>
            </div>
          </div>

          
          {user?.badges?.length > 0 && (
            <>
              <h2 className="form-section-title" style={{ marginTop: 36 }}>🏅 Badges</h2>
              <div className="badges-grid">
                {user.badges.map((b, i) => (
                  <div key={i} className="badge-chip">{b}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-content logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Sign Out</h3>
              <button className="modal-close" onClick={() => setShowLogoutConfirm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to sign out? You'll need to log back in to access your account.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              <button className="btn-primary" style={{ background: '#dc2626' }} onClick={handleLogoutConfirm}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
