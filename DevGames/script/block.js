document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const statusEL = document.getElementById("status");
    const resetBtn = document.getElementById("reset");
    let paddle, ball, blocks, gameOver, win;
    const paddleWidth = 80;
    const paddleHeight = 12;
    const ballRadius = 8;
    const blockRows = 4;
    const blockCols = 7;
    const blockWidth = 50;
    const blockHeight = 20;
    const blockGap = 5;

    function initGame(){
        gameOver = false;
        win = false;
        paddle = {
            x: canvas.width / 2 - paddleWidth / 2,
            y: canvas.height - 40,
            speed: 6
        };
        ball = {
            x: canvas.width / 2,
            y: canvas.height - 60,
            dx: 3,
            dy: -3
        };
        blocks = [];
        for(let r = 0; r < blockRows; r++){
            const row = [];
            for(let c = 0; c < blockCols; c++){
                row.push({
                    x: c * (blockWidth + blockGap) + 20,
                    y: r * (blockHeight + blockGap) + 20,
                    alive: true
                });
            }
            blocks.push(row);
        }
        statusEL.textContent = "Break all blocks!";
        requestAnimationFrame(gameLoop);
    }
    document.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        paddle.x = mouseX - paddleWidth / 2;
        paddle.x = Math.max(0, Math.min(canvas.width - paddleWidth, paddle.x));
    });

    function drawPaddle(){
        ctx.fillStyle = "#2020e8";
        ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
    }

    function drawBall(){
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#ea0707";
        ctx.fill();
        ctx.closePath();
    }

    function drawBlocks(){
        ctx.fillStyle = "#de9503";
        for(let r = 0; r < blockRows; r++){
            for(let c = 0; c < blockCols; c++){
                const b = blocks[r][c];
                if(b.alive){
                    ctx.fillRect(b.x, b.y, blockWidth, blockHeight);
                }
            }
        }
    }

    function updateBall(){
        ball.x += ball.dx;
        ball.y += ball.dy;

        if(ball.x < ballRadius || ball.x > canvas.width - ballRadius){
            ball.dx *= -1;
        }
        if(ball.y < ballRadius){
            ball.dy *= -1;
        }
        if(ball.y + ballRadius >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddleWidth){
            ball.dy *= -1;
        }
        if(ball.y > canvas.height){
            gameOver = true;
            statusEL.textContent = "Game Over!";
        }

        for(let r = 0; r < blockRows; r++){
            for(let c = 0; c < blockCols; c++){
                const b = blocks[r][c];
                if(b.alive){
                    if(ball.x > b.x &&ball.x < b.x + blockWidth &&ball.y - ballRadius < b.y + blockHeight &&ball.y + ballRadius > b.y){
                        b.alive = false;
                        ball.dy *= -1;
                    }
                }
            }
        }
        if(blocks.flat().every(b => !b.alive)){
            win = true;
            statusEL.textContent = "You Win!";
        }
    }

    function gameLoop(){
        if (gameOver || win) {return;}
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle();
        drawBall();
        drawBlocks();
        updateBall();
        requestAnimationFrame(gameLoop);
    }

    resetBtn.addEventListener("click", initGame);
    initGame();
});
