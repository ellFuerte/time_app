import axios from 'axios'
import React, {useEffect, useRef, useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {Create, Delete, Settings, Message} from '@material-ui/icons'


import Skills from '../ProfileInfo/Skills/Skills'
import Modal from '../Templates/Modal/Modal'
import ModalVacanciesItem from "../VacanciesItem/ModalVacanciesItem/ModalVacanciesItem";
import ModalVacancies from "../Templates/ModalVacancies/ModalVacancies";
import Editing from "./Editing/Editing"

import './ProfileInfo.css'
import DeleteUser from "./DeleteUser/DeleteUser";
import ResetPassword from "./ResetPassword/ResetPassword";
import FinishTime from "./FinishTime/FinishTime";
import AddNomination from "./AddNomination/AddNomination";

export default function ProfileInfo() {

    const [timeZone, setTimeZone] = useState([])
    const [searchTermCities, setSearchTermCities] = useState('');

    const [allDateUser,setAllDateUser]=useState()

    const [modalVacancies, setModalVacancies] = useState(false)
    const [inputValues, setInputValues] = useState('');
    const [selectedInputIndex, setSelectedInputIndex] = useState(null);

    const [check, setCheck] = useState();
    const [checkedItems, setCheckedItems] = useState({});
    const [votearray, setVotearray] = useState([])
    const [userVote, setUserVote] = useState([])


    const [depsName, setDepsName] = useState([])
    const [cityName, setCityName] = useState([])

    const [user, setUser] = useState([])



    const [isFetching, setIsFetching] = useState(false)
    const [modalActive, setModalActive] = useState(false)
    const [modalActivePass, setModalActivePass] = useState(false)
    const [modalActiveVote, setModalActiveVote] = useState(false)
    const [modalVote, setModalVote] = useState(false)
    const [vote, setVote] = useState([])
    const [modalResetPassword, setModalResetPassword] = useState(false)
    const [modalFinishTime, setModalFinishTime] = useState(false)
    const [modalActiveDelete, setModalActiveDelete] = useState(false)
    const [modalActiveSkills, setModalActiveSkills] = useState(false)


    const [er, setErr] = useState('')
    const username = useParams()


    let localUser = !!username ? {_id: username.username, email: ""} : JSON.parse(localStorage.getItem('user'))
    const localUse = JSON.parse(localStorage.getItem('user'))

    const modalOldPass = useRef()
    const modalNewPass = useRef()
    const modalNewPassAgain = useRef()


    const [filteredCities, setFilteredCities] = useState([]);
    const [hasImage, setHasImage] = useState(false);



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

            const user = await axios.get('/api/user/')
            const sort = user.data.sort((a, b) => a.user_name.localeCompare(b.user_name))
            const mass = sort.filter(element => element.id !== username.username && element.status !== 4)
            setUserVote(mass)
        }
        // Номинации
        const fetchVote = async () => {
            const res = await axios.get('/api/vote/')
            setVote(res.data)
        }

        fetchVote()
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
        username.username
    ])


    // изменить пароль
    const handleClickPassword = async (e) => {
        e.preventDefault()
        if (modalNewPass.current.value !== modalNewPassAgain.current.value) {
            setErr('Новые пароли не совпадают')
            return
        }
        const passwords = {
            userId: localUse._id,
            password: localUse.password,
            oldPassword: modalOldPass.current.value,
            newPassword: modalNewPass.current.value
        }
        try {
            await axios.put('/api/newPassword/', passwords)
            setModalActivePass(false)
            /*      localStorage.clear()
                  window.location.reload()
                  window.location.href = '/'*/
        } catch (er) {
            setErr('Старые пароли не совпадают')
        }
    }

    // сбросить пароль




    // удалить пользователя


    localUser = (!!user && !Array.isArray(user)) ? user : localUser
    localUser.username = !!localUser.user_name ? localUser.user_name : localUser.username
    const name = localUser.email.toLowerCase()


    const button = () => {
        if (votearray.length === 0) {
            setErr('Выберите участников номинации')
        } else {
            votearray.forEach(async (vote) => {


                    const arr = vote.split("_")

                    const voteUser = {
                        user_id: localUse._id,
                        vote_for_user: arr[1],
                        nominations_id: arr[0]
                    }
                    await axios.post('/api/vote/', voteUser)
                }
            )
            setModalActiveVote(false)
        }
    }

    const clickVote = (e, id,user_name) => {
        setFilteredCities([])
        console.log('index=',id,user_name)
        setInputValues(prev => ({ ...prev, [selectedInputIndex]: user_name }));
        e.preventDefault();
        const data =id.toString();
        const arr = data.split("_");
        if (arr[0] === '' || arr[1] === '') {
            return;
        } else {
            const str = arr[1].toString();
            const str1 = arr[0].toString();

            const existingIndex = votearray.findIndex(item => item.split("_")[0] === str1);
            if (existingIndex !== -1) {
                const newArray = [...votearray];
                newArray[existingIndex] = data;
                console.log('Массив с обновленным элементом:', newArray);
                setVotearray(newArray);
                return;
            }
        }

        const votearr = [...votearray];
        votearr.push(data);

        const newArray = votearr.filter(element => element !== "");
        console.log('newArray=', newArray);
        setVotearray(newArray);

    };


