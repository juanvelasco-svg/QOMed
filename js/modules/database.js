/**
 * @fileoverview Módulo de base de datos para gestión de datos en localStorage
 * Proporciona una API unificada para operaciones CRUD de usuarios, clases, inscripciones y actividad
 */

// Importar configuración si está disponible
const DBConfig = typeof AppConfig !== 'undefined' ? AppConfig : {
    STORAGE_KEYS: {
        USERS: 'edu_platform_users',
        CLASSES: 'edu_platform_classes',
        ENROLLMENTS: 'edu_platform_enrollments',
        ACTIVITY: 'edu_platform_activity'
    },
    ROLES: {
        ADMIN: 'admin',
        TEACHER: 'profesor',
        STUDENT: 'alumno'
    }
};

/**
 * Clase principal para gestión de base de datos en localStorage
 */
class Database {
    constructor() {
        this.init();
    }

    /**
     * Inicializa las estructuras de datos necesarias
     */
    init() {
        const keys = DBConfig.STORAGE_KEYS;
        
        // Inicializar estructuras si no existen
        if (!localStorage.getItem(keys.CLASSES)) {
            localStorage.setItem(keys.CLASSES, JSON.stringify([]));
        }

        if (!localStorage.getItem(keys.ENROLLMENTS)) {
            localStorage.setItem(keys.ENROLLMENTS, JSON.stringify([]));
        }

        if (!localStorage.getItem(keys.ACTIVITY)) {
            localStorage.setItem(keys.ACTIVITY, JSON.stringify([]));
        }

        // Crear admin por defecto si no existe
        this.createDefaultAdmin();
    }

    /**
     * Crea un administrador por defecto si no existe ninguno
     */
    createDefaultAdmin() {
        const users = this.getUsers();
        const adminExists = users.some(u => u.rol === DBConfig.ROLES.ADMIN);
        
        if (!adminExists) {
            const defaultAdmin = {
                id: 'usr_admin_' + Date.now(),
                nombre: 'Administrador',
                email: 'admin@universidad.edu',
                rol: DBConfig.ROLES.ADMIN,
                passwordHash: this.hashPassword('admin123'),
                fechaRegistro: new Date().toISOString(),
                ultimoAcceso: new Date().toISOString()
            };
            users.push(defaultAdmin);
            localStorage.setItem(DBConfig.STORAGE_KEYS.USERS, JSON.stringify(users));
            console.log('Admin por defecto creado: admin@universidad.edu / admin123');
        }
    }

    /**
     * Genera hash de contraseña (misma implementación que auth.js)
     * @param {string} password - Contraseña a hashear
     * @returns {string} Hash de la contraseña
     */
    hashPassword(password) {
        const salt = "EduPlatform_Secure_Salt_2026_!";
        let hash = 0;
        const str = salt + password + salt;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        let amplified = Math.abs(hash).toString(16).padStart(8, '0');
        for (let i = 0; i < 100; i++) {
            amplified = btoa(amplified + str).replace(/[^a-zA-Z0-9]/g, '').substring(0, 64);
        }
        return amplified;
    }

    // ==================== USUARIOS ====================

    /**
     * Obtiene todos los usuarios
     * @returns {Array} Lista de usuarios
     */
    getUsers() {
        return JSON.parse(localStorage.getItem(DBConfig.STORAGE_KEYS.USERS) || '[]');
    }

