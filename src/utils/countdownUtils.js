const TARGET_DATE = '2026-08-07';
const START_DATE = '2022-08-07'; // Fecha de inicio del gobierno

/**
 * Calcula el tiempo restante hasta la fecha objetivo de manera más precisa
 */
export const calculateTimeLeft = () => {
  const now = new Date();
  const target = new Date(TARGET_DATE);
  const difference = target - now;

  let timeLeft = {};

  if (difference > 0) {
    // Cálculos más precisos
    const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));

    // Calcular años de manera más precisa
    let years = 0;
    let tempDate = new Date(now);
    while (tempDate < target) {
      tempDate.setFullYear(tempDate.getFullYear() + 1);
      if (tempDate <= target) {
        years++;
      } else {
        break;
      }
    }

    // Calcular meses restantes después de quitar los años
    tempDate = new Date(now);
    tempDate.setFullYear(tempDate.getFullYear() + years);
    let months = 0;
    while (tempDate < target) {
      tempDate.setMonth(tempDate.getMonth() + 1);
      if (tempDate <= target) {
        months++;
      } else {
        break;
      }
    }

    // Calcular días restantes después de quitar años y meses
    tempDate = new Date(now);
    tempDate.setFullYear(tempDate.getFullYear() + years);
    tempDate.setMonth(tempDate.getMonth() + months);

    const days = Math.floor((target - tempDate) / (1000 * 60 * 60 * 24));
    const remainingMs = target - new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, now.getHours(), now.getMinutes(), now.getSeconds());

    timeLeft = {
      años: years,
      meses: months,
      semanas: Math.floor(days / 7),
      días: days,
      horas: Math.floor(remainingMs / (1000 * 60 * 60)),
      minutos: Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)),
      segundos: Math.floor((remainingMs % (1000 * 60)) / 1000),
    };
  }

  return timeLeft;
};

/**
 * Calcula el porcentaje total completado
 */
export const calculatePercentage = () => {
  const now = +new Date();
  const start = +new Date(START_DATE);
  const end = +new Date(TARGET_DATE);
  const total = end - start;
  const elapsed = now - start;
  
  if (elapsed <= 0) return 0;
  if (elapsed >= total) return 100;
  
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
};

/**
 * Calcula el porcentaje para una unidad específica
 */
export const calculateUnitPercentage = (unit, value, maxValue) => {
  if (!maxValue || maxValue === 0) return 0;
  return Math.min(100, Math.max(0, (value / maxValue) * 100));
};

/**
 * Obtiene el total de días desde el inicio hasta el fin
 */
export const getTotalDays = () => {
  const start = +new Date(START_DATE);
  const end = +new Date(TARGET_DATE);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
};

/**
 * Obtiene los días transcurridos desde el inicio
 */
export const getElapsedDays = () => {
  const start = +new Date(START_DATE);
  const now = +new Date();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
};

/**
 * Obtiene los días restantes
 */
export const getRemainingDays = () => {
  const now = +new Date();
  const end = +new Date(TARGET_DATE);
  return Math.floor((end - now) / (1000 * 60 * 60 * 24));
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CO').format(num);
};

/**
 * Obtiene el nombre del mes en español
 */
export const getMonthName = (monthIndex) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthIndex] || '';
};

/**
 * Obtiene el nombre del día de la semana en español
 */
export const getDayName = (dayIndex) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayIndex] || '';
};

/**
 * Calcula los milestones importantes
 */
export const getMilestones = () => {
  const milestones = [];
  const now = new Date();
  const target = new Date(TARGET_DATE);
  
  // Milestones de años
  for (let year = now.getFullYear(); year <= target.getFullYear(); year++) {
    if (year !== now.getFullYear() && year !== target.getFullYear()) {
      milestones.push({
        date: new Date(year, 7, 7), // 7 de agosto de cada año
        label: `${year}`,
        type: 'year'
      });
    }
  }
  
  return milestones.sort((a, b) => a.date - b.date);
};

/**
 * Calcula el ángulo para un reloj analógico
 */
export const calculateClockAngle = (unit, value, maxValue) => {
  if (!maxValue || maxValue === 0) return 0;
  const percentage = value / maxValue;
  return percentage * 360;
};

/**
 * Obtiene estadísticas adicionales
 */
export const getStatistics = () => {
  const totalDays = getTotalDays();
  const elapsedDays = getElapsedDays();
  const remainingDays = getRemainingDays();
  const percentage = calculatePercentage();
  
  return {
    totalDays,
    elapsedDays,
    remainingDays,
    percentage: percentage.toFixed(2),
    weeksRemaining: Math.floor(remainingDays / 7),
    monthsRemaining: Math.floor(remainingDays / 30),
    yearsRemaining: Math.floor(remainingDays / 365)
  };
};

/**
 * Genera datos para el calendario
 */
export const getCalendarData = () => {
  const now = new Date();
  const target = new Date(TARGET_DATE);
  const days = [];
  
  // Generar días desde ahora hasta la fecha objetivo
  const currentDate = new Date(now);
  currentDate.setHours(0, 0, 0, 0);
  
  while (currentDate <= target) {
    days.push({
      date: new Date(currentDate),
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      dayOfWeek: currentDate.getDay(),
      isPast: currentDate < now,
      isToday: currentDate.toDateString() === now.toDateString(),
      isTarget: currentDate.toDateString() === target.toDateString()
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
};

/**
 * Calcula el tiempo en formato de reloj digital
 */
export const getDigitalTime = () => {
  const timeLeft = calculateTimeLeft();
  return {
    days: String(timeLeft.días).padStart(3, '0'),
    hours: String(timeLeft.horas).padStart(2, '0'),
    minutes: String(timeLeft.minutos).padStart(2, '0'),
    seconds: String(timeLeft.segundos).padStart(2, '0')
  };
};

