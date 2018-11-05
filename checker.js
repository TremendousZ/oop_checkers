
class Checker{
    constructor(color){
        this.checker = {
            color
        };
    }

    createRedChecker(){
        return $("<div>").addClass("player1 checker");
    }

    createRedKing(){
        return $("<div>").addClass("player1 checker king1");
    }

    createBlackChecker(){
        return $("<div>").addClass("player2 checker");
    }

    createBlackKing(){
        return $("<div>").addClass("player2 checker king2");
    }

    checkValidMoves(){
        this.getPosition();
    }

    getPosition(){
        return this.checker;
    }
}