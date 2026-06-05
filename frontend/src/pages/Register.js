import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name     = 'Name is required';
    if (!form.email)        e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)     e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min. 6 characters';
    if (form.password !== form.confirm) e.confirm  = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', background: '#0d0f14' },
    card:  { background: '#151820', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 20,
      padding: '2.5rem', width: '100%', maxWidth: 420 },
    label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#9ba3c4', marginBottom: 6 },
    input: { width: '100%', padding: '11px 14px', background: '#1c2030',
      border: '1px solid rgba(255,255,255,0.13)', borderRadius: 8, color: '#e8eaf6',
      fontSize: 14, fontFamily: 'inherit', outline: 'none' },
  };

  const field = (id, type, label, placeholder) => (
    <div style={{ marginBottom: '1.2rem' }}>
      <label style={s.label}>{label}</label>
      <input type={type} style={{ ...s.input, ...(errors[id] ? { borderColor: '#ef4444' } : {}) }}
        placeholder={placeholder} value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })} />
      {errors[id] && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'block' }}>{errors[id]}</span>}
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem' }}>
          <div style={{ width: 36, height: 36, background: '#6c63ff', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✦</div>
          <span style={{ fontSize: 22, fontWeight: 700 }}>Task<span style={{ color: '#8b84ff' }}>Flow</span></span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Create account</h1>
        <p style={{ fontSize: 14, color: '#9ba3c4', marginBottom: '2rem' }}>Start managing your tasks today</p>

        <form onSubmit={handleSubmit}>
          {field('name',     'text',     'Full Name',         'Rahul Sharma')}
          {field('email',    'email',    'Email Address',     'you@example.com')}
          {field('password', 'password', 'Password',          'Min. 6 characters')}
          {field('confirm',  'password', 'Confirm Password',  'Re-enter password')}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: '#6c63ff', border: 'none',
            borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', opacity: loading ? 0.7 : 1,
          }}>{loading ? 'Creating…' : 'Create Account'}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 13, color: '#9ba3c4' }}>
          Already have an account? <Link to="/login" style={{ color: '#8b84ff', fontWeight: 500 }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
