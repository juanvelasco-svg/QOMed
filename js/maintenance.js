/**
 * Módulo de Mantenimiento y Limpieza (maintenance.js)
 * Gestiona la purga de datos antiguos y el monitoreo del uso de almacenamiento.
 */

/**
 * Elimina registros de actividad antiguos para liberar espacio en localStorage.
 * @param {number} months - Número de meses de antigüedad para conservar (por defecto 6).
 * @returns {object} Objeto con { deleted: number, remaining: number }.
 */
function cleanOldLogs(months = 6) {
  try {
    const logs = JSON.parse(localStorage.getItem('edu_platform_logs') || '[]');
    const originalLength = logs.length;
    
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    const cutoffTime = cutoffDate.getTime();
    
    const filteredLogs = logs.filter(log => log.timestamp >= cutoffTime);
    
    localStorage.setItem('edu_platform_logs', JSON.stringify(filteredLogs));
    
    return {
      deleted: originalLength - filteredLogs.length,
      remaining: filteredLogs.length
    };
  } catch (error) {
    console.error("Error al limpiar logs antiguos:", error);
    return { deleted: 0, remaining: 0 };
  }
}

/**
 * Calcula el tamaño aproximado que ocupan los logs en el almacenamiento local.
 * @returns {object} Objeto con el tamaño en KB y MB para visualización en el panel de admin.
 */
function getStorageUsage() {
  try {
    const logsString = localStorage.getItem('edu_platform_logs') || '[]';
    const bytes = new Blob([logsString]).size;
    const kb = bytes / 1024;
    const mb = kb / 1024;
    
    return {
      sizeKB: parseFloat(kb.toFixed(2)),
      sizeMB: parseFloat(mb.toFixed(4))
    };
  } catch (error) {
    console.error("Error al calcular uso de almacenamiento:", error);
    return { sizeKB: 0, sizeMB: 0 };
  }
}