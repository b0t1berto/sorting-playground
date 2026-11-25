// Sorting Playground - main.js
const algorithmSelect = document.getElementById('algorithm');
const algorithm2Select = document.getElementById('algorithm2');
const sizeInput = document.getElementById('size');
const sizeValue = document.getElementById('size-value');
const speedInput = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const newArrayBtn = document.getElementById('new-array');
const startPauseBtn = document.getElementById('start-pause');
const raceBtn = document.getElementById('race');
const comparisonsEl = document.getElementById('comparisons');
const swapsEl = document.getElementById('swaps');
const statusEl = document.getElementById('status');
const infoPanel = document.getElementById('info-panel');
const infoName = document.getElementById('info-name');
const infoComplexity = document.getElementById('info-complexity');
const infoDesc = document.getElementById('info-desc');
const raceContainer = document.getElementById('race-container');
const raceResult = document.getElementById('race-result');

const algorithmMap = {
    bubble: window.bubbleSort,
    selection: window.selectionSort,
    insertion: window.insertionSort,
    merge: window.mergeSort,
    quick: window.quickSort,
};

const algorithmInfo = {
    bubble: {
        name: 'Bubble Sort',
        complexity: 'O(n²)',
        desc: 'Repetidamente percorre o array, compara adjacentes e troca se estiverem fora de ordem.'
    },
    selection: {
        name: 'Selection Sort',
        complexity: 'O(n²)',
        desc: 'Encontra o menor elemento do restante não ordenado e coloca na posição correta.'
    },
    insertion: {
        name: 'Insertion Sort',
        complexity: 'O(n²)',
        desc: 'Constrói a parte ordenada um elemento por vez, inserindo cada novo item na posição certa.'
    },
    merge: {
        name: 'Merge Sort',
        complexity: 'O(n log n)',
        desc: 'Divide o array ao meio recursivamente e mescla as metades ordenadas.'
    },
    quick: {
        name: 'Quick Sort',
        complexity: 'O(n log n)',
        desc: 'Escolhe um pivô, particiona o array em torno dele e ordena recursivamente as partes.'
    },
};

let state = {
    array: [],
    sortedIndices: new Set(),
    comparisons: 0,
    swaps: 0,
    isRunning: false,
    isPaused: false,
    currentAlgorithm: 'bubble',
    audioCtx: null,
    animationPromise: null,
    cancelAnimation: false,
    race: {
        active: false,
        winner: null,
        finishedCount: 0,
    },
};

const visualizer = new Visualizer('bars');
const raceVisualizerA = new Visualizer('bars-a');
const raceVisualizerB = new Visualizer('bars-b');

function getDelay() {
    return Math.max(0, 200 - parseInt(speedInput.value, 10) * 1.9);
}

function initAudio() {
    if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
}

function playTone(value) {
    if (!state.audioCtx) return;
    const freq = 150 + (value / 100) * 1050;
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, state.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + 0.06);
    osc.start();
    osc.stop(state.audioCtx.currentTime + 0.06);
}

