"user strict";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let outputDiv = document.querySelector("#output");
let textarea = document.querySelector("textarea#text")
let buttonClear = document.querySelector("#clearText")
let buttonGenerate = document.querySelector("#generate");

buttonClear.addEventListener("click", function() {
	textarea.value = ""
})
buttonGenerate.addEventListener("click", generate);

let board = [];
let boardWidth = 10;
let boardHeight = 10;
let letterSpace = 30;

function random(to, from) {
  if (from == undefined) from = 0;

  let rangeLength = to - from;

  return Math.floor(Math.random() * rangeLength) + from;
}

function configureBoard() {
  for (let w = 0; w < boardWidth; w++) {
    board.push([]);

    for (let h = 0; h < boardHeight; h++) {
      board[w].push(null);
    }
  }
}

function generate() {
  configureBoard();
  
  // Get the words from textarea
  let string = textarea.value.toUpperCase()
  let words = string.split(/[\s,\.]+/)
  
  for (let word of words) putWordOnBoard(word);
  fillSpaces()

  updateCanvas(board);
}

function putWordOnBoard(word) {
  let taskFailed;
  let taskAttempts = 0;
  let maxAttempts = 10;

  // Attempt to put word
  do {
    // Update task config
    taskFailed = false;
    taskAttempts++;

    let positionStyle = [
      "vertical",
      "horizontal",
      "diagonal-up",
      "diagonal-down",
    ][Math.floor(Math.random() * 4)];
    let positionX;
    let positionY;
    let reverse = Boolean(Math.floor(Math.random() * 2));

    // Position horizontally
    if (positionStyle == "vertical") positionX = random(boardWidth);
    else positionX = random(boardWidth - word.length);
    // Position vertically
    if (positionStyle == "horizontal") positionY = random(boardWidth);
    else positionY = random(boardHeight - word.length);

    if (positionStyle == "diagonal-up") positionY += word.length;

    // Generate each letter object
    let letters = [];
    for (let i in word) {
      i = Number(i);
      let letter = word[i];
      let x = positionX;
      let y = positionY;

      if (positionStyle != "vertical") x += i;
      if (positionStyle != "horizontal" && positionStyle != "diagonal-up") y += i;
      else if (positionStyle == "diagonal-up") y -= i;

      // Abort if the word overlap another
      if (board[x][y] && board[x][y].letter != letter) {
        taskFailed = true;
        break;
      }

      let letterObj = {
        letter: letter,
        from: word,
        x: x,
        y: y,
      };
      letters.push(letterObj);
    }
    if (taskFailed) continue;

    // Put letters on board
    for (let letterObj of letters) {
      let x = letterObj.x;
      let y = letterObj.y;

      board[x][y] = letterObj;
    }
  } while (taskFailed && taskAttempts < maxAttempts);

  // Gave up putting word ?
  if (taskFailed && taskAttempts >= maxAttempts)
    console.log('gave up putting the word "' + word + '"');
}
function fillSpaces() {
  const alphabet = [
    "A",
    "A",
    "B",
    "C",
    "Ç",
    "D",
    "E",
    "E",
    "F",
    "G",
    "H",
    "I",
    "I",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  for (let x in board) {
    for (let y in board[x]) {
      if (!board[x][y]) {
        board[x][y] = {
          letter: alphabet[random(alphabet.length)],
          x: x,
          y: y,
        };
      }
    }
  }
}

function drawSpaces() {
  ctx.strokeStyle = "black";

  ctx.beginPath();
  for (let i = 0; i < boardWidth; i++) {
    let posX = i * letterSpace;
    ctx.moveTo(posX, 0);
    ctx.lineTo(posX, canvas.height);

    let posY = i * letterSpace;
    ctx.moveTo(0, posY);
    ctx.lineTo(canvas.width, posY);
  }

  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();
}
function updateCanvas() {
  canvas.width = boardWidth * letterSpace;
  canvas.height = boardHeight * letterSpace;

  ctx.fillStyle = "#e4e4e4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawSpaces();
  for (let w in board) {
    for (let h in board[w]) {
      if (board[w][h]) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillStyle = "black";

        let letterObj = board[w][h];
        let letterString = letterObj.letter;
        let textWidth = ctx.measureText(letterString).width;
        let x = letterObj.x * letterSpace + letterSpace / 2; // - textWidth;
        let y = letterObj.y * letterSpace + letterSpace / 2;

        ctx.fillText(letterString, x, y);
      }
    }
  }
}

configureBoard();
updateCanvas();
