import React from 'react';

const CountdownText = ({ timeLeft }) => {
  const formatText = () => {
    const parts = [];
    
    if (timeLeft.años > 0) parts.push(`${timeLeft.años} ${timeLeft.años === 1 ? 'año' : 'años'}`);
    if (timeLeft.meses > 0) parts.push(`${timeLeft.meses} ${timeLeft.meses === 1 ? 'mes' : 'meses'}`);
    if (timeLeft.semanas > 0) parts.push(`${timeLeft.semanas} ${timeLeft.semanas === 1 ? 'semana' : 'semanas'}`);
    if (timeLeft.días > 0) parts.push(`${timeLeft.días} ${timeLeft.días === 1 ? 'día' : 'días'}`);
    if (timeLeft.horas > 0) parts.push(`${timeLeft.horas} ${timeLeft.horas === 1 ? 'hora' : 'horas'}`);
    if (timeLeft.minutos > 0) parts.push(`${timeLeft.minutos} ${timeLeft.minutos === 1 ? 'minuto' : 'minutos'}`);
    if (timeLeft.segundos > 0) parts.push(`${timeLeft.segundos} ${timeLeft.segundos === 1 ? 'segundo' : 'segundos'}`);
    
    if (parts.length === 0) return '0 segundos';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} y ${parts[1]}`;
    
    const lastPart = parts.pop();
    return `${parts.join(', ')} y ${lastPart}`;
  };

  const text = formatText();

  return (
    <div 
      className="time-format-segment text-background"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Tiempo restante: ${text}`}
    >
      <span className="time-text" aria-hidden="true">
        {text}
      </span>
    </div>
  );
};

export default CountdownText;