/*    const secureButton = async () => {

        const res = await axios.get('/api/user/' + username.username)

        const addNomination = {
            userId: username.username,
            id_nomination: check
        }

        if (check === undefined) {
            setErr('Выберите номинацию')
        } else {
            await axios.post('/api/vote/', addNomination)
            setModalVote(false)
            window.location.reload()
        }
    }




    const clearSecureButton = async () => {
        const res = await axios.get('/api/user/' + username.username)
        const addNomination = {
            userId: username.username,
            id_nomination: null
        }

        await axios.post('/api/vote/', addNomination)
        setModalVote(false)
        window.location.reload()

    }


    const inputClick = (event, voteId) => {
        const {id, checked} = event.target
        if (checked) {
            setCheckedItems(checked)
        } else {
            setCheckedItems(null)
        }
        setCheck(event.target.value)
        setCheckedItems(prevState => ({
            ...prevState,
            [id]: checked,
        }))

        setUser(prevState => ({
                ...prevState,
                nomination_status: checked ? voteId : null
            }
        ))
    }*/


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


    const handleInputChangeUsers = (e,id) => {
        const index = id + 1
        const { value } = e.target;
        setInputValues(prev => ({ ...prev, [index]: value }));
        setSelectedInputIndex(index);

        const termCities = e.target.value;
        setSearchTermCities(termCities);
        const filtered = userVote.filter(city =>
            city.user_name && city.user_name.toLowerCase().includes(termCities.toLowerCase())
        );
        if (termCities === '') {
            setFilteredCities([])
        } else {
            setFilteredCities(filtered);
        }
    }


    const getChangeVacancies =  () => {
        if(localUse.isAdmin) {
            setModalVacancies(true)
            setAllDateUser(user)
        }
    }

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
                        <div className='ProfileName' style={{ paddingTop: hasImage ? '30px' : '0px'}}>

                            {user.user_name}

                            {localUse.isAdmin || localUse._id===username.username
                                ?
                                <>
                                    <Create style={{cursor:'pointer', fontSize:'20px',paddingLeft:'5px'}} onClick={() => setModalActive(true)}/>
                                    <Editing modalActive={modalActive} setModalActive={setModalActive} />
                                </>
                                : ''}


                            {localUse.isAdmin ?
                                <>
                            <Delete style={{cursor:'pointer',fontSize:'20px'}}  onClick={() => setModalActiveDelete(true)}/>
                             <DeleteUser modalActiveDelete={modalActiveDelete} setModalActiveDelete={setModalActiveDelete} username={username.username} user={user.id} />
                                </>
                            : ''}



                            {localUse.isAdmin === true && localUse._id === user.id ?
                                <Link to={`/AdminPanel`}>
                                    <Settings style={{cursor:'pointer',fontSize:'20px',paddingTop:'5px',color:'black'}}/>
                                </Link>
                                : ''}
                        </div>


                        <div>
                            <label style={{cursor:'pointer'}} onClick={getChangeVacancies} className='ProfileLinkVacancies'>{user.vacancy_code}</label>
                        </div>


