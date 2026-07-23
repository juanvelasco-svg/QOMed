class Database {
    constructor() {
        this.init();
    }

    init() {
        // Inicializar estructuras si no existen
        if (!localStorage.getItem(CONFIG.STORAGE_KEYS.CLASSES)) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.CLASSES, JSON.stringify([]));
        }

        if (!localStorage.getItem(CONFIG.STORAGE_KEYS.ENROLLMENTS)) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.ENROLLMENTS, JSON.stringify([]));
        }

        if (!localStorage.getItem(CONFIG.STORAGE_KEYS.ACTIVITY)) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.ACTIVITY, JSON.stringify([]));
        }

        // Crear admin por defecto si no existe
        this.createDefaultAdmin();
    }

    createDefaultAdmin() {
        const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) || [];
        const adminExists = users.some(u => u.rol === CONFIG.ROLES.ADMIN);
        
        if (!adminExists) {
            const defaultAdmin = {
                id: 'usr_admin_' + Date.now(),
                nombre: 'Administrador',
                email: 'admin@universidad.edu',
                rol: CONFIG.ROLES.ADMIN,
                passwordHash: this.hashPassword('admin123'),
                fechaRegistro: new Date().toISOString(),
                ultimoAcceso: new Date().toISOString()
            };
            users.push(defaultAdmin);
            localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
            console.log('Admin por defecto creado: admin@universidad.edu / admin123');
        }
    }

    hashPassword(password) {
        // Usar la misma función de hash que auth.js
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

    // Usuarios
    getUsers() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

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
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
        return newUser;
    }

    updateUser(id, userData) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            if (userData.password) {
                userData.passwordHash = this.hashPassword(userData.password);
                delete userData.password;
            }
            users[index] = { ...users[index], ...userData };
            localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
            return users[index];
        }
        return null;
    }

    deleteUser(id) {
        let users = this.getUsers();
        users = users.filter(u => u.id !== id);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
        return true;
    }

    // Clases
    getCurrentUser() {
        // Ejemplo de implementación:
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    getClasses() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.CLASSES) || '[]');
    }

    getClassById(id) {
        const classes = this.getClasses();
        return classes.find(c => c.id === id);
    }

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
        localStorage.setItem(CONFIG.STORAGE_KEYS.CLASSES, JSON.stringify(classes));
        return newClass;
    }

    updateClass(id, classData) {
        const classes = this.getClasses();
        const index = classes.findIndex(c => c.id === id);
        if (index !== -1) {
            classes[index] = { ...classes[index], ...classData };
            localStorage.setItem(CONFIG.STORAGE_KEYS.CLASSES, JSON.stringify(classes));
            return classes[index];
        }
        return null;
    }

    deleteClass(id) {
        let classes = this.getClasses();
        classes = classes.filter(c => c.id !== id);
        localStorage.setItem(CONFIG.STORAGE_KEYS.CLASSES, JSON.stringify(classes));
        return true;
    }

    // Inscripciones/Progreso
    getEnrollments() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.ENROLLMENTS) || '[]');
    }

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
            localStorage.setItem(CONFIG.STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
        }
        return true;
    }

    updateProgress(studentId, classId, progress) {
        const enrollments = this.getEnrollments();
        const enrollment = enrollments.find(e => e.studentId === studentId && e.classId === classId);
        
        if (enrollment) {
            enrollment.progress = progress;
            enrollment.lastAccess = new Date().toISOString();
            enrollment.completed = progress === 100;
            localStorage.setItem(CONFIG.STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
            return enrollment;
        }
        return null;
    }

    getStudentProgress(studentId) {
        const enrollments = this.getEnrollments();
        return enrollments.filter(e => e.studentId === studentId);
    }

    getClassProgress(classId) {
        const enrollments = this.getEnrollments();
        return enrollments.filter(e => e.classId === classId);
    }

    // Actividad
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
        localStorage.setItem(CONFIG.STORAGE_KEYS.ACTIVITY, JSON.stringify(activities));
    }

    getActivities() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.ACTIVITY) || '[]');
    }

    getActivitiesByUser(userId) {
        const activities = this.getActivities();
        return activities.filter(a => a.userId === userId);
    }

    // Utilidades
    getIPAddress() {
        return '192.168.1.' + Math.floor(Math.random() * 255);
    }

    // Limpieza de datos antiguos
    cleanOldData() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        let activities = this.getActivities();
        activities = activities.filter(a => new Date(a.timestamp) > sixMonthsAgo);
        localStorage.setItem(CONFIG.STORAGE_KEYS.ACTIVITY, JSON.stringify(activities));

        console.log('Datos antiguos limpiados');
        return true;
    }

    // Exportar datos
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

    // Estadísticas
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
            totalProfessors: users.filter(u => u.rol === CONFIG.ROLES.TEACHER).length,
            totalStudents: users.filter(u => u.rol === CONFIG.ROLES.STUDENT).length,
            totalAdmins: users.filter(u => u.rol === CONFIG.ROLES.ADMIN).length,
            totalClasses: classes.length,
            totalEnrollments: enrollments.length
        };
    }
}

let db;

window.addEventListener('load', () => {
    try {
        db = new Database();
        window.db = db; // <--- AGREGA ESTA LÍNEA para hacerlo global
        console.log('Base de datos inicializada correctamente');
    } catch (error) {
        console.error('Error fatal al inicializar DB:', error);
    }
});