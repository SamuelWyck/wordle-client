import "./App.jsx";
import App from "./App.jsx";



const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <p>Hi</p>
            }
        ]
    }
];



export default routes;