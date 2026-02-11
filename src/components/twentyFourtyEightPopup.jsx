import "../styles/twentyFourtyEightPopup.css";
import closeImg from "../assets/close.svg";



function TwentyFourtyEightPopup({closeCb}) {
    function closePopup() {
        const popup = document.querySelector(".g2048-rules-popup");
        popup.classList.add("hidden");
        closeCb();
    };

    return (
        <div className="g2048-rules-popup hidden">
            <div className="exit-wrapper">
                <button onClick={closePopup}><img src={closeImg} alt="close" /></button>
            </div>
            <p>How to Play 2048</p>
            <p>Use the arrow keys, wasd, the arrow buttons, or swipe to move tiles.</p>
            <p>Tiles with the same number will combine and double.</p>
            <p>The goal is to make a tile that is 2048.</p>
            <p>You can change the target number with the goal button.</p>
        </div>
    );
};



export default TwentyFourtyEightPopup;