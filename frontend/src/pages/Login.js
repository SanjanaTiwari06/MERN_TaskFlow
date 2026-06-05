import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', background: '#0d0f14' },
    card: { background: '#151820', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 20,
      padding: '2.5rem', width: '100%', maxWidth: 420 },
    label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#9ba3c4', marginBottom: 6 },
    input: { width: '100%', padding: '11px 14px', background: '#1c2030',
      border: '1px solid rgba(255,255,255,0.13)', borderRadius: 8, color: '#e8eaf6',
      fontSize: 14, fontFamily: 'inherit', outline: 'none' },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem' }}>
          <div style={{ width: 36, height: 36, background: '#6c63ff', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✦</div>
          <span style={{ fontSize: 22, fontWeight: 700 }}>Task<span style={{ color: '#8b84ff' }}>Flow</span></span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontSize: 14, color: '#9ba3c4', marginBottom: '2rem' }}>Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={s.label}>Email Address</label>
            <input type="email" style={{ ...s.input, ...(errors.email ? { borderColor: '#ef4444' } : {}) }}
              placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.email}</span>}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={s.label}>Password</label>
            <input type="password" style={{ ...s.input, ...(errors.password ? { borderColor: '#ef4444' } : {}) }}
              placeholder="••••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {errors.password && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: '#6c63ff', border: 'none',
            borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', opacity: loading ? 0.7 : 1,
          }}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 13, color: '#9ba3c4' }}>
          Don't have an account? <Link to="/register" style={{ color: '#8b84ff', fontWeight: 500 }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
