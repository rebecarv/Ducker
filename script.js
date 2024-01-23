// Select the relevant elements from the HTML
const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainBtn = document.querySelector('.play-again');

const gridMatrix = [
    ['', '', '', '', '', '', '', '', ''],
  [
    'river',
    'wood',
    'wood',
    'river',
    'wood',
    'river',
    'river',
    'river',
    'river',
  ],
  ['river', 'river', 'river', 'wood', 'wood', 'river', 'wood', 'wood', 'river'],
  ['', '', '', '', '', '', '', '', ''],
  ['road', 'bus', 'road', 'road', 'road', 'car', 'road', 'road', 'road'],
  ['road', 'road', 'road', 'car', 'road', 'road', 'road', 'road', 'bus'],
  ['road', 'road', 'car', 'road', 'road', 'road', 'bus', 'road', 'road'],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
]

// Initialize variables that control the game "settings"
const victoryRow = 0;
const riverRows = [1, 2];
const roadRows = [4, 5, 6];
const duckPosition = { x: 4, y: 8 };
let contentBeforeDuck = '';
let time = 15;

function drawGrid() {
    grid.innerHTML = '';

    gridMatrix.forEach(function (gridRow, gridRowIndex) {
     gridRow.forEach(function(cellContent, cellContentIndex) {
        // Given the current grid row, create a cell for the grid in the game based on the cellContent
        //<div></div>
        const cellDiv = document.createElement('div');

        //<div class="cell"></div>
        cellDiv.classList.add('cell');

        //[1, 2]
        if (riverRows.includes(gridRowIndex)) {
         cellDiv.classList.add('river');
        //[4, 5, 6]
        } else if (roadRows.includes(gridRowIndex)) {
         cellDiv.classList.add('road');
        }
       
        //'' --> "falsy" | 'river', 'road', 'car', 'wood' --> "truthy"
        if(cellContent) {
          cellDiv.classList.add(cellContent);
        }

        grid.appendChild(cellDiv);
        });
    });
}

function placeDuck() {
    contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];
    gridMatrix[duckPosition.y][duckPosition.x] = 'duck';
    //gridMatrix[8][4]
    //gridMatrix[8] -->  ['', '', '', '', '', '', '', '', '']
    //gridMatrix[8][4] -->  ['', '', '', '', 'duck', '', '', '', ''],
} 

function moveDuck(event) {
    const key = event.key;
    console.log('key', key);
    console.log('contentBeforeDuck', contentBeforeDuck)
    gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

    switch(key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
         if (duckPosition.y > 0) duckPosition.y--;
         break;
        case 'ArrowDown':
        case 's':
        case 'S':
         if (duckPosition.y < 8) duckPosition.y++;
         break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
         if (duckPosition.x > 0) duckPosition.x--;
         break;
        case 'ArrowRight':
        case 'd':
        case 'D':
         if (duckPosition.x < 8) duckPosition.x++;
         break;
    }

    render();
}

//Animation Functions
function moveRight(gridRowIndex) {
    const currentRow = gridMatrix[gridRowIndex];
    const lastElement = currentRow.pop();
    currentRow.unshift(lastElement);
}

function moveLeft(gridRowIndex) {
    const currentRow = gridMatrix[gridRowIndex];
    const firstELement = currentRow.shift();
    currentRow.push(firstELement);
}


function animateGame() {
//Animated River:
    moveRight(1);
    moveLeft(2);

//Animated Road:
    moveRight(4);
    moveRight(5);
    moveRight(6);
}

function updateDuckPosition () {
    gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

    if(contentBeforeDuck === 'wood') {
      if(duckPosition.y === 1 && duckPosition.x < 8) duckPosition.x++;
      else if(duckPosition.y === 2 && duckPosition.x > 0) duckPosition.x--;
    }
}

function checkPosition() {
    if(duckPosition.y === victoryRow) endGame('duck-arrived');
    else if (contentBeforeDuck === 'river') endGame('duck-drowned');
    else if (contentBeforeDuck === 'car' || contentBeforeDuck === 'bus') endGame('duck-hit');
}

//Game Win/Loss Logic
function endGame(reason) {
// Victory
if (reason === 'duck-arrived') {
    endGameText.innerHTML = 'YOU<br>WIN!';
    endGameScreen.classList.add('win');
}

gridMatrix[duckPosition.y][duckPosition.x] = reason;

// Stop the countdown timer
    clearInterval(countdownLoop);
// Stop the game loop
    clearInterval(renderLoop);
// Stop the player from being able to move the duck
   document.removeEventListener('keyup', moveDuck);
// Display the Game Over screen
   endGameScreen.classList.remove('hidden');
}

function countdown() {
 if(time !==0) {
     time--;
    timer.innerText = time.toString().padStart(5, '0');
 }  
if (time === 0) {
 endGame();
}
}

//Rendering
function render() {
placeDuck();
checkPosition();
drawGrid();
}

const renderLoop = setInterval(function () {
    updateDuckPosition();
    animateGame();
    render();
}, 600);

const countdownLoop = setInterval(countdown, 1000);

document.addEventListener('keyup', moveDuck);
playAgainBtn.addEventListener('click', function() {
    location.reload();
})