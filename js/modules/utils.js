/**
 * @fileoverview Módulo de utilidades comunes
 * Proporciona funciones helper para formateo, validación y UI
 */

const AppUtils = {
    /**
     * Formatea una fecha en formato legible
     * @param {string} dateString - Fecha en formato ISO
     * @returns {string} Fecha formateada
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-ES', options);
    },

    /**
     * Formatea un tiempo relativo (hace X tiempo)
     * @param {string} dateString - Fecha en formato ISO
     * @returns {string} Tiempo relativo
     */
    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'hace un momento';
        if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
        if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
        if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
        
        return this.formatDate(dateString);
    },

    /**
     * Valida un formato de email
     * @param {string} email - Email a validar
     * @returns {boolean} True si es válido
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Valida que la contraseña tenga longitud mínima
     * @param {string} password - Contraseña a validar
     * @returns {boolean} True si es válida
     */
    isValidPassword(password) {
        return password && password.length >= 6;
    },

    /**
     * Muestra un mensaje de error en un elemento
     * @param {string} elementId - ID del elemento
     * @param {string} message - Mensaje a mostrar
     */
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    },

    /**
     * Muestra un mensaje de éxito en un elemento
     * @param {string} elementId - ID del elemento
     * @param {string} message - Mensaje a mostrar
     */
    showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            setTimeout(() => {
                element.style.display = 'none';
            }, 3000);
        }
    },

    /**
     * Limpia los campos de un formulario
     * @param {string} formId - ID del formulario
     */
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    },

    /**
     * Genera un color aleatorio de una paleta predefinida
     * @returns {string} Color en formato hexadecimal
     */
    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    /**
     * Calcula el progreso promedio de un conjunto de inscripciones
     * @param {Array} enrollments - Lista de inscripciones
     * @returns {number} Progreso promedio (0-100)
     */
    calculateAverageProgress(enrollments) {
        if (!enrollments || enrollments.length === 0) return 0;
        const total = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0);
        return Math.round(total / enrollments.length);
    },

    /**
     * Descarga datos como archivo JSON
     * @param {Object} data - Datos a descargar
     * @param {string} filename - Nombre del archivo
     */
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Muestra un diálogo de confirmación
     * @param {string} message - Mensaje a mostrar
     * @returns {boolean} True si el usuario confirmó
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * Muestra una notificación toast temporal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación (success, error, info)
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Capitaliza la primera letra de un string
     * @param {string} str - String a capitalizar
     * @returns {string} String capitalizado
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Trunca un string a una longitud máxima
     * @param {string} str - String a truncar
     * @param {number} length - Longitud máxima
     * @returns {string} String truncado
     */
    truncate(str, length) {
        return str.length > length ? str.substring(0, length) + '...' : str;
    },

    /**
     * Obtiene las iniciales de un nombre
     * @param {string} name - Nombre completo
     * @returns {string} Iniciales (máximo 2 caracteres)
     */
    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
};

// Agregar animaciones CSS para toast (solo si estamos en navegador)
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Exportar para uso como módulo ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppUtils };
}
