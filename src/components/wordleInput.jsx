import "../styles/wordleInput.css";
import { useState, useEffect, useRef } from "react";
import apiManager from "../utils/apiManager.js";



function WordleInput({maxLength, active=false, wordScore={}, submitCb, id, popupRef}) {
    const [letterDivs, setLetterDivs] = useState(buildLetterDivs(wordScore));
    const [isActive, setIsActive] = useState(active);
    const activeRef = useRef(active);
    const textRef = useRef("");
    const inputRef = useRef(null);


    useEffect(function() {
        if (activeRef.current) {
            inputRef.current.focus();
        }

        function keyboardHandler(event) {
            if (!activeRef.current) {
                return;
            }
            const target = (event.target.matches(".w-keyboard-key")) ? event.target : event.target.parentElement;
            if (!target.matches(".w-keyboard-key")) {
                return;
            }
            const key = target.dataset.key;
            if (!isValidKey(key)) {
                return;
            }
            updateKeyboardKeyClass(key);
            updateText(key);
        };

        function focusClickHandler() {
            if (activeRef.current) {
                inputRef.current.focus();
            }
        };

        document.addEventListener("click", focusClickHandler);
        const keyboard = document.querySelector(".wordle-keyboard");
        keyboard.addEventListener("click", keyboardHandler);

        return function() {
            document.removeEventListener("click", focusClickHandler);
            keyboard.removeEventListener("click", keyboardHandler);
        }
    }, []);


    function updateKeyboardKeyClass(letter) {
        const allKeys = document.querySelectorAll(".w-keyboard-key");
        const targetKey = document.querySelector(`.w-keyboard-key[data-key="${letter}"]`);
        for (let key of allKeys) {
            key.classList.remove("pressed");
        }
        targetKey.classList.add("pressed");
    };


    function handleClick() {
        if (isActive) {
            inputRef.current.focus();
        }
    };


    function updateText(key) {
        const text = textRef.current;
        if (text.length === maxLength && key !== "Backspace" && key !== "Enter") {
            return;
        }
        if (text.length === 0 && key === "Backspace") {
            return;
        }

        if (key === "Enter") {
            if (text.length === maxLength) {
                submitWord();
                updateActive(false);
            }
        } else if (key === "Backspace") {
            const targetIndex = text.length - 1;
            textRef.current = text.slice(0, text.length - 1);
            updateLetterDiv(targetIndex, "");
        } else {
            const targetIndex = text.length;
            textRef.current = text + key;
            updateLetterDiv(targetIndex, key.toUpperCase());
        }
    };

    
    function handleKeyDown(event) {
        if (!isActive) {
            return;
        }
        if (!isValidKey(event.key)) {
            return;
        }
        updateKeyboardKeyClass(event.key);
        updateText(event.key);
    };


    function updateActive(active) {
        activeRef.current = active;
        setIsActive(active);
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


    function isValidKey(key) {
        const validKeySet = new Set("abcdefghijklmnopqrstuvwxyz");
        validKeySet.add("Enter");
        validKeySet.add("Backspace");
        return validKeySet.has(key);
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
        const res = await apiManager.makeWordleGuess(textRef.current);
        if (res.errors) {
            updateActive(true);
            inputRef.current.focus();
            popupRef.current.showMessage("Error submitting word.", false);
            return;
        }
        if (!res.validWord) {
            updateActive(true);
            inputRef.current.focus();
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