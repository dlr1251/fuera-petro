import React, { useState, useEffect } from 'react';
import '../styles/countdown.css';
import CountdownDays from './CountdownDays';
import CountdownSeconds from './CountdownSeconds';
import CountdownHours from './CountdownHours';
import CountdownText from './CountdownText';

const Countdown = () => {
  const [selectedFormat, setSelectedFormat] = useState('default');
  const [copyMessage, setCopyMessage] = useState('');

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

  const handleCopy = () => {
    const textToCopy = document.querySelector('.time-format-segment').innerText;
    navigator.clipboard.writeText(textToCopy);
    setCopyMessage('¡Copiado!');
    setTimeout(() => setCopyMessage(''), 2000);
  };

  const renderFormat = () => {
    switch (selectedFormat) {
      case 'days':
        return <CountdownDays days={Math.floor((+new Date('2026-08-07') - +new Date()) / (1000 * 60 * 60 * 24))} />;
      case 'seconds':
        return <CountdownSeconds seconds={Math.floor((+new Date('2026-08-07') - +new Date()) / 1000)} />;
      case 'hours':
        return <CountdownHours hours={Math.floor((+new Date('2026-08-07') - +new Date()) / (1000 * 60 * 60))} />;
      case 'text':
        return <CountdownText timeLeft={timeLeft} />;
      default:
        return (
          <div className="countdown-timer">
            {Object.keys(timeLeft).map(interval => (
              <span key={interval} className="time-segment">
                {timeLeft[interval]} <span className="time-label">{interval}</span>
              </span>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="countdown-container">
      <h1 className="countdown-title">Al gobierno Petro le faltan...</h1>
      {renderFormat()}
      <div className="format-buttons">
        <button onClick={() => setSelectedFormat('default')} className="format-button">Formato Completo</button>
        <button onClick={() => setSelectedFormat('days')} className="format-button yellow-background">Sólo Días</button>
        <button onClick={() => setSelectedFormat('seconds')} className="format-button aqua-background">Sólo Segundos</button>
        <button onClick={() => setSelectedFormat('hours')} className="format-button red-background">Sólo Horas</button>
        <button onClick={() => setSelectedFormat('text')} className="format-button text-background">Formato Texto</button>
      </div>
      <button 
        className="copy-button" 
        onClick={handleCopy}
        onMouseOver={() => setCopyMessage('Copia esta info y difunde la esperanza')}
        onMouseOut={() => setCopyMessage('')}
      >
        {copyMessage || 'Copiar al Portapapeles'}
      </button>
    </div>
  );
};

export default Countdown;
