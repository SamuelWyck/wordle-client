import "../styles/TwentyFourtyEightElement.css";
import "../styles/TwentyFourtyEightTile.css";
import { useRef, useEffect } from "react";
import arrowImg from "../assets/chevron.svg";
import TwentyFourtyEight from "../utils/2048.js";



function TwentyFourtyEightElement() {
    const tileCls = "g2048-tile";
    const startNumber = 2;
    const boardSize = 4;

    const swipeUp = 0;
    const swipeDown = 1;
    const swipeLeft = 2;
    const swipeRight = 3;

    const gameLost = -1;
    const gameWon = 1;

    const maxMoveTouches = 4;

    const game = useRef(new TwentyFourtyEight(boardSize, boardSize, startNumber));
    const tileBoardRef = useRef();
    const touchStartRef = useRef(null);
    const moveTouches = useRef([]);
    const gameStarted = useRef(false);


    useEffect(function() {
        function handleTouchStart(event) {
            if (!gameStarted.current) {
                return;
            }

            const touch = event.touches[0];
            const touchX = touch.clientX;
            const touchY = touch.clientY;
            
            touchStartRef.current = {startX: touchX, startY: touchY};
        };


        function handleTouchMove(event) {
            if (touchStartRef.current === null) {
                return;
            }
            if (moveTouches.current.length < maxMoveTouches) {
                const touch = event.touches[0];
                moveTouches.current.push(touch);
                return;
            }
            
            const touch = event.touches[0];
            handleTouchSwipe(touch);
        };


        function handleTouchEnd() {
            if (!gameStarted.current) {
                return;
            }
            if (moveTouches.current.length === 0) {
                return;
            }

            const touch = moveTouches.current.pop();
            handleTouchSwipe(touch);
        };


        function handleKeyPress(event) {
            if (!gameStarted.current) {
                return;
            }

            const key = event.key;

            if (key === "w" || key === "ArrowUp") {
                swipeBoard(swipeUp);
            } else if (key === "s" || key === "ArrowDown") {
                swipeBoard(swipeDown);
            } else if (key === "d" || key === "ArrowRight") {
                swipeBoard(swipeRight);
            } else if (key === "a" || key === "ArrowLeft") {
                swipeBoard(swipeLeft);
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);

        return function() {
            document.removeEventListener("keydown", handleKeyPress);
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);


    function handleTouchSwipe(touch) {
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        const startX = touchStartRef.current.startX;
        const startY = touchStartRef.current.startY;

        const xDifference = Math.abs(touchX - startX);
        const yDifference = Math.abs(touchY - startY);
        if (xDifference >= yDifference) {
            if (touchX > startX) {
                swipeBoard(swipeRight);
            } else {
                swipeBoard(swipeLeft);
            }
        } else {
            if (touchY > startY) {
                swipeBoard(swipeDown);
            } else {
                swipeBoard(swipeUp);
            }
        }
        
        touchStartRef.current = null;
        moveTouches.current = [];
    };


    function addTile(row, col, number) {
        const tile = document.createElement("div");
        tile.classList.add(tileCls);

        tile.dataset.row = row;
        tile.dataset.col = col;
        tile.dataset.num = number;

        tileBoardRef.current.appendChild(tile);
    };


    function swipeBoard(swipeDirection) {
        let swipedTiles = null;
        let newTile = null;
        if (swipeDirection === swipeUp) {
            [swipedTiles, newTile] = game.current.swipeBoardUp();
        } else if (swipeDirection === swipeDown) {
            [swipedTiles, newTile] = game.current.swipeBoardDown();
        } else if (swipeDirection === swipeLeft) {
            [swipedTiles, newTile] = game.current.swipeBoardLeft();
        } else {
            [swipedTiles, newTile] = game.current.swipeBoardRight();
        }

        if (Object.keys(swipedTiles).length === 0) {
            return;
        }

        for (let tileCoords in swipedTiles) {
            const newPosInfo = swipedTiles[tileCoords];
            const [currRow, currCol] = JSON.parse(tileCoords);

            const tile = document.querySelector(`.${tileCls}[data-row="${currRow}"][data-col="${currCol}"]`);
            tile.dataset.row = newPosInfo.row;
            tile.dataset.col = newPosInfo.col;
            tile.dataset.num = newPosInfo.num;
        }

        const tiles = document.querySelectorAll(`.${tileCls}`);
        const seenTiles = {};
        for (let tile of tiles) {
            const row = Number(tile.dataset.row);
            const col = Number(tile.dataset.col);
            const coords = JSON.stringify([row, col]);

            if (!(coords in seenTiles)) {
                seenTiles[coords] = tile;
            } else {
                const seenTile = seenTiles[coords];
                const seenNum = Number(seenTile.dataset.num);
                const currNum = Number(tile.dataset.num);
                const tileToRemove = (seenNum < currNum) ? seenTile : tile;
                tileToRemove.remove();
            }
        }
        
        addTile(newTile.newRow, newTile.newCol, startNumber);

        const gameStatus = game.current.checkGameOver();
        if (gameStatus === gameLost || gameStatus === gameWon) {
            gameStarted.current = false;
        }
    };


    function handleNewGame() {
        const [firstTile, secondTile] = game.current.startGame(2048);

        tileBoardRef.current.innerHTML = "";
        addTile(firstTile.newRow, firstTile.newCol, startNumber);
        addTile(secondTile.newRow, secondTile.newCol, startNumber);

        gameStarted.current = true;
    };


    function handleBoardSwipe(event) {
        const target = event.target;
        if (!target.matches(".swipe-btn")) {
            return;
        }

        if (target.matches(".swipe-up")) {
            swipeBoard(swipeUp);
        } else if (target.matches(".swipe-down")) {
            swipeBoard(swipeDown);
        } else if (target.matches(".swipe-left")) {
            swipeBoard(swipeLeft);
        } else {
            swipeBoard(swipeRight);
        }
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
            <div className="g2048-game" onClick={handleBoardSwipe}>
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