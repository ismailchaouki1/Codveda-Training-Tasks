import React from 'react';
import '../StatsBar.css';

export default function StatsBar({ stats }) {
  const { total = 0, todo = 0, inProgress = 0, done = 0 } = stats;
  const progress = total ? (done / total) * 100 : 0;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon">📋</div>
        <div className="stat-info">
          <h3>Total</h3>
          <p>{total}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">○</div>
        <div className="stat-info">
          <h3>To Do</h3>
          <p>{todo}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">◑</div>
        <div className="stat-info">
          <h3>In Progress</h3>
          <p>{inProgress}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">✓</div>
        <div className="stat-info">
          <h3>Done</h3>
          <p>{done}</p>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
