import useProjects from "./useProjects";
import useGithubRepos from "./useGithubRepos";
import Card from "./Card";
import { Link } from 'react-router-dom'


let ul_style = {
  display : "grid",
  gridTemplateColumns : "repeat(auto-fill, minmax(240px, 1fr)",
  gap : "20px",
  listStyle : "none",
  padding : "0"
}


export default function ProjectList(){

  const [projects , projectStatus] = useProjects();
  const [repos , repoStatus] = useGithubRepos();

    // if(projectStatus === "error") return (<p>Failed</p>);
    // if(projectStatus === "loading") return (<p>Loading ...</p>);

    if(repoStatus === "error") return(<p>No repos</p>);
    if(repos.length === 0 || repoStatus === "loading")return(<p>Loading...</p>)



  return(
    <>
      <ul style = {ul_style}>
        {/* {projects.slice(0, 5).map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`}>
                    <Card title={p.title} description={p.description} />
                </Link>
        ))} */}

          {repos.map(r => <li key = {r.id}>{r.name}</li>)}

      </ul>
    </>
  )
}