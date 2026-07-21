/**
 * js/db.js
 * Gestión de base de datos en localStorage, inicialización y limpieza.
 * DEBE cargarse después de auth.js para usar hashPassword si fuera necesario, 
 * aunque aquí manejamos la inicialización de forma segura.
 */

const DB_KEYS = {
    USERS: 'edu_platform_users',
    SESSION: 'edu_platform_session'
};

// Inicializa la base de datos con un admin por defecto si está vacía
const initDB = () => {
    try {
        let users = JSON.parse(localStorage.getItem(DB_KEYS.USERS));
        
        if (!users || users.length === 0) {
            // Crear administrador por defecto
            const defaultAdmin = {
                id: 'admin_001',
                nombre: 'Administrador General',
                email: 'admin@universidad.edu',
                rol: 'admin',
                // Usamos la función global hashPassword definida en auth.js
                passwordHash: (typeof hashPassword === 'function') ? hashPassword('Admin123!') : 'hash_fallback_error',
                fechaRegistro: new Date().toISOString(),
                ultimoAcceso: new Date().toISOString()
            };
            
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify([defaultAdmin]));
            console.log("Base de datos inicializada con usuario Administrador por defecto.");
        }
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
    }
};

// Limpia usuarios inactivos de más de 6 meses (Mantenimiento semestral)
const cleanOldData = () => {
    try {
        const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
        const sixMonthsAgo = Date.now() - (180 * 24 * 60 * 60 * 1000); // 180 días

        const filteredUsers = users.filter(user => {
            const lastActivity = new Date(user.ultimoAcceso || user.fechaRegistro).getTime();
            // Mantener siempre al admin principal, sin importar su inactividad
            if (user.email === 'admin@universidad.edu') return true;
            return lastActivity > sixMonthsAgo;
        });

        if (filteredUsers.length < users.length) {
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(filteredUsers));
            console.log(`Limpieza completada: ${users.length - filteredUsers.length} usuarios inactivos eliminados.`);
        }
    } catch (error) {
        console.error("Error al limpiar datos antiguos:", error);
    }
};

// Ejecutar inicialización y limpieza al cargar este script
initDB();
cleanOldData();