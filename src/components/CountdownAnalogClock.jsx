import React, { useMemo } from 'react';
import { calculateTimeLeft } from '../utils/countdownUtils';

const CountdownAnalogClock = ({ timeLeft }) => {
  const clockData = useMemo(() => {
    const totalSeconds = timeLeft.horas * 3600 + timeLeft.minutos * 60 + timeLeft.segundos;
    const maxSeconds = 24 * 3600; // 24 horas en segundos
    const percentage = (totalSeconds / maxSeconds) * 100;
    
    return {
      hours: timeLeft.horas,
      minutes: timeLeft.minutos,
      seconds: timeLeft.segundos,
      hourAngle: (timeLeft.horas / 24) * 360 - 90,
      minuteAngle: (timeLeft.minutos / 60) * 360 - 90,
      secondAngle: (timeLeft.segundos / 60) * 360 - 90,
      percentage
    };
  }, [timeLeft]);

  return (
    <div 
      className="countdown-analog-clock"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Reloj analógico de cuenta regresiva"
    >
      <div className="clock-container">
        <svg className="clock-face" viewBox="0 0 300 300">
          {/* Marcadores de horas */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 360 - 90;
            const x1 = 150 + 120 * Math.cos((angle * Math.PI) / 180);
            const y1 = 150 + 120 * Math.sin((angle * Math.PI) / 180);
            const x2 = 150 + 135 * Math.cos((angle * Math.PI) / 180);
            const y2 = 150 + 135 * Math.sin((angle * Math.PI) / 180);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Manecilla de horas */}
          <line
            className="clock-hand hour-hand"
            x1="150"
            y1="150"
            x2={150 + 60 * Math.cos((clockData.hourAngle * Math.PI) / 180)}
            y2={150 + 60 * Math.sin((clockData.hourAngle * Math.PI) / 180)}
            stroke="var(--accent-cyan)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Manecilla de minutos */}
          <line
            className="clock-hand minute-hand"
            x1="150"
            y1="150"
            x2={150 + 80 * Math.cos((clockData.minuteAngle * Math.PI) / 180)}
            y2={150 + 80 * Math.sin((clockData.minuteAngle * Math.PI) / 180)}
            stroke="var(--accent-aqua)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Manecilla de segundos */}
          <line
            className="clock-hand second-hand"
            x1="150"
            y1="150"
            x2={150 + 90 * Math.cos((clockData.secondAngle * Math.PI) / 180)}
            y2={150 + 90 * Math.sin((clockData.secondAngle * Math.PI) / 180)}
            stroke="var(--accent-orange)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Centro del reloj */}
          <circle cx="150" cy="150" r="8" fill="var(--accent-cyan)" />
        </svg>
        
        <div className="clock-center">
          <div className="clock-time">
            <span className="time-value">{String(clockData.hours).padStart(2, '0')}</span>
            <span className="time-separator">:</span>
            <span className="time-value">{String(clockData.minutes).padStart(2, '0')}</span>
            <span className="time-separator">:</span>
            <span className="time-value">{String(clockData.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownAnalogClock;

