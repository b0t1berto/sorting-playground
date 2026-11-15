/**
 * Selection Sort - encontra o menor elemento do restante não ordenado e coloca na posição correta.
 */
function* selectionSort(array) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            yield { type: 'compare', indices: [minIdx, j] };
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            yield { type: 'swap', indices: [i, minIdx] };
        }
        yield { type: 'sorted', indices: [i] };
    }
    yield { type: 'sorted', indices: [n - 1] };
    yield { type: 'done' };
}

window.selectionSort = selectionSort;