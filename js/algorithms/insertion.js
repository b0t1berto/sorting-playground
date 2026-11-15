/**
 * Insertion Sort - constrói a parte ordenada um elemento por vez, inserindo cada novo item na posição certa.
 */
function* insertionSort(array) {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        yield { type: 'compare', indices: [i, j] };

        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            yield { type: 'swap', indices: [j, j + 1] };
            j--;
            if (j >= 0) {
                yield { type: 'compare', indices: [j + 1, j] };
            }
        }

        array[j + 1] = key;
        yield { type: 'swap', indices: [j + 1] };
        yield { type: 'sorted', indices: [i] };
    }
    yield { type: 'sorted', indices: [0] };
    yield { type: 'done' };
}

window.insertionSort = insertionSort;