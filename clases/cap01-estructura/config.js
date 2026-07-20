/**
 * CONFIGURACIÓN DE LA CLASE - CAPÍTULO 01
 * Basado en: "Estructura Molecular y Propiedades" (UFBI Química Orgánica)
 * 
 * INSTRUCCIONES PARA EL PROFESOR:
 * Solo necesitas editar el texto dentro de este archivo para actualizar 
 * el contenido de la clase. No toques los archivos main.js, progress.js o quiz.js.
 */

const classConfig = {
    title: "Estructura Molecular y Propiedades",
    description: "Domina la estructura atómica, los tipos de hibridación y la relación entre la longitud y fortaleza de los enlaces covalentes.",
    
    // Módulos visuales en la sección Hero
    modules: [
        { icon: "🗺️", title: "Mapa Conceptual" },
        { icon: "🧮", title: "Herramientas Interactivas" },
        { icon: "✏️", title: "Ejercicios" },
        { icon: "🎯", title: "Quiz" }
    ],
    
    // Conceptos fundamentales (Extraídos del PDF)
    concepts: [
        {
            title: "Valencia y Excitación del Carbono",
            content: `
                <p>De acuerdo a su distribución electrónica basal, el carbono debiera presentar valencia 2. Sin embargo, en la casi totalidad de sus compuestos presenta <strong>valencia 4</strong> (ej. CH₄, CCl₄).</p>
                <p style="margin-top: 10px;">¿Cómo se resuelve esta contradicción? Mediante el proceso de <strong>excitación</strong> de un electrón del orbital 2s al orbital 2p vacío, permitiendo la formación de 4 enlaces covalentes.</p>
            `
        },
        {
            title: "Resumen de Hibridación del Carbono",
            content: `
                <table>
                    <tr><th>Hibridación</th><th>Geometría</th><th>Rotación</th><th>Enlazado a</th><th>Orbitales p libres</th></tr>
                    <tr><td><strong>sp³</strong></td><td>Tetraédrica</td><td>Libre</td><td>4 átomos</td><td>Ninguno</td></tr>
                    <tr><td><strong>sp²</strong></td><td>Trigonal plana</td><td>No</td><td>3 átomos</td><td>1</td></tr>
                    <tr><td><strong>sp</strong></td><td>Lineal</td><td>No</td><td>2 átomos</td><td>2</td></tr>
                </table>
            `
        },
        {
            title: "Fortaleza y Longitud de Enlace",
            content: `
                <ul style="line-height: 1.8;">
                    <li><strong>Fortaleza:</strong> Enlace σ (sigma) > Enlace π (pi)</li>
                    <li><strong>Fortaleza por tipo:</strong> Triple > Doble > Simple</li>
                    <li><strong>Longitud de enlace:</strong> Simple > Doble > Triple</li>
                </ul>
                <p style="margin-top: 10px;"><em>Nota:</em> A menor longitud de enlace, mayor es la fortaleza del mismo.</p>
            `
        },
        {
            title: "Heteroátomos",
            content: `
                <p>Cualquier átomo diferente a Carbono e Hidrógeno (O, N, Halógenos, S, etc.) que forme parte de una estructura orgánica.</p>
                <p style="margin-top: 10px;">Usualmente aportan pares libres de electrones y poseen la misma hibridación que el carbono al que están unidos. Determinar su hibridación indica qué tipo de orbitales contienen sus pares libres.</p>
            `
        }
    ],
    
    // Ejercicios interactivos
    exercises: [
        {
            problem: "¿Por qué el carbono presenta valencia 4 en la mayoría de sus compuestos (como CH₄) en lugar de valencia 2, que sería lo esperado por su configuración electrónica basal?",
            solution: "Se resuelve mediante el proceso de <strong>excitación</strong>. Un electrón del orbital 2s salta a un orbital 2p vacío, generando 4 electrones desapareados listos para formar 4 enlaces covalentes. Luego, estos orbitales se <strong>hibridan</strong> para justificar la geometría y la igualdad en longitud y fortaleza de los enlaces."
        },
        {
            problem: "Ordena los siguientes enlaces de mayor a menor longitud: Enlace simple C-C, Enlace doble C=C, Enlace triple C≡C.",
            solution: "El orden de <strong>mayor a menor longitud</strong> es: Enlace simple (C-C) > Enlace doble (C=C) > Enlace triple (C≡C). Esto se debe a que a mayor número de enlaces compartidos, mayor es la atracción entre los núcleos, acortando la distancia."
        }
    ],
    
    // Preguntas del quiz (Basadas en el resumen del PDF)
    quiz: [
        {
            question: "¿Qué tipo de geometría y rotación presenta un carbono con hibridación sp²?",
            options: ["Tetraédrica y rotación libre", "Trigonal plana y sin rotación", "Lineal y sin rotación", "Trigonal plana y rotación libre"],
            correct: 1,
            explanation: "La hibridación sp² corresponde a una geometría trigonal plana, se enlaza a 3 átomos, deja 1 orbital p libre para el enlace π, lo que impide la rotación libre."
        },
        {
            question: "Según el resumen de fortaleza y longitud de enlace, ¿cuál de las siguientes afirmaciones es correcta?",
            options: ["El enlace triple es más largo y más débil que el simple", "El enlace sigma (σ) es más débil que el enlace pi (π)", "A menor longitud de enlace, mayor fortaleza", "La longitud de enlace no afecta la fortaleza"],
            correct: 2,
            explanation: "El PDF establece claramente: Fortaleza (Triple > Doble > Simple) y Longitud (Simple > Doble > Triple). Por lo tanto, a menor longitud, mayor fortaleza."
        },
        {
            question: "¿Qué son los heteroátomos en química orgánica?",
            options: ["Átomos de carbono con hibridación sp", "Cualquier átomo diferente a Carbono e Hidrógeno (ej. O, N, S)", "Átomos que solo forman enlaces iónicos", "Orbitales p no hibridados"],
            correct: 1,
            explanation: "Los heteroátomos son cualquier átomo diferente a Carbono e Hidrógeno que forme parte de una estructura orgánica, y usualmente aportan pares libres de electrones."
        }
    ],
    
    // Nemotecnias para conceptos clave (Alta carga cognitiva)
    mnemonics: [
        {
            title: "Regla del Número de Hibridación",
            content: "El número en la hibridación (sp³, sp², sp) + los orbitales p libres = 3. <br>• sp³ → 0 p libres (4 enlaces, Tetraedro).<br>• sp² → 1 p libre (3 enlaces, Plano).<br>• sp → 2 p libres (2 enlaces, Lineal)."
        },
        {
            title: "Fortaleza vs. Longitud",
            content: "Imagina un resorte: <br>🔗 <strong>Más corto</strong> (Triple) = <strong>Más fuerte</strong> y rígido (sin rotación).<br>🔗 <strong>Más largo</strong> (Simple) = <strong>Más débil</strong> y flexible (rotación libre)."
        },
        {
            title: "Enlace Sigma (σ) vs Pi (π)",
            content: "<strong>σ (Sigma)</strong>: Es el 'Súper' enlace, siempre está primero, es más fuerte y permite rotación.<br><strong>π (Pi)</strong>: Es el 'Plus', viene después (en dobles/triples), es más débil y <em>bloquea</em> la rotación."
        }
    ]
};