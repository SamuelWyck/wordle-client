import "./App.jsx";
import App from "./App.jsx";
import Wordle from "./components/wordle.jsx";
import SudokuElement from "./components/sudokuElement.jsx";
import TwentyFourtyEightElement from "./components/TwentyFourtyEightElement.jsx";
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
                path: "/sudoku",
                element: <SudokuElement />
            },
            {
                path: "/2048",
                element: <TwentyFourtyEightElement boardWidth={4} boardHeight={4} />
            },
            {
                path: "*",
                element: <Navigate to={"/"} replace={true} />
            }
        ]
    }
];



export default routes;