import React, { useMemo } from 'react';
import { calculateTimeLeft, getTotalDays } from '../utils/countdownUtils';

const CountdownCircular = ({ timeLeft }) => {
  const totalDays = useMemo(() => getTotalDays(), []);
  
  const units = useMemo(() => [
    { key: 'años', label: 'Años', max: 4, color: 'var(--accent-cyan)', size: 120 },
    { key: 'meses', label: 'Meses', max: 12, color: 'var(--accent-aqua)', size: 100 },
    { key: 'días', label: 'Días', max: 365, color: 'var(--accent-yellow)', size: 100 },
    { key: 'horas', label: 'Horas', max: 24, color: 'var(--accent-orange)', size: 100 },
  ], []);

  const calculatePercentage = (value, max) => {
    if (!max || max === 0) return 0;
    return Math.min(100, (value / max) * 100);
  };

  const calculateCircumference = (radius) => 2 * Math.PI * radius;
  const calculateOffset = (percentage, circumference) => {
    return circumference - (percentage / 100) * circumference;
  };

  return (
    <div 
      className="countdown-circular"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Círculos de progreso de cuenta regresiva"
    >
      <div className="circular-grid">
        {units.map((unit) => {
          const value = timeLeft[unit.key] || 0;
          const percentage = calculatePercentage(value, unit.max);
          const radius = (unit.size - 20) / 2;
          const circumference = calculateCircumference(radius);
          const offset = calculateOffset(percentage, circumference);
          
          return (
            <div key={unit.key} className="circular-item">
              <svg 
                className="circular-svg" 
                width={unit.size} 
                height={unit.size}
                aria-label={`${unit.label}: ${value}`}
              >
                <circle
                  className="circular-bg"
                  cx={unit.size / 2}
                  cy={unit.size / 2}
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                <circle
                  className="circular-progress"
                  cx={unit.size / 2}
                  cy={unit.size / 2}
                  r={radius}
                  fill="none"
                  stroke={unit.color}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${unit.size / 2} ${unit.size / 2})`}
                  style={{
                    transition: 'stroke-dashoffset 0.5s ease-in-out'
                  }}
                />
              </svg>
              <div className="circular-content">
                <div className="circular-value">{value}</div>
                <div className="circular-label">{unit.label}</div>
                <div className="circular-percentage">{percentage.toFixed(0)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountdownCircular;

