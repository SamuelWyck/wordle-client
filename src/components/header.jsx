import "../styles/header.css";
import logo from "../assets/crosswordLogo.png";
import { Link } from "react-router-dom";
import ToggleButton from "./toggleButton.jsx";



function Header() {


    function toggleLightMode() {
        const html = document.querySelector("html");
        html.classList.toggle("light");
    };


    return (
    <header>
        <Link to={"/"}>
        <div className="logo-wrapper">
            <div className="logo-img">
                <img src={logo} alt="logo" />
            </div>
            <p className="logo-title">Brain Games</p>
        </div>
        </Link>
        <div className="options">
            <nav>
                <Link to={"/"}>Wordle</Link>
            </nav>
            <ToggleButton startOn={true} clickCallback={toggleLightMode} />
        </div>
    </header>
    );
};



export default Header;