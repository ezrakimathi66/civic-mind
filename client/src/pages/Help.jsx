import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Help.css';

export default function Help() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ subject: '', body: '', type: 'help' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/messages').then(({ data }) => { setMessages(data); setLoading(false); });
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.body.trim()) return;
    setSending(true);
    try {
      const { data } = await axios.post('/api/messages', form);
      setMessages(m => [data, ...m]);
      setForm({ subject: '', body: '', type: 'help' });
      setSent('✅ Your message has been sent to the admin. You\'ll receive a reply here.');
      setTimeout(() => setSent(''), 5000);
    } catch (err) {
      setSent('❌ Failed to send. Please try again.');
    } finally { setSending(false); }
  };

  const typeColors = { help: '#4f46e5', report: '#ef4444', question: '#f59e0b', feedback: '#10b981' };

  return (
    <>
      <div className="page-header fade-up fade-up-1">
        <div>
          <h1 className="page-title">💬 Help & Support</h1>
          <p className="page-sub">Send a message to Admin Sir Ezra Kimanthi — get help, report issues, or ask questions</p>
        </div>
      </div>

      {/* Send Form */}
      <div className="help-compose-card fade-up fade-up-2">
        <div className="help-compose-title">✉ New Message to Admin</div>
        {sent && <div className={`help-flash ${sent.startsWith('❌') ? 'error' : ''}`}>{sent}</div>}
        <form onSubmit={send} className="help-form">
          <div className="help-form-row">
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="help">🙋 Help Request</option>
                <option value="question">❓ Question</option>
                <option value="report">🚩 Report Issue</option>
                <option value="feedback">💡 Feedback</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 2 }}>
              <label>Subject</label>
              <input type="text" placeholder="Brief summary of your message..." value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Describe your issue or question in detail..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={4} required />
          </div>
          <button type="submit" className="btn-primary" disabled={sending}>
            {sending ? 'Sending…' : 'Send Message ✈'}
          </button>
        </form>
      </div>

      {/* Inbox */}
      <div className="section-header fade-up fade-up-3">
        <div className="section-title">📥 Your Messages</div>
      </div>

      {loading && <div className="loading-center"><div className="spinner" /></div>}
      {!loading && messages.length === 0 && (
        <div className="help-empty">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p>No messages yet. Send one above!</p>
        </div>
      )}
      <div className="help-msgs-list fade-up fade-up-3">
        {messages.map(m => (
          <div key={m._id} className={`help-msg-card ${m.status}`}>
            <div className="help-msg-top">
              <span className="help-msg-type" style={{ background: typeColors[m.type] + '18', color: typeColors[m.type] }}>{m.type}</span>
              <span className="help-msg-subject">{m.subject}</span>
              <span className={`help-msg-status ${m.status}`}>
                {m.status === 'unread' ? '⏳ Awaiting reply' : m.status === 'read' ? '👁 Read by admin' : '✅ Replied'}
              </span>
              <span className="help-msg-date">{new Date(m.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="help-msg-body">{m.body}</div>
            {m.reply && (
              <div className="help-reply-block">
                <div className="help-reply-label">📩 Reply from Admin (Sir Ezra Kimanthi):</div>
                <div className="help-reply-text">{m.reply}</div>
                {m.repliedAt && <div className="help-reply-date">{new Date(m.repliedAt).toLocaleDateString()}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
