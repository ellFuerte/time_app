import Home from '../../components/Home/Home'

import './Profile.css'
import {useParams} from "react-router-dom";

export default function Profile() {
    const username=useParams()
  return (
    <>
        <Home username={username}/>
    </>
  )
}
