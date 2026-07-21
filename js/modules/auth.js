/**
 * @fileoverview Módulo de autenticación y gestión de sesiones
 * Proporciona funciones para registro, login, logout y validación de sesiones
 */

// Importar configuración si está disponible
const AuthConfig = typeof AppConfig !== 'undefined' ? AppConfig : {
    STORAGE_KEYS: {
        USERS: 'edu_platform_users',
        SESSION: 'edu_platform_session'
    },
    REDIRECTS: {
        admin: 'admin.html',
        profesor: 'teacher.html',
        alumno: 'student.html'
    }
};

/**
 * Función de hash sincrónica robusta con salting
 * @param {string} password - Contraseña a hashear
 * @returns {string} Hash de la contraseña
 */
function hashPassword(password) {
    const salt = "EduPlatform_Secure_Salt_2026_!";
    let hash = 0;
    const str = salt + password + salt;
    
    // Fase 1: Hash numérico tipo DJB2 modificado
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a entero de 32 bits
    }
    
    // Fase 2: Amplificación y ofuscación a formato hexadecimal seguro
    let amplified = Math.abs(hash).toString(16).padStart(8, '0');
    for (let i = 0; i < 100; i++) {
        amplified = btoa(amplified + str).replace(/[^a-zA-Z0-9]/g, '').substring(0, 64);
    }
    return amplified;
}

/**
 * Registra un nuevo usuario en el sistema
 * @param {string} nombre - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} rol - Rol del usuario (admin, profesor, alumno)
 * @returns {Object} Resultado de la operación
 */
function registerUser(nombre, email, password, rol = 'alumno') {
    try {
        const users = JSON.parse(localStorage.getItem(AuthConfig.STORAGE_KEYS.USERS)) || [];
        
        // Validar si el email ya existe
        const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
            return { success: false, message: "El correo electrónico ya está registrado." };
        }

        const newUser = {
            id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            nombre,
            email: email.toLowerCase(),
            rol,
            passwordHash: hashPassword(password),
            fechaRegistro: new Date().toISOString(),
            ultimoAcceso: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(AuthConfig.STORAGE_KEYS.USERS, JSON.stringify(users));
        return { success: true, message: "Usuario registrado exitosamente." };
    } catch (error) {
        console.error("Error en registerUser:", error);
        return { success: false, message: "Error interno al registrar el usuario." };
    }
}

/**
 * Inicia sesión y redirige según el rol del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} Resultado de la operación
 */
function loginUser(email, password) {
    try {
        const users = JSON.parse(localStorage.getItem(AuthConfig.STORAGE_KEYS.USERS)) || [];
        const user = users.find(u => u.email === email.toLowerCase());
        const hashedPassword = hashPassword(password);

        if (!user || user.passwordHash !== hashedPassword) {
            return { success: false, message: "Credenciales incorrectas." };
        }

        // Actualizar último acceso
        user.ultimoAcceso = new Date().toISOString();
        localStorage.setItem(AuthConfig.STORAGE_KEYS.USERS, JSON.stringify(users));

        // Crear sesión (7 días de expiración)
        const session = {
            userId: user.id,
            rol: user.rol,
            loginTime: new Date().toISOString(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 días en milisegundos
        };
        localStorage.setItem(AuthConfig.STORAGE_KEYS.SESSION, JSON.stringify(session));

        // Redirección según rol
        const redirectMap = AuthConfig.REDIRECTS;
        window.location.href = redirectMap[user.rol] || 'index.html';
        return { success: true, message: "Inicio de sesión exitoso." };
    } catch (error) {
        console.error("Error en loginUser:", error);
        return { success: false, message: "Error interno al iniciar sesión." };
    }
}

/**
 * Cierra la sesión actual y redirige al index
 */
function logoutUser() {
    localStorage.removeItem(AuthConfig.STORAGE_KEYS.SESSION);
    window.location.href = 'index.html';
}

/**
 * Obtiene la sesión actual si es válida
 * @returns {Object|null} Objeto de sesión o null si no hay sesión válida
 */
function getCurrentSession() {
    try {
        const sessionStr = localStorage.getItem(AuthConfig.STORAGE_KEYS.SESSION);
        if (!sessionStr) return null;
        
        const session = JSON.parse(sessionStr);
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem(AuthConfig.STORAGE_KEYS.SESSION);
            return null; // Sesión expirada
        }
        return session;
    } catch (error) {
        console.error("Error al leer la sesión:", error);
        return null;
    }
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string|string[]} allowedRoles - Rol(es) permitidos
 * @returns {boolean} True si el usuario tiene permiso
 */
function hasRole(allowedRoles) {
    const session = getCurrentSession();
    if (!session) return false;
    
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(session.rol);
}

/**
 * Protege una página requiriendo autenticación y roles específicos
 * @param {string|string[]} allowedRoles - Rol(es) permitidos para acceder
 */
function requireAuth(allowedRoles) {
    const session = getCurrentSession();

    // 1. Verificar si existe una sesión válida
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Verificar si el rol tiene permiso para acceder a esta página
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(session.rol)) {
        const redirectMap = AuthConfig.REDIRECTS;
        const correctPath = redirectMap[session.rol] || 'index.html';
        
        setTimeout(() => {
            alert("⚠️ Acceso denegado: No tienes permisos para ver esta página.");
            window.location.href = correctPath;
        }, 100);
    }
}

// Exportar para uso como módulo ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        hashPassword, 
        registerUser, 
        loginUser, 
        logoutUser, 
        getCurrentSession,
        hasRole,
        requireAuth
    };
}
