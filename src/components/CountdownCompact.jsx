import React from 'react';
import { getRemainingDays } from '../utils/countdownUtils';

const CountdownCompact = ({ timeLeft }) => {
  const remainingDays = getRemainingDays();

  return (
    <div 
      className="countdown-compact"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Vista compacta de cuenta regresiva"
    >
      <div className="compact-display">
        <div className="compact-main">
          <span className="compact-value">{remainingDays}</span>
          <span className="compact-unit">días</span>
        </div>
        <div className="compact-secondary">
          <span>{String(timeLeft.horas).padStart(2, '0')}</span>
          <span className="compact-separator">:</span>
          <span>{String(timeLeft.minutos).padStart(2, '0')}</span>
          <span className="compact-separator">:</span>
          <span>{String(timeLeft.segundos).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownCompact;

