import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css'
import { useParams } from "react-router-dom";

export default function Layout({ children}) {
    const username = useParams().username

    return (
        <>
            <Topbar />
            <div className="MainContainers">
                <Sidebar username={username}/>
                <div className="mainContent">
                    {children}
                </div>
            </div>
        </>
    );
}