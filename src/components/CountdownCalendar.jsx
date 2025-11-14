import React, { useMemo } from 'react';
import { getCalendarData, getRemainingDays } from '../utils/countdownUtils';

const CountdownCalendar = () => {
  const calendarData = useMemo(() => getCalendarData(), []);
  const remainingDays = useMemo(() => getRemainingDays(), []);
  
  // Mostrar solo los próximos 60 días
  const upcomingDays = useMemo(() => {
    return calendarData.slice(0, 60);
  }, [calendarData]);

  return (
    <div 
      className="countdown-calendar"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Vista de calendario de cuenta regresiva"
    >
      <div className="calendar-header">
        <h3 className="calendar-title">Próximos Días</h3>
        <div className="calendar-summary">
          <span className="summary-value">{remainingDays}</span>
          <span className="summary-label">días restantes</span>
        </div>
      </div>
      
      <div className="calendar-grid">
        {upcomingDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day.isToday ? 'today' : ''} ${day.isPast ? 'past' : ''} ${day.isTarget ? 'target' : ''}`}
            aria-label={`${day.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`}
          >
            <div className="day-number">{day.day}</div>
            <div className="day-month">{day.date.toLocaleDateString('es-ES', { month: 'short' })}</div>
            {day.isToday && <div className="day-indicator">Hoy</div>}
            {day.isTarget && <div className="day-indicator target">Fin</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownCalendar;

