import "../styles/TwentyFourtyEightElement.css";
import { useRef } from "react";
import arrowImg from "../assets/chevron.svg";



function TwentyFourtyEightElement({boardWidth, boardHeight}) {
    const cellsRef = useRef(buildCells());

    
    function buildCells() {
        const cells = [];
        for (let row = 0; row < boardHeight; row += 1) {
            for (let col = 0; col < boardWidth; col += 1) {
                const cell = <div 
                    className="g2048-cell" 
                    data-row={row} data-col={col}
                    key={`${row}${col}`}
                ></div>;
                cells.push(cell);
            }
        }
        return cells;
    };


    return (
    <main className="g2048">
        <div className="g2048 game-options">
            <button className="g2048-new-game">New Game</button>
            <button className="g2048-help-btn">help</button>
        </div>
        <div className="g2048-game-wrapper">
            <div className="g2048-scores">
                <div className="g2048-current-score">Score: <span>0</span></div>
                <div className="g2048-best-score">Best: <span>0</span></div>
            </div>
            <div className="g2048-game">
                <button className="swipe-btn swipe-up"><img src={arrowImg} alt="arrow" /></button>
                <div className="side-btns-wrapper">
                    <button className="swipe-btn swipe-left"><img src={arrowImg} alt="arrow" /></button>
                    <div className="g2048-board">
                        {cellsRef.current}
                    </div>
                    <button className="swipe-btn swipe-right"><img src={arrowImg} alt="arrow" /></button>
                </div>
                <button className="swipe-btn swipe-down"><img src={arrowImg} alt="arrow" /></button>
            </div>
        </div>
    </main>
    );
};



export default TwentyFourtyEightElement;