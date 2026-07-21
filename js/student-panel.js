class StudentPanel {
    constructor() {
        this.session = getCurrentSession();
        if (!this.session) {
            window.location.href = 'index.html';
            return;
        }
        this.currentView = 'all';
        this.init();
    }

    init() {
        this.loadClasses();
        this.loadActivity();
        this.setupEventListeners();
        
        // Log de acceso al panel
        db.logActivity(this.session.userId, 'student_panel', 0);
    }

    loadClasses() {
        const allClasses = db.getClasses();
        const enrollments = db.getStudentProgress(this.session.userId);

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
        grid.innerHTML = '';

        if (sortedClasses.length === 0) {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 40px;">No hay clases en esta categoría.</p>';
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
        div.style.borderTopColor = classItem.color || '#FFD700';

        let badge = '<span class="badge" style="margin-bottom: 10px; display: inline-block; background: var(--bg-secondary);">⏳ Pendiente</span>';
        if (classItem.completed) badge = '<span class="badge badge-success" style="margin-bottom: 10px; display: inline-block;">✅ Completada</span>';
        else if (classItem.enrolled && classItem.progress > 0) badge = '<span class="badge badge-warning" style="margin-bottom: 10px; display: inline-block;">🔄 En Progreso</span>';
        else if (classItem.enrolled) badge = '<span class="badge badge-info" style="margin-bottom: 10px; display: inline-block;">📋 Inscrito</span>';

        div.innerHTML = `
            <div class="class-card-header" style="background: linear-gradient(135deg, ${classItem.color}22 0%, transparent 100%);">
                <h3>${classItem.title}</h3>
                <p>${utils.truncate(classItem.description, 100)}</p>
            </div>
            <div class="class-card-body">
                ${badge}
                ${classItem.enrolled ? `
                    <div class="progress-bar"><div class="progress-fill" style="width: ${classItem.progress}%"></div></div>
                    <p class="progress-text">${classItem.progress}% completado</p>
                ` : ''}
                <div class="class-actions">
                    ${classItem.enrolled ? `
                        <a href="${classItem.link}?student=${this.session.userId}" target="_blank" class="btn btn-primary" onclick="studentPanel.logAccess('${classItem.id}')">📚 Acceder</a>
                    ` : `
                        <button class="btn btn-primary" onclick="studentPanel.enroll('${classItem.id}')">📝 Inscribirse</button>
                    `}
                </div>
            </div>
        `;
        return div;
    }

    enroll(classId) {
        db.enrollStudent(this.session.userId, classId);
        db.logActivity(this.session.userId, `enrolled_class_${classId}`, 0);
        utils.showToast('Inscripción exitosa', 'success');
        this.loadClasses();
    }

    logAccess(classId) {
        const enrollments = db.getEnrollments();
        const enrollment = enrollments.find(e => e.studentId === this.session.userId && e.classId === classId);
        if (enrollment) db.updateProgress(this.session.userId, classId, enrollment.progress);
        db.logActivity(this.session.userId, `access_class_${classId}`, 0);
    }

    loadActivity() {
        const activities = db.getActivitiesByUser(this.session.userId).slice(-10).reverse();
        const container = document.getElementById('activityList');
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
                const cls = db.getClassById(activity.page.replace('access_class_', ''));
                title = 'Acceso a clase'; desc = cls ? `Accediste a: ${cls.title}` : '';
            }
            else if (activity.page.startsWith('enrolled_class_')) {
                const cls = db.getClassById(activity.page.replace('enrolled_class_', ''));
                title = 'Inscripción'; desc = cls ? `Te inscribiste en: ${cls.title}` : '';
            }
            else if (activity.page === 'student_panel') { title = 'Panel de alumno'; desc = 'Accediste a tu panel'; }

            div.innerHTML = `<h4>${title}</h4><p>${desc}</p><p class="time">${utils.formatRelativeTime(activity.timestamp)}</p>`;
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

const studentPanel = new StudentPanel();