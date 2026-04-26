import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/leaderboard').then(({ data }) => { setLeaders(data); setLoading(false); });
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <>
      <div className="page-header fade-up fade-up-1">
        <div>
          <h1 className="page-title">🏆 Leaderboard</h1>
          <p className="page-sub">Top learners this month by XP earned</p>
        </div>
      </div>

      <div className="podium fade-up fade-up-2">
        {top3[1] && (
          <div className="podium-slot second">
            <div className="podium-avatar" style={{ background: 'linear-gradient(135deg,#94a3b8,#64748b)' }}>{top3[1].initials}</div>
            <div className="podium-name">{top3[1].name}</div>
            <div className="podium-xp">{top3[1].xp.toLocaleString()} XP</div>
            <div className="podium-bar second-bar">🥈 2nd</div>
          </div>
        )}
        {top3[0] && (
          <div className="podium-slot first">
            <div className="podium-crown">👑</div>
            <div className="podium-avatar" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>{top3[0].initials}</div>
            <div className="podium-name">{top3[0].name}</div>
            <div className="podium-xp">{top3[0].xp.toLocaleString()} XP</div>
            <div className="podium-bar first-bar">🥇 1st</div>
          </div>
        )}
        {top3[2] && (
          <div className="podium-slot third">
            <div className="podium-avatar" style={{ background: 'linear-gradient(135deg,#b45309,#92400e)' }}>{top3[2].initials}</div>
            <div className="podium-name">{top3[2].name}</div>
            <div className="podium-xp">{top3[2].xp.toLocaleString()} XP</div>
            <div className="podium-bar third-bar">🥉 3rd</div>
          </div>
        )}
      </div>

      <div className="lb-full-list fade-up fade-up-3">
        {leaders.map((entry) => (
          <div key={entry._id} className={`lb-full-row ${entry.isCurrentUser ? 'lb-me' : ''}`}>
            <div className={`lb-rank ${entry.rank === 1 ? 'gold' : entry.rank === 2 ? 'silver' : entry.rank === 3 ? 'bronze' : ''}`}>
              {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`}
            </div>
            <div className="lb-avatar-full" style={{ background: 'linear-gradient(135deg,#4f46e5,#f97316)' }}>{entry.initials}</div>
            <div className="lb-name-full">
              {entry.isCurrentUser ? <><strong>{entry.name}</strong> <span className="you-tag">You</span></> : entry.name}
            </div>
            <div className="lb-streak">🔥 {entry.streak} day streak</div>
            <div className="lb-badges">{entry.badges?.length || 0} 🏅</div>
            <div className="lb-xp-full">{entry.xp.toLocaleString()} XP</div>
          </div>
        ))}
        {leaders.length === 0 && <p style={{ color: 'rgba(10,10,20,0.45)', fontSize: 14, padding: '24px 0' }}>No learners yet — be the first!</p>}
      </div>
    </>
  );
}
