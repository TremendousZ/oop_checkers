
class Gameboard {

    constructor(){
        this.gameboard = [];
        this.playerTurn = 1;
        this.currentRow ="";
        this.currentColumn="";
        this.jumped=false;
        this.checker;
        this.firstMove=true;
        this.player1Counter=0;
        this.player2Counter=0;
        this.noJumpsLeft=false;
        this.noJumpRight= false;
        this.noJumpLeft = false;
        this.noJumpReverseRight = false;
        this.noJumpReverseLeft = false;
        this.kinged=false;
        this.turnAnimation = 1;
    }

    createBoard(){
        let row,logicRow,column;
        let alternateColor = 0;
        //dynamically create the board and matrixed array
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

        }
    }
    populateCheckers(){
        // Read the matrixed array and populate the appropriate checkers 
        for(let rowIndex = 0; rowIndex < 8;rowIndex++){
            for(let columnIndex = 0; columnIndex < 8;columnIndex++ ){
                if(this.gameboard[rowIndex][columnIndex]== "r"||this.gameboard[rowIndex][columnIndex]== "King1"){
                   let redChecker = new Checker("red");
                    let occupiedSquare = $("div[rownumber="+rowIndex+"] > div[columnnumber="+columnIndex+"]");
                    if(this.gameboard[rowIndex][columnIndex]=="King1"){
                        occupiedSquare.append(redChecker.createRedKing());
                    } else {
                        occupiedSquare.append(redChecker.createRedChecker());
                    }
                     
                } else if(this.gameboard[rowIndex][columnIndex]== "b"||this.gameboard[rowIndex][columnIndex]== "King2"){
                    let blackChecker = new Checker("black");
                    let occupiedSquare = $("div[rownumber="+rowIndex+"] > div[columnnumber="+columnIndex+"]");
                    if(this.gameboard[rowIndex][columnIndex]=="King2"){
                        occupiedSquare.append(blackChecker.createBlackKing());
                    } else {
                        occupiedSquare.append(blackChecker.createBlackChecker());
                    }
                 }
            }
        }
    }

    startGame(){
        //Enable checker click handler
        this.unlockCheckers(); 
        $('.resetButton').on('click', this.resetGame.bind(this));
        $('.stopAnimation').on('click', this.toggleAnimation.bind(this));
    }

    getPosition(row,col){
        $(".highlight").removeClass("highlight");
        // Find the current row and column of the selected checker
        let selectedChecker = $(event.currentTarget);
        let onRow,onCol;
        // If this is the first move readt the attributes off the column and row div
        if(this.firstMove){
            onRow = selectedChecker.parent().parent().attr("rownumber");
            onCol = selectedChecker.parent().attr("columnnumber");
            onRow = parseFloat(onRow);
            onCol = parseFloat(onCol);
            // Signal the checkAvailableMoves function whether or not the checker is a King
            if(selectedChecker.hasClass("king1")||selectedChecker.hasClass("king2") ){
                this.checkAvailableMoves(onRow,onCol,true);
            } else {
                this.checkAvailableMoves(onRow,onCol,false);
            }
        } else {
            //If this is the second move, parameters given to select the current position
            onRow = row;
            onCol = col;
            if(this.gameboard[onRow][onCol]== "King1" || this.gameboard[onRow][onCol]== "King2"){
                this.checkAvailableMoves(onRow,onCol,true);
            } else {
                this.checkAvailableMoves(onRow,onCol,false);
            }
        }
         
    }

    checkAvailableMoves(row, column, king){
        // Enable different movements based on whether or checker is a King
            row = parseFloat(row);
            column = parseFloat(column); 
            this.currentRow=row;
            this.currentColumn=column;
            let moveLeft,moveRight,reverseLeft,reverseRight;
            if(this.playerTurn){
                if(king){
                    
                    if(row == "7"){
                        //If king is against board edge
                        reverseLeft = this.getSquareValue(row-1,column-1);
                        reverseRight = this.getSquareValue(row-1,column+1);  
                    } else if (row=="0"){
                        moveLeft = this.getSquareValue(row+1,column-1);
                        moveRight = this.getSquareValue(row+1,column+1);
                    } else  {
                        //If checker is king and not against board edge, enable king moves
                        moveLeft = this.getSquareValue(row+1,column-1);
                        moveRight = this.getSquareValue(row+1,column+1);
                        reverseLeft = this.getSquareValue(row-1,column-1);
                        reverseRight = this.getSquareValue(row-1,column+1); 
                    }
                } else {
                    // Enable normal checker movements
                    moveLeft = this.getSquareValue(row+1,column-1);
                    moveRight = this.getSquareValue(row+1,column+1);
                }
            
            } else {
            if(king){
                if(row == "0"){
                    reverseLeft = this.getSquareValue(row+1,column-1);
                    reverseRight = this.getSquareValue(row+1,column+1);
                } else if(row =="7"){
                    moveLeft = this.getSquareValue(row-1,column-1);
                    moveRight = this.getSquareValue(row-1,column+1); 
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
           if(this.firstMove == false){
            this.checkDoubleJump(moveRight,moveLeft, reverseRight, reverseLeft, row,column,king);
            $(".highlight").on('click', this.moveToSquare.bind(this));
            this.currentRow=row;
            this.currentColumn=column;
            this.getSquareValue(row,column);
            return;
        }
           
           switch(moveLeft){
                case "0":
                    if(this.playerTurn){
                        $("div[rownumber="+(row+1)+"] > div[columnnumber="+(column-1)+"]").addClass("highlight").addClass("alertPulse-css"); 
                    } else {
                        $("div[rownumber="+(row-1)+"] > div[columnnumber="+(column-1)+"]").addClass("highlight").addClass("alertPulse-css"); 
                    }
                break;
                case "b":
                    if(this.playerTurn){
                        this.checkJump("left",row,column)
                    }
                break;
                case "King2":
                    if(this.playerTurn){
                        this.checkJump("left",row,column)
                    }
                break;
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("left",row,column)
                    }
                break;
                case "King1":
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
                case "King2":
                    if(this.playerTurn){
                        this.checkJump("reverseleft",row,column)
                    }
                break;
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("reverseleft",row,column)
                    }
                break;
                case "King1":
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
                case "King2":
                    if(this.playerTurn){
                        this.checkJump("right",row,column)
                    }
                break;
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("right",row,column)
                    }
                break;
                case "King1":
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
                case "King2":
                    if(this.playerTurn){
                        this.checkJump("reverseRight",row,column)
                    }
                break;
                case "r":
                    if(!this.playerTurn){
                        this.checkJump("reverseRight",row,column)
                    }
                break;
                case "King1":
                    if(!this.playerTurn){
                        this.checkJump("reverseRight",row,column)
                    }
                break;
                default:
            }
        $(".highlight").on('click', this.moveToSquare.bind(this));
        this.getSquareValue(row,column);
    }

    checkJump(direction,row,column){
        let possibleJump;
        if(this.playerTurn){
            switch(direction){
                case "left":
                if(row == "6"){
                    this.noJumpsLeft=true; 
                } else {
                    if(column != "1"||column != "0"){ 
                        possibleJump = this.gameboard[row+2][column-2];
                        if (possibleJump == '0'){
                            $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeft"); 
                        } else {
                            this.noJumpLeft=true;
                        }
                    } else {
                        this.noJumpLeft=true;
                    }
                }
                
                break;
                case "reverseleft":
                possibleJump = this.gameboard[row-2][column-2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeftReverse"); 
                } else {
                    this.noJumpReverseLeft=true;
                }
                break;
                case "right":
                if(row == "6"){
                    this.noJumpsRight=true;
                } else {
                    if(column != "6" || column !="7"){
                        possibleJump = this.gameboard[row+2][column+2];
                        if (possibleJump == '0'){
                            $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRight"); 
                        } else {
                            this.noJumpRight=true;
                        }
                    } else {
                        this.noJumpRight=true;
                    }
                }
                
                break;
                case "reverseRight":
                possibleJump = this.gameboard[row-2][column+2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRightReverse"); 
                } else {
                    this.noJumpReverseRight=true;
                }
                break;

            }
            
        } else {
            switch(direction){
                case "left":
                if(row == "1"){
                    this.noJumpLeft=true;
                } else {
                    if(column !="0" || column != "1"){
                        possibleJump = this.gameboard[row-2][column-2];
                            if (possibleJump == '0'){
                            $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeft"); 
                            } else {
                                this.noJumpLeft = true;
                            }
                    } else {
                        this.noJumpLeft=true;
                    }    
                }
                break;
                case "reverseleft":
                possibleJump = this.gameboard[row+2][column-2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column-2)+"]").addClass("highlight jumpLeftReverse"); 
                } else {
                    this.noJumpReverseLeft = true;
                }
                break;
                case "right":
                if(row == "1"){
                    this.noJumpRight=true;
                } else {
                    if(column!="6"|| column != "7"){
                        possibleJump = this.gameboard[row-2][column+2];
                        if (possibleJump == '0'){
                            $("div[rownumber="+(row-2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRight"); 
                        } else {
                            this.noJumpRight = true;
                        }
                    } else {
                        this.noJumpRight=true;
                    }
                    
                }
                break;
                case "reverseRight":
                possibleJump = this.gameboard[row+2][column+2];
                if (possibleJump == '0'){
                    $("div[rownumber="+(row+2)+"] > div[columnnumber="+(column+2)+"]").addClass("highlight jumpRightReverse"); 
                } else {
                    this.noJumpReverseRight=true;
                }
                break;
            }
        }
        if(this.gameboard[row][column] == "b" || this.gameboard[row][column] =="r" || this.gameboard[row][column] == 'King1'|| this.gameboard[row][column]=="King2"){
            if(this.noJumpLeft == true && this.noJumpRight == true){
                this.moveToSquare("secondMove");
            }
        } else {
            if(this.noJumpLeft == true && this.noJumpsLeft == true && this.noJumpReverseLeft == true && this.noJumpReverseRight == true){
                if(!this.jumped || this.noJumpsLeft){
                    this.moveToSquare("secondMove"); 
                }
            }
        }
    }

    getSquareValue(row,column){
        return this.gameboard[row][column];
    }

    moveToSquare(moves){
        let newRow, newCol;
        if(moves == "secondMove"){
            $(".highlight").off('click');
            this.jumped=false;
        } else {
            $(".highlight").off('click');
            let kingCheck = this.gameboard[this.currentRow][this.currentColumn];
            let destination = $(event.currentTarget);
            newRow = destination.parent().attr("rownumber");
            newRow= parseFloat(newRow);
            newCol = destination.attr("columnnumber");
            newCol = parseFloat(newCol);
            if(destination.hasClass("jumpLeft")){
                this.jumped=true;
                if(this.playerTurn){
                    this.gameboard[newRow-1][newCol+1]="0"; 
                    this.player1Counter++; 
                } else {
                    this.gameboard[newRow+1][newCol+1]="0";
                    this.player2Counter++;  
                }
            } else if(destination.hasClass("jumpRight")){
                this.jumped=true;
                if(this.playerTurn){
                    this.gameboard[newRow-1][newCol-1]="0";
                    this.player1Counter++;   
                } else {
                    this.gameboard[newRow+1][newCol-1]="0";
                    this.player2Counter++;  
                }
            } else if(destination.hasClass("jumpRightReverse")){
                this.jumped=true;
                if(this.playerTurn){
                    this.gameboard[newRow+1][newCol-1]="0";
                    this.player1Counter++;   
                } else {
                    this.gameboard[newRow-1][newCol-1]="0";
                    this.player2Counter++;  
                }
            } else if(destination.hasClass("jumpLeftReverse")){
                this.jumped=true;
                if(this.playerTurn){
                    this.gameboard[newRow+1][newCol-1]="0";
                    this.player1Counter++;   
                } else {
                    this.gameboard[newRow-1][newCol+1]="0";
                    this.player2Counter++;  
                }
            }
            $(".jumpRight").removeClass("jumpRight");
            $(".jumpLeft").removeClass("jumpLeft");
            $(".jumpLeftReverse").removeClass("jumpLeftReverse");
            $(".jumpRightReverse").removeClass("jumpRightReverse");
        
            if(this.playerTurn){
                if(kingCheck === "King1"){
                    this.gameboard[newRow][newCol] = 'King1'; 
                } else {
                    this.gameboard[newRow][newCol] = 'r';
                }
            
                if(newRow == "7"){
                    this.gameboard[newRow][newCol] = 'King1';
                    this.kinged=true;  
                }
            } else {
                if(kingCheck === "King2"){
                    this.gameboard[newRow][newCol] = 'King2';
                } else {
                    this.gameboard[newRow][newCol] = 'b';
                }
                if(newRow == "0"){
                    this.gameboard[newRow][newCol] = 'King2';
                    this.kinged=true;  
                }
            }
            this.gameboard[this.currentRow][this.currentColumn] = "0";
        }
        
        this.readGameBoard();
        this.endPlayerTurn(newRow,newCol);
    }

    endPlayerTurn(row,col){
        if(this.player1Counter =="12" || this.player2Counter=="12"){
            this.checkEndGame();
        } else {
            $(".highlight").removeClass('highlight');
            if(!this.jumped|| this.kinged){
                this.switchPlayerTurn();
                this.firstMove=true;
                this.jumped=false;
                this.noJumpsLeft = false;
                this.noJumpLeft = false;
                this.noJumpRight=false;
                this.kinged=false;
            } else {
                this.firstMove = false;  
                this.getPosition(row,col);
                this.jumped=false;
            }
        }
    }

    readGameBoard(){
        $(".column").empty();
        this.populateCheckers();
    }
    
    switchPlayerTurn(){
        this.noJumpsLeft=false;
        this.playerTurn = 1 - this.playerTurn;
        this.unlockCheckers();
        console.log("player scores   ",this.player1Counter,this.player2Counter);
    }
    unlockCheckers(){
        this.displayTurn();
        if(this.playerTurn){
            $(".playerTurn").text('Player 1 Turn').css('color','red');
            $(".player1").on('click', this.getPosition.bind(this)); 
            $(".player2").off('click'); 
        } else {
            $(".playerTurn").text('Player 2 Turn').css('color','blue');
            $(".player2").on('click', this.getPosition.bind(this));
            $(".player1").off('click'); 
        }
    }

    checkDoubleJump(moveRight,moveLeft, reverseRight,reverseLeft, row, column, king){
        if(this.playerTurn){
            if(row == "6") {
                this.noJumpLeft = true;
                this.noJumpRight = true;
            }
            if(moveLeft == "r" || moveLeft == "King1"){
                this.noJumpLeft = true;
            }
            if(moveRight =="r" || moveRight =="King1") {
                this.noJumpRight = true;
            }
            if(reverseLeft == "r" || reverseLeft == "King1"){
                this.noJumpReverseLeft = true;
            }
            if(reverseRight =="r" || reverseRight =="King1") {
                this.noJumpReverseRight = true;
            }
        } else {
            if(row == "1") {
                this.noJumpLeft = true;
                this.noJumpRight = true;
            }
            if(moveLeft == "b" || moveLeft == "King2"){
                this.noJumpLeft = true;
            }
            if(moveRight =="b" || moveRight =="King2") {
                this.noJumpRight = true;
            }
            if(reverseLeft == "b" || reverseLeft == "King2"){
                this.noJumpReverseLeft = true;
            }
            if(reverseRight =="b" || reverseRight =="King2") {
                this.noJumpReverseRight = true;
            }
        }

        if(moveLeft == "0" || moveLeft == undefined){
            this.noJumpLeft = true;
        } 
        if(moveRight == '0' || moveRight == undefined){
            this.noJumpRight=true;
        }
        
        if(king){
            if(reverseLeft == "0" || reverseLeft == undefined){
                this.noJumpReverseLeft = true;
            } 
            if(reverseRight == '0' || reverseRight == undefined){
                this.noJumpReverseRight=true;
            }
            if(reverseLeft =="0" && reverseRight == "0" && moveLeft =="0" && moveRight =="0"){
                this.moveToSquare("secondMove");
                return;
            }
            if(reverseLeft ==undefined && reverseRight == "0" && moveLeft ==undefined && moveRight =="0"){
                this.moveToSquare("secondMove");
                return;
                }
            if(reverseLeft =="0" && reverseRight == undefined && moveLeft =="0" && moveRight ==undefined){
                this.moveToSquare("secondMove");
                return;
                }
        } else {
            if(moveLeft =="0" && moveRight == undefined){
                this.moveToSquare("secondMove");
                return;
            }
            if(moveLeft ==undefined && moveRight == "0"){
                this.moveToSquare("secondMove");
                return;
            }
            if(moveLeft =="0" && moveRight == "0"){
                this.moveToSquare("secondMove");
                return;
            }
            if(moveLeft ==undefined && moveRight == undefined){
                this.moveToSquare("secondMove");
                return;
            }
            

        }
        switch(moveRight){
            case "b":
            if(this.playerTurn){
                this.checkJump("right",row,column)
            }
        break;
        case "King2":
            if(this.playerTurn){
                this.checkJump("right",row,column)
            }
        break;
        case "r":
            if(!this.playerTurn){
                this.checkJump("right",row,column)
            }
        break;
        case "King1":
            if(!this.playerTurn){
                this.checkJump("right",row,column)
            }
        break;
        }
        switch(moveLeft){
            case "b":
            if(this.playerTurn){
                this.checkJump("left",row,column)
            }
        break;
        case "King2":
            if(this.playerTurn){
                this.checkJump("left",row,column)
            }
        break;
        case "r":
            if(!this.playerTurn){
                this.checkJump("left",row,column)
            }
        break;
        case "King1":
            if(!this.playerTurn){
                this.checkJump("left",row,column)
            }
        break;
        }
        switch(reverseRight){
            case "b":
            if(this.playerTurn){
                this.checkJump("reverseRight",row,column)
            }
        break;
        case "King2":
            if(this.playerTurn){
                this.checkJump("reverseRight",row,column)
            }
        break;
        case "r":
            if(!this.playerTurn){
                this.checkJump("reverseRight",row,column)
            }
        break;
        case "King1":
            if(!this.playerTurn){
                this.checkJump("reverseRight",row,column)
            }
        break;
        }
        switch(reverseLeft){
            case "b":
            if(this.playerTurn){
                this.checkJump("reverseleft",row,column)
            }
        break;
        case "King2":
            if(this.playerTurn){
                this.checkJump("reverseleft",row,column)
            }
        break;
        case "r":
            if(!this.playerTurn){
                this.checkJump("reverseleft",row,column)
            }
        break;
        case "King1":
            if(!this.playerTurn){
                this.checkJump("reverseleft",row,column)
            }
        break;
        }
            if(this.noJumpLeft == true && this.noJumpRight == true){
                this.moveToSquare("secondMove");
            }
            if(this.noJumpLeft == true && this.noJumpsLeft == true && this.noJumpReverseLeft == true && this.noJumpReverseRight == true){     
                    this.moveToSquare("secondMove"); 
            }
        
    }

    checkEndGame(){
        let win = $('.win');
            if (this.player1Counter==12){
                win.text("PLAYER 1 WINS!").css("color","red");
                $(".player1").off('click');
                win.toggleClass('show').addClass("center");
            }
            if (this.player2Counter ==12){
                win.text("PLAYER 2 WINS!").css("color","blue");
                $(".player1").off('click');
                win.toggleClass('show').addClass("center");
            }
    }   

    displayTurn(){
        if(this.turnAnimation == true) {
            let display = $('.displayTurn');
        let slideBackground = $('.sliding-background');
        let appearAnimation = $('.appearAnimation');
        if(this.playerTurn){
            slideBackground.addClass("player1");
            $('.displayTurn').text("Player 1\'s Turn").css("color","white");
        } else {
            $('.displayTurn').text("Player 2\'s Turn").css("color","white");
        }
        display.toggleClass('show');
        slideBackground.toggleClass('show');
        appearAnimation.toggleClass('show');
        setTimeout(()=>{
            display.toggleClass('show');
            slideBackground.toggleClass('show');
            appearAnimation.toggleClass('show');
            slideBackground.removeClass("player1");
        },2000);
        }
        
        
    }
    toggleAnimation(){
        if(this.turnAnimation) {
            $('.stopAnimation').addClass('startAnimation').text('Animations: OFF');

        } else {
            $('.stopAnimation').removeClass('startAnimation').text('Animations: ON');
        }
        this.turnAnimation = 1 - this.turnAnimation;    
    }

    resetGame(){
        this.gameboard = [];
        $('.gameArea').empty();
        this.playerTurn = 1;
        this.currentRow ="";
        this.currentColumn="";
        this.jumped=false;
        this.firstMove=true;
        this.player1Counter=0;
        this.player2Counter=0;
        this.noJumpsLeft=false;
        this.noJumpRight= false;
        this.noJumpLeft = false;
        this.noJumpReverseRight = false;
        this.noJumpReverseLeft = false;
        this.kinged=false;
        this.turnAnimation = 1;
        $('.win').removeClass('show');
        this.createBoard();
        this.populateCheckers();
        this.startGame();
    }
}