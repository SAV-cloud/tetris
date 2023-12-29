import { 
    PLAYFIELD_COLUMNS,
    PLAYFIELD_ROWS,
    TETROMINO_NAMES,
    TETROMINOES,
    btnRestart,
    NEXT_TETRO_COLUMNS,
    NEXT_TETRO_ROWS
 } from './utils.js';
 
const storedScores = JSON.parse(localStorage.getItem('bestScores')) || [];

let playfield;
let nexTetroField;
let tetromino;
let nextTetromino;
let timeoutId;
let requestId;
let score = 0;
let isGameOver = false;
let level = 500;
let cells;
let cellsNext;
let isPaused = false;


init();
stopLoop();

function init(){
    document.querySelector('.backdrop').classList.add('is-hidden');
    isGameOver = false;
    isPaused = false;
    stopLoop();
    generatePlayfield(); 
    generateTetromino(true);
    generateNextField(); 
    cells = document.querySelectorAll('.tetris div');
    cellsNext = document.querySelectorAll('.nextTetro div');
    score = 0;
    drawTetrominoNext(); 
    countScore(null);
    startLoop();
}

function togglePauseGame(){
    isPaused = !isPaused;

    if(isPaused){
        stopLoop();
    } else{
        startLoop();
    }
}


function onKeyDown(event) {

    if (event.key == 'p') {  
        togglePauseGame();
    }
    if (isPaused) {
        return
    }
    switch (event.key) {
        case ' ':
            dropTetrominoDown();
            break;
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

function dropTetrominoDown() {
    while(!isValid()) {
        tetromino.row++;
    }
    tetromino.row--;
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

// functions generate playdields and tetromino


function generatePlayfield() {
    document.querySelector('.tetris').innerHTML = '';
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
}

function generateNextField() {
    document.querySelector('.nextTetro').innerHTML = '';
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


function drawPlayField() {

    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }

}

function drawPlayFieldNext() {

    for (let row = 0; row < NEXT_TETRO_ROWS; row++) {
        for (let column = 0; column < NEXT_TETRO_COLUMNS; column++) {
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
            if (isOutsideTopBoard(row)) { continue }
            if (tetromino.matrix[row][column] == 0) { continue }
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetrominoNext() {
    let extraRow = 0;
    let extraColumn = 1;
    const name = nextTetromino.name;
    const tetrominoMatrixSize = nextTetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (nextTetromino.matrix[row][column] == 0) {
                continue;
            }
            const cellIndex = convertPositionToIndexNext(row + extraRow,column + extraColumn);
            cellsNext[cellIndex].classList.add(name);
        }
    }
}

function draw() {
    cells.forEach(function (cell) { cell.removeAttribute('class') });
    drawPlayField();
    drawTetromino();
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

function selectLevel(selectedLevel) {
    switch(selectedLevel){
        case 'hard':
            level = 100;
            break;
        case 'easy':
            level = 2000;
            break;
        default:
            level = 1000;
    }

}

document.querySelector('.easyBtn').addEventListener('click', function() {
    selectLevel('easy');
    const modal = document.querySelector('.menu');
    modal.classList.add('is-hidden');
    togglePauseGame();
});

document.querySelector('.mediumBtn').addEventListener('click', function() {
    selectLevel('medium');
    const modal = document.querySelector('.menu');
    modal.classList.add('is-hidden');
    togglePauseGame();
});

document.querySelector('.hardBtn').addEventListener('click', function() {
    selectLevel('hard');
    const modal = document.querySelector('.menu');
    modal.classList.add('is-hidden'); 
    togglePauseGame();
});

document.querySelector('.level').addEventListener('click', function() {
    const modal = document.querySelector('.menu');
    modal.classList.remove('is-hidden');
    isPaused = false;
    togglePauseGame();
});

document.querySelector('.close').addEventListener('click', function() {
    const modal = document.querySelector('.menu');
    modal.classList.add('is-hidden');
});

document.querySelector('#closeBest').addEventListener('click', function() {
    const modal = document.querySelector('.best');
    modal.classList.add('is-hidden');
});

document.querySelector('.rotate').addEventListener('click', function() {
    rotateTetromino();
});

document.querySelector('.left').addEventListener('click', function() {
    moveTetrominoLeft();
});

document.querySelector('.right').addEventListener('click', function() {
    moveTetrominoRight();
});

document.querySelector('.down').addEventListener('click', function() {
    moveTetrominoDown();
});

document.querySelector('.fastDown').addEventListener('click', function() {
    dropTetrominoDown();
});



function gameOver(){
    stopLoop();
    const modal = document.querySelector('.backdrop');
    modal.classList.remove('is-hidden'); 
    const scoreBoard = document.querySelector('.scoreValue');
    scoreBoard.innerHTML =`Your score: ${score}`;
    let bestScoreNow = storedScores[0] > score ? storedScores[0] : score;
    const bestScore = document.querySelector('.bestScore');
    bestScore.innerHTML =`Best score: ${bestScoreNow}` ;
    updateBestScores(score);
    document.removeEventListener('keydown', onKeyDown);
}

function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}


function convertPositionToIndexNext(row, column) {
    return row * NEXT_TETRO_COLUMNS + column;
}

function isOutsideTopBoard(row){
    return tetromino.row + row < 0;
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!tetromino.matrix[row][column]) {
                continue;
            }
            if(isOutsideTopBoard(row)){ 
                isGameOver = true;
                return;
            }
            playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
        }
    }
    const filledRows = findFilledRows();
    removeFillRows(filledRows);
    generateTetromino(false);
    cellsNext.forEach(function (cell) { cell.removeAttribute('class') });
    drawPlayFieldNext();
    drawTetrominoNext();
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
    if(isGameOver){
        gameOver();
    }
}

function startLoop() {
    timeoutId = setTimeout(
        () => (requestId = requestAnimationFrame(moveDown)),
        level
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

btnRestart.addEventListener('click', function(){
    this.blur();
    init();
});

const btnRestart2    = document.querySelector('.restart2');
btnRestart2.addEventListener('click', function(){
    this.blur(); 
    init();
    document.addEventListener('keydown', onKeyDown);  
});

const btnPause    = document.querySelector('.pause');
btnPause.addEventListener('click', function(){
    togglePauseGame();
});

const btnStart    = document.querySelector('.start');
btnStart.addEventListener('click', function(){
    document.addEventListener('keydown', onKeyDown);   
    isPaused = false;
    startLoop();
});




function shaking() {
    setTimeout(() => {
        document.querySelector('.game').classList.remove('shaking');
    }, 1000);
}

function updateBestScores(newScore) {
    storedScores.push(newScore);
    storedScores.sort((a, b) => b - a);
    storedScores.splice(3);
    localStorage.setItem('bestScores', JSON.stringify(storedScores));
}

function displayBestScores() {
    const bestScoresList = document.querySelector('.bestScoresList');
    bestScoresList.innerHTML = '';

    storedScores.slice(0, 3).forEach((score, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1} place : ${score} points`;
        bestScoresList.appendChild(listItem);
    });
}

document.querySelector('.bestResult').addEventListener('click', function() {
    const modal = document.querySelector('.best');
    modal.classList.remove('is-hidden'); 
    displayBestScores();
    isPaused = false;
    togglePauseGame();
});