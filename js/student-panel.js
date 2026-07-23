class StudentPanel {
    constructor() {
        // 1. Capturar la instancia global de la base de datos
        this.db = window.db;

        // 2. Validar que db exista antes de continuar
        if (!this.db) {
            console.error("Error crítico: La base de datos (db) no se ha inicializado aún.");
            return; 
        }

        this.session = getCurrentSession();
        if (!this.session) {
            window.location.href = 'index.html';
            return;
        }
        
        this.currentView = 'all';
        // No llamamos a init() aquí directamente porque necesita ser async
    }

    async init() {
        // Esperar a que carguen los datos asíncronos
        await this.loadClasses();
        this.loadActivity();
        this.setupEventListeners();
        
        // Log de acceso al panel
        this.db.logActivity(this.session.userId, 'student_panel', 0);
    }

    async loadClasses() {
        try {
            // AHORA SÍ USAMOS AWAIT porque getClasses devuelve Promesa
            const allClasses = await this.db.getClasses();
            const enrollments = this.db.getStudentProgress(this.session.userId);

            const enrollmentMap = {};
            enrollments.forEach(e => { enrollmentMap[e.classId] = e; });

            const classesWithProgress = allClasses.map(classItem => ({
                ...classItem,
                progress: enrollmentMap[classItem.id] ? enrollmentMap[classItem.id].progress : 0,
                enrolled: !!enrollmentMap[classItem.id],
                completed: enrollmentMap[classItem.id] ? enrollmentMap[classItem.id].completed : false
            }));

            const filteredClasses = this.filterClasses(classesWithProgress);
            const sortedClasses = this.sortClasses(filteredClasses);

            const grid = document.getElementById('studentClassesGrid');
            if (!grid) return; // Seguridad si el DOM no está listo
            grid.innerHTML = '';

            if (sortedClasses.length === 0) {
                grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 40px; color: var(--text-secondary);">No hay clases disponibles en esta categoría.</p>';
                return;
            }

            sortedClasses.forEach(classItem => {
                grid.appendChild(this.createClassCard(classItem));
            });
        } catch (error) {
            console.error("Error cargando clases:", error);
            const grid = document.getElementById('studentClassesGrid');
            if(grid) grid.innerHTML = '<p class="error">Error al cargar clases. Recarga la página.</p>';
        }
    }

    filterClasses(classes) {
        switch (this.currentView) {
            case 'pending': return classes.filter(c => !c.enrolled);
            case 'progress': return classes.filter(c => c.enrolled && !c.completed && c.progress > 0);
            case 'completed': return classes.filter(c => c.completed);
            default: return classes;
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
        // Asegurar que tenga color por defecto si no tiene
        const color = classItem.color || '#4A90E2';
        div.style.borderTopColor = color;

        let badge = '<span class="badge" style="margin-bottom: 10px; display: inline-block; background: var(--bg-secondary);">⏳ Pendiente</span>';
        if (classItem.completed) badge = '<span class="badge badge-success" style="margin-bottom: 10px; display: inline-block;">✅ Completada</span>';
        else if (classItem.enrolled && classItem.progress > 0) badge = '<span class="badge badge-warning" style="margin-bottom: 10px; display: inline-block;">🔄 En Progreso</span>';
        else if (classItem.enrolled) badge = '<span class="badge badge-info" style="margin-bottom: 10px; display: inline-block;">📋 Inscrito</span>';

        // Usar truncate si existe en utils, sino cortar manual
        const desc = typeof utils !== 'undefined' && utils.truncate 
            ? utils.truncate(classItem.description, 100) 
            : (classItem.description || '').substring(0, 100) + '...';

        div.innerHTML = `
            <div class="class-card-header" style="background: linear-gradient(135deg, ${color}22 0%, transparent 100%);">
                <h3>${classItem.title || 'Clase sin título'}</h3>
                <p>${desc}</p>
            </div>
            <div class="class-card-body">
                ${badge}
                ${classItem.enrolled ? `
                    <div class="progress-bar"><div class="progress-fill" style="width: ${classItem.progress}%"></div></div>
                    <p class="progress-text">${classItem.progress}% completado</p>
                ` : ''}
                <div class="class-actions">
                    ${classItem.enrolled ? `
                        <a href="${classItem.link || '#'}?student=${this.session.userId}" target="_blank" class="btn btn-primary">📚 Acceder</a>
                    ` : `
                        <button class="btn btn-primary" onclick="window.studentPanelInstance.enroll('${classItem.id}')">📝 Inscribirse</button>
                    `}
                </div>
            </div>
        `;
        return div;
    }

    enroll(classId) {
        this.db.enrollStudent(this.session.userId, classId);
        this.db.logActivity(this.session.userId, `enrolled_class_${classId}`, 0);
        if(typeof utils !== 'undefined') utils.showToast('Inscripción exitosa', 'success');
        else alert('Inscripción exitosa');
        this.loadClasses();
    }

    loadActivity() {
        const activities = this.db.getActivitiesByUser(this.session.userId).slice(-10).reverse();
        const container = document.getElementById('activityList');
        if (!container) return;
        container.innerHTML = '';

        if (activities.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Sin actividad reciente</p>';
            return;
        }

        activities.forEach(activity => {
            const div = document.createElement('div');
            div.className = 'activity-item';
            let title = 'Actividad', desc = '';

            if (activity.page === 'login') { title = 'Inicio de sesión'; desc = 'Ingresaste al sistema'; }
            else if (activity.page.startsWith('access_class_')) {
                const cls = this.db.getClassById(activity.page.replace('access_class_', ''));
                title = 'Acceso a clase'; desc = cls ? `Accediste a: ${cls.title}` : 'Accediste a una clase';
            }
            else if (activity.page.startsWith('enrolled_class_')) {
                const cls = this.db.getClassById(activity.page.replace('enrolled_class_', ''));
                title = 'Inscripción'; desc = cls ? `Te inscribiste en: ${cls.title}` : 'Te inscribiste en una clase';
            }
            else if (activity.page === 'student_panel') { title = 'Panel de alumno'; desc = 'Accediste a tu panel'; }

            const timeStr = typeof utils !== 'undefined' && utils.formatRelativeTime 
                ? utils.formatRelativeTime(activity.timestamp) 
                : new Date(activity.timestamp).toLocaleDateString();

            div.innerHTML = `<h4>${title}</h4><p>${desc}</p><p class="time">${timeStr}</p>`;
            container.appendChild(div);
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.view-toggle .btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-toggle .btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.loadClasses();
            });
        });
    }
}

// Inicialización segura
let studentPanelInstance = null;

window.addEventListener('load', () => {
    if (window.db) {
        studentPanelInstance = new StudentPanel();
        if(studentPanelInstance) {
            studentPanelInstance.init();
            console.log('StudentPanel iniciado correctamente.');
        }
    } else {
        console.error('Error fatal: window.db no existe tras el evento load.');
    }
});