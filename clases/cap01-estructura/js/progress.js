let currentProgress = 0;
let studentId = 'INVITADO';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlStudentId = urlParams.get('student_id');

    if (urlStudentId) {
        studentId = urlStudentId;
    }

    const studentNameEl = document.getElementById('student-name');
    if (studentNameEl) {
        studentNameEl.textContent = `Estudiante: ${studentId}`;
    }

    const savedProgress = localStorage.getItem(`qomed_cap01_${studentId}`);
    currentProgress = savedProgress ? parseInt(savedProgress) : 0;
    updateProgressBar();

    const btnComplete = document.getElementById('btn-complete');
    if (btnComplete) {
        btnComplete.addEventListener('click', () => {
            currentProgress = 100;
            saveProgress();
            updateProgressBar();
            alert('¡Felicidades! Has completado el Capítulo 01. Tu progreso ha sido guardado exitosamente.');
        });
    }
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
    const text = document.getElementById('progress-text');
    if (bar && text) {
        bar.style.width = `${currentProgress}%`;
        text.textContent = `${currentProgress}% completado`;
    }
}
