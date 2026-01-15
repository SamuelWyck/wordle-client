import "../styles/wordleKeyboard.css";
import backImg from "../assets/backspace-outline.svg";
import { useEffect } from "react";
import colorWordleKeyboardKeys from "../utils/colorWordleKeyboardKeys.js";



function WordleKeyboard({wordScores}) {

    useEffect(function() {
        colorWordleKeyboardKeys(wordScores);
    }, [wordScores]);

    return (
    <div className="wordle-keyboard">
        <div className="wordle-keyboard-keys">
            <div className="w-keyboard-key" data-key={"q"}>Q</div>
            <div className="w-keyboard-key" data-key={"w"}>W</div>
            <div className="w-keyboard-key" data-key={"e"}>E</div>
            <div className="w-keyboard-key" data-key={"r"}>R</div>
            <div className="w-keyboard-key" data-key={"t"}>T</div>
            <div className="w-keyboard-key" data-key={"y"}>Y</div>
            <div className="w-keyboard-key" data-key={"u"}>U</div>
            <div className="w-keyboard-key" data-key={"i"}>I</div>
            <div className="w-keyboard-key" data-key={"o"}>O</div>
            <div className="w-keyboard-key" data-key={"p"}>P</div>
        </div>
        <div className="wordle-keyboard-keys">
            <div className="w-keyboard-key" data-key={"a"}>A</div>
            <div className="w-keyboard-key" data-key={"s"}>S</div>
            <div className="w-keyboard-key" data-key={"d"}>D</div>
            <div className="w-keyboard-key" data-key={"f"}>F</div>
            <div className="w-keyboard-key" data-key={"g"}>G</div>
            <div className="w-keyboard-key" data-key={"h"}>H</div>
            <div className="w-keyboard-key" data-key={"j"}>J</div>
            <div className="w-keyboard-key" data-key={"k"}>K</div>
            <div className="w-keyboard-key" data-key={"l"}>L</div>
        </div>
        <div className="wordle-keyboard-keys">
            <div className="w-keyboard-key enter" data-key={"Enter"}>ENTER</div>
            <div className="w-keyboard-key" data-key={"z"}>Z</div>
            <div className="w-keyboard-key" data-key={"x"}>X</div>
            <div className="w-keyboard-key" data-key={"c"}>C</div>
            <div className="w-keyboard-key" data-key={"v"}>V</div>
            <div className="w-keyboard-key" data-key={"b"}>B</div>
            <div className="w-keyboard-key" data-key={"n"}>N</div>
            <div className="w-keyboard-key" data-key={"m"}>M</div>
            <div className="w-keyboard-key backspace" data-key={"Backspace"}>
                <img src={backImg} alt="backspace" />
            </div>
        </div>
    </div>
    );
};



export default WordleKeyboard;