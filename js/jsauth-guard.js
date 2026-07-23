// Guard de autenticación mejorado
(function() {
    // Verificar si ya estamos en index.html para evitar redirección circular
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Obtener datos de sesión
    const userData = JSON.parse(localStorage.getItem('userQOMED'));
    
    // Si no hay sesión y NO estamos en index.html, redirigir a index
    if (!userData && currentPage !== 'index.html') {
        // Guardar mensaje para mostrar en index
        sessionStorage.setItem('authMessage', 'Por favor, inicia sesión para acceder a esta página.');
        window.location.href = 'index.html';
        return;
    }
    
    // Si hay sesión y estamos en index.html, redirigir según rol
    if (userData && currentPage === 'index.html') {
        switch(userData.rol) {
            case 'administrador':
                window.location.href = 'admin.html';
                break;
            case 'profesor':
                window.location.href = 'teacher.html';
                break;
            case 'estudiante':
                window.location.href = 'student.html';
                break;
            default:
                // Rol no válido - limpiar sesión
                localStorage.removeItem('userQOMED');
                sessionStorage.setItem('authMessage', 'Error: Rol de usuario no válido. Por favor, contacte al administrador.');
                // Ya estamos en index, solo recargar para mostrar mensaje
                break;
        }
    }
    
    // Si no hay sesión y estamos en index.html, verificar si hay mensaje para mostrar
    if (!userData && currentPage === 'index.html') {
        const message = sessionStorage.getItem('authMessage');
        if (message) {
            // Esperar a que el DOM cargue para mostrar el mensaje
            document.addEventListener('DOMContentLoaded', function() {
                showAuthMessage(message);
            });
            // Limpiar el mensaje después de mostrarlo
            sessionStorage.removeItem('authMessage');
        }
    }
})();

// Función para mostrar el anuncio de autenticación
function showAuthMessage(message) {
    // Crear elemento de anuncio
    const anuncio = document.createElement('div');
    anuncio.id = 'auth-announcement';
    anuncio.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        font-family: Arial, sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideDown 0.5s ease-out;
    `;
    
    // Agregar icono y mensaje
    anuncio.innerHTML = `
        <span style="font-size: 20px;">🔐</span>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 18px;
            margin-left: 10px;
        ">✕</button>
    `;
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100px);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Insertar en el DOM
    document.body.insertBefore(anuncio, document.body.firstChild);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (anuncio.parentElement) {
            anuncio.style.animation = 'slideUp 0.5s ease-in';
            setTimeout(() => anuncio.remove(), 500);
        }
    }, 5000);
}

// Función helper para verificar autenticación desde otras páginas
function checkAuth() {
    const userData = JSON.parse(localStorage.getItem('userQOMED'));
    if (!userData) {
        sessionStorage.setItem('authMessage', 'Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}
