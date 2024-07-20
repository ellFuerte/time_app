import HistoryInfo from '../ProfileInfo/HistoryInfo/HistoryInfo'
import ProfileInfo from '../ProfileInfo/ProfileInfo'
import './Home.css'
import { useEffect, useState } from "react";
import axios from "axios";



export default function Home(username) {
    const [accessData, setAccessData] = useState([]);
    const [admin, setAdmin] = useState([]);
    const localUser = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        const fetchUser = async () => {
            const resUser = await axios.get('/api/user/' + localUser._id)
            setAdmin(resUser.data.isadmin)
            const roleId = resUser.data.role_id;
            const resPermission = await axios.get('/api/permission/' + roleId);
            setAccessData(resPermission.data[0].get_permissions);
        }
        fetchUser()
    },[])


    const hasAccess = (toolId) => {
        // Проверяем, что accessData не null и не undefined
        if (!accessData) {
            return false;
        }

        // Проверяем, что accessData - это массив
        if (!Array.isArray(accessData)) {
            return false;
        }

        return accessData.some(item => item.tool_id === toolId && item.is_accessible);
    }


  return (

          <div className="homeWrapper">
              <ProfileInfo/>
              {(hasAccess(18) || localUser._id===username.username.username || admin ) && <HistoryInfo />}
          </div>
  )
}
