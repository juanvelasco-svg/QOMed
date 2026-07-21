document.addEventListener('DOMContentLoaded', () => {
    // Renderizar Conceptos
    const conceptsGrid = document.getElementById('concepts-grid');
    conceptsGrid.innerHTML = classConfig.concepts.map(c => `
        <div class="concept-card">
            <div class="concept-header">${c.title}</div>
            <div class="concept-content">${c.content}</div>
        </div>
    `).join('');

    // Renderizar Ejercicios
    const exercisesContainer = document.getElementById('exercises-container');
    exercisesContainer.innerHTML = classConfig.exercises.map((ex, i) => `
        <div class="exercise-card">
            <div class="exercise-header">Ejercicio ${i + 1}</div>
            <div class="exercise-content">
                <p style="margin-bottom:1rem; font-weight:500;">${ex.problem}</p>
                <button class="btn-show-answer" onclick="toggleAnswer(this)">Mostrar Respuesta</button>
                <div class="answer"><p>${ex.solution}</p></div>
            </div>
        </div>
    `).join('');

    // Renderizar Quiz
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <div class="quiz-header">Pon a prueba tus conocimientos</div>
        <div class="quiz-content">
            ${classConfig.quiz.map((q, i) => `
                <div style="margin-bottom:1.5rem; padding-bottom:1.5rem; border-bottom:1px solid #eee;">
                    <h4 style="margin-bottom:0.8rem;">${i + 1}. ${q.question}</h4>
                    <div class="quiz-options">
                        ${q.options.map((opt, j) => `
                            <div class="quiz-option" onclick="checkAnswer(${i}, ${j}, this)">${opt}</div>
                        `).join('')}
                    </div>
                    <div class="quiz-feedback" id="feedback-${i}"></div>
                </div>
            `).join('')}
        </div>
    `;
});

function switchTab(tabId, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function calculateHybridization() {
    const bonds = parseInt(document.getElementById('bonds').value) || 0;
    const lonePairs = parseInt(document.getElementById('lone-pairs').value) || 0;
    const total = bonds + lonePairs;
    
    let hib = '-', geo = '-', rot = '-';
    if (total === 4) { hib = 'sp³'; geo = 'Tetraédrica (109.5°)'; rot = 'Libre'; }
    else if (total === 3) { hib = 'sp²'; geo = 'Trigonal plana (120°)'; rot = 'No (por enlace π)'; }
    else if (total === 2) { hib = 'sp'; geo = 'Lineal (180°)'; rot = 'No (por enlaces π)'; }
    else { hib = 'No estándar'; geo = 'Variable'; rot = 'Variable'; }

    document.getElementById('res-hib').textContent = hib;
    document.getElementById('res-geo').textContent = geo;
    document.getElementById('res-rot').textContent = rot;
    document.getElementById('hybrid-result').style.display = 'block';
    
    if (typeof incrementProgress === 'function') incrementProgress(5);
}

function toggleAnswer(btn) {
    const answerDiv = btn.nextElementSibling;
    answerDiv.classList.toggle('show');
    btn.textContent = answerDiv.classList.contains('show') ? 'Ocultar Respuesta' : 'Mostrar Respuesta';
    if (typeof incrementProgress === 'function') incrementProgress(5);
}

function checkAnswer(qIndex, optIndex, element) {
    const q = classConfig.quiz[qIndex];
    const feedback = document.getElementById(`feedback-${qIndex}`);
    const options = element.parentElement.querySelectorAll('.quiz-option');
    
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (optIndex === q.correct) {
        element.classList.add('correct');
        feedback.className = 'quiz-feedback correct';
        feedback.innerHTML = `<strong>¡Correcto!</strong> ${q.explanation}`;
    } else {
        element.classList.add('incorrect');
        options[q.correct].classList.add('correct');
        feedback.className = 'quiz-feedback incorrect';
        feedback.innerHTML = `<strong>Incorrecto.</strong> ${q.explanation}`;
    }
    if (typeof incrementProgress === 'function') incrementProgress(10);
}
