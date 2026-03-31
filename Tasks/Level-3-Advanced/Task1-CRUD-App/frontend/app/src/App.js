import { useState } from 'react';
import './App.css';
import useTasks from './hooks/useTasks';
import StatsBar from './components/StatsBar';
import Toolbar from './components/Toolbar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import Toast from './components/Toast';

export default function App() {
  const {
    tasks,
    stats,
    loading,
    error,
    filters,
    setFilters,
    createTask,
    updateTask,
    updateStatus,
    deleteTask,
    clearDone,
  } = useTasks();

  const [modal, setModal] = useState({ open: false, task: null });
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type, id: Date.now() });
  }

  async function handleSave(data) {
    try {
      if (modal.task) {
        await updateTask(modal.task._id, data);
        showToast('Task updated successfully');
      } else {
        await createTask(data);
        showToast('Task created successfully');
      }
      setModal({ open: false, task: null });
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    }
  }

  async function handleDelete(id) {
    setConfirm({
      message: 'Delete this task? This cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteTask(id);
          showToast('Task deleted');
          setConfirm(null);
        } catch {
          showToast('Failed to delete task', 'error');
        }
      },
    });
  }

  async function handleStatusChange(id, status) {
    try {
      await updateStatus(id, status);
      showToast(`Status → ${status}`);
    } catch {
      showToast('Failed to update status', 'error');
    }
  }

  async function handleClearDone() {
    setConfirm({
      message: `Clear all ${stats.done} completed tasks?`,
      onConfirm: async () => {
        try {
          await clearDone();
          showToast('Completed tasks cleared');
          setConfirm(null);
        } catch {
          showToast('Failed to clear tasks', 'error');
        }
      },
    });
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">TF</div>
          <div>
            <div className="brand-name">TaskFlow</div>
            <div className="brand-sub">Chaouki Ismail</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { label: 'All Tasks', value: '', icon: '◈', count: stats.total },
            { label: 'To Do', value: 'todo', icon: '○', count: stats.todo },
            { label: 'In Progress', value: 'in-progress', icon: '◑', count: stats.inProgress },
            { label: 'Done', value: 'done', icon: '●', count: stats.done },
          ].map(({ label, value, icon, count }) => (
            <button
              key={value}
              className={`nav-btn ${filters.status === value ? 'active' : ''}`}
              onClick={() => setFilters((f) => ({ ...f, status: value }))}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
              <span className="nav-badge">{count}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="new-task-btn" onClick={() => setModal({ open: true, task: null })}>
            <span>+</span> New Task
          </button>
          {stats.done > 0 && (
            <button className="clear-btn" onClick={handleClearDone}>
              🗑 Clear {stats.done} done
            </button>
          )}
        </div>
      </aside>

      <div className="main">
        <header className="main-header">
          <div>
            <h1 className="page-title">
              {filters.status === '' && 'All Tasks'}
              {filters.status === 'todo' && 'To Do'}
              {filters.status === 'in-progress' && 'In Progress'}
              {filters.status === 'done' && 'Done'}
            </h1>
            <p className="page-sub">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button className="header-new-btn" onClick={() => setModal({ open: true, task: null })}>
            + New Task
          </button>
        </header>

        <StatsBar stats={stats} />

        <Toolbar filters={filters} setFilters={setFilters} />

        {error && (
          <div className="api-error">
            <span>⚠</span> {error}
            <span className="error-hint">Make sure your backend is running on port 5000</span>
          </div>
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={(task) => setModal({ open: true, task })}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>

      {modal.open && (
        <TaskModal
          task={modal.task}
          onSave={handleSave}
          onClose={() => setModal({ open: false, task: null })}
        />
      )}

      {confirm && (
        <div className="confirm-overlay" onClick={() => setConfirm(null)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠</div>
            <p className="confirm-msg">{confirm.message}</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setConfirm(null)}>
                Cancel
              </button>
              <button className="confirm-ok" onClick={confirm.onConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast key={toast.id} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}
