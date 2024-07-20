import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { Create, Delete, Settings, Message } from '@material-ui/icons'

import Skills from '../ProfileInfo/Skills/Skills'
import Role from '../ProfileInfo/Role/Role'


import ModalVacanciesItem from "../VacanciesItem/ModalVacanciesItem/ModalVacanciesItem";
import ModalVacancies from "../Templates/ModalVacancies/ModalVacancies";
import Editing from "./Editing/Editing"

import './ProfileInfo.css'
import DeleteUser from "./DeleteUser/DeleteUser";
import ResetPassword from "./ResetPassword/ResetPassword";
import FinishTime from "./FinishTime/FinishTime";
import AddNomination from "./AddNomination/AddNomination";
import ChangePassword from "./СhangePassword/СhangePassword";
import VoteNominations from "./VoteNominations/VoteNominations";

export default function ProfileInfo() {

    const [idDepartment, setIdDepartment] = useState('');
    const [isRole, setRole] = useState([]);
    const [accessData, setAccessData] = useState([]);
    const [timeZone, setTimeZone] = useState([])
    const [hasImage, setHasImage] = useState(false);
    const [allDateUser, setAllDateUser] = useState()

    const [modalVacancies, setModalVacancies] = useState(false)

    const [depsName, setDepsName] = useState([])

    const [cityName, setCityName] = useState([])

    const [user, setUser] = useState([])

    const [isFetching, setIsFetching] = useState(false)

    const [modalActive, setModalActive] = useState(false)

    const [modalActivePass, setModalActivePass] = useState(false)

    const [modalActiveVote, setModalActiveVote] = useState(false)

    const [modalVote, setModalVote] = useState(false)

    const [modalResetPassword, setModalResetPassword] = useState(false)

    const [modalFinishTime, setModalFinishTime] = useState(false)

    const [modalActiveDelete, setModalActiveDelete] = useState(false)

    const [modalActiveSkills, setModalActiveSkills] = useState(false)

    const [modalActiveRole, setModalActiveRole] = useState(false)

    const username = useParams()


    let localUser = !!username ? {_id: username.username, email: ""} : JSON.parse(localStorage.getItem('user'))
    const localUse = JSON.parse(localStorage.getItem('user'))


    const usersStatuses = {
        0: '',
        1: 'start',
        2: 'end',
        3: 'sick_leave',
        4: 'deleted',
        5: 'vacation',
        6: 'time_off',
        7: 'other'
    }

    function findStatus(k) {
        for (let i in usersStatuses) {
            if (i == k) {
                return usersStatuses[i]
            }
        }
    }

    useEffect(() => {

        const hasImageStatus = Object.keys(images).some(key =>
            user.nomination_status === key || user.nomination_status === parseInt(key)
        );
        setHasImage(hasImageStatus);

        const getNameDeps = async () => {
            const deps = {
                user: username.username
            }
            const res = await axios.post('/api/departments/', deps)
            setIdDepartment(res.data[0]['id'])
            setTimeZone(res.data[0]['timezone'])
            setDepsName(res.data[0]['department_name'])
            setCityName(res.data[0]['city_name'])
        }

        const fetchUser = async () => {
            localUser._id = !!localUser._id ? localUser._id : localUser.id
            localUser._id = !!username ? username.username : localUser._id
            const res = await axios.get('/api/user/' + username.username)
            const resUser = await axios.get('/api/user/' + localUse._id)
            setRole(resUser.data)
            const roleId = resUser.data.role_id;
            const resPermission = await axios.get('/api/permission/' + roleId);
            setAccessData(resPermission.data[0].get_permissions);
            setUser(res.data)
            setIsFetching(false)
        }

        fetchUser()
        getNameDeps()
    }, [
        user.user_name,
        user.email,
        user.phone_number,
        user.additional_contact,
        user.distribution_group,
        user.activity_profile,
        user.place_of_residence,
        username.username,
    ])


    localUser = (!!user && !Array.isArray(user)) ? user : localUser
    localUser.username = !!localUser.user_name ? localUser.user_name : localUser.username
    const name = localUser.email.toLowerCase()


    const images = {
        '1': {src: '../images/1.png', title: 'Тучка'},
        '2': {src: '../images/2.png', title: 'Аркадий Паровозов'},
        '3': {src: '../images/3.png', title: 'И так сойдет'},
        '4': {src: '../images/4.png', title: 'Портной'},
        '5': {src: '../images/5.png', title: 'Мама обезьянка'},
        '6': {src: '../images/6.png', title: 'Кот Матроскин'},
        '7': {src: '../images/7.png', title: 'Крот'},
        '8': {src: '../images/8.png', title: 'Птица говорун(голосуем только среди дежурных)'},
        '9': {src: '../images/9.png', title: 'Хома(Голосуем среди коллег из внедрения)'},
        '10': {src: '../images/10.png', title: 'Симка и нолик'}
    };



    const getChangeVacancies = () => {
        if (isRole.isadmin) {
            setModalVacancies(true)
            setAllDateUser(user)
        }
    }
    const updateNominationStatus = (newStatus) => {
        setUser(prevState => ({
            ...prevState,
            nomination_status: newStatus
        }));
    };


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
    console.log('isRole.isadmin=',isRole.isadmin)
    return (

        <div className='profileInfo'>

            {Object.keys(images).map((key, id) => (
                (user.nomination_status === key || user.nomination_status === parseInt(key)) &&
                <img
                    key={id}
                    src={images[key].src}
                    title={images[key].title}
                    alt={`Image for ${key}`}
                    className='imagesProfile'
                />
            ))}

            {isFetching ? <div className='isFatching'>Загрузка...</div> :
                <div className={'employeePI ' + (findStatus(user.status))}>
                    <div className='ProfileName' style={{ paddingTop: hasImage ? '10px' : '0px' }}>

                        {user.user_name}


                            {(hasAccess(7) && localUse._id===username.username  || (hasAccess(5) && localUse._id!==username.username && isRole.role_id==='4') || (hasAccess(5) && localUse._id!==username.username && isRole.role_id==='3')) && <Create style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '5px'}} onClick={() => setModalActive(true)}/>}
                                <Editing modalActive={modalActive} setModalActive={setModalActive}/>


                            {hasAccess(15) && <Delete style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => setModalActiveDelete(true)}/>}
                                <DeleteUser modalActiveDelete={modalActiveDelete}
                                            setModalActiveDelete={setModalActiveDelete} user={user}/>

                        {(hasAccess(17)  && localUse._id === username.username) ?
                            <Link to={`/AdminPanel`}>
                                <Settings
                                    style={{cursor: 'pointer', fontSize: '20px', paddingTop: '5px', color: 'black'}}/>
                            </Link>
                            : ''}
                    </div>


                    <div>
                        <label style={{cursor: 'pointer'}} onClick={getChangeVacancies}
                               className='ProfileLinkVacancies'>{user.vacancy_code===null && user.nomination_status!==null ? <br/>:user.vacancy_code}</label>
                    </div>



