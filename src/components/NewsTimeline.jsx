import React, { useState, useEffect, useCallback } from 'react';
import NewsCard from './NewsCard';

const NewsTimeline = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/get-news');
      const data = await response.json();
      
      if (data.success) {
        setNews(data.news || []);
        setLastUpdate(data.lastUpdate || null);
      } else {
        setError(data.error || 'Error al cargar noticias');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Error al cargar noticias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refreshNews = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await fetch('/api/refresh-news', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        const previousCount = news.length;
        setNews(data.news || []);
        setLastUpdate(data.lastUpdate || null);
        if (data.addedCount > 0) {
          // Show notification if new news was added
          setNotification(`${data.addedCount} nueva${data.addedCount > 1 ? 's' : ''} noticia${data.addedCount > 1 ? 's' : ''} agregada${data.addedCount > 1 ? 's' : ''}`);
          setTimeout(() => setNotification(null), 5000);
        } else if (previousCount > 0 && (data.news || []).length === previousCount) {
          setNotification('No hay nuevas noticias disponibles');
          setTimeout(() => setNotification(null), 3000);
        }
      } else {
        setError(data.error || 'Error al actualizar noticias');
      }
    } catch (err) {
      console.error('Error refreshing news:', err);
      setError('Error al actualizar noticias');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Auto-refresh every 2 hours
  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh if page is visible
      if (!document.hidden) {
        refreshNews();
      }
    }, 2 * 60 * 60 * 1000); // 2 hours

    // Also refresh when page becomes visible after being hidden
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshNews();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshNews]);

  const formatLastUpdate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="news-timeline-loading">
        <p>Cargando noticias...</p>
      </div>
    );
  }

  return (
    <div className="news-timeline">
      <div className="news-timeline-header">
        <h2 className="news-timeline-title">Timeline de Noticias</h2>
        <div className="news-timeline-controls">
          <button
            onClick={refreshNews}
            disabled={refreshing}
            className="refresh-button"
            aria-label="Actualizar noticias"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="20"
              height="20"
              className={refreshing ? 'spinning' : ''}
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
          {lastUpdate && (
            <span className="last-update">
              Última actualización: {formatLastUpdate(lastUpdate)}
            </span>
          )}
        </div>
      </div>

      {notification && (
        <div className="news-timeline-notification">
          <p>{notification}</p>
        </div>
      )}

      {error && (
        <div className="news-timeline-error">
          <p>{error}</p>
          <button onClick={fetchNews}>Reintentar</button>
        </div>
      )}

      {news.length === 0 && !error && (
        <div className="news-timeline-empty">
          <p>No hay noticias disponibles. Haz clic en "Actualizar" para buscar noticias.</p>
          <button onClick={refreshNews} className="refresh-button">
            Buscar Noticias
          </button>
        </div>
      )}

      <div className="news-timeline-list">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );
};

export default NewsTimeline;

