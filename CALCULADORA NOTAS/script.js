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

// ==================== GAME: Breakout ====================
const gameState = {
    canvas: null,
    ctx: null,
    paddle: { x: 350, y: 460, width: 100, height: 12, speed: 8 },
    ball: { x: 400, y: 440, radius: 6, vx: 4, vy: -4 },
    balls: [],
    bricks: [],
    score: 0,
    level: 1,
    gameActive: false,
    ballLaunched: false,
    keys: {},
    bricksDestroyed: 0,
    powerUps: [],
    magneticMode: false,
    baseSpeed: 4,
    shield: 0,
    slowBricksMode: false,
    slowBricksTimer: 0,
    explosionEffect: 0,
    floatingTexts: []
};

function initGame() {
    gameState.canvas = document.getElementById('gameCanvas');
    gameState.ctx = gameState.canvas.getContext('2d');
    gameState.score = 0;
    gameState.gameActive = true;
    gameState.ballLaunched = false;
    gameState.balls = [];
    gameState.bricks = [];
    gameState.bricksDestroyed = 0;
    gameState.powerUps = [];
    gameState.magneticMode = false;
    gameState.floatingTexts = [];
    gameState.shield = 0;
    gameState.slowBricksMode = false;
    gameState.slowBricksTimer = 0;
    gameState.explosionEffect = 0;
    
    // Aumentar dificultad por nivel
    const speedMultiplier = 1 + (gameState.level - 1) * 0.3;
    gameState.baseSpeed = 4;
    
    // Crear bloques (más filas en niveles superiores)
    const brickCols = 8;
    const brickRows = 4 + gameState.level; // 5, 6, 7... bloques según nivel
    const brickWidth = 90;
    const brickHeight = 15;
    const brickPadding = 5;
    const brickOffsetLeft = 15;
    const brickOffsetTop = 30;
    
    const totalBricks = brickCols * brickRows;
    
    for (let row = 0; row < brickRows; row++) {
        for (let col = 0; col < brickCols; col++) {
            gameState.bricks.push({
                x: col * (brickWidth + brickPadding) + brickOffsetLeft,
                y: row * (brickHeight + brickPadding) + brickOffsetTop,
                width: brickWidth,
                height: brickHeight,
                active: true,
                color: ['#7ee7c7', '#5ec8ff', '#ffd58a', '#ff7a7a'][row % 4]
            });
        }
    }
    
    // Resetear pelota con velocidad del nivel
    gameState.ball = {
        x: gameState.paddle.x + gameState.paddle.width / 2,
        y: gameState.paddle.y - gameState.paddle.height - 10,
        radius: 6,
        vx: gameState.baseSpeed * speedMultiplier,
        vy: -gameState.baseSpeed * speedMultiplier
    };
    
    setupGameControls();
    gameLoop();
}

function setupGameControls() {
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.key] = true;
        if (e.key === ' ') {
            e.preventDefault();
            if (!gameState.ballLaunched) {
                gameState.ballLaunched = true;
            }
        }
    });
    document.addEventListener('keyup', (e) => {
        gameState.keys[e.key] = false;
    });
}

function spawnPowerUp(brickX, brickY) {
    const random = Math.random() * 100;
    let type = null;
    
    // Probabilidades aumentadas:
    // 0.05% = Explosión (destruye todos los bloques)
    // 1% = Imán (bola pegada al paddle)
    // 2% = Duplicar bola
    // 3% = Velocidad aumentada
    // 2% = Paddle agrandado
    // 2% = Escudo (protege 1 fallo)
    // 2% = Lentitud de bloques (más fácil de romper)
    // Total: 12.05% de probabilidad
    
    if (random < 0.05) {
        type = 'explosion';
    } else if (random < 1.05) {
        type = 'magnet';
    } else if (random < 3.05) {
        type = 'doubleBall';
    } else if (random < 6.05) {
        type = 'speed';
    } else if (random < 8.05) {
        type = 'paddleSize';
    } else if (random < 10.05) {
        type = 'shield';
    } else if (random < 12.05) {
        type = 'slowBricks';
    }
    
    if (type) {
        gameState.powerUps.push({
            x: brickX + 45,
            y: brickY + 7,
            type: type,
            vx: 0,
            vy: 2,
            radius: 8,
            spawnTime: Date.now()
        });
    }
}

