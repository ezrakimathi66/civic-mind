import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutModal() {
  const { showLogoutModal, logout, cancelLogout, user } = useAuth();
  const navigate = useNavigate();
  if (!showLogoutModal) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="modal-overlay" onClick={cancelLogout}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">⏻</div>
        <div className="modal-title">Log out of CivicMind?</div>
        <p className="modal-desc">You're logged in as <strong>{user?.name}</strong>. Your progress is saved and you can log back in anytime.</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={cancelLogout}>Cancel</button>
          <button className="btn-danger" onClick={handleLogout}>Yes, Log Out</button>
        </div>
      </div>
    </div>
  );
}
