const Player = (name, marker) => {
    return {name, marker};
};

const _grid = document.querySelector('.grid');
const _message = document.querySelector('.message');
const _result = document.querySelector('.result');
const _popup = document.querySelector('.popup');
const _overlay = document.querySelector('.overlay');
const _restart = document.querySelector('.restart');
const _option = document.querySelector('.option');
const _player = document.querySelector('.player');
const _computer = document.querySelector('.computer');

const gameboard = (() => {
    let board = [];

    const getBoard = () => board;
    const boardValue = (index, val) => board[index] = val;

    const updateboard = (index, val) => {
        board[index] = val;

        Array.from(_grid.children)[index].textContent = val;

        game.updateChances();
        if (!game.checkWinner(game.getPlayer())) {
            if (game.getChances() == 0) {
                game.declareTie();
            } else {
                game.alertNextPlayer();
                game.nextPlayer();
            }
        } else {
            _result.textContent = `${game.getPlayer().name} wins`;
            _popup.style.display = 'block';
            _overlay.style.display = 'block';
        }
    };

    const init = () => {
        board = [];

         _grid.innerHTML = '';

        for (let index = 0; index < 9; index++) {
            board.push('');
            const btn = document.createElement('button');
            btn.className = 'btn';
                btn.addEventListener('click', (event) => {

                if (board[index] !== '')
                    return;

                board[index] = game.getPlayer().marker;
                event.target.textContent = game.getPlayer().marker;
                game.updateChances();
                if (!game.checkWinner(game.getPlayer())) {
                    if (game.getChances() == 0) {
                        game.declareTie();
                    } else {
                        game.alertNextPlayer();
                        game.nextPlayer();
                        if (game.getMode() === 'computer')
                            game.makeComputerMove();
                    }
                } else {
                    _result.textContent = `${game.getPlayer().name} wins`;
                    _popup.style.display = 'block';
                    _overlay.style.display = 'block';
                }
            });
            _grid.appendChild(btn);
        }
    };

    return {init, getBoard, updateboard, boardValue};
})();

const game = (() => {

    const player1 = Player('Player 1', 'x');
    const player2 = Player('Player 2', 'o');
    let mode = '';

    let chances = 9;
    let activePlayer = player1;


    _restart.addEventListener('click', (event) => {
        _popup.style.display = 'none';
        _overlay.style.display = 'none';
        game.init();
    });

    _player.addEventListener('click', (event) => {
        mode = 'player';
        _option.style.display = 'none';
    });

    _computer.addEventListener('click', (event) => {
        mode = 'computer';
        _option.style.display = 'none';
    });

    const getPlayer = () => activePlayer;
    const getChances = () => chances;
    const updateChances = () => chances--;
    const getMode = () => mode;

    const init = () => {
        gameboard.init();
        chances = 9;
        activePlayer = player1;
        _message.textContent = player1.name + ' turn'; 
    };

    const winningAxes = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    const alertNextPlayer = () => {
        _message.textContent = (activePlayer === player1 ? 
            player2.name : player1.name) + ' turn'; 
    };

    const declareTie = () => {
        _result.textContent = 'Draw game';
        _popup.style.display = 'block';
        _overlay.style.display = 'block';
    };

    const nextPlayer = () => {
        activePlayer = (activePlayer === player1 ?  player2 : player1);
    };

    const checkWinner = (player) => {
        let win = false;
        winningAxes.forEach((item, index) => {
            if (gameboard.getBoard()[item[0]] === player.marker &&
                gameboard.getBoard()[item[1]] === player.marker &&
                gameboard.getBoard()[item[2]] === player.marker) {
                win = true;
            }
        });
        return win;
    };

    function miniMax(maximise) {
        if (checkWinner(player2))
            return 1;
        else if (checkWinner(player1))
            return -1;
        else if (chances == 0)
            return 0;
        
        if (maximise) {
            let max = -Infinity;
            for (let index = 0; index < 9; index++) {
                if (gameboard.getBoard()[index] === '') {
                    chances--;
                    gameboard.boardValue(index, player2.marker);
                    let val = miniMax(false);
                    chances++;
                    gameboard.boardValue(index, '');
                    
                    max = Math.max(val, max);
                }
            }
            return max;
        } else {
            let min = Infinity;
            for (let index = 0; index < 9; index++) {
                if (gameboard.getBoard()[index] === '') {
                    chances--;
                    gameboard.boardValue(index, player1.marker);
                    let val = miniMax(true);
                    chances++;
                    gameboard.boardValue(index, '');
                    
                    min = Math.min(val, min);
                }
            }
            return min;
        }
    }

    const makeComputerMove = () => {
        let max = -Infinity;
        let desiredIndex = -1;

        for (let index = 0; index < 9; index++) {
            if (gameboard.getBoard()[index] === '') {

                gameboard.boardValue(index, player2.marker);
                chances--;
                let val = miniMax(false);
                chances++;
                gameboard.boardValue(index, '');
                if (val > max) {
                    max = val;
                    desiredIndex = index;
                }
            }
        }
        gameboard.updateboard(desiredIndex, player2.marker);
    };

    return {
        getMode,
        init,
        getPlayer,
        getChances,
        updateChances,
        alertNextPlayer,
        nextPlayer,
        declareTie,
        checkWinner,
        makeComputerMove
    }
})();

gameboard.init();