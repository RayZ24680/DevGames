
const boardEl = document.getElementById('board');
const statusEL = document.getElementById('status');
const resetBtn = document.getElementById('reset');
let board = Array(9).fill(null);
let currentTurn = 'X';
let gameOver = false;
const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function createBoard(){
    boardEl.innerHTML = '';
    board.forEach((v,ind) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = ind;
        cell.addEventListener('click', onCellClick);
        boardEl.appendChild(cell);
    });
    updateStatus();
}

function onCellClick(e){
    if(gameOver) return;

    const ind = e.target.dataset.index;
    
    if(board[ind] !== null) return;

    board[ind] = currentTurn;
    e.target.textContent = currentTurn;

    if(checkWin(currentTurn)){
        statusEL.textContent = `Player ${(currentTurn === 'X') ? 1 : 2} win`;
        gameOver = true;
    }else if(board.every(cell => cell !== null)){
        statusEL.textContent = "TIE!";
        gameOver = true;
    }else{
        currentTurn = currentTurn === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

function checkWin(player){
    return winningCombos.some(combo =>
        combo.every(i => board[i] == player)
    );
}

function updateStatus(){
    statusEL.textContent = `Current turn ${currentTurn === 'X'?'X':'O'}`;
}

function disableBoard(){
    document.querySelectorAll('.cell').forEach(c => c.classList.add('disabled'));
}

function resetGame(){
    board = Array(9).fill(null);
    currentTurn = 'X';
    gameOver = false;
    createBoard();
}

resetBtn.addEventListener('click', resetGame);

createBoard();




