/**
 * ============================================
 * TEACHER PANEL - QOMed Platform
 * ============================================
 */

class TeacherPanel {
    constructor() {
        this.session = getCurrentSession();
        if (!this.session || (this.session.rol !== 'profesor' && this.session.rol !== 'admin')) {
            this.redirectUnauthorized();
            return;
        }
        this.charts = {};
        this.init();
    }

    redirectUnauthorized() {
        if (this.session) {
            var redirectMap = {
                'alumno': 'student.html',
                'admin': 'admin.html'
            };
            window.location.href = redirectMap[this.session.rol] || 'index.html';
        } else {
            window.location.href = 'index.html';
        }
    }

    init() {
        this.setupNavigation();
        this.loadClasses();
        this.loadStats();
        this.setupEventListeners();
        this.populateFilters();
    }

    setupNavigation() {
        var self = this;
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var section = this.dataset.section;
                
                document.querySelectorAll('.nav-item').forEach(function(ni) {
                    ni.classList.remove('active');
                });
                this.classList.add('active');
                
                document.querySelectorAll('.content-section').forEach(function(s) {
                    s.classList.remove('active');
                });
                
                var sectionEl = document.getElementById(section + 'Section');
                if (sectionEl) {
                    sectionEl.classList.add('active');
                    if (section === 'activity') self.loadStudentActivity();
                    if (section === 'access') self.loadAccessLog();
                    if (section === 'students') self.loadStudentsList();
                }
            });
        });
    }

    populateFilters() {
        var myClasses = this.getMyClasses();
        var self = this;
        
        ['activityClassFilter', 'accessClassFilter', 'studentClassFilter'].forEach(function(filterId) {
            var select = document.getElementById(filterId);
            if (select) {
                select.innerHTML = '<option value="">Todas las clases</option>';
                myClasses.forEach(function(cls) {
                    select.innerHTML += '<option value="' + cls.id + '">' + cls.title + '</option>';
                });
            }
        });
        
        var allEnrollments = this.getAllEnrollments();
        var studentIds = [];
        allEnrollments.forEach(function(e) {
            if (studentIds.indexOf(e.studentId) === -1) {
                studentIds.push(e.studentId);
            }
        });
        
        var accessStudentFilter = document.getElementById('accessStudentFilter');
        if (accessStudentFilter) {
            accessStudentFilter.innerHTML = '<option value="">Todos los estudiantes</option>';
            studentIds.forEach(function(id) {
                var student = db.getUserById(id);
                if (student) {
                    accessStudentFilter.innerHTML += '<option value="' + id + '">' + student.nombre + '</option>';
                }
            });
        }
    }

    getMyClasses() {
        var allClasses = db.getClasses();
        var userId = this.session.id || this.session.userId;
        if (this.session.rol === 'admin') {
            return allClasses;
        }
        return allClasses.filter(function(c) {
            return c.teacherId === userId;
        });
    }

    getAllEnrollments() {
        var myClasses = this.getMyClasses();
        var myClassIds = myClasses.map(function(c) { return c.id; });
        var allEnrollments = db.getEnrollments();
        return allEnrollments.filter(function(e) {
            return myClassIds.indexOf(e.classId) !== -1;
        });
    }

    getMyStudents() {
        var enrollments = this.getAllEnrollments();
        var studentIds = [];
        enrollments.forEach(function(e) {
            if (studentIds.indexOf(e.studentId) === -1) {
                studentIds.push(e.studentId);
            }
        });
        return studentIds.map(function(id) {
            return db.getUserById(id);
        }).filter(Boolean);
    }

    loadStats() {
        var classes = this.getMyClasses();
        var enrollments = this.getAllEnrollments();
        
        var totalStudents = enrollments.length;
        var totalProgress = 0;
        var completedCount = 0;
        
        enrollments.forEach(function(enr) {
            totalProgress += enr.progress || 0;
            if (enr.completed) completedCount++;
        });
        
        var avgProgress = totalStudents > 0 ? Math.round(totalProgress / totalStudents) : 0;
        
        document.getElementById('totalClasses').textContent = classes.length;
        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('avgProgress').textContent = avgProgress + '%';
        document.getElementById('completedStudents').textContent = completedCount;
    }

    loadClasses() {
        var classes = this.getMyClasses();
        var grid = document.getElementById('classesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';

        if (classes.length === 0) {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 40px; color: var(--text-secondary);">No hay clases registradas. ¡Crea tu primera clase!</p>';
            return;
        }

        var self = this;
        classes.forEach(function(classItem) {
            grid.appendChild(self.createClassCard(classItem));
        });
    }

    createClassCard(classItem) {
        var enrollments = db.getClassProgress(classItem.id);
        var studentsCount = enrollments.length;
        var avgProgress = utils.calculateAverageProgress(enrollments);
        var completedCount = enrollments.filter(function(e) { return e.completed; }).length;

        var div = document.createElement('div');
        div.className = 'class-card';
        div.style.borderTopColor = classItem.color || '#FFD700';
        
        div.innerHTML = '' +
            '<div class="class-card-header" style="background: linear-gradient(135deg, ' + classItem.color + '22 0%, transparent 100%);">' +
                '<h3>' + classItem.title + '</h3>' +
                '<p>' + utils.truncate(classItem.description, 100) + '</p>' +
            '</div>' +
            '<div class="class-card-body">' +
                '<div class="class-stats">' +
                    '<span>👥 ' + studentsCount + ' alumnos</span>' +
                    '<span>✅ ' + completedCount + ' completados</span>' +
                '</div>' +
                '<div class="class-stats">' +
                    '<span>📊 ' + avgProgress + '% promedio</span>' +
                '</div>' +
                '<div class="progress-bar">' +
                    '<div class="progress-fill" style="width: ' + avgProgress + '%"></div>' +
                '</div>' +
                '<div class="class-actions">' +
                    '<button class="btn btn-secondary" onclick="teacherPanel.viewProgress(\'' + classItem.id + '\')">👁 Progreso</button>' +
                    '<button class="btn btn-secondary" onclick="teacherPanel.editClass(\'' + classItem.id + '\')">✏️ Editar</button>' +
                    '<button class="btn btn-danger" onclick="teacherPanel.deleteClass(\'' + classItem.id + '\')">🗑️ Eliminar</button>' +
                '</div>' +
            '</div>';
        return div;
    }

    loadStudentActivity() {
        var classFilterEl = document.getElementById('activityClassFilter');
        var classFilter = classFilterEl ? classFilterEl.value : '';
        var enrollments = this.getAllEnrollments();
        
        var filteredEnrollments = classFilter 
            ? enrollments.filter(function(e) { return e.classId === classFilter; })
            : enrollments;
        
        var tbody = document.getElementById('activityTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (filteredEnrollments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay actividad registrada</td></tr>';
        } else {
            filteredEnrollments.forEach(function(enr) {
                var student = db.getUserById(enr.studentId);
                var classItem = db.getClassById(enr.classId);
                
                if (!student) return;
                
                var activities = db.getActivitiesByUser(enr.studentId);
                var classAccesses = activities.filter(function(a) {
                    return a.page.indexOf(enr.classId) !== -1 || a.page === 'access_class_' + enr.classId;
                }).length;
                
                var statusBadge = enr.completed 
                    ? '<span class="badge badge-success">✅ Completado</span>'
                    : enr.progress > 0 
                        ? '<span class="badge badge-warning">🔄 En Progreso</span>'
                        : '<span class="badge badge-info">📋 Inscrito</span>';
                
                var tr = document.createElement('tr');
                tr.innerHTML = '' +
                    '<td><strong>' + student.nombre + '</strong></td>' +
                    '<td>' + (classItem ? classItem.title : 'N/A') + '</td>' +
                    '<td>' +
                        '<div class="progress-bar" style="width: 100px; display: inline-block;">' +
                            '<div class="progress-fill" style="width: ' + enr.progress + '%"></div>' +
                        '</div>' +
                        '<span> ' + enr.progress + '%</span>' +
                    '</td>' +
                    '<td>' + utils.formatRelativeTime(enr.lastAccess) + '</td>' +
                    '<td>' + classAccesses + '</td>' +
                    '<td>' + statusBadge + '</td>';
                tbody.appendChild(tr);
            });
        }
        
        this.loadActivityCharts(filteredEnrollments);
    }

    loadActivityCharts(enrollments) {
        for (var key in this.charts) {
            if (this.charts[key]) this.charts[key].destroy();
        }
        this.charts = {};
        
        this.loadAccessChart();
        this.loadProgressDistributionChart(enrollments);
    }

    loadAccessChart() {
        var ctx = document.getElementById('accessChart');
        if (!ctx) return;
        
        var last7Days = this.getLast7DaysAccesses();
        
        this.charts.access = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last7Days.labels,
                datasets: [{
                    label: 'Accesos',
                    data: last7Days.data,
                    backgroundColor: 'rgba(255, 215, 0, 0.6)',
                    borderColor: '#FFD700',
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    loadProgressDistributionChart(enrollments) {
        var ctx = document.getElementById('progressChart');
        if (!ctx) return;
        
        var ranges = {
            '0%': 0,
            '1-25%': 0,
            '26-50%': 0,
            '51-75%': 0,
            '76-99%': 0,
            '100%': 0
        };
        
        enrollments.forEach(function(enr) {
            var p = enr.progress || 0;
            if (p === 0) ranges['0%']++;
            else if (p <= 25) ranges['1-25%']++;
            else if (p <= 50) ranges['26-50%']++;
            else if (p <= 75) ranges['51-75%']++;
            else if (p < 100) ranges['76-99%']++;
            else ranges['100%']++;
        });
        
        this.charts.progress = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(ranges),
                datasets: [{
                    data: Object.values(ranges),
                    backgroundColor: [
                        '#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60', '#1abc9c'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    getLast7DaysAccesses() {
        var myClasses = this.getMyClasses();
        var myClassIds = myClasses.map(function(c) { return c.id; });
        var activities = db.getActivities();
        
        var labels = [];
        var data = [];
        
        for (var i = 6; i >= 0; i--) {
            var date = new Date();
            date.setDate(date.getDate() - i);
            var dateStr = date.toISOString().split('T')[0];
            labels.push(date.toLocaleDateString('es-ES', { weekday: 'short' }));
            
            var count = activities.filter(function(a) {
                var aDate = new Date(a.timestamp).toISOString().split('T')[0];
                var found = false;
                myClassIds.forEach(function(cId) {
                    if (a.page.indexOf(cId) !== -1) found = true;
                });
                return aDate === dateStr && found;
            }).length;
            data.push(count);
        }
        
        return { labels: labels, data: data };
    }

    loadAccessLog() {
        var studentFilterEl = document.getElementById('accessStudentFilter');
        var classFilterEl = document.getElementById('accessClassFilter');
        var studentFilter = studentFilterEl ? studentFilterEl.value : '';
        var classFilter = classFilterEl ? classFilterEl.value : '';
        
        var myClasses = this.getMyClasses();
        var myClassIds = myClasses.map(function(c) { return c.id; });
        
        var activities = db.getActivities()
            .filter(function(a) {
                var found = false;
                myClassIds.forEach(function(cId) {
                    if (a.page.indexOf(cId) !== -1) found = true;
                });
                return found;
            })
            .sort(function(a, b) {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
        
        if (studentFilter) {
            activities = activities.filter(function(a) { return a.userId === studentFilter; });
        }
        if (classFilter) {
            activities = activities.filter(function(a) { return a.page.indexOf(classFilter) !== -1; });
        }
        
        var today = new Date().toISOString().split('T')[0];
        var todayCount = activities.filter(function(a) {
            return a.timestamp.indexOf(today) === 0;
        }).length;
        
        var sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        var activeStudents7Days = [];
        activities.forEach(function(a) {
            var aDate = new Date(a.timestamp);
            if (aDate >= sevenDaysAgo && activeStudents7Days.indexOf(a.userId) === -1) {
                activeStudents7Days.push(a.userId);
            }
        });
        
        var totalSessionTime = activities.reduce(function(sum, a) {
            return sum + (a.sessionTime || 0);
        }, 0);
        var avgSessionTime = activities.length > 0 ? Math.round(totalSessionTime / activities.length) : 0;
        
        document.getElementById('totalAccesses').textContent = activities.length;
        document.getElementById('todayAccesses').textContent = todayCount;
        document.getElementById('activeStudentsCount').textContent = activeStudents7Days.length;
        document.getElementById('avgSessionTime').textContent = avgSessionTime + ' min';
        
        var tbody = document.getElementById('accessTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (activities.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay accesos registrados</td></tr>';
        } else {
            activities.slice(0, 50).forEach(function(activity) {
                var student = db.getUserById(activity.userId);
                var classItem = null;
                myClasses.forEach(function(c) {
                    if (activity.page.indexOf(c.id) !== -1) classItem = c;
                });
                
                var action = 'Acceso';
                if (activity.page.indexOf('enrolled') !== -1) action = '📝 Inscripción';
                else if (activity.page.indexOf('access') !== -1) action = '📚 Accedió a clase';
                else if (activity.page === 'login') action = '🔑 Inicio de sesión';
                
                var tr = document.createElement('tr');
                tr.innerHTML = '' +
                    '<td>' + utils.formatDate(activity.timestamp) + '</td>' +
                    '<td>' + (student ? student.nombre : 'Desconocido') + '</td>' +
                    '<td>' + (classItem ? classItem.title : 'N/A') + '</td>' +
                    '<td>' + action + '</td>' +
                    '<td>' + (activity.sessionTime || 0) + 's</td>';
                tbody.appendChild(tr);
            });
        }
    }

    loadStudentsList() {
        var classFilterEl = document.getElementById('studentClassFilter');
        var searchEl = document.getElementById('studentSearch');
        var classFilter = classFilterEl ? classFilterEl.value : '';
        var searchTerm = searchEl ? searchEl.value.toLowerCase() : '';
        
        var myStudents = this.getMyStudents();
        var enrollments = this.getAllEnrollments();
        
        var filteredStudents = myStudents;
        if (classFilter) {
            var classEnrollments = enrollments.filter(function(e) { return e.classId === classFilter; });
            var studentIds = classEnrollments.map(function(e) { return e.studentId; });
            filteredStudents = myStudents.filter(function(s) {
                return studentIds.indexOf(s.id) !== -1;
            });
        }
        
        if (searchTerm) {
            filteredStudents = filteredStudents.filter(function(s) {
                return s.nombre.toLowerCase().indexOf(searchTerm) !== -1 ||
                       s.email.toLowerCase().indexOf(searchTerm) !== -1;
            });
        }
        
        var totalProgress = 0;
        var activeCount = 0;
        var completedCount = 0;
        
        filteredStudents.forEach(function(student) {
            var studentEnrollments = enrollments.filter(function(e) { return e.studentId === student.id; });
            var avg = utils.calculateAverageProgress(studentEnrollments);
            totalProgress += avg;
            if (studentEnrollments.some(function(e) { return e.completed; })) completedCount++;
            if (studentEnrollments.some(function(e) { return e.progress > 0 && !e.completed; })) activeCount++;
        });
        
        var globalAvg = filteredStudents.length > 0 ? Math.round(totalProgress / filteredStudents.length) : 0;
        
        document.getElementById('totalEnrolledStudents').textContent = filteredStudents.length;
        document.getElementById('activeStudents').textContent = activeCount;
        document.getElementById('completedStudentsCount').textContent = completedCount;
        document.getElementById('globalAvgProgress').textContent = globalAvg + '%';
        
        var tbody = document.getElementById('studentsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (filteredStudents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron estudiantes</td></tr>';
        } else {
            filteredStudents.forEach(function(student) {
                var studentEnrollments = enrollments.filter(function(e) { return e.studentId === student.id; });
                var avgProgress = utils.calculateAverageProgress(studentEnrollments);
                var classesCount = studentEnrollments.length;
                
                var lastAccess = null;
                studentEnrollments.forEach(function(e) {
                    if (!lastAccess || new Date(e.lastAccess) > new Date(lastAccess)) {
                        lastAccess = e.lastAccess;
                    }
                });
                
                var hasCompleted = studentEnrollments.some(function(e) { return e.completed; });
                var hasActive = studentEnrollments.some(function(e) { return e.progress > 0 && !e.completed; });
                
                var statusBadge = hasCompleted 
                    ? '<span class="badge badge-success">✅ Completado</span>'
                    : hasActive 
                        ? '<span class="badge badge-warning">🔄 En Progreso</span>'
                        : '<span class="badge badge-info">📋 Sin actividad</span>';
                
                var tr = document.createElement('tr');
                tr.innerHTML = '' +
                    '<td><strong>' + student.nombre + '</strong></td>' +
                    '<td>' + student.email + '</td>' +
                    '<td>' + classesCount + ' clase(s)</td>' +
                    '<td>' +
                        '<div class="progress-bar" style="width: 80px; display: inline-block;">' +
                            '<div class="progress-fill" style="width: ' + avgProgress + '%"></div>' +
                        '</div>' +
                        '<span> ' + avgProgress + '%</span>' +
                    '</td>' +
                    '<td>' + (lastAccess ? utils.formatRelativeTime(lastAccess) : 'Nunca') + '</td>' +
                    '<td>' + statusBadge + '</td>' +
                    '<td>' +
                        '<button class="action-btn view" onclick="teacherPanel.viewStudentDetail(\'' + student.id + '\')">👁 Ver</button>' +
                    '</td>';
                tbody.appendChild(tr);
            });
        }
    }

    viewStudentDetail(studentId) {
        var student = db.getUserById(studentId);
        if (!student) return;
        
        var enrollments = this.getAllEnrollments().filter(function(e) { return e.studentId === studentId; });
        
        var modalTitle = 'Actividad de: ' + student.nombre;
        if (enrollments.length > 0) {
            var classItem = db.getClassById(enrollments[0].classId);
            document.getElementById('progressClassName').textContent = 
                classItem ? modalTitle + ' - ' + classItem.title : modalTitle;
        } else {
            document.getElementById('progressClassName').textContent = modalTitle;
        }
        
        document.getElementById('modalTotalStudents').textContent = '1';
        document.getElementById('modalAvgProgress').textContent = 
            utils.calculateAverageProgress(enrollments) + '%';
        document.getElementById('modalCompleted').textContent = 
            enrollments.filter(function(e) { return e.completed; }).length;
        
        var tbody = document.getElementById('progressTableBody');
        tbody.innerHTML = '';
        
        enrollments.forEach(function(enr) {
            var classItem = db.getClassById(enr.classId);
            var tr = document.createElement('tr');
            tr.innerHTML = '' +
                '<td>' + (classItem ? classItem.title : 'N/A') + '</td>' +
                '<td>' + student.email + '</td>' +
                '<td>' +
                    '<div class="progress-bar" style="width: 120px; display: inline-block;">' +
                        '<div class="progress-fill" style="width: ' + enr.progress + '%"></div>' +
                    '</div>' +
                    '<span> ' + enr.progress + '%</span>' +
                '</td>' +
                '<td>' + utils.formatRelativeTime(enr.lastAccess) + '</td>' +
                '<td><a href="' + (classItem ? classItem.link : '#') + '?student=' + studentId + '" target="_blank" class="action-btn view">Acceder</a></td>';
            tbody.appendChild(tr);
        });
        
        document.getElementById('progressModal').classList.add('active');
    }

    openClassModal(classId) {
        if (!classId) classId = null;
        var modal = document.getElementById('classModal');
        var form = document.getElementById('classForm');
        if (!modal || !form) return;
        
        form.reset();
        
        if (classId) {
            var classItem = db.getClassById(classId);
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
        if (!utils.confirm('¿Eliminar esta clase y todos sus datos?')) return;
        db.deleteClass(classId);
        utils.showToast('Clase eliminada', 'success');
        this.loadClasses();
        this.loadStats();
    }

    viewProgress(classId) {
        var classItem = db.getClassById(classId);
        if (!classItem) return;

        document.getElementById('progressClassName').textContent = classItem.title;
        var enrollments = db.getClassProgress(classId);
        
        document.getElementById('modalTotalStudents').textContent = enrollments.length;
        document.getElementById('modalAvgProgress').textContent = 
            utils.calculateAverageProgress(enrollments) + '%';
        document.getElementById('modalCompleted').textContent = 
            enrollments.filter(function(e) { return e.completed; }).length;
        
        var tbody = document.getElementById('progressTableBody');
        tbody.innerHTML = '';

        if (enrollments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay alumnos inscritos</td></tr>';
        } else {
            enrollments.forEach(function(enrollment) {
                var student = db.getUserById(enrollment.studentId);
                if (student) {
                    var tr = document.createElement('tr');
                    tr.innerHTML = '' +
                        '<td>' + student.nombre + '</td>' +
                        '<td>' + student.email + '</td>' +
                        '<td>' +
                            '<div class="progress-bar" style="width: 120px; display: inline-block;">' +
                                '<div class="progress-fill" style="width: ' + enrollment.progress + '%"></div>' +
                            '</div>' +
                            '<span> ' + enrollment.progress + '%</span>' +
                        '</td>' +
                        '<td>' + utils.formatRelativeTime(enrollment.lastAccess) + '</td>' +
                        '<td><a href="' + classItem.link + '?student=' + student.id + '" target="_blank" class="action-btn view">Acceder</a></td>';
                    tbody.appendChild(tr);
                }
            });
        }
        document.getElementById('progressModal').classList.add('active');
    }

    closeProgressModal() { 
        var modal = document.getElementById('progressModal');
        if (modal) modal.classList.remove('active'); 
    }
    
    closeModal() { 
        var modal = document.getElementById('classModal');
        if (modal) modal.classList.remove('active'); 
    }

    saveClass() {
        var classId = document.getElementById('classId').value;
        var userId = this.session.id || this.session.userId;
        var classData = {
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
            this.loadStats();
            this.populateFilters();
        } catch (error) {
            utils.showToast('Error al guardar', 'error');
        }
    }

    setupEventListeners() {
        var self = this;
        var classForm = document.getElementById('classForm');
        if (classForm) {
            classForm.addEventListener('submit', function(e) {
                e.preventDefault();
                self.saveClass();
            });
        }

        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }
}

// Inicialización SEGURA
if (window.location.pathname.indexOf('teacher.html') !== -1 || 
    window.location.pathname.indexOf('admin.html') !== -1) {
    window.addEventListener('load', function() {
        if (!window.teacherPanel) {
            window.teacherPanel = new TeacherPanel();
        }
    });
}
