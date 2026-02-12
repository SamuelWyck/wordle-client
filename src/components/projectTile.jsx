import "../styles/projectTile.css";
import { Link } from "react-router-dom";



function ProjectTile({project}) {
    return (
        <Link to={project.link} className="project-link">
            <div className="project-tile">
                <div className="project-img-wrapper">
                    <img src={project.image} alt="image" />
                </div>
                <p>{project.title}</p>
            </div>
        </Link>
    );
};



export default ProjectTile;