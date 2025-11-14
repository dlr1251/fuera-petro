import React from 'react';

const CountdownHours = ({ hours }) => {
  return (
    <div 
      className="time-format-segment red-background"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${hours} horas restantes`}
    >
      <span className="time-value" aria-hidden="true">{hours}</span>
      <span className="time-label">Horas</span>
    </div>
  );
};

export default CountdownHours;
