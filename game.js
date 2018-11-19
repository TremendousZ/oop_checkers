

function startApp(){
    var game = new Gameboard();
    game.createBoard();
    game.populateCheckers();
    game.startGame();
}

function reset(){
    var game = new Gameboard();
    game.clearBoardAndReset();
    game.createBoard();
    game.populateCheckers();
    game.startGame();
}

startApp();