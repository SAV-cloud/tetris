const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const NEXT_TETRO_COLUMNS = 6;
const NEXT_TETRO_ROWS = 2;

const TETROMINO_NAMES = [
    'O',
    'L',
    'J',
    'S',
    'Z',
    'T',
    'I'
];

const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
};

let playfield;
let nexTetroField;
let tetromino;
let nextTetromino;
let timeoutId;
let requestId;
let score = 0;

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function convertPositionToIndexNext(row, column) {
    return row * NEXT_TETRO_COLUMNS + column;
}


function generatePlayfield() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => 
            new Array(PLAYFIELD_COLUMNS).fill(0)
        );
}

function generateNextField() {
    for (let i = 0; i < NEXT_TETRO_COLUMNS * NEXT_TETRO_ROWS; i++) {
        const div = document.createElement('div');
        document.querySelector('.nextTetro').append(div);
    }

    nexTetroField = new Array(NEXT_TETRO_ROWS).fill()
        .map(() => 
            new Array(NEXT_TETRO_COLUMNS).fill(0)
        );
}

function generateTetromino(isFirst) {
    const nameTetro = getRandomElement(TETROMINO_NAMES);
    const matrixTetro = TETROMINOES[nameTetro];
    
    const nameNextTetro = getRandomElement(TETROMINO_NAMES);
    const matrixNextTetro = TETROMINOES[nameNextTetro];

    const rowTetro = -2;
    const columnTetro = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2);
    const columnNextTetro = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixNextTetro.length / 2);

    tetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        row: rowTetro,
        column: columnTetro,
    }

    tetromino = isFirst ? tetromino : nextTetromino;

    nextTetromino = {
        name: nameNextTetro,
        matrix: matrixNextTetro,
        row: rowTetro,
        column: columnNextTetro,
    }
    
}

function restart() {
    stopLoop();
    cellsNext.forEach(function (cell) { cell.removeAttribute('class') });
    playfield = new Array(PLAYFIELD_ROWS).fill()
    .map(() => 
        new Array(PLAYFIELD_COLUMNS).fill(0)
    );
    nexTetroField = new Array(NEXT_TETRO_ROWS).fill()
    .map(() => 
        new Array(NEXT_TETRO_COLUMNS).fill(0)
    );
    generateTetromino(true);
    drawTetrominoNext();
    score = 0;
    document.querySelector('.score').innerHTML = score;
    startLoop();
    document.querySelector('.backdrop').classList.add('is-hidden');
    document.addEventListener('keydown', onKeyDown);
}

function start() {
    drawPlayFieldNext();
    drawTetrominoNext();
    startLoop();
    document.addEventListener('keydown', onKeyDown);
}

function pause() {
    stopLoop();
    document.removeEventListener('keydown', onKeyDown);
}

generatePlayfield();
generateNextField();
generateTetromino(true);
const cells = document.querySelectorAll('.tetris div');
const cellsNext = document.querySelectorAll('.nextTetro div');

function drawPlayField() {

    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            // if(playfield[row][column] == 0) { continue };
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }

}

function drawPlayFieldNext() {

    for (let row = 0; row < NEXT_TETRO_ROWS; row++) {
        for (let column = 0; column < NEXT_TETRO_COLUMNS; column++) {
            // if(playfield[row][column] == 0) { continue };
            const name = nexTetroField[row][column];
            const cellIndex = convertPositionToIndexNext(row, column);
            cellsNext[cellIndex].classList.add(name);
        }
    }

}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            // cells[cellIndex].innerHTML = array[row][column];
            if (tetromino.row + row < 0) {
                continue;
            }
            if (tetromino.matrix[row][column] == 0) {
                continue;
            }
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetrominoNext() {
    const name = nextTetromino.name;
    const tetrominoMatrixSize = nextTetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            // cells[cellIndex].innerHTML = array[row][column];
            // if (tetromino.row < 0) {
            //     continue;
            // }
            if (nextTetromino.matrix[row][column] == 0) {
                continue;
            }
            const cellIndex = convertPositionToIndexNext(row,column + 1);
            cellsNext[cellIndex].classList.add(name);
        }
    }
}

function draw() {
    cells.forEach(function (cell) { cell.removeAttribute('class') });
    drawPlayField();
    drawTetromino();
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!tetromino.matrix[row][column]) {
                continue;
            }
            try {
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            } catch(err) {
                stopLoop();
                const modal = document.querySelector('.backdrop');
                modal.classList.remove('is-hidden');
                document.removeEventListener('keydown', onKeyDown);
                break;
            }
        }
    }
    const filledRows = findFilledRows();
    removeFillRows(filledRows);
    generateTetromino(false);
    cellsNext.forEach(function (cell) { cell.removeAttribute('class') });
    drawPlayFieldNext();
    drawTetrominoNext();
}

function countScore(destroyRows) {
    switch(destroyRows){
        case 1:
            score += 10;
            break;
        case 2:
            score += 30;
            break;
        case 3:
            score += 50;
            break;
        case 4:
            score += 100;
            break;
        default:
            score += 0;
    }
    document.querySelector('.score').innerHTML = score;
}

function shaking() {
    setTimeout(() => {
        document.querySelector('.game').classList.remove('shaking');
    }, 1000);
}

function removeFillRows(filledRows) {
    // filledRows.forEach(row => {
    //     dropRowsAbove(row);
    // })

    for (let i = 0; i < filledRows.length; i++) {
        const row = filledRows[i];
        dropRowsAbove(row);
    }
    countScore(filledRows.length);
}

function dropRowsAbove(rowDelete) {
    for (let row = rowDelete; row > 0; row--) {
        playfield[row] = playfield[row - 1];
    }
    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
    document.querySelector('.game').classList.add('shaking');
    shaking();
}

function findFilledRows() {
    const filledRows = [];
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        let filledColumns = 0;
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++ ){
            if (playfield[row][column] != 0) {
                filledColumns++;
            }
        }
        if (PLAYFIELD_COLUMNS == filledColumns) {
            filledRows.push(row);
        }
    }
    return filledRows;
}

function moveDown() {
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
}

function startLoop() {
    timeoutId = setTimeout(
        () => (requestId = requestAnimationFrame(moveDown)),
        700
    );
}

function stopLoop() {
    cancelAnimationFrame(requestId);
    timeoutId = clearTimeout(timeoutId);
}

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    // array = rotateMatrix(array);
    tetromino.matrix = rotatedMatrix;
    if (isValid()) {
        tetromino.matrix = oldMatrix;
    }
}

function rotateMatrix(matrixTetromino) {
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
};

document.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            rotateTetromino();
            break;
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
    }
    draw();
}

function moveTetrominoDown() {
    tetromino.row += 1;
    if (isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    }
}
function moveTetrominoLeft() {
    tetromino.column -= 1;
    if (isValid()) {
        tetromino.column += 1;
    }
}
function moveTetrominoRight() {
    tetromino.column += 1;
    if (isValid()) {
        tetromino.column -= 1;
    }
}

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!tetromino.matrix[row][column]) {
                continue;
            }
            // if (tetromino.matrix[row][column] == 0) {
            //     continue;
            // }
            if (isOutsideOfGameBoard(row, column)) {
                return true;
            }
            if (hasCollisions(row, column)){
                return true;
            }
        }
    }
    return false;
}

function isOutsideOfGameBoard(row, column) {
    return tetromino.column + column < 0 ||
           tetromino.column + column >= PLAYFIELD_COLUMNS ||
           tetromino.row + row >= playfield.length
}

function hasCollisions(row, column){
    return playfield[tetromino.row + row]?.[tetromino.column +column]
}