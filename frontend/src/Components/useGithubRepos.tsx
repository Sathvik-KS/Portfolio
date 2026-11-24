import { useState, useEffect } from 'react';
import { config } from '../config';

interface Repo{
    id : number;
    name : string;
    description : string | null;
    html_url : string;
    stargazers_count: number;
    language : string | null;
}

type Status = "success" | "loading" | "error";

export default function useGithubRepos() : [Repo[], Status]{
    const [repos, setRepos] = useState<Repo[]>([]);
    const [status, setStatus] = useState<Status>("loading");

    useEffect(() => {
        async function getData(){
            try{
                const headers: Record<string, string> = {
                    'Accept': 'application/vnd.github+json',
                };
                // Use a token if one is configured — dramatically raises the rate limit
                if (config.githubToken) {
                    headers['Authorization'] = `Bearer ${config.githubToken}`;
                }

                const response = await fetch(
                    `https://api.github.com/users/${config.githubUsername}/repos`,
                    { headers }
                );
                if(!response.ok){setStatus("error"); return;}
                const data = await response.json();
                setRepos(data);
                setStatus("success");
            }
            catch{setStatus("error");}
        }
        getData();
    }, []);

    return([repos, status]);

}