function activatePowerUp(type) {
    // Efecto visual: flash en el canvas
    gameState.canvas.style.filter = 'brightness(1.3)';
    setTimeout(() => {
        gameState.canvas.style.filter = 'brightness(1)';
    }, 100);
    
    switch(type) {
        case 'speed':
            // Aumentar velocidad de la pelota 50%
            gameState.ball.vx *= 1.5;
            gameState.ball.vy *= 1.5;
            gameState.score += 50;
            createFloatingText('⚡ +50', gameState.paddle.x + gameState.paddle.width / 2, gameState.paddle.y - 30);
            break;
        case 'doubleBall':
            // Crear una copia de la pelota con velocidad opuesta
            gameState.balls.push({
                x: gameState.ball.x,
                y: gameState.ball.y,
                radius: gameState.ball.radius,
                vx: -gameState.ball.vx + (Math.random() - 0.5) * 2,
                vy: gameState.ball.vy
            });
            gameState.score += 100;
            createFloatingText('2️⃣ +100', gameState.paddle.x + gameState.paddle.width / 2, gameState.paddle.y - 30);
            break;
        case 'magnet':
            // Atrapar la pelota al paddle
            gameState.magneticMode = true;
            setTimeout(() => {
                gameState.magneticMode = false;
            }, 3000);
            gameState.score += 75;
            createFloatingText('🧲 +75', gameState.paddle.x + gameState.paddle.width / 2, gameState.paddle.y - 30);
            break;
        case 'paddleSize':
            // Aumentar tamaño del paddle
            gameState.paddle.width = Math.min(200, gameState.paddle.width + 30);
            gameState.score += 40;
            createFloatingText('➕ +40', gameState.paddle.x + gameState.paddle.width / 2, gameState.paddle.y - 30);
            break;
        case 'shield':
            // Protección contra un fallo
            if (!gameState.shield) gameState.shield = 0;
            gameState.shield += 1;
            gameState.score += 80;
            createFloatingText('🛡️ +80', gameState.paddle.x + gameState.paddle.width / 2, gameState.paddle.y - 30);
            break;
        case 'slowBricks':
            // Bloques más lentos (fácil de romper temporalmente)
            gameState.slowBricksMode = true;
            gameState.slowBricksTimer = 5000; // 5 segundos
            gameState.score += 60;
            createFloatingText('🐌 +60', gameState.paddle.x + gameState.paddle.width / 2, gameState.paddle.y - 30);
            break;
        case 'explosion':
            // Destruir todos los bloques restantes
            gameState.bricks.forEach(brick => {
                if (brick.active) {
                    brick.active = false;
                    gameState.bricksDestroyed += 1;
                    gameState.score += 10;
                }
            });
            gameState.score += 500;
            createFloatingText('💥 +500', gameState.canvas.width / 2, gameState.canvas.height / 2);
            // Efecto de explosión visual
            gameState.explosionEffect = 30;
            break;
    }
    document.getElementById('gameScore').textContent = gameState.score;
}

function createFloatingText(text, x, y) {
    // Crear texto flotante que sube y desaparece
    gameState.floatingTexts = gameState.floatingTexts || [];
    gameState.floatingTexts.push({
        text: text,
        x: x,
        y: y,
        life: 1,
        maxLife: 60 // frames
    });
}


