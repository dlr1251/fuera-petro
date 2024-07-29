import React from 'react';

const CountdownSeconds = ({ seconds }) => {
  return (
    <div className="time-format-segment aqua-background">
      <span className="time-value">{seconds}</span>
      <span className="time-label">Segundos</span>
    </div>
  );
};

export default CountdownSeconds;
