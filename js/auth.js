/**
 * ============================================
 * SISTEMA DE AUTENTICACIÓN - QOMed Platform
 * ============================================
 * Integrado con database.js y config.js reales
 * Roles: 'admin', 'profesor', 'alumno'
 */

// ============================================
// FUNCIONES GLOBALES (usadas en index.html)
// ============================================

/**
 * Inicia sesión con email y contraseña
 */
function loginUser(email, password) {
    try {
        if (!email || !password) {
            return { success: false, message: 'Todos los campos son obligatorios.' };
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            return { success: false, message: 'Ingresa un email válido.' };
        }
        
        // Usar la instancia global de Database
        if (!window.db) {
            return { success: false, message: 'Sistema no inicializado. Recarga la página.' };
        }
        
        // Buscar usuario por email
        const usuario = window.db.getUserByEmail(email);
        
        if (!usuario) {
            return { success: false, message: 'Email no registrado.' };
        }
        
        // Verificar contraseña con el hash
        const passwordHash = window.db.hashPassword(password);
        
        if (usuario.passwordHash !== passwordHash) {
            return { success: false, message: 'Contraseña incorrecta.' };
        }
        
        // Crear sesión (guardar en el formato que espera el sistema)
        const sessionData = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            fechaLogin: new Date().toISOString()
        };
        
        localStorage.setItem('userQOMED', JSON.stringify(sessionData));
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
        
        // Actualizar último acceso
        window.db.updateUser(usuario.id, { ultimoAcceso: new Date().toISOString() });
        
        // Redirigir según rol
        const redirectMap = {
            'admin': 'admin.html',
            'profesor': 'teacher.html',
            'alumno': 'student.html'
        };
        
        const target = redirectMap[usuario.rol];
        if (target) {
            setTimeout(() => {
                window.location.href = target;
            }, 300);
        }
        
        return { 
            success: true, 
            message: `¡Bienvenido/a ${usuario.nombre}!` 
        };
        
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, message: 'Error al iniciar sesión.' };
    }
}

/**
 * Registra un nuevo usuario
 */
function registerUser(nombre, email, password, rol) {
    try {
        if (!nombre || !email || !password || !rol) {
            return { success: false, message: 'Todos los campos son obligatorios.' };
        }
        
        if (nombre.trim().length < 3) {
            return { success: false, message: 'El nombre debe tener al menos 3 caracteres.' };
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            return { success: false, message: 'Ingresa un email válido.' };
        }
        
        if (password.length < 6) {
            return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
        }
        
        const ROLES_VALIDOS = ['admin', 'profesor', 'alumno'];
        if (!ROLES_VALIDOS.includes(rol)) {
            return { success: false, message: 'Selecciona un rol válido.' };
        }
        
        if (!window.db) {
            return { success: false, message: 'Sistema no inicializado. Recarga la página.' };
        }
        
        // Verificar si el email ya existe
        const existe = window.db.getUserByEmail(email);
        if (existe) {
            return { success: false, message: 'Este email ya está registrado.' };
        }
        
        // Crear usuario (database.js ya hashea la contraseña)
        window.db.createUser({
            nombre: nombre.trim(),
            email: email.toLowerCase().trim(),
            password: password,  // database.js lo hashea internamente
            rol: rol
        });
        
        return { 
            success: true, 
            message: '¡Registro exitoso! Ahora puedes iniciar sesión.' 
        };
        
    } catch (error) {
        console.error('Error en registro:', error);
        return { success: false, message: 'Error al registrarse.' };
    }
}

/**
 * Obtiene la sesión actual
 */
function getCurrentSession() {
    try {
        const session = localStorage.getItem('userQOMED');
        if (!session) return null;
        return JSON.parse(session);
    } catch (e) {
        localStorage.removeItem('userQOMED');
        return null;
    }
}

/**
 * Cierra sesión
 */
function logoutUser() {
    localStorage.removeItem('userQOMED');
    localStorage.removeItem('currentUser');
    sessionStorage.setItem('authMessage', 'Has cerrado sesión correctamente.');
    window.location.href = 'index.html';
}

/**
 * Verifica si el usuario tiene un rol específico
 */
function userHasRole(rol) {
    const session = getCurrentSession();
    return session && session.rol === rol;
}

/**
 * Verifica si hay sesión activa
 */
function isUserLoggedIn() {
    return getCurrentSession() !== null;
}

console.log('✅ AuthSystem integrado con database.js');
console.log('   Roles: admin, profesor, alumno');
console.log('   Usuario de prueba: admin@universidad.edu / admin123');
