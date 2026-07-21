const classConfig = {
    modules: [
        { icon: "🗺️", title: "Conceptos", target: "concepts-section", desc: "Teoría fundamental" },
        { icon: "🧪", title: "Laboratorio", target: "tools-section", desc: "Herramientas interactivas" },
        { icon: "✏️", title: "Ejercicios", target: "exercises-section", desc: "Práctica guiada" },
        { icon: "🎯", title: "Quiz", target: "quiz-section", desc: "Evalúa tu conocimiento" }
    ],
    
    concepts: [
        {
            title: "La Paradoja de la Valencia del Carbono",
            content: `<p>De acuerdo a su distribución electrónica basal, el carbono debiera presentar <strong>valencia 2</strong>. Sin embargo, en la casi totalidad de sus compuestos (CH₄, CCl₄, etc.) presenta <strong>valencia 4</strong>.</p>
            <p style="margin-top:10px;"><strong>¿Cómo se resuelve?</strong> Mediante el proceso de <span class="highlight">excitación</span>: un electrón del orbital 2s salta a un orbital 2p vacío, generando 4 electrones desapareados listos para formar enlaces.</p>`
        },
        {
            title: "Resumen de Hibridación del Carbono",
            content: `
                <table class="data-table">
                    <tr><th>Hibridación</th><th>Geometría</th><th>Rotación</th><th>Enlazado a</th><th>Orbitales p libres</th></tr>
                    <tr><td><strong>sp³</strong></td><td>Tetraédrica (109.5°)</td><td>Libre</td><td>4 átomos</td><td>Ninguno</td></tr>
                    <tr><td><strong>sp²</strong></td><td>Trigonal plana (120°)</td><td>No</td><td>3 átomos</td><td>1 (forma enlace π)</td></tr>
                    <tr><td><strong>sp</strong></td><td>Lineal (180°)</td><td>No</td><td>2 átomos</td><td>2 (forman 2 enlaces π)</td></tr>
                </table>
                <p style="margin-top:10px; font-size:0.9rem;"><em>Nota: La hibridación justifica la geometría, así como la igualdad de las longitudes y fortalezas de enlace.</em></p>`
        },
        {
            title: "Fortaleza y Longitud de Enlace",
            content: `
                <ul class="rule-list">
                    <li><strong>Fortaleza:</strong> Enlace sigma (σ) > Enlace pi (π)</li>
                    <li><strong>Por tipo de enlace:</strong> Triple > Doble > Simple</li>
                    <li><strong>Longitud de enlace:</strong> Simple > Doble > Triple</li>
                </ul>
                <p style="margin-top:10px;"><strong>Conclusión:</strong> A menor longitud de enlace, mayor es la fortaleza del mismo.</p>`
        },
        {
            title: "Heteroátomos en Química Orgánica",
            content: `<p>Cualquier átomo diferente a Carbono e Hidrógeno (O, N, Halógenos, S, etc.) que forme parte de una estructura orgánica.</p>
            <p style="margin-top:10px;">Usualmente aportan <strong>pares libres de electrones</strong>. En la mayoría de los casos, poseen la misma hibridación que el carbono al que están unidos. Determinar su hibridación nos indica qué tipo de orbitales contienen a sus pares libres.</p>`
        }
    ],
    
    exercises: [
        {
            problem: "El carbono basal tiene configuración 1s² 2s² 2p². ¿Por qué forma 4 enlaces en el metano (CH₄) en lugar de 2?",
            solution: "Debido al proceso de <strong>excitación</strong>. Un electrón del orbital 2s se promueve al orbital 2p vacío, quedando con 4 electrones desapareados. Luego, estos orbitales se <strong>hibridan (sp³)</strong> para formar 4 enlaces sigma idénticos en longitud y fortaleza, justificando la geometría tetraédrica."
        },
        {
            problem: "Ordena de mayor a menor longitud de enlace: C-C (simple), C=C (doble), C≡C (triple).",
            solution: "El orden de <strong>mayor a menor longitud</strong> es: C-C (simple, ~154 pm) > C=C (doble, ~134 pm) > C≡C (triple, ~120 pm). A mayor número de enlaces compartidos, mayor es la atracción entre los núcleos, acortando la distancia."
        },
        {
            problem: "¿Qué información nos aporta determinar la hibridación de un heteroátomo (como el N en una amina)?",
            solution: "Nos indica <strong>qué tipo de orbitales contienen a sus pares libres de electrones</strong>. Por lo general, el heteroátomo adopta la misma hibridación que el carbono al que está unido, lo que es crucial para entender su reactividad y geometría."
        }
    ],
    
    quiz: [
        {
            question: "¿Qué proceso resuelve la aparente contradicción de que el carbono tenga valencia 4 en lugar de 2?",
            options: ["La ionización", "La excitación de un electrón del orbital 2s al 2p", "La formación de enlaces iónicos", "La pérdida de un electrón"],
            correct: 1,
            explanation: "La excitación promueve un electrón del 2s al 2p vacío, generando 4 electrones desapareados disponibles para formar 4 enlaces covalentes."
        },
        {
            question: "Según el resumen de hibridación, un carbono con hibridación sp² está enlazado a:",
            options: ["4 átomos, sin orbitales p libres", "3 átomos, con 1 orbital p libre", "2 átomos, con 2 orbitales p libres", "1 átomo, con 3 orbitales p libres"],
            correct: 1,
            explanation: "La hibridación sp² deja 1 orbital p sin hibridar (que forma el enlace π) y se enlaza a 3 átomos con geometría trigonal plana."
        },
        {
            question: "¿Cuál es la relación correcta entre longitud y fortaleza de enlace?",
            options: ["A mayor longitud, mayor fortaleza", "A menor longitud, mayor fortaleza", "No existe relación entre ambas", "La longitud solo depende del heteroátomo"],
            correct: 1,
            explanation: "El PDF establece claramente: a menor longitud de enlace (ej. triple), mayor es la fortaleza (energía de enlace) del mismo."
        },
        {
            question: "Los heteroátomos en una estructura orgánica son importantes porque:",
            options: ["Siempre forman enlaces iónicos", "Aportan pares libres de electrones y su hibridación indica el orbital que los contiene", "Nunca se hibridan", "Solo pueden ser oxígeno"],
            correct: 1,
            explanation: "Los heteroátomos (O, N, S, etc.) usualmente aportan pares libres y su hibridación nos dice en qué tipo de orbital se encuentran esos electrones."
        }
    ],
    
    mnemonics: [
        {
            title: "La Regla del Número",
            content: "El número en la hibridación + los orbitales p libres = 3.<br>• <strong>sp³</strong> → 0 p libres (4 enlaces, Tetraedro).<br>• <strong>sp²</strong> → 1 p libre (3 enlaces, Plano).<br>• <strong>sp</strong> → 2 p libres (2 enlaces, Lineal)."
        },
        {
            title: "El Resorte de los Enlaces",
            content: "Imagina un resorte: <br>🔗 <strong>Más corto</strong> (Triple) = <strong>Más fuerte</strong> y rígido (sin rotación).<br>🔗 <strong>Más largo</strong> (Simple) = <strong>Más débil</strong> y flexible (rotación libre)."
        },
        {
            title: "Sigma (σ) vs Pi (π)",
            content: "<strong>σ (Sigma)</strong>: Es el 'Súper' enlace, siempre está primero, es más fuerte y permite rotación.<br><strong>π (Pi)</strong>: Es el 'Plus', viene después (en dobles/triples), es más débil y <em>bloquea</em> la rotación."
        }
    ]
};
