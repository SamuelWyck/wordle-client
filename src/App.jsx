import './App.css';
import Header from './components/header';
import { Outlet } from 'react-router-dom';



function App() {
	return (
		<>	
		<Header />
		<Outlet />
		<p></p>
		</>
	);
};



export default App;