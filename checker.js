
class Checker{
    constructor(color){
        this.checker = {
            color
        };
        this.crownSRC = "./images/king_crown.png";
    }

    createRedChecker(){
        return $("<div>").addClass("player1 checker");
    }

    createRedKing(){
        let redKing = $("<div>").addClass("player1 checker king1");
        let kingEmblem =$("<img>").attr("src",this.crownSRC).addClass('kingEmblem');
        redKing.append(kingEmblem); 
        return redKing;
    }

    createBlackChecker(){
        return $("<div>").addClass("player2 checker");
    }

    createBlackKing(){
        let blackKing = $("<div>").addClass("player2 checker king2");
        let kingEmblem =$("<img>").attr("src",this.crownSRC).addClass('kingEmblem');
        blackKing.append(kingEmblem); 
        return blackKing;
    }

    checkValidMoves(){
        this.getPosition();
    }

    getPosition(){
        return this.checker;
    }
}