

function startApp(){
    var game = new Gameboard();
    game.createBoard();
    game.populateCheckers();
    game.startGame();
}

startApp();