import "../styles/wordle.css";
import WordleInput from "./wordleInput.jsx";
import {useState, useEffect} from "react";
import apiManager from "../utils/apiManager.js";



function Wordle() {
    const [inputs, setInputs] = useState(buildInputs());


    useEffect(function() {
        apiManager.getWordleGuesses();
    }, []);


    function buildInputs() {
        const inputs = [];
        for (let i = 0; i < 6; i += 1) {
            const input = <WordleInput 
                active={false} maxLength={5} 
                submitCb={function(val) {console.log(val)}} 
                key={i}
            />;
            inputs.push(input);
        }
        return inputs;
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