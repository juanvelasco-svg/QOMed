// Sistema de autenticación mejorado
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        // Verificar sesión existente
        const savedUser = localStorage.getItem('userQOMED');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }
    
    // Login de usuario
    async login(email, password) {
        try {
            // Aquí iría tu lógica de autenticación
            // Este es un ejemplo, reemplaza con tu API real
            const response = await this.authenticateUser(email, password);
            
            if (response.success) {
                const userData = {
                    id: response.user.id,
                    nombre: response.user.nombre,
                    email: response.user.email,
                    rol: response.user.rol, // 'administrador', 'profesor', 'estudiante'
                    token: response.token
                };
                
                // Guardar sesión
                localStorage.setItem('userQOMED', JSON.stringify(userData));
                this.currentUser = userData;
                
                // Redirigir según rol
                this.redirectByRole(userData.rol);
                
                return { success: true, user: userData };
            } else {
                return { success: false, message: response.message || 'Error de autenticación' };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, message: 'Error al conectar con el servidor' };
        }
    }
    
    // Registro de usuario
    async register(userData) {
        try {
            // Aquí iría tu lógica de registro
            // Este es un ejemplo, reemplaza con tu API real
            const response = await this.registerUser(userData);
            
            if (response.success) {
                return { 
                    success: true, 
                    message: 'Registro exitoso. Por favor, inicia sesión.' 
                };
            } else {
                return { success: false, message: response.message || 'Error en el registro' };
            }
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, message: 'Error al conectar con el servidor' };
        }
    }
    
    // Redirigir según rol del usuario
    redirectByRole(rol) {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Solo redirigir si no estamos ya en la página correcta
        switch(rol) {
            case 'administrador':
                if (currentPage !== 'admin.html') {
                    window.location.href = 'admin.html';
                }
                break;
            case 'profesor':
                if (currentPage !== 'teacher.html') {
                    window.location.href = 'teacher.html';
                }
                break;
            case 'estudiante':
                if (currentPage !== 'student.html') {
                    window.location.href = 'student.html';
                }
                break;
            default:
                // Rol no válido - limpiar todo y volver a index
                console.error('Rol no válido:', rol);
                this.logout('Error: Rol de usuario no válido');
                break;
        }
    }
    
    // Cerrar sesión
    logout(message = 'Has cerrado sesión exitosamente.') {
        localStorage.removeItem('userQOMED');
        this.currentUser = null;
        
        // Guardar mensaje de despedida
        sessionStorage.setItem('authMessage', message);
        
        // Redirigir a index
        if (window.location.pathname.split('/').pop() !== 'index.html') {
            window.location.href = 'index.html';
        } else {
            // Si ya estamos en index, recargar para mostrar mensaje
            window.location.reload();
        }
    }
    
    // Verificar si el usuario actual tiene un rol específico
    hasRole(rol) {
        return this.currentUser && this.currentUser.rol === rol;
    }
    
    // Verificar si está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Métodos para simular API (reemplazar con tu backend real)
    async authenticateUser(email, password) {
        // SIMULACIÓN - Reemplaza esto con tu llamada API real
        return new Promise((resolve) => {
            setTimeout(() => {
                // Ejemplo de respuesta exitosa
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        nombre: 'Usuario Ejemplo',
                        email: email,
                        rol: 'estudiante' // Cambiar según necesidad
                    },
                    token: 'jwt-token-ejemplo'
                });
            }, 1000);
        });
    }
    
    async registerUser(userData) {
        // SIMULACIÓN - Reemplaza esto con tu llamada API real
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Usuario registrado exitosamente'
                });
            }, 1000);
        });
    }
}

// Inicializar sistema de autenticación
const auth = new AuthSystem();

// Exportar para uso global
window.auth = auth;
