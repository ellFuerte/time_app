import HistoryInfo from '../ProfileInfo/HistoryInfo/HistoryInfo'
import ProfileInfo from '../ProfileInfo/ProfileInfo'
import './Home.css'



export default function Home(username) {
    const localUser = JSON.parse(localStorage.getItem('user'))

  return (

          <div className="homeWrapper">

              <ProfileInfo username={username.username.username}/>

              {(localUser._id!==username.username.username && localUser.isAdmin) || localUser._id===username.username.username ?
              <HistoryInfo/> :''
              }

          </div>
  )
}
