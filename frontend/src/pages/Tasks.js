import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, toggleTask, deleteTask } from '../utils/api';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import { TaskRow } from './Dashboard';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask]   = useState(null);
  const [pendingCount, setPending]= useState(0);

  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all' });
  const LIMIT = 10;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, sort: '-createdAt' };
      if (filters.search)   params.search   = filters.search;
      if (filters.status   !== 'all') params.status   = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;

      const { data } = await getTasks(params);
      setTasks(data.tasks);
      setTotal(data.total);
      setTotalPages(data.totalPages);

      // Get pending count for sidebar badge
      const pRes = await getTasks({ status: 'pending', limit: 1 });
      setPending(pRes.data.total);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Reset to page 1 on filter change
  const updateFilter = (key, val) => {
    setPage(1);
    setFilters(f => ({ ...f, [key]: val }));
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleTask(id);
      setTasks(prev => prev.map(t => t._id === id ? data.task : t));
      fetchTasks();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted!');
      if (tasks.length === 1 && page > 1) setPage(p => p - 1);
      else fetchTasks();
    } catch { toast.error('Failed to delete'); }
  };

  const handleSave = (saved, isEdit) => {
    if (isEdit) setTasks(prev => prev.map(t => t._id === saved._id ? saved : t));
    else fetchTasks();
  };

  const inp = { padding: '8px 12px', background: '#1c2030', border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: 8, color: '#e8eaf6', fontSize: 13, fontFamily: 'inherit', outline: 'none' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0d0f14', color: '#e8eaf6', fontFamily: 'Sora, sans-serif' }}>
      <Sidebar pendingCount={pendingCount} />
      <main style={{ marginLeft: 240, flex: 1, padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>All Tasks</h1>
            <p style={{ fontSize: 14, color: '#9ba3c4' }}>Manage and track all your tasks</p>
          </div>
          <button onClick={() => { setEditTask(null); setModalOpen(true); }} style={{
            padding: '10px 20px', background: '#6c63ff', border: 'none',
            borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14,
          }}>+ New Task</button>
        </div>

        {/* Tasks Section */}
        <div style={{ background: '#151820', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Filters */}
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginRight: 'auto' }}>
              Tasks <span style={{ color: '#5d6487', fontWeight: 400 }}>({total})</span>
            </h3>
            <input type="text" style={{ ...inp, width: 200 }} placeholder="🔍 Search tasks…"
              value={filters.search} onChange={e => updateFilter('search', e.target.value)} />
            <select style={inp} value={filters.status} onChange={e => updateFilter('status', e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select style={inp} value={filters.priority} onChange={e => updateFilter('priority', e.target.value)}>
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Task List */}
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#5d6487' }}>Loading…</div>
          ) : tasks.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#5d6487' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>◈</div>
              <p>No tasks found. {filters.search || filters.status !== 'all' ? 'Try clearing filters.' : 'Create your first task!'}</p>
            </div>
          ) : tasks.map(task => (
            <TaskRow key={task._id} task={task} onToggle={handleToggle}
              onEdit={() => { setEditTask(task); setModalOpen(true); }} onDelete={handleDelete} />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#5d6487' }}>
                Page {page} of {totalPages} — {total} total
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{
                  padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.13)',
                  background: 'transparent', color: page === 1 ? '#5d6487' : '#e8eaf6',
                  cursor: page === 1 ? 'default' : 'pointer', fontSize: 13,
                }}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .map((n, idx, arr) => (
                    <React.Fragment key={n}>
                      {idx > 0 && arr[idx - 1] !== n - 1 && (
                        <span style={{ color: '#5d6487', padding: '7px 4px' }}>…</span>
                      )}
                      <button onClick={() => setPage(n)} style={{
                        padding: '7px 12px', borderRadius: 8, fontSize: 13,
                        border: '1px solid rgba(255,255,255,0.13)',
                        background: n === page ? '#6c63ff' : 'transparent',
                        color: n === page ? '#fff' : '#e8eaf6', cursor: 'pointer',
                      }}>{n}</button>
                    </React.Fragment>
                  ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{
                  padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.13)',
                  background: 'transparent', color: page === totalPages ? '#5d6487' : '#e8eaf6',
                  cursor: page === totalPages ? 'default' : 'pointer', fontSize: 13,
                }}>Next →</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} task={editTask} onSave={handleSave} />
    </div>
  );
};

export default Tasks;