function updateGame() {
    if (!gameState.gameActive) return;
    
    // Actualizar timer de bloques lentos
    if (gameState.slowBricksMode && gameState.slowBricksTimer > 0) {
        gameState.slowBricksTimer -= 16; // ~16ms por frame
    } else if (gameState.slowBricksTimer <= 0) {
        gameState.slowBricksMode = false;
    }
    
    // Actualizar efecto de explosión
    if (gameState.explosionEffect > 0) {
        gameState.explosionEffect -= 1;
    }
    
    // Actualizar textos flotantes
    for (let i = gameState.floatingTexts.length - 1; i >= 0; i--) {
        gameState.floatingTexts[i].y -= 1;
        gameState.floatingTexts[i].life -= 1;
        if (gameState.floatingTexts[i].life <= 0) {
            gameState.floatingTexts.splice(i, 1);
        }
    }
    
    // Mover paddle con flechas/A/D
    if (gameState.keys['ArrowLeft'] || gameState.keys['a'] || gameState.keys['A']) {
        gameState.paddle.x = Math.max(0, gameState.paddle.x - gameState.paddle.speed);
    }
    if (gameState.keys['ArrowRight'] || gameState.keys['d'] || gameState.keys['D']) {
        gameState.paddle.x = Math.min(gameState.canvas.width - gameState.paddle.width, gameState.paddle.x + gameState.paddle.speed);
    }
    
    // Actualizar power-ups (caída)
    for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
        const powerUp = gameState.powerUps[i];
        powerUp.y += powerUp.vy;
        
        // Colisión con paddle
        if (powerUp.y + powerUp.radius > gameState.paddle.y &&
            powerUp.y - powerUp.radius < gameState.paddle.y + gameState.paddle.height &&
            powerUp.x > gameState.paddle.x &&
            powerUp.x < gameState.paddle.x + gameState.paddle.width) {
            activatePowerUp(powerUp.type);
            gameState.powerUps.splice(i, 1);
            continue;
        }
        
        // Eliminar si cae fuera
        if (powerUp.y > gameState.canvas.height) {
            gameState.powerUps.splice(i, 1);
        }
    }
    
    // Actualizar pelota principal
    if (gameState.ballLaunched) {
        // Si está en modo magnético, pega la pelota al paddle
        if (gameState.magneticMode) {
            gameState.ball.x = gameState.paddle.x + gameState.paddle.width / 2;
            gameState.ball.y = gameState.paddle.y - 12;
        } else {
            // Movimiento normal
            gameState.ball.x += gameState.ball.vx;
            gameState.ball.y += gameState.ball.vy;
            
            // Colisión con bordes
            if (gameState.ball.x - gameState.ball.radius < 0 || gameState.ball.x + gameState.ball.radius > gameState.canvas.width) {
                gameState.ball.vx = -gameState.ball.vx;
                gameState.ball.x = Math.max(gameState.ball.radius, Math.min(gameState.canvas.width - gameState.ball.radius, gameState.ball.x));
            }
            if (gameState.ball.y - gameState.ball.radius < 0) {
                gameState.ball.vy = -gameState.ball.vy;
            }
            
            // Game over si cae (o usar escudo)
            if (gameState.ball.y > gameState.canvas.height) {
                if (gameState.shield > 0) {
                    gameState.shield -= 1;
                    gameState.ball.y = gameState.paddle.y - 20;
                    gameState.ball.vy = -Math.abs(gameState.ball.vy);
                    createFloatingText('🛡️ Escudo usado', gameState.canvas.width / 2, 50);
                } else {
                    gameState.gameActive = false;
                    showGameOverModal(false);
                    return;
                }
            }
            
            // Colisión con paddle
            if (gameState.ball.y + gameState.ball.radius > gameState.paddle.y &&
                gameState.ball.y - gameState.ball.radius < gameState.paddle.y + gameState.paddle.height &&
                gameState.ball.x > gameState.paddle.x &&
                gameState.ball.x < gameState.paddle.x + gameState.paddle.width) {
                gameState.ball.vy = -Math.abs(gameState.ball.vy);
                const hitPos = (gameState.ball.x - (gameState.paddle.x + gameState.paddle.width / 2)) / (gameState.paddle.width / 2);
                gameState.ball.vx = hitPos * 6;
            }
            
            // Colisión con bloques
            for (let brick of gameState.bricks) {
                if (brick.active &&
                    gameState.ball.x - gameState.ball.radius < brick.x + brick.width &&
                    gameState.ball.x + gameState.ball.radius > brick.x &&
                    gameState.ball.y - gameState.ball.radius < brick.y + brick.height &&
                    gameState.ball.y + gameState.ball.radius > brick.y) {
                    brick.active = false;
                    gameState.ball.vy = -gameState.ball.vy;
                    gameState.score += 10;
                    gameState.bricksDestroyed += 1;
                    document.getElementById('gameScore').textContent = gameState.score;
                    
                    // Spawner power-up (12.05% probabilidad)
                    spawnPowerUp(brick.x, brick.y);
                    
                    // Verificar si ganó (todos los bloques destruidos)
                    if (gameState.bricksDestroyed === gameState.bricks.length) {
                        gameState.gameActive = false;
                        showGameOverModal(true);
                        return;
                    }
                }
            }
        }
    } else {
        // Pelota sigue al paddle mientras no esté lanzada
        gameState.ball.x = gameState.paddle.x + gameState.paddle.width / 2;
    }
    
    // Actualizar bolas adicionales (spawneadas por power-up doubleBall)
    for (let i = gameState.balls.length - 1; i >= 0; i--) {
        const ball = gameState.balls[i];
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // Colisiones simples para bolas adicionales
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > gameState.canvas.width) {
            ball.vx = -ball.vx;
        }
        if (ball.y - ball.radius < 0) {
            ball.vy = -ball.vy;
        }
        
        // Eliminar si cae
        if (ball.y > gameState.canvas.height) {
            gameState.balls.splice(i, 1);
            continue;
        }
        
        // Colisión con paddle
        if (ball.y + ball.radius > gameState.paddle.y &&
            ball.y - ball.radius < gameState.paddle.y + gameState.paddle.height &&
            ball.x > gameState.paddle.x &&
            ball.x < gameState.paddle.x + gameState.paddle.width) {
            ball.vy = -Math.abs(ball.vy);
        }
        
        // Colisión con bloques
        for (let brick of gameState.bricks) {
            if (brick.active &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.x + ball.radius > brick.x &&
                ball.y - ball.radius < brick.y + brick.height &&
                ball.y + ball.radius > brick.y) {
                brick.active = false;
                ball.vy = -ball.vy;
                gameState.score += 10;
                gameState.bricksDestroyed += 1;
                document.getElementById('gameScore').textContent = gameState.score;
                spawnPowerUp(brick.x, brick.y);
                
                if (gameState.bricksDestroyed === gameState.bricks.length) {
                    gameState.gameActive = false;
                    showGameOverModal(true);
                    return;
                }
            }
        }
    }
}

