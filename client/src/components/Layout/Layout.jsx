import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';

export default function Layout({ children }) {
    return (
        <>
            <Topbar />
            <div className="mainContainer">
                <Sidebar />
                <div className="content">
                    {children}
                </div>
            </div>
        </>
    );
}