{/*                    {
                        <Message style={{cursor: 'pointer', fontSize: 'large'}} />
                    }*/}


                    <div style={{border: '3px dashed black', padding: '10px'}}>
                        <div className='ProfileInfoCard'>Email: {name.charAt(0).toUpperCase() + name.slice(1)}</div>
                        <div className='ProfileInfoCard'>Телефон: {user.phone_number}</div>
                        <div className='ProfileInfoCard'>
                            {isRole.isadmin  || localUse._id === username.username ? 'Доп.Контакт: ' : ''}
                            {isRole.isadmin  || localUse._id === username.username ? user.additional_contact : ''}
                        </div>
                        <div className='ProfileInfoCard'>Группа рассылки: {user.distribution_group}</div>
                        <div className='ProfileInfoCard'>Профиль деятельности: {user.activity_profile}</div>
                        <div className='ProfileInfoCard'>Город проживания: {cityName}</div>
                        <div className='ProfileInfoCard'>
                            {localUse.isAdmin || localUse._id === username.username ? 'Адрес фактического проживания: ' : ''}
                            {localUse.isAdmin || localUse._id === username.username ? user.place_of_residence : ''}
                        </div>
                        <div className='ProfileInfoCard'>Подразделение: <Link to={`/department/${idDepartment}`} className='linkDepartmentName'>{depsName}</Link></div>
                    </div>



                        {(hasAccess(5) && localUse._id===username.username  || (hasAccess(5) && localUse._id!==username.username && isRole.role_id==='4') || (hasAccess(5) && localUse._id!==username.username && isRole.role_id==='3')) && <div className='changePass' onClick={() => setModalActivePass(true)}>Изменить пароль</div>}
                            <ChangePassword modalActivePass={modalActivePass} setModalActivePass={setModalActivePass}/>



                            {hasAccess(13) && <div className='changePass' onClick={() => setModalResetPassword(true)}>Сбросить пароль</div>}
                                <ResetPassword modalResetPassword={modalResetPassword} setModalResetPassword={setModalResetPassword} username={username.username}/>




                            {hasAccess(14) && localUse._id!==username.username && <div className='changePass' onClick={() => setModalFinishTime(true)}>Закончить</div>}
                                <FinishTime modalFinishTime={modalFinishTime} setModalFinishTime={setModalFinishTime}
                                            user={user.id} status={user.status}/>



                        {hasAccess(6) && localUse._id===username.username && <div className='changePass' onClick={() => setModalActiveVote(true)}>Проголосовать</div>}
                            <VoteNominations modalActiveVote={modalActiveVote} setModalActiveVote={setModalActiveVote} username={username}/>



                            {hasAccess(19) && <div className="changePass" onClick={() => setModalVote(true)}>Закрепить номинацию</div>}
                                <AddNomination modalVote={modalVote} setModalVote={setModalVote} username={username}
                                               updateNominationStatus={updateNominationStatus}/>



                    <div className="changePass" onClick={() => setModalActiveSkills(true)}>
                        Навыки
                    </div>

                    {hasAccess(18) && <div className="changePass" onClick={() => setModalActiveRole(true)}>
                        Назначить роль
                    </div>}

                    <Skills modalActiveSkills={modalActiveSkills} setModalActiveSkills={setModalActiveSkills}/>
                    <Role modalActiveRole={modalActiveRole} setModalActiveRole={setModalActiveRole}  updateNominationStatus={updateNominationStatus} username={username}/>
                </div>

            }
            <ModalVacancies active={modalVacancies} setActive={setModalVacancies}>
                <ModalVacanciesItem allDateUser={allDateUser}/>
            </ModalVacancies>
            <Skills/>
        </div>
    )
}
