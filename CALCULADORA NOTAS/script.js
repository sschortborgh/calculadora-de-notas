/**
 * Constantes de los pesos de los cortes (33%, 33%, 34%)
 */
const PESO_CORTE_1 = 0.33;
const PESO_CORTE_2 = 0.33;
const PESO_CORTE_3 = 0.34;
const NOTA_APROBACION = 3.0;
const NOTA_MAXIMA = 5.0;
const NOTA_MINIMA = 0.0;
const ERROR_MENSAJE = "Formato inválido (utilice números positivos entre 0.0 y 5.0)";
const ERROR_VACIO = "La casilla no puede estar vacía al calcular."; // Nuevo mensaje de error para campo vacío

/**
 * Función que se ejecuta al escribir en los inputs.
 * Valida el valor y limpia el mensaje de error si es válido.
 * NOTA: Esta función permite borrar el campo sin que el error se muestre inmediatamente.
 * @param {HTMLInputElement} inputElement El elemento input que se está modificando.
 */
function validarYLimpiar(inputElement) {
    const errorElement = document.getElementById(`error-${inputElement.id}`);
    const rawValue = inputElement.value.trim();
    const value = parseFloat(rawValue);

    // 1. No mostrar error si el campo está vacío (mientras se escribe)
    if (rawValue === "") {
        errorElement.textContent = "";
        // quitar clase filled cuando está vacío para la etiqueta flotante
        const wrapper = inputElement.closest('.input-wrapper');
        if (wrapper) wrapper.classList.remove('filled');
        return;
    }

    // 2. Mostrar error si no es un número, es negativo, o está fuera de rango (0 a 5)
    if (isNaN(value) || value < NOTA_MINIMA || value > NOTA_MAXIMA) {
        errorElement.textContent = ERROR_MENSAJE;
    } else {
        errorElement.textContent = "";
        // marcar como 'filled' para activar la etiqueta flotante
        const wrapper = inputElement.closest('.input-wrapper');
        if (wrapper) wrapper.classList.add('filled');
    }
}


// -------------------------------------------------------------------------------- //

/**
 * Función principal para calcular la nota necesaria para el 3.0 y los promedios generales.
 */
function calcularTodo() {
    // Resetear mensajes de error
    document.getElementById('error-corte1').textContent = '';
    document.getElementById('error-corte2').textContent = '';

    const notaNecesariaSpan = document.getElementById('notaNecesaria');
    const mensajeNecesaria = document.getElementById('mensajeNecesaria');
    const notaFinalMaximaSpan = document.getElementById('notaFinalMaxima');
    const notaFinalMinimaSpan = document.getElementById('notaFinalMinima');
    const resultContainer = document.querySelector('.result');

    // Resetear resultados
    notaNecesariaSpan.textContent = '0.00';
    mensajeNecesaria.textContent = '';

    // 1. Obtener los valores crudos del DOM
    const rawN1 = document.getElementById('corte1').value.trim();
    const rawN2 = document.getElementById('corte2').value.trim();

    // 2. Intentar parsear a número.
    let n1 = parseFloat(rawN1);
    let n2 = parseFloat(rawN2);

    let hayError = false;

    // 3. Validación estricta antes de calcular (para el botón)

    // VALIDACIÓN DE CAMPO VACÍO AL CALCULAR
    if (rawN1 === "") {
        document.getElementById('error-corte1').textContent = ERROR_VACIO;
        hayError = true;
    } else if (isNaN(n1) || n1 < NOTA_MINIMA || n1 > NOTA_MAXIMA) {
        // Validación de formato/rango
        document.getElementById('error-corte1').textContent = ERROR_MENSAJE;
        hayError = true;
    }
    
    // VALIDACIÓN DE CAMPO VACÍO AL CALCULAR
    if (rawN2 === "") {
        document.getElementById('error-corte2').textContent = ERROR_VACIO;
        hayError = true;
    } else if (isNaN(n2) || n2 < NOTA_MINIMA || n2 > NOTA_MAXIMA) {
        // Validación de formato/rango
        document.getElementById('error-corte2').textContent = ERROR_MENSAJE;
        hayError = true;
    }

    if (hayError) {
        // Si hay error, ocultamos resultado si estaba visible y detenemos la ejecución
        if (resultContainer) resultContainer.classList.remove('show','pop','status-good','status-bad','status-neutral');
        return;
    }
    
    // 4. Los valores numéricos son válidos, procedemos con el cálculo
    // Nota: Como ya validamos que no estén vacíos y sean números, aquí usamos n1 y n2 directamente.

    // 5. CÁLCULO PRINCIPAL: Nota Necesaria para 3.0
    const pesoAcumulado = (n1 * PESO_CORTE_1) + (n2 * PESO_CORTE_2);
    const notaRequeridaPara3 = NOTA_APROBACION - pesoAcumulado;
    
    let notaNecesaria = notaRequeridaPara3 / PESO_CORTE_3;

    // 6. Mostrar y manejar límites de la Nota Necesaria
    // normalizar clases de estado
    if (resultContainer) {
        resultContainer.classList.remove('status-good','status-bad','status-neutral');
    }

    if (notaNecesaria > NOTA_MAXIMA) {
        notaNecesariaSpan.textContent = notaNecesaria.toFixed(2);
        mensajeNecesaria.textContent = `¡Imposible! Necesitas una nota superior a 5.0.`;
        if (resultContainer) resultContainer.classList.add('status-bad');
        triggerShake();
    } else if (notaNecesaria <= NOTA_MINIMA) {
        notaNecesariaSpan.textContent = `0.00`;
        mensajeNecesaria.textContent = `¡Ya Aprobaste! Tu nota es suficiente para superar el 3.0, incluso con 0.0 en el Corte 3.`;
        if (resultContainer) resultContainer.classList.add('status-good');
        triggerPulse();
    }
    else {
        mensajeNecesaria.textContent = `Debes obtener ${notaNecesaria.toFixed(2)} en el Corte 3.`;
        notaNecesariaSpan.textContent = notaNecesaria.toFixed(2);
        if (resultContainer) resultContainer.classList.add('status-good');
        triggerPulse();
    }
    
    // 7. CÁLCULOS ADICIONALES (Promedio General al final)
    let notaFinalMaxima = pesoAcumulado + (NOTA_MAXIMA * PESO_CORTE_3);
    notaFinalMaximaSpan.textContent = notaFinalMaxima.toFixed(2);

    let notaFinalMinima = pesoAcumulado + (NOTA_MINIMA * PESO_CORTE_3);
    notaFinalMinimaSpan.textContent = notaFinalMinima.toFixed(2);

    // Mostrar y animar el bloque de resultado
    const resultEl = resultContainer || document.querySelector('.result');
    if (resultEl) {
        resultEl.classList.add('show');
        resultEl.classList.remove('pop');
        // fuerza reflow para reiniciar la animación
        void resultEl.offsetWidth;
        resultEl.classList.add('pop');
        // auto-close si está activado
        if (window._autoCloseEnabled) {
            clearTimeout(window._autoCloseTimer);
            window._autoCloseTimer = setTimeout(()=>{ closeResult(); }, 4000);
        }
    }
}

