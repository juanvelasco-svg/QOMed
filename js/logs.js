/**
 * Motor de Registro de Actividad (logs.js)
 * Gestiona la creación, consulta y recuperación de logs de usuario en localStorage.
 */

/**
 * Genera un UUID v4 simple sin dependencias externas (compatible con file://)
 * @returns {string} Un identificador único universal.
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Registra una nueva acción del usuario en el sistema.
 * @param {string} userId - Identificador único del usuario.
 * @param {string} userRole - Rol del usuario (admin, profesor, alumno).
 * @param {string} action - Tipo de acción (login, logout, view_class, complete_quiz, etc.).
 * @param {string} target - Objetivo de la acción (nombre de la clase, página, etc.).
 * @param {number|null} customTimestamp - (Opcional) Timestamp personalizado para pruebas. Por defecto usa Date.now().
 * @returns {object|null} El objeto log creado o null si falla el almacenamiento.
 */
function logActivity(userId, userRole, action, target, customTimestamp = null) {
  try {
    const logs = JSON.parse(localStorage.getItem('edu_platform_logs') || '[]');
    
    const newLog = {
      id: generateUUID(),
      userId: String(userId),
      userRole: String(userRole),
      action: String(action),
      target: String(target),
      timestamp: customTimestamp !== null ? Number(customTimestamp) : Date.now()
    };
    
    logs.push(newLog);
    localStorage.setItem('edu_platform_logs', JSON.stringify(logs));
    return newLog;
  } catch (error) {
    console.error("Error crítico al registrar actividad en localStorage:", error);
    return null;
  }
}

/**
 * Obtiene todos los registros de actividad de un usuario específico.
 * @param {string} userId - Identificador único del usuario.
 * @returns {Array} Array de objetos log pertenecientes al usuario.
 */
function getUserLogs(userId) {
  try {
    const logs = JSON.parse(localStorage.getItem('edu_platform_logs') || '[]');
    return logs.filter(log => log.userId === String(userId));
  } catch (error) {
    console.error("Error al obtener logs del usuario:", error);
    return [];
  }
}

/**
 * Obtiene los últimos registros de actividad global, ordenados por fecha descendente.
 * @param {number} limit - Número máximo de registros a devolver (por defecto 10).
 * @returns {Array} Array con los últimos 'limit' registros globales.
 */
function getRecentLogs(limit = 10) {
  try {
    const logs = JSON.parse(localStorage.getItem('edu_platform_logs') || '[]');
    const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);
    return sortedLogs.slice(0, limit);
  } catch (error) {
    console.error("Error al obtener logs recientes:", error);
    return [];
  }
}