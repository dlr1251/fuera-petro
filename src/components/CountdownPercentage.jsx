import React, { useMemo } from 'react';
import { calculatePercentage, getStatistics } from '../utils/countdownUtils';

const CountdownPercentage = () => {
  const percentage = useMemo(() => calculatePercentage(), []);
  const stats = useMemo(() => getStatistics(), []);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div 
      className="countdown-percentage"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${percentage.toFixed(2)}% del tiempo completado`}
    >
      <div className="percentage-container">
        <div className="percentage-circle-wrapper">
          <svg 
            className="percentage-svg" 
            width="280" 
            height="280"
            aria-label={`Gráfico circular: ${percentage.toFixed(2)}% completado`}
          >
            <circle
              className="percentage-bg"
              cx="140"
              cy="140"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="20"
            />
            <circle
              className="percentage-progress"
              cx="140"
              cy="140"
              r={radius}
              fill="none"
              stroke="url(#percentageGradient)"
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 140 140)"
              style={{
                transition: 'stroke-dashoffset 0.8s ease-in-out'
              }}
            />
            <defs>
              <linearGradient id="percentageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-cyan)" />
                <stop offset="50%" stopColor="var(--accent-aqua)" />
                <stop offset="100%" stopColor="var(--accent-emerald)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="percentage-content">
            <div className="percentage-value">{percentage.toFixed(2)}%</div>
            <div className="percentage-label">Completado</div>
          </div>
        </div>
        
        <div className="percentage-stats">
          <div className="percentage-stat">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <div className="stat-value">{stats.elapsedDays}</div>
              <div className="stat-label">Días Transcurridos</div>
            </div>
          </div>
          <div className="percentage-stat">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-value">{stats.remainingDays}</div>
              <div className="stat-label">Días Restantes</div>
            </div>
          </div>
          <div className="percentage-stat">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalDays}</div>
              <div className="stat-label">Total de Días</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownPercentage;

