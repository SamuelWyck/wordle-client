import randInt from "./randInt.js";



class Sudoku {
    #emptySymbol = "X";
    #boardWidth = 9;
    #boardHeight = 9;
    #board = [];


    constructor() {
        this.#buildBoard();
    };


    #buildBoard() {
        this.#board = [];
        for (let row = 0; row < this.#boardHeight; row += 1) {
            const boardRow = [];
            for (let col = 0; col < this.#boardWidth; col += 1) {
                boardRow.push(this.#emptySymbol);
            }
            this.#board.push(boardRow);
        }
    };


    removeNumbers() {
        const lowerBound = 45;
        const higherBound = 51;
        let numsToRemove = randInt(lowerBound, higherBound);
        while (numsToRemove > 0) {
            const [row, col] = this.#randNonEmptyPos();

            const posNum = this.#board[row][col];
            this.#board[row][col] = this.#emptySymbol;

            const solvable = this.#solveBoardRec(this.#board);
            if (!solvable) {
                numsToRemove += 1;
                this.#board[row][col] = posNum;
            }
            numsToRemove -= 1;
        }
        console.table(this.#board)
    };


    #randNonEmptyPos() {
        while (true) {
            const randRow = randInt(0, this.#board.length - 1);
            const randCol = randInt(0, this.#board[0].length - 1);
            if (this.#board[randRow][randCol] !== this.#emptySymbol) {
                return [randRow, randCol];
            }
        }
    };


    #solveBoardRec(board) {
        const emptyPositions = [];
        for (let row = 0; row < board.length; row += 1) {
            for (let col = 0; col < board[0].length; col += 1) {
                const pos = board[row][col];
                if (pos === this.#emptySymbol) {
                    emptyPositions.push([row, col]);
                }
            }
        }

        if (emptyPositions.length === 0) {
            return true;
        }

        const possibleNumsMap = this.#enumeratePossibilites(emptyPositions);
        let placedNum = false;
        for (let pos in possibleNumsMap) {
            const cadidateNums = possibleNumsMap[pos];
            if (cadidateNums.length === 1) {
                const [row, col] = JSON.parse(pos);
                const num = cadidateNums[0];
                board[row][col] = num;
                placedNum = true;
            }
        }

        let solved = false;
        if (placedNum) {
            solved = this.#solveBoardRec(board);
        } 
        
        for (let pos of emptyPositions) {
            const [row, col] = pos;
            board[row][col] = this.#emptySymbol;
        }

        return solved;
    };


    // #solveBoard(board) {
    //     let emptyPositions = [];
    //     for (let row = 0; row < board.length; row += 1) {
    //         for (let col = 0; col < board[0].length; col += 1) {
    //             const pos = board[row][col];
    //             if (pos === this.#emptySymbol) {
    //                 emptyPositions.push([row, col]);
    //             }
    //         }
    //     }

    //     const originalEmptyPos = emptyPositions.slice();

    //     let solved = true;
    //     while (emptyPositions.length > 0) {
    //         const possibleNumsMap = this.#enumeratePossibilites(emptyPositions);
            
    //         const filledPositions = new Set();
    //         let placedNum = false;
    //         for (let pos in possibleNumsMap) {
    //             const cadidateNums = possibleNumsMap[pos];
    //             if (cadidateNums.length === 1) {
    //                 const [row, col] = JSON.parse(pos);
    //                 const num = cadidateNums[0];
    //                 board[row][col] = num;

    //                 placedNum = true;
    //                 filledPositions.add(pos);
    //             }
    //         }

    //         if (!placedNum) {
    //             solved = false;
    //             break;
    //         }

    //         let newEmptyPositions = [];
    //         for (let pos of emptyPositions) {
    //             const key = JSON.stringify(pos);
    //             if (!filledPositions.has(key)) {
    //                 newEmptyPositions.push(pos);
    //             }
    //         }
    //         emptyPositions = newEmptyPositions;
    //     }

    //     for (let pos of originalEmptyPos) {
    //         const [row, col] = pos;
    //         board[row][col] = this.#emptySymbol;
    //     }
    //     return solved;
    // };


    #enumeratePossibilites(emptyPositions) {
        const possibleNums = {};
        for (let pos of emptyPositions) {
            const possibilites = this.#possibleNumbers(pos);
            const strPos = JSON.stringify(pos);
            possibleNums[strPos] = possibilites;
        }
        return possibleNums;
    };


    #possibleNumbers(pos) {
        const [row, col] = pos;
        const verticalPosDeltas = [[1, 0], [-1, 0]];
        const horizontalPosDeltas = [[0, 1], [0, -1]];

        const foundNums = new Set();

        this.#findNumbersRec(this.#board, row, col, verticalPosDeltas, new Set(), foundNums);
        this.#findNumbersRec(this.#board, row, col, horizontalPosDeltas, new Set(), foundNums);
        this.#findSubGridNumbers(this.#board, row, col, foundNums);

        const possibleNums = [];
        for (let i = 1; i <= 9; i += 1) {
            const strNum = String(i);
            if (!foundNums.has(strNum)) {
                possibleNums.push(strNum);
            }
        }

        return possibleNums;
    };


    #findNumbersRec(board, row, col, posChanges, visited, foundNums) {
        const rowValid = 0 <= row && row < board.length;
        const colValid = 0 <= col && col < board[0].length;
        if (!rowValid || !colValid) {
            return;
        }
        const key = JSON.stringify([row, col]);
        if (visited.has(key)) {
            return;
        }

        const num = board[row][col];
        if (num !== this.#emptySymbol) {
            foundNums.add(num);
        }
        visited.add(key);

        for (let posChange of posChanges) {
            const [rowChange, colChange] = posChange;
            const nRow = row + rowChange;
            const nCol = col + colChange;
            this.#findNumbersRec(board, nRow, nCol, posChanges, visited, foundNums);
        }
    };


    #findSubGridNumbers(board, row, col, foundNums) {
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
                const pos = board[rowIdx][colIdx];
                if (pos !== this.#emptySymbol) {
                    foundNums.add(pos);
                }
            }
        }
    };


    fillBoard() {
        const startRow = 0;
        const startCol = 0;
        const visited = new Set();
        this.#fillBoardRec(this.#board, startRow, startCol, visited);
        console.table(this.#board);
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
            
            nums.splice(randIdx, 1);
        }
        return null;
    };


    #validPlacement(row, col, num) {
        const foundNum = this.#findNumber(this.#board, row, col, num);
        return foundNum === false;
    };

    
    #findNumber(board, row, col, targetNum) {
        const verticalPosDeltas = [[1, 0], [-1, 0]];
        const horizontalPosDeltas = [[0, 1], [0, -1]];

        const foundNums = new Set();
        this.#findNumbersRec(board, row, col, verticalPosDeltas, new Set(), foundNums);
        this.#findNumbersRec(board, row, col, horizontalPosDeltas, new Set(), foundNums);
        this.#findSubGridNumbers(board, row, col, foundNums);
        return foundNums.has(targetNum);
    };
};


const sudoku = new Sudoku();
sudoku.fillBoard()
sudoku.removeNumbers()