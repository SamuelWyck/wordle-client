import "../styles/header.css";
import logo from "../assets/crosswordLogo.png";
import { Link } from "react-router-dom";
import ToggleButton from "./toggleButton.jsx";
import storageManager from "../utils/storageManager.js";



function Header() {
    const lightMode = "light";
    const darkMode = "dark";


    function toggleLightMode() {
        const html = document.querySelector("html");
        const wasDarkMode = html.classList.toggle("light");
        const newMode = (wasDarkMode) ? lightMode : darkMode;
        storageManager.saveColorModeSetting(newMode);
    };


    function isDarkMode() {
        const colorMode = storageManager.getColorModeSetting();
        return colorMode === darkMode || colorMode === null;
    };


    function setInitialColorMode() {
        const colorMode = storageManager.getColorModeSetting();
        if (colorMode === darkMode) {
            return;
        }
        
        const html = document.querySelector("html");
        html.classList.add("light");
    };


    setInitialColorMode();


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
            <ToggleButton startOn={isDarkMode()} clickCallback={toggleLightMode} />
        </div>
    </header>
    );
};



export default Header;