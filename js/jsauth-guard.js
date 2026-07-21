/**
 * js/auth-guard.js
 * Protección de rutas. Verifica sesión y roles antes de renderizar contenido.
 */

const requireAuth = (allowedRoles) => {
    const session = getCurrentSession();

    // 1. Verificar si existe una sesión válida
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Verificar si el rol tiene permiso para acceder a esta página
    if (!allowedRoles.includes(session.rol)) {
        // Redirigir al panel que sí le corresponde
        const redirectMap = {
            'admin': 'admin.html',
            'profesor': 'teacher.html',
            'alumno': 'student.html'
        };
        
        const correctPath = redirectMap[session.rol] || 'index.html';
        
        // Usamos setTimeout para asegurar que la alerta se muestre antes de la redirección
        setTimeout(() => {
            alert("⚠️ Acceso denegado: No tienes permisos para ver esta página. Serás redirigido a tu panel.");
            window.location.href = correctPath;
        }, 100);
    }
};