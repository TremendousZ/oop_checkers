
class Gameboard {

    constructor(){
        this.gameboard = [];
        this.playerTurn = 1;
        this.currentRow ="";
        this.currentColumn="";
    }

    createBoard(){
        let row,logicRow,column;
        let alternateColor = 0;
        for ( let rowIndex = 0; rowIndex < 8; rowIndex++){
            row = $("<div>").addClass("row ").attr("rowNumber", rowIndex);
            logicRow = [];
            alternateColor =  1 - alternateColor;
            for (let columnIndex = 0; columnIndex < 8; columnIndex++){
                if(alternateColor){
                    column = $("<div>").addClass("dark column").attr("columnNumber",columnIndex);
                    
                    logicRow.push("1");
                } else {
                    column = $("<div>").addClass("light column ").attr("columnNumber",columnIndex);
                    if(rowIndex >= 0 && rowIndex < 3){
                        logicRow.push("r");
                    } else if(rowIndex >= 5 && rowIndex < 8){
                        logicRow.push("b");
                    } else {
                        logicRow.push("0");
                    }
                    
                }
                row.append(column);
                alternateColor =  1 - alternateColor;
            }
            $(".gameArea").append(row);
            this.gameboard.push(logicRow);
            console.log("gameboard", this.gameboard);
        }
    }
    populateCheckers(){
        for(let rowIndex = 0; rowIndex < 8;rowIndex++){

            for(let columnIndex = 0; columnIndex < 8;columnIndex++ ){
                if(this.gameboard[rowIndex][columnIndex]== "r"||this.gameboard[rowIndex][columnIndex]== "R"){
                   let redChecker = new Checker("red");
                    let occupiedSquare = $("div[rownumber="+rowIndex+"] > div[columnnumber="+columnIndex+"]");
                    if(this.gameboard[rowIndex][columnIndex]=="R"){
                        occupiedSquare.append(redChecker.createRedKing());
                    } else {
                        occupiedSquare.append(redChecker.createRedChecker());
                    }
                     
                } else if(this.gameboard[rowIndex][columnIndex]== "b"||this.gameboard[rowIndex][columnIndex]== "B"){
                    let blackChecker = new Checker("black");
                    let occupiedSquare = $("div[rownumber="+rowIndex+"] > div[columnnumber="+columnIndex+"]");
                    if(this.gameboard[rowIndex][columnIndex]=="B"){
                        occupiedSquare.append(blackChecker.createBlackKing());
                    } else {
                        occupiedSquare.append(blackChecker.createBlackChecker());
                    }
                 }
            }
        }
    }

    startGame(){
        this.unlockCheckers();  
    }

    getPosition(){
        let selectedChecker = $(event.currentTarget);
        console.log("EVENT CURRENT TARGET", event.currentTarget);
        let onRow = selectedChecker.parent().parent().attr("rownumber");
        let onCol = selectedChecker.parent().attr("columnnumber");
        if($(event.currentTarget).hasClass("king")){
            this.checkAvailableMoves(onRow,onCol,true);
        } else {
            this.checkAvailableMoves(onRow,onCol,false);
        }
        
    }

