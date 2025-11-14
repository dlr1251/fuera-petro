import React, { useMemo } from 'react';
import { getDigitalTime } from '../utils/countdownUtils';

const CountdownDigitalClock = () => {
  const digitalTime = useMemo(() => getDigitalTime(), []);

  return (
    <div 
      className="countdown-digital-clock"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Reloj digital de cuenta regresiva"
    >
      <div className="digital-display">
        <div className="digital-segment days">
          <div className="segment-value" aria-label={`${digitalTime.days} días`}>
            {digitalTime.days}
          </div>
          <div className="segment-label">Días</div>
        </div>
        
        <div className="digital-separator">:</div>
        
        <div className="digital-segment hours">
          <div className="segment-value" aria-label={`${digitalTime.hours} horas`}>
            {digitalTime.hours}
          </div>
          <div className="segment-label">Horas</div>
        </div>
        
        <div className="digital-separator">:</div>
        
        <div className="digital-segment minutes">
          <div className="segment-value" aria-label={`${digitalTime.minutes} minutos`}>
            {digitalTime.minutes}
          </div>
          <div className="segment-label">Minutos</div>
        </div>
        
        <div className="digital-separator">:</div>
        
        <div className="digital-segment seconds">
          <div className="segment-value" aria-label={`${digitalTime.seconds} segundos`}>
            {digitalTime.seconds}
          </div>
          <div className="segment-label">Segundos</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownDigitalClock;

