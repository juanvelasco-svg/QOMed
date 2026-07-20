document.addEventListener('DOMContentLoaded', () => {
    renderModules();
    renderConcepts();
    renderExercises();
    renderQuiz();
    renderMnemonics();
    initInteractiveComponents();
    initScrollAnimations();
});

function renderModules() {
    const container = document.getElementById('modules-container');
    container.innerHTML = classConfig.modules.map((m, index) => `
        <button class="module-card" onclick="scrollToSection('${m.target}')" data-action="module-click">
            <span class="module-icon">${m.icon}</span>
            <h3>${m.title}</h3>
            <p class="module-desc">${m.desc}</p>
        </button>
    `).join('');
}

// FUNCIÓN CLAVE: Hace que los emojis del inicio ahora sean interactivos
function scrollToSection(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (typeof incrementProgress === 'function') incrementProgress(5);
    }
}

function renderConcepts() {
    const container = document.getElementById('concepts-grid');
    container.innerHTML = classConfig.concepts.map(c => `
        <div class="concept-card fade-in-up">
            <div class="concept-header">${c.title}</div>
            <div class="concept-content">${c.content}</div>
        </div>
    `).join('');
}

function renderExercises() {
    const container = document.getElementById('exercises-container');
    container.innerHTML = classConfig.exercises.map((ex, i) => `
        <div class="exercise-card fade-in-up">
            <div class="exercise-header">Ejercicio ${i + 1}</div>
            <div class="exercise-content">
                <div class="exercise-problem">${ex.problem}</div>
                <button class="btn-show-answer" onclick="toggleAnswer(this)">Mostrar Respuesta Paso a Paso</button>
                <div class="answer"><p>${ex.solution}</p></div>
            </div>
        </div>
    `).join('');
}

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="quiz-header">Pon a prueba tus conocimientos</div>
        <div class="quiz-content" id="quiz-questions-container">
            ${classConfig.quiz.map((q, i) => `
                <div class="quiz-question" data-index="${i}">
                    <h3>${i + 1}. ${q.question}</h3>
                    <div class="quiz-options">
                        ${q.options.map((opt, j) => `
                            <div class="quiz-option" onclick="checkAnswer(${i}, ${j}, this)">${opt}</div>
                        `).join('')}
                    </div>
                    <div class="quiz-feedback"></div>
                </div>
            `).join('')}
            <button class="btn-restart-quiz" onclick="restartQuiz()">Reiniciar Quiz</button>
        </div>
    `;
}

function renderMnemonics() {
    const container = document.getElementById('mnemonics-grid');
    container.innerHTML = classConfig.mnemonics.map(m => `
        <div class="mnemonic-card fade-in-up">
            <h3>💡 ${m.title}</h3>
            <p>${m.content}</p>
        </div>
    `).join('');
}

function initInteractiveComponents() {
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-pane`).classList.add('active');
        });
    });

    // Calculadora de Hibridación
    document.getElementById('calculate-hybridization').addEventListener('click', () => {
        const bonds = parseInt(document.getElementById('bonds').value) || 0;
        const lonePairs = parseInt(document.getElementById('lone-pairs').value) || 0;
        const total = bonds + lonePairs;
        
        let hib = '-', geo = '-', rot = '-', pOrb = '-';
        if (total === 4) { hib = 'sp³'; geo = 'Tetraédrica (109.5°)'; rot = 'Libre'; pOrb = '0'; }
        else if (total === 3) { hib = 'sp²'; geo = 'Trigonal plana (120°)'; rot = 'No (bloqueada por enlace π)'; pOrb = '1'; }
        else if (total === 2) { hib = 'sp'; geo = 'Lineal (180°)'; rot = 'No (bloqueada por enlaces π)'; pOrb = '2'; }
        else { hib = 'No estándar'; geo = 'Variable'; rot = 'Variable'; pOrb = 'N/A'; }

        document.getElementById('hybridization-value').textContent = hib;
        document.getElementById('geometry-value').textContent = geo;
        document.getElementById('rotation-value').textContent = rot;
        document.getElementById('p-orbitals-value').textContent = pOrb;
        document.getElementById('hybridization-result').style.display = 'block';
        
        if (typeof incrementProgress === 'function') incrementProgress(5);
    });
}

// Funciones globales para los onclick del HTML
function toggleAnswer(btn) {
    const answerDiv = btn.nextElementSibling;
    answerDiv.classList.toggle('show');
    btn.textContent = answerDiv.classList.contains('show') ? 'Ocultar Respuesta' : 'Mostrar Respuesta Paso a Paso';
    if (typeof incrementProgress === 'function') incrementProgress(5);
}

function checkAnswer(qIndex, optIndex, element) {
    const questionData = classConfig.quiz[qIndex];
    const questionDiv = element.closest('.quiz-question');
    const feedbackDiv = questionDiv.querySelector('.quiz-feedback');
    const options = questionDiv.querySelectorAll('.quiz-option');

    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        if (opt === element) opt.classList.add(optIndex === questionData.correct ? 'correct' : 'incorrect');
        if (Array.from(options).indexOf(opt) === questionData.correct) opt.classList.add('correct');
    });

    if (optIndex === questionData.correct) {
        feedbackDiv.className = 'quiz-feedback correct';
        feedbackDiv.innerHTML = `<strong>¡Correcto!</strong> ${questionData.explanation}`;
    } else {
        feedbackDiv.className = 'quiz-feedback incorrect';
        feedbackDiv.innerHTML = `<strong>Incorrecto.</strong> ${questionData.explanation}`;
    }
    if (typeof incrementProgress === 'function') incrementProgress(10);
}

function restartQuiz() {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
        opt.style.pointerEvents = 'auto';
    });
    document.querySelectorAll('.quiz-feedback').forEach(fb => {
        fb.className = 'quiz-feedback';
        fb.innerHTML = '';
    });
}

// Animación al hacer scroll (Efecto "Wow")
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}
