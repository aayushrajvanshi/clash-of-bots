"use strict";

process.stdin.resume();
process.stdin.setEncoding('ascii');

var input_stdin = "";
var input_stdin_array = "";
var input_currentline = 0;

process.stdin.on('data', function (data) {
    input_stdin += data;
});

process.stdin.on('end', function () {
    input_stdin_array = input_stdin.split("\n");
    main();
});

function readLine() {
    return input_stdin_array[input_currentline++];
}

function main() {
    var data = ['0 0 0 0 0 0 0 0 0 0\r', '0 0 0 0 0 0 0 0 0 0\r', '0 0 0 -1 -1 -1 0 0 0 0\r', '0 0 -1 0 1 -1 -1 0 0 0\r', '0 0 0 -1 -1 -1 0 0 0 0\r', '0 0 0 0 0 0 0 0 0 0\r', '0 0 0 0 0 0 0 0 0 0\r', '0 0 0 0 0 0 0 0 0 0\r', '0 0 0 0 0 0 0 0 0 0\r', '0 0 0 0 0 0 0 0 0 0\r', '1'];

    var parseArray = [];
    for (var i = 0; i < 10; i++) {
        parseArray.push(data[i].replace('\r', '').split(' ').map(function (o) {
            return parseInt(o);
        }));
    }
    var arr = parseArray;

    for (var i = 10; i < 11; i++) {
        var player = parseInt(data[i]);
    }

    //Function to print solution
    var printSolution = function printSolution(startPosition, endPosition, arrowPosition) {
        console.log(startPosition.toString().split(',').join(' '));
        console.log(endPosition.toString().split(',').join(' '));
        console.log(arrowPosition.toString().split(',').join(' '));
    };

    //Function to calculate distance between two points
    var getDistance = function getDistance(coordinateA, coordinateB) {
        return Math.sqrt(Math.pow(coordinateA[0] - coordinateB[0], 2) + Math.pow(coordinateA[1] - coordinateB[1], 2));
    };

    var firstPlayerPositions = [];
    var secondPlayerPositions = [];
    var blockedPositions = [];
    var arrowPositions = [];
    var blankPositions = [];

    var getPositions = function getPositions() {
        for (var _i = 0; _i < arr.length; _i++) {
            for (var j = 0; j < arr[_i].length; j++) {
                if (arr[_i][j] === 1) {
                    firstPlayerPositions.push([_i, j]);
                    blockedPositions.push([_i, j]);
                } else if (arr[_i][j] === 2) {
                    secondPlayerPositions.push([_i, j]);
                    blockedPositions.push([_i, j]);
                } else if (arr[_i][j] === -1) {
                    arrowPositions.push([_i, j]);
                    blockedPositions.push([_i, j]);
                } else {
                    blankPositions.push([_i, j]);
                }
            }
        }
    };

    var getRookMovablePositions = function getRookMovablePositions(currentPosition, blockedPositions) {
        var x = currentPosition[0];
        var y = currentPosition[1];
        var allowablePositions = [];
        var userBlockedPositionLeft = [];
        var userBlockedPositionRight = [];
        var userBlockedPositionUp = [];
        var userBlockedPositionDown = [];

        for (var _i2 = 0; _i2 < blockedPositions.length; _i2++) {
            if (blockedPositions[_i2][0] === x && blockedPositions[_i2].toString() !== currentPosition.toString() && blockedPositions[_i2][1] < y) {
                userBlockedPositionLeft.push({
                    'coordinate': [x, blockedPositions[_i2][1]],
                    'distance': getDistance(currentPosition, [x, blockedPositions[_i2][1]])
                });
            } else if (blockedPositions[_i2][0] === x && blockedPositions[_i2].toString() !== currentPosition.toString() && blockedPositions[_i2][1] > y) {
                userBlockedPositionRight.push({
                    'coordinate': [x, blockedPositions[_i2][1]],
                    'distance': getDistance(currentPosition, [x, blockedPositions[_i2][1]])
                });
            };

            if (blockedPositions[_i2][1] === y && blockedPositions[_i2].toString() !== currentPosition.toString() && blockedPositions[_i2][0] < x) {
                userBlockedPositionUp.push({
                    'coordinate': [blockedPositions[_i2][0], y],
                    'distance': getDistance(currentPosition, [blockedPositions[_i2][0], y])
                });
            } else if (blockedPositions[_i2][1] === y && blockedPositions[_i2].toString() !== currentPosition.toString() && blockedPositions[_i2][0] > x) {
                userBlockedPositionDown.push({
                    'coordinate': [blockedPositions[_i2][0], y],
                    'distance': getDistance(currentPosition, [blockedPositions[_i2][0], y])
                });
            };
        }

        var nearestBlockedLeft = userBlockedPositionLeft.filter(function (o) {
            return o.distance === userBlockedPositionLeft.map(function (o) {
                return o.distance;
            }).reduce(function (a, b) {
                return a < b ? a : b;
            });
        });
        var nearestBlockedRight = userBlockedPositionRight.filter(function (o) {
            return o.distance === userBlockedPositionRight.map(function (o) {
                return o.distance;
            }).reduce(function (a, b) {
                return a < b ? a : b;
            });
        });
        var nearestBlockedUp = userBlockedPositionUp.filter(function (o) {
            return o.distance === userBlockedPositionUp.map(function (o) {
                return o.distance;
            }).reduce(function (a, b) {
                return a < b ? a : b;
            });
        });
        var nearestBlockedDown = userBlockedPositionDown.filter(function (o) {
            return o.distance === userBlockedPositionDown.map(function (o) {
                return o.distance;
            }).reduce(function (a, b) {
                return a < b ? a : b;
            });
        });

        if (nearestBlockedLeft.length === 0) {
            nearestBlockedLeft.push({
                'coordinate': [x, -1],
                'distance': getDistance(currentPosition, [x, -1])
            });
        }

        if (nearestBlockedRight.length === 0) {
            nearestBlockedRight.push({
                'coordinate': [x, 10],
                'distance': getDistance(currentPosition, [x, 10])
            });
        }

        if (nearestBlockedUp.length === 0) {
            nearestBlockedUp.push({
                'coordinate': [-1, y],
                'distance': getDistance(currentPosition, [-1, y])
            });
        }

        if (nearestBlockedDown.length === 0) {
            nearestBlockedDown.push({
                'coordinate': [10, y],
                'distance': getDistance(currentPosition, [10, y])
            });
        }
        while (nearestBlockedLeft[0].coordinate[1] + 1 < nearestBlockedRight[0].coordinate[1]) {
            var posArr = new Array(x, nearestBlockedLeft[0].coordinate[1] + 1);
            if (posArr.toString() !== currentPosition.toString()) {
                allowablePositions.push(posArr);
            }
            nearestBlockedLeft[0].coordinate[1]++;
        }

        while (nearestBlockedUp[0].coordinate[0] + 1 < nearestBlockedDown[0].coordinate[0]) {
            var posArr = new Array(nearestBlockedUp[0].coordinate[0] + 1, y);
            if (posArr.toString() !== currentPosition.toString()) {
                allowablePositions.push(posArr);
            }
            nearestBlockedUp[0].coordinate[0]++;
        }
        return allowablePositions;
    };

    var moveRook = function () {
        getPositions();
        //Picking random Rook or starting Position
        var myRooks;
        if (player === 1) {
            myRooks = firstPlayerPositions;
        } else {
            myRooks = secondPlayerPositions;
        };

        var movableRooks = myRooks.filter(function (o) {
            return getRookMovablePositions(o, blockedPositions).length !== 0;
        });

        if (movableRooks.length !== 0) {

            var startPosition = movableRooks[Math.floor(Math.random() * movableRooks.length)];
            //Getting Rook Movable Positions
            var allowablePositions = getRookMovablePositions(startPosition, blockedPositions);
            //Picking random end Position
            var endPosition = allowablePositions[Math.floor(Math.random() * allowablePositions.length)];
            //Getting Arrow Throwable Positions
            var newBlockedPositions = blockedPositions.filter(function (o) {
                return o.toString() !== startPosition.toString();
            });
            newBlockedPositions.push(endPosition);
            var allowableArrowPositions = getRookMovablePositions(endPosition, newBlockedPositions);
            //Picking random arrow Position
            var arrowPosition = allowableArrowPositions[Math.floor(Math.random() * allowableArrowPositions.length)];
            printSolution(startPosition, endPosition, arrowPosition);
        } else {
            return;
        }
    }();
}
main();