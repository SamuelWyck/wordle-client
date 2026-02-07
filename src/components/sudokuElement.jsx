import "../styles/sudokuElement.css";
import sudoku from "../utils/sudoku.js";
import { useRef, useEffect } from "react";
import storage from "../utils/storageManager.js";
import WordleMsgPopup from "./wordlePopup.jsx";
import undoImg from "../assets/undo.svg";
import eraserImg from "../assets/eraser.svg";



function SudokuElement() {
    const popupRef = useRef(null);
    const cellsRef = useRef(buildBoard());
    const numsRemaining = useRef(buildNumsMap())
    const currentCellRef = useRef(null);
    const gameStarted = useRef(false);
    const noteMode = useRef(false);
    const history = useRef([]);

    const activeCellCls = "active-cell";
    const filledCellCls = "filled-cell";
    const allNumsPlacedCls = "all-nums-placed";
    const highlightedCellCls = "highlighted-cell";
    const cellNoteCls = "cell-note";
    const noteModeCls = "note-mode";


    useEffect(function() {
        const savedBoard = storage.getSudokuGame();
        if (savedBoard === null) {
            return;
        }

        const completedBoard = storage.getSudokuCompletedBoard();
        const startBoard = storage.getSudokuStartBoard();

        sudoku.setBoard(savedBoard);
        sudoku.setStartingBoard(startBoard);
        sudoku.SetCompletedBoard(completedBoard);

        setBoard();
        setNumBtns();
        gameStarted.current = true;
    }, []);
      

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
        if (event.target === currentCellRef.current) {
            return;
        }

        const cell = event.target;
        updateCurrentCell(cell);
        if (cell.children.length === 0) {
            highlightMatchingCells(cell.textContent);
        } else {
            clearHighlightedCells();
        }
    };


    function handleNumBtnClick(event) {
        if (!gameStarted.current) {
            return;
        }
        if (currentCellRef.current === null) {
            return;
        }
        if (currentCellRef.current.matches(`.${filledCellCls}`)) {
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
        if (noteMode.current) {
            toggleCellNote(num);
            return;
        }

        const oldNum = currentCellRef.current.textContent;
        const oldHTML = currentCellRef.current.innerHTML;
        const hasNotes = currentCellRef.current.children.length !== 0;
        if (num !== oldNum || hasNotes) {
            numsRemaining.current[num] -= 1;
            if (numsRemaining.current[num] === 0) {
                const addCls = true;
                toggleCompletedNumBtn(num, addCls);
            }
            appendCellHistory(currentCellRef.current, oldHTML, num);
        }
        
        currentCellRef.current.textContent = num;
        highlightMatchingCells(num);
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
                clearHighlightedCells();
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
            const cell = currentCellRef.current;
            if (cell === null || cell.matches(`.${filledCellCls}`)) {
                return;
            }
            if (cell.innerHTML === "") {
                return;
            }

            const oldNum = cell.textContent;
            const oldHTML = cell.innerHTML;
            if (oldNum in numsRemaining.current) {
                numsRemaining.current[oldNum] += 1;
                const addCls = true;
                toggleCompletedNumBtn(oldNum, !addCls);
            }

            cell.textContent = "";
            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);
            sudoku.resetCell(row, col);
            clearHighlightedCells();
            appendCellHistory(cell, oldHTML, "");
        } else if (target.matches(".sudoku-note-btn")) {
            noteMode.current = !noteMode.current;
            target.classList.toggle(noteModeCls);
        } else if (target.matches(".sudoku-undo-btn")) {
            popHistory();
        }
    };


    function updateCurrentCell(cell) {
        if (currentCellRef.current !== null) {
            currentCellRef.current.classList.remove(activeCellCls);
        }
        cell.classList.add(activeCellCls);
        cell.classList.remove(highlightedCellCls);
        currentCellRef.current = cell;
    };


    function appendCellHistory(cell, oldHTML, newHTML) {
        const undoCallback = function() {
            cell.innerHTML = oldHTML;
            updateCurrentCell(cell);

            if (newHTML in numsRemaining.current) {
                numsRemaining.current[newHTML] += 1;
                if (numsRemaining.current[newHTML] === 1) {
                    toggleCompletedNumBtn(newHTML);
                }
            }

            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);
            if (oldHTML in numsRemaining.current) {
                numsRemaining.current[oldHTML] -= 1;
                if (numsRemaining.current[oldHTML] === 0) {
                    toggleCompletedNumBtn(oldHTML);
                }
                sudoku.setCell(row, col, oldHTML);
                highlightMatchingCells(oldHTML);
            } else {
                sudoku.resetCell(row, col);
                clearHighlightedCells();
            }
        };

        history.current.push(undoCallback);
    };


    function popHistory() {
        if (history.current.length === 0) {
            return;
        }

        const undoCallback = history.current.pop();
        undoCallback();
    };


    function clearHighlightedCells() {
        highlightMatchingCells("");
    };


    function highlightMatchingCells(num) {
        const cells = document.querySelectorAll(".sudoku-cell");
        for (let cell of cells) {
            if (cell === currentCellRef.current) {
                continue;
            }
            if (cell.textContent === num && num !== "" && cell.children.length === 0) {
                cell.classList.add(highlightedCellCls);
            } else {
                cell.classList.remove(highlightedCellCls);
            }
        }
    };


    function toggleCellNote(num) {
        const cell = currentCellRef.current;
        const oldHTML = cell.innerHTML;
        if (oldHTML in numsRemaining.current) {
            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);
            sudoku.resetCell(row, col);
            numsRemaining.current[cell.textContent] += 1;
            if (numsRemaining.current[cell.textContent] === 1) {
                toggleCompletedNumBtn(cell.textContent);
            }
            cell.textContent = "";
        }

        for (let child of cell.children) {
            if (child.textContent === num) {
                child.remove();
                const newHTML = cell.innerHTML;
                appendCellHistory(cell, oldHTML, newHTML);
                return;
            }
        }

        const cellNote = document.createElement("div");
        cellNote.classList.add(cellNoteCls);
        cellNote.textContent = num;
        cell.appendChild(cellNote);

        const children = [...cell.children];
        children.sort((firstNote, secondNote) => {
            const firstNum = Number(firstNote.textContent);
            const secondNum = Number(secondNote.textContent);
            return firstNum - secondNum;
        });
        cell.textContent = "";
        for (let child of children) {
            cell.appendChild(child);
        }
        const newHTML = cell.innerHTML;
        appendCellHistory(cell, oldHTML, newHTML);
        clearHighlightedCells();
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
        clearHighlightedCells();
        noteMode.current = false;
        history.current = [];
    };


    function generateNewGame() {
        sudoku.generate();
        setBoard();
        setNumBtns();
        clearHighlightedCells();
        noteMode.current = false;
        history.current = [];
        saveSudokuGame();
    };


    function saveSudokuGame() {
        const currentBoard = sudoku.getBoard();
        const completedBoard = sudoku.getCompletedBoard();
        const startBoard = sudoku.getStartingBoard();

        storage.saveSudokuGame(currentBoard);
        storage.saveSudokuCompletedBoard(completedBoard);
        storage.saveSudokuStartBoard(startBoard);
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
                <div className="edit-btns" onClick={handleEditBtnClick}>
                    <button className="sudoku-undo-btn"><img src={undoImg} alt="undo" /></button>
                    <button className="sudoku-erase-btn"><img src={eraserImg} alt="eraser" /></button>
                    <button className="sudoku-note-btn"></button>
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