function generateRandomArray() {
    const size = parseInt(sizeInput.value, 10);
    return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

function generateArray() {
    state.cancelAnimation = true;
    state.array = generateRandomArray();
    state.sortedIndices = new Set();
    state.comparisons = 0;
    state.swaps = 0;
    updateStats();

    visualizer.renderBars(state.array);
    visualizer.clearHighlight();
    visualizer.clearAllColors();

    statusEl.textContent = 'Pronto';
    startPauseBtn.textContent = '▶️ Iniciar';
    startPauseBtn.classList.remove('running');
    state.isRunning = false;
    state.isPaused = false;
}

function updateStats() {
    comparisonsEl.textContent = state.comparisons;
    swapsEl.textContent = state.swaps;
}

function updateInfoPanel() {
    const info = algorithmInfo[state.currentAlgorithm];
    if (!info) return;
    infoName.textContent = info.name;
    infoComplexity.textContent = `Complexidade: ${info.complexity}`;
    infoDesc.textContent = info.desc;
}

/**
 * Animação de vitória: varredura verde da esquerda para a direita.
 * @param {Visualizer} viz - Instância do Visualizer
 * @param {number} n - Número de barras
 * @param {number} stepDelay - Delay entre cada barra (ms)
 */
async function victorySweep(viz, n, stepDelay = 20) {
    for (let i = 0; i < n; i++) {
        viz.setBarColor(i, 'var(--sorted)');
        viz.bars[i].classList.add('victory');
        await new Promise(resolve => setTimeout(resolve, stepDelay));
    }
}

async function runAlgorithm() {
    const algoFn = algorithmMap[state.currentAlgorithm];
    if (!algoFn) return;

    // Trabalha em uma cópia para não destruir o array original acidentalmente
    const working = [...state.array];

    state.isRunning = true;
    state.isPaused = false;
    state.cancelAnimation = false;
    startPauseBtn.textContent = '⏸️ Pausar';
    startPauseBtn.classList.add('running');
    statusEl.textContent = 'Executando...';

    initAudio();

    try {
        state.animationPromise = visualizer.run(algoFn, working, getDelay(), {
            onStep: async (step) => {
                // Loop de pausa: enquanto pausado, espera
                while (state.isPaused && !state.cancelAnimation) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                if (state.cancelAnimation) return false;

                state.array = working;

                if (step.type === 'compare') {
                    state.comparisons++;
                    const [i, j] = step.indices;
                    playTone(state.array[i]);
                    playTone(state.array[j]);
                    visualizer.highlight([i, j], 'comparing');
                    visualizer.renderBars(state.array);
                } else if (step.type === 'swap') {
                    state.swaps++;
                    const [i, j] = step.indices;
                    playTone(state.array[i]);
                    if (j !== undefined) playTone(state.array[j]);
                    visualizer.highlight([i, j], 'swapping');
                    visualizer.renderBars(state.array);
                } else if (step.type === 'overwrite') {
                    state.swaps++;
                    const [i] = step.indices;
                    playTone(state.array[i]);
                    visualizer.highlight([i], 'swapping');
                    visualizer.renderBars(state.array);
                } else if (step.type === 'sorted') {
                    const [i] = step.indices;
                    state.sortedIndices.add(i);
                    visualizer.highlight([i], 'sorted');
                    visualizer.renderBars(state.array);
                } else if (step.type === 'done') {
                    return false; // sinaliza fim
                }

                updateStats();
                return true;
            },
            onDone: async () => {
                state.array = working;
                for (let i = 0; i < state.array.length; i++) state.sortedIndices.add(i);
                visualizer.renderBars(state.array);

                // Animação de vitória (varredura verde)
                await victorySweep(visualizer, state.array.length);

                statusEl.textContent = 'Ordenado! ✅';
                startPauseBtn.textContent = '▶️ Iniciar';
                startPauseBtn.classList.remove('running');
                state.isRunning = false;
                state.isPaused = false;
            },
        });

        await state.animationPromise;
    } catch (err) {
        console.error(err);
        statusEl.textContent = 'Erro';
        state.isRunning = false;
        startPauseBtn.textContent = '▶️ Iniciar';
        startPauseBtn.classList.remove('running');
    }
}

/**
 * Modo corrida: executa dois algoritmos lado a lado no mesmo array.
 */
async function runRace() {
    if (state.race.active) return;

    state.race.active = true;
    state.race.winner = null;

    raceContainer.classList.add('visible');
    raceResult.textContent = 'Corrida em andamento...';

    const size = parseInt(sizeInput.value, 10);
    const commonArray = generateRandomArray();

    const algoA = algorithmMap[algorithmSelect.value];
    const algoB = algorithmMap[algorithm2Select.value];

    // Desenha o mesmo array inicial nos dois lados
    raceVisualizerA.renderBars([...commonArray]);
    raceVisualizerB.renderBars([...commonArray]);
    raceVisualizerA.clearAllColors();
    raceVisualizerB.clearAllColors();

    const delay = getDelay();
    let firstFinisher = null;

    const runSide = async (viz, algoFn, label) => {
        const working = [...commonArray];
        const generator = algoFn(working);
        try {
            for (const step of generator) {
                if (!state.race.active) return null;
                const [i, j] = step.indices;
                viz.renderBars(working);
                if (step.type === 'compare') viz.highlight([i, j], 'comparing');
                else if (step.type === 'swap' || step.type === 'overwrite') viz.highlight([i, j !== undefined ? j : i], 'swapping');
                else if (step.type === 'sorted') viz.highlight([i], 'sorted');
                await viz._sleep(delay);
            }
            await victorySweep(viz, working.length, 10);
        } catch (err) {
            console.error('Erro no lado da corrida:', label, err);
        }
        // O primeiro a chegar aqui define o vencedor
        if (!firstFinisher) {
            firstFinisher = label;
            console.log('Vencedor da corrida:', label);
        }
        return label;
    };

    const promiseA = runSide(raceVisualizerA, algoA, 'Algoritmo A');
    const promiseB = runSide(raceVisualizerB, algoB, 'Algoritmo B');

    await Promise.all([promiseA, promiseB]);

    const winner = firstFinisher || 'Empate';
    state.race.winner = winner;
    raceResult.textContent = winner ? `🏆 Vencedor: ${winner}` : 'Corrida finalizada';
    state.race.active = false;
    raceBtn.textContent = '🏁 Corrida';
}

function resetRace() {
    state.race.active = false;
    state.race.winner = null;
    raceContainer.classList.remove('visible');
    raceResult.textContent = '';
}

function init() {
    generateArray();
    updateInfoPanel();

    newArrayBtn.addEventListener('click', () => {
        generateArray();
    });

    startPauseBtn.addEventListener('click', () => {
        if (!state.isRunning) {
            state.isPaused = false;
            runAlgorithm();
        } else {
            state.isPaused = !state.isPaused;
            startPauseBtn.textContent = state.isPaused ? '▶️ Continuar' : '⏸️ Pausar';
            statusEl.textContent = state.isPaused ? 'Pausado' : 'Executando...';
        }
    });

    raceBtn.addEventListener('click', () => {
        if (state.race.active) {
            resetRace();
            raceBtn.textContent = '🏁 Corrida';
        } else {
            runRace();
            raceBtn.textContent = '⏹️ Parar Corrida';
        }
    });

    sizeInput.addEventListener('input', (e) => {
        sizeValue.textContent = e.target.value;
        if (!state.isRunning && !state.race.active) generateArray();
    });

    speedInput.addEventListener('input', (e) => {
        speedValue.textContent = e.target.value;
    });

    algorithmSelect.addEventListener('change', (e) => {
        state.currentAlgorithm = e.target.value;
        updateInfoPanel();
        if (!state.isRunning && !state.race.active) generateArray();
    });

    algorithm2Select.addEventListener('change', () => {
        // Apenas mantém a seleção do algoritmo 2 da corrida
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!state.isRunning && !state.race.active) {
                runAlgorithm();
            } else if (state.isRunning && !state.race.active) {
                state.isPaused = !state.isPaused;
                startPauseBtn.textContent = state.isPaused ? '▶️ Continuar' : '⏸️ Pausar';
                statusEl.textContent = state.isPaused ? 'Pausado' : 'Executando...';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
