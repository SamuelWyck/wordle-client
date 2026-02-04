import "../styles/sudokuElement.css";
import sudoku from "../utils/sudoku.js";
import { useRef } from "react";



function SudokuElement() {
    const boardRef = useRef(null);
    const cellsRef = useRef(buildBoard());
    const currentCellRef = useRef(null);
    const activeCellCls = "active-cell";
    const filledCellCls = "filled-cell";
      

    function buildBoard() {
        const boardWidth = 9;
        const boardHeight = 9;
        const boardCells = [];
        boardRef.current = [];
        for (let row = 0; row < boardHeight; row += 1) {
            const boardRow = [];
            for (let col = 0; col < boardWidth; col += 1) {
                const cell = <div 
                    className="sudoku-cell" 
                    data-row={row} data-col={col}
                    key={`${row}${col}`}
                ></div>;
                boardCells.push(cell);
                boardRow.push(cell);
            }
            boardRef.current.push(boardRow);
        }
        return boardCells;
    };


    function handleCellClick(event) {
        if (currentCellRef.current !== null) {
            currentCellRef.current.classList.remove(activeCellCls);
        }
        const cell = event.target;
        if (cell.matches(`.${filledCellCls}`)) {
            return;
        }

        cell.classList.add(activeCellCls);
        currentCellRef.current = cell;
    };


    function handleNumBtnClick(event) {
        if (currentCellRef.current === null) {
            return;
        }
        const target = event.target;
        if (!target.matches(".sudoku-num-btn")) {
            return;
        }

        const num = target.dataset.num;
        currentCellRef.current.textContent = num;

        const row = Number(currentCellRef.current.dataset.row);
        const col = Number(currentCellRef.current.dataset.col);
        sudoku.setCell(row, col, num);
    };


    function gameOptionsClick(event) {
        if (!event.target.matches("button")) {
            return;
        }
        
        if (event.target.matches(".sudoku-new-game-btn")) {
            generateNewGame();
        } else {
            resetGame();
        }
    };


    function resetGame() {
        const gameReset = sudoku.resetBoard();
        if (!gameReset) {
            return;
        }
        setBoard();
    };


    function generateNewGame() {
        sudoku.generate();
        setBoard();
    };


    function setBoard() {
        const board = sudoku.getBoard();
        for (let row = 0; row < board.length; row += 1) {
            for (let col = 0; col < board[0].length; col += 1) {
                const cell = document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"]`);
                let num = board[row][col];
                if (num !== sudoku.emptySymbol) {
                    cell.textContent = num;
                    cell.classList.add(filledCellCls);
                } else {
                    cell.textContent = "";
                    cell.classList.remove(filledCellCls);
                }
            }
        }

        if (currentCellRef.current !== null) {
            currentCellRef.current.classList.remove(activeCellCls);
            currentCellRef.current = null;
        }
    };

    
    return (
    <main className="sudoku">
        <div className="sudoku-game">
            <div className="sudoku-board-wrapper">
                <div className="sudoku-game-options" onClick={gameOptionsClick}>
                    <button className="sudoku-new-game-btn">New game</button>
                    <button className="sudoku-reset-btn">Reset Game</button>
                </div>
                <div className="sudoku-board" onClick={handleCellClick}>
                    {cellsRef.current}
                </div>
            </div>
            <div className="sudoku-btns">
                <div className="edit-btns">
                    <button className="sudoku-undo-btn">undo</button>
                    <button className="sudoku-erase-btn">erase</button>
                    <button className="sudoku-note-btn">note</button>
                </div>
                <div className="num-btns" onClick={handleNumBtnClick}>
                    <button className="sudoku-num-btn" data-num="1">1</button>
                    <button className="sudoku-num-btn" data-num="2">2</button>
                    <button className="sudoku-num-btn" data-num="3">3</button>
                    <button className="sudoku-num-btn" data-num="4">4</button>
                    <button className="sudoku-num-btn" data-num="5">5</button>
                    <button className="sudoku-num-btn" data-num="6">6</button>
                    <button className="sudoku-num-btn" data-num="7">7</button>
                    <button className="sudoku-num-btn" data-num="8">8</button>
                    <button className="sudoku-num-btn" data-num="9">9</button>
                </div>
            </div>
        </div>
    </main>
    );
};



export default SudokuElement;