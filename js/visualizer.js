/**
 * Visualizer - Desenha barras como <div> dentro de #bars usando flexbox.
 * Cada barra é um <div class="bar"> com altura proporcional ao valor.
 */
class Visualizer {
    constructor(barsId) {
        this.container = document.getElementById(barsId);
        this.bars = [];
    }

    /**
     * Cria os elementos de barra no DOM com base no tamanho do array.
     * @param {number[]} array
     */
    setup(array) {
        this.container.innerHTML = '';
        this.bars = [];
        const n = array.length;
        const containerWidth = this.container.parentElement.clientWidth || 800;
        const barWidth = Math.max(1, containerWidth / n);

        for (let i = 0; i < n; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.width = barWidth + 'px';
            bar.style.height = '0%';
            this.container.appendChild(bar);
            this.bars.push(bar);
        }
    }

    /**
     * Atualiza alturas e classes das barras.
     * @param {number[]} array - Valores (0-100)
     * @param {Object} options
     * @param {number[]} options.comparing
     * @param {number[]} options.swapping
     * @param {Set<number>} options.sorted
     */
    draw(array, options = {}) {
        const { comparing = [], swapping = [], sorted = new Set() } = options;
        const n = array.length;

        for (let i = 0; i < n; i++) {
            const bar = this.bars[i];
            if (!bar) continue;

            bar.style.height = array[i] + '%';
            bar.className = 'bar';

            if (sorted.has(i)) {
                bar.classList.add('sorted');
            } else if (swapping.includes(i)) {
                bar.classList.add('swapping');
            } else if (comparing.includes(i)) {
                bar.classList.add('comparing');
            }
        }
    }

    clear() {
        this.container.innerHTML = '';
        this.bars = [];
    }
}

window.Visualizer = Visualizer;
