const ROWS = 6;
const COLS = 7;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentPlayer = "red";
let gameActive = true;

const status = document.getElementById("status");
const boardElement = document.getElementById("board");
const resetButton = document.getElementById("reset");

// 🎨 Create board UI dynamically
function createBoard() {
    boardElement.innerHTML = ""; // Clear previous board
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", handleMove);
            boardElement.appendChild(cell);
        }
    }
}

// 🔄 Find the lowest available row in a column
function findAvailableRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) return row;
    }
    return -1;
}

// 🎯 Handle player move
function handleMove(event) {
    if (!gameActive) return;

    let col = parseInt(event.target.dataset.col);
    let row = findAvailableRow(col);
    if (row === -1) return; // Column is full

    board[row][col] = currentPlayer; // Update board
    updateBoardUI(); // Update UI

    if (checkWin(row, col)) {
        status.innerText = `${currentPlayer.toUpperCase()} Wins! 🎉`;
        gameActive = false;
        return;
    }

    if (isBoardFull()) {
        status.innerText = "It's a Draw!";
        gameActive = false;
        return;
    }

    // Switch Player
    currentPlayer = currentPlayer === "red" ? "yellow" : "red";
    status.innerText = `${currentPlayer.toUpperCase()}'s Turn`;
}

// 🔎 Check if a player has won
function checkWin(row, col) {
    return checkDirection(row, col, 1, 0) ||  // Vertical
           checkDirection(row, col, 0, 1) ||  // Horizontal
           checkDirection(row, col, 1, 1) ||  // Diagonal /
           checkDirection(row, col, 1, -1);   // Diagonal \
}

// ➡️ Check a specific direction for 4-in-a-row
function checkDirection(row, col, dr, dc) {
    let color = board[row][col];
    let count = 1; // Start with current piece

    // Check forward direction
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === color) {
        count++;
        r += dr;
        c += dc;
    }

    // Check backward direction
    r = row - dr, c = col - dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === color) {
        count++;
        r -= dr;
        c -= dc;
    }

    return count >= 4; // Win if 4 or more connected
}

// 🔥 Check if board is full (Draw)
function isBoardFull() {
    return board.every(row => row.every(cell => cell));
}

// 🎨 Update UI based on board state
function updateBoardUI() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            let cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
            cell.classList.remove("red", "yellow");
            if (board[row][col]) {
                cell.classList.add(board[row][col]);
            }
        }
    }
}

// 🔄 Restart Game
function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = "red";
    gameActive = true;
    status.innerText = "Red's Turn";
    
    createBoard();  // Clears & redraws board
}

// 🏁 Start Game
createBoard();
resetButton.addEventListener("click", resetGame);
