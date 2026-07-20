class AdminPanel {
    constructor() {
        this.session = getCurrentSession();
        if (!this.session || this.session.rol !== 'admin') {
            window.location.href = 'index.html';
            return;
        }
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadDashboard();
        this.setupEventListeners();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.showSection(section);
                
                navItems.forEach(ni => ni.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    showSection(sectionName) {
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(`${sectionName}Section`);
        if (section) {
            section.classList.add('active');
            if (sectionName === 'professors') this.loadUsers('profesor');
            if (sectionName === 'students') this.loadUsers('alumno');
            if (sectionName === 'activity') this.loadActivity();
        }
    }

    loadDashboard() {
        const stats = db.getStats();
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('activeUsers').textContent = stats.activeUsers;
        document.getElementById('totalProfessors').textContent = stats.totalProfessors;
        document.getElementById('totalStudents').textContent = stats.totalStudents;
        this.loadCharts(stats);
    }

    loadCharts(stats) {
        if (typeof Chart === 'undefined') return;

        const usersCtx = document.getElementById('usersChart');
        if (usersCtx) {
            new Chart(usersCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Admin', 'Profesores', 'Alumnos'],
                    datasets: [{
                        data: [stats.totalAdmins, stats.totalProfessors, stats.totalStudents],
                        backgroundColor: ['#f39c12', '#3498db', '#27ae60']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: true }
            });
        }

        const activityCtx = document.getElementById('activityChart');
        if (activityCtx) {
            const last7Days = this.getLast7DaysData();
            new Chart(activityCtx, {
                type: 'line',
                data: {
                    labels: last7Days.labels,
                    datasets: [{
                        label: 'Accesos',
                        data: last7Days.data,
                        borderColor: '#FFD700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: true }
            });
        }
    }

    getLast7DaysData() {
        const activities = db.getActivities();
        const labels = [];
        const data = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            labels.push(date.toLocaleDateString('es-ES', { weekday: 'short' }));

            const count = activities.filter(a => {
                return new Date(a.timestamp).toISOString().split('T')[0] === dateStr;
            }).length;
            data.push(count);
        }
        return { labels, data };
    }

    loadUsers(role) {
        const users = db.getUsers().filter(u => u.rol === role);
        const tbodyId = role === 'profesor' ? 'professorsTableBody' : 'studentsTableBody';
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            let extraInfo = '';
            
            if (role === 'profesor') {
                const classesCount = db.getClasses().filter(c => c.teacherId === user.id).length;
                extraInfo = `${classesCount} clases`;
            } else {
                const progress = db.getStudentProgress(user.id);
                const avg = utils.calculateAverageProgress(progress);
                extraInfo = `<div class="progress-bar" style="width: 80px; display: inline-block; vertical-align: middle;"><div class="progress-fill" style="width: ${avg}%"></div></div> <span>${avg}%</span>`;
            }

            tr.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td>${extraInfo}</td>
                <td>${user.ultimoAcceso ? utils.formatRelativeTime(user.ultimoAcceso) : 'Nunca'}</td>
                <td class="actions">
                    <button class="action-btn edit" onclick="adminPanel.editUser('${user.id}')">Editar</button>
                    <button class="action-btn delete" onclick="adminPanel.deleteUser('${user.id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    loadActivity() {
        const activities = db.getActivities().slice(-50).reverse();
        const tbody = document.getElementById('activityTableBody');
        const userFilter = document.getElementById('activityUserFilter');
        
        tbody.innerHTML = '';
        userFilter.innerHTML = '<option value="">Todos los usuarios</option>';

        const users = db.getUsers();
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.nombre} (${user.rol})`;
            userFilter.appendChild(option);
        });

        activities.forEach(activity => {
            const user = users.find(u => u.id === activity.userId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${utils.formatDate(activity.timestamp)}</td>
                <td>${user ? user.nombre : 'Desconocido'}</td>
                <td>${activity.page}</td>
                <td>${activity.sessionTime}s</td>
                <td>${activity.ip || 'N/A'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    filterActivity() {
        const dateFrom = document.getElementById('activityDateFrom').value;
        const dateTo = document.getElementById('activityDateTo').value;
        const userId = document.getElementById('activityUserFilter').value;

        let activities = db.getActivities();
        if (dateFrom) activities = activities.filter(a => new Date(a.timestamp) >= new Date(dateFrom));
        if (dateTo) activities = activities.filter(a => new Date(a.timestamp) <= new Date(dateTo + ' 23:59:59'));
        if (userId) activities = activities.filter(a => a.userId === userId);

        const tbody = document.getElementById('activityTableBody');
        tbody.innerHTML = '';
        const users = db.getUsers();

        activities.slice(-50).reverse().forEach(activity => {
            const user = users.find(u => u.id === activity.userId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${utils.formatDate(activity.timestamp)}</td>
                <td>${user ? user.nombre : 'Desconocido'}</td>
                <td>${activity.page}</td>
                <td>${activity.sessionTime}s</td>
                <td>${activity.ip || 'N/A'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    openUserModal(role = 'alumno') {
        const modal = document.getElementById('userModal');
        const form = document.getElementById('userForm');
        form.reset();
        document.getElementById('userId').value = '';
        document.getElementById('modalRole').value = role;
        document.getElementById('modalTitle').textContent = `Agregar ${role === 'profesor' ? 'Profesor' : 'Alumno'}`;
        modal.classList.add('active');
    }

    editUser(userId) {
        const user = db.getUserById(userId);
        if (!user) return;

        document.getElementById('userId').value = user.id;
        document.getElementById('modalName').value = user.nombre;
        document.getElementById('modalEmail').value = user.email;
        document.getElementById('modalRole').value = user.rol;
        document.getElementById('modalPassword').value = '';
        document.getElementById('modalTitle').textContent = 'Editar Usuario';
        document.getElementById('userModal').classList.add('active');
    }

    deleteUser(userId) {
        if (!utils.confirm('¿Estás seguro de eliminar este usuario?')) return;
        db.deleteUser(userId);
        utils.showToast('Usuario eliminado', 'success');
        // Recargar vista actual
        const activeSection = document.querySelector('.content-section.active').id.replace('Section', '');
        if (activeSection === 'professors') this.loadUsers('profesor');
        if (activeSection === 'students') this.loadUsers('alumno');
    }

    closeModal() {
        document.getElementById('userModal').classList.remove('active');
    }

    saveUser() {
        const userId = document.getElementById('userId').value;
        const nombre = document.getElementById('modalName').value;
        const email = document.getElementById('modalEmail').value;
        const rol = document.getElementById('modalRole').value;
        const password = document.getElementById('modalPassword').value;

        if (!utils.isValidEmail(email)) {
            utils.showToast('Email inválido', 'error');
            return;
        }

        try {
            if (userId) {
                const updateData = { nombre, email, rol };
                if (password) updateData.password = password;
                db.updateUser(userId, updateData);
                utils.showToast('Usuario actualizado', 'success');
            } else {
                if (!password) {
                    utils.showToast('La contraseña es requerida', 'error');
                    return;
                }
                db.createUser({ nombre, email, password, rol });
                utils.showToast('Usuario creado', 'success');
            }
            this.closeModal();
            const activeSection = document.querySelector('.content-section.active').id.replace('Section', '');
            if (activeSection === 'professors') this.loadUsers('profesor');
            if (activeSection === 'students') this.loadUsers('alumno');
        } catch (error) {
            utils.showToast(error.message, 'error');
        }
    }

    clearOldData() {
        if (!utils.confirm('¿Limpiar datos de actividad mayores a 6 meses?')) return;
        db.cleanOldData();
        utils.showToast('Datos limpiados', 'success');
        this.loadActivity();
    }

    cleanDatabase() {
        if (!utils.confirm('¿Ejecutar limpieza completa de la base de datos?')) return;
        db.cleanOldData();
        utils.showToast('Limpieza completada', 'success');
    }

    exportData() {
        const data = db.exportData();
        utils.downloadJSON(data, `backup_${new Date().toISOString().split('T')[0]}.json`);
        utils.showToast('Datos exportados', 'success');
    }

    setupEventListeners() {
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUser();
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }
}

// Inicializar panel
const adminPanel = new AdminPanel();