// Inicializar los campos con 0.0 al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Es importante que el valor inicial sea '0.0' para evitar que se considere vacío al cargar
    document.getElementById('corte1').value = '0.0'; 
    document.getElementById('corte2').value = '0.0';
    // asegurarnos de marcar los wrappers como llenos si tienen valor inicial
    ['corte1','corte2'].forEach(id => {
        const el = document.getElementById(id);
        const wrapper = el && el.closest('.input-wrapper');
        if (el && wrapper && el.value.trim() !== '') wrapper.classList.add('filled');
    });

    // Theme toggle restore
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const current = localStorage.getItem('theme') || 'dark';
        if (current === 'light') document.body.classList.add('light');
        updateThemeButton(themeToggle);
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light');
            const isLight = document.body.classList.contains('light');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeButton(themeToggle);
        });
    }

    // Effects bar: bind only the "clear" button (we removed the other buttons)
    const clearBtn = document.querySelector('.effect-btn[data-action="clear"]');
    if (clearBtn) clearBtn.addEventListener('click', clearInputs);

    // Make numeric inputs select their content on focus so the user can type immediately
    // and prevent mouseup from deselecting (common pattern to allow instant replace)
    document.querySelectorAll('#corte1, #corte2').forEach(input => {
        input.addEventListener('focus', (e) => {
            try { e.target.select(); } catch (err) { /* ignore */ }
        });
        // Prevent mouseup from clearing the selection right after focus when clicked
        input.addEventListener('mouseup', (e) => {
            e.preventDefault();
        });
    });
});

function updateThemeButton(btn){
    const isLight = document.body.classList.contains('light');
    btn.textContent = isLight ? 'Modo Oscuro' : 'Modo Claro';
    btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
}

/* ---------- Effects: confetti and sad ---------- */
/* ---------- Effects: small interactive animations (pulse/shake/glow) ---------- */
window._autoCloseEnabled = false;
window._autoCloseTimer = null;

function triggerPulse(){
    const el = document.querySelector('.result');
    if (!el) return;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
}

function triggerShake(){
    const el = document.querySelector('.result');
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
}

function triggerGlow(){
    const el = document.querySelector('.card');
    if (!el) return;
    el.classList.add('glow');
    setTimeout(()=>el.classList.remove('glow'), 900);
}

function closeResult(){
    const el = document.querySelector('.result');
    if (!el) return;
    el.classList.remove('show','pop','pulse','shake','glow','status-good','status-bad','status-neutral');
}

function clearInputs(){
    ['corte1','corte2'].forEach(id=>{
        const el = document.getElementById(id);
        if (el) el.value = '0.0';
        const err = document.getElementById('error-'+id);
        if (err) err.textContent = '';
        const wrap = el && el.closest('.input-wrapper');
        if (wrap) wrap.classList.add('filled');
    });
    closeResult();
}

function toggleAutoClose(btn){
    window._autoCloseEnabled = !window._autoCloseEnabled;
    if (btn) btn.textContent = 'Auto-Cerrar: ' + (window._autoCloseEnabled ? 'ON' : 'OFF');
}

