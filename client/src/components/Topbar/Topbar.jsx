import {ExitToApp} from '@material-ui/icons'
import axios from 'axios'
import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import Status from '../Status/Status'
import Modal from "../Templates/Modal/Modal";
import './Topbar.css'
import MessagePost from '../MessagePost/MessagePost'
import SearchBlock from "../SearchBlock/SearchBlock";


export default function Topbar() {
  const localUser = JSON.parse(localStorage.getItem('user'))
  const [countAll_users, setCountAll_users] = useState(0)
  const [countWorked_today, setCountWorked_today] = useState(0)
  const [countWorked_yesterday, setCountWorked_yesterday] = useState(0)
  const [countSickLeave_today, setCountSickLeave_today] = useState(0)
  const [countSick_yesterday, setCountSick_yesterday] = useState(0)
  const [countVacation_today, setCountVacation_today] = useState(0)
  const [countVacation_yesterday, setCountVacation_yesterday] = useState(0)
  const departId = useParams().username
  useEffect(() => {

    const fetchUser = async () => {
      const res = await axios.get('/api/user/')
      setNotificationCount(res.data)
      res.data.sort((a, b) => a.user_name.localeCompare(b.user_name))
      let filterUsers = filterUser(res.data)
      setAllUsers(filterUsers)
    }

    const fetchUserName = async () => {
      const res = await axios.get('/api/user/' + localUser._id)
      setUser(res.data)
    }

    const get_statistics_all_users = async () => {
      const getUsers = {
        id: localUser._id
      }
      if (localUser.isAdmin === true) {
        const res = await axios.post('/api/get_statistics_all_users', getUsers)


        if(res.data[0]['get_statistics_all_users'][0]['all_users']===null){
          res.data[0]['get_statistics_all_users'][0]['all_users']=0
        }else{
          setCountAll_users(res.data[0]['get_statistics_all_users'][0]['all_users'].length)
        }

        if(res.data[0]['get_statistics_all_users'][0]['not_working_today']===null){
          res.data[0]['get_statistics_all_users'][0]['not_working_today']=0
        }else{
          setCountWorked_today(res.data[0]['get_statistics_all_users'][0]['not_working_today'].length)
        }

        if(res.data[0]['get_statistics_all_users'][0]['not_worked_yesterday']===null){
          res.data[0]['get_statistics_all_users'][0]['not_worked_yesterday']=0
        }else{
          setCountWorked_yesterday(res.data[0]['get_statistics_all_users'][0]['not_worked_yesterday'].length)
        }


        if(res.data[0]['get_statistics_all_users'][0]['sick_today']===null){
          res.data[0]['get_statistics_all_users'][0]['sick_today']=0
        }else {
          setCountSickLeave_today(res.data[0]['get_statistics_all_users'][0]['sick_today'].length)
        }


        if(res.data[0]['get_statistics_all_users'][0]['sick_yesterday']===null){
          res.data[0]['get_statistics_all_users'][0]['sick_yesterday']=0
        }else{
          setCountSick_yesterday(res.data[0]['get_statistics_all_users'][0]['sick_yesterday'].length)
        }

        if(res.data[0]['get_statistics_all_users'][0]['vacation_today']===null){
          res.data[0]['get_statistics_all_users'][0]['vacation_today']=0
        }else{
          setCountVacation_today(res.data[0]['get_statistics_all_users'][0]['vacation_today'].length)
        }

        if(res.data[0]['get_statistics_all_users'][0]['vacation_yesterday']===null){
          res.data[0]['get_statistics_all_users'][0]['vacation_yesterday']=0
        }else{
          setCountVacation_yesterday(res.data[0]['get_statistics_all_users'][0]['vacation_yesterday'].length)
        }
      }
    }

    get_statistics_all_users()
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

  const [user, setUser] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [allUsers, setAllUsers] = useState([])
  const [findUsers, setFindUsers] = useState([])
  const [isBlock, setIsBlock] = useState(false)

  // выход
  const logOut = () => {
    localStorage.clear()
    window.location.reload()
    window.location.href = '/'
  }


  // получение всех пользователей


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
  const [isHovered, setIsHovered] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);

  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
      <div>
        <div className='topbarContainer'>
          <div className="topbarLeft">
            <Status/>
          </div>
          <div className="topbarCenter">
            {localUser.isAdmin === true ?
              <div className='statistics'>
                <Link className="topbarLinkCount" onClick={() => window.location.href = `/all_users/`}
                      title="Всего сотрудников">{countAll_users}</Link> /
                <Link className="topbarLinkCount" onClick={() => window.location.href = `/not_working_today/`}
                      title="Сегодня не работают">{countWorked_today}</Link> /
                <Link className="topbarLinkCount" onClick={() => window.location.href = `/not_worked_yesterday/`}
                      title="Вчера не работали">{countWorked_yesterday}</Link> /
                <Link className="topbarLinkCount" onClick={() => window.location.href = `/sick_today/`}
                      title="Сегодня болеют">{countSickLeave_today}</Link> /
                <Link className="topbarLinkCount" onClick={() => window.location.href = `/sick_yesterday/`}
                      title="Вчера болели">{countSick_yesterday}</Link> /
                <Link className="topbarLinkCount" onClick={() => window.location.href = `/vacation_today/`}
                      title="Сегодня в отпуске">{countVacation_today}</Link>/
                <Link className="topbarLinkCount" onClick={() => window.location.href = `/vacation_yesterday/`}
                      title="Вчера в отпуске">{countVacation_yesterday}</Link>
              </div> :
              <div></div>
          }

          </div>
          <div className="topbarRight">
            <div className="topbarLinks">
              <div>
                <Link to={`/department/${user.main_department}`} className="topbarLink">
                  <img src={'../images/VTB.png'}
                   alt='VTB'
                   width='150'
                   height='50'/></Link>
              </div>
              <div className='vr'></div>

              <div className='topPage'><Link to={`/profile/${user.id}`}
                                             onClick={() => window.location.href = `/profile/${user.id}`}
                                             className="topbarLink">{localUser.username}</Link>

              </div>

              {localUser.isAdmin
                  ? <div className='vr'></div>:''
              }

              {localUser.isAdmin
                  ?
                  <div className='topPage'>
                    <Link to='/Reports' className="topbarLink"><span className='link'>Отчеты</span></Link>

                  </div> : ''}

              <div className='vr'></div>

             {/* <div className='topPageVacations' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <span className='link'>Вакансии</span>
                  {isHovered && (
                      <div className='vacationList'>
                        <ul className='vacationListUl'>
                          <li><Link to='/VacanciesAdd' className='LinkVacations'>Добавить вакансию</Link></li>
                          <li><Link to='/VacanciesView' className='LinkVacations'>Просмотреть вакансии</Link></li>
                        </ul>
                      </div>
                  )}
              </div>*/}
              <div className='topPage'>
                <Link to='/Information' className="topbarLink"><span className='link'>?</span></Link>
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
