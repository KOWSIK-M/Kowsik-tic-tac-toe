document.addEventListener('DOMContentLoaded', () => {
    const chooseSideContainer = document.getElementById('choose-side-container');
    const chooseModeContainer = document.getElementById('choose-mode-container');
    const chooseDiffContainer = document.getElementById('choose-difficulty-container');
    const gameContainer = document.getElementById('game-container');
    const boardContainer = document.getElementById('board');
    const chooseXBtn = document.getElementById('choose-x');
    const chooseOBtn = document.getElementById('choose-o');
    const singlePlayerBtn = document.getElementById('single-player');
    const multiplayerBtn = document.getElementById('multiplayer');
    const backSide = document.getElementById('back-side');
    const backMode = document.getElementById('back-mode');
    const backDiff = document.getElementById('back-diff');
    const easyBtn = document.getElementById('easy');
    const mediumBtn = document.getElementById('medium');
    const hardBtn = document.getElementById('hard');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const homeButton1 = document.getElementById('home1');
    const homeButton2 = document.getElementById('home2');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const playAgainButton = document.getElementById('play-again');
    const playerXScore = document.getElementById('player-x-score');
    const playerOScore = document.getElementById('player-o-score');
    const drawsCount = document.getElementById('draws-count');
    const modalStatus = document.getElementById('modal-status');
    
    let currentPlayer = 'X';
    let board = [];
    let isSinglePlayer = false;
    let boardSize = 3;
    let winningCombinations = [];
    
    backSide.addEventListener('click', () => {
        chooseSideContainer.style.display = 'block';
        chooseModeContainer.style.display = 'none';
    });

    backMode.addEventListener('click', () => {
        chooseModeContainer.style.display = 'block';
        chooseDiffContainer.style.display = 'none';
    });

    backDiff.addEventListener('click', () => {
        chooseDiffContainer.style.display = 'block';
        gameContainer.style.display = 'none';
    });

    chooseXBtn.addEventListener('click', () => {
        currentPlayer = 'X';
        chooseSideContainer.style.display = 'none';
        chooseModeContainer.style.display = 'block';
    });

    chooseOBtn.addEventListener('click', () => {
        currentPlayer = 'O';
        chooseSideContainer.style.display = 'none';
        chooseModeContainer.style.display = 'block';
    });

    singlePlayerBtn.addEventListener('click', () => {
        isSinglePlayer = true;
        chooseModeContainer.style.display = 'none';
        chooseDiffContainer.style.display = 'block';
    });

    multiplayerBtn.addEventListener('click', () => {
        isSinglePlayer = false;
        chooseModeContainer.style.display = 'none';
        chooseDiffContainer.style.display = 'block';
    });

    easyBtn.addEventListener('click', () => {
        boardSize = 3;
        startGame();
    });

    mediumBtn.addEventListener('click', () => {
        boardSize = 5;
        startGame();
    });

    hardBtn.addEventListener('click', () => {
        boardSize = 7;
        startGame();
    });
    homeButton1.addEventListener('click',() => {
        location.reload();
    });

    homeButton2.addEventListener('click',() => {
        location.reload();
    });

    resetButton.addEventListener('click', resetGame);
    closeModal.addEventListener('click', closeModalBox);
    playAgainButton.addEventListener('click', resetGame);

    function startGame() {
        generateBoard(boardSize);
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        gameContainer.style.display = 'block';
        chooseDiffContainer.style.display = 'none';
    }

    function generateBoard(size) {
        boardContainer.innerHTML = '';
        boardContainer.setAttribute('data-size', size);
        board = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.index = `${i}-${j}`;
                cell.addEventListener('click', handleCellClick);
                boardContainer.appendChild(cell);
                row.push(cell);
            }
            board.push(row);
        }
        calculateWinningCombinations(size);
    }
    

    function handleCellClick(event) {
        const cell = event.target;
        if (cell.textContent !== '') return;

        cell.textContent = currentPlayer;
        if (checkWinner()) {
            endGame(false);
        } else if (board.flat().every(cell => cell.textContent !== '')) {
            endGame(true);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
            if (isSinglePlayer && currentPlayer === 'O') {
                setTimeout(aiMove, 500);
            }
        }
    }

    function aiMove() {
        const emptyCells = board.flat().filter(cell => cell.textContent === '');
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.textContent = 'O';
        if (checkWinner()) {
            endGame(false);
        } else if (board.flat().every(cell => cell.textContent !== '')) {
            endGame(true);
        } else {
            currentPlayer = 'X';
            statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function calculateWinningCombinations(size) {
        winningCombinations = [];
        
        // Rows and Columns
        for (let i = 0; i < size; i++) {
            const row = [];
            const col = [];
            for (let j = 0; j < size; j++) {
                row.push(`${i}-${j}`);
                col.push(`${j}-${i}`);
            }
            winningCombinations.push(row);
            winningCombinations.push(col);
        }

        // Diagonals
        const diagonal1 = [];
        const diagonal2 = [];
        for (let i = 0; i < size; i++) {
            diagonal1.push(`${i}-${i}`);
            diagonal2.push(`${i}-${size - 1 - i}`);
        }
        winningCombinations.push(diagonal1);
        winningCombinations.push(diagonal2);
    }

    function checkWinner() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                const [i, j] = index.split('-').map(Number);
                return board[i][j].textContent === currentPlayer;
            });
        });
    }

    function endGame(isDraw) {
        if (isDraw) {
            modalStatus.textContent = "It's a draw!";
            drawsCount.textContent = parseInt(drawsCount.textContent) + 1;
        } else {
            modalStatus.textContent = `Player ${currentPlayer} wins!`;
            if (currentPlayer === 'X') {
                playerXScore.textContent = parseInt(playerXScore.textContent) + 1;
            } else {
                playerOScore.textContent = parseInt(playerOScore.textContent) + 1;
            }
        }
        modal.style.display = 'block';
    }

    function resetGame() {
        board.flat().forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        modal.style.display = 'none';
    }

    function closeModalBox() {
        modal.style.display = 'none';
    }

    function goHome() {
        modal.style.display = 'none';
        gameContainer.style.display = 'none';
        chooseModeContainer.style.display = 'none';
        chooseSideContainer.style.display = 'block';
    }
});
