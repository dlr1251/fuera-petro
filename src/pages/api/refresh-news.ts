import type { APIRoute } from 'astro';
import { searchNewsWithGrok } from '../../lib/grokClient';
import { addNewsBulk, getAllNews, getLastUpdateTime } from '../../lib/newsStorage';

export const POST: APIRoute = async () => {
  try {
    const apiKey = import.meta.env.XAI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'API key no configurada',
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Search for new news using Grok API
    let newsItems;
    try {
      newsItems = await searchNewsWithGrok(apiKey);
    } catch (error) {
      console.error('Error searching news with Grok:', error);
      // Return existing news even if search fails
      const allNews = getAllNews();
      const lastUpdate = getLastUpdateTime();
      return new Response(JSON.stringify({
        success: false,
        error: 'Error al buscar noticias en Grok API',
        message: error instanceof Error ? error.message : 'Unknown error',
        news: allNews,
        lastUpdate,
        addedCount: 0,
        totalCount: allNews.length,
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Add new news to storage (duplicates are automatically filtered)
    const addedNews = addNewsBulk(newsItems);
    
    // Get all news sorted by date
    const allNews = getAllNews();
    const lastUpdate = getLastUpdateTime();
    
    return new Response(JSON.stringify({
      success: true,
      news: allNews,
      added: addedNews,
      addedCount: addedNews.length,
      totalCount: allNews.length,
      lastUpdate,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error refreshing news:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al actualizar noticias',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

