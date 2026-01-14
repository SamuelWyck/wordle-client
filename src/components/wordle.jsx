import "../styles/wordle.css";
import WordleInput from "./wordleInput.jsx";
import {useState, useEffect} from "react";
import apiManager from "../utils/apiManager.js";



function Wordle({maxGuesses, wordLength}) {
    const [inputs, setInputs] = useState([]);


    useEffect(function() {
        apiManager.getWordleGuesses().then(function(res) {
            const wordScores = res.guessScores;
            setInputs(buildInputs(wordScores));
        });
    }, []);


    function buildInputs(wordScores) {
        const inputs = [];
        let needActiveInput = !checkGameOver(wordScores);
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
            // make pop saying you won
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
            // lost game make pop showing word
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
        />;
        return input;
    };


    return (
    <main className="wordle-main">
        <div className="wordle-board">
            {inputs}
        </div>
    </main>
    );
};



export default Wordle;