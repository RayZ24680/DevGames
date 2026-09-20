document.addEventListener('DOMContentLoaded', () =>{
    const Rows = 6;
    const Cols = 7;
    const boardEL = document.getElementById("board");
    const statusEL = document.getElementById("status");
    const resetBtn = document.getElementById("reset");
    let board;let currentTurn;let gameOver;let cellEls;

    function initGame(){
        board = Array.from({length : Rows}, () => Array(Cols).fill(0));
        currentTurn = 1;
        gameOver = false;
        statusEL.textContent = "Player 1's turn.";
        boardEL.innerHTML = "";
        cellEls = [];

        for(let r = 0; r < Rows; r++){
            const rCell = [];
            for(let c = 0; c < Cols; c++){
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener("click", onCellClick);
                boardEL.appendChild(cell);
                rCell.push(cell);
            }
            cellEls.push(rCell)
        }
    }

    function onCellClick(e){
        if(gameOver) return;
        
        const col = parseInt(e.currentTarget.dataset.col, 10)
        let currRow = -1;
        for(let r = Rows -1; r >= 0;r--){
            if(board[r][col] === 0){
                currRow = r;
                break;
            }
        }
        if(currRow === -1){
            return;
        }
        board[currRow][col] = currentTurn;
        updateCell(currRow, col);

        if(checkWin(currRow, col, currentTurn)){
            statusEL.textContent = `Player ${currentTurn} wins!`;
            gameOver = true;
            return;
        }
        if(isFull()){
            statusEL.textContent = "DRAW!";
            gameOver = true;
            return;
        }

        currentTurn = currentTurn === 1 ? 2 : 1;
        statusEL.textContent = `Player ${currentTurn}'s turn`;
    }

    function isFull(){
        return board[0].every(cell => cell !== 0);
    }

    function checkWin(row, col, player){
        const dir = [[0,1],[1,0],[1,1],[1,-1]];

        for(const[dr,dc] of dir){
            let count = 1;
            count += countInDirection(row,col,dr,dc,player);
            count += countInDirection(row, col, -dr, -dc, player);
            if(count >= 4){
                return true;
            }
        }
        return false;
    }

    function countInDirection(row, col ,dr, dc, player){
        let r = row + dr;
        let c = col + dc;
        let count = 0;

        while((r >= 0) && (r < Rows) && (c >= 0) && (c < Cols) && (board[r][c] === player)){
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }
    function updateCell(row, col) {
        const cell = cellEls[row][col];
        const player = board[row][col];

        if (player === 1) {
            cell.classList.add("player1");
        } else if (player === 2) {
            cell.classList.add("player2");
        }
    }


    resetBtn.addEventListener("click", initGame);
    initGame();
});