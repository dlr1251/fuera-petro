const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

export interface GrokNewsItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  date: string;
  category: 'error' | 'corruption';
}

export async function searchNewsHistoricalWithGrok(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<GrokNewsItem[]> {
  const prompt = `Utiliza tu capacidad de búsqueda en tiempo real para encontrar todas las noticias relevantes sobre errores y escándalos de corrupción del gobierno de Gustavo Petro desde ${startDate} hasta ${endDate}.

INSTRUCCIONES:
1. Busca en X (Twitter), noticias web y medios de comunicación colombianos.
2. Solo incluye noticias de fuentes serias y reconocidas como:
   - El Tiempo, El Espectador, Semana, La República, El Colombiano
   - El País (Colombia), Noticias Caracol, RCN, Blu Radio
   - Reuters, AP, BBC (edición Colombia)
   - Portafolio, Dinero, La Silla Vacía
   - Otros medios serios y verificados
3. Las noticias deben ser sobre:
   - Errores del gobierno de Petro
   - Escándalos de corrupción
   - Casos de corrupción en su administración
   - Investigaciones y denuncias relacionadas
4. IMPORTANTE: Solo incluye noticias publicadas entre ${startDate} y ${endDate} (inclusive).
5. Para cada noticia encontrada, proporciona:
   - Título: Título exacto de la noticia
   - Resumen: Resumen breve de 2-3 oraciones con los hechos principales
   - Fuente: Nombre del medio de comunicación
   - URL: URL completa y verificada de la noticia
   - Fecha: Fecha de publicación en formato YYYY-MM-DD (debe estar dentro del rango especificado)
   - Categoría: "error" o "corruption" según corresponda
6. Responde SOLO en formato JSON válido, sin texto adicional:
[
  {
    "title": "Título de la noticia",
    "summary": "Resumen de la noticia",
    "source": "Nombre del medio",
    "url": "URL de la noticia",
    "date": "YYYY-MM-DD",
    "category": "error" o "corruption"
  }
]
7. Máximo 20 noticias del período especificado.
8. Si no encuentras noticias en ese período, devuelve un array vacío [].
9. Verifica que las URLs sean válidas y accesibles.
10. Prioriza las noticias más importantes y relevantes del período.`;

  try {
    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-4-fast-reasoning',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente experto en buscar y resumir noticias históricas de Colombia. Tienes acceso a información archivada y fuentes web. Respondes siempre en formato JSON válido. Buscas información real y verificada de fuentes serias.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', response.status, errorText);
      throw new Error(`Grok API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Try to extract JSON from the response
    let newsItems: GrokNewsItem[] = [];

    try {
      // Try to parse as JSON directly
      newsItems = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        newsItems = JSON.parse(jsonMatch[1]);
      } else {
        // Try to find JSON array in the content
        const arrayMatch = content.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          newsItems = JSON.parse(arrayMatch[0]);
        }
      }
    }

    // Validate and filter news items
    if (!Array.isArray(newsItems)) {
      console.error('Invalid response format from Grok API:', typeof newsItems);
      return [];
    }

    // Validate each news item and ensure dates are within range
    const validNewsItems = newsItems.filter(item => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      // Check if date is within the specified range
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (itemDate < start || itemDate > end) {
        return false;
      }

      return (
        item.title &&
        typeof item.title === 'string' &&
        item.summary &&
        typeof item.summary === 'string' &&
        item.source &&
        typeof item.source === 'string' &&
        item.url &&
        typeof item.url === 'string' &&
        item.date &&
        typeof item.date === 'string' &&
        (item.category === 'error' || item.category === 'corruption')
      );
    });

    if (validNewsItems.length === 0 && newsItems.length > 0) {
      console.warn(`No valid news items found after filtering for date range ${startDate} to ${endDate}`);
    }

    return validNewsItems;
  } catch (error) {
    console.error('Error searching historical news with Grok:', error);
    if (error instanceof Error) {
      throw new Error(`Error al buscar noticias históricas: ${error.message}`);
    }
    throw new Error('Error desconocido al buscar noticias históricas');
  }
}

export async function validateNewsUrl(url: string): Promise<boolean> {
  try {
    // Basic URL validation
    const urlObj = new URL(url);

    // Check if it's a valid HTTP/HTTPS URL
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Perform a HEAD request to check if the URL is accessible
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsValidator/1.0)',
      },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    // Consider it valid if we get any response (even redirects are ok)
    // We don't check for specific status codes since news sites might return various codes
    return response.status < 400 || response.status >= 500; // Allow 2xx, 3xx, and some 5xx

  } catch (error) {
    console.warn(`URL validation failed for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export async function validateNewsItems(newsItems: GrokNewsItem[]): Promise<GrokNewsItem[]> {
  const validationPromises = newsItems.map(async (item) => {
    const isValidUrl = await validateNewsUrl(item.url);
    return {
      ...item,
      urlValid: isValidUrl,
    };
  });

  const validatedItems = await Promise.all(validationPromises);

  // Filter out items with invalid URLs
  const validItems = validatedItems.filter(item => item.urlValid);

  if (validItems.length < newsItems.length) {
    console.warn(`Filtered out ${newsItems.length - validItems.length} news items with invalid URLs`);
  }

  // Remove the temporary urlValid property
  return validItems.map(({ urlValid, ...item }) => item);
}

export async function searchNewsWithGrok(apiKey: string): Promise<GrokNewsItem[]> {
  const prompt = `Utiliza tu capacidad de búsqueda en tiempo real para encontrar las noticias más recientes y relevantes sobre errores y escándalos de corrupción del gobierno de Gustavo Petro desde agosto 2022.

INSTRUCCIONES:
1. Busca en X (Twitter), noticias web y medios de comunicación colombianos.
2. Solo incluye noticias de fuentes serias y reconocidas como:
   - El Tiempo, El Espectador, Semana, La República, El Colombiano
   - El País (Colombia), Noticias Caracol, RCN, Blu Radio
   - Reuters, AP, BBC (edición Colombia)
   - Portafolio, Dinero, La Silla Vacía
   - Otros medios serios y verificados
3. Las noticias deben ser sobre:
   - Errores del gobierno de Petro
   - Escándalos de corrupción
   - Casos de corrupción en su administración
   - Investigaciones y denuncias relacionadas
4. Para cada noticia encontrada, proporciona:
   - Título: Título exacto de la noticia
   - Resumen: Resumen breve de 2-3 oraciones con los hechos principales
   - Fuente: Nombre del medio de comunicación
   - URL: URL completa y verificada de la noticia
   - Fecha: Fecha de publicación en formato YYYY-MM-DD
   - Categoría: "error" o "corruption" según corresponda
5. Responde SOLO en formato JSON válido, sin texto adicional:
[
  {
    "title": "Título de la noticia",
    "summary": "Resumen de la noticia",
    "source": "Nombre del medio",
    "url": "URL de la noticia",
    "date": "YYYY-MM-DD",
    "category": "error" o "corruption"
  }
]
6. Máximo 15 noticias recientes y relevantes.
7. Si no encuentras noticias, devuelve un array vacío [].
8. Verifica que las URLs sean válidas y accesibles.
9. Prioriza noticias de los últimos 3 meses, pero incluye noticias importantes desde agosto 2022.`;

  try {
    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-4-fast-reasoning', // Grok 4 Fast Reasoning - optimized for complex reasoning tasks
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente experto en buscar y resumir noticias de Colombia. Tienes acceso a información actualizada de X (Twitter) y fuentes web. Respondes siempre en formato JSON válido. Buscas información real y verificada de fuentes serias.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000, // Increased for better reasoning capabilities
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', response.status, errorText);
      throw new Error(`Grok API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Try to extract JSON from the response
    let newsItems: GrokNewsItem[] = [];
    
    try {
      // Try to parse as JSON directly
      newsItems = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        newsItems = JSON.parse(jsonMatch[1]);
      } else {
        // Try to find JSON array in the content
        const arrayMatch = content.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          newsItems = JSON.parse(arrayMatch[0]);
        }
      }
    }
    
    // Validate and filter news items
    if (!Array.isArray(newsItems)) {
      console.error('Invalid response format from Grok API:', typeof newsItems);
      return [];
    }
    
    // Validate each news item
    const validNewsItems = newsItems.filter(item => {
      if (!item || typeof item !== 'object') {
        return false;
      }
      
      return (
        item.title &&
        typeof item.title === 'string' &&
        item.summary &&
        typeof item.summary === 'string' &&
        item.source &&
        typeof item.source === 'string' &&
        item.url &&
        typeof item.url === 'string' &&
        item.date &&
        typeof item.date === 'string' &&
        (item.category === 'error' || item.category === 'corruption')
      );
    });
    
    if (validNewsItems.length === 0 && newsItems.length > 0) {
      console.warn('No valid news items found after filtering');
    }
    
    return validNewsItems;
  } catch (error) {
    console.error('Error searching news with Grok:', error);
    // Return empty array instead of throwing to prevent breaking the app
    if (error instanceof Error) {
      throw new Error(`Error al buscar noticias: ${error.message}`);
    }
    throw new Error('Error desconocido al buscar noticias');
  }
}

