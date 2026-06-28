// Water Drop Dash
// This game uses basic DOM selection, event listeners, setInterval, and simple functions.

// Game settings
const GOAL_DROPS = 20;
const GAME_TIME = 30;
const BUCKET_MOVE = 35;

// Game state variables
let score = 0;
let timeLeft = GAME_TIME;
let gameActive = false;
let bucketX = 0;
let spawnInterval;
let timerInterval;
let collisionInterval;

// HTML elements
const scoreDisplay = document.getElementById('score');
const goalDisplay = document.getElementById('goal');
const timerDisplay = document.getElementById('timer');
const message = document.getElementById('message');
const gameArea = document.getElementById('game-area');
const bucket = document.getElementById('bucket');
const startButton = document.getElementById('start-game');
const resetButton = document.getElementById('reset-game');
const leftButton = document.getElementById('move-left');
const rightButton = document.getElementById('move-right');

// End-game messages. The game randomly picks one when the game ends.
const winningMessages = [
  'You reached the goal! Every clean drop helps tell the story of safe water.',
  'Great job! You collected enough clean water drops to win the game.',
  'Mission complete! Clean water can support health, school, and opportunity.'
];

const losingMessages = [
  'Good try! You were close. Play again and collect more clean drops.',
  'Time ran out, but you can try again and beat your score.',
  'Keep going! Clean water is worth the effort.'
];

// Show the goal number on the page
goalDisplay.textContent = GOAL_DROPS;

// Places the bucket in the middle before each game starts
function resetBucket() {
  bucketX = (gameArea.offsetWidth - bucket.offsetWidth) / 2;
  bucket.style.left = bucketX + 'px';
  bucket.style.marginLeft = '0';
}

// Updates the score and timer text on the page
function updateStats() {
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
}

// Changes the message box text and style
function showMessage(text, className) {
  message.textContent = text;
  message.className = 'message';

  if (className) {
    message.classList.add(className);
  }
}

// Removes all falling drops and confetti pieces from the game area
function clearGameArea() {
  const items = document.querySelectorAll('.falling-item, .confetti-piece');

  items.forEach(function(item) {
    item.remove();
  });
}

// Moves the bucket left or right
function moveBucket(direction) {
  if (!gameActive) return;

  bucketX = bucketX + direction;

  if (bucketX < 0) {
    bucketX = 0;
  }

  if (bucketX > gameArea.offsetWidth - bucket.offsetWidth) {
    bucketX = gameArea.offsetWidth - bucket.offsetWidth;
  }

  bucket.style.left = bucketX + 'px';
}

// Creates one falling drop
function createDrop() {
  if (!gameActive) return;

  const drop = document.createElement('div');
  const isDirty = Math.random() < 0.25; // 25% of drops are dirty

  drop.className = 'falling-item';

  if (isDirty) {
    drop.classList.add('dirty-drop');
    drop.textContent = '🟤';
    drop.dataset.type = 'dirty';
  } else {
    drop.classList.add('clean-drop');
    drop.textContent = '💧';
    drop.dataset.type = 'clean';
  }

  const maxLeft = gameArea.offsetWidth - 42;
  const randomLeft = Math.floor(Math.random() * maxLeft);
  drop.style.left = randomLeft + 'px';

  gameArea.appendChild(drop);

  // Remove the drop when it reaches the bottom
  drop.addEventListener('animationend', function() {
    drop.remove();
  });
}

// Checks if two elements are touching each other
function isTouching(elementOne, elementTwo) {
  const rectOne = elementOne.getBoundingClientRect();
  const rectTwo = elementTwo.getBoundingClientRect();

  return !(
    rectOne.right < rectTwo.left ||
    rectOne.left > rectTwo.right ||
    rectOne.bottom < rectTwo.top ||
    rectOne.top > rectTwo.bottom
  );
}

// Checks whether the bucket caught any falling drops
function checkCollisions() {
  if (!gameActive) return;

  const drops = document.querySelectorAll('.falling-item');

  drops.forEach(function(drop) {
    if (isTouching(drop, bucket)) {
      if (drop.dataset.type === 'clean') {
        score = score + 1;
        showMessage('Nice catch! +1 clean water drop.', 'good-feedback');
      } else {
        score = score - 2;

        if (score < 0) {
          score = 0;
        }

        showMessage('Oops! Dirty water drop. -2 points.', 'bad-feedback');
      }

      updateStats();
      drop.remove();
    }
  });
}

// Starts the countdown timer
function startTimer() {
  timerInterval = setInterval(function() {
    timeLeft = timeLeft - 1;
    updateStats();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Creates a simple confetti effect when the player wins
function showConfetti() {
  const colors = ['#FFC907', '#2E9DF7', '#4FCB53', '#FF902A', '#F5402C'];

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const randomLeft = Math.floor(Math.random() * gameArea.offsetWidth);
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    piece.style.left = randomLeft + 'px';
    piece.style.backgroundColor = randomColor;

    gameArea.appendChild(piece);

    // Remove the confetti after the animation finishes
    piece.addEventListener('animationend', function() {
      piece.remove();
    });
  }
}

// Starts a new game
function startGame() {
  if (gameActive) return;

  score = 0;
  timeLeft = GAME_TIME;
  gameActive = true;

  updateStats();
  resetBucket();
  clearGameArea();
  showMessage('Game started! Catch clean drops and avoid dirty drops.', '');

  startButton.disabled = true;
  startButton.textContent = 'Game Running...';

  createDrop();
  spawnInterval = setInterval(createDrop, 650);
  collisionInterval = setInterval(checkCollisions, 50);
  startTimer();
}

// Ends the game and shows a win or try-again message
function endGame() {
  gameActive = false;

  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  clearInterval(collisionInterval);

  clearGameArea();

  startButton.disabled = false;
  startButton.textContent = 'Play Again';

  if (score >= GOAL_DROPS) {
    const randomIndex = Math.floor(Math.random() * winningMessages.length);
    showMessage(winningMessages[randomIndex] + ' Final score: ' + score + '.', 'win');
    showConfetti();
  } else {
    const randomIndex = Math.floor(Math.random() * losingMessages.length);
    showMessage(losingMessages[randomIndex] + ' Final score: ' + score + '.', 'lose');
  }
}

// Resets the game without showing a win or losing message
function resetGame() {
  gameActive = false;

  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  clearInterval(collisionInterval);

  score = 0;
  timeLeft = GAME_TIME;

  updateStats();
  resetBucket();
  clearGameArea();

  startButton.disabled = false;
  startButton.textContent = 'Start Game';
  showMessage('Game reset. Press Start Game to begin again.', '');
}

// Button controls
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

leftButton.addEventListener('click', function() {
  moveBucket(-BUCKET_MOVE);
});

rightButton.addEventListener('click', function() {
  moveBucket(BUCKET_MOVE);
});

// Keyboard controls
window.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
    moveBucket(-BUCKET_MOVE);
  }

  if (event.key === 'ArrowRight') {
    moveBucket(BUCKET_MOVE);
  }
});

// Set starting display
updateStats();
resetBucket();

// Keep the bucket inside the game area if the screen size changes
window.addEventListener('resize', resetBucket);
