import "../styles/sudokuElement.css";
import sudoku from "../utils/sudoku.js";
import { useRef } from "react";
import WordleMsgPopup from "./wordlePopup.jsx";



function SudokuElement() {
    const popupRef = useRef(null);
    const cellsRef = useRef(buildBoard());
    const numsRemaining = useRef(buildNumsMap())
    const currentCellRef = useRef(null);
    const gameStarted = useRef(false);

    const activeCellCls = "active-cell";
    const filledCellCls = "filled-cell";
    const allNumsPlacedCls = "all-nums-placed";
      

    function buildBoard() {
        const boardWidth = 9;
        const boardHeight = 9;
        const boardCells = [];
        for (let row = 0; row < boardHeight; row += 1) {
            for (let col = 0; col < boardWidth; col += 1) {
                const cell = <div 
                    className="sudoku-cell" 
                    data-row={row} data-col={col}
                    key={`${row}${col}`}
                ></div>;
                boardCells.push(cell);
            }
        }
        return boardCells;
    };


    function buildNumsMap() {
        const numsMap = {};
        for (let i = 1; i <= 9; i += 1) {
            const num = String(i);
            numsMap[num] = 9;
        }
        return numsMap;
    };


    function handleCellClick(event) {
        if (!gameStarted.current) {
            return;
        }
        if (currentCellRef.current !== null) {
            currentCellRef.current.classList.remove(activeCellCls);
        }
        const cell = event.target;
        if (cell.matches(`.${filledCellCls}`)) {
            currentCellRef.current = null;
            return;
        }

        cell.classList.add(activeCellCls);
        currentCellRef.current = cell;
    };


    function handleNumBtnClick(event) {
        if (!gameStarted.current) {
            return;
        }
        if (currentCellRef.current === null) {
            return;
        }
        const target = event.target;
        if (!target.matches(".sudoku-num-btn")) {
            return;
        }
        const num = target.dataset.num;
        if (numsRemaining.current[num] === 0) {
            return;
        }

        const oldNum = currentCellRef.current.textContent;
        if (oldNum !== num) {
            numsRemaining.current[num] -= 1;
            if (numsRemaining.current[num] === 0) {
                const addCls = true;
                toggleCompletedNumBtn(num, addCls);
            }
        }
        
        currentCellRef.current.textContent = num;
        const row = Number(currentCellRef.current.dataset.row);
        const col = Number(currentCellRef.current.dataset.col);
        sudoku.setCell(row, col, num);

        if (allNumsPlaced()) {
            const solved = sudoku.boardSolved();
            const fadeOut = true;
            if (solved) {
                gameStarted.current = false;
                popupRef.current.showMessage("Board Solved!", !fadeOut);
                currentCellRef.current.classList.remove(activeCellCls);
                currentCellRef.current = null;
            } else {
                popupRef.current.showMessage("Incorrect", !fadeOut);
            }
        }
    };


    function gameOptionsClick(event) {
        if (!event.target.matches("button")) {
            return;
        }
        
        if (event.target.matches(".sudoku-new-game-btn")) {
            generateNewGame();
            gameStarted.current = true;
        } else if (event.target.matches(".sudoku-reset-btn") && gameStarted.current) {
            resetGame();
        }
    };


    function handleEditBtnClick(event) {
        const target = event.target;

        if (target.matches(".sudoku-erase-btn")) {
            if (currentCellRef.current !== null) {
                const oldNum = currentCellRef.current.textContent;
                if (oldNum !== "") {
                    numsRemaining.current[oldNum] += 1;
                    const addCls = true;
                    toggleCompletedNumBtn(oldNum, !addCls);
                }
                currentCellRef.current.textContent = "";
                const row = Number(currentCellRef.current.dataset.row);
                const col = Number(currentCellRef.current.dataset.col);
                sudoku.resetBoard(row, col);
            }
        }
    };


    function allNumsPlaced() {
        for (let num in numsRemaining.current) {
            if (numsRemaining.current[num] !== 0) {
                return false;
            }
        }
        return true;
    };


    function toggleCompletedNumBtn(num, addFilledNumCls) {
        const btn = document.querySelector(`.sudoku-num-btn[data-num="${num}"]`);
        if (addFilledNumCls) {
            btn.classList.add(allNumsPlacedCls);
        } else {
            btn.classList.remove(allNumsPlacedCls);
        }
    };


    function resetGame() {
        const gameReset = sudoku.resetBoard();
        if (!gameReset) {
            return;
        }
        setBoard();
        setNumBtns();
    };


    function generateNewGame() {
        sudoku.generate();
        setBoard();
        setNumBtns();
    };


    function setNumBtns() {
        const numBtns = document.querySelectorAll(".sudoku-num-btn");
        for (let btn of numBtns) {
            const num = btn.dataset.num;
            if (numsRemaining.current[num] === 0) {
                btn.classList.add(allNumsPlacedCls);
            } else {
                btn.classList.remove(allNumsPlacedCls);
            }
        }
    };


    function setBoard() {
        const board = sudoku.getBoard();
        numsRemaining.current = buildNumsMap();
        for (let row = 0; row < board.length; row += 1) {
            for (let col = 0; col < board[0].length; col += 1) {
                const cell = document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"]`);
                let num = board[row][col];
                if (num !== sudoku.emptySymbol) {
                    cell.textContent = num;
                    cell.classList.add(filledCellCls);
                    numsRemaining.current[num] -= 1;
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
        <WordleMsgPopup ref={popupRef} />
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
                <div className="edit-btns on" onClick={handleEditBtnClick}>
                    <button className="sudoku-undo-btn">undo</button>
                    <button className="sudoku-erase-btn">erase</button>
                    <button className="sudoku-note-btn">note</button>
                </div>
                <div className="num-btns" onClick={handleNumBtnClick}>
                    <button className="sudoku-num-btn" data-num="1"></button>
                    <button className="sudoku-num-btn" data-num="2"></button>
                    <button className="sudoku-num-btn" data-num="3"></button>
                    <button className="sudoku-num-btn" data-num="4"></button>
                    <button className="sudoku-num-btn" data-num="5"></button>
                    <button className="sudoku-num-btn" data-num="6"></button>
                    <button className="sudoku-num-btn" data-num="7"></button>
                    <button className="sudoku-num-btn" data-num="8"></button>
                    <button className="sudoku-num-btn" data-num="9"></button>
                </div>
            </div>
        </div>
    </main>
    );
};



export default SudokuElement;