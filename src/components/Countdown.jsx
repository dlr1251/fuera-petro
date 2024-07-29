import React, { useState, useEffect } from 'react';
import '../styles/countdown.css';


const Countdown = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date('2026-08-07') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        años: Math.floor(difference / (1000 * 60 * 60 * 24 * 365)),
        meses: Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)),
        semanas: Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7)),
        días: Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach(interval => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval} className="time-segment">
        {timeLeft[interval]} <span className="time-label">{interval}</span>
      </span>
    );
  });

  return (
    <div className="countdown-container">
      <h1 className="countdown-title">al gobierno Petro le faltan...</h1>
      <div className="countdown-timer">
        {timerComponents.length ? timerComponents : <span>¡Se acabó el tiempo!</span>}
      </div>
    </div>
  );
};

export default Countdown;
