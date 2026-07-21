/**
 * Motor de Estadísticas y Gráficos (stats.js)
 * Procesa los logs para generar métricas y formatos compatibles con Chart.js.
 */

/**
 * Calcula la cantidad de acciones agrupadas por día para los últimos 'X' días.
 * @param {number} days - Número de días hacia atrás para calcular (por defecto 7).
 * @returns {object} Objeto con formato exacto para Chart.js: { labels: [], datasets: [{ label, data }] }.
 */
function getActivityByDay(days = 7) {
  try {
    const logs = JSON.parse(localStorage.getItem('edu_platform_logs') || '[]');
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      labels.push(dateStr);
      
      const count = logs.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        return logDate === dateStr;
      }).length;
      
      data.push(count);
    }
    
    return {
      labels: labels,
      datasets: [{
        label: 'Actividad Diaria',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 4
      }]
    };
  } catch (error) {
    console.error("Error al calcular actividad por día:", error);
    return { 
      labels: [], 
      datasets: [{ label: 'Actividad Diaria', data: [], backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 }] 
    };
  }
}

/**
 * Cuenta cuántas veces se ha accedido a cada clase (action: 'view_class').
 * @returns {Array} Array de objetos ordenados de mayor a menor popularidad: [{ className, views }].
 */
function getClassPopularity() {
  try {
    const logs = JSON.parse(localStorage.getItem('edu_platform_logs') || '[]');
    const classCounts = {};
    
    logs.forEach(log => {
      if (log.action === 'view_class' && log.target) {
        classCounts[log.target] = (classCounts[log.target] || 0) + 1;
      }
    });
    
    return Object.entries(classCounts)
      .map(([className, views]) => ({ className, views }))
      .sort((a, b) => b.views - a.views);
  } catch (error) {
    console.error("Error al calcular popularidad de clases:", error);
    return [];
  }
}

/**
 * Calcula métricas de compromiso (engagement) para un alumno específico.
 * @param {string} userId - Identificador único del usuario.
 * @returns {object} Objeto con { totalActions, activeDays, avgActionsPerDay }.
 */
function getUserEngagement(userId) {
  try {
    const logs = JSON.parse(localStorage.getItem('edu_platform_logs') || '[]');
    const userLogs = logs.filter(log => log.userId === String(userId));
    
    if (userLogs.length === 0) {
      return { totalActions: 0, activeDays: 0, avgActionsPerDay: 0 };
    }
    
    const activeDaysSet = new Set();
    userLogs.forEach(log => {
      const dateStr = new Date(log.timestamp).toISOString().split('T')[0];
      activeDaysSet.add(dateStr);
    });
    
    const activeDays = activeDaysSet.size;
    const totalActions = userLogs.length;
    const avgActionsPerDay = activeDays > 0 ? (totalActions / activeDays) : 0;
    
    return {
      totalActions: totalActions,
      activeDays: activeDays,
      avgActionsPerDay: parseFloat(avgActionsPerDay.toFixed(2))
    };
  } catch (error) {
    console.error("Error al calcular engagement del usuario:", error);
    return { totalActions: 0, activeDays: 0, avgActionsPerDay: 0 };
  }
}