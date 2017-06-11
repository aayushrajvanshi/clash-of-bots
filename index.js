var express = require('express');
var app = express();
// importPackage(java.io);
// importPackage(java.lang);
// importPackage(java.util);

function main() {
    // var STDIN = (function () {
    //     var sc = new BufferedReader(new InputStreamReader(System['in']));
    //     var result = [];
    //     while (true) {
    //         var line = sc.readLine();
    //         if (null == line) break;
    //         result.push(line);
    //     }
    //     return result;
    // })();

    // var printSolution = function printSolution(move) {
    //     print(move.rook.split(',').join(' '));
    //     print(move.rookMove.split(',').join(' '));
    //     print(move.arrowMove.toString().split(',').join(' '));
    // };

    var STDIN = [
        '0 0 0 2 -1 0 2 0 0 0\r',
        '0 0 0 -1 0 0 0 0 0 0\r',
        '0 0 0 0 0 0 0 0 0 0\r',
        '2 0 0 1 0 0 0 0 0 2\r',
        '0 0 0 0 0 0 0 0 0 0\r',
        '-1 0 0 0 0 0 0 0 0 -1\r',
        '1 -1 0 0 0 0 0 0 -1 1\r',
        '-1 0 0 0 0 0 0 0 0 -1\r',
        '0 0 0 0 0 0 -1 0 0 0\r',
        '0 0 0 0 0 -1 1 -1 0 0\r',
        '1'
    ]

    var printSolution = function printSolution(move) {
        console.log(move.rook.split(',').join(' '));
        console.log(move.rookMove.split(',').join(' '));
        console.log(move.arrowMove.toString().split(',').join(' '));
    };

    var myself = parseInt(STDIN[10]);
    var opponent = myself === 1 ? 2 : 1;
    var board = [];
    for (var i = 0; i < 10; i++) {
        var row = [];
        var str = STDIN[i].split(" ");
        for (var j = 0; j < 10; j++) {
            row.push(parseInt(str[j]));
        }
        board.push(row);
    }

    var myRooksPosition = [];
    var opponentRooksPosition = [];
    var opponentAllowableMoves = [];
    var blankPositions = [];
    var blockedPositions = [];
    var arrowPositions = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === myself) {
                myRooksPosition.push([i, j]);
            } else if (board[i][j] === opponent) {
                opponentRooksPosition.push([i, j]);
                opponentAllowableMoves.push(...getAllowableMoves([i, j], board));
            } else if (board[i][j] === 0) {
                blankPositions.push([i, j]);
            }
        }
    };

    function getAllowableMoves(rook, board) {
        let x = rook[0];
        let y = rook[1];
        let allowableMoves = [];

        //In Left direction
        for (let j = y - 1; j >= 0; j--) {
            if (board[x][j] !== 0) break;
            let move = [x, j];
            allowableMoves.push(move);
        }

        //In Right direction
        for (let j = y + 1; j < 10; j++) {
            if (board[x][j] !== 0) break;
            let move = [x, j];
            allowableMoves.push(move);
        }

        //In Up direction
        for (let j = x - 1; j >= 0; j--) {
            if (board[j][y] !== 0) break;
            let move = [j, y];
            allowableMoves.push(move);
        }

        //In Down direction
        for (let j = x + 1; j < 10; j++) {
            if (board[j][y] !== 0) break;
            let move = [j, y];
            allowableMoves.push(move);
        }
        return allowableMoves;
    }

    var boardAvailabity = ((blankPositions.length / 92) * 100).toFixed(2);
    var playingMode;

    if (boardAvailabity > 90) {
        playingMode = 'ATTACKING'
    } else {
        playingMode = 'DEFENDING'
    }

    ///////////////////////////////////////////////////////////////
    //////////////////////MOVE QUALITY CHECK//////////////////////
    ///////////////////////////////////////////////////////////////




    ///////////////////////////////////////////////////////////////
    function getMoveQuality(movePosition) {
        let sum = 0;

        //Arrow Close to Opponent
        let distance = [];
        for (let i = 0; i < opponentRooksPosition.length; i++) {
            distance.push(getDistance(movePosition, opponentRooksPosition[i]));
        }
        for (let i = 0; i < myRooksPosition.length; i++) {
            distance.push(getDistance(movePosition, myRooksPosition[i]));
        }
        sum += distance.reduce((a, b) => a < b ? a : b);

        // let distanceFromOpponent = [];
        // for (let i = 0; i < opponentAllowableMoves.length; i++) {
        //     distanceFromOpponent.push(getDistance(arrowPosition, opponentAllowableMoves[i]));
        // }
        // sum -= distanceFromOpponent.reduce((a, b) => a < b ? a : b);        

        return sum;
    }

    ///////////////////////////////////////////////////////////////
    //////////////////////ARROW QUALITY CHECK//////////////////////
    ///////////////////////////////////////////////////////////////




    ///////////////////////////////////////////////////////////////
    function getArrowQuality(arrowPosition) {
        let sum = 0;

        //Arrow Close to Opponent
        let distance = [];
        for (let i = 0; i < opponentRooksPosition.length; i++) {
            distance.push(getDistance(arrowPosition, opponentRooksPosition[i]));
        }
        sum -= distance.reduce((a, b) => a < b ? a : b);

        // let distanceFromOpponent = [];
        // for (let i = 0; i < opponentAllowableMoves.length; i++) {
        //     distanceFromOpponent.push(getDistance(arrowPosition, opponentAllowableMoves[i]));
        // }
        // sum -= distanceFromOpponent.reduce((a, b) => a < b ? a : b);        

        return sum;
    }

    var myRooks = [];
    var opponentRooks = [];

    function Rook(position) {
        this.rook = position;
        this.allowableMoves = getAllowableMovesForRook(position, board);
    }

    function RookMove(move, arrowMoves) {
        this.rookMove = move;
        this.moveQuality = 50;
        this.allowableArrowMoves = arrowMoves
    }

    RookMove.prototype.updateQuality = function (value) {
        this.moveQuality = this.moveQuality + parseFloat(value);
    }

    function ArrowMove(move) {
        this.arrowMove = move;
        this.arrowQuality = 50;
    }

    ArrowMove.prototype.updateQuality = function (value) {
        this.arrowQuality = this.arrowQuality + parseFloat(value);
    }

    function getDistance(coordinateA, coordinateB) {
        return (Math.sqrt(Math.pow(coordinateA[0] - coordinateB[0], 2) + Math.pow(coordinateA[1] - coordinateB[1], 2))).toFixed(2);
    };

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === myself) {
                var rook = new Rook([i, j]);
                myRooks.push(rook);
            } else if (board[i][j] === opponent) {
                var rook = new Rook([i, j]);
                opponentRooks.push(rook);
            }
        }
    };

    function getAllowableMovesForRook(rook, board) {
        let x = rook[0];
        let y = rook[1];
        let allowableMoves = [];
        //In Left direction
        for (let j = y - 1; j >= 0; j--) {
            if (board[x][j] !== 0) break;
            let move = [x, j];
            //Creating Temporary Board
            let temp_board = JSON.parse(JSON.stringify(board));
            //immitating move to get arrow moves
            temp_board[x][y] = 0;
            temp_board[x][j] = 1;
            let allowableArrowMoves = getAllowableArrowMoves(move, temp_board);
            let rookMove = new RookMove(move, allowableArrowMoves);
            let moveQuality = getMoveQuality(move);
            rookMove.updateQuality(moveQuality);
            allowableMoves.push(rookMove);
        }

        //In Right direction
        for (let j = y + 1; j < 10; j++) {
            if (board[x][j] !== 0) break;
            let move = [x, j];
            //Creating Temporary Board
            let temp_board = JSON.parse(JSON.stringify(board));
            //immitating move to get arrow moves
            temp_board[x][y] = 0;
            temp_board[x][j] = 1;
            let allowableArrowMoves = getAllowableArrowMoves(move, temp_board);
            let rookMove = new RookMove(move, allowableArrowMoves);
            let moveQuality = getMoveQuality(move);
            rookMove.updateQuality(moveQuality);
            allowableMoves.push(rookMove);
        }

        //In Up direction
        for (let j = x - 1; j >= 0; j--) {
            if (board[j][y] !== 0) break;
            let move = [j, y];
            //Creating Temporary Board
            let temp_board = JSON.parse(JSON.stringify(board));
            //immitating move to get arrow moves
            temp_board[x][y] = 0;
            temp_board[j][y] = 1;
            let allowableArrowMoves = getAllowableArrowMoves(move, temp_board);
            let rookMove = new RookMove(move, allowableArrowMoves);
            let moveQuality = getMoveQuality(move);
            rookMove.updateQuality(moveQuality);
            allowableMoves.push(rookMove);
        }

        //In Down direction
        for (let j = x + 1; j < 10; j++) {
            if (board[j][y] !== 0) break;
            let move = [j, y];
            //Creating Temporary Board
            let temp_board = JSON.parse(JSON.stringify(board));
            //immitating move to get arrow moves
            temp_board[x][y] = 0;
            temp_board[j][y] = 1;
            let allowableArrowMoves = getAllowableArrowMoves(move, temp_board);
            let rookMove = new RookMove(move, allowableArrowMoves);
            let moveQuality = getMoveQuality(move);
            rookMove.updateQuality(moveQuality);
            allowableMoves.push(rookMove);
        }
        return allowableMoves;
    }

    function getAllowableArrowMoves(rook, board) {
        let x = rook[0];
        let y = rook[1];
        let allowableMoves = [];

        //In Left direction
        for (let j = y - 1; j >= 0; j--) {
            if (board[x][j] !== 0) break;
            let move = [x, j];
            let arrow = new ArrowMove(move);
            let arrowQuality = getArrowQuality(move);
            arrow.updateQuality(arrowQuality);
            allowableMoves.push(arrow);
        }

        //In Right direction
        for (let j = y + 1; j < 10; j++) {
            if (board[x][j] !== 0) break;
            let move = [x, j];
            let arrow = new ArrowMove(move);
            let arrowQuality = getArrowQuality(move);
            arrow.updateQuality(arrowQuality);
            allowableMoves.push(arrow);
        }

        //In Up direction
        for (let j = x - 1; j >= 0; j--) {
            if (board[j][y] !== 0) break;
            let move = [j, y];
            let arrow = new ArrowMove(move);
            let arrowQuality = getArrowQuality(move);
            arrow.updateQuality(arrowQuality);
            allowableMoves.push(arrow);
        }

        //In Down direction
        for (let j = x + 1; j < 10; j++) {
            if (board[j][y] !== 0) break;
            let move = [j, y];
            let arrow = new ArrowMove(move);
            let arrowQuality = getArrowQuality(move);
            arrow.updateQuality(arrowQuality);
            allowableMoves.push(arrow);
        }
        return allowableMoves;
    }

    //Filtering trapped Rooks
    let movableRooks = myRooks.filter(o => o.allowableMoves.length !== 0);

    //Consolidating Moves
    let myRooksMoves = [];
    for (let i = 0; i < movableRooks.length; i++) {
        for (let j = 0; j < movableRooks[i].allowableMoves.length; j++) {
            for (let k = 0; k < movableRooks[i].allowableMoves[j].allowableArrowMoves.length; k++) {
                let myRookMove = {
                    'rook': movableRooks[i].rook.toString(),
                    'rookMove': movableRooks[i].allowableMoves[j].rookMove.toString(),
                    'moveQuality': movableRooks[i].allowableMoves[j].moveQuality,
                    'arrowMove': movableRooks[i].allowableMoves[j].allowableArrowMoves[k].arrowMove.toString(),
                    'arrowQuality': movableRooks[i].allowableMoves[j].allowableArrowMoves[k].arrowQuality,
                    'overallQuality': movableRooks[i].allowableMoves[j].moveQuality * movableRooks[i].allowableMoves[j].allowableArrowMoves[k].arrowQuality
                }
                myRooksMoves.push(myRookMove);
            }
        }
    }

    //Filter Best Moves based on its quality
    let bestMoves = myRooksMoves.filter(o => o.overallQuality === myRooksMoves.map(o => o.overallQuality).reduce((a, b) => a > b ? a : b));
    //Randomly picking move out of best moves
    let bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    printSolution(bestMove);

    app.get('/', (req, res) => {
        res.send(myRooksMoves);
    });

    app.get('/best', (req, res) => {
        res.send(bestMoves);
    });

    app.listen(3000);

}
main();