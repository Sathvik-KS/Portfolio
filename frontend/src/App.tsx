import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectList from './Components/ProjectList';
import RepoDetail from './Components/RepoDetail';
import Home from './Components/Home';
import About from './Components/About';
import Nav from './Components/Nav';



export default function App(){
    return(
        <BrowserRouter>
            <Nav/>
            <Routes>
                <Route path = "/" element = {<Home/>}></Route>
                <Route path = "/about" element = {<About/>}></Route>
                <Route path = "/projects" element = {<ProjectList/>}></Route>
                <Route path = "/projects/:name/" element = {<RepoDetail/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}