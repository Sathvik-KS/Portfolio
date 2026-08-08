import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';
import "../index.css"

let divStyle = {
    background : "var(--ng-secondary)",
    border : "1px solid var(--border)",
    borderRadius : "12px",
    padding : "32px",
    marginTop : "40px",
    maxWidth : "600px",   
}


interface Project{
    id : number;
    title : string;
    description : string;
    github_link : string;
}

export default function ProjectDetail(){
    const {id} = useParams();
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        async function getData(){
            const response = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`)
            if(response.ok){
                const data = await response.json();
                setProject(data);
            }
        }
        getData();
    }, [id])

    if(!project) return <p>Loading....</p>

    return(
        <>
        <Link to = "/projects" style = {{color : "var(--accent)"}}>Back to projects</Link>
        <div style = {divStyle}>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            {project.github_link && <a href = {project.github_link} target = "_blank" rel = "noopener noreferrer" style = {{color : "var(--accent"}}>View on Github</a> }
        </div>
        </>
    )

}