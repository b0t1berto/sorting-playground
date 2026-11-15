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
    generator: null,
};

const visualizer = new Visualizer('bars');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    const size = parseInt(sizeInput.value, 10);
    state.array = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    state.sortedIndices = new Set();
    state.comparisons = 0;
    state.swaps = 0;
    updateStats();

    // Cria as barras no DOM
    visualizer.setup(state.array);
    visualizer.draw(state.array, { comparing: [], swapping: [], sorted: new Set() });

    statusEl.textContent = 'Pronto';
    startPauseBtn.textContent = '▶️ Iniciar';
    startPauseBtn.classList.remove('running');
    state.isRunning = false;
    state.isPaused = false;
    state.generator = null;
}

function updateStats() {
    comparisonsEl.textContent = state.comparisons;
    swapsEl.textContent = state.swaps;
}

async function runAlgorithm() {
    const algoFn = algorithmMap[state.currentAlgorithm];
    if (!algoFn) return;

    const working = [...state.array];
    state.generator = algoFn(working);

    state.isRunning = true;
    state.isPaused = false;
    startPauseBtn.textContent = '⏸️ Pausar';
    startPauseBtn.classList.add('running');
    statusEl.textContent = 'Executando...';

    try {
        for (const step of state.generator) {
            while (state.isPaused) {
                await sleep(100);
                if (!state.isRunning) return;
            }
            if (!state.isRunning) return;

            state.array = working;

            if (step.type === 'compare') {
                state.comparisons++;
                const [i, j] = step.indices;
                initAudio();
                playTone(state.array[i]);
                playTone(state.array[j]);
                visualizer.draw(state.array, {
                    comparing: [i, j], swapping: [], sorted: state.sortedIndices,
                });
            } else if (step.type === 'swap') {
                state.swaps++;
                const [i, j] = step.indices;
                initAudio();
                playTone(state.array[i]);
                if (j !== undefined) playTone(state.array[j]);
                visualizer.draw(state.array, {
                    comparing: [], swapping: [i, j], sorted: state.sortedIndices,
                });
            } else if (step.type === 'sorted') {
                const [i] = step.indices;
                state.sortedIndices.add(i);
                visualizer.draw(state.array, {
                    comparing: [], swapping: [], sorted: state.sortedIndices,
                });
            } else if (step.type === 'done') {
                break;
            }

            updateStats();
            await sleep(getDelay());
        }

        state.array = working;
        for (let i = 0; i < state.array.length; i++) state.sortedIndices.add(i);
        visualizer.draw(state.array, { comparing: [], swapping: [], sorted: state.sortedIndices });
        statusEl.textContent = 'Ordenado! ✅';
        startPauseBtn.textContent = '▶️ Iniciar';
        startPauseBtn.classList.remove('running');
        state.isRunning = false;
        state.isPaused = false;
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
        state.isRunning = false;
        state.isPaused = false;
        state.generator = null;
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
            if (!state.isRunning) runAlgorithm();
            else {
                state.isPaused = !state.isPaused;
                startPauseBtn.textContent = state.isPaused ? '▶️ Continuar' : '⏸️ Pausar';
                statusEl.textContent = state.isPaused ? 'Pausado' : 'Executando...';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
