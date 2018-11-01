
class Checker{
    constructor(color){
        this.checker = {
            color
        };
    }

    createRedChecker(){
        return $("<div>").addClass("player1 checker");
    }

    createBlackChecker(){
        return $("<div>").addClass("player2 checker");
    }

    checkValidMoves(){
        this.getPosition();
    }

    getPosition(){
        return this.checker;
    }
}