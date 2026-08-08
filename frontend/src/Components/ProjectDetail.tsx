import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

interface Project{
    id : number;
    title : string;
    description : string;
}

export default function ProjectDetail(){
    const {id} = useParams();
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        async function getData(){
            const response = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`)
            const data = await response.json();
            setProject(data);
        }
        getData();
    }, [id])

    if(!project) return <p>Loading....</p>

    return(
        <>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
        </>
    )

}