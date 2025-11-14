import React, { useMemo } from 'react';
import { calculateTimeLeft, getTotalDays } from '../utils/countdownUtils';

const CountdownProgressBars = ({ timeLeft }) => {
  const totalDays = useMemo(() => getTotalDays(), []);
  
  const units = useMemo(() => [
    { key: 'años', label: 'Años', max: 4, color: 'var(--accent-cyan)' },
    { key: 'meses', label: 'Meses', max: 12, color: 'var(--accent-aqua)' },
    { key: 'semanas', label: 'Semanas', max: 52, color: 'var(--accent-emerald)' },
    { key: 'días', label: 'Días', max: 365, color: 'var(--accent-yellow)' },
    { key: 'horas', label: 'Horas', max: 24, color: 'var(--accent-orange)' },
    { key: 'minutos', label: 'Minutos', max: 60, color: 'var(--accent-red)' },
  ], []);

  const calculatePercentage = (value, max) => {
    if (!max || max === 0) return 0;
    return Math.min(100, (value / max) * 100);
  };

  return (
    <div 
      className="countdown-progress-bars"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Barras de progreso de cuenta regresiva"
    >
      {units.map((unit) => {
        const value = timeLeft[unit.key] || 0;
        const percentage = calculatePercentage(value, unit.max);
        
        return (
          <div key={unit.key} className="progress-bar-item">
            <div className="progress-bar-header">
              <span className="progress-bar-label">{unit.label}</span>
              <span className="progress-bar-value">{value}</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: unit.color
                }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin="0"
                aria-valuemax={unit.max}
                aria-label={`${unit.label}: ${value} de ${unit.max}`}
              />
            </div>
            <div className="progress-bar-percentage">{percentage.toFixed(1)}%</div>
          </div>
        );
      })}
    </div>
  );
};

export default CountdownProgressBars;

