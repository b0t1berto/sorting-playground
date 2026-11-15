/**
 * Bubble Sort - repetidamente percorre o array, compara adjacentes e troca se estiverem fora de ordem.
 */
function* bubbleSort(array) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            yield { type: 'compare', indices: [j, j + 1] };
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                yield { type: 'swap', indices: [j, j + 1] };
            }
        }
        yield { type: 'sorted', indices: [n - i - 1] };
    }
    yield { type: 'sorted', indices: [0] };
    yield { type: 'done' };
}

window.bubbleSort = bubbleSort;