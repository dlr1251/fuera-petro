import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/countdown.css';
import CountdownDays from './CountdownDays';
import CountdownSeconds from './CountdownSeconds';
import CountdownHours from './CountdownHours';
import CountdownText from './CountdownText';
import CountdownTimeline from './CountdownTimeline';
import CountdownProgressBars from './CountdownProgressBars';
import CountdownCircular from './CountdownCircular';
import CountdownPercentage from './CountdownPercentage';
import CountdownCalendar from './CountdownCalendar';
import CountdownAnalogClock from './CountdownAnalogClock';
import CountdownDigitalClock from './CountdownDigitalClock';
import CountdownCompact from './CountdownCompact';
import CountdownExpanded from './CountdownExpanded';
import CountdownParticles from './CountdownParticles';

const TARGET_DATE = '2026-08-07';

const Countdown = () => {
  const [selectedFormat, setSelectedFormat] = useState('default');
  const [copyMessage, setCopyMessage] = useState('');
  const formatRef = useRef(null);
  const previousTimeRef = useRef(null);

  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(TARGET_DATE) - +new Date();
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
  }, []);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();

      // Only update if values actually changed to prevent unnecessary re-renders
      const hasChanged = !previousTimeRef.current ||
        Object.keys(newTimeLeft).some(key =>
          previousTimeRef.current[key] !== newTimeLeft[key]
        );

      if (hasChanged) {
        previousTimeRef.current = newTimeLeft;
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on the trigger button or if dropdown is not open
      if (!isDropdownOpen || event.target.closest('.category-trigger')) {
        return;
      }

      if (!event.target.closest('.category-selector')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleFormatChange = useCallback((format) => {
    if (format !== selectedFormat) {
      setSelectedFormat(format);
    }
  }, [selectedFormat]);

  const handleCopy = useCallback(async () => {
    try {
      const formatElement = formatRef.current?.querySelector('.time-format-segment');
      const defaultElement = formatRef.current?.querySelector('.countdown-timer');
      
      let textToCopy = '';
      
      if (formatElement) {
        textToCopy = formatElement.innerText;
      } else if (defaultElement) {
        // Format the default countdown text
        const segments = defaultElement.querySelectorAll('.time-segment');
        const parts = Array.from(segments).map(seg => {
          const value = seg.querySelector('.time-value')?.textContent || '';
          const label = seg.querySelector('.time-label')?.textContent || '';
          return `${value} ${label}`;
        });
        textToCopy = parts.join(', ');
      }

      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        setCopyMessage('¡Copiado al portapapeles!');
        setTimeout(() => setCopyMessage(''), 3000);
      }
    } catch (err) {
      setCopyMessage('Error al copiar');
      setTimeout(() => setCopyMessage(''), 2000);
    }
  }, []);

  const handleKeyDown = useCallback((event, format) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFormatChange(format);
    }
  }, [handleFormatChange]);

  const [selectedCategory, setSelectedCategory] = useState('basic');

  const formatCategories = {
    basic: {
      label: '⏱️ Básico',
      description: 'Formatos simples y directos',
      formats: [
        { id: 'default', label: 'Completo', icon: '📅' },
        { id: 'days', label: 'Días', icon: '📆' },
        { id: 'hours', label: 'Horas', icon: '🕐' },
        { id: 'compact', label: 'Compacto', icon: '📏' },
      ],
    },
    graphics: {
      label: '📊 Gráficos',
      description: 'Visualizaciones avanzadas',
      formats: [
        { id: 'timeline', label: 'Timeline', icon: '📈' },
        { id: 'progress-bars', label: 'Barras', icon: '📊' },
        { id: 'circular', label: 'Círculos', icon: '⭕' },
        { id: 'percentage', label: 'Porcentaje', icon: '📈' },
      ],
    },
    advanced: {
      label: '⚡ Avanzado',
      description: 'Herramientas especializadas',
      formats: [
        { id: 'calendar', label: 'Calendario', icon: '📅' },
        { id: 'analog-clock', label: 'Reloj Analógico', icon: '🕰️' },
        { id: 'digital-clock', label: 'Reloj Digital', icon: '🕒' },
        { id: 'expanded', label: 'Expandido', icon: '🔍' },
      ],
    },
    fun: {
      label: '🎨 Creativo',
      description: 'Formatos divertidos',
      formats: [
        { id: 'particles', label: 'Partículas', icon: '✨' },
        { id: 'text', label: 'Texto Creativo', icon: '📝' },
        { id: 'seconds', label: 'Segundos', icon: '⚡' },
      ],
    },
  };

  const renderFormat = () => {
    const baseProps = { 
      'aria-live': 'polite',
      'aria-atomic': 'true'
    };

    switch (selectedFormat) {
      case 'days':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownDays 
              days={Math.floor((+new Date(TARGET_DATE) - +new Date()) / (1000 * 60 * 60 * 24))} 
            />
          </div>
        );
      case 'seconds':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownSeconds 
              seconds={Math.floor((+new Date(TARGET_DATE) - +new Date()) / 1000)} 
            />
          </div>
        );
      case 'hours':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownHours 
              hours={Math.floor((+new Date(TARGET_DATE) - +new Date()) / (1000 * 60 * 60))} 
            />
          </div>
        );
      case 'text':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownText timeLeft={timeLeft} />
          </div>
        );
      case 'timeline':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownTimeline timeLeft={timeLeft} />
          </div>
        );
      case 'progress-bars':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownProgressBars timeLeft={timeLeft} />
          </div>
        );
      case 'circular':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownCircular timeLeft={timeLeft} />
          </div>
        );
      case 'percentage':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownPercentage />
          </div>
        );
      case 'calendar':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownCalendar />
          </div>
        );
      case 'analog-clock':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownAnalogClock timeLeft={timeLeft} />
          </div>
        );
      case 'digital-clock':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownDigitalClock />
          </div>
        );
      case 'compact':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownCompact timeLeft={timeLeft} />
          </div>
        );
      case 'expanded':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownExpanded timeLeft={timeLeft} />
          </div>
        );
      case 'particles':
        return (
          <div ref={formatRef} {...baseProps}>
            <CountdownParticles timeLeft={timeLeft} />
          </div>
        );
      default:
        return (
          <div 
            ref={formatRef}
            className="countdown-timer"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Cuenta regresiva completa"
          >
            {Object.keys(timeLeft).map(interval => (
              <div 
                key={interval} 
                className="time-segment"
                aria-label={`${timeLeft[interval]} ${interval}`}
              >
                <span className="time-value" aria-hidden="true">
                  {timeLeft[interval]}
                </span>
                <span className="time-label">{interval}</span>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="countdown-container" role="main">
      <h1 className="countdown-title">
        Al gobierno Petro le faltan...
      </h1>

      {/* Shadcn-inspired Format Toolbar */}
      <section className="format-toolbar" aria-label="Selector de formatos de cuenta regresiva">
        <div className="toolbar-shell">
          <div className="toolbar-header">
            <div className="category-selector" data-state={isDropdownOpen ? 'open' : 'closed'}>
              <button
                className="category-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="menu"
                type="button"
              >
                <span className="category-trigger-icon" aria-hidden="true">
                  {formatCategories[selectedCategory].label.split(' ')[0]}
                </span>
                <span className="category-trigger-text">
                  {formatCategories[selectedCategory].label.split(' ')[1] || formatCategories[selectedCategory].label}
                </span>
                <span className="dropdown-arrow" aria-hidden="true">▼</span>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu" role="menu">
                  {Object.entries(formatCategories).map(([categoryKey, category]) => {
                    const [icon, label] = category.label.split(' ');
                    return (
                      <button
                        key={categoryKey}
                        className={`dropdown-item ${selectedCategory === categoryKey ? 'active' : ''}`}
                        role="menuitemradio"
                        aria-checked={selectedCategory === categoryKey}
                        onClick={() => {
                          setSelectedCategory(categoryKey);
                          setIsDropdownOpen(false);
                        }}
                        type="button"
                      >
                        <span className="dropdown-icon" aria-hidden="true">{icon}</span>
                        <div className="dropdown-copy">
                          <span className="dropdown-text">{label || category.label}</span>
                          <span className="dropdown-description">{category.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="toolbar-meta">
              <span className="toolbar-chip">Formatos</span>
              <span className="toolbar-hint">{formatCategories[selectedCategory].description}</span>
            </div>
          </div>

          <div
            className="toolbar-buttons"
            role="radiogroup"
            aria-label={`Formatos disponibles en ${formatCategories[selectedCategory].label}`}
          >
            {formatCategories[selectedCategory].formats.map((format) => (
              <button
                key={format.id}
                className={`toolbar-button ${selectedFormat === format.id ? 'active' : ''}`}
                onClick={() => handleFormatChange(format.id)}
                onKeyDown={(e) => handleKeyDown(e, format.id)}
                role="radio"
                aria-checked={selectedFormat === format.id}
                type="button"
              >
                <span className="toolbar-button-icon" aria-hidden="true">{format.icon}</span>
                <span className="toolbar-button-label">{format.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown Display */}
      <div className="countdown-display-wrapper">
        <div className="format-transition-container" key={selectedFormat}>
          {renderFormat()}
        </div>
      </div>

      <button
        className="copy-button"
        onClick={handleCopy}
        onMouseEnter={() => {
          if (!copyMessage) {
            setCopyMessage('Copia esta info y difunde la esperanza');
          }
        }}
        onMouseLeave={() => {
          if (copyMessage && !copyMessage.includes('¡Copiado')) {
            setCopyMessage('');
          }
        }}
        aria-label="Copiar información de la cuenta regresiva al portapapeles"
        type="button"
      >
        {copyMessage || 'Copiar al Portapapeles'}
      </button>
    </div>
  );
};

export default Countdown;
