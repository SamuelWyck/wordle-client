class TwentyFourtyEight {
    #board;
    #boardWidth;
    #boardHeight;

    #emptySymbol = 0;
    #startNumber;
    
    #score;
    #targetNumber;
    #validTargetNums = new Set([512, 1024, 2048]);

    #gameWon = false;
    #gameLost = false;

    #swipeUp = 1;
    #swipeLeft = 2;
    #swipeDown = 3;
    #swipeRight = 4;

    #cellSwipePositionDeltaMap = {
        1: [-1, 0], 2: [0, -1], 3: [1, 0], 4: [0, 1]
    };

    constructor(width, height, startNumber) {
        this.#boardWidth = width;
        this.#boardHeight = height;
        this.#startNumber = startNumber;

        this.#score = 0;

        this.#board = this.#buildBoard();
    };


    startGame(targetNum) {
        if (!this.#validTargetNums.has(targetNum)) {
            targetNum = 2048;
        }
        this.#targetNumber = targetNum;

        this.#clearBoard();
        this.#score = 0;
        this.#gameLost = false;
        this.#gameWon = false;
        const firstStartTile = this.#placeStartNumber();
        const secondStartTile = this.#placeStartNumber();

        return [firstStartTile, secondStartTile];
    };
    
    
    getBoard() {
        return this.#board;
    };


    checkGameOver() {
        if (this.#gameWon) {
            return 1;
        }
        if (this.#gameLost) {
            return -1;
        }
        return 0;
    };
    

    swipeBoardUp() {
        if (this.#gameLost || this.#gameWon) {
            return [{}, {}];
        }

        const movedTiles = this.#swipeBoard(this.#swipeUp);
        if (Object.keys(movedTiles).length === 0) {
            return [movedTiles, {}];
        }

        const filledTileCoords = this.#placeStartNumber();
        this.#updateGameStatus();

        return [movedTiles, filledTileCoords];
    };
    

    swipeBoardRight() {
        if (this.#gameLost || this.#gameWon) {
            return [{}, {}];
        }

        const movedTiles = this.#swipeBoard(this.#swipeRight);
        if (Object.keys(movedTiles).length === 0) {
            return [movedTiles, {}];
        }

        const filledTileCoords = this.#placeStartNumber();
        this.#updateGameStatus();

        return [movedTiles, filledTileCoords];
    };
    
    
    swipeBoardDown() {
        if (this.#gameLost || this.#gameWon) {
            return [{}, {}];
        }

        const movedTiles = this.#swipeBoard(this.#swipeDown);
        if (Object.keys(movedTiles).length === 0) {
            return [movedTiles, {}];
        }

        const filledTileCoords = this.#placeStartNumber();
        this.#updateGameStatus();
        
        return [movedTiles, filledTileCoords];
    };
    
    
    swipeBoardLeft() {
        if (this.#gameLost || this.#gameWon) {
            return [{}, {}];
        }

        const movedTiles = this.#swipeBoard(this.#swipeLeft);
        if (Object.keys(movedTiles).length === 0) {
            return [movedTiles, {}];
        }

        const filledTileCoords = this.#placeStartNumber();
        this.#updateGameStatus();

        return [movedTiles, filledTileCoords];
    };


    getScore() {
        return this.#score;
    };

    
    #clearBoard() {
        for (let row = 0; row < this.#boardHeight; row += 1) {
            for (let col = 0; col < this.#boardWidth; col += 1) {
                this.#board[row][col] = this.#emptySymbol;
            }
        }
    };


    #updateGameStatus() {
        for (let row = 0; row < this.#board.length; row += 1) {
            for (let col = 0; col < this.#board[0].length; col += 1) {
                const pos = this.#board[row][col];
                if (pos === this.#targetNumber) {
                    this.#gameWon = true;
                    return;
                }
            }
        }

        for (let row = 0; row < this.#board.length; row += 1) {
            for (let col = 0; col < this.#board[0].length; col += 1) {
                const pos = this.#board[row][col];
                if (pos === this.#emptySymbol) {
                    return;
                }
                if (this.#canMerge(row, col)) {
                    return;
                }
            }
        }

        this.#gameLost = true;
    };


    #canMerge(row, col) {
        const neighbors = [
            [row - 1, col], [row + 1, col],
            [row, col - 1], [row, col + 1]
        ];

        const currNum = this.#board[row][col];

        for (let neighbor of neighbors) {
            const [nRow, nCol] = neighbor;
            const rowValid = 0 <= nRow && nRow < this.#board.length;
            const colValid = 0 <= nCol && nCol < this.#board[0].length;
            if (!rowValid || !colValid) {
                continue;
            }

            const neighborNum = this.#board[nRow][nCol];
            if (neighborNum === currNum) {
                return true;
            }
        }

        return false;
    };


    #placeStartNumber() {
        const [row, col] = this.#getRandomEmptyCoords();
        this.#board[row][col] = this.#startNumber;
        return {newRow: row, newCol: col};
    };
    

    #getRandomEmptyCoords() {
        const emptyCoords = [];
        for (let row = 0; row < this.#board.length; row += 1) {
            for (let col = 0; col < this.#board[0].length; col += 1) {
                if (this.#board[row][col] === this.#emptySymbol) {
                    emptyCoords.push([row, col]);
                }
            }
        }

        const randIdx = this.#randInt(0, emptyCoords.length - 1);
        return emptyCoords[randIdx];
    };


    #buildBoard() {
        const board = [];
        for (let row = 0; row < this.#boardHeight; row += 1) {
            const boardRow = [];
            for (let col = 0; col < this.#boardWidth; col += 1) {
                boardRow.push(this.#emptySymbol);
            }
            board.push(boardRow);
        }
        return board;
    };


    #swipeBoard(swipeDirection) {
        let rowStart = 0;
        let rowEnd = this.#boardHeight;
        let rowChange = 1;
        let colStart = 0;
        let colEnd = this.#boardWidth;
        let colChange = 1;
 
        if (swipeDirection === this.#swipeDown) {
            rowStart = this.#boardHeight - 1;
            rowEnd = -1;
            rowChange = -1;
            colStart = 0;
            colEnd = this.#boardWidth;
            colChange = 1;
        } else if (swipeDirection === this.#swipeRight) {
            rowStart = 0;
            rowEnd = this.#boardHeight;
            rowChange = 1;
            colStart = this.#boardWidth - 1;
            colEnd = -1;
            colChange = -1;
        }

        const mergedTilePositions = new Set();
        const movedTilesInfo = {};

        for (let row = rowStart; row !== rowEnd; row += rowChange) {
            for (let col = colStart; col !== colEnd; col += colChange) {
                const cell = this.#board[row][col];
                if (cell !== this.#emptySymbol) {
                    const movementInfo = this.#moveNumber(row, col, swipeDirection, mergedTilePositions);
                    if (movementInfo !== null) {
                        const pos = JSON.stringify([row, col]);
                        movedTilesInfo[pos] = movementInfo;
                    }
                }
            }
        }

        return movedTilesInfo;
    };


    #moveNumber(row, col, swipeDirection, mergedTilePos) {
        const numPosDelta = this.#cellSwipePositionDeltaMap[swipeDirection];
        const numToMove = this.#board[row][col];
        const hasMerged = false;
        const firstCall = true;

        return this.#moveNumberRec(
            this.#board, row, col, numToMove, numPosDelta, hasMerged, mergedTilePos, firstCall
        );
    };


    #moveNumberRec(board, row, col, numToMove, positionDelta, hasMerged, prevMergedTilePos, firstCall) {
        const rowValid = 0 <= row && row < board.length;
        const colValid = 0 <= col && col < board[0].length;
        if (!rowValid || !colValid) {
            return null;
        }
        const currentPos = board[row][col];
        if (currentPos !== this.#emptySymbol && currentPos !== numToMove) {
            return null;
        }
        const posKey = JSON.stringify([row, col]);
        if (currentPos === numToMove && (hasMerged || prevMergedTilePos.has(posKey))) {
            return null;
        }

        if (currentPos === numToMove && !firstCall) {
            numToMove *= 2;
            this.#score += numToMove;
            hasMerged = true;
        }

        const [rowChange, colChange] = positionDelta;
        const nRow = row + rowChange;
        const nCol = col + colChange;

        board[row][col] = this.#emptySymbol;
        const finalPosInfo = this.#moveNumberRec(
            board, nRow, nCol, 
            numToMove, positionDelta, 
            hasMerged, prevMergedTilePos, false
        );
        if (finalPosInfo === null) {
            board[row][col] = numToMove;
            if (hasMerged) {
                prevMergedTilePos.add(posKey);
            }
        }

        if (firstCall && finalPosInfo === null) {
            return null;
        } else if (finalPosInfo === null) {
            return {row: row, col: col, num: numToMove};
        }
        return finalPosInfo;
    };


    #randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
};



export default TwentyFourtyEight;