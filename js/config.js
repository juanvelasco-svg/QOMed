const CONFIG = {
    APP_NAME: 'Universidad - Sistema de Gestión',
    VERSION: '1.0.0',
    STORAGE_KEYS: {
        USERS: 'edu_platform_users',
        CLASSES: 'edu_platform_classes',
        ENROLLMENTS: 'edu_platform_enrollments',
        ACTIVITY: 'edu_platform_activity',
        SESSION: 'edu_platform_session'
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
    SESSION_TIMEOUT: 604800000, // 7 días en milisegundos
    AUTO_CLEAN_INTERVAL: 15552000000, // 6 meses en milisegundos
    COLORS: {
        primary: '#FFD700',
        secondary: '#1a1a2e',
        success: '#27ae60',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    }
};

// Inicializar tema
function initTheme() {
    const savedTheme = localStorage.getItem('edu_platform_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// Toggle tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('edu_platform_theme', newTheme);
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', initTheme);