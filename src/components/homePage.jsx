import "../styles/homePage.css";
import ProjectTile from "./projectTile.jsx";
import { useRef } from "react";
import projects from "../utils/projects.js";



function HomePage() {
    const projectsRef = useRef(buildProjectTiles());


    function buildProjectTiles() {
        const tiles = [];
        for (let project of projects) {
            const tile = <ProjectTile project={project} key={project.link} />
            tiles.push(tile);
        }
        return tiles;
    };


    return (
        <main className="home-page">
            <p className="site-title">Games</p>
            <div className="page-tiles">
                {projectsRef.current}
            </div>
        </main>
    );
};



export default HomePage;