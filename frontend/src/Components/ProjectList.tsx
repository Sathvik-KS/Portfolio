import useGithubRepos from "./useGithubRepos";
import Card from "./Card";
import { Link } from 'react-router-dom'


const ul_style = {
  display : "grid",
  gridTemplateColumns : "repeat(auto-fill, minmax(240px, 1fr))",
  gap : "20px",
  listStyle : "none",
  padding : "0"
}


export default function ProjectList(){

  const [repos , repoStatus] = useGithubRepos();

    if(repoStatus === "error") return(<p>Cannot fetch</p>);
    if(repoStatus === "loading")return(<p>Loading...</p>);
    if(repos.length === 0 && repoStatus === "success") return (<p>No repos</p>);



  return(
    <>
      <ul style = {ul_style}>
        {repos.slice(0, 5).map((r) => (
                <Link key={r.id} to={`/projects/${r.name}/`}>
                    <Card name={r.name} description={r.description} id = {r.id} html_url = {r.html_url} stargazers_count={r.stargazers_count} language = {r.language}/>
                </Link>
        ))}
      </ul>
    </>
  )
}