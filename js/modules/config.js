/**
 * @fileoverview Configuración central de la aplicación
 * Módulo ES6 que exporta constantes y utilidades de configuración
 */

const AppConfig = {
    APP_NAME: 'Universidad - Sistema de Gestión',
    VERSION: '1.0.0',
    
    STORAGE_KEYS: {
        USERS: 'edu_platform_users',
        CLASSES: 'edu_platform_classes',
        ENROLLMENTS: 'edu_platform_enrollments',
        ACTIVITY: 'edu_platform_activity',
        SESSION: 'edu_platform_session',
        THEME: 'edu_platform_theme'
    },
    
    ROLES: {
        ADMIN: 'admin',
        TEACHER: 'profesor',
        STUDENT: 'alumno'
    },
    
    REDIRECTS: {
        admin: 'admin.html',
        profesor: 'teacher.html',
        alumno: 'student.html'
    },
    
    SESSION_TIMEOUT_MS: 604800000, // 7 días en milisegundos
    AUTO_CLEAN_INTERVAL_MS: 15552000000, // 6 meses en milisegundos
    
    COLORS: {
        primary: '#FFD700',
        secondary: '#1a1a2e',
        success: '#27ae60',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    }
};

/**
 * Inicializa el tema de la aplicación basado en preferencias del usuario
 */
function initTheme() {
    const savedTheme = localStorage.getItem(AppConfig.STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

/**
 * Alterna entre tema claro y oscuro
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(AppConfig.STORAGE_KEYS.THEME, newTheme);
}

// Exportar para uso como módulo ES6 (si el navegador lo soporta)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppConfig, initTheme, toggleTheme };
}

// Inicializar al cargar DOM
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initTheme);
}
