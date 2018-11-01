
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
                if(this.gameboard[rowIndex][columnIndex]== "r"){
                   let redChecker = new Checker("red");
                    let occupiedSquare = $("div[rownumber="+rowIndex+"] > div[columnnumber="+columnIndex+"]");
                    occupiedSquare.append(redChecker.createRedChecker()); 
                } else if(this.gameboard[rowIndex][columnIndex]== "b"){
                    let blackChecker = new Checker("black");
                    let occupiedSquare = $("div[rownumber="+rowIndex+"] > div[columnnumber="+columnIndex+"]");
                    occupiedSquare.append(blackChecker.createBlackChecker()); 
                 }
            }
        }
    }

    startGame(){
        this.unlockCheckers();  
    }

    getPosition(){
        let selectedChecker = $(event.currentTarget);
        let onRow = selectedChecker.parent().parent().attr("rownumber");
        let onCol = selectedChecker.parent().attr("columnnumber");
        this.checkAvailableMoves(onRow,onCol);
    }

    checkAvailableMoves(row, column){
        debugger;
           row = parseFloat(row);
           column = parseFloat(column); 
           let moveLeft,moveRight,newRow,newCol;
           if(this.playerTurn){
            moveLeft = this.getSquareValue(row+1,column-1);
            moveRight = this.getSquareValue(row+1,column+1);
           } else {
            moveLeft = this.getSquareValue(row-1,column-1);
            moveRight = this.getSquareValue(row-1,column+1);  
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
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("left",row,column)
                    }
            }
            switch(moveRight){
                case "0":
                    if(moveRight == "0" && this.playerTurn){
                        $("div[rownumber="+(row+1)+"] > div[columnnumber="+(column+1)+"]").addClass("highlight"); 
                    } else if(moveRight == "0" && !this.playerTurn){
                        $("div[rownumber="+(row-1)+"] > div[columnnumber="+(column+1)+"]").addClass("highlight"); 
                    }
                break;
                case "b":
                    if(this.playerTurn){
                        this.checkJump("right",row,column)
                    }
                break;
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("right",row,column)
                    }
            }

        //    if(moveLeft == "0" && this.playerTurn){
        //     $("div[rownumber="+(row+1)+"] > div[columnnumber="+(column-1)+"]").addClass("highlight"); 
        //    } else if(moveLeft == "0" && !this.playerTurn){
        //     $("div[rownumber="+(row-1)+"] > div[columnnumber="+(column-1)+"]").addClass("highlight"); 
        //    }
        //    if(moveRight == "0"&& this.playerTurn){
        //     $("div[rownumber="+(row+1)+"] > div[columnnumber="+(column+1)+"]").addClass("highlight"); 
        //    } else if(moveRight == "0" && !this.playerTurn){
        //     $("div[rownumber="+(row-1)+"] > div[columnnumber="+(column+1)+"]").addClass("highlight");  
        //    }
        $(".highlight").on('click', this.moveToSquare.bind(this));
        this.currentRow=row;
        this.currentColumn=column;
        this.getSquareValue(row,column);
    }

    checkJump(direction,row,column){
        debugger;
        let possibleJump;
        if(this.playerTurn){
            switch(direction){
                case "left":
                possibleJump = this.gameboard[row+2][column-2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeft"); 
                }
                break;
                case "right":
                possibleJump = this.gameboard[row+2][column+2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRight"); 
                }
                break;
            }
        } else {
            switch(direction){
                case "left":
                possibleJump = this.gameboard[row-2][column-2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeft"); 
                }
                break;
                case "right":
                possibleJump = this.gameboard[row-2][column+2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRight"); 
                }
                break;
            }
        }
    }

    getSquareValue(row,column){
        return this.gameboard[row][column];
    }

    moveToSquare(){
        debugger;
        $(".highlight").off('click');
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
        }
        $(".jumpRight").removeClass("jumpRight");
        $(".jumpLeft").removeClass("jumpLeft");

        if(this.playerTurn){
            this.gameboard[newRow][newCol] = 'r';
        } else {
            this.gameboard[newRow][newCol] = 'b';
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