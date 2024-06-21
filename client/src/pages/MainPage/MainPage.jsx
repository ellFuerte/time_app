import Feed from "../../components/Feed/Feed";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import './MainPage.css'


export default function MainPage() {
    return (
    <>
      <Topbar/>
      <div className="mainContainer">
        <Sidebar/>
        <Feed/>
      </div>

    </>
  )
}
