class StudentPanel {
    constructor() {
        // 1. Validar sesión PRIMERO
        this.session = getCurrentSession();
        if (!this.session) {
            console.warn("No hay sesión, redirigiendo a login...");
            window.location.href = 'index.html';
            return;
        }

        // 2. Validar DB DESPUÉS
        this.db = window.db;
        if (!this.db) {
            console.error("⚠️ DB no lista aún. Reintentando en 500ms...");
            // En lugar de fallar, reintentamos una sola vez
            setTimeout(() => {
                this.db = window.db;
                if (this.db) {
                    this.init();
                } else {
                    console.error("❌ Error crítico: DB no cargó tras reintento.");
                    alert("Error de carga. Recarga la página.");
                }
            }, 500);
            return; // Salimos del constructor aquí, init() se llamará luego
        }

        this.currentView = 'all';
        this.init();
    }

    init() {
        console.log("Inicializando panel para:", this.session.userId);
        this.loadClasses();
        this.loadActivity();
        this.setupEventListeners();
        this.db.logActivity(this.session.userId, 'student_panel', 0);
    }

    loadClasses() {
        // LLAMADA SÍNCRONA: getClasses() devuelve un array directamente
        const allClasses = this.db.getClasses();
        const enrollments = this.db.getStudentProgress(this.session.userId);

        // Crear mapa de inscripciones para acceso rápido
        const enrollmentMap = {};
        enrollments.forEach(e => { 
            enrollmentMap[e.classId] = e; 
        });

        // Mezclar clases con progreso
        const classesWithProgress = allClasses.map(classItem => ({
            ...classItem,
            progress: enrollmentMap[classItem.id] ? enrollmentMap[classItem.id].progress : 0,
            enrolled: !!enrollmentMap[classItem.id],
            completed: enrollmentMap[classItem.id] ? enrollmentMap[classItem.id].completed : false
        }));

        // Filtrar y ordenar
        const filteredClasses = this.filterClasses(classesWithProgress);
        const sortedClasses = this.sortClasses(filteredClasses);

        // Renderizar
        const grid = document.getElementById('studentClassesGrid');
        if (!grid) {
            console.warn("No se encontró el contenedor 'studentClassesGrid'");
            return;
        }

        grid.innerHTML = '';

        if (sortedClasses.length === 0) {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 40px; color: var(--text-secondary);">No hay clases disponibles en esta categoría.</p>';
            return;
        }

        sortedClasses.forEach(classItem => {
            grid.appendChild(this.createClassCard(classItem));
        });
    }

    filterClasses(classes) {
        switch (this.currentView) {
            case 'pending': return classes.filter(c => !c.enrolled);
            case 'progress': return classes.filter(c => c.enrolled && !c.completed && c.progress > 0);
            case 'completed': return classes.filter(c => c.completed);
            default: return classes; // 'all'
        }
    }

