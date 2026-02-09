import "../styles/header.css";
import logo from "../assets/crosswordLogo.png";
import menuImg from "../assets/menu.svg";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import ToggleButton from "./toggleButton.jsx";
import storageManager from "../utils/storageManager.js";



function Header() {
    const lightMode = "light";
    const darkMode = "dark";
    const headerNavCls = ".header-nav";
    const headerNavShowCls = "show";


    useEffect(function() {
        function hideMenu(event) {
            if (event.target.matches(".header-nav")) {
                return;
            }

            const navMenu = document.querySelector(headerNavCls);
            navMenu.classList.remove(headerNavShowCls);
        };

        function hideMenuOnResize() {
            if (window.innerWidth >= 800) {
                const navMenu = document.querySelector(headerNavCls);
                navMenu.classList.remove(headerNavShowCls);
            }
        };

        document.addEventListener("click", hideMenu);
        window.addEventListener("resize", hideMenuOnResize);

        return function() {
            document.removeEventListener("click", hideMenu);
            window.removeEventListener("resize", hideMenuOnResize);
        }
    });


    function toggleLightMode() {
        const html = document.querySelector("html");
        const nowLightMode = html.classList.toggle(lightMode);
        const newMode = (nowLightMode) ? lightMode : darkMode;
        storageManager.saveColorModeSetting(newMode);
    };


    function isDarkMode() {
        const colorMode = storageManager.getColorModeSetting();
        return colorMode === darkMode || colorMode === null;
    };


    function setInitialColorMode() {
        const colorMode = storageManager.getColorModeSetting();
        if (colorMode === darkMode || colorMode === null) {
            return;
        }
        
        const html = document.querySelector("html");
        html.classList.add(lightMode);
    };


    function toggleMenu(event) {
        event.stopPropagation();
        const navMenu = document.querySelector(headerNavCls);
        navMenu.classList.toggle(headerNavShowCls);
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
            <button className="header-menu-btn" onClick={toggleMenu}>
                <img src={menuImg} alt="menu" />
            </button>
            <nav className="header-nav">
                <Link to={"/"}>Wordle</Link>
                <Link to={"/sudoku"}>Sudoku</Link>
            </nav>
            <ToggleButton startOn={isDarkMode()} clickCallback={toggleLightMode} />
        </div>
    </header>
    );
};



export default Header;