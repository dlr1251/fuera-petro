import React from 'react';

const CountdownDays = ({ days }) => {
  return (
    <div 
      className="time-format-segment yellow-background"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${days} días restantes`}
    >
      <span className="time-value" aria-hidden="true">{days}</span>
      <span className="time-label">Días</span>
    </div>
  );
};

export default CountdownDays;
