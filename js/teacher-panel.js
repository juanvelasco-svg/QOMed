class TeacherPanel {
    constructor() {
        this.session = getCurrentSession();
        if (!this.session || (this.session.rol !== 'profesor' && this.session.rol !== 'admin')) {
            console.warn("Acceso denegado: no es profesor ni admin");
            if (this.session) {
                const redirectMap = {
                    'alumno': 'student.html'
                };
                window.location.href = redirectMap[this.session.rol] || 'index.html';
            } else {
                window.location.href = 'index.html';
            }
            return;
        }
        this.init();
    }

    init() {
        this.loadClasses();
        this.loadStats();
        this.setupEventListeners();
    }

    loadStats() {
        const allClasses = db.getClasses();
        const userId = this.session.id || this.session.userId;
        const classes = this.session.rol === 'admin' 
            ? allClasses 
            : allClasses.filter(c => c.teacherId === userId);
        
        let totalStudents = 0;
        let totalProgress = 0;
        let connectedCount = 0;
        
        classes.forEach(cls => {
            const enrollments = db.getClassProgress(cls.id);
            totalStudents += enrollments.length;
            
            enrollments.forEach(enr => {
                totalProgress += enr.progress;
            });
            
            if (enrollments.length > 0) {
                connectedCount++;
            }
        });
        
        const avgProgress = totalStudents > 0 ? Math.round(totalProgress / totalStudents) : 0;
        
        const totalClassesEl = document.getElementById('totalClasses');
        const totalStudentsEl = document.getElementById('totalStudents');
        const avgProgressEl = document.getElementById('avgProgress');
        const connectedClassesEl = document.getElementById('connectedClasses');
        
        if (totalClassesEl) totalClassesEl.textContent = classes.length;
        if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
        if (avgProgressEl) avgProgressEl.textContent = avgProgress + '%';
        if (connectedClassesEl) connectedClassesEl.textContent = connectedCount;
    }

    loadClasses() {
        const allClasses = db.getClasses();
        const userId = this.session.id || this.session.userId;
        const classes = this.session.rol === 'admin' 
            ? allClasses 
            : allClasses.filter(c => c.teacherId === userId);
        
        const grid = document.getElementById('classesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';

        if (classes.length === 0) {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 40px;">No hay clases registradas.</p>';
            return;
        }

        classes.forEach(classItem => {
            const card = this.createClassCard(classItem);
            grid.appendChild(card);
        });
    }

    createClassCard(classItem) {
        const enrollments = db.getClassProgress(classItem.id);
        const studentsCount = enrollments.length;
        const avgProgress = utils.calculateAverageProgress(enrollments);

        const div = document.createElement('div');
        div.className = 'class-card';
        div.style.borderTopColor = classItem.color || '#FFD700';
        
        div.innerHTML = `
            <div class="class-card-header" style="background: linear-gradient(135deg, ${classItem.color}22 0%, transparent 100%);">
                <h3>${classItem.title}</h3>
                <p>${utils.truncate(classItem.description, 100)}</p>
            </div>
            <div class="class-card-body">
                <div class="class-stats">
                    <span>👥 ${studentsCount} alumnos</span>
                    <span> Progreso: ${avgProgress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${avgProgress}%"></div>
                </div>
                <div class="class-actions">
                    <button class="btn btn-secondary" onclick="teacherPanel.viewProgress('${classItem.id}')">👁 Ver Progreso</button>
                    <button class="btn btn-secondary" onclick="teacherPanel.editClass('${classItem.id}')">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="teacherPanel.deleteClass('${classItem.id}')"> Eliminar</button>
                </div>
            </div>
        `;
        return div;
    }

    openClassModal(classId = null) {
        const modal = document.getElementById('classModal');
        const form = document.getElementById('classForm');
        if (!modal || !form) return;
        
        form.reset();
        
        if (classId) {
            const classItem = db.getClassById(classId);
            if (classItem) {
                document.getElementById('classId').value = classItem.id;
                document.getElementById('classTitle').value = classItem.title;
                document.getElementById('classDescription').value = classItem.description;
                document.getElementById('classLink').value = classItem.link;
                document.getElementById('classColor').value = classItem.color || '#4CAF50';
                document.getElementById('classModalTitle').textContent = 'Editar Clase';
            }
        } else {
            document.getElementById('classId').value = '';
            document.getElementById('classColor').value = utils.getRandomColor();
            document.getElementById('classModalTitle').textContent = 'Nueva Clase';
        }
        modal.classList.add('active');
    }

    editClass(classId) { this.openClassModal(classId); }

    deleteClass(classId) {
        if (!utils.confirm('¿Eliminar esta clase y sus datos?')) return;
        db.deleteClass(classId);
        utils.showToast('Clase eliminada', 'success');
        this.loadClasses();
    }

    viewProgress(classId) {
        const classItem = db.getClassById(classId);
        if (!classItem) return;

        document.getElementById('progressClassName').textContent = classItem.title;
        const enrollments = db.getClassProgress(classId);
        const tbody = document.getElementById('progressTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (enrollments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay alumnos inscritos</td></tr>';
        } else {
            enrollments.forEach(enrollment => {
                const student = db.getUserById(enrollment.studentId);
                if (student) {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${student.nombre}</td>
                        <td>${student.email}</td>
                        <td>
                            <div class="progress-bar" style="width: 120px; display: inline-block;"><div class="progress-fill" style="width: ${enrollment.progress}%"></div></div>
                            <span>${enrollment.progress}%</span>
                        </td>
                        <td>${utils.formatRelativeTime(enrollment.lastAccess)}</td>
                        <td><a href="${classItem.link}?student=${student.id}" target="_blank" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;">Acceder</a></td>
                    `;
                    tbody.appendChild(tr);
                }
            });
        }
        document.getElementById('progressModal').classList.add('active');
    }

    closeProgressModal() { 
        const modal = document.getElementById('progressModal');
        if (modal) modal.classList.remove('active'); 
    }
    
    closeModal() { 
        const modal = document.getElementById('classModal');
        if (modal) modal.classList.remove('active'); 
    }

    setupEventListeners() {
        const classForm = document.getElementById('classForm');
        if (classForm) {
            classForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveClass();
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) e.target.classList.remove('active');
        });
    }

    saveClass() {
        const classId = document.getElementById('classId').value;
        const userId = this.session.id || this.session.userId;
        const classData = {
            title: document.getElementById('classTitle').value,
            description: document.getElementById('classDescription').value,
            link: document.getElementById('classLink').value,
            color: document.getElementById('classColor').value,
            teacherId: userId
        };

        try {
            if (classId) {
                db.updateClass(classId, classData);
                utils.showToast('Clase actualizada', 'success');
            } else {
                db.createClass(classData);
                utils.showToast('Clase creada', 'success');
            }
            this.closeModal();
            this.loadClasses();
        } catch (error) {
            utils.showToast('Error al guardar', 'error');
        }
    }
}

// Inicialización SEGURA - Solo si estamos en teacher.html o admin.html
if (window.location.pathname.includes('teacher.html') || 
    (window.location.pathname.includes('admin.html') && getCurrentSession()?.rol === 'profesor')) {
    window.addEventListener('load', () => {
        if (!window.teacherPanel) {
            window.teacherPanel = new TeacherPanel();
        }
    });
}
