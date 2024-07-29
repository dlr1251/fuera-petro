import React from 'react';

const CountdownText = ({ timeLeft }) => {
  return (
    <div className="time-format-segment text-background">
      <span className="time-text">
        {timeLeft.años} años, {timeLeft.meses} meses, {timeLeft.semanas} semanas, {timeLeft.días} días, {timeLeft.horas} horas, {timeLeft.minutos} minutos y {timeLeft.segundos} segundos
      </span>
    </div>
  );
};

export default CountdownText;
