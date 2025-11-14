import React, { useMemo } from 'react';
import { getStatistics, calculatePercentage } from '../utils/countdownUtils';

const CountdownExpanded = ({ timeLeft }) => {
  const stats = useMemo(() => getStatistics(), []);
  const percentage = useMemo(() => calculatePercentage(), []);

  return (
    <div 
      className="countdown-expanded"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Vista expandida con información detallada"
    >
      <div className="expanded-grid">
        <div className="expanded-card main-stats">
          <h3 className="card-title">Tiempo Restante</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{timeLeft.días}</div>
              <div className="stat-label">Días</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{timeLeft.horas}</div>
              <div className="stat-label">Horas</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{timeLeft.minutos}</div>
              <div className="stat-label">Minutos</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{timeLeft.segundos}</div>
              <div className="stat-label">Segundos</div>
            </div>
          </div>
        </div>

        <div className="expanded-card progress-card">
          <h3 className="card-title">Progreso General</h3>
          <div className="progress-circle-small">
            <div className="progress-value">{percentage.toFixed(2)}%</div>
            <div className="progress-label">Completado</div>
          </div>
        </div>

        <div className="expanded-card stats-card">
          <h3 className="card-title">Estadísticas</h3>
          <div className="stats-list">
            <div className="stat-row">
              <span className="stat-name">Días Totales:</span>
              <span className="stat-number">{stats.totalDays}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Días Transcurridos:</span>
              <span className="stat-number">{stats.elapsedDays}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Días Restantes:</span>
              <span className="stat-number">{stats.remainingDays}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Semanas Restantes:</span>
              <span className="stat-number">{stats.weeksRemaining}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Meses Restantes:</span>
              <span className="stat-number">{stats.monthsRemaining}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Años Restantes:</span>
              <span className="stat-number">{stats.yearsRemaining}</span>
            </div>
          </div>
        </div>

        <div className="expanded-card time-breakdown">
          <h3 className="card-title">Desglose de Tiempo</h3>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <span className="breakdown-label">Años:</span>
              <span className="breakdown-value">{timeLeft.años}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Meses:</span>
              <span className="breakdown-value">{timeLeft.meses}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Semanas:</span>
              <span className="breakdown-value">{timeLeft.semanas}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Días:</span>
              <span className="breakdown-value">{timeLeft.días}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownExpanded;

