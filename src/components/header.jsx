import "../styles/header.css";
import logo from "../assets/crosswordLogo.png";
import { Link } from "react-router-dom";



function Header() {
    return (
    <header>
        <div className="logo-wrapper">
            <div className="logo-img">
                <img src={logo} alt="logo" />
            </div>
            <p className="logo-title">Brain Games</p>
        </div>
        <nav>
            <Link to={"/"}>Wordle</Link>
        </nav>
    </header>
    );
};



export default Header;