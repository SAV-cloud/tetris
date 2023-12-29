export const PLAYFIELD_COLUMNS = 10;
export const PLAYFIELD_ROWS = 20;
export const NEXT_TETRO_COLUMNS = 6;
export const NEXT_TETRO_ROWS = 3;

export const TETROMINO_NAMES = [
    'O',
    'L',
    'J',
    'S',
    'Z',
    'T',
    'I'
];

export const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    "J": [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    I: [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
    ]
};

export const btnRestart = document.querySelector('.restart')
export const storedScores = JSON.parse(localStorage.getItem('bestScores')) || [0, 0, 0];
export const btnRestart2 = document.querySelector('.restart2');
export const btnPause = document.querySelector('.pause');
export const btnStart = document.querySelector('.start');