import { useState, useEffect } from 'react';
import '../TaskModal.css';

const CATEGORIES = ['General', 'Frontend', 'Backend', 'Design', 'Learning', 'Personal'];

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    category: 'General',
    dueDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        category: task.category || 'General',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    }
  }, [task]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, dueDate: form.dueDate || null });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">{task ? '✏' : '+'}</div>
            <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && (
          <div className="modal-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="field">
            <label htmlFor="m-title">
              Title <span className="req">*</span>
            </label>
            <input
              id="m-title"
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="What needs to be done?"
              maxLength={120}
              autoFocus
            />
            <span className="char-hint">{form.title.length}/120</span>
          </div>

          <div className="field">
            <label htmlFor="m-desc">Description</label>
            <textarea
              id="m-desc"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Add more details about this task…"
              rows={3}
              maxLength={500}
            />
            <span className="char-hint">{form.description.length}/500</span>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="m-status">Status</label>
              <select
                id="m-status"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="todo">○ To Do</option>
                <option value="in-progress">◑ In Progress</option>
                <option value="done">● Done</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="m-prio">Priority</label>
              <select
                id="m-prio"
                value={form.priority}
                onChange={(e) => set('priority', e.target.value)}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="m-cat">Category</label>
              <select
                id="m-cat"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="m-due">Due Date</label>
              <input
                id="m-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => set('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? (
                <>
                  <span className="btn-spinner" /> Saving…
                </>
              ) : task ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
