import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTaskStats, getTasks, toggleTask, deleteTask } from '../utils/api';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';

const StatCard = ({ icon, value, label, color }) => (
  <div style={{ background: '#151820', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12, padding: '1.25rem' }}>
    <div style={{ fontSize: 20, color, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'monospace', color }}>{value}</div>
    <div style={{ fontSize: 12, color: '#9ba3c4', marginTop: 4 }}>{label}</div>
  </div>
);

const Dashboard = () => {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [stats, setStats]             = useState({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTask, setEditTask]       = useState(null);
  const [loading, setLoading]         = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        getTaskStats(),
        getTasks({ limit: 5, sort: '-createdAt' }),
      ]);
      setStats(statsRes.data.stats);
      setRecentTasks(tasksRes.data.tasks);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleTask(id);
      setRecentTasks(prev => prev.map(t => t._id === id ? data.task : t));
      fetchData();
    } catch { toast.error('Failed to update task'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted!');
      fetchData();
    } catch { toast.error('Failed to delete task'); }
  };

  const handleSave = () => fetchData();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0d0f14', color: '#e8eaf6' }}>
      <Sidebar pendingCount={0} />
      <main style={{ marginLeft: 240, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9ba3c4' }}>Loading dashboard…</p>
      </main>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0d0f14', color: '#e8eaf6', fontFamily: 'Sora, sans-serif' }}>
      <Sidebar pendingCount={stats.pending} />
      <main style={{ marginLeft: 240, flex: 1, padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Dashboard 👋</h1>
            <p style={{ fontSize: 14, color: '#9ba3c4' }}>{greeting}, {user?.name?.split(' ')[0]}! Here's your overview.</p>
          </div>
          <button onClick={() => { setEditTask(null); setModalOpen(true); }} style={{
            padding: '10px 20px', background: '#6c63ff', border: 'none',
            borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14,
          }}>+ New Task</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: '2rem' }}>
          <StatCard icon="◈" value={stats.total}          label="Total Tasks"  color="#8b84ff" />
          <StatCard icon="✓" value={stats.completed}      label="Completed"    color="#22c55e" />
          <StatCard icon="◷" value={stats.pending}        label="Pending"      color="#f59e0b" />
          <StatCard icon="⚡" value={stats.completionRate + '%'} label="Progress" color="#38bdf8" />
        </div>

        {/* Recent Tasks */}
        <div style={{ background: '#151820', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Tasks</h3>
            <button onClick={() => navigate('/tasks')} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 8, color: '#9ba3c4', fontSize: 13, padding: '6px 14px', cursor: 'pointer',
            }}>View All →</button>
          </div>

          {recentTasks.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#5d6487' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>◈</div>
              <p>No tasks yet. Create your first task!</p>
            </div>
          ) : recentTasks.map(task => (
            <TaskRow key={task._id} task={task} onToggle={handleToggle}
              onEdit={() => { setEditTask(task); setModalOpen(true); }} onDelete={handleDelete} />
          ))}
        </div>
      </main>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} task={editTask} onSave={handleSave} />
    </div>
  );
};

export const TaskRow = ({ task, onToggle, onEdit, onDelete }) => {
  const done = task.status === 'completed';
  const priorityColor = { high: '#ef4444', medium: '#f59e0b', low: '#38bdf8' }[task.priority];
  const date = new Date(task.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });

  return (
    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'flex-start', gap: 14 }}
      onMouseEnter={e => e.currentTarget.style.background = '#1c2030'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      {/* Check */}
      <div onClick={() => onToggle(task._id)} style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2, cursor: 'pointer',
        border: done ? 'none' : '2px solid rgba(255,255,255,0.2)',
        background: done ? '#22c55e' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff',
      }}>{done ? '✓' : ''}</div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: done ? '#5d6487' : '#e8eaf6',
          textDecoration: done ? 'line-through' : 'none' }}>{task.title}</div>
        {task.description && <div style={{ fontSize: 12, color: '#5d6487', marginTop: 3 }}>{task.description}</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: done ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
            color: done ? '#22c55e' : '#f59e0b' }}>{done ? ' Completed' : 'Pending'}</span>
          <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: `${priorityColor}18`, color: priorityColor }}>
            ▲ {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
          <span style={{ fontSize: 11, color: '#5d6487', fontFamily: 'monospace' }}>{date}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onEdit} style={{ background: 'none', border: '1px solid transparent',
          padding: '5px 8px', borderRadius: 6, cursor: 'pointer', color: '#9ba3c4', fontSize: 13 }}
          onMouseEnter={e => { e.target.style.background = '#232840'; e.target.style.borderColor = 'rgba(255,255,255,0.13)'; }}
          onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.borderColor = 'transparent'; }}>✎</button>
        <button onClick={() => onDelete(task._id)} style={{ background: 'none', border: '1px solid transparent',
          padding: '5px 8px', borderRadius: 6, cursor: 'pointer', color: '#9ba3c4', fontSize: 13 }}
          onMouseEnter={e => { e.target.style.background = 'rgba(239,68,68,0.1)'; e.target.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = '#9ba3c4'; }}>⊗</button>
      </div>
    </div>
  );
};

export default Dashboard;
