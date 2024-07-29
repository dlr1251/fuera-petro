import React from 'react';

const CountdownDays = ({ days }) => {
  return (
    <div className="time-format-segment yellow-background">
      <span className="time-value">{days}</span>
      <span className="time-label">Días</span>
    </div>
  );
};

export default CountdownDays;
