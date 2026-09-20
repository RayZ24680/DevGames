document.addEventListener("DOMContentLoaded", () => {

    const Rows = 10;
    const Cols = 10;
    const Mines = 15;
    const boardEL = document.getElementById("board");
    const statusEL = document.getElementById("status");
    const resetBtn = document.getElementById("reset");
    let board;
    let revealed;
    let flagged;
    let gameOver;

    function initGame(){
        board = Array.from({ length: Rows }, () => Array(Cols).fill(0));
        revealed = Array.from({ length: Rows }, () => Array(Cols).fill(false));
        flagged = Array.from({ length: Rows }, () => Array(Cols).fill(false));
        gameOver = false;
        boardEL.innerHTML = "";
        statusEL.textContent = "Find all mines!";
        placeMines();
        calculateNumbers();
        buildBoard();
    }

    function placeMines(){
        let placed = 0;
        while(placed < Mines){
            let r = Math.floor(Math.random() * Rows);
            let c = Math.floor(Math.random() * Cols);
            if(board[r][c] !== "M"){
                board[r][c] = "M";
                placed++;
            }
        }
    }

    function calculateNumbers(){
        const dirs =[[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];

        for(let r = 0; r < Rows; r++){
            for(let c = 0; c < Cols; c++){
                if(board[r][c] === "M") {continue;}
                let count = 0;
                for(const [dr, dc] of dirs){
                    let nr = r + dr;
                    let nc = c + dc;
                    if(nr >= 0 && nr < Rows && nc >= 0 && nc < Cols){
                        if(board[nr][nc] === "M"){
                            count++;
                        }
                    }
                }
                board[r][c] = count;
            }
        }
    }

    function buildBoard(){
        for(let r = 0; r < Rows; r++){
            for(let c = 0; c < Cols; c++){
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener("click", onLeftClick);
                cell.addEventListener("contextmenu", onRightClick);
                boardEL.appendChild(cell);
            }
        }
    }

    function onLeftClick(e){
        if(gameOver){return};
        const r = parseInt(e.currentTarget.dataset.row);
        const c = parseInt(e.currentTarget.dataset.col);
        if(flagged[r][c]){return};
        reveal(r, c);
        checkWin();
    }

    function onRightClick(e){
        e.preventDefault();
        if(gameOver){return};
        const r = parseInt(e.currentTarget.dataset.row);
        const c = parseInt(e.currentTarget.dataset.col);
        if(revealed[r][c]){return};
        flagged[r][c] = !flagged[r][c];
        updateCell(r, c);
    }

    function reveal(r, c){
        if(revealed[r][c] || flagged[r][c]){return;}
        revealed[r][c] = true;
        if(board[r][c] === "M"){
            gameOver = true;
            revealAllMines();
            statusEL.textContent = "BOOM!";
            return;
        }
        updateCell(r, c);

        if(board[r][c] === 0){
            floodFill(r, c);
        }
    }

    function floodFill(r, c){
        const dirs = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];

        for(const [dr, dc] of dirs){
            let nr = r + dr, nc = c + dc;
            if(nr >= 0 && nr < Rows && nc >= 0 && nc < Cols){
                if(!revealed[nr][nc] && board[nr][nc] !== "M"){
                    reveal(nr, nc);
                }
            }
        }
    }

    function updateCell(r, c){
        const index = r * Cols + c;
        const cell = boardEL.children[index];
        cell.classList.add("revealed");
        if (flagged[r][c]) {
            cell.textContent = "🚩";
            cell.classList.add("flag");
            return;
        }
        cell.classList.remove("flag");
        if (board[r][c] === "M") {
            cell.textContent = "💣";
            cell.classList.add("mine");
        } else if (board[r][c] > 0) {
            cell.textContent = board[r][c];
        } else {
            cell.textContent = "";
        }
    }

    function revealAllMines() {
        for (let r = 0; r < Rows; r++) {
            for (let c = 0; c < Cols; c++) {
                if (board[r][c] === "M") {
                    updateCell(r, c);
                }
            }
        }
    }

    function checkWin() {
        let safeCells = Rows * Cols - Mines;
        let revealedCount = 0;

        for (let r = 0; r < Rows; r++) {
            for (let c = 0; c < Cols; c++) {
                if (revealed[r][c] && board[r][c] !== "M") {
                    revealedCount++;
                }
            }
        }

        if (revealedCount === safeCells) {
            gameOver = true;
            statusEL.textContent = "You Win!";
        }
    }

    resetBtn.addEventListener("click", initGame);
    initGame();
});
