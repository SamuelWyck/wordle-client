import "../styles/wordleKeyboard.css";
import backImg from "../assets/backspace-outline.svg";



function WordleKeyboard() {
    return (
    <div className="wordle-keyboard">
        <div className="wordle-keyboard-keys">
            <div className="w-keyboard-key">Q</div>
            <div className="w-keyboard-key">W</div>
            <div className="w-keyboard-key">E</div>
            <div className="w-keyboard-key">R</div>
            <div className="w-keyboard-key">T</div>
            <div className="w-keyboard-key">Y</div>
            <div className="w-keyboard-key">U</div>
            <div className="w-keyboard-key">I</div>
            <div className="w-keyboard-key">O</div>
            <div className="w-keyboard-key">P</div>
        </div>
        <div className="wordle-keyboard-keys">
            <div className="w-keyboard-key">A</div>
            <div className="w-keyboard-key">S</div>
            <div className="w-keyboard-key">D</div>
            <div className="w-keyboard-key">F</div>
            <div className="w-keyboard-key">G</div>
            <div className="w-keyboard-key">H</div>
            <div className="w-keyboard-key">J</div>
            <div className="w-keyboard-key">K</div>
            <div className="w-keyboard-key">L</div>
        </div>
        <div className="wordle-keyboard-keys">
            <div className="w-keyboard-key enter">ENTER</div>
            <div className="w-keyboard-key">Z</div>
            <div className="w-keyboard-key">X</div>
            <div className="w-keyboard-key">C</div>
            <div className="w-keyboard-key">V</div>
            <div className="w-keyboard-key">B</div>
            <div className="w-keyboard-key">N</div>
            <div className="w-keyboard-key">M</div>
            <div className="w-keyboard-key backspace">
                <img src={backImg} alt="backspace" />
            </div>
        </div>
    </div>
    );
};



export default WordleKeyboard;