{/*                    {
                        <Message style={{cursor: 'pointer', fontSize: 'large'}} />
                    }*/}


                    <div style={{border: '3px dashed black',padding:'10px'}}>
                    <div className='ProfileInfoCard'>Email: {name.charAt(0).toUpperCase() + name.slice(1)}</div>
                    <div className='ProfileInfoCard'>Телефон: {user.phone_number}</div>
                    <div className='ProfileInfoCard'>
                        {localUse.isAdmin !== false || localUse._id===username.username? 'Доп.Контакт: ' : ''}
                        {localUse.isAdmin !== false || localUse._id===username.username? user.additional_contact : ''}
                    </div>
                    <div className='ProfileInfoCard'>Группа рассылки: {user.distribution_group}</div>
                    <div className='ProfileInfoCard'>Профиль деятельности: {user.activity_profile}</div>
                    <div className='ProfileInfoCard'>Город проживания: {cityName}</div>
                    <div className='ProfileInfoCard'>
                        {localUse.isAdmin !== false  || localUse._id===username.username ? 'Адрес фактического проживания: ' : ''}
                        {localUse.isAdmin !== false || localUse._id===username.username ? user.place_of_residence : ''}
                    </div>
                    <div className='ProfileInfoCard'>Подразделение: {depsName}</div>
                    </div>

                    {
                        localUse.isAdmin || localUse._id===username.username ?
                        <div className='changePass' onClick={() => setModalActivePass(true)}>Изменить пароль</div>:''
                    }

                    {
                        localUse.isAdmin ?
                            <>
                        <div className='changePass' onClick={() => setModalResetPassword(true)}>Сбросить пароль</div>
                        <ResetPassword modalResetPassword={modalResetPassword} setModalResetPassword={setModalResetPassword} username={username.username}/>
                            </>
                        : ''
                    }

                    {
                        localUse.isAdmin ?
                            <>
                        <div className='changePass' onClick={() => setModalFinishTime(true)}>Закончить</div>
                        <FinishTime modalFinishTime={modalFinishTime} setModalFinishTime={setModalFinishTime} user={user.id} status={user.status}/>
                            </>
                        :''
                    }

                    {
                        localUse._id === user.id ?
                        <div className='changePass' onClick={() => setModalActiveVote(true)}>Проголосовать</div> : ''
                    }

                    {
                        localUse.isAdmin ?
                            <>
                         <div className="changePass" onClick={() => setModalVote(true)}>Закрепить номинацию</div>
                         <AddNomination modalVote={modalVote} setModalVote={setModalVote} username={username}/>\
                            </>: ''
                    }

                    <div className="changePass" onClick={() => setModalActiveSkills(true)}>Навыки</div>
                    <Skills modalActiveSkills={modalActiveSkills} setModalActiveSkills={setModalActiveSkills} />

                </div>
            }


            <Modal active={modalActivePass} setActive={setModalActivePass}>
                <h1>Изменение информации:</h1>
                <hr/>
                {er && <div className='modalError'>{er}</div>}
                <form className="modalLoginBox" onSubmit={handleClickPassword}>
                    <input
                        placeholder="Старый пароль"
                        type='password'
                        className="inputChangePassword"
                        ref={modalOldPass}
                    />
                    <input
                        placeholder="Новый пароль"
                        type='password'
                        className="inputChangePassword"
                        ref={modalNewPass}
                        minLength='6'
                    />
                    <input
                        placeholder="Новый пароль ещё раз"
                        type='password'
                        className="inputChangePassword"
                        ref={modalNewPassAgain}
                        minLength='6'
                    />
                    <button className="ModalButtonChangePassword" type="submit" disabled={isFetching}>
                        Изменить
                    </button>
                </form>
            </Modal>




            <Modal active={modalActiveVote} setActive={setModalActiveVote}>
                <h1>Номинации:</h1>
                {er && <div className='modalError'>{er}</div>}
                <hr/>
                <div className='div'>
                    <div>
                        {
                            vote.map((vote, id) =>

                                <label key={id} htmlFor={vote.id}>
                                    <h3 className='inputVote'>{vote.nominations_name}</h3>
                                    {vote.description}
                                </label>
                            )}
                    </div>
                    <div className='di'>
                            {vote.map((vote, id) => (
                                <div key={id+1} style={{ position: 'relative' }}>
                                    <input
                                        onChange={(e) => handleInputChangeUsers(e, id)}
                                        value={inputValues[id+1] || ''}
                                        className='select'
                                    />
                                    {selectedInputIndex === id+1 && filteredCities.length > 0 && (
                                        <div className='divSelectRegister' style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000,marginLeft:'20px' }}>
                                            {filteredCities.map((city, cityId) => (
                                                <div
                                                    className='selectNameDiv'
                                                    key={cityId}
                                                    onClick={(e) => clickVote(e, selectedInputIndex + "_" + city.id, city.user_name)}>
                                                    {city.user_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                </div>
                <button className="button" type="submit" disabled={isFetching} onClick={button}>Проголосовать</button>
            </Modal>




            {/*<Modal active={modalVote} setActive={setModalVote}>
                <h1>Закрепить номинацию:</h1>
                {er && <div className='modalError'>{er}</div>}
                <hr/>
                <div>
                    <div className='voteContainer'>
                        {vote.map((vote, id) => (
                            <div key={id} className="voteItem">
                                <label key={id} htmlFor={vote.id} className="inputVote">

                                    <input
                                        type='checkbox'
                                        id={vote.id}
                                        value={vote.id}
                                        onChange={(e) => inputClick(e, vote.id)}
                                        checked={user.nomination_status === vote.id}
                                    />

                                    {vote.nominations_name}{' '}

                                    <img src={`../images/${vote.id}.png`} alt={`Image for ${vote.nominations_name}`}
                                         className='images'/>

                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="button" type="submit" disabled={isFetching} onClick={secureButton}>Закрепить</button>
                <button className="button" type="submit" disabled={isFetching} onClick={clearSecureButton}>Снять
                    номинацию
                </button>
            </Modal>*/}

            <ModalVacancies active={modalVacancies} setActive={setModalVacancies}>
                <ModalVacanciesItem
                    allDateUser={allDateUser}
                />
            </ModalVacancies>



<Skills/>

        </div>
    )
}




/*                            <select onChange={clickVote} key={id} value={userVote.id} className='select'>
                                <option value=''>Выберите участника</option>

                                {userVote.map((userVote, id) => <option key={id}
                                                                        value={vote.id + '_' + userVote.id}>{userVote.user_name}</option>)}
                            </select>*/