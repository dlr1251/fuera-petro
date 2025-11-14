import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';
import NewsTimeline from './NewsTimeline';

const App = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">⏱️ Cuenta Regresiva Petro</h1>
          <p className="app-subtitle">Cuánto le queda al gobierno de Gustavo Petro</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Countdown Section */}
        <section className="countdown-section">
          {isClient ? <Countdown /> : (
            <div className="countdown-container-compact">
              <h2 className="countdown-title-compact">
                Al gobierno Petro le faltan...
              </h2>
              <div className="countdown-display-wrapper-compact">
                <div className="countdown-timer-compact" role="timer" aria-live="polite" aria-atomic="true" aria-label="Cuenta regresiva completa">
                  Cargando cuenta regresiva...
                </div>
              </div>
            </div>
          )}
        </section>

        {/* News Section */}
        <section className="news-section">
          <div className="news-section-header">
            <h2 className="news-section-title">📰 Últimas Noticias</h2>
            <p className="news-section-subtitle">Mantente informado sobre el gobierno actual</p>
          </div>
          <NewsTimeline />
        </section>
      </main>
    </div>
  );
};

export default App;

