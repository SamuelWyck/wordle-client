import "../styles/toggleButton.css";
import { useState } from "react";
import lightImg from "../assets/light.svg";
import darkImg from "../assets/dark.svg";



function ToggleButton({startOn=false, clickCallback}) {
    const [on, setOn] = useState(startOn);


    function handleClick() {
        setOn(oldStatus => !oldStatus);
        clickCallback();
    };


    return (
        <button className={`toggle-btn${(on) ? " on" : ""}`} onClick={handleClick}>
            <div className="toggle-btn-toggle"></div>
            <div className="toggle-images">
                <img src={darkImg} alt="dark" className="dark-img" draggable={false} />
                <img src={lightImg} alt="light" className="light-img" draggable={false} />
            </div>
        </button>
    );
};



export default ToggleButton;