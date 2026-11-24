import { useEffect, useState } from 'react';
import { config } from '../config';

interface Project{
    id : number;
    title : string;
    description : string;
}

type Status = "success" | "error" | "loading";

export default function useProjects() : [Project[], string]{
    const [projects, setProjects] = useState<Project[]>([]);
    const [status, setStatus] = useState<Status>("loading");

    useEffect(() => {
        async function getData(){
            try{
                const response = await fetch(`${config.apiBaseUrl}/api/projects/`);
                if(!response.ok){setStatus("error"); return;}
                const data = await response.json();
                setProjects(data);
                setStatus("success");
            }
            catch{setStatus("error");}
        }
        getData();
    }, []);

    return([projects, status]);

}