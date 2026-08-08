interface Project{
    title: string;
    description : string;

}


export default function Card({title, description} : Project){
    return(
        <>
            <li style = {{width : 100,height: 200 , border : "2px, solid, black"}}>
                <h6>{title}</h6>
                <p>{description}</p>
            </li>
        </>
    )
}