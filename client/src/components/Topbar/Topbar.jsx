import {ExitToApp} from '@material-ui/icons'
import axios from 'axios'
import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import Status from '../Status/Status'
import Modal from "../Templates/Modal/Modal";
import './Topbar.css'
import MessagePost from '../MessagePost/MessagePost'
import SearchBlock from "../SearchBlock/SearchBlock";
import Statistics from "./Statistics/Statistics";


export default function Topbar() {
  const [user, setUser] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [allUsers, setAllUsers] = useState([])
  const [findUsers, setFindUsers] = useState([])
  const [isBlock, setIsBlock] = useState(false)
  const localUser = JSON.parse(localStorage.getItem('user'))
  const departId = useParams().username


  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get('/api/user/')
      setNotificationCount(res.data)
      res.data.sort((a, b) => a.user_name.localeCompare(b.user_name))
      let filterUsers = filterUser(res.data)
      setAllUsers(filterUsers)

    }

    const typework = async () => {
      const res = await axios.get('/api/typework_status/')
    }


    const fetchUserName = async () => {
      const res = await axios.get('/api/user/' + localUser._id)
      setUser(res.data)
    }


    typework()
    fetchUserName()
    fetchUser()

  }, [])


  function filterUser(users) {
    return users.filter(user => user.status === 1)
        .concat(users.filter(user => user.status === 2))
        .concat(users.filter(user => user.status === 3))
        .concat(users.filter(user => user.status !== 1 && user.status !== 2 && user.status !== 3 && user.status !== 4))
        .concat(users.filter(user => user.status === 4))
  }

  // выход
  const logOut = () => {
    localStorage.clear()
    window.location.reload()
    window.location.href = '/'
  }




  //Поиск пользователя
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      setFindUsers(allUsers.filter(user => {
        return user.user_name.toLowerCase().includes(searchValue.toLowerCase())
      }))
      setIsBlock(true)
    }
  }
  //Поиск пользователя
  const handleClick = (e) => {
    if (e.target.value !== '') {
      setFindUsers(allUsers.filter(user => {
        return user.user_name.toLowerCase().includes(searchValue.toLowerCase())
      }))
      setIsBlock(true)
    }
  }
  if (user.main_department === departId) {
  }



  const [notificationCount, setNotificationCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }



  return (
      <div>
        <div className='topbarContainer'>
          <div className="topbarLeft">
            <Status/>
          </div>
          <Statistics/>
          <div className="topbarRight">
            <div className="topbarLinks">
              <div>
                <Link to={`/department/${user.main_department}`} className="topbarLink">
                  <img src={'../images/VTB.png'} alt='VTB' width='150' height='50'/>
                </Link>
              </div>
              <div className='vr'></div>

              <div className='topPage'><Link to={`/profile/${user.id}`} className="topbarLink">{localUser.username}</Link>

              </div>

              {
                localUser.isAdmin
                    ? <div className='vr'></div>
                    :''
              }

              {
                localUser.isAdmin
                    ?
                  <div className='topPage'>
                    <Link to='/Reports' className="topbarLink"><span className='link'>Отчеты</span></Link>
                  </div>
                    : ''
              }

              <div className='vr'></div>

              <div className='topPage'>
                <Link to='/Information' className="topbarLink">?</Link>
              </div>
            </div>

            <div className="search">
              <input onKeyPress={handleKeyPress} value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                     type="search" name="" placeholder="поиск пользователя" className="input"/>
              <button onClick={handleClick} value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                      type="submit" className="submit"/>
            </div>

{/*            <div className="notification">
              <div onClick={togglePopup} className='image-container'>
                <img src='../images/bell.png' className="message"/>
                {notificationCount.length > 0 && <div className="notification-badge">{notificationCount.length}</div>}
              </div>
              {isOpen && (
                  <div className="notification-popup">
                    {allUsers.map((user, id) => (
                        <MessagePost key={id} user={user} />
                    ))}
                  </div>
              )}
            </div>*/}
            <div className="exit">
              <ExitToApp onClick={logOut}/>
            </div>
          </div>
        </div>
        {isBlock
            ? <Modal active={handleClick} setActive={setIsBlock} >
              <h1><p align="center">Поиск</p></h1>
              <h4>Найдено: {findUsers.length}</h4>
              <hr/>
              <form>
                <div>
                  {findUsers.map((user) => <SearchBlock user={user} />)}
                </div>
                <button className="button" type="submit" onClick={() => setIsBlock(false)}>
                  Закрыть
                </button>
              </form>
            </Modal>
            : <></>
        }
      </div>
  )
}
