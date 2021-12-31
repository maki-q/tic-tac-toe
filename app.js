var currentTurn = 'X';
var player = {};
var board = {};
var scores = {p1: 0, tie: 0, p2: 0};
var winningSection = [];
var currentlyPlaying = false;
var gravity = {
  0: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
  90: [[9, 8, 7], [6, 5, 4], [3, 2, 1]],
  180: [[3, 6, 9], [2, 5, 8], [1, 4, 7]],
  270: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
}
var rotation = 0;


// INITIALIZATION
function initializeGame() {
  buildBoard();
  resetScores();
}

function startGame() {
  resetGame();
  if(!player.X) {
    player.X = document.getElementById('player-1').value || "Player 1";
    player.O = document.getElementById('player-2').value || "Player 2";
    document.getElementById('scoreboard-p1').innerHTML = player.X;
    document.getElementById('scoreboard-p2').innerHTML = player.O;
  }
  currentlyPlaying = true;
}


function buildBoard() {
  for(let i = 1; i < 10; i++) {
    board[i] = document.getElementById(`${i}`);
  }
}

function resetButton() {
  resetScores();
  resetTitles();
  resetPlayers();
  resetGame();
  resetRotation();
  currentTurn = 'X';
}

function resetGame() {
  for(let square in board) {
    board[square].innerHTML = '';
    board[square].setAttribute("class", "");
  }
  currentlyPlaying = false;
  currentTurn = currentTurn === 'X' ? 'O' : 'X';
  resetWinner();
}

//TURN HANDLING

function handleTurn(id) {
  if(currentlyPlaying) {
    var currentText = id.firstChild.innerHTML;
    if(!currentText) {
      id.firstChild.innerHTML = getCurrentTurn();
      if(getCurrentTurn() === 'X') {
        id.firstChild.setAttribute("class", "X");
      } else {
        id.firstChild.setAttribute("class", "O");
      }
      changeTurn();
    }
  } else {
    resetGame();
    startGame();
    handleTurn(id);
  }
}

function getCurrentTurn() {
  return currentTurn;
}

function changeTurn() {
  checkGameState();
  currentTurn = currentTurn === 'X' ? 'O' : 'X';
}

//GAME LOGIC

function checkGameState() {
  if(checkForWin()) {
    for(let square of winningSection) {
      board[square].setAttribute("class", "winner")
    }
    announceWinner(board[winningSection[0]].innerHTML);
  } else if(noSpaces([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    announceWinner('tie');
  }
}

function checkForWin() {
  var sections = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
  ]
  for(let i = 0; i < sections.length; i++) {
    if(checkSection(sections[i])) {
      winningSection = sections[i];
      return true;
    }
  }
  return false;
}

function checkSection(section) {
  return  noSpaces(section) &&
          board[section[0]].innerHTML === board[section[1]].innerHTML &&
          board[section[1]].innerHTML === board[section[2]].innerHTML;
}

function noSpaces(section) {
  for(let i = 0; i < section.length; i++) {
    if(board[section[i]].innerHTML === '') return false
  }
  return true;
}

//VISUAL ADDITIONS

function announceWinner(winner) {
  currentlyPlaying = false;
  if(winner === 'tie') {
    document.getElementById('announcement').innerHTML = `<p>The game is a tie.</p>`;
    scores.tie += 1;
    document.getElementById('tie-score').innerHTML = convertScoreToTally(scores.tie);
  } else if(winner === 'X') {
    document.getElementById('announcement').innerHTML = `<p>${player[winner]} is the winner!</p>`;
    scores.p1 += 1;
    document.getElementById('p1-score').innerHTML = convertScoreToTally(scores.p1);
  } else {
    document.getElementById('announcement').innerHTML = `<p>${player[winner]} is the winner!</p>`;
    scores.p2 += 1;
    document.getElementById('p2-score').innerHTML = convertScoreToTally(scores.p2);
  }
}

function resetWinner() {
  document.getElementById('announcement').innerHTML = '';
}

function resetPlayers() {
  document.getElementById('player-1').value = '';
  document.getElementById('player-2').value = '';
  player = {};
  scores = {p1: 0, tie: 0, p2: 0};
}

function resetTitles() {
  document.getElementById('scoreboard-p1').innerHTML = "Player 1";
  document.getElementById('scoreboard-p2').innerHTML = "Player 2";
}

function resetScores() {
  var scores = ['p1', 'tie', 'p2'];
  for(var key of scores) {
    document.getElementById(`${key}-score`).innerHTML = 0;
  }
}

function convertScoreToTally(score, winner) {
  var largeTally = Math.floor(score / 5);
  var smallTally = score % 5;
  var fullElement = '';
  var subTally = '';
  while(largeTally > 0) {
    fullElement += '<span class="tally strikethrough">||||</span>';
    largeTally--;
  }
  while(smallTally > 0) {
    subTally += '|';
    smallTally--;
  }
  fullElement += `<span class="tally">${subTally}</span>`;
  return fullElement;
}

function flipBoard() {
  if(currentlyPlaying) {
    rotation += 90;
    document.getElementById('playing-table').style.transform = `rotate(${rotation}deg)`;
    setTimeout(handleGravity, 2000);
  }
}

function resetRotation() {
  while(rotation % 360 !== 0) rotation += 90;
  document.getElementById('playing-table').style.transform = `rotate(${rotation}deg)`;
}

function handleGravity() {
  var state = rotation % 360;
  for(var section of gravity[state]) {
    for(var square = 0; square < section.length; square++) {
      if(!board[section[square]].innerHTML && square + 1 < section.length) {
        if(!board[section[square + 1]].innerHTML && square + 2 < section.length) {
          board[section[square]].innerHTML = board[section[square + 2]].innerHTML;
          board[section[square]].className = board[section[square + 2]].className;
          board[section[square + 2]].innerHTML = '';
          board[section[square + 2]].className = '';
        } else if(board[section[square + 1]].innerHTML) {
          board[section[square]].innerHTML = board[section[square + 1]].innerHTML;
          board[section[square]].className = board[section[square + 1]].className;
          board[section[square + 1]].innerHTML = '';
          board[section[square + 1]].className = '';
        }
      }
    }
  }
  checkGameState();
}





