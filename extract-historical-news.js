#!/usr/bin/env node

import { searchNewsHistoricalWithGrok, validateNewsItems } from './src/lib/grokClient.js';
import { addNewsBulk, getNewsStats } from './src/lib/newsStorage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.XAI_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: XAI_API_KEY environment variable is required');
  process.exit(1);
}

/**
 * Generate monthly date ranges from start date to end date
 */
function generateMonthlyRanges(startDate, endDate) {
  const ranges = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  let current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    const monthStart = new Date(current);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0); // Last day of month

    // Don't go beyond the end date
    const actualEnd = monthEnd > end ? end : monthEnd;

    ranges.push({
      start: monthStart.toISOString().split('T')[0],
      end: actualEnd.toISOString().split('T')[0],
    });

    // Move to next month
    current.setMonth(current.getMonth() + 1);
  }

  return ranges;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract news for a specific date range
 */
async function extractNewsForRange(startDate, endDate, rangeIndex, totalRanges) {
  console.log(`📅 [${rangeIndex + 1}/${totalRanges}] Buscando noticias del ${startDate} al ${endDate}...`);

  try {
    // Search for news in this date range
    const rawNewsItems = await searchNewsHistoricalWithGrok(API_KEY, startDate, endDate);

    if (rawNewsItems.length === 0) {
      console.log(`   ℹ️  No se encontraron noticias en este período`);
      return 0;
    }

    // Validate URLs
    console.log(`   🔗 Validando ${rawNewsItems.length} URLs...`);
    const validatedNewsItems = await validateNewsItems(rawNewsItems);

    if (validatedNewsItems.length === 0) {
      console.log(`   ⚠️  No se encontraron URLs válidas en este período`);
      return 0;
    }

    // Add to database
    const addedNews = addNewsBulk(validatedNewsItems);
    console.log(`   ✅ Agregadas ${addedNews.length} noticias nuevas (${validatedNewsItems.length - addedNews.length} duplicadas)`);

    return addedNews.length;

  } catch (error) {
    console.error(`   ❌ Error procesando rango ${startDate} - ${endDate}:`, error.message);
    return 0;
  }
}

/**
 * Main extraction function
 */
async function extractAllHistoricalNews() {
  console.log('🚀 Iniciando extracción histórica de noticias del gobierno Petro');
  console.log('📊 Fecha de inicio: Agosto 2022');
  console.log('📅 Fecha de fin: Hoy\n');

  // Get current stats
  const initialStats = getNewsStats();
  console.log('📈 Estadísticas iniciales:');
  console.log(`   Total de noticias: ${initialStats.total}`);
  console.log(`   Errores: ${initialStats.byCategory.error}`);
  console.log(`   Corrupción: ${initialStats.byCategory.corruption}`);
  console.log(`   Rango de fechas: ${initialStats.dateRange.earliest || 'N/A'} - ${initialStats.dateRange.latest || 'N/A'}\n`);

  // Define the date range: August 2022 to today
  const startDate = '2022-08-01';
  const endDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  // Generate monthly ranges
  const dateRanges = generateMonthlyRanges(startDate, endDate);
  console.log(`📅 Se procesarán ${dateRanges.length} períodos mensuales\n`);

  let totalNewNews = 0;
  let processedRanges = 0;

  // Process each date range
  for (const range of dateRanges) {
    const newNews = await extractNewsForRange(range.start, range.end, processedRanges, dateRanges.length);
    totalNewNews += newNews;
    processedRanges++;

    // Add a delay between requests to avoid rate limiting
    if (processedRanges < dateRanges.length) {
      console.log('⏳ Esperando 2 segundos antes de la siguiente solicitud...\n');
      await sleep(2000);
    }
  }

  // Get final stats
  const finalStats = getNewsStats();

  console.log('\n🎉 Extracción completada!');
  console.log('📈 Estadísticas finales:');
  console.log(`   Total de noticias: ${finalStats.total}`);
  console.log(`   Errores: ${finalStats.byCategory.error}`);
  console.log(`   Corrupción: ${finalStats.byCategory.corruption}`);
  console.log(`   Rango de fechas: ${finalStats.dateRange.earliest} - ${finalStats.dateRange.latest}`);
  console.log(`   Nuevas noticias agregadas: ${totalNewNews}`);
  console.log(`   Última actualización: ${finalStats.lastUpdated}`);

  // Save extraction summary
  const summary = {
    extractionDate: new Date().toISOString(),
    totalRanges: dateRanges.length,
    newNewsAdded: totalNewNews,
    finalStats,
    dateRanges: dateRanges,
  };

  const summaryPath = path.join(__dirname, 'data', 'extraction-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n💾 Resumen guardado en: ${summaryPath}`);
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Extracción histórica de noticias del gobierno Petro

Uso: node extract-historical-news.js [opciones]

Opciones:
  --help, -h     Mostrar esta ayuda
  --dry-run      Ejecutar sin guardar cambios (solo simulación)

Variables de entorno requeridas:
  XAI_API_KEY    Clave API de xAI (Grok)

El script extraerá todas las noticias desde agosto 2022 hasta hoy,
dividiendo el período en rangos mensuales para una búsqueda más precisa.
  `);
  process.exit(0);
}

if (args.includes('--dry-run')) {
  console.log('🔍 Modo simulación activado - no se guardarán cambios');
  // In dry-run mode, we would modify the functions to not actually save
  // For now, just show what would be done
  console.log('Para implementar dry-run, modificar las funciones para no guardar en la base de datos');
  process.exit(0);
}

// Run the extraction
extractAllHistoricalNews().catch(error => {
  console.error('❌ Error fatal durante la extracción:', error);
  process.exit(1);
});
