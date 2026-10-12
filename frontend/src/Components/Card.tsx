import "../index.css";

interface Repo{
    id : number;
    name : string;
    description : string | null;
    html_url : string;
    stargazers_count: number;
    language: string | null;
}

export default function Card({name, description, stargazers_count, language} : Repo){
    return(
        <>
            <li className = "project-card">
                <h3 style = {{margin : "0 0 8px 0"}}>{name}</h3>
                <p style = {{color : "var(--text-secondary)", fontSize : "14px"}}>{description ?? "No description"}</p>
                <p style = {{color : "var(--text-secondary)", fontSize : "14px"}}>{stargazers_count} ⭐</p>
                <p style = {{color : "var(--text-secondary)", fontSize : "14px"}}>{language ?? "Unknown language" }</p>
            </li>
        </>
    )
}