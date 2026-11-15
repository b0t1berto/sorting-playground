// Sorting Playground - main.js
const algorithmSelect = document.getElementById('algorithm');
const sizeInput = document.getElementById('size');
const sizeValue = document.getElementById('size-value');
const speedInput = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const newArrayBtn = document.getElementById('new-array');
const startPauseBtn = document.getElementById('start-pause');
const comparisonsEl = document.getElementById('comparisons');
const swapsEl = document.getElementById('swaps');
const statusEl = document.getElementById('status');

const algorithmMap = {
    bubble: window.bubbleSort,
    selection: window.selectionSort,
    insertion: window.insertionSort,
    merge: window.mergeSort,
    quick: window.quickSort,
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
};

const visualizer = new Visualizer('bars');

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

function generateArray() {
    state.cancelAnimation = true;
    const size = parseInt(sizeInput.value, 10);
    state.array = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    state.sortedIndices = new Set();
    state.comparisons = 0;
    state.swaps = 0;
    updateStats();

    visualizer.renderBars(state.array);
    visualizer.clearHighlight();

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
            onDone: () => {
                state.array = working;
                for (let i = 0; i < state.array.length; i++) state.sortedIndices.add(i);
                visualizer.renderBars(state.array);
                visualizer.highlight([], 'sorted');
                // Marca todas como ordenadas
                for (let i = 0; i < state.array.length; i++) {
                    visualizer.bars[i].classList.add('sorted');
                }
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

function init() {
    generateArray();

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

    sizeInput.addEventListener('input', (e) => {
        sizeValue.textContent = e.target.value;
        if (!state.isRunning) generateArray();
    });

    speedInput.addEventListener('input', (e) => {
        speedValue.textContent = e.target.value;
    });

    algorithmSelect.addEventListener('change', (e) => {
        state.currentAlgorithm = e.target.value;
        if (!state.isRunning) generateArray();
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!state.isRunning) {
                runAlgorithm();
            } else {
                state.isPaused = !state.isPaused;
                startPauseBtn.textContent = state.isPaused ? '▶️ Continuar' : '⏸️ Pausar';
                statusEl.textContent = state.isPaused ? 'Pausado' : 'Executando...';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
