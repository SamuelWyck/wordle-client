import "../styles/wordleRulesPopup.css";
import wrongImg from "../assets/wrong-example.png";
import rightLetterImg from "../assets/right-letter-example.png";
import correctImg from "../assets/correct-example.png";
import closeImg from "../assets/close.svg";



function WordleRulesPopup({closeCb}) {

    function handleClose() {
        const popup = document.querySelector(".wordle-rules-popup");
        popup.classList.add("hidden");
        closeCb();
    };

    return (
    <div className="wordle-rules-popup hidden">
        <div className="exit-wrapper">
            <button onClick={handleClose}><img src={closeImg} alt="close" /></button>
        </div>
        <p className="title">How To Play</p>
        <div className="wordle-rules">
            <ul>
                <li>Guess the word in 6 tries.</li>
                <li>Each guess must be a valid 5-letter word.</li>
                <li>The color of the tiles will change to show how close your guess was to the word.</li>
            </ul>
            <p className="examples-title">Examples</p>
            <div className="example-card">
                <div className="example-img-wrapper">
                    <img src={correctImg} alt="correct" className="example-img" />
                </div>
                <p className="example-para">
                    The "O" is the right letter in the right place.
                </p>
            </div>
            <div className="example-card">
                <div className="example-img-wrapper">
                    <img src={rightLetterImg} alt="right letter" className="example-img" />
                </div>
                <p className="example-para">
                    The "W" is in the word, but in the wrong place.
                </p>
            </div>
            <div className="example-card">
                <div className="example-img-wrapper">
                    <img src={wrongImg} alt="wrong" className="example-img" />
                </div>
                <p className="example-para">
                    The "D" is not in the word at all.
                </p>
            </div>
        </div>
    </div>
    );
};



export default WordleRulesPopup;