'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

    var STDIN = ['0 0 0 2 -1 0 2 0 0 0\r', '0 0 0 -1 0 0 0 0 0 0\r', '0 0 0 0 0 0 0 0 0 0\r', '2 0 0 1 0 0 0 0 0 2\r', '0 0 0 0 0 0 0 0 0 0\r', '-1 0 0 0 0 0 0 0 0 -1\r', '1 -1 0 0 0 0 0 0 -1 1\r', '-1 0 0 0 0 0 0 0 0 -1\r', '0 0 0 0 0 0 -1 0 0 0\r', '0 0 0 0 0 -1 1 -1 0 0\r', '1'];

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

    for (var _i = 0; _i < board.length; _i++) {
        for (var _j = 0; _j < board[_i].length; _j++) {
            if (board[_i][_j] === myself) {
                myRooksPosition.push([_i, _j]);
            } else if (board[_i][_j] === opponent) {
                opponentRooksPosition.push([_i, _j]);
                opponentAllowableMoves.push.apply(opponentAllowableMoves, _toConsumableArray(getAllowableMoves([_i, _j], board)));
            } else if (board[_i][_j] === 0) {
                blankPositions.push([_i, _j]);
            }
        }
    };

    function getAllowableMoves(rook, board) {
        var x = rook[0];
        var y = rook[1];
        var allowableMoves = [];

        //In Left direction
        for (var _j2 = y - 1; _j2 >= 0; _j2--) {
            if (board[x][_j2] !== 0) break;
            var move = [x, _j2];
            allowableMoves.push(move);
        }

        //In Right direction
        for (var _j3 = y + 1; _j3 < 10; _j3++) {
            if (board[x][_j3] !== 0) break;
            var _move = [x, _j3];
            allowableMoves.push(_move);
        }

        //In Up direction
        for (var _j4 = x - 1; _j4 >= 0; _j4--) {
            if (board[_j4][y] !== 0) break;
            var _move2 = [_j4, y];
            allowableMoves.push(_move2);
        }

        //In Down direction
        for (var _j5 = x + 1; _j5 < 10; _j5++) {
            if (board[_j5][y] !== 0) break;
            var _move3 = [_j5, y];
            allowableMoves.push(_move3);
        }
        return allowableMoves;
    }

    var boardAvailabity = (blankPositions.length / 92 * 100).toFixed(2);
    var playingMode;

    if (boardAvailabity > 90) {
        playingMode = 'ATTACKING';
    } else {
        playingMode = 'DEFENDING';
    }

    ///////////////////////////////////////////////////////////////
    //////////////////////MOVE QUALITY CHECK//////////////////////
    ///////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////
    function getMoveQuality(movePosition) {
        var sum = 0;

        //Arrow Close to Opponent
        var distance = [];
        for (var _i2 = 0; _i2 < opponentRooksPosition.length; _i2++) {
            distance.push(getDistance(movePosition, opponentRooksPosition[_i2]));
        }
        for (var _i3 = 0; _i3 < myRooksPosition.length; _i3++) {
            distance.push(getDistance(movePosition, myRooksPosition[_i3]));
        }
        sum += distance.reduce(function (a, b) {
            return a < b ? a : b;
        });

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
        var sum = 0;

        //Arrow Close to Opponent
        var distance = [];
        for (var _i4 = 0; _i4 < opponentRooksPosition.length; _i4++) {
            distance.push(getDistance(arrowPosition, opponentRooksPosition[_i4]));
        }
        sum -= distance.reduce(function (a, b) {
            return a < b ? a : b;
        });

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
        this.allowableArrowMoves = arrowMoves;
    }

    RookMove.prototype.updateQuality = function (value) {
        this.moveQuality = this.moveQuality + parseFloat(value);
    };

    function ArrowMove(move) {
        this.arrowMove = move;
        this.arrowQuality = 50;
    }

    ArrowMove.prototype.updateQuality = function (value) {
        this.arrowQuality = this.arrowQuality + parseFloat(value);
    };

    function getDistance(coordinateA, coordinateB) {
        return Math.sqrt(Math.pow(coordinateA[0] - coordinateB[0], 2) + Math.pow(coordinateA[1] - coordinateB[1], 2)).toFixed(2);
    };

    for (var _i5 = 0; _i5 < board.length; _i5++) {
        for (var _j6 = 0; _j6 < board[_i5].length; _j6++) {
            if (board[_i5][_j6] === myself) {
                var rook = new Rook([_i5, _j6]);
                myRooks.push(rook);
            } else if (board[_i5][_j6] === opponent) {
                var rook = new Rook([_i5, _j6]);
                opponentRooks.push(rook);
            }
        }
    };

    function getAllowableMovesForRook(rook, board) {
        var x = rook[0];
        var y = rook[1];
        var allowableMoves = [];
        //In Left direction
        for (var _j7 = y - 1; _j7 >= 0; _j7--) {
            if (board[x][_j7] !== 0) break;
            var move = [x, _j7];
            //Creating Temporary Board
            var temp_board = JSON.parse(JSON.stringify(board));
            //immitating move to get arrow moves
            temp_board[x][y] = 0;
            temp_board[x][_j7] = 1;
            var allowableArrowMoves = getAllowableArrowMoves(move, temp_board);
            var rookMove = new RookMove(move, allowableArrowMoves);
            var moveQuality = getMoveQuality(move);
            rookMove.updateQuality(moveQuality);
            allowableMoves.push(rookMove);
        }

        //In Right direction
        for (var _j8 = y + 1; _j8 < 10; _j8++) {
            if (board[x][_j8] !== 0) break;
            var _move4 = [x, _j8];
            //Creating Temporary Board
            var _temp_board = JSON.parse(JSON.stringify(board));
            //immitating move to get arrow moves
            _temp_board[x][y] = 0;
            _temp_board[x][_j8] = 1;
            var _allowableArrowMoves = getAllowableArrowMoves(_move4, _temp_board);
            var _rookMove = new RookMove(_move4, _allowableArrowMoves);
            var _moveQuality = getMoveQuality(_move4);
            _rookMove.updateQuality(_moveQuality);
            allowableMoves.push(_rookMove);
        }

        //In Up direction
        for (var _j9 = x - 1; _j9 >= 0; _j9--) {
            if (board[_j9][y] !== 0) break;
            var _move5 = [_j9, y];
            //Creating Temporary Board
            var _temp_board2 = JSON.parse(JSON.stringify(board));
            //immitating move to get arrow moves
            _temp_board2[x][y] = 0;
            _temp_board2[_j9][y] = 1;
            var _allowableArrowMoves2 = getAllowableArrowMoves(_move5, _temp_board2);
            var _rookMove2 = new RookMove(_move5, _allowableArrowMoves2);
            var _moveQuality2 = getMoveQuality(_move5);
            _rookMove2.updateQuality(_moveQuality2);
            allowableMoves.push(_rookMove2);
        }

        //In Down direction
        for (var _j10 = x + 1; _j10 < 10; _j10++) {
            if (board[_j10][y] !== 0) break;
            var _move6 = [_j10, y];
            //Creating Temporary Board
            var _temp_board3 = JSON.parse(JSON.stringify(board));
            //immitating move to get arrow moves
            _temp_board3[x][y] = 0;
            _temp_board3[_j10][y] = 1;
            var _allowableArrowMoves3 = getAllowableArrowMoves(_move6, _temp_board3);
            var _rookMove3 = new RookMove(_move6, _allowableArrowMoves3);
            var _moveQuality3 = getMoveQuality(_move6);
            _rookMove3.updateQuality(_moveQuality3);
            allowableMoves.push(_rookMove3);
        }
        return allowableMoves;
    }

    function getAllowableArrowMoves(rook, board) {
        var x = rook[0];
        var y = rook[1];
        var allowableMoves = [];

        //In Left direction
        for (var _j11 = y - 1; _j11 >= 0; _j11--) {
            if (board[x][_j11] !== 0) break;
            var move = [x, _j11];
            var arrow = new ArrowMove(move);
            var arrowQuality = getArrowQuality(move);
            arrow.updateQuality(arrowQuality);
            allowableMoves.push(arrow);
        }

        //In Right direction
        for (var _j12 = y + 1; _j12 < 10; _j12++) {
            if (board[x][_j12] !== 0) break;
            var _move7 = [x, _j12];
            var _arrow = new ArrowMove(_move7);
            var _arrowQuality = getArrowQuality(_move7);
            _arrow.updateQuality(_arrowQuality);
            allowableMoves.push(_arrow);
        }

        //In Up direction
        for (var _j13 = x - 1; _j13 >= 0; _j13--) {
            if (board[_j13][y] !== 0) break;
            var _move8 = [_j13, y];
            var _arrow2 = new ArrowMove(_move8);
            var _arrowQuality2 = getArrowQuality(_move8);
            _arrow2.updateQuality(_arrowQuality2);
            allowableMoves.push(_arrow2);
        }

        //In Down direction
        for (var _j14 = x + 1; _j14 < 10; _j14++) {
            if (board[_j14][y] !== 0) break;
            var _move9 = [_j14, y];
            var _arrow3 = new ArrowMove(_move9);
            var _arrowQuality3 = getArrowQuality(_move9);
            _arrow3.updateQuality(_arrowQuality3);
            allowableMoves.push(_arrow3);
        }
        return allowableMoves;
    }

    //Filtering trapped Rooks
    var movableRooks = myRooks.filter(function (o) {
        return o.allowableMoves.length !== 0;
    });

    //Consolidating Moves
    var myRooksMoves = [];
    for (var _i6 = 0; _i6 < movableRooks.length; _i6++) {
        for (var _j15 = 0; _j15 < movableRooks[_i6].allowableMoves.length; _j15++) {
            for (var k = 0; k < movableRooks[_i6].allowableMoves[_j15].allowableArrowMoves.length; k++) {
                var myRookMove = {
                    'rook': movableRooks[_i6].rook.toString(),
                    'rookMove': movableRooks[_i6].allowableMoves[_j15].rookMove.toString(),
                    'moveQuality': movableRooks[_i6].allowableMoves[_j15].moveQuality,
                    'arrowMove': movableRooks[_i6].allowableMoves[_j15].allowableArrowMoves[k].arrowMove.toString(),
                    'arrowQuality': movableRooks[_i6].allowableMoves[_j15].allowableArrowMoves[k].arrowQuality,
                    'overallQuality': movableRooks[_i6].allowableMoves[_j15].moveQuality * movableRooks[_i6].allowableMoves[_j15].allowableArrowMoves[k].arrowQuality
                };
                myRooksMoves.push(myRookMove);
            }
        }
    }

    //Filter Best Moves based on its quality
    var bestMoves = myRooksMoves.filter(function (o) {
        return o.overallQuality === myRooksMoves.map(function (o) {
            return o.overallQuality;
        }).reduce(function (a, b) {
            return a > b ? a : b;
        });
    });
    //Randomly picking move out of best moves
    var bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    printSolution(bestMove);

    app.get('/', function (req, res) {
        res.send(myRooksMoves);
    });

    app.get('/best', function (req, res) {
        res.send(bestMoves);
    });

    app.listen(3000);
}
main();