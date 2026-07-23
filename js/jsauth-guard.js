/**
 * ============================================
 * GUARDIA DE AUTENTICACIÓN - QOMed Platform
 * ============================================
 * Protege las páginas del dashboard y maneja
 * redirecciones según rol de usuario.
 * Roles válidos: 'admin', 'profesor', 'alumno'
 */

(function() {
    'use strict';
    
    // Obtener página actual
    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || 'index.html';
    
    // Si es la página raíz (sin archivo), tratar como index.html
    const isIndexPage = (currentPage === 'index.html' || currentPage === '');
    
    // Obtener sesión del usuario
    let userData = null;
    try {
        userData = JSON.parse(localStorage.getItem('userQOMED'));
    } catch (e) {
        localStorage.removeItem('userQOMED');
    }
    
    // ============================================
    // CASO 1: Usuario NO autenticado
    // ============================================
    if (!userData) {
        if (isIndexPage) {
            // Ya está en index, verificar si hay mensaje para mostrar
            const message = sessionStorage.getItem('authMessage');
            if (message) {
                // El index.html tiene su propio manejador de mensajes
                // Solo limpiamos para que no se muestre dos veces
                console.log('Mensaje pendiente:', message);
            }
        } else {
            // Está en página protegida sin sesión → Redirigir a index con mensaje
            sessionStorage.setItem('authMessage', 'Debes iniciar sesión para acceder a esta página.');
            window.location.replace('index.html');
        }
        return;
    }
    
    // ============================================
    // CASO 2: Usuario SÍ autenticado
    // ============================================
    
    // Mapa de redirección según rol
    const ROLE_REDIRECT = {
        'admin': 'admin.html',
        'profesor': 'teacher.html',
        'alumno': 'student.html'
    };
    
    // Mapa inverso: qué rol puede acceder a cada página
    const PAGE_ROLE = {
        'admin.html': 'admin',
        'teacher.html': 'profesor',
        'student.html': 'alumno'
    };
    
    const userRole = userData.rol;
    const targetPage = ROLE_REDIRECT[userRole];
    
    // Si el rol no es válido
    if (!targetPage) {
        console.error('Rol no reconocido:', userRole);
        localStorage.removeItem('userQOMED');
        sessionStorage.setItem('authMessage', 'Error: Tipo de usuario no válido. Contacta al administrador.');
        window.location.replace('index.html');
        return;
    }
    
    // Si está en index.html con sesión activa → Redirigir a su dashboard
    if (isIndexPage) {
        window.location.replace(targetPage);
        return;
    }
    
    // Si está en una página protegida, verificar que tenga el rol correcto
    const requiredRole = PAGE_ROLE[currentPage];
    
    if (requiredRole && userRole !== requiredRole) {
        // No tiene permiso para esta página → Redirigir a su dashboard correcto
        sessionStorage.setItem('authMessage', 'No tienes permiso para acceder a esa sección. Has sido redirigido a tu panel.');
        window.location.replace(targetPage);
        return;
    }
    
    // Si llegó aquí, todo está bien: usuario autenticado en la página correcta
    console.log('Acceso autorizado:', userRole, '→', currentPage);
    
})();
