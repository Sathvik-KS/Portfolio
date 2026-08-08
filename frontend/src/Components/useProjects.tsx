import { useEffect, useState } from 'react';

interface Project{
    id : number;
    title : string;
    description : string;

    // userId : number;
    // id : number;
    // title : string;
    // body : string;

}

type Status = "success" | "error" | "loading";

export default function useProjects() : [Project[], string]{
    const [projects, setProjects] = useState<Project[]>([]);
    const [status, setStatus] = useState<Status>("loading");

    useEffect(() => {
        async function getData(){
            try{
                const response = await fetch("http://127.0.0.1:8000/api/projects/");
                // const response = await fetch("https://jsonplaceholder.typicode.com/posts");
                if(!response.ok){setStatus("error"); return;}
                const data = await response.json();
                setProjects(data);
                setStatus("success");
            }
            catch(error){setStatus("error");}
        }
        getData();
    }, []);

    return([projects, status]);

}