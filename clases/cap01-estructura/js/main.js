document.addEventListener('DOMContentLoaded', () => {
    renderModules();
    renderConcepts();
    renderExercises();
    renderQuiz();
    renderMnemonics();
    initInteractiveComponents();
});

function renderModules() {
    const container = document.getElementById('modules-container');
    container.innerHTML = classConfig.modules.map(m => `
        <div class="module-card">
            <span class="module-icon">${m.icon}</span>
            <h3>${m.title}</h3>
        </div>
    `).join('');
}

function renderConcepts() {
    const container = document.getElementById('concepts-section');
    container.innerHTML = `<h2>Conceptos Fundamentales</h2>
        <div class="concepts-grid">
            ${classConfig.concepts.map(c => `
                <div class="concept-card">
                    <div class="concept-header">${c.title}</div>
                    <div class="concept-content">${c.content}</div>
                </div>
            `).join('')}
        </div>`;
}

function renderExercises() {
    const container = document.getElementById('exercises-section');
    container.innerHTML = `<h2>Ejercicios Interactivos</h2>
        ${classConfig.exercises.map((ex, i) => `
            <div class="exercise-card">
                <div class="exercise-header">Ejercicio ${i + 1}</div>
                <div class="exercise-content">
                    <div class="exercise-problem">${ex.problem}</div>
                    <button class="btn-show-answer" onclick="toggleAnswer(this)">Mostrar Respuesta</button>
                    <div class="answer"><p>${ex.solution}</p></div>
                </div>
            </div>
        `).join('')}`;
}

function renderQuiz() {
    const container = document.getElementById('quiz-section');
    container.innerHTML = `<h2>Quiz de Autoevaluación</h2>
        <div class="quiz-card">
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
        </div>`;
}

function renderMnemonics() {
    const container = document.getElementById('mnemonics-section');
    container.innerHTML = classConfig.mnemonics.map(m => `
        <div class="mnemonic-card">
            <h3>🧠 ${m.title}</h3>
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
        
        let hib = '-', geo = '-', rot = '-';
        if (total === 4) { hib = 'sp³'; geo = 'Tetraédrica'; rot = 'Libre'; }
        else if (total === 3) { hib = 'sp²'; geo = 'Trigonal plana'; rot = 'No (por enlace π)'; }
        else if (total === 2) { hib = 'sp'; geo = 'Lineal'; rot = 'No (por enlaces π)'; }
        else { hib = 'No estándar'; geo = 'Variable'; rot = 'Variable'; }

        document.getElementById('hybridization-value').textContent = hib;
        document.getElementById('geometry-value').textContent = geo;
        document.getElementById('rotation-value').textContent = rot;
        
        // Incrementar progreso por usar herramienta
        if(typeof incrementProgress === 'function') incrementProgress(5);
    });
}

// Funciones globales para onclick en HTML
function toggleAnswer(btn) {
    const answerDiv = btn.nextElementSibling;
    answerDiv.classList.toggle('show');
    btn.textContent = answerDiv.classList.contains('show') ? 'Ocultar Respuesta' : 'Mostrar Respuesta';
    if(typeof incrementProgress === 'function') incrementProgress(5);
}

function checkAnswer(qIndex, optIndex, element) {
    const questionData = classConfig.quiz[qIndex];
    const questionDiv = element.closest('.quiz-question');
    const feedbackDiv = questionDiv.querySelector('.quiz-feedback');
    const options = questionDiv.querySelectorAll('.quiz-option');

    // Deshabilitar más clics en esta pregunta
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        if (opt === element) {
            opt.classList.add(optIndex === questionData.correct ? 'correct' : 'incorrect');
        }
        if (Array.from(options).indexOf(opt) === questionData.correct) {
            opt.classList.add('correct'); // Mostrar siempre la correcta
        }
    });

    if (optIndex === questionData.correct) {
        feedbackDiv.className = 'quiz-feedback correct';
        feedbackDiv.innerHTML = `<strong>¡Correcto!</strong> ${questionData.explanation}`;
    } else {
        feedbackDiv.className = 'quiz-feedback incorrect';
        feedbackDiv.innerHTML = `<strong>Incorrecto.</strong> ${questionData.explanation}`;
    }

    if(typeof incrementProgress === 'function') incrementProgress(10);
}

function restartQuiz() {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected');
        opt.style.pointerEvents = 'auto';
    });
    document.querySelectorAll('.quiz-feedback').forEach(fb => {
        fb.className = 'quiz-feedback';
        fb.innerHTML = '';
    });
}