    checkAvailableMoves(row, column, king){
           row = parseFloat(row);
           column = parseFloat(column); 
           let moveLeft,moveRight,reverseLeft,reverseRight;
           if(this.playerTurn){
               if(king){
                   if(row == "7"){
                    reverseLeft = this.getSquareValue(row-1,column-1);
                    reverseRight = this.getSquareValue(row-1,column+1);  
                   } else {
                    moveLeft = this.getSquareValue(row+1,column-1);
                    moveRight = this.getSquareValue(row+1,column+1);
                    reverseLeft = this.getSquareValue(row-1,column-1);
                    reverseRight = this.getSquareValue(row-1,column+1); 
                   }
 
               } else {
                moveLeft = this.getSquareValue(row+1,column-1);
                moveRight = this.getSquareValue(row+1,column+1);
               }
            
           } else {
            if(king){
                if(row == "0"){
                    reverseLeft = this.getSquareValue(row+1,column-1);
                    reverseRight = this.getSquareValue(row+1,column+1);
                } else {
                    reverseLeft = this.getSquareValue(row+1,column-1);
                    reverseRight = this.getSquareValue(row+1,column+1);
                    moveLeft = this.getSquareValue(row-1,column-1);
                    moveRight = this.getSquareValue(row-1,column+1); 
                } 
               } else {
                moveLeft = this.getSquareValue(row-1,column-1);
                moveRight = this.getSquareValue(row-1,column+1); 
               }
             
           }
           
           switch(moveLeft){
                case "0":
                    if(this.playerTurn){
                        $("div[rownumber="+(row+1)+"] > div[columnnumber="+(column-1)+"]").addClass("highlight"); 
                    } else {
                        $("div[rownumber="+(row-1)+"] > div[columnnumber="+(column-1)+"]").addClass("highlight"); 
                    }
                break;
                case "b":
                    if(this.playerTurn){
                        this.checkJump("left",row,column)
                    }
                break;
                case "B":
                    if(this.playerTurn){
                        this.checkJump("left",row,column)
                    }
                break;
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("left",row,column)
                    }
                break;
                case "R":
                    if(!this.playerTurn){
                        this.checkJump("left",row,column)
                    }
                break;
                default:

            }
            switch(reverseLeft){
                case "0":
                    if(this.playerTurn){
                        $("div[rownumber="+(row-1)+"] > div[columnnumber="+(column-1)+"]").addClass("highlight"); 
                    } else {
                        $("div[rownumber="+(row+1)+"] > div[columnnumber="+(column-1)+"]").addClass("highlight"); 
                    }
                break;
                case "b":
                    if(this.playerTurn){
                        this.checkJump("reverseleft",row,column)
                    }
                break;
                case "B":
                    if(this.playerTurn){
                        this.checkJump("reverseleft",row,column)
                    }
                break;
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("reverseleft",row,column)
                    }
                break;
                case "R":
                    if(!this.playerTurn){
                        this.checkJump("reverseleft",row,column)
                    }
                break;
                default:

            }
            switch(moveRight){
                case "0":
                    if(this.playerTurn){
                        $("div[rownumber="+(row+1)+"] > div[columnnumber="+(column+1)+"]").addClass("highlight"); 
                    } else {
                        $("div[rownumber="+(row-1)+"] > div[columnnumber="+(column+1)+"]").addClass("highlight"); 
                    }
                break;
                case "b":
                    if(this.playerTurn){
                        this.checkJump("right",row,column)
                    }
                break;
                case "B":
                    if(this.playerTurn){
                        this.checkJump("right",row,column)
                    }
                break;
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("right",row,column)
                    }
                break;
                case "R":
                    if(!this.playerTurn){
                        this.checkJump("right",row,column)
                    }
                break;
                default:
            }

            switch(reverseRight){
                case "0":
                    if(this.playerTurn){
                        $("div[rownumber="+(row-1)+"] > div[columnnumber="+(column+1)+"]").addClass("highlight"); 
                    } else {
                        $("div[rownumber="+(row+1)+"] > div[columnnumber="+(column+1)+"]").addClass("highlight"); 
                    }
                break;
                case "b":
                    if(this.playerTurn){
                        this.checkJump("reverseRight",row,column)
                    }
                break;
                case "B":
                    if(this.playerTurn){
                        this.checkJump("reverseRight",row,column)
                    }
                break;
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("reverseRight",row,column)
                    }
                break;
                case "R":
                    if(!this.playerTurn){
                        this.checkJump("reverseRight",row,column)
                    }
                break;
                default:
            }
        $(".highlight").on('click', this.moveToSquare.bind(this));
        this.currentRow=row;
        this.currentColumn=column;
        this.getSquareValue(row,column);
    }

    checkJump(direction,row,column){
        let possibleJump;
        if(this.playerTurn){
            switch(direction){
                case "left":
                if(row == "6"){
                    return;
                }
                possibleJump = this.gameboard[row+2][column-2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeft"); 
                }
                break;
                case "reverseleft":
                possibleJump = this.gameboard[row-2][column-2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeftReverse"); 
                }
                break;
                case "right":
                if(row == "6"){
                    return;
                }
                possibleJump = this.gameboard[row+2][column+2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRight"); 
                }
                break;
                case "reverseRight":
                possibleJump = this.gameboard[row-2][column+2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRightReverse"); 
                }
                break;
            }
        } else {
            switch(direction){
                case "left":
                if(row == "1"){
                    return;
                }
                possibleJump = this.gameboard[row-2][column-2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeft"); 
                }
                break;
                case "reverseleft":
                possibleJump = this.gameboard[row+2][column-2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeftReverse"); 
                }
                break;
                case "right":
                if(row == "1"){
                    return;
                }
                possibleJump = this.gameboard[row-2][column+2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRight"); 
                }
                break;
                case "reverseRight":
                possibleJump = this.gameboard[row+2][column+2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRightReverse"); 
                }
                break;
            }
        }
    }

    getSquareValue(row,column){
        return this.gameboard[row][column];
    }

    moveToSquare(){
        $(".highlight").off('click');
        let kingCheck = this.gameboard[this.currentRow][this.currentColumn];
        let destination = $(event.currentTarget);
        
        let newRow = destination.parent().attr("rownumber");
        newRow= parseFloat(newRow);
        let newCol = destination.attr("columnnumber");
        newCol = parseFloat(newCol);
        if(destination.hasClass("jumpLeft")){
            if(this.playerTurn){
                this.gameboard[newRow-1][newCol+1]="0";  
            } else {
                this.gameboard[newRow+1][newCol+1]="0"; 
            }
        } else if(destination.hasClass("jumpRight")){
            if(this.playerTurn){
                this.gameboard[newRow-1][newCol-1]="0";  
            } else {
                this.gameboard[newRow+1][newCol-1]="0"; 
            }
        } else if(destination.hasClass("jumpRightReverse")){
            if(this.playerTurn){
                this.gameboard[newRow+1][newCol-1]="0";  
            } else {
                this.gameboard[newRow-1][newCol-1]="0"; 
            }
        } else if(destination.hasClass("jumpLeftReverse")){
            if(this.playerTurn){
                this.gameboard[newRow+1][newCol-1]="0";  
            } else {
                this.gameboard[newRow-1][newCol+1]="0"; 
            }
        }
        $(".jumpRight").removeClass("jumpRight");
        $(".jumpLeft").removeClass("jumpLeft");
        $(".jumpLeftReverse").removeClass("jumpLeftReverse");
        $(".jumpRightReverse").removeClass("jumpRightReverse");
        if(this.playerTurn){
            if(kingCheck == "R"){
                this.gameboard[newRow][newCol] = 'R'; 
            } else {
                this.gameboard[newRow][newCol] = 'r';
            }
            
            if(newRow == "7"){
                this.gameboard[newRow][newCol] = 'R';  
            }
        } else {
            if(kingCheck =="B"){
                this.gameboard[newRow][newCol] = 'B';
            } else {
                this.gameboard[newRow][newCol] = 'b';
            }
            
            if(newRow == "0"){
                this.gameboard[newRow][newCol] = 'B';  
            }
        }

        this.gameboard[this.currentRow][this.currentColumn] = "0";
          
        this.readGameBoard();
        $(".highlight").removeClass('highlight');
        this.switchPlayerTurn();
    }

    readGameBoard(){
        $(".column").empty();
        this.populateCheckers();
    }
    
    switchPlayerTurn(){
        this.playerTurn = 1 - this.playerTurn;
        this.unlockCheckers(); 
        console.log(this.gameboard);
    }
    unlockCheckers(){
        if(this.playerTurn){
            $(".playerTurn").text('Player 1 Turn').css('color','red');
            $(".player1").on('click', this.getPosition.bind(this)); 
            $(".player2").off('click'); 
        } else {
            $(".playerTurn").text('Player 2 Turn').css('color','black');
            $(".player2").on('click', this.getPosition.bind(this));
            $(".player1").off('click'); 
        }
    }
}