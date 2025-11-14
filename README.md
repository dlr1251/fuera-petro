# Final Petro - Countdown y Timeline de Noticias

Aplicación web que muestra una cuenta regresiva para el fin del gobierno de Petro y un timeline completo de noticias sobre errores y escándalos de corrupción usando la API de Grok (xAI).

## Características

- ⏱️ **Countdown**: Cuenta regresiva hasta el fin del gobierno de Petro (2026-08-07)
- 📰 **Timeline de Noticias**: Timeline completo de noticias desde agosto 2022
- 🔄 **Actualización Automática**: Búsqueda automática de noticias cada 2 horas
- 📊 **Base de Datos Histórica**: Más de 1000+ noticias organizadas por fecha
- 🔍 **Búsqueda y Filtros**: Búsqueda por texto, filtrado por fecha y categoría
- 📄 **Paginación**: Navegación eficiente por grandes volúmenes de noticias
- ✅ **Validación de URLs**: Verificación automática de enlaces funcionales
- 🎨 **Navegación Moderna**: Sistema de navegación estructurado con categorías visuales
- 📱 **Responsive**: Diseño adaptativo para móviles y tablets
- 🔗 **Compartir en Redes Sociales**: Botones para compartir en X, Facebook, WhatsApp y LinkedIn

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente variable:

```env
XAI_API_KEY=tu_clave_api_de_xai_aqui
```

### 2. Instalación

```bash
npm install
```

### 3. Extraer Noticias Históricas (Obligatorio para primera ejecución)

Antes de ejecutar la aplicación, es necesario poblar la base de datos con todas las noticias históricas desde agosto 2022:

```bash
npm run extract-news
```

Este comando:
- Extrae todas las noticias desde agosto 2022 hasta hoy
- Divide el período en rangos mensuales para búsquedas más precisas
- Valida automáticamente todos los enlaces
- Puede tardar varios minutos dependiendo del volumen de noticias

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

### 5. Construir para Producción

```bash
npm run build
```

### 6. Vista Previa de Producción

```bash
npm run preview
```

## Estructura del Proyecto

```
final-petro/
├── extract-historical-news.js   # Script para extracción histórica de noticias
├── src/
│   ├── components/
│   │   ├── App.jsx              # Componente principal con navegación
│   │   ├── Navigation.jsx       # Navegación entre countdown y timeline
│   │   ├── Countdown.jsx        # Componente de cuenta regresiva
│   │   ├── NewsTimeline.jsx     # Timeline de noticias
│   │   ├── NewsCard.jsx         # Tarjeta individual de noticia
│   │   └── ShareButton.jsx      # Botón para compartir en redes sociales
│   ├── lib/
│   │   ├── grokClient.ts        # Cliente para API de Grok con validación de URLs
│   │   └── newsStorage.ts       # Sistema de almacenamiento con filtros y paginación
│   ├── pages/
│   │   ├── index.astro          # Página principal
│   │   └── api/
│   │       ├── get-news.ts      # API endpoint con paginación y filtros
│   │       ├── search-news.ts   # API endpoint para buscar noticias
│   │       └── refresh-news.ts  # API endpoint para actualizar noticias
│   └── styles/
│       ├── global.css           # Estilos globales
│       ├── countdown.css        # Estilos del countdown
│       └── timeline.css         # Estilos del timeline
├── data/
│   ├── news.json                # Archivo de almacenamiento de noticias
│   └── extraction-summary.json  # Resumen de la última extracción histórica
└── .env                         # Variables de entorno (no incluido en git)
```

## API de Grok

La aplicación usa la API de Grok (xAI) con el modelo **grok-4-fast-reasoning** para buscar noticias en tiempo real sobre errores y escándalos de corrupción del gobierno de Petro.

### Modelo Utilizado

El modelo por defecto es `grok-4-fast-reasoning`, que es una versión optimizada del modelo Grok 4 con capacidades de razonamiento profundo. Este modelo:
- Genera tokens de pensamiento para análisis paso a paso
- Tiene una ventana de contexto de 2 millones de tokens
- Está optimizado para búsquedas en tiempo real en X (Twitter) y fuentes web
- Proporciona respuestas más precisas y detalladas

