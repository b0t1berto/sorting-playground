/**
 * Visualizer - Gerencia barras DOM e consome geradores de ordenação.
 *
 * Responsabilidades:
 *  - renderBars(array): cria ou atualiza <div class="bar"> dentro de #bars
 *  - highlight(indices, estado): aplica classes CSS por estado
 *  - run(genFn, array, delay, onStep): consome um gerador com async/await + setTimeout
 */

class Visualizer {
    constructor(barsId) {
        this.container = document.getElementById(barsId);
        this.bars = [];
    }

    /**
     * Cria ou atualiza as barras no DOM.
     * Se já existirem barras, apenas atualiza as alturas.
     * @param {number[]} array
     */
    renderBars(array) {
        const n = array.length;
        const containerWidth = this.container.parentElement.clientWidth || 800;
        const barWidth = Math.max(1, containerWidth / n);

        // Se ainda não há barras, cria do zero
        if (this.bars.length !== n) {
            this.container.innerHTML = '';
            this.bars = [];
            for (let i = 0; i < n; i++) {
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.width = barWidth + 'px';
                this.container.appendChild(bar);
                this.bars.push(bar);
            }
        }

        // Atualiza altura de cada barra
        for (let i = 0; i < n; i++) {
            this.bars[i].style.height = array[i] + '%';
        }
    }

    /**
     * Aplica classe CSS a um conjunto de índices.
     * Estados: 'comparing' (amarelo), 'swapping' (vermelho), 'sorted' (verde)
     * @param {number[]} indices
     * @param {string} estado - 'comparing' | 'swapping' | 'sorted' | null
     */
    highlight(indices, estado) {
        if (!Array.isArray(indices)) indices = [indices];

        for (let i = 0; i < this.bars.length; i++) {
            this.bars[i].classList.remove('comparing', 'swapping', 'sorted');
        }

        if (estado && indices) {
            for (const idx of indices) {
                if (this.bars[idx]) {
                    this.bars[idx].classList.add(estado);
                }
            }
        }
    }

    /**
     * Limpa todas as classes de estado das barras.
     */
    clearHighlight() {
        for (const bar of this.bars) {
            bar.classList.remove('comparing', 'swapping', 'sorted');
        }
    }

    /**
     * Define a cor de fundo de uma barra específica.
     * @param {number} index - Índice da barra
     * @param {string} color - Qualquer valor CSS de cor (ex: '#ff0000', 'hsl(...)', 'var(--sorted)')
     */
    setBarColor(index, color) {
        if (this.bars[index]) {
            this.bars[index].style.background = color;
        }
    }

    /**
     * Remove a cor personalizada de uma barra, voltando ao padrão.
     * @param {number} index - Índice da barra
     */
    clearBarColor(index) {
        if (this.bars[index]) {
            this.bars[index].style.background = '';
        }
    }

    /**
     * Limpa todas as cores personalizadas das barras.
     */
    clearAllColors() {
        for (const bar of this.bars) {
            bar.style.background = '';
        }
    }

    /**
     * Consome um gerador de ordenação com async/await e setTimeout.
     * @param {function} genFn - Função geradora (ex: bubbleSort)
     * @param {number[]} array - Array a ser ordenado (será modificado in-place)
     * @param {number} delay - Atraso em ms entre cada passo
     * @param {Object} callbacks
     * @param {function} callbacks.onStep - Chamado a cada evento do gerador
     * @param {function} callbacks.onDone - Chamado ao terminar
     * @returns {Promise<void>}
     */
    async run(genFn, array, delay, { onStep, onDone } = {}) {
        const generator = genFn(array);

        for (const step of generator) {
            // Respeita pausa via callback externo (main.js controla)
            if (onStep && typeof onStep === 'function') {
                const shouldPause = await onStep(step);
                if (shouldPause === false) continue; // pulou este frame
            }

            await this._sleep(delay);
        }

        if (onDone && typeof onDone === 'function') {
            onDone();
        }
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.Visualizer = Visualizer;
