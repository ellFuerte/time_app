import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css'
export default function Layout({ children }) {
    return (
        <>
            <Topbar />
            <div className="MainContainers">
                <Sidebar />
                <div className="mainContent">
                    {children}
                </div>
            </div>
        </>
    );
}