Puedes cambiarlo en `src/lib/grokClient.ts` si necesitas usar otro modelo como `grok-4-fast-non-reasoning` (más rápido pero con menos razonamiento).

### Endpoints de la API

#### GET /api/get-news
Obtiene noticias con paginación y filtros avanzados.

**Parámetros de consulta:**
- `page` (number): Página actual (por defecto: 1)
- `pageSize` (number): Elementos por página, máximo 100 (por defecto: 20)
- `startDate` (string): Fecha de inicio en formato YYYY-MM-DD
- `endDate` (string): Fecha de fin en formato YYYY-MM-DD
- `category` (string): Filtrar por categoría ("error" o "corruption")
- `search` (string): Búsqueda de texto en título, resumen o fuente

**Respuesta:**
```json
{
  "success": true,
  "news": [...],
  "total": 1250,
  "page": 1,
  "pageSize": 20,
  "totalPages": 63,
  "hasNext": true,
  "hasPrev": false,
  "stats": {
    "total": 1250,
    "byCategory": {"error": 750, "corruption": 500},
    "dateRange": {"earliest": "2022-08-01", "latest": "2024-11-14"},
    "lastUpdated": "2024-11-14T10:30:00.000Z"
  }
}
```

#### POST /api/search-news
Busca nuevas noticias usando Grok API.

#### POST /api/refresh-news
Actualiza las noticias y devuelve las nuevas encontradas.

## Almacenamiento

Las noticias se almacenan en un archivo JSON en `data/news.json`. Este archivo se crea automáticamente cuando se ejecuta la aplicación por primera vez.

## Navegación Moderna del Countdown

La aplicación cuenta con un sistema de navegación moderno y estructurado para los diferentes formatos del countdown:

### 🏗️ **Estructura Jerárquica**
1. **Header de Categorías**: Vista general de todas las categorías disponibles
2. **Navegación por Tabs**: Selector visual de categorías activas
3. **Panel de Opciones**: Grid responsivo con todas las opciones de formato

### 📱 **Categorías Disponibles**
- **⏱️ Básico**: Formatos simples y directos (Completo, Días, Horas, Compacto)
- **📊 Gráficos**: Visualizaciones avanzadas (Timeline, Barras, Círculos, Porcentaje)
- **⚡ Avanzado**: Herramientas especializadas (Calendario, Relojes, Expandido)
- **🎨 Creativo**: Formatos divertidos (Partículas, Texto Creativo, Segundos)

### 🎯 **Características de la Navegación**
- **Accesibilidad Total**: Navegación por teclado y lectores de pantalla
- **Responsive Design**: Adaptable a todos los tamaños de pantalla
- **Transiciones Suaves**: Animaciones elegantes entre estados
- **Estados Visuales Claros**: Indicadores visuales para elementos activos
- **Feedback Interactivo**: Efectos hover y focus mejorados

## Características del Timeline

- **Búsqueda Automática**: Las noticias se actualizan automáticamente cada 2 horas
- **Actualización Manual**: Botón para actualizar manualmente las noticias
- **Filtrado de Fuentes**: Solo se incluyen noticias de fuentes serias y reconocidas
- **Categorización**: Las noticias se categorizan como "error" o "corrupción"
- **Compartir**: Botones para compartir cada noticia en redes sociales

## Notas

- El archivo `.env` no debe incluirse en el control de versiones por seguridad
- El directorio `data/` se crea automáticamente cuando se ejecuta la aplicación
- Las noticias se ordenan por fecha, mostrando las más recientes primero
- Las noticias duplicadas se filtran automáticamente por URL

## Tecnologías Utilizadas

- **Astro**: Framework web
- **React**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **xAI API (grok-4-fast-reasoning)**: Búsqueda de noticias en tiempo real con capacidades de razonamiento profundo

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
