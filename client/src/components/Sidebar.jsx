import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const studentNav = [
  { path: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { path: '/courses', icon: '📖', label: 'Courses' },
  { path: '/quizzes', icon: '✏️', label: 'Quizzes' },
  { path: '/progress', icon: '📈', label: 'Progress' },
  { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { path: '/resources', icon: '🗂', label: 'Resources' },
  { path: '/certificates', icon: '🎓', label: 'Certificates' },
  { path: '/help', icon: '💬', label: 'Help & Support' },
];

const adminNav = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/profile', icon: '⚙️', label: 'Profile' },
];

export default function Sidebar() {
  const { user, requestLogout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNav : studentNav;
  const location = useLocation();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-topbar">
        <div className="mobile-logo">CivicMind</div>
        <button className="mobile-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
          <span className={mobileOpen ? 'open' : ''} />
          <span className={mobileOpen ? 'open' : ''} />
          <span className={mobileOpen ? 'open' : ''} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="mobile-overlay" onClick={closeMobile} />}

      {/* Sidebar (desktop fixed left | mobile drawer) */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">Civic<br />Mind</div>
        {isAdmin && <div className="sidebar-admin-label">ADMIN</div>}
        <div className="sidebar-divider" />
        {navItems.map(({ path, icon, label }) => (
          <NavLink key={path} to={path} end={path === '/dashboard' || path === '/admin'}
            onClick={closeMobile}
            className={({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''} ${isAdmin ? 'admin-nav' : ''}`}>
            <span className="si-icon">{icon}</span>
            <span className="si-label">{label}</span>
            <span className="tooltip">{label}</span>
          </NavLink>
        ))}
        <div className="sidebar-bottom">
          <NavLink to="/profile" onClick={closeMobile}
            className={({ isActive }) => `avatar ${isActive ? 'active-avatar' : ''}`}
            title={`${user?.name || 'User'} — Profile`}>
            {user?.initials || 'U'}
          </NavLink>
          {isAdmin && <div className="admin-dot" title="Admin" />}
          <button className="logout-icon" onClick={requestLogout} title="Logout">⏻</button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 5).map(({ path, icon, label }) => (
          <NavLink key={path} to={path} end={path === '/dashboard' || path === '/admin'}
            className={({ isActive }) => `mbn-item ${isActive ? 'active' : ''}`}>
            <span className="mbn-icon">{icon}</span>
            <span className="mbn-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
