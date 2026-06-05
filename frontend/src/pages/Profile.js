import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, getTaskStats } from '../utils/api';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm]         = useState({ name: '', email: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [stats, setStats]       = useState({ total: 0, completed: 0, pending: 0, completionRate: 0, byPriority: { high: 0, medium: 0, low: 0 } });

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
    getTaskStats().then(r => setStats(r.data.stats)).catch(() => {});
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email)       e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '11px 14px', background: '#1c2030',
    border: '1px solid rgba(255,255,255,0.13)', borderRadius: 8, color: '#e8eaf6',
    fontSize: 14, fontFamily: 'inherit', outline: 'none' };
  const lbl = { display: 'block', fontSize: 13, fontWeight: 500, color: '#9ba3c4', marginBottom: 6 };
  const card = { background: '#151820', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.5rem' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0d0f14', color: '#e8eaf6', fontFamily: 'Sora, sans-serif' }}>
      <Sidebar pendingCount={stats.pending} />
      <main style={{ marginLeft: 240, flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Profile</h1>
          <p style={{ fontSize: 14, color: '#9ba3c4' }}>Manage your account settings</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Account Info */}
          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6c63ff', display: 'inline-block' }}></span>
              Account Info
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#6c63ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{user?.name}</div>
                <div style={{ fontSize: 13, color: '#5d6487' }}>{user?.email}</div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={lbl}>Full Name</label>
                <input style={{ ...inp, ...(errors.name ? { borderColor: '#ef4444' } : {}) }}
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                {errors.name && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.name}</span>}
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>Email</label>
                <input type="email" style={{ ...inp, ...(errors.email ? { borderColor: '#ef4444' } : {}) }}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                {errors.email && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.email}</span>}
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: 12, background: '#6c63ff', border: 'none',
                borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14,
                opacity: loading ? 0.7 : 1,
              }}>{loading ? 'Saving…' : 'Save Changes'}</button>
            </form>
          </div>

          {/* Stats & Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Task Stats */}
            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                Task Stats
              </h3>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9ba3c4', marginBottom: 6 }}>
                  <span>Overall Progress</span><span>{stats.completionRate}%</span>
                </div>
                <div style={{ height: 6, background: '#232840', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${stats.completionRate}%`, background: '#6c63ff',
                    borderRadius: 3, transition: 'width 0.4s' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: '1rem' }}>
                {[
                  { label: 'Total',   value: stats.total,     color: '#8b84ff' },
                  { label: 'Done',    value: stats.completed, color: '#22c55e' },
                  { label: 'Pending', value: stats.pending,   color: '#f59e0b' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ textAlign: 'center', padding: 10, background: '#1c2030', borderRadius: 8 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#5d6487' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 12, color: '#5d6487', marginBottom: 8 }}>By Priority</div>
                {[
                  { label: 'High',   value: stats.byPriority?.high   || 0, color: '#ef4444' },
                  { label: 'Medium', value: stats.byPriority?.medium || 0, color: '#f59e0b' },
                  { label: 'Low',    value: stats.byPriority?.low    || 0, color: '#38bdf8' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color, width: 50 }}>{label}</span>
                    <div style={{ flex: 1, height: 4, background: '#232840', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: stats.total ? `${(value / stats.total) * 100}%` : '0%',
                        background: color, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#5d6487', width: 20, textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }}></span>
                Tech Stack
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT Auth', 'REST API', 'Mongoose', 'bcryptjs', 'React Router', 'Axios'].map(t => (
                  <span key={t} style={{ padding: '4px 10px', background: '#1c2030',
                    border: '1px solid rgba(255,255,255,0.13)', borderRadius: 20,
                    fontSize: 12, color: '#9ba3c4' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
