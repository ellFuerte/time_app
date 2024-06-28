import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { Create, Delete, Settings, Message } from '@material-ui/icons'

import Skills from '../ProfileInfo/Skills/Skills'

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
            setTimeZone(res.data[0]['timezone'])
            setDepsName(res.data[0]['department_name'])
            setCityName(res.data[0]['city_name'])
        }

        const fetchUser = async () => {
            localUser._id = !!localUser._id ? localUser._id : localUser.id
            localUser._id = !!username ? username.username : localUser._id
            const res = await axios.get('/api/user/' + username.username)
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
        if (localUse.isAdmin) {
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

                        {localUse.isAdmin || localUse._id === username.username
                            ?
                            <>
                                <Create style={{cursor: 'pointer', fontSize: '20px', paddingLeft: '5px'}}
                                        onClick={() => setModalActive(true)}/>
                                <Editing modalActive={modalActive} setModalActive={setModalActive}/>
                            </>
                            : ''}

                        {localUse.isAdmin ?
                            <>
                                <Delete style={{cursor: 'pointer', fontSize: '20px'}}
                                        onClick={() => setModalActiveDelete(true)}/>
                                <DeleteUser modalActiveDelete={modalActiveDelete}
                                            setModalActiveDelete={setModalActiveDelete} username={username.username}
                                            user={user.id}/>
                            </>
                            : ''}


                        {localUse.isAdmin === true && localUse._id === user.id ?
                            <Link to={`/AdminPanel`}>
                                <Settings
                                    style={{cursor: 'pointer', fontSize: '20px', paddingTop: '5px', color: 'black'}}/>
                            </Link>
                            : ''}
                    </div>


                    <div>
                        <label style={{cursor: 'pointer'}} onClick={getChangeVacancies}
                               className='ProfileLinkVacancies'>{user.vacancy_code}</label>
                    </div>


{/*                    {
                        <Message style={{cursor: 'pointer', fontSize: 'large'}} />
                    }*/}


                    <div style={{border: '3px dashed black', padding: '10px'}}>
                        <div className='ProfileInfoCard'>Email: {name.charAt(0).toUpperCase() + name.slice(1)}</div>
                        <div className='ProfileInfoCard'>Телефон: {user.phone_number}</div>
                        <div className='ProfileInfoCard'>
                            {localUse.isAdmin !== false || localUse._id === username.username ? 'Доп.Контакт: ' : ''}
                            {localUse.isAdmin !== false || localUse._id === username.username ? user.additional_contact : ''}
                        </div>
                        <div className='ProfileInfoCard'>Группа рассылки: {user.distribution_group}</div>
                        <div className='ProfileInfoCard'>Профиль деятельности: {user.activity_profile}</div>
                        <div className='ProfileInfoCard'>Город проживания: {cityName}</div>
                        <div className='ProfileInfoCard'>
                            {localUse.isAdmin !== false || localUse._id === username.username ? 'Адрес фактического проживания: ' : ''}
                            {localUse.isAdmin !== false || localUse._id === username.username ? user.place_of_residence : ''}
                        </div>
                        <div className='ProfileInfoCard'>Подразделение: {depsName}</div>
                    </div>

                    {
                        localUse.isAdmin || localUse._id === username.username ? <>
                            <div className='changePass' onClick={() => setModalActivePass(true)}>Изменить пароль</div>
                            <ChangePassword modalActivePass={modalActivePass} setModalActivePass={setModalActivePass}/>
                        </> : ''

                    }

                    {
                        localUse.isAdmin ?
                            <>
                                <div className='changePass' onClick={() => setModalResetPassword(true)}>Сбросить
                                    пароль
                                </div>
                                <ResetPassword modalResetPassword={modalResetPassword}
                                               setModalResetPassword={setModalResetPassword}
                                               username={username.username}/>
                            </>
                            : ''
                    }

                    {
                        localUse.isAdmin ?
                            <>
                                <div className='changePass' onClick={() => setModalFinishTime(true)}>Закончить</div>
                                <FinishTime modalFinishTime={modalFinishTime} setModalFinishTime={setModalFinishTime}
                                            user={user.id} status={user.status}/>
                            </>
                            : ''
                    }

                    {
                        localUse._id === user.id ?<>
                            <div className='changePass'
                                 onClick={() => setModalActiveVote(true)}>Проголосовать</div>
                            <VoteNominations modalActiveVote={modalActiveVote} setModalActiveVote={setModalActiveVote} username={username}/>
                            </>
                            : ''
                    }

                    {
                        localUse.isAdmin ?
                            <>
                                <div className="changePass" onClick={() => setModalVote(true)}>Закрепить номинацию</div>
                                <AddNomination modalVote={modalVote} setModalVote={setModalVote} username={username}
                                               updateNominationStatus={updateNominationStatus}/>
                            </> : ''
                    }
                    <div className="changePass" onClick={() => setModalActiveSkills(true)}>Навыки</div>
                    <Skills modalActiveSkills={modalActiveSkills} setModalActiveSkills={setModalActiveSkills}/>
                </div>
            }
            <ModalVacancies active={modalVacancies} setActive={setModalVacancies}>
                <ModalVacanciesItem allDateUser={allDateUser}/>
            </ModalVacancies>
            <Skills/>
        </div>
    )
}
