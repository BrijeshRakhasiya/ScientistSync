import React, { useEffect, useState } from 'react';
import {
  adminGetStats,
  adminListUsers,
  adminSetUserRole,
  adminVerifyUser,
  adminListResearch,
  adminDeleteResearch,
  adminRestoreResearch,
  adminListComments,
  adminDeleteComment
} from '../services/api';

const Admin = ({ user }) => {
  const [adminSecret, setAdminSecret] = useState(sessionStorage.getItem('adminSecret') || '');
  const [secretInput, setSecretInput] = useState('');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [research, setResearch] = useState([]);
  const [comments, setComments] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasAccess = !!adminSecret; // simple gate; backend validates

  const saveSecret = () => {
    setAdminSecret(secretInput.trim());
    sessionStorage.setItem('adminSecret', secretInput.trim());
    setSecretInput('');
  };

  const clearSecret = () => {
    setAdminSecret('');
    sessionStorage.removeItem('adminSecret');
    setStats(null);
    setUsers([]);
    setResearch([]);
    setComments([]);
  };

  const loadOverview = async () => {
    if (!hasAccess) return;
    setLoading(true);
    setError('');
    try {
      const res = await adminGetStats(adminSecret);
      setStats(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!hasAccess) return;
    setLoading(true);
    setError('');
    try {
      const res = await adminListUsers(adminSecret);
      setUsers(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadResearch = async () => {
    if (!hasAccess) return;
    setLoading(true);
    setError('');
    try {
      const res = await adminListResearch(adminSecret, true);
      setResearch(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load research');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    if (!hasAccess) return;
    setLoading(true);
    setError('');
    try {
      const res = await adminListComments(adminSecret);
      setComments(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasAccess) return;
    if (tab === 'overview') loadOverview();
    if (tab === 'users') loadUsers();
    if (tab === 'research') loadResearch();
    if (tab === 'comments') loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, adminSecret]);

  const setRole = async (id, role) => {
    try {
      await adminSetUserRole(id, role, adminSecret);
      await loadUsers();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update role');
    }
  };

  const verifyUser = async (id, isVerified) => {
    try {
      await adminVerifyUser(id, isVerified, adminSecret);
      await loadUsers();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update verification');
    }
  };

  const softDeleteResearch = async (id) => {
    try {
      await adminDeleteResearch(id, adminSecret);
      await loadResearch();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete research');
    }
  };

  const restoreResearch = async (id) => {
    try {
      await adminRestoreResearch(id, adminSecret);
      await loadResearch();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to restore research');
    }
  };

  const softDeleteComment = async (id) => {
    try {
      await adminDeleteComment(id, adminSecret);
      await loadComments();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>

      {!hasAccess && (
        <div style={{ margin: '20px 0', padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
          <p>Enter Admin Secret to access admin endpoints.</p>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Admin Secret"
            style={{ padding: 8, width: 280, marginRight: 8 }}
          />
          <button onClick={saveSecret} className="btn btn-primary">Unlock</button>
        </div>
      )}

      {hasAccess && (
        <div style={{ margin: '10px 0 20px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setTab('overview')} className={`btn ${tab==='overview'?'btn-primary':'btn-secondary'}`}>Overview</button>
          <button onClick={() => setTab('users')} className={`btn ${tab==='users'?'btn-primary':'btn-secondary'}`}>Users</button>
          <button onClick={() => setTab('research')} className={`btn ${tab==='research'?'btn-primary':'btn-secondary'}`}>Research</button>
          <button onClick={() => setTab('comments')} className={`btn ${tab==='comments'?'btn-primary':'btn-secondary'}`}>Comments</button>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={clearSecret} className="btn btn-outline">Lock</button>
          </div>
        </div>
      )}

      {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

      {hasAccess && tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {loading ? (
            <p>Loading stats...</p>
          ) : (
            <>
              <StatCard label="Users" value={stats?.users ?? '-'} />
              <StatCard label="Admins" value={stats?.admins ?? '-'} />
              <StatCard label="Research" value={stats?.research ?? '-'} />
              <StatCard label="Deleted Research" value={stats?.deletedResearch ?? '-'} />
              <StatCard label="Comments" value={stats?.comments ?? '-'} />
              <StatCard label="Deleted Comments" value={stats?.deletedComments ?? '-'} />
            </>
          )}
        </div>
      )}

      {hasAccess && tab === 'users' && (
        <div>
          {loading ? <p>Loading users...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Name</th>
                  <th align="left">Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderTop: '1px solid #eee' }}>
                    <td>{u.fullName || u.username}</td>
                    <td>{u.email}</td>
                    <td align="center">{u.role}</td>
                    <td align="center">{u.isVerified ? 'Yes' : 'No'}</td>
                    <td align="center" style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      {u.role !== 'admin' ? (
                        <button className="btn btn-small" onClick={() => setRole(u._id, 'admin')}>Make Admin</button>
                      ) : (
                        <button className="btn btn-small" onClick={() => setRole(u._id, 'user')}>Revoke Admin</button>
                      )}
                      <button className="btn btn-small" onClick={() => verifyUser(u._id, !u.isVerified)}>
                        {u.isVerified ? 'Unverify' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {hasAccess && tab === 'research' && (
        <div>
          {loading ? <p>Loading research...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Title</th>
                  <th align="left">Author</th>
                  <th>Status</th>
                  <th>Up/Down</th>
                  <th>Deleted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {research.map(r => (
                  <tr key={r._id} style={{ borderTop: '1px solid #eee' }}>
                    <td>{r.title}</td>
                    <td>{r.author?.fullName || r.authorName || r.author?.username || '-'}</td>
                    <td align="center">{r.status}</td>
                    <td align="center">{r.upvotes}/{r.downvotes}</td>
                    <td align="center">{r.isDeleted ? 'Yes' : 'No'}</td>
                    <td align="center" style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      {!r.isDeleted ? (
                        <button className="btn btn-small" onClick={() => softDeleteResearch(r._id)}>Delete</button>
                      ) : (
                        <button className="btn btn-small" onClick={() => restoreResearch(r._id)}>Restore</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {hasAccess && tab === 'comments' && (
        <div>
          {loading ? <p>Loading comments...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Author</th>
                  <th align="left">Content</th>
                  <th>Up/Down</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map(c => (
                  <tr key={c._id} style={{ borderTop: '1px solid #eee' }}>
                    <td>{c.author?.fullName || c.authorName || c.author?.username || '-'}</td>
                    <td>{c.content || c.text}</td>
                    <td align="center">{c.upvotes}/{c.downvotes}</td>
                    <td align="center">
                      <button className="btn btn-small" onClick={() => softDeleteComment(c._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style>{`
        .btn { padding: 8px 12px; border: 1px solid #ccc; border-radius: 8px; background: #fff; cursor: pointer; }
        .btn:hover { background: #f7f7f7; }
        .btn-primary { background: #667eea; color: #fff; border-color: #667eea; }
        .btn-primary:hover { background: #5a6fd6; }
        .btn-secondary { background: #f0f3ff; color: #334; border-color: #e0e6ff; }
        .btn-outline { background: #fff; }
        .btn-small { padding: 6px 10px; font-size: 12px; }
        table th, table td { padding: 8px; }
      `}</style>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
    <div style={{ color: '#666', fontSize: 12 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
  </div>
);

export default Admin;
