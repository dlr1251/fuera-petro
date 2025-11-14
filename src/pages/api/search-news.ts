import type { APIRoute } from 'astro';
import { searchNewsWithGrok } from '../../lib/grokClient';
import { addNewsBulk } from '../../lib/newsStorage';

export const POST: APIRoute = async ({ request }) => {
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
    
    const body = await request.json();
    const { query } = body || {};
    
    // Search news using Grok API
    const newsItems = await searchNewsWithGrok(apiKey);
    
    // Add news to storage
    const addedNews = addNewsBulk(newsItems);
    
    return new Response(JSON.stringify({
      success: true,
      news: addedNews,
      count: addedNews.length,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error searching news:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al buscar noticias',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

