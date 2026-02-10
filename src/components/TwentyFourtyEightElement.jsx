import "../styles/TwentyFourtyEightElement.css";
import "../styles/TwentyFourtyEightTile.css";
import { useRef } from "react";
import arrowImg from "../assets/chevron.svg";
import TwentyFourtyEight from "../utils/2048.js";



function TwentyFourtyEightElement() {
    const tileNumberClsMap = {
        2: "two", 4: "four", 8: "eight", 16: "sixteen", 
        32: "thirty-two", 64: "sixty-four", 128: "one-hundred",
        256: "two-hundred", 512: "five-hundred",
        1024: "one-thousand", 2048: "two-thousand"
    };
    const tileCls = "g2048-tile";
    const startNumber = 2;
    const boardSize = 4;

    const game = useRef(new TwentyFourtyEight(boardSize, boardSize, startNumber));
    const tileBoardRef = useRef();
    const gameStarted = useRef(false);


    function addTile(row, col, number) {
        const tile = document.createElement("div");

        tile.classList.add(tileCls);
        const numberClass = tileNumberClsMap[number];
        tile.classList.add(numberClass);

        tile.dataset.row = row;
        tile.dataset.col = col;

        tileBoardRef.current.appendChild(tile);
    };


    function handleNewGame() {
        const [firstTile, secondTile] = game.current.startGame(2048);

        tileBoardRef.current.innerHTML = "";
        addTile(firstTile.newRow, firstTile.newCol, startNumber);
        addTile(secondTile.newRow, secondTile.newCol, startNumber);
        
        gameStarted.current = true;
    };


    return (
    <main className="g2048">
        <div className="g2048 game-options">
            <button className="g2048-new-game" onClick={handleNewGame}>New Game</button>
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
                        <div className="g2048-tile-board" ref={tileBoardRef}>
                        </div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
                        <div className="g2048-cell"></div>
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