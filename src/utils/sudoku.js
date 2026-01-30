import randInt from "./randInt.js";



class Sudoku {
    #emptySymbol = "X";
    #boardWidth = 9;
    #boardHeight = 9;
    #board = [];
    #emptyBoardPositions = [];


    constructor() {
        this.#buildBoard();
    };


    #buildBoard() {
        this.#board = [];
        for (let row = 0; row < this.#boardHeight; row += 1) {
            const boardRow = [];
            for (let col = 0; col < this.#boardWidth; col += 1) {
                boardRow.push(this.#emptySymbol);
                this.#emptyBoardPositions.push([row, col]);
            }
            this.#board.push(boardRow);
        }
    };


    fillBoard() {
        this.#fillBoardRec(this.#board, 0, 0, new Set());
        console.table(this.#board)
    };

    
    #fillBoardRec(board, row, col, visited) {
        const rowValid = 0 <= row && row < board.length;
        const colValid = 0 <= col && col < board[0].length;
        if (!rowValid || !colValid) {
            return true;
        }
        const key = JSON.stringify([row, col]);
        if (visited.has(key)) {
            return true;
        }

        const neighbors = [
            [row - 1, col], [row + 1, col],
            [row, col - 1], [row, col + 1]
        ];

        let nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

        while (true) {
            visited.add(key);
            const numIdxUsed = this.#placeNum(board, row, col, nums);
            if (numIdxUsed === null) {
                visited.delete(key);
                return false;
            }

            let placementSucessfull = true;
            for (let neighbor of neighbors) {
                const [nRow, nCol] = neighbor;
                if (!this.#fillBoardRec(board, nRow, nCol, visited)) {
                    placementSucessfull = false;
                    board[row][col] = this.#emptySymbol;
                    break;
                }
            }
            if (placementSucessfull) {
                break;
            }
            
            nums.splice(numIdxUsed, 1);
        }

        return true;
    };


    #placeNum(board, row, col, nums) {
        nums = nums.slice();
        while (nums.length > 0) {
            const randIdx = randInt(0, nums.length - 1);
            const randNum = nums[randIdx];
            if (this.#validPlacement(row, col, randNum)) {
                board[row][col] = randNum;
                return randIdx;
            }
            
            const firstHalf = nums.slice(0, randIdx);
            const secondHalf = nums.slice(randIdx + 1);
            nums = firstHalf.concat(secondHalf);
        }
        return null;
    };


    #validPlacement(row, col, num) {
        const foundNum = this.#findNumber(this.#board, row, col, num);
        return foundNum === false;
    };


    #searchSubGrid(board, row, col, targetNum) {
        let rowMin = 0;
        let rowMax = 3;
        if (row >= 3 && row < 6) {
            rowMin = 3;
            rowMax = 6;
        } else if (row >= 6) {
            rowMin = 6;
            rowMax = 9;
        }
        let colMin = 0;
        let colMax = 3;
        if (col >= 3 && col < 6) {
            colMin = 3;
            colMax = 6;
        } else if (col >= 6) {
            colMin = 6;
            colMax = 9;
        }

        for (let rowIdx = rowMin; rowIdx < rowMax; rowIdx += 1) {
            for (let colIdx = colMin; colIdx < colMax; colIdx += 1) {
                if (board[rowIdx][colIdx] === targetNum) {
                    return true;
                }
            }
        }
        return false;
    };

    
    #findNumber(board, row, col, targetNum) {
        const verticalPosDeltas = [[1, 0], [-1, 0]];
        const horizontalPosDeltas = [[0, 1], [0, -1]];

        const verticalFound = this.#findNumberRec(board, row, col, new Set(), verticalPosDeltas, targetNum);
        if (verticalFound) {
            return true;
        }
        const horizontalFound = this.#findNumberRec(board, row, col, new Set(), horizontalPosDeltas, targetNum);
        if (horizontalFound) {
            return true;
        }

        return this.#searchSubGrid(board, row, col, targetNum);
    };


    #findNumberRec(board, row, col, visited, posChanges, targetNum) {
        const rowValid = 0 <= row && row < board.length;
        const colValid = 0 <= col && col < board[0].length;
        if (!rowValid || !colValid) {
            return false;
        }
        const num = board[row][col];
        if (num === targetNum) {
            return true;
        }
        const key = JSON.stringify([row, col]);
        if (visited.has(key)) {
            return false;
        }

        visited.add(key);
        for (let posChange of posChanges) {
            const [rowChange, colChange] = posChange;
            const nRow = rowChange + row;
            const nCol = colChange + col;
            const found = this.#findNumberRec(board, nRow, nCol, visited, posChanges, targetNum);
            if (found) {
                return true;
            }
        }
        return false;
    };
};


const sudoku = new Sudoku();
sudoku.fillBoard()