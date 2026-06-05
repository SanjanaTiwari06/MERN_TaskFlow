import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ pendingCount }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/tasks',     icon: '◈', label: 'All Tasks', badge: pendingCount },
    { to: '/profile',   icon: '◉', label: 'Profile' },
  ];

  return (
    <aside style={{
      width: 240, background: '#151820', borderRight: '1px solid rgba(255,255,255,0.07)',
      padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 8px', marginBottom: '2rem' }}>
        <div style={{
          width: 30, height: 30, background: '#6c63ff', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>✦</div>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>
          Task<span style={{ color: '#8b84ff' }}>Flow</span>
        </span>
      </div>

      {/* Nav */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#5d6487', letterSpacing: '1.2px',
        textTransform: 'uppercase', padding: '0 8px', marginBottom: 6 }}>Main</div>

      {navItems.map(({ to, icon, label, badge }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
          borderRadius: 8, cursor: 'pointer', fontSize: 13.5, fontWeight: 500,
          color: isActive ? '#8b84ff' : '#9ba3c4',
          background: isActive ? 'rgba(108,99,255,0.18)' : 'transparent',
          textDecoration: 'none', marginBottom: 2, transition: 'all 0.15s',
        })}>
          <span style={{ fontSize: 16, width: 18, textAlign: 'center' }}>{icon}</span>
          {label}
          {badge > 0 && (
            <span style={{
              marginLeft: 'auto', background: '#6c63ff', color: '#fff',
              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
            }}>{badge}</span>
          )}
        </NavLink>
      ))}

      {/* User section */}
      <div style={{
        marginTop: 'auto', padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#6c63ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>{user?.name?.charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf6',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: 11, color: '#5d6487' }}>Member</div>
        </div>
        <button onClick={handleLogout} title="Logout" style={{
          background: 'none', border: 'none', color: '#5d6487',
          cursor: 'pointer', fontSize: 16, padding: 4, borderRadius: 6,
          transition: 'color 0.2s',
        }}>⎋</button>
      </div>
    </aside>
  );
};

export default Sidebar;
