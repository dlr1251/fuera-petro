import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root directory (two levels up from src/lib)
// In Astro, __dirname points to the compiled dist folder, so we need to resolve from process.cwd()
const PROJECT_ROOT = process.cwd();
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');

// Ensure data directory exists (lazy initialization)
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(NEWS_FILE)) {
    fs.writeFileSync(NEWS_FILE, JSON.stringify([], null, 2));
  }
}

// Initialize on first access
ensureDataDir();

function readNews() {
  try {
    ensureDataDir();
    const data = fs.readFileSync(NEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading news file:', error);
    return [];
  }
}

function writeNews(news) {
  try {
    ensureDataDir();
    fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2));
  } catch (error) {
    console.error('Error writing news file:', error);
    throw error;
  }
}

export function getAllNews() {
  return readNews().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNewsById(id) {
  const news = readNews();
  return news.find(item => item.id === id);
}

export function addNews(newsItem) {
  const news = readNews();

  // Check if news already exists (by URL)
  const exists = news.some(item => item.url === newsItem.url);
  if (exists) {
    throw new Error('News item already exists');
  }

  const newItem = {
    ...newsItem,
    id: generateId(),
    dateObtained: new Date().toISOString(),
  };

  news.push(newItem);
  writeNews(news);
  return newItem;
}

export function addNewsBulk(newsItems) {
  const news = readNews();
  const existingUrls = new Set(news.map(item => item.url));

  const newItems = newsItems
    .filter(item => !existingUrls.has(item.url))
    .map(item => ({
      ...item,
      id: generateId(),
      dateObtained: new Date().toISOString(),
    }));

  if (newItems.length > 0) {
    news.push(...newItems);
    writeNews(news);
  }

  return newItems;
}

export function deleteNews(id) {
  const news = readNews();
  const index = news.findIndex(item => item.id === id);

  if (index === -1) {
    return false;
  }

  news.splice(index, 1);
  writeNews(news);
  return true;
}

export function getLastUpdateTime() {
  const news = readNews();
  if (news.length === 0) {
    return null;
  }

  const dates = news.map(item => new Date(item.dateObtained).getTime());
  const latest = new Date(Math.max(...dates));
  return latest.toISOString();
}

export function getFilteredNews(filters = {}) {
  let news = readNews();

  // Filter by date range
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    news = news.filter(item => new Date(item.date) >= startDate);
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    // Set end date to end of day
    endDate.setHours(23, 59, 59, 999);
    news = news.filter(item => new Date(item.date) <= endDate);
  }

  // Filter by category
  if (filters.category) {
    news = news.filter(item => item.category === filters.category);
  }

  // Filter by search term (title or summary)
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    news = news.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.summary.toLowerCase().includes(searchTerm) ||
      item.source.toLowerCase().includes(searchTerm)
    );
  }

  // Sort by date (newest first)
  return news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPaginatedNews(
  page = 1,
  pageSize = 20,
  filters = {}
) {
  const filteredNews = getFilteredNews(filters);
  const total = filteredNews.length;
  const totalPages = Math.ceil(total / pageSize);

  // Ensure page is within bounds
  const safePage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const news = filteredNews.slice(startIndex, endIndex);

  return {
    news,
    total,
    page: safePage,
    pageSize,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

export function getNewsStats() {
  const news = readNews();

  if (news.length === 0) {
    return {
      total: 0,
      byCategory: { error: 0, corruption: 0 },
      dateRange: { earliest: null, latest: null },
      lastUpdated: null,
    };
  }

  const dates = news.map(item => new Date(item.date).getTime());
  const earliest = new Date(Math.min(...dates)).toISOString().split('T')[0];
  const latest = new Date(Math.max(...dates)).toISOString().split('T')[0];

  const byCategory = news.reduce(
    (acc, item) => {
      acc[item.category]++;
      return acc;
    },
    { error: 0, corruption: 0 }
  );

  return {
    total: news.length,
    byCategory,
    dateRange: { earliest, latest },
    lastUpdated: getLastUpdateTime(),
  };
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
