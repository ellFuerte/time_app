

import HistoryInfo from '../HistoryInfo/HistoryInfo'
import ProfileInfo from '../ProfileInfo/ProfileInfo'
import './Home.css'
export default function Home(username) {

  return (
    <div className='home'>
        <div className="homeWrapper">
        <ProfileInfo username={username}/>
        <HistoryInfo username={username}/>
      </div>
    </div>
  )
}
