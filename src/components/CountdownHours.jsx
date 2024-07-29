import React from 'react';

const CountdownHours = ({ hours }) => {
  return (
    <div className="time-format-segment red-background">
      <span className="time-value">{hours}</span>
      <span className="time-label">Horas</span>
    </div>
  );
};

export default CountdownHours;
