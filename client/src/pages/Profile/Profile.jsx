import Home from '../../components/Home/Home'
import Sidebar from '../../components/Sidebar/Sidebar'
import Topbar from '../../components/Topbar/Topbar'
import './Profile.css'
import {useParams} from "react-router-dom";

export default function Profile() {
    const username=useParams()
  return (
    <>
      <Topbar/>
      <div className="profile">
        <Sidebar/>
        <Home username={username}/>
        <div style={{flex:'2'}}></div>
      </div>
    </>
  )
}
