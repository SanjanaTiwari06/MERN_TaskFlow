import React, { useState, useEffect } from 'react';
import { createTask, updateTask } from '../utils/api';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [form, setForm]       = useState({ title: '', description: '', priority: 'medium', status: 'pending' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({ title: task.title, description: task.description || '', priority: task.priority, status: task.status });
    } else {
      setForm({ title: '', description: '', priority: 'medium', status: 'pending' });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Task title is required';
    else if (form.title.trim().length < 2) e.title = 'Min. 2 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      let result;
      if (task) {
        const { data } = await updateTask(task._id, form);
        result = data.task;
        toast.success('Task updated!');
      } else {
        const { data } = await createTask(form);
        result = data.task;
        toast.success('Task created!');
      }
      onSave(result, !!task);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inp = { background: '#1c2030', border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: 8, color: '#e8eaf6', fontSize: 14, padding: '10px 14px',
    width: '100%', fontFamily: 'inherit', outline: 'none' };
  const lbl = { display: 'block', fontSize: 13, fontWeight: 500,
    color: '#9ba3c4', marginBottom: 6 };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#151820', border: '1px solid rgba(255,255,255,0.13)',
        borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ba3c4', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={lbl}>Task Title *</label>
            <input style={{ ...inp, ...(errors.title ? { borderColor: '#ef4444' } : {}) }}
              placeholder="Enter task title…" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
            {errors.title && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.title}</span>}
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={lbl}>Description</label>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }}
              placeholder="Optional description…" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: '1.5rem' }}>
            <div>
              <label style={lbl}>Priority</label>
              <select style={inp} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">🔵 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select style={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px', borderRadius: 8, background: 'transparent',
              border: '1px solid rgba(255,255,255,0.13)', color: '#9ba3c4', cursor: 'pointer', fontSize: 14,
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              padding: '10px 24px', borderRadius: 8, background: '#6c63ff',
              border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              opacity: loading ? 0.7 : 1,
            }}>{loading ? 'Saving…' : task ? 'Update Task' : 'Save Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
