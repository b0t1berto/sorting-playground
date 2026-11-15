/**
 * Quick Sort - escolhe um pivoto, particiona o array em torno dele e ordena recursivamente as partes.
 */
function* quickSort(array) {
    yield* quickSortHelper(array, 0, array.length - 1);
    yield { type: 'done' };
}

function* quickSortHelper(array, low, high) {
    if (low < high) {
        const pi = yield* partition(array, low, high);
        yield { type: 'sorted', indices: [pi] };
        yield* quickSortHelper(array, low, pi - 1);
        yield* quickSortHelper(array, pi + 1, high);
    }
}

function* partition(array, low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        yield { type: 'compare', indices: [j, high] };
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            yield { type: 'swap', indices: [i, j] };
        }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    yield { type: 'swap', indices: [i + 1, high] };
    return i + 1;
}

window.quickSort = quickSort;