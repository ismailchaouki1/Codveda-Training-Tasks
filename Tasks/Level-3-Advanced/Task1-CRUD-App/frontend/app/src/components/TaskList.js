import React from 'react';
import '../TaskList.css';

export default function TaskList({ tasks, loading, onEdit, onDelete, onStatusChange }) {
  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loader"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">📭</div>
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div
          key={task._id}
          className={`task-card ${task.status === 'done' ? 'completed' : ''}`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="task-header">
            <div className="task-status">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task._id, e.target.value)}
                className="status-select"
              >
                <option value="todo">○ To Do</option>
                <option value="in-progress">◑ In Progress</option>
                <option value="done">✓ Done</option>
              </select>
            </div>
            <div className="task-actions">
              <button onClick={() => onEdit(task)} className="edit-btn" title="Edit task">
                ✏️
              </button>
              <button onClick={() => onDelete(task._id)} className="delete-btn" title="Delete task">
                🗑️
              </button>
            </div>
          </div>

          <h3 className={`task-title ${task.status === 'done' ? 'strikethrough' : ''}`}>
            {task.title}
          </h3>

          {task.description && <p className="task-description">{task.description}</p>}

          <div className="task-meta">
            <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
              {getPriorityEmoji(task.priority)} {task.priority}
            </span>

            {task.category && task.category !== 'General' && (
              <span className="category-badge">📁 {task.category}</span>
            )}

            {task.dueDate && (
              <span
                className={`due-date ${isOverdue(task.dueDate) && task.status !== 'done' ? 'overdue' : ''}`}
              >
                📅 {formatDate(task.dueDate)}
                {isOverdue(task.dueDate) && task.status !== 'done' && ' ⚠️ Overdue'}
              </span>
            )}
          </div>

          <div className="task-footer">
            <span className="task-date">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </span>
            {task.updatedAt !== task.createdAt && (
              <span className="task-date">
                Updated: {new Date(task.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
