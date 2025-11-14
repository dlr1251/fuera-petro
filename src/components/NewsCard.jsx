import React from 'react';
import ShareButton from './ShareButton';

const NewsCard = ({ news }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    } else {
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getCategoryLabel = (category) => {
    return category === 'corruption' ? 'Corrupción' : 'Error';
  };

  const getCategoryColor = (category) => {
    return category === 'corruption' ? 'category-corruption' : 'category-error';
  };

  const handleCardClick = () => {
    window.open(news.url, '_blank');
  };

  return (
    <article className="news-card" onClick={handleCardClick}>
      <div className="news-card-header">
        <span className={`news-category ${getCategoryColor(news.category)}`}>
          {getCategoryLabel(news.category)}
        </span>
        <time className="news-date" dateTime={news.date}>
          {formatDate(news.date)}
        </time>
      </div>
      
      <h3 className="news-title">{news.title}</h3>
      
      <p className="news-summary">{news.summary}</p>
      
      <div className="news-card-footer">
        <div className="news-source">
          <span className="news-source-label">Fuente:</span>
          <span className="news-source-name">{news.source}</span>
        </div>
        
        <div className="news-share-buttons" onClick={(e) => e.stopPropagation()}>
          <ShareButton platform="x" title={news.title} url={news.url} summary={news.summary} />
          <ShareButton platform="facebook" title={news.title} url={news.url} summary={news.summary} />
          <ShareButton platform="whatsapp" title={news.title} url={news.url} summary={news.summary} />
          <ShareButton platform="linkedin" title={news.title} url={news.url} summary={news.summary} />
        </div>
      </div>
    </article>
  );
};

export default NewsCard;