function drawGame() {
    const { ctx, canvas, paddle, ball, bricks, powerUps, balls } = gameState;

    // Limpiar canvas
    ctx.fillStyle = 'rgba(15,23,36,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Efecto de explosión (flash blanco)
    if (gameState.explosionEffect > 0) {
        ctx.fillStyle = `rgba(255,255,255,${(gameState.explosionEffect / 30) * 0.35})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Dibujar bloques
    for (let brick of bricks) {
        if (brick.active) {
            // Si está en modo slow, los bloques se ven más transparentes/grises
            if (gameState.slowBricksMode) {
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = 'rgba(200,200,200,0.6)';
            } else {
                ctx.globalAlpha = 1;
                ctx.fillStyle = brick.color;
            }
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
    }

    // Dibujar power-ups
    const powerUpColors = {
        'speed': '#ff7a7a',
        'doubleBall': '#ffd58a',
        'magnet': '#7ee7c7',
        'paddleSize': '#5ec8ff',
        'explosion': '#ff6b9d',
        'shield': '#ffd700',
        'slowBricks': '#9d7dff'
    };

    for (let powerUp of powerUps) {
        ctx.fillStyle = powerUpColors[powerUp.type] || '#ffffff';
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Icono simple para cada power-up
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const iconMap = { 'speed': '⚡', 'doubleBall': '2', 'magnet': '🧲', 'paddleSize': '+', 'explosion': '💥', 'shield': '🛡️', 'slowBricks': '🐌' };
        const icon = iconMap[powerUp.type] || '?';
        ctx.fillText(icon, powerUp.x, powerUp.y + 1);
    }

    // Dibujar pelota principal
    ctx.fillStyle = '#5ec8ff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(94,200,255,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dibujar bolas adicionales
    for (let b of balls) {
        ctx.fillStyle = '#ffd58a';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,213,122,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Dibujar paddle
    ctx.fillStyle = gameState.magneticMode ? '#ff6b9d' : '#7ee7c7';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = gameState.magneticMode ? 'rgba(255,107,157,0.8)' : 'rgba(126,231,199,0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Mostrar escudo si está activo
    if (gameState.shield > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,215,0,0.9)';
        ctx.lineWidth = 3;
        ctx.strokeRect(paddle.x - 10, paddle.y - 15, paddle.width + 20, paddle.height + 10);
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`🛡️x${gameState.shield}`, paddle.x + paddle.width / 2, paddle.y - 8);
        ctx.restore();
    }

    // Dibujar textos flotantes
    for (let i = 0; i < gameState.floatingTexts.length; i++) {
        const t = gameState.floatingTexts[i];
        const alpha = Math.max(0, t.life / t.maxLife);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.font = 'bold 16px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(t.text, t.x, t.y);
    }

    // Mostrar instrucciones si la pelota no está lanzada
    if (!gameState.ballLaunched) {
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '14px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('Presiona ESPACIO para lanzar', canvas.width / 2, canvas.height / 2);
    }

    // Mostrar info de modo magnético
    if (gameState.magneticMode) {
        ctx.fillStyle = 'rgba(255,107,157,0.9)';
        ctx.font = 'bold 12px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ IMÁN ACTIVADO ⚡', canvas.width / 2, 30);
    }

    // Mostrar info de bloques lentos
    if (gameState.slowBricksMode && gameState.slowBricksTimer > 0) {
        ctx.fillStyle = 'rgba(157,125,255,0.9)';
        ctx.font = 'bold 12px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(`🐌 BLOQUES LENTOS (${Math.ceil(gameState.slowBricksTimer / 1000)}s)`, canvas.width / 2, 50);
    }
}

function gameLoop() {
    if (!gameState.gameActive) return;
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameState.gameActive = false;
    document.removeEventListener('keydown', null);
    document.removeEventListener('keyup', null);
}

function showGameOverModal(won) {
    gameState.gameActive = false;
    const gameScreen = document.getElementById('gameScreen');
    
    // Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: var(--card-bg);
        border: 1px solid rgba(94,200,255,0.2);
        border-radius: 14px;
        padding: 40px;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        backdrop-filter: blur(6px);
        animation: popIn 500ms cubic-bezier(.2,.9,.2,1);
    `;
    
    if (won) {
        content.innerHTML = `
            <h2 style="margin:0;font-size:2.2rem;color:#7ee7c7;margin-bottom:10px">¡GANASTE! 🎉</h2>
            <p style="color:var(--muted);font-size:1rem;margin:10px 0">Nivel ${gameState.level} completado</p>
            <p style="color:var(--text);font-size:1.3rem;font-weight:700;margin:20px 0">Puntuación: ${gameState.score}</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:30px">
                <button id="nextLevelBtn" class="btn btn-primary" style="padding:12px 24px;cursor:pointer">Siguiente Nivel</button>
                <button id="exitBtn" class="btn btn-outline" style="padding:12px 24px;cursor:pointer;color:var(--accent);border:1px solid rgba(94,200,255,0.2)">Salir</button>
            </div>
        `;
    } else {
        content.innerHTML = `
            <h2 style="margin:0;font-size:2.2rem;color:#ff7a7a;margin-bottom:10px">¡PERDISTE! 😔</h2>
            <p style="color:var(--muted);font-size:1rem;margin:10px 0">Nivel ${gameState.level}</p>
            <p style="color:var(--text);font-size:1.3rem;font-weight:700;margin:20px 0">Puntuación: ${gameState.score}</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:30px">
                <button id="retryBtn" class="btn btn-primary" style="padding:12px 24px;cursor:pointer">Reintentar</button>
                <button id="exitBtn" class="btn btn-outline" style="padding:12px 24px;cursor:pointer;color:var(--accent);border:1px solid rgba(94,200,255,0.2)">Salir</button>
            </div>
        `;
    }
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Event listeners para botones
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const retryBtn = document.getElementById('retryBtn');
    const exitBtn = document.getElementById('exitBtn');
    
    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', () => {
            gameState.level += 1;
            modal.remove();
            initGame();
        });
    }
    
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            modal.remove();
            initGame();
        });
    }
    
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            const gameScreen = document.getElementById('gameScreen');
            const calculatorScreen = document.querySelector('.container');
            gameState.gameActive = false;
            gameState.level = 1;
            gameState.score = 0;
            gameState.ballLaunched = false;
            modal.remove();
            gameScreen.style.display = 'none';
            gameScreen.classList.remove('active');
            calculatorScreen.style.display = 'flex';
        });
    }
}

// Mostrar/ocultar pantalla del juego
document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('playBtn');
    const backBtn = document.getElementById('backBtn');
    const gameScreen = document.getElementById('gameScreen');
    const calculatorScreen = document.querySelector('.container');
    
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            gameState.level = 1;
            gameState.score = 0;
            gameState.ballLaunched = false;
            gameState.paddle.width = 100; // Resetear tamaño del paddle
            gameState.magneticMode = false;
            document.getElementById('levelDisplay').textContent = gameState.level;
            document.getElementById('gameScore').textContent = '0';
            calculatorScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
            gameScreen.classList.add('active');
            initGame();
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            gameState.gameActive = false;
            gameState.level = 1;
            gameState.score = 0;
            gameState.ballLaunched = false;
            gameState.paddle.width = 100;
            gameState.magneticMode = false;
            gameScreen.style.display = 'none';
            gameScreen.classList.remove('active');
            calculatorScreen.style.display = 'flex';
        });
    }
});

