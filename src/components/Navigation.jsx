import React from 'react';

const Navigation = ({ currentView, onViewChange }) => {
  return (
    <nav className="main-navigation" role="navigation" aria-label="Navegación principal">
      <button
        onClick={() => onViewChange('countdown')}
        className={`nav-button ${currentView === 'countdown' ? 'active' : ''}`}
        aria-pressed={currentView === 'countdown'}
        aria-label="Ver cuenta regresiva"
      >
        <span className="nav-button-icon">⏱️</span>
        <span className="nav-button-label">Countdown</span>
      </button>
      <button
        onClick={() => onViewChange('timeline')}
        className={`nav-button ${currentView === 'timeline' ? 'active' : ''}`}
        aria-pressed={currentView === 'timeline'}
        aria-label="Ver timeline de noticias"
      >
        <span className="nav-button-icon">📰</span>
        <span className="nav-button-label">Noticias</span>
      </button>
    </nav>
  );
};

export default Navigation;

