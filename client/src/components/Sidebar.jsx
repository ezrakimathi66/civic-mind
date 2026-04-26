import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Civic<br />Mind</div>
      {isAdmin && <div className="sidebar-admin-label">ADMIN</div>}
      <div className="sidebar-divider" />
      {navItems.map(({ path, icon, label }) => (
        <NavLink key={path} to={path} end={path === '/dashboard' || path === '/admin'}
          className={({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''} ${isAdmin ? 'admin-nav' : ''}`}>
          <span>{icon}</span>
          <span className="tooltip">{label}</span>
        </NavLink>
      ))}
      <div className="sidebar-bottom">
        <NavLink to="/profile" className={({ isActive }) => `avatar ${isActive ? 'active-avatar' : ''}`}
          title={`${user?.name || 'User'} — Profile`}>
          {user?.initials || 'U'}
        </NavLink>
        {isAdmin && <div className="admin-dot" title="Admin" />}
        <button className="logout-icon" onClick={requestLogout} title="Logout">⏻</button>
      </div>
    </aside>
  );
}
