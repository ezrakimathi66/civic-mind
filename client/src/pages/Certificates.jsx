import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Certificates.css';

function printCert(cert, userName) {
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html><html><head><title>Certificate — ${cert.course?.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    <style>
      * { margin:0;padding:0;box-sizing:border-box; }
      body { background:#f5f3ee;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px; }
      .cert { background:white;border:3px solid #0a0a14;max-width:800px;width:100%;padding:56px 64px;position:relative;text-align:center; }
      .cert::before { content:'';position:absolute;inset:10px;border:1px solid rgba(10,10,20,0.15);pointer-events:none; }
      .cert-org { font-family:'Syne',sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(10,10,20,0.4);margin-bottom:8px; }
      .cert-logo { font-family:'Syne',sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.03em;color:#4f46e5;margin-bottom:32px; }
      .cert-headline { font-family:'Syne',sans-serif;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(10,10,20,0.5);margin-bottom:16px; }
      .cert-name { font-family:'Syne',sans-serif;font-size:38px;font-weight:800;letter-spacing:-0.03em;color:#0a0a14;margin-bottom:12px;border-bottom:2px solid #4f46e5;display:inline-block;padding-bottom:8px; }
      .cert-desc { font-size:16px;color:rgba(10,10,20,0.65);margin:16px auto 8px;max-width:480px;line-height:1.6; }
      .cert-course { font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#0a0a14;margin-bottom:24px; }
      .cert-grade-row { display:flex;justify-content:center;gap:40px;margin-bottom:32px; }
      .cert-grade-item { text-align:center; }
      .cert-grade-val { font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:#4f46e5; }
      .cert-grade-label { font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(10,10,20,0.4);margin-top:4px; }
      .cert-divider { border:none;border-top:1px solid rgba(10,10,20,0.1);margin:0 0 32px; }
      .cert-signatories { display:flex;justify-content:space-between;align-items:flex-end;margin-top:32px; }
      .cert-sig { text-align:center;width:200px; }
      .cert-sig-line { border-bottom:2px solid #0a0a14;margin-bottom:8px;padding-bottom:32px; }
      .cert-sig-name { font-family:'Syne',sans-serif;font-weight:800;font-size:14px; }
      .cert-sig-title { font-size:11px;color:rgba(10,10,20,0.45);margin-top:2px; }
      .cert-id { font-size:11px;font-family:monospace;color:rgba(10,10,20,0.35);margin-top:32px; }
      .cert-icon { font-size:56px;margin-bottom:16px; }
      @media print { body { background:white; } .cert { border:3px solid #0a0a14; } }
    </style></head><body>
    <div class="cert">
      <div class="cert-org">CivicMind Digital Citizenship Platform</div>
      <div class="cert-logo">CivicMind</div>
      <div class="cert-icon">${cert.course?.icon || '🎓'}</div>
      <div class="cert-headline">Certificate of Completion</div>
      <p style="font-size:16px;color:rgba(10,10,20,0.55);margin-bottom:8px;">This is to certify that</p>
      <div class="cert-name">${userName}</div>
      <div class="cert-desc">has successfully completed the course</div>
      <div class="cert-course">${cert.course?.title}</div>
      <hr class="cert-divider" />
      <div class="cert-grade-row">
        <div class="cert-grade-item"><div class="cert-grade-val">${cert.score || '—'}%</div><div class="cert-grade-label">Final Score</div></div>
        <div class="cert-grade-item"><div class="cert-grade-val">${cert.grade || '—'}</div><div class="cert-grade-label">Grade</div></div>
        <div class="cert-grade-item"><div class="cert-grade-val">${new Date(cert.approvedAt || cert.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</div><div class="cert-grade-label">Date Issued</div></div>
      </div>
      <div class="cert-signatories">
        <div class="cert-sig"><div class="cert-sig-line"></div><div class="cert-sig-name">${cert.issuedBy || 'Sir Ezra Kimanthi'}</div><div class="cert-sig-title">${cert.issuedByTitle || 'Project Manager, CivicMind'}</div></div>
        <div style="text-align:center"><div style="font-size:56px;margin-bottom:8px">🏅</div></div>
        <div class="cert-sig"><div class="cert-sig-line"></div><div class="cert-sig-name">${userName}</div><div class="cert-sig-title">Student</div></div>
      </div>
      <div class="cert-id">Certificate ID: ${cert.certificateId} · Issued by CivicMind Digital Citizenship Platform</div>
    </div>
    <script>window.onload = () => { window.print(); }</script>
    </body></html>
  `);
  win.document.close();
}

export default function Certificates() {
  const { user } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    axios.get('/api/certificates').then(({ data }) => { setCerts(data); setLoading(false); });
  }, []);

  const requestCert = async (courseId, score) => {
    setRequesting(courseId);
    try {
      const { data } = await axios.post(`/api/certificates/request/${courseId}`, { score });
      setCerts(c => [data, ...c]);
      setFlash('✅ Certificate request submitted! The admin will review and approve it.');
      setTimeout(() => setFlash(''), 5000);
    } catch (err) {
      setFlash(err.response?.data?.message || 'Error requesting certificate.');
      setTimeout(() => setFlash(''), 4000);
    } finally { setRequesting(null); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header fade-up fade-up-1">
        <div>
          <h1 className="page-title">🎓 My Certificates</h1>
          <p className="page-sub">Certificates issued by Sir Ezra Kimanthi — Project Manager, CivicMind</p>
        </div>
      </div>

      {flash && <div className="cert-flash">{flash}</div>}

      {certs.length === 0 && (
        <div className="cert-empty fade-up fade-up-2">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No certificates yet</div>
          <p style={{ color: 'rgba(10,10,20,0.5)', fontSize: 14 }}>Complete a course and its final exam to request a certificate from the admin.</p>
        </div>
      )}

      <div className="certs-grid fade-up fade-up-2">
        {certs.map(c => (
          <div key={c._id} className={`cert-card ${c.status}`}>
            <div className="cert-card-glow" />
            <div className="cert-card-top">
              <div className="cert-card-icon">{c.course?.icon || '🎓'}</div>
              <div className={`cert-card-status ${c.status}`}>
                {c.status === 'pending' ? '⏳ Pending Approval' : c.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
              </div>
            </div>
            <div className="cert-card-course">{c.course?.title}</div>
            {c.score != null && (
              <div className="cert-card-score">
                Score: <strong>{c.score}%</strong> · Grade: <strong>{c.grade}</strong>
              </div>
            )}
            <div className="cert-card-id">ID: {c.certificateId}</div>
            <div className="cert-card-date">{new Date(c.createdAt).toLocaleDateString()}</div>
            {c.status === 'approved' && (
              <button className="cert-print-btn" onClick={() => printCert(c, user?.name)}>
                🖨 Print Certificate
              </button>
            )}
            {c.status === 'pending' && (
              <div className="cert-pending-note">Awaiting review by Sir Ezra Kimanthi</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
