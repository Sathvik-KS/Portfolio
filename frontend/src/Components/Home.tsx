import useGithubRepos from "./useGithubRepos";

import profileImage from "/favicon.svg";

import "../index.css";

export default function Home(){

    const [repos, repoStatus] = useGithubRepos();

    return(
        <div style = {{padding : "120px", paddingBottom : "80px"}}>
            <div style = {{display : "flex"}}>
                <div id = "me">
                    <p style = {{color : "var(--accent)", fontWeight : "600", marginBottom : "12px"}}>Hi, I'm</p>
                    <h1 style = {{fontSize : "56px", fontWeight : 800, margin : 0, lineHeight : 1.1}}>Sathvik</h1>
                    <p style = {{
                        fontSize : "20px",
                        color : "var(--text-secondary)",
                        marginTop : "20px",
                        maxWidth : "500px",
                        lineHeight : 1.6,
                    }}>Backend-leaning SDE, Python-first. Currently building things</p>
                </div>
                <div id = "profile">
                    <img src = {profileImage} alt = "Profile" width = "200" />
                </div>
            </div>

            <h2 style = {{marginTop : "80px"}}>Github</h2>

            {repoStatus === "loading" && <p>Loading...</p>}
            {repoStatus === "error" && <p>Failed to fetch</p>}
            {repoStatus === "success" && (
                <ul>
                    {repos.map(r => <li key = {r.id} style = {{background : "var(--bg-secondary)", borderRadius : "8px", padding : "16px", marginBottom : "10px"}}>
                        <a href = {r.html_url} target = "_blank" rel = "noopener noreferrer" style = {{color: "var(--accent)", fontWeight : 600}}>{r.name}</a>
                        <p style = {{color : "var(--text-secondary)", fontSize : "14px"}}>{r.description ?? "No Description"}</p>
                        <span style = {{fontSize : "12px", color : "var(--text-secondary)"}}>⭐ {r.stargazers_count} {r.language && `. ${r.language}`}</span>
                    </li>)}
                </ul>
            )}

        </div>
    )
}