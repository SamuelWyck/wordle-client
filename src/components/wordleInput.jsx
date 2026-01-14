import "../styles/wordleInput.css";
import { useState, useEffect, useRef } from "react";
import apiManager from "../utils/apiManager.js";



function WordleInput({maxLength, active=false, wordScore={}, submitCb, id, popupRef}) {
    const [letterDivs, setLetterDivs] = useState(buildLetterDivs(wordScore));
    const [text, setText] = useState("");
    const [isActive, setIsActive] = useState(active);
    const inputRef = useRef(null);


    useEffect(function() {
        if (isActive) {
            inputRef.current.focus();
        }
    }, []);


    function handleClick() {
        if (isActive) {
            inputRef.current.focus();
        }
    };

    
    function handleKeyDown(event) {
        if (!isActive) {
            return;
        }
        if (event.key === "Enter") {
            if (text.length === maxLength) {
                submitWord();
                setIsActive(false);
            }
            return;
        }
        if (text.length === maxLength && event.key !== "Backspace") {
            return;
        }
        if (text.length === 0 && event.key === "Backspace") {
            return;
        }

        if (event.key === "Backspace") {
            setText(text.slice(0, text.length - 1));
            const targetIndex = text.length - 1;
            updateLetterDiv(targetIndex, "");
        } else if (isLetter(event.key)) {
            setText(text + event.key.toLowerCase());
            const targetIndex = text.length;
            updateLetterDiv(targetIndex, event.key.toUpperCase());
        }
    };


    function updateLetterDiv(targetIndex, letter) {
        setLetterDivs((letterDivs) => {
            const modifiedDivs = [];
            for (let i = 0; i < letterDivs.length; i += 1) {
                let div = letterDivs[i];
                if (i === targetIndex) {
                    div = getLetterDiv(i, "", letter);
                }
                modifiedDivs.push(div);
            }
            return modifiedDivs;
        });
    };


    function isLetter(string) {
        if (string.length !== 1) {
            return false;
        }
        const lettersSet = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        return lettersSet.has(string.toUpperCase());
    };


    function buildLetterDivs(wordScore) {
        const letterDivs = [];
        const scoreClasses = {0: "wrong", 1: "right-letter", 2: "correct"};
        for (let i = 0; i < maxLength; i += 1) {
            const letterScore = wordScore[i];
            let letter = "";
            let scoreClass = "";
            if (letterScore) {
                letter = letterScore.char.toUpperCase();
                scoreClass = ` ${scoreClasses[letterScore.charScore]}`;
            }
            const div = getLetterDiv(i, scoreClass, letter);
            letterDivs.push(div);
        }
        return letterDivs;
    };


    function getLetterDiv(id, scoreClass, letter) {
        const div = <div 
            className={`input-letter${scoreClass}`} 
            key={id}
        ><p>{letter}</p></div>;
        return div;
    };


    async function submitWord() {
        const res = await apiManager.makeWordleGuess(text);
        if (res.errors) {
            setIsActive(true);
            popupRef.current.showMessage("Error submitting word.", false);
            return;
        }
        if (!res.validWord) {
            setIsActive(true);
            popupRef.current.showMessage("Word is not in the list.");
            return;
        }
        const wordScore = res.score;
        setLetterDivs(buildLetterDivs(wordScore));
        let foundWord = true;
        for (let key in wordScore) {
            const letterInfo = wordScore[key];
            const letterScore = letterInfo.charScore;
            if (letterScore !== 2) {
                foundWord = false;
                break;
            }
        }
        submitCb(id, foundWord);
    };


    return (
        <div 
            className="wordle-input" 
            tabIndex={(active) ? 0 : -1}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            ref={inputRef}
        >
            {letterDivs}
        </div>
    );
};



export default WordleInput;