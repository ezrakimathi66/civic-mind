import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TopBar.css';

export default function TopBar({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() && user?.role !== 'admin') navigate(`/courses?search=${encodeURIComponent(query.trim())}`);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <header className="topbar" onClick={handleMenuClose}>
      <div className="breadcrumb">
        civicmind / <span>{title || 'dashboard'}</span>
      </div>
      <div className="topbar-center">
        {user?.role !== 'admin' && (
          <form className="search-bar" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input id="searchInput" placeholder="Search courses, topics…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
        )}
        {user?.role === 'admin' && (
          <div className="admin-topbar-badge">👑 Admin Mode — Sir Ezra Kimanthi</div>
        )}
      </div>
      <div className="topbar-right">
        {user?.role !== 'admin' && (
          <div className="notif-btn" onClick={() => navigate('/help')} title="Help & Messages" style={{ cursor:'pointer' }}>
            💬
          </div>
        )}
        <div className="welcome-chip" onClick={() => navigate('/profile')}>
          <div className="chip-avatar">{user?.initials || 'U'}</div>
          {user?.name?.split(' ')[0] || 'Learner'}
          {user?.role === 'admin' && <span className="admin-chip-badge">Admin</span>}
        </div>
        <button 
          className={`hamburger-menu ${menuOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
          title="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

