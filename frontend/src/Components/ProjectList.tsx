import useProjects from "./useProjects";
import Card from "./Card";
import { Link } from 'react-router-dom'

export default function ProjectList(){

  const [projects , status] = useProjects();

    if(status === "error") return (<p>Failed</p>);
    if(status === "loading") return (<p>Loading ...</p>);

  return(
    <>
      <ul>
        {projects.slice(0, 5).map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`}>
                    <Card title={p.title} description={p.description} />
                </Link>
        ))}
      </ul>
    </>
  )
}