/**
 * Merge Sort - divide o array ao meio recursivamente e mescla as metades ordenadas.
 */
function* mergeSort(array) {
    yield* mergeSortHelper(array, 0, array.length - 1);
    yield { type: 'done' };
}

function* mergeSortHelper(array, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    yield* mergeSortHelper(array, left, mid);
    yield* mergeSortHelper(array, mid + 1, right);
    yield* merge(array, left, mid, right);
}

function* merge(array, left, mid, right) {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
        yield { type: 'compare', indices: [left + i, mid + 1 + j] };
        if (leftArr[i] <= rightArr[j]) {
            array[k++] = leftArr[i++];
        } else {
            array[k++] = rightArr[j++];
        }
        yield { type: 'swap', indices: [k - 1] };
    }

    while (i < leftArr.length) {
        array[k++] = leftArr[i++];
        yield { type: 'swap', indices: [k - 1] };
    }

    while (j < rightArr.length) {
        array[k++] = rightArr[j++];
        yield { type: 'swap', indices: [k - 1] };
    }

    for (let m = left; m <= right; m++) {
        yield { type: 'sorted', indices: [m] };
    }
}

window.mergeSort = mergeSort;