    sortClasses(classes) {
        return classes.sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            if (a.enrolled && !b.enrolled) return -1;
            if (!a.enrolled && b.enrolled) return 1;
            return b.progress - a.progress;
        });
    }

    createClassCard(classItem) {
        const div = document.createElement('div');
        div.className = 'class-card';
        // Usar color por defecto si no existe
        const color = classItem.color || '#4F46E5'; 
        div.style.borderTopColor = color;

        let badge = '<span class="badge" style="margin-bottom: 10px; display: inline-block; background: var(--bg-secondary); color: var(--text-secondary);">⏳ Pendiente</span>';
        if (classItem.completed) {
            badge = '<span class="badge badge-success" style="margin-bottom: 10px; display: inline-block;">✅ Completada</span>';
        } else if (classItem.enrolled && classItem.progress > 0) {
            badge = '<span class="badge badge-warning" style="margin-bottom: 10px; display: inline-block;">🔄 En Progreso</span>';
        } else if (classItem.enrolled) {
            badge = '<span class="badge badge-info" style="margin-bottom: 10px; display: inline-block;">📋 Inscrito</span>';
        }

        const description = classItem.description ? utils.truncate(classItem.description, 100) : 'Sin descripción';

        div.innerHTML = `
            <div class="class-card-header" style="background: linear-gradient(135deg, ${color}22 0%, transparent 100%);">
                <h3>${classItem.title}</h3>
                <p>${description}</p>
            </div>
            <div class="class-card-body">
                ${badge}
                ${classItem.enrolled ? `
                    <div class="progress-bar" style="width: 100%; height: 8px; background: #eee; border-radius: 4px; margin: 10px 0; overflow: hidden;">
                        <div class="progress-fill" style="width: ${classItem.progress}%; height: 100%; background: ${color}; transition: width 0.3s;"></div>
                    </div>
                    <p class="progress-text" style="font-size: 0.9rem; color: var(--text-secondary);">${classItem.progress}% completado</p>
                ` : ''}
                <div class="class-actions" style="margin-top: 15px;">
                    ${classItem.enrolled ? `
                        <a href="${classItem.link}?student=${this.session.userId}" target="_blank" class="btn btn-primary" style="text-decoration: none;">📚 Acceder</a>
                    ` : `
                        <button class="btn btn-primary" onclick="window.studentPanel.enroll('${classItem.id}')">📝 Inscribirse</button>
                    `}
                </div>
            </div>
        `;
        return div;
    }

    enroll(classId) {
        if(!confirm("¿Deseas inscribirte en esta clase?")) return;
        
        this.db.enrollStudent(this.session.userId, classId);
        this.db.logActivity(this.session.userId, `enrolled_class_${classId}`, 0);
        
        if(window.utils) {
            window.utils.showToast('Inscripción exitosa', 'success');
        } else {
            alert('Inscripción exitosa');
        }
        
        this.loadClasses();
    }

    logAccess(classId) {
        const enrollments = this.db.getEnrollments();
        const enrollment = enrollments.find(e => e.studentId === this.session.userId && e.classId === classId);
        if (enrollment) {
            this.db.updateProgress(this.session.userId, classId, enrollment.progress);
        }
        this.db.logActivity(this.session.userId, `access_class_${classId}`, 0);
    }

    loadActivity() {
        const activities = this.db.getActivitiesByUser(this.session.userId).slice(-10).reverse();
        const container = document.getElementById('activityList');
        
        if (!container) return;

        container.innerHTML = '';

        if (activities.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">Sin actividad reciente</p>';
            return;
        }

        activities.forEach(activity => {
            const div = document.createElement('div');
            div.className = 'activity-item';
            let title = 'Actividad'; 
            let desc = '';

            if (activity.page === 'login') { 
                title = 'Inicio de sesión'; 
                desc = 'Ingresaste al sistema'; 
            } else if (activity.page.startsWith('access_class_')) {
                const cls = this.db.getClassById(activity.page.replace('access_class_', ''));
                title = 'Acceso a clase'; 
                desc = cls ? `Accediste a: ${cls.title}` : 'Acceso a clase';
            } else if (activity.page.startsWith('enrolled_class_')) {
                const cls = this.db.getClassById(activity.page.replace('enrolled_class_', ''));
                title = 'Inscripción'; 
                desc = cls ? `Te inscribiste en: ${cls.title}` : 'Inscripción en clase';
            } else if (activity.page === 'student_panel') { 
                title = 'Panel de alumno'; 
                desc = 'Accediste a tu panel'; 
            }

            const timeStr = window.utils ? window.utils.formatRelativeTime(activity.timestamp) : activity.timestamp;

            div.innerHTML = `
                <h4 style="margin: 0 0 5px 0; font-size: 1rem;">${title}</h4>
                <p style="margin: 0 0 5px 0; font-size: 0.9rem; color: var(--text-secondary);">${desc}</p>
                <p class="time" style="margin: 0; font-size: 0.8rem; color: #999;">${timeStr}</p>
            `;
            container.appendChild(div);
        });
    }

    setupEventListeners() {
        const buttons = document.querySelectorAll('.view-toggle .btn');
        buttons.forEach(btn => {
            // Clonar nodo para eliminar listeners previos o usar flag
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', () => {
                document.querySelectorAll('.view-toggle .btn').forEach(b => b.classList.remove('active'));
                newBtn.classList.add('active');
                this.currentView = newBtn.dataset.view;
                this.loadClasses();
            });
        });
    }
}

// Inicialización robusta
let panelInitAttempted = false;

window.addEventListener('load', () => {
    if (panelInitAttempted) return; // Evitar doble ejecución
    panelInitAttempted = true;

    if (window.db) {
        window.studentPanel = new StudentPanel();
    } else {
        console.warn("Esperando a DB en evento load...");
        // Último reintento
        setTimeout(() => {
            if(window.db && !window.studentPanel) {
                window.studentPanel = new StudentPanel();
            }
        }, 1000);
    }
});