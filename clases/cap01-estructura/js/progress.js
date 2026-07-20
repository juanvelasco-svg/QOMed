let currentProgress = 0;
let studentId = '';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    studentId = urlParams.get('student_id');

    if (!studentId) {
        document.body.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column; text-align:center; padding:2rem;">
                <h1 style="color:#C00000; margin-bottom:1rem;">⚠️ Acceso Restringido</h1>
                <p style="font-size:1.2rem; margin-bottom:2rem;">Por favor, accede a esta clase desde la <a href="../../index.html" style="color:#003366; font-weight:bold;">plataforma central del curso</a>.</p>
                <a href="../../index.html" class="btn-back">⬅ Volver al Inicio</a>
            </div>
        `;
        return;
    }

    // Mostrar nombre del estudiante
    document.getElementById('student-name').textContent = `Estudiante: ${studentId}`;

    // Cargar progreso
    const savedProgress = localStorage.getItem(`qomed_cap01_${studentId}`);
    currentProgress = savedProgress ? parseInt(savedProgress) : 0;
    updateProgressBar();

    // Botón completar
    document.getElementById('btn-complete').addEventListener('click', () => {
        currentProgress = 100;
        saveProgress();
        updateProgressBar();
        alert('¡Felicidades! Has marcado la clase como completada. Tu progreso ha sido guardado.');
        
        // Reporte para la página maestra (opcional, usa postMessage si está en iframe)
        window.parent.postMessage({ type: 'PROGRESS_UPDATE', studentId, progress: 100, classId: 'cap01' }, '*');
    });
});

function incrementProgress(amount) {
    currentProgress = Math.min(currentProgress + amount, 100);
    saveProgress();
    updateProgressBar();
}

function saveProgress() {
    localStorage.setItem(`qomed_cap01_${studentId}`, currentProgress);
}

function updateProgressBar() {
    const bar = document.getElementById('progress-bar');
    const text = document.querySelector('.progress-text');
    if (bar && text) {
        bar.style.width = `${currentProgress}%`;
        text.textContent = `${currentProgress}% completado`;
    }
}