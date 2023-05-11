const Player = (name, marker) => {
    return {name, marker};
};

const _grid = document.querySelector('.grid');
const _message = document.querySelector('.message');
const _result = document.querySelector('.result');
const _popup = document.querySelector('.popup');
const _overlay = document.querySelector('.overlay');

const gameboard = (() => {
    let board = [];

    const getBoard = () => board;

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
                if (!game.checkWinner()) {
                    if (game.getChances() == 0) {
                        game.declareTie();
                    } else {
                        game.alertNextPlayer();
                        game.nextPlayer();
                    }
                }
            });
            _grid.appendChild(btn);
        }
    };

    return {init, getBoard};
})();

const game = (() => {

    const player1 = Player('Player 1', 'x');
    const player2 = Player('Player 2', 'o');

    let chances = 9;
    let activePlayer = player1;

    const getPlayer = () => activePlayer;
    const getChances = () => chances;
    const updateChances = () => chances--;

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

    const checkWinner = () => {
        winningAxes.forEach((item, index) => {
            if (gameboard.getBoard()[item[0]] === activePlayer.marker &&
                gameboard.getBoard()[item[1]] === activePlayer.marker &&
                gameboard.getBoard()[item[2]] === activePlayer.marker) {
                    _result.textContent = `${activePlayer.name} wins`;
                    _popup.style.display = 'block';
                    _overlay.style.display = 'block';
                return true;
            }
        });
        return false;
    };

    return {
        init,
        getPlayer,
        getChances,
        updateChances,
        alertNextPlayer,
        nextPlayer,
        declareTie,
        checkWinner
    }
})();

gameboard.init();

const _restart = document.querySelector('.restart');
_restart.addEventListener('click', (event) => {
    _popup.style.display = 'none';
    _overlay.style.display = 'none';
    game.init();
});
