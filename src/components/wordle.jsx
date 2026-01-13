import "../styles/wordle.css";
import WordleInput from "./wordleInput.jsx";



function Wordle() { 
    return (
    <main>
        <div className="board">
            <WordleInput active={true} maxLength={5} submitCb={function(val) {console.log(val)}} />
        </div>
    </main>
    );
};



export default Wordle;