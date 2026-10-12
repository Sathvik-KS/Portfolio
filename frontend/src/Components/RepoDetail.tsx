import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';
import "../index.css"

const divStyle = {
    background : "var(--bg-secondary)",
    border : "1px solid var(--border)",
    borderRadius : "12px",
    padding : "32px",
    marginTop : "40px",
    maxWidth : "600px",   
}


interface Repo{
    id : number;
    name : string;
    description : string | null;
    html_url : string;
    stargazers_count: number;
    language: string | null;
    size : number;
}

export default function RepoDetail(){
    const {name} = useParams();
    const [project, setProject] = useState<Repo | null>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        async function getData(){
            setStatus("loading");
            try {
                const response = await fetch(`https://api.github.com/repos/Sathvik-KS/${encodeURIComponent(name ?? "")}`)
                if(!response.ok){ setStatus("error"); return; }
                const data = await response.json();
                setProject(data);
                setStatus("success");
            } catch {
                setStatus("error");
            }
        }
        getData();
    }, [name])

    if(status === "loading") return <p>Loading....</p>

    if(status === "error" || !project) return(
        <>
            <Link to = "/projects" style = {{color : "var(--accent)"}}>Back to projects</Link>
            <p>Could not load this repository.</p>
        </>
    )

    return(
        <>
        <Link to = "/projects" style = {{color : "var(--accent)"}}>Back to projects</Link>
        <div style = {divStyle}>
            <h1>{project.name}</h1>
            <p>{project.description ?? "There is no description"}</p>
            <p>{project.stargazers_count} ⭐</p>
            <p>{project.language ?? "Unknown language"}</p>
            <p>Number of items : {project.size}</p>
            {project.html_url && <a href = {project.html_url} target = "_blank" rel = "noopener noreferrer" style = {{color : "var(--accent)"}}>View on Github</a> }
        </div>
        </>
    )

}