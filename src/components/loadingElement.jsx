import "../styles/loadingElement.css";
import logoImg from "../assets/crosswordLogo.png";
import spinnerImg from "../assets/loading.svg";
import circleImg from "../assets/circle-outline.svg";



function LoadingElement({children}) {
    return (
    <main className="loading-main">
        {children}
        <div className="loading-img-wrapper">
            <img src={logoImg} alt="logo" />
        </div>
        <div className="loading-spinner-wrapper">
            <img src={circleImg} alt="loading" className="circle-img" />
            <img src={spinnerImg} alt="loading" className="spinner-img" />
        </div>
    </main>
    );
};



export default LoadingElement;