/**
 * class-bridge.js
 * Conecta una clase externa con el sistema central QOMed.
 */

const ClassBridge = {
    studentId: null,

    init: function() {
        // 1. Obtener el ID del alumno desde la URL (?student=...)
        const urlParams = new URLSearchParams(window.location.search);
        this.studentId = urlParams.get('student');
        
        if (!this.studentId) {
            console.warn("⚠️ No se detectó ID de estudiante. El progreso no se guardará.");
            return;
        }

        console.log(`✅ Conectado al sistema QOMed como estudiante: ${this.studentId}`);
        this.loadProgress();
    },

    // Cargar progreso guardado previamente (por si el alumno vuelve a entrar)
    loadProgress: function() {
        try {
            const enrollments = JSON.parse(localStorage.getItem('edu_platform_enrollments')) || [];
            const enrollment = enrollments.find(e => e.studentId === this.studentId);
            
            if (enrollment) {
                console.log(`📊 Progreso cargado: ${enrollment.progress}%`);
                // TIP: Aquí puedes llamar a una función tuya para restaurar el estado visual
                // ej: if(enrollment.progress >= 50) document.getElementById('seccion2').style.display = 'block';
            }
        } catch (e) {
            console.error("Error al leer progreso:", e);
        }
    },

    // 🌟 FUNCIÓN CLAVE: Llama a esta función cuando el alumno complete algo
    saveProgress: function(percentage) {
        if (!this.studentId) return;

        try {
            const enrollments = JSON.parse(localStorage.getItem('edu_platform_enrollments')) || [];
            const index = enrollments.findIndex(e => e.studentId === this.studentId);

            if (index !== -1) {
                enrollments[index].progress = percentage;
                enrollments[index].lastAccess = new Date().toISOString();
                enrollments[index].completed = percentage === 100;
                
                localStorage.setItem('edu_platform_enrollments', JSON.stringify(enrollments));
                console.log(`💾 Progreso guardado en el sistema: ${percentage}%`);
            } else {
                console.warn("⚠️ El alumno no está inscrito en esta clase en el sistema central.");
            }
        } catch (e) {
            console.error("Error al guardar progreso:", e);
        }
    }
};

// Inicializar automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', () => ClassBridge.init());
