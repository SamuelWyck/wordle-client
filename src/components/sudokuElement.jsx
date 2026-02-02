import "../styles/sudokuElement.css";
import sudoku from "../utils/sudoku.js";
import { useRef } from "react";



function SudokuElement() {
    const boardRef = useRef(buildBoard());
    const currentCellRef = useRef(null);
    const activeCellCls = "active-cell";
      

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


    function handleCellClick(event) {
        if (currentCellRef.current !== null) {
            currentCellRef.current.classList.remove(activeCellCls);
        }
        event.target.classList.add(activeCellCls);
        currentCellRef.current = event.target;
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
    };


    
    return (
    <main className="sudoku">
        <div className="sudoku-game">
            <div className="sudoku-board" onClick={handleCellClick}>
                {boardRef.current}
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