/**
 * GUÍA DE INTEGRACIÓN DEL MÓDULO DE RASTREO (integration-guide.js)
 * =================================================================
 * Este archivo contiene ejemplos prácticos de cómo conectar el sistema 
 * de logs con tu código existente (auth.js, student.html, teacher.html).
 * 
 * INSTRUCCIONES DE USO:
 * 1. Incluye este archivo (o copia las funciones relevantes) en tu proyecto.
 * 2. Asegúrate de que 'js/logs.js' se cargue antes de llamar a 'logActivity'.
 */

/**
 * EJEMPLO 1: Integración en auth.js (Login)
 * -----------------------------------------
 * Dentro de tu función de login exitoso en auth.js, añade:
 * 
 * function handleLogin(userId, userRole) {
 *   // ... tu lógica existente de validación y guardado de sesión ...
 *   localStorage.setItem('currentUser', JSON.stringify({ id: userId, role: userRole }));
 *   
 *   // >>> AÑADIR ESTA LÍNEA <<<
 *   logActivity(userId, userRole, 'login', 'platform_home');
 *   
 *   window.location.href = userRole === 'admin' ? 'admin.html' : 'dashboard.html';
 * }
 */

/**
 * EJEMPLO 2: Integración en student.html (Visualización de Clase)
 * ---------------------------------------------------------------
 * Cuando el alumno hace clic para entrar a una clase o se carga la página:
 * 
 * function enterClass(classId, className) {
 *   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
 *   if (currentUser) {
 *     logActivity(currentUser.id, currentUser.role, 'view_class', className);
 *   }
 *   // ... lógica para mostrar la clase ...
 * }
 */

/**
 * EJEMPLO 3: Integración en student.html (Completar Quiz)
 * -------------------------------------------------------
 * Al finalizar una evaluación:
 * 
 * function submitQuiz(quizName, score) {
 *   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
 *   if (currentUser) {
 *     logActivity(currentUser.id, currentUser.role, 'complete_quiz', `${quizName} (Score: ${score})`);
 *   }
 *   // ... lógica para guardar resultado ...
 * }
 */

/**
 * FUNCIÓN DE PRUEBA: Simular Actividad de Estudiante
 * --------------------------------------------------
 * Genera 10 logs realistas distribuidos en los últimos 5 días.
 * Úsala en la consola del navegador o en un botón oculto de admin 
 * para probar inmediatamente los gráficos de Chart.js sin hacer clic manualmente.
 * 
 * @param {string} userId - ID del usuario de prueba (por defecto 'test-user-123').
 * @param {string} userRole - Rol del usuario (por defecto 'alumno').
 */
function simulateStudentActivity(userId = "test-user-123", userRole = "alumno") {
  try {
    const actions = [
      { action: "login", target: "platform_home" },
      { action: "view_class", target: "Matemáticas Avanzadas" },
      { action: "view_class", target: "Física Cuántica" },
      { action: "complete_quiz", target: "Quiz 1: Álgebra Lineal" },
      { action: "view_class", target: "Matemáticas Avanzadas" },
      { action: "logout", target: "platform_home" },
      { action: "login", target: "platform_home" },
      { action: "view_class", target: "Historia Universal" },
      { action: "complete_quiz", target: "Quiz 2: Revolución Industrial" },
      { action: "logout", target: "platform_home" }
    ];

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    actions.forEach((item, index) => {
      // Distribuye las acciones aleatoriamente en los últimos 5 días
      const randomOffset = Math.floor(Math.random() * 5 * oneDayMs);
      const timestamp = now - randomOffset;
      
      logActivity(userId, userRole, item.action, item.target, timestamp);
    });
    
    console.log("✅ Éxito: Se han generado 10 logs de prueba distribuidos en los últimos 5 días.");
    console.log("💡 Tip: Abre la pestaña 'Application' > 'Local Storage' en las DevTools para verificarlos.");
  } catch (error) {
    console.error("Error al simular actividad:", error);
  }
}

/**
 * FUNCIÓN DE PRUEBA: Ejecutar Mantenimiento
 * -----------------------------------------
 * Ejemplo de cómo un administrador podría limpiar la base de datos 
 * desde un panel de control.
 */
function runMaintenanceTask() {
  try {
    const usageBefore = getStorageUsage();
    console.log(`📊 Uso antes de la limpieza: ${usageBefore.sizeKB} KB`);
    
    const result = cleanOldLogs(6); // Limpia logs de más de 6 meses
    
    const usageAfter = getStorageUsage();
    console.log(`🧹 Limpieza completada. Eliminados: ${result.deleted}, Restantes: ${result.remaining}`);
    console.log(`📊 Uso después de la limpieza: ${usageAfter.sizeKB} KB`);
  } catch (error) {
    console.error("Error en la tarea de mantenimiento:", error);
  }
}