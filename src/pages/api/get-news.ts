import type { APIRoute } from 'astro';
import { getPaginatedNews, getNewsStats, type NewsFilters } from '../../lib/newsStorage';

export const GET: APIRoute = async ({ url }) => {
  try {
    // Parse query parameters
    const searchParams = url.searchParams;

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 100); // Max 100 per page

    // Filter parameters
    const filters: NewsFilters = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      category: (searchParams.get('category') as 'error' | 'corruption') || undefined,
      search: searchParams.get('search') || undefined,
    };

    // Get paginated and filtered results
    const result = getPaginatedNews(page, pageSize, filters);
    const stats = getNewsStats();

    return new Response(JSON.stringify({
      success: true,
      ...result,
      stats,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error getting news:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al obtener noticias',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

