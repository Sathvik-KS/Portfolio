import "../index.css";

interface Project{
    title: string;
    description : string;

}

// let liStyle = {
    // listStyle : "none",
    // background : "var(--bg-secondary)",
    // border : "12px",
    // borderRadius : "12px",
    // // width : "260px",
    // padding : "20px 24px",
    
// }


export default function Card({title, description} : Project){
    return(
        <>
            <li className = "project-card">
                <h3 style = {{margin : "0 0 8px 0"}}>{title}</h3>
                <p style = {{color : "var(--text-secondary)", fontSize : "14px"}}>{description}</p>
            </li>
        </>
    )
}