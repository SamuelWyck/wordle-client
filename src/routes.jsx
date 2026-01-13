import "./App.jsx";
import App from "./App.jsx";
import Wordle from "./components/wordle.jsx";



const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Wordle />
            }
        ]
    }
];



export default routes;