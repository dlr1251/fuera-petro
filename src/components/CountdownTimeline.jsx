import React, { useMemo } from 'react';
import { calculateTimeLeft, getTotalDays, getRemainingDays, getMilestones } from '../utils/countdownUtils';

const CountdownTimeline = ({ timeLeft }) => {
  const totalDays = useMemo(() => getTotalDays(), []);
  const remainingDays = useMemo(() => getRemainingDays(), []);
  const progress = useMemo(() => {
    if (totalDays === 0) return 0;
    return ((totalDays - remainingDays) / totalDays) * 100;
  }, [totalDays, remainingDays]);
  
  const milestones = useMemo(() => getMilestones(), []);

  return (
    <div 
      className="countdown-timeline"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Línea de tiempo de cuenta regresiva"
    >
      <div className="timeline-container">
        <div className="timeline-line">
          <div 
            className="timeline-progress" 
            style={{ width: `${progress}%` }}
            aria-label={`${progress.toFixed(1)}% completado`}
          />
        </div>
        
        <div className="timeline-milestones">
          {milestones.slice(0, 5).map((milestone, index) => {
            const milestoneProgress = ((milestone.date - new Date('2022-08-07')) / (new Date('2026-08-07') - new Date('2022-08-07'))) * 100;
            const isPassed = milestone.date < new Date();
            
            return (
              <div
                key={index}
                className={`timeline-milestone ${isPassed ? 'passed' : ''}`}
                style={{ left: `${milestoneProgress}%` }}
                aria-label={`Milestone: ${milestone.label}`}
              >
                <div className="milestone-marker" />
                <div className="milestone-label">{milestone.label}</div>
              </div>
            );
          })}
        </div>
        
        <div className="timeline-current">
          <div className="current-marker" />
          <div className="current-label">Ahora</div>
        </div>
      </div>
      
      <div className="timeline-stats">
        <div className="timeline-stat">
          <span className="stat-value">{remainingDays}</span>
          <span className="stat-label">Días Restantes</span>
        </div>
        <div className="timeline-stat">
          <span className="stat-value">{progress.toFixed(1)}%</span>
          <span className="stat-label">Completado</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimeline;

