import "./App.jsx";
import App from "./App.jsx";
import Wordle from "./components/wordle.jsx";
import SudokuElement from "./components/sudokuElement.jsx";
import { Navigate } from "react-router-dom";



const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Wordle maxGuesses={6} wordLength={5}/>
            },
            {
                path: "*",
                element: <Navigate to={"/"} replace={true} />
            },
            {
                path: "/sudoku",
                element: <SudokuElement />
            }
        ]
    }
];



export default routes;