    /**
     * Obtiene un usuario por su ID
     * @param {string} id - ID del usuario
     * @returns {Object|null} Usuario o null si no existe
     */
    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    }

    /**
     * Obtiene un usuario por su email
     * @param {string} email - Email del usuario
     * @returns {Object|null} Usuario o null si no existe
     */
    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Object} Usuario creado
     */
    createUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            nombre: userData.nombre,
            email: userData.email.toLowerCase(),
            rol: userData.rol,
            passwordHash: this.hashPassword(userData.password),
            fechaRegistro: new Date().toISOString(),
            ultimoAcceso: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem(DBConfig.STORAGE_KEYS.USERS, JSON.stringify(users));
        return newUser;
    }

    /**
     * Actualiza un usuario existente
     * @param {string} id - ID del usuario
     * @param {Object} userData - Datos a actualizar
     * @returns {Object|null} Usuario actualizado o null si no existe
     */
    updateUser(id, userData) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            if (userData.password) {
                userData.passwordHash = this.hashPassword(userData.password);
                delete userData.password;
            }
            users[index] = { ...users[index], ...userData };
            localStorage.setItem(DBConfig.STORAGE_KEYS.USERS, JSON.stringify(users));
            return users[index];
        }
        return null;
    }

    /**
     * Elimina un usuario
     * @param {string} id - ID del usuario
     * @returns {boolean} True si se eliminó correctamente
     */
    deleteUser(id) {
        let users = this.getUsers();
        users = users.filter(u => u.id !== id);
        localStorage.setItem(DBConfig.STORAGE_KEYS.USERS, JSON.stringify(users));
        return true;
    }

    // ==================== CLASES ====================

    /**
     * Obtiene todas las clases
     * @returns {Array} Lista de clases
     */
    getClasses() {
        return JSON.parse(localStorage.getItem(DBConfig.STORAGE_KEYS.CLASSES) || '[]');
    }

    /**
     * Obtiene una clase por su ID
     * @param {string} id - ID de la clase
     * @returns {Object|null} Clase o null si no existe
     */
    getClassById(id) {
        const classes = this.getClasses();
        return classes.find(c => c.id === id);
    }

    /**
     * Crea una nueva clase
     * @param {Object} classData - Datos de la clase
     * @returns {Object} Clase creada
     */
    createClass(classData) {
        const classes = this.getClasses();
        const newClass = {
            id: 'cls_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ...classData,
            createdAt: new Date().toISOString(),
            studentsCount: 0,
            averageProgress: 0
        };
        classes.push(newClass);
        localStorage.setItem(DBConfig.STORAGE_KEYS.CLASSES, JSON.stringify(classes));
        return newClass;
    }

    /**
     * Actualiza una clase existente
     * @param {string} id - ID de la clase
     * @param {Object} classData - Datos a actualizar
     * @returns {Object|null} Clase actualizada o null si no existe
     */
    updateClass(id, classData) {
        const classes = this.getClasses();
        const index = classes.findIndex(c => c.id === id);
        if (index !== -1) {
            classes[index] = { ...classes[index], ...classData };
            localStorage.setItem(DBConfig.STORAGE_KEYS.CLASSES, JSON.stringify(classes));
            return classes[index];
        }
        return null;
    }

    /**
     * Elimina una clase
     * @param {string} id - ID de la clase
     * @returns {boolean} True si se eliminó correctamente
     */
    deleteClass(id) {
        let classes = this.getClasses();
        classes = classes.filter(c => c.id !== id);
        localStorage.setItem(DBConfig.STORAGE_KEYS.CLASSES, JSON.stringify(classes));
        return true;
    }

    // ==================== INSCRIPCIONES ====================

    /**
     * Obtiene todas las inscripciones
     * @returns {Array} Lista de inscripciones
     */
    getEnrollments() {
        return JSON.parse(localStorage.getItem(DBConfig.STORAGE_KEYS.ENROLLMENTS) || '[]');
    }

    /**
     * Inscribe un estudiante en una clase
     * @param {string} studentId - ID del estudiante
     * @param {string} classId - ID de la clase
     * @returns {boolean} True si se inscribió correctamente
     */
    enrollStudent(studentId, classId) {
        const enrollments = this.getEnrollments();
        const existing = enrollments.find(e => e.studentId === studentId && e.classId === classId);
        
        if (!existing) {
            enrollments.push({
                id: 'enr_' + Date.now(),
                studentId,
                classId,
                progress: 0,
                enrolledAt: new Date().toISOString(),
                lastAccess: new Date().toISOString(),
                completed: false
            });
            localStorage.setItem(DBConfig.STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
        }
        return true;
    }

    /**
     * Actualiza el progreso de un estudiante en una clase
     * @param {string} studentId - ID del estudiante
     * @param {string} classId - ID de la clase
     * @param {number} progress - Progreso (0-100)
     * @returns {Object|null} Inscripción actualizada o null
     */
    updateProgress(studentId, classId, progress) {
        const enrollments = this.getEnrollments();
        const enrollment = enrollments.find(e => e.studentId === studentId && e.classId === classId);
        
        if (enrollment) {
            enrollment.progress = progress;
            enrollment.lastAccess = new Date().toISOString();
            enrollment.completed = progress === 100;
            localStorage.setItem(DBConfig.STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
            return enrollment;
        }
        return null;
    }

    /**
     * Obtiene el progreso de un estudiante
     * @param {string} studentId - ID del estudiante
     * @returns {Array} Lista de inscripciones del estudiante
     */
    getStudentProgress(studentId) {
        const enrollments = this.getEnrollments();
        return enrollments.filter(e => e.studentId === studentId);
    }

    /**
     * Obtiene el progreso de una clase
     * @param {string} classId - ID de la clase
     * @returns {Array} Lista de inscripciones de la clase
     */
    getClassProgress(classId) {
        const enrollments = this.getEnrollments();
        return enrollments.filter(e => e.classId === classId);
    }

    // ==================== ACTIVIDAD ====================

    /**
     * Registra una actividad de usuario
     * @param {string} userId - ID del usuario
     * @param {string} page - Página/acción realizada
     * @param {number} sessionTime - Tiempo de sesión en segundos
     */
    logActivity(userId, page, sessionTime = 0) {
        const activities = this.getActivities();
        activities.push({
            id: 'act_' + Date.now(),
            userId,
            page,
            timestamp: new Date().toISOString(),
            sessionTime,
            ip: this.getIPAddress()
        });
        localStorage.setItem(DBConfig.STORAGE_KEYS.ACTIVITY, JSON.stringify(activities));
    }

    /**
     * Obtiene todas las actividades
     * @returns {Array} Lista de actividades
     */
    getActivities() {
        return JSON.parse(localStorage.getItem(DBConfig.STORAGE_KEYS.ACTIVITY) || '[]');
    }

    /**
     * Obtiene actividades de un usuario específico
     * @param {string} userId - ID del usuario
     * @returns {Array} Lista de actividades del usuario
     */
    getActivitiesByUser(userId) {
        const activities = this.getActivities();
        return activities.filter(a => a.userId === userId);
    }

    // ==================== UTILIDADES ====================

    /**
     * Genera una dirección IP simulada
     * @returns {string} Dirección IP simulada
     */
    getIPAddress() {
        return '192.168.1.' + Math.floor(Math.random() * 255);
    }

    /**
     * Limpia datos antiguos (más de 6 meses)
     * @returns {boolean} True si se completó correctamente
     */
    cleanOldData() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        let activities = this.getActivities();
        activities = activities.filter(a => new Date(a.timestamp) > sixMonthsAgo);
        localStorage.setItem(DBConfig.STORAGE_KEYS.ACTIVITY, JSON.stringify(activities));

        console.log('Datos antiguos limpiados');
        return true;
    }

    /**
     * Exporta todos los datos del sistema
     * @returns {Object} Objeto con todos los datos
     */
    exportData() {
        const data = {
            users: this.getUsers(),
            classes: this.getClasses(),
            enrollments: this.getEnrollments(),
            activities: this.getActivities(),
            exportDate: new Date().toISOString()
        };
        return data;
    }

    /**
     * Obtiene estadísticas del sistema
     * @returns {Object} Objeto con estadísticas
     */
    getStats() {
        const users = this.getUsers();
        const classes = this.getClasses();
        const enrollments = this.getEnrollments();
        const activities = this.getActivities();

        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);

        const activeUsers = users.filter(u => {
            const userActivities = activities.filter(a => a.userId === u.id);
            return userActivities.some(a => new Date(a.timestamp) > last24Hours);
        }).length;

        return {
            totalUsers: users.length,
            activeUsers,
            totalProfessors: users.filter(u => u.rol === DBConfig.ROLES.TEACHER).length,
            totalStudents: users.filter(u => u.rol === DBConfig.ROLES.STUDENT).length,
            totalAdmins: users.filter(u => u.rol === DBConfig.ROLES.ADMIN).length,
            totalClasses: classes.length,
            totalEnrollments: enrollments.length
        };
    }
}

// Instancia singleton de la base de datos
const db = new Database();

// Exportar para uso como módulo ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Database, db };
}
