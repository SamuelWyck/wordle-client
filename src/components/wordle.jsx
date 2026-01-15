import "../styles/wordle.css";
import WordleInput from "./wordleInput.jsx";
import {useState, useEffect, useRef} from "react";
import apiManager from "../utils/apiManager.js";
import WordleMsgPopup from "./wordlePopup.jsx";
import WordleKeyboard from "./wordleKeyboard.jsx";
import LoadingElement from "./loadingElement.jsx";
import WordleRulesPopup from "./wordleRulesPopup.jsx";
import helpImg from "../assets/help.svg";



function Wordle({maxGuesses, wordLength}) {
    const [inputs, setInputs] = useState(null);
    const popupRef = useRef(null);
    const [pastGuesses, setPastGuesses] = useState([]);
    const showingRulesRef = useRef(false);

    useEffect(function() {
        apiManager.getWordleGuesses().then(function(res) {
            if (res.errors) {
                popupRef.current.showMessage("Error connecting to server.", false);
                return;
            }
            const wordScores = res.guessScores;
            const gameOver = checkGameOver(wordScores);
            setPastGuesses(wordScores);
            setInputs(buildInputs(wordScores, gameOver));

            if (gameOver) {
                apiManager.getWordOfTheDay().then(function(res) {
                    if (res.errors) {
                        popupRef.current.showMessage("Error getting word.", false);
                        return;
                    }
                    const word = res.wordOfTheDay;
                    popupRef.current.showMessage(word.toUpperCase(), false);
                });
            }
        });
    }, []);


    function buildInputs(wordScores, gameOver) {
        const inputs = [];
        let needActiveInput = (gameOver) ? false : true;
        for (let i = 0; i < maxGuesses; i += 1) {
            const score = (i < wordScores.length) ? wordScores[i] : {};
            const noScore = i >= wordScores.length;
            let isActive = false;
            if (noScore && needActiveInput) {
                isActive = true;
                needActiveInput = false;
            }

            const input = getWordleInput(isActive, i, score);
            inputs.push(input);
        }
        return inputs;
    };


    function checkGameOver(wordScores) {
        if (wordScores.length === maxGuesses) {
            return true;
        }
        
        for (let wordScore of wordScores) {
            let gameOver = true;
            for (let key in wordScore) {
                const letterInfo = wordScore[key];
                if (letterInfo.charScore !== 2) {
                    gameOver = false;
                    break;
                }
            }
            if (gameOver) {
                return true;
            }
        }
        return false;
    };


    async function guessSubmitCb(inputIndex, foundWord) {
        if (foundWord) {
            popupRef.current.showMessage("Great job! You won!", false);
            return;
        }
        const nextInputIndex = inputIndex + 1;
        let inputsLength = null;
        setInputs((inputs) => {
            inputsLength = inputs.length;
            return inputs;
        });
        if (nextInputIndex === inputsLength) {
            const res = await apiManager.getWordOfTheDay();
            if (res.errors) {
                popupRef.current.showMessage("Error getting word.", false);
            } else {
                const word = res.wordOfTheDay;
                popupRef.current.showMessage(`The word was ${word.toUpperCase()}`, false);
            }
            return;
        }

        setInputs((inputs) => {
            const modifiedInputs = [];
            for (let i = 0; i < inputs.length; i += 1) {
                let input = inputs[i];
                if (i === nextInputIndex) {
                    input = getWordleInput(true, i, {});
                }
                modifiedInputs.push(input);
            }
            return modifiedInputs;
        });
    };


    function getWordleInput(active, id, wordScore) {
        const input = <WordleInput 
            active={active} maxLength={wordLength} 
            submitCb={guessSubmitCb} 
            key={String(active) + String(id)}
            wordScore={wordScore}
            id={id}
            popupRef={popupRef}
            showingRulesRef={showingRulesRef}
        />;
        return input;
    };


    function showWordleRules() {
        const popup = document.querySelector(".wordle-rules-popup");
        popup.classList.remove("hidden");
        toggleShowingRulesRef();
    };


    function toggleShowingRulesRef() {
        showingRulesRef.current = !showingRulesRef.current;
    };


    if (!inputs) {
        return <LoadingElement><WordleMsgPopup ref={popupRef}/></LoadingElement>;
    }


    return (
    <main className="wordle-main">
        <WordleMsgPopup ref={popupRef} />
        <WordleRulesPopup closeCb={toggleShowingRulesRef} />
        <div className="wordle-board">
            <button className="show-wordle-rules" onClick={showWordleRules}>
                <img src={helpImg} alt="help" />
            </button>
            {inputs}
        </div>
        <WordleKeyboard wordScores={pastGuesses} />
    </main>
    );
};



export default Wordle;