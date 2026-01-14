import "../styles/wordlePopup.css";
import { Component } from "react";
import closeImg from "../assets/close.svg";



class WordleMsgPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {message: "", fadeOut: true};
        this.showMessage = this.showMessage.bind(this);
        this.handleClick = this.handleClick.bind(this);
    };

    showMessage(message, fadeOut=true) {
        if (this.state.message !== "") {
            return;
        }
        this.setState(function(state) {
            return {...state, message: message, fadeOut: fadeOut};
        });
        if (fadeOut) {
            setTimeout(() => {
                this.setState(function(state) {
                return {...state, message: ""};
            });}, 1500);
        }
    };

    handleClick() {
        this.setState(function(state) {
            return {...state, message: ""};
        });
    };

    render() {
        if (this.state.message === "") {
            return null;
        }

        const animationClass = (this.state.fadeOut) ? " fade-out" : "";
        return (
            <p 
                className={`wordle-popup${animationClass}`}
            >
                {this.state.message} 
                {
                    this.state.fadeOut || 
                    <button onClick={this.handleClick}><img src={closeImg} alt="close" /></button>
                }
            </p>
        );
    };
};



export default WordleMsgPopup;