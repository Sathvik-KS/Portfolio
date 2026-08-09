import { useState, useEffect } from 'react';

interface Repo{
    id : number;
    name : string;
    description : string | null;
    html_url : string;
    stargazers_count: number;
    language: string | null;
}

type Status = "success" | "loading" | "error";

export default function useGithubRepos() : [Repo[], Status]{
    const [repos, setRepos] = useState<Repo[]>([]);
    const [status, setStatus] = useState<Status>("loading");

    useEffect(() => {
        async function getData(){
            try{
                const response = await fetch("https://api.github.com/users/Sathvik-KS/repos")
                if(!response.ok){setStatus("error"); return;}
                const data = await response.json();
                setRepos(data);
                setStatus("success");
            }
            catch(error){setStatus("error");}
        }
        getData();
    }, []);

    return([repos, status]);

}