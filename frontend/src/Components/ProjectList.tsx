import useProjects from "./useProjects";
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

  const [projects , status] = useProjects();

    if(status === "error") return (<p>Failed</p>);
    if(status === "loading") return (<p>Loading ...</p>);

  return(
    <>
      <ul style = {ul_style}>
        {projects.slice(0, 5).map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`}>
                    <Card title={p.title} description={p.description} />
                </Link>
        ))}
      </ul>
    </>
  )
}