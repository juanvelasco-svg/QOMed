/**
 * ============================================
 * SISTEMA DE AUTENTICACIÓN - QOMed Platform
 * ============================================
 * Roles: 'admin', 'profesor', 'alumno'
 * 
 * Expone funciones globales:
 * - loginUser(email, password)
 * - registerUser(nombre, email, password, rol)
 * - getCurrentSession()
 * - logoutUser()
 * - userHasRole(rol)
 * - isUserLoggedIn()
 */

// ============================================
// CLASE PRINCIPAL
// ============================================

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        const savedUser = localStorage.getItem('userQOMED');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
            } catch (e) {
                localStorage.removeItem('userQOMED');
            }
        }
    }
    
    /**
     * Login de usuario (usando database.js)
     */
    login(email, password) {
        // Validar campos
        if (!email || !password) {
            return { success: false, message: 'Todos los campos son obligatorios.' };
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            return { success: false, message: 'Ingresa un email válido.' };
        }
        
        // Obtener base de datos
        const db = this.getDatabase();
        if (!db || !db.usuarios) {
            return { success: false, message: 'Error al conectar con la base de datos.' };
        }
        
        // Buscar usuario
        const usuario = db.usuarios.find(u => 
            u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (!usuario) {
            return { success: false, message: 'Email no registrado.' };
        }
        
        // Verificar contraseña
        if (usuario.password !== password) {
            return { success: false, message: 'Contraseña incorrecta.' };
        }
        
        // Verificar rol válido
        const ROLES_VALIDOS = ['admin', 'profesor', 'alumno'];
        if (!ROLES_VALIDOS.includes(usuario.rol)) {
            return { success: false, message: 'Error: Rol de usuario no válido.' };
        }
        
        // Crear sesión
        const sessionData = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            fechaLogin: new Date().toISOString()
        };
        
        localStorage.setItem('userQOMED', JSON.stringify(sessionData));
        this.currentUser = sessionData;
        
        // Redirigir según rol
        this.redirectByRole(usuario.rol);
        
        return { 
            success: true, 
            message: `¡Bienvenido/a ${usuario.nombre}!`,
            user: sessionData
        };
    }
    
    /**
     * Registro de nuevo usuario
     */
    register(nombre, email, password, rol) {
        // Validar campos
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
        
        // Obtener base de datos
        const db = this.getDatabase();
        if (!db || !db.usuarios) {
            return { success: false, message: 'Error al conectar con la base de datos.' };
        }
        
        // Verificar email duplicado
        const existe = db.usuarios.some(u => 
            u.email.toLowerCase() === email.toLowerCase()
        );
        if (existe) {
            return { success: false, message: 'Este email ya está registrado.' };
        }
        
        // Crear usuario
        const nuevoUsuario = {
            id: this.generarId(db.usuarios),
            nombre: nombre.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            rol: rol,
            fechaRegistro: new Date().toISOString(),
            activo: true
        };
        
        // Guardar
        db.usuarios.push(nuevoUsuario);
        this.guardarDatabase(db);
        
        return { 
            success: true, 
            message: '¡Registro exitoso! Ahora puedes iniciar sesión.' 
        };
    }
    
    /**
     * Redirigir según rol
     */
    redirectByRole(rol) {
        const currentPage = window.location.pathname.split('/').pop();
        const ROLE_PAGES = {
            'admin': 'admin.html',
            'profesor': 'teacher.html',
            'alumno': 'student.html'
        };
        
        const target = ROLE_PAGES[rol];
        if (target && currentPage !== target) {
            setTimeout(() => {
                window.location.href = target;
            }, 200);
        }
    }
    
    /**
     * Cerrar sesión
     */
    logout(message = 'Has cerrado sesión correctamente.') {
        localStorage.removeItem('userQOMED');
        this.currentUser = null;
        sessionStorage.setItem('authMessage', message);
        
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'index.html' && currentPage !== '') {
            window.location.href = 'index.html';
        } else {
            window.location.reload();
        }
    }
    
    /**
     * Obtener sesión actual
     */
    getCurrentSession() {
        return this.currentUser;
    }
    
    /**
     * Verificar rol
     */
    hasRole(rol) {
        return this.currentUser && this.currentUser.rol === rol;
    }
    
    /**
     * Verificar autenticación
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    /**
     * Obtener base de datos (compatible con database.js)
     */
    getDatabase() {
        try {
            // Si window.db existe (definido en database.js), usarlo
            if (window.db && window.db.usuarios) {
                return window.db;
            }
            
            // Fallback: intentar localStorage
            const dbString = localStorage.getItem('qomed_database');
            if (dbString) {
                const db = JSON.parse(dbString);
                window.db = db;
                return db;
            }
            
            // Si no existe, crear estructura inicial
            const initialDB = {
                usuarios: [
                    {
                        id: 1,
                        nombre: 'Administrador',
                        email: 'admin@qomed.com',
                        password: 'admin123',
                        rol: 'admin',
                        fechaRegistro: new Date().toISOString(),
                        activo: true
                    }
                ]
            };
            localStorage.setItem('qomed_database', JSON.stringify(initialDB));
            window.db = initialDB;
            return initialDB;
            
        } catch (e) {
            console.error('Error al obtener base de datos:', e);
            return { usuarios: [] };
        }
    }
    
    /**
     * Guardar base de datos
     */
    guardarDatabase(db) {
        try {
            localStorage.setItem('qomed_database', JSON.stringify(db));
            window.db = db;
        } catch (e) {
            console.error('Error al guardar base de datos:', e);
        }
    }
    
    /**
     * Generar ID único
     */
    generarId(usuarios) {
        if (!usuarios || usuarios.length === 0) return 1;
        const ids = usuarios.map(u => u.id).filter(id => typeof id === 'number');
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }
}

// ============================================
// INICIALIZAR Y EXPONER FUNCIONES GLOBALES
// ============================================

const auth = new AuthSystem();
window.auth = auth;

/**
 * Función global para login (usada en index.html)
 */
function loginUser(email, password) {
    return auth.login(email, password);
}

/**
 * Función global para registro (usada en index.html)
 */
function registerUser(nombre, email, password, rol) {
    return auth.register(nombre, email, password, rol);
}

/**
 * Función global para obtener sesión (usada en index.html y jsauth-guard.js)
 */
function getCurrentSession() {
    return auth.getCurrentSession();
}

/**
 * Función global para cerrar sesión
 */
function logoutUser() {
    auth.logout();
}

/**
 * Función global para verificar rol
 */
function userHasRole(rol) {
    return auth.hasRole(rol);
}

/**
 * Función global para verificar autenticación
 */
function isUserLoggedIn() {
    return auth.isAuthenticated();
}

// ============================================
// LOG DE INICIALIZACIÓN
// ============================================

console.log('✅ AuthSystem inicializado | Roles: admin, profesor, alumno');
console.log('   Usuario de prueba: admin@qomed.com / admin123');
