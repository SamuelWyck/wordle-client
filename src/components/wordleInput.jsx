import "../styles/wordleInput.css";
import { useState, useEffect, useRef } from "react";



function WordleInput({maxLength, active=false, textInfo={}, submitCb}) {
    const [text, setText] = useState("");
    const inputRef = useRef(null);


    useEffect(function() {
        if (active) {
            inputRef.current.focus();
        }
    }, []);

    
    function handleKeyDown(event) {
        if (event.key === "Enter") {
            submitCb(text);
            return;
        }
        if (text.length === maxLength && event.key !== "Backspace") {
            return;
        }
        if (text.length === 0 && event.key === "Backspace") {
            return;
        }

        let newText = null;
        let divIndex = null;
        if (event.key === "Backspace") {
            newText = text.slice(0, text.length - 1);
            divIndex = text.length - 1;
        } else if (isLetter(event.key)) {
            newText = text + event.key.toUpperCase();
            divIndex = text.length;
        }
        
        if (newText !== null) {
            setText(newText);
        }
    };


    function isLetter(string) {
        if (string.length !== 1) {
            return false;
        }
        const lettersSet = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        return lettersSet.has(string.toUpperCase());
    };


    function buildLetterDivs() {
        const letterDivs = [];
        for (let i = 0; i < maxLength; i += 1) {
            const div = <div className="input-letter" key={i}><p>{text.at(i) || ""}</p></div>;
            letterDivs.push(div);
        }
        return letterDivs;
    };

    const letterDivs = buildLetterDivs();

    return (
        <div 
            className="wordle-input" 
            tabIndex={0} 
            onKeyDown={handleKeyDown}
            onClick={function() {inputRef.current.focus();}}
            ref={inputRef}
        >
            {letterDivs}
        </div>
    );
};



export default WordleInput;