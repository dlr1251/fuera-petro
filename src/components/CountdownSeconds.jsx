import React from 'react';

const CountdownSeconds = ({ seconds }) => {
  return (
    <div 
      className="time-format-segment aqua-background"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${seconds} segundos restantes`}
    >
      <span className="time-value" aria-hidden="true">{seconds}</span>
      <span className="time-label">Segundos</span>
    </div>
  );
};

export default CountdownSeconds;
