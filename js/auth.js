/**
 * js/auth.js
 * Lógica de autenticación, hashing y gestión de sesiones.
 */

// Importar configuración
const CONFIG = {
    STORAGE_KEYS: {
        USERS: 'edu_platform_users',
        SESSION: 'edu_platform_session'
    },
    SESSION_TIMEOUT: 604800000 // 7 días en milisegundos
};

// Función de hash sincrónica robusta con salting (Evita errores async en file://)
const hashPassword = (password) => {
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
};

// Registra un nuevo usuario
const registerUser = (nombre, email, password, rol = 'alumno') => {
    try {
        const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) || [];
        
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
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
        return { success: true, message: "Usuario registrado exitosamente." };
    } catch (error) {
        console.error("Error en registerUser:", error);
        return { success: false, message: "Error interno al registrar el usuario." };
    }
};

// Inicia sesión y redirige según el rol
const loginUser = (email, password) => {
    try {
        const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) || [];
        const user = users.find(u => u.email === email.toLowerCase());
        const hashedPassword = hashPassword(password);

        if (!user || user.passwordHash !== hashedPassword) {
            return { success: false, message: "Credenciales incorrectas." };
        }

        // Actualizar último acceso
        user.ultimoAcceso = new Date().toISOString();
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));

        // Crear sesión (7 días de expiración)
        const session = {
            userId: user.id,
            rol: user.rol,
            loginTime: new Date().toISOString(),
            expiresAt: Date.now() + CONFIG.SESSION_TIMEOUT // 7 días en milisegundos
        };
        localStorage.setItem(CONFIG.STORAGE_KEYS.SESSION, JSON.stringify(session));

        // Redirección según rol
        const redirectMap = {
            'admin': 'admin.html',
            'profesor': 'teacher.html',
            'alumno': 'student.html'
        };
        
        window.location.href = redirectMap[user.rol] || 'index.html';
        return { success: true, message: "Inicio de sesión exitoso." };
    } catch (error) {
        console.error("Error en loginUser:", error);
        return { success: false, message: "Error interno al iniciar sesión." };
    }
};

// Cierra la sesión actual
const logoutUser = () => {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION);
    window.location.href = 'index.html';
};

// Obtiene la sesión actual si es válida
const getCurrentSession = () => {
    try {
        const sessionStr = localStorage.getItem(CONFIG.STORAGE_KEYS.SESSION);
        if (!sessionStr) return null;
        
        const session = JSON.parse(sessionStr);
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION);
            return null; // Sesión expirada
        }
        return session;
    } catch (error) {
        console.error("Error al leer la sesión:", error);
        return null;
    }
};