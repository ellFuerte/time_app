import axios from 'axios'
import React, {useEffect, useRef, useState} from 'react'
import {Create, Delete, Message} from '@material-ui/icons'
import ErrorIcon from '@material-ui/icons/Error';
import Modal from '../Templates/Modal/Modal'
import './ProfileInfo.css'
import {Link, useParams} from "react-router-dom";
import Skills from '../ProfileInfo/Skills/Skills'

import ModalVacanciesItem from "../VacanciesItem/ModalVacanciesItem/ModalVacanciesItem";
import ModalVacancies from "../Templates/ModalVacancies/ModalVacancies";


export default function ProfileInfo() {

    const [timeZone, setTimeZone] = useState([])
    const [selectedOption, setSelectedOption] = useState({});
    const [error, setError] = useState('')

    const [modalVacancies, setModalVacancies] = useState(false)
    const [inputValues, setInputValues] = useState('');
    const [selectedInputIndex, setSelectedInputIndex] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');



    const [check, setCheck] = useState();
    const [checkedItems, setCheckedItems] = useState({});
    const [votearray, setVotearray] = useState([])
    const [isAdmin, setIsadmin] = useState([])
    const [userVote, setUserVote] = useState([])


    const [depsName, setDepsName] = useState([])
    const [cityName, setCityName] = useState([])

    const [user, setUser] = useState([])

    const [nameValue, setNameValue] = useState("");


    const [email, setEmail] = useState([])
    const [emailChange, setEmailChange] = useState([])


    const [phone, setPhone] = useState([])
    const [phoneChange, setPhoneChange] = useState([])


    const [additional_contact, setAdditional_Contact] = useState([])
    const [additional_contact_change, setAdditional_Contact_Change] = useState([])


    const [distribution_group, setDistribution_Group] = useState([])
    const [distribution_group_change, setDistribution_Group_Change] = useState([])


    const [activity_profile, setActivity_Profile] = useState([])
    const [activity_profile_change, setActivity_Profile_Change] = useState([])

    const [CityPlace, setCityPlace] = useState([])
    const [CityPlace_Change, setCityPlace_Change] = useState([])


    const [surnameValue, setSurnameValue] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [modalActive, setModalActive] = useState(false)
    const [modalActivePass, setModalActivePass] = useState(false)
    const [modalActiveVote, setModalActiveVote] = useState(false)
    const [modalVote, setModalVote] = useState(false)
    const [vote, setVote] = useState([])
    const [modalActiveResetPass, setModalActiveResetPass] = useState(false)
    const [modalActiveReset, setModalActiveReset] = useState(false)
    const [modalActiveDelete, setModalActiveDelete] = useState(false)
    const [modalActiveSkills, setModalActiveSkills] = useState(false)


    const [options, setOptions] = useState([]);
    const [er, setErr] = useState('')
    const username = useParams()


    let localUser = !!username ? {_id: username.username, email: ""} : JSON.parse(localStorage.getItem('user'))
    const localUse = JSON.parse(localStorage.getItem('user'))

    const modalDep = useRef()
    const modalOldPass = useRef()
    const modalNewPass = useRef()
    const modalNewPassAgain = useRef()
    const phoneNumber = useRef()
    const additionalContact = useRef()
    const distributionGroup = useRef()
    const activityProfile = useRef()
    const modalCity = useRef()
    const modalCityPlace = useRef()


    const [citiesId, setCitiesId] = useState([])
    const [searchTermCities, setSearchTermCities] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [cities, setCities] = useState([])
    const [hasImage, setHasImage] = useState(false);


    const handleUserClickCities = (city_name, id) => {
        setCitiesId(id)
        setSearchTermCities(city_name)
        setFilteredCities([])
    }


    const handleInputChangeCities = (e) => {
        const termCities = e.target.value;
        setSearchTermCities(termCities);

        if (termCities === '') {
            setCitiesId('');
            setFilteredCities([]);
            setCityName('');
            return; // Добавьте это, чтобы избежать выполнения нижестоящего кода при пустом termCities
        }

        const filtered = cities.filter(city =>
            city.city_name && city.city_name.toLowerCase().includes(termCities.toLowerCase())
        );
        setFilteredCities(filtered);
    }


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


        const getNameAndSurname = () => {
            if (user.user_name) {
                const [name, surname] = user.user_name.split(" ");
                setSurnameValue(surname || "");
                setNameValue(name);
            }
        }

        const getDeps = async () => {

                const res = await axios.get('/api/department_tree_to_json/');
                const data = res.data[0]['department_tree_to_json'];
                const extractedOptions = extractOptions(data);
                setOptions(extractedOptions);
                setSelectedValue(user.department_id);

        }
        const extractOptions = (node) => {
            let optionsList = [{ id: node.id, name: node.Name }];
            if (node.Subclasses && node.Subclasses.length > 0) {
                node.Subclasses.forEach(subclass => {
                    optionsList = optionsList.concat(extractOptions(subclass));
                });
            }
            return optionsList;

        };

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
            setIsadmin(res.data.isadmin)
            setIsFetching(false)

            const user = await axios.get('/api/user/')
            const sort = user.data.sort((a, b) => a.user_name.localeCompare(b.user_name))
            const mass = sort.filter(element => element.id !== username.username && element.status !== 4)
            setUserVote(mass)

            const city = await axios.get('/api/Cities/')
            setCities(city.data)
        }
        // Номинации
        const fetchVote = async () => {
            const res = await axios.get('/api/vote/')
            setVote(res.data)
        }
        if (user && user.email && email) {
            setEmail(user.email);
        }
        if (user && user.phone_number && phone) {
            setPhone(user.phone_number);
        }

        if (user && user.additional_contact && additional_contact) {
            setAdditional_Contact(user.additional_contact);
        }

        if (user && user.distribution_group && distribution_group) {
            setDistribution_Group(user.distribution_group);
        }
        if (user && user.activity_profile && activity_profile) {
            setActivity_Profile(user.activity_profile);
        }
        if (user && user.place_of_residence && CityPlace) {
            setCityPlace(user.place_of_residence);
        }

        getNameAndSurname();
        fetchVote()
        fetchUser()
        getDeps()
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

    const handleEmailChange = (e) => {

        if (e.target.value) {
            setEmail('')
            setEmailChange(e.target.value)
        }
        if (e.target.value === '') {
            setEmail('')
            setEmailChange('')
        }

    }
    const formatPhoneNumber = (value) => {
        // Убираем все символы, кроме цифр
        let cleaned = value.replace(/\D/g, '');
        if (cleaned.startsWith('7')) {
            cleaned = cleaned.slice(1); // Удаляем ведущую 7, если она уже присутствует после +
        }
        // Ограничиваем длину очищенного значения до 10 цифр (XXX-XXX-XX-XX без кода страны)
        cleaned = cleaned.slice(0, 10);
        // Разделяем на части, добавляя дефисы
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
        if (match) {
            return '+7 ' + [match[1], match[2], match[3], match[4]].filter(Boolean).join('-');
        }
        return '+7 ' + cleaned;
    };
    const handlePhoneChange = (e) => {
        if (e.target.value) {
            setPhone('')
            setPhoneChange(e.target.value)
        }
        if (e.target.value === '') {
            setPhone('')
            setPhoneChange('')
        }
        const value = e.target.value;
        if (value.length < 1) {
            setPhoneChange('')
        } else {
            const formattedValue = formatPhoneNumber(value);
            setPhoneChange(formattedValue);
        }
    }

    const additional_Contact = (e) => {
        if (e.target.value) {
            setAdditional_Contact('')
            setAdditional_Contact_Change(e.target.value)
        }
        if (e.target.value === '') {
            setAdditional_Contact('')
            setAdditional_Contact_Change('')
        }
    }

    const distribution_Group = (e) => {
        if (e.target.value) {
            setDistribution_Group('')
            setDistribution_Group_Change(e.target.value)
        }
        if (e.target.value === '') {
            setDistribution_Group('')
            setDistribution_Group_Change('')
        }
    }

    const activity_Profile = (e) => {
        if (e.target.value) {
            setActivity_Profile('')
            setActivity_Profile_Change(e.target.value)
        }
        if (e.target.value === '') {
            setActivity_Profile('')
            setActivity_Profile_Change('')
        }
    }

    const cityPlace = (e) => {
        if (e.target.value) {
            setCityPlace('')
            setCityPlace_Change(e.target.value)
        }
        if (e.target.value === '') {
            setCityPlace('')
            setCityPlace_Change('')
        }
    }

    const handleNameChange = (e) => {
        setNameValue(e.target.value);
    }

    const handleSurnameChange = (e) => {
        setSurnameValue(e.target.value)
    }


    // изменение данных пользователя
    const handleClick = async (e) => {

        const name = user.user_name
        const part = name.split(' ')
        e.preventDefault()
        const newInfo = {
            departmentId: modalDep.current.value || user.department_id,
            email: (email ? email : emailChange.toUpperCase()),
            username: nameValue + ' ' + surnameValue,
            _id: user.id,
            isAdmin: user.isadmin,
            see_child: user.see_child,
            status: user.status,
            main_department: user.main_department,
            phone_number: (phoneNumber.current.value === '' ? '' : phoneNumber.current.value),
            additional_contact: additionalContact.current.value,
            distribution_group: distributionGroup.current.value,
            activity_profile: activityProfile.current.value,
            city_id: citiesId,
            cityPlaceChange:modalCityPlace.current.value
        }

        if (localUse._id !== username.username) {
            const newInfo2 = {
                departmentId: modalDep.current.value || user.department_id,
                email: (email ? email : emailChange.toUpperCase()),
                username: nameValue + ' ' + surnameValue,
                phone_number: (phoneNumber.current.value === '' ? '' : phoneNumber.current.value),
                additional_contact: additionalContact.current.value,
                distribution_group: distributionGroup.current.value,
                activity_profile: activityProfile.current.value,
                city_id: citiesId,
                _id: user.id,
                cityPlaceChange:modalCityPlace.current.value
            }

            await axios.put('/api/user/', newInfo2)
            window.location.reload()
        } else {
            await axios.put('/api/user/', newInfo)
            delete newInfo.phone_number
            delete newInfo.additional_contact
            delete newInfo.distribution_group
            delete newInfo.activity_profile
            delete newInfo.city_id
            delete newInfo.cityPlaceChange
            localStorage.setItem('user', JSON.stringify({...newInfo}))
            setModalActive(false)
            window.location.reload()
        }
    }

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
    const handleResetPass = async (e) => {
        e.preventDefault()

        const resetPassword = {
            userId: username.username,
            newPassword: 'qwerty123'
        }

        try {
            await axios.put('/api/resetPassword/', resetPassword)
            setModalActiveResetPass(false)
        } catch (error) {
        }
    }

    const status = async () => {
        if (user.status === 1) {
            const status = {
                status: 2,
                typework_id: 1,
                userId: user.id,
                healthEnd: '-',
                commentEnd: '-',
                workEnd: new Date(Date.now())
            }
            await axios.put("/api/post/", status)
        } else {
            alert("Пользователь не в работе")
        }
    }

    // удалить пользователя
    const handleDelete = async (e) => {
        e.preventDefault()
        setIsFetching(true)

        const newPost = {
            userId: username.username,
            healthEnd: 1,
            status: 4
        }
        try {
            await axios.put('/api/deluser/', newPost)

            /*                  workEnd: new Date(Date.now()),
                              workTime: new Date(Date.now()) - new Date(posts[0].workStart)

                        localStorage.setItem('user', JSON.stringify({...localUser, status:3}))*/


            /*      if(user.status === 1){
                    await axios.put("/api/post/"+posts[0]._id, newPost)
                  }
                 localStorage.clear()
                  window.location.reload()
                  window.location.href = '/'*/


            setModalActiveDelete(false)
            window.location.href = `/profile/${user.id}`
        } catch (error) {
            console.log(error);
        }
    }
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
    /*    const button = () => {
            if (votearray.length === 0 || votearray.length <= 9) {
                setErr('Выберите участников номинации');
                return;
            }
            if (votearray.length === 10 && er) {
                return;
            } else {
                const duplicates = {};
                let hasDuplicates = false; // Флаг для отслеживания наличия повторяющихся элементов
                votearray.forEach(async (vote) => {
                    const arr = vote.split("_");
                    const vote_for_user = arr[1];

                    // Проверяем, был ли уже такой элемент
                    if (duplicates[vote_for_user]) {
                        // Если был, устанавливаем флаг и завершаем итерацию
                        hasDuplicates = true;
                        return;
                    } else {
                        // Иначе, добавляем его в объект duplicates
                        duplicates[vote_for_user] = true;
                    }

                    const voteUser = {
                        user_id: localUse._id,
                        vote_for_user: arr[1],
                        nominations_id: arr[0]
                    };

                    await axios.post('/api/vote/', voteUser);
                });

                // Если есть повторяющиеся элементы, прекращаем выполнение функции
                if (hasDuplicates) {
                    setErr('Есть сотрудники которые участвуют больше одной номинации');
                    return;
                }

                setModalActiveVote(false);
            }
        };*/
    /*    const clickVote = (e) => {
            e.preventDefault()
            const data = e.target.value.toString()
            const arr = data.split("_")
            let votearr = votearray
            votearr.push(data)
            const newArray = votearr.filter(element => element !== "")
            console.log('newArray=', newArray)
            setVotearray(newArray)
        }*/


    const clickVote = (e, id,user_name,selectIndex) => {
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

            /*            if (votearray.some(item => item.split("_")[1] === str)) {
                            setErr('Такой сотрудник уже есть в другой номинации');
                        }else{
                            setErr('');
                        }*/

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

        // Устанавливаем флаг для скрытия опции "Выберите участника" для данного select
        setSelectedOption(prevState => ({
            ...prevState,
            [selectIndex]: true
        }));

    };


    const secureButton = async () => {
        console.log('chek=', checkedItems)

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
    }


    const nextModal = async () => {
        setModalVote(true)
        setModalActiveVote(false)
    }

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



    const handleChange = (e) => {
        setSelectedValue(e.target.value);
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

    const [allDateUser,setAllDateUser]=useState()
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
                        <div className='ProfileName' style={{ paddingTop: hasImage ? '30px' : '0px' }}>
                            {user.user_name}



                            {localUse.isAdmin || localUse._id===username.username ? <Create style={{marginLeft: '5px', fontSize: 'large', cursor: 'pointer'}}
                                                 onClick={() => setModalActive(true)}/> : ''}



                            {localUse.isAdmin ? <Delete style={{cursor: 'pointer', fontSize: 'large'}}
                                                        onClick={() => setModalActiveDelete(true)}/> : <></>}

                            {localUse.isAdmin === true && localUse._id === user.id ? <Link to={`/AdminPanel`}><ErrorIcon
                                style={{cursor: 'pointer', color: 'black', fontSize: 'large'}}/></Link> : ''}
                        </div>

                        <div>
                            <label style={{cursor:'pointer'}} onClick={getChangeVacancies} className='ProfileLinkVacancies'>{user.vacancy_code}</label>
                        </div>

                        {/*                {
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



                    {localUse.isAdmin || localUse._id===username.username ?
                    <div className='changePass' onClick={() => setModalActivePass(true)}>Изменить пароль</div>:''
                    }

                    {localUse.isAdmin ?
                        <div className='changePass' onClick={() => setModalActiveResetPass(true)}>Сбросить
                            пароль</div> : ''}


                    {localUse.isAdmin ?
                        <div className='changePass' onClick={() => setModalActiveReset(true)}>Закончить</div> :'' }


                    {localUse._id === user.id ?
                        <div className='changePass' onClick={() => setModalActiveVote(true)}>Проголосовать</div> : ''}


                    {localUse.isAdmin ? <div className="changePass" onClick={nextModal}>Закрепить номинацию</div> : ''}


                    <div className="changePass" onClick={() => setModalActiveSkills(true)}>Навыки</div>
                    <Skills modalActiveSkills={modalActiveSkills} setModalActiveSkills={setModalActiveSkills} username={username.username} />


                </div>
            }

            <Modal active={modalActive} setActive={setModalActive}>
                <h1>Изменение информации:</h1>
                <hr/>
                {error && <div className='modalError'>{error}</div>}
                <form className="modalLoginBox" onSubmit={handleClick}>
                    <div>
                        <input
                            placeholder="Фамилия"
                            className="ModalInputUpdate"
                            onChange={handleNameChange}
                            value={nameValue}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Имя"
                            className="ModalInputUpdate"
                            onChange={handleSurnameChange}
                            value={surnameValue}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Email"
                            type="email"
                            className="ModalInputUpdate"
                            onChange={handleEmailChange}
                            value={email || emailChange}
                            minLength={6}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Телефон"
                            type='text'
                            className="ModalInputUpdate"
                            ref={phoneNumber}
                            onChange={handlePhoneChange}
                            value={phone || phoneChange}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Доп контакт(Номер телефона,ФИО,статус человека)"
                            type='text'
                            className="ModalInputUpdate"
                            ref={additionalContact}
                            onChange={additional_Contact}
                            value={additional_contact || additional_contact_change}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Группа рассылки"
                            type='text'
                            className="ModalInputUpdate"
                            ref={distributionGroup}
                            onChange={distribution_Group}
                            value={distribution_group || distribution_group_change}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Профиль деятельности"
                            type='text'
                            className="ModalInputUpdate"
                            ref={activityProfile}
                            onChange={activity_Profile}
                            value={activity_profile || activity_profile_change}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Город"
                            type='text'
                            className="ModalInputUpdate"
                            ref={modalCity}
                            value={searchTermCities || cityName}
                            onChange={handleInputChangeCities}
                        />
                        <div>
                            {filteredCities.length > 0 && (
                                <div className='divSelectRegister'>
                                    {filteredCities.map((city, id) => (
                                        <div className='selectNameDiv' key={id} value={city.id}
                                             onClick={() => handleUserClickCities(city.city_name, city.id)}>
                                            {city.city_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <input
                                placeholder="Адрес фактического проживания"
                                type='text'
                                className="ModalInputUpdate"
                                ref={modalCityPlace}
                                onChange={cityPlace}
                                value={CityPlace || CityPlace_Change}
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={selectedValue} // Привязываем значение к selectedValue
                            onChange={handleChange}
                            ref={modalDep}
                            className="ModalInputUpdateSelect"
                        >
                            {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="ModalButton" type="submit" disabled={isFetching}>
                        Изменить
                    </button>
                </form>
            </Modal>
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
            <Modal active={modalActiveResetPass} setActive={setModalActiveResetPass}>
                <h1>Изменение информации:</h1>
                <hr/>
                <form className="modalLoginBox" onSubmit={handleResetPass}>
                    <h2>Новый пароль будет: qwerty123</h2>
                    <button className="ModalButtonRePasswordUser" type="submit" disabled={isFetching}>
                        Сбросить
                    </button>
                </form>
            </Modal>
            <Modal active={modalActiveReset} setActive={setModalActiveReset}>
                <h1>Изменение информации:</h1>
                <hr/>
                <form className="modalLoginBox" onSubmit={status}>
                    <h2>Вы хотите завершить отметку времени пользователя?</h2>
                    <button className="ModalButtonDelete" type="submit" disabled={isFetching}>
                        Закончить
                    </button>
                </form>
            </Modal>
            <Modal active={modalActiveDelete} setActive={setModalActiveDelete}>
                <h1>Изменение информации:</h1>
                <hr/>
                <form className="modalLoginBox" onSubmit={handleDelete}>
                    <h2>Пользователь будет удален</h2>
                    <button className="ModalButtonDelete" type="submit" disabled={isFetching}>
                        Удалить
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
{/*                        {vote.map((vote, id) => (
                                <select
                                    onChange={(e) => clickVote(e, id)}
                                    key={id}
                                    value={userVote.id}
                                    className='select'>

                                    {!selectedOption[id] &&

                                    <option value=''>Выберите участника</option>}

                                    {userVote.map((userVote, id) => (

                                        <option key={id} value={vote.id + '_' + userVote.id}>{userVote.user_name}</option>
                                    ))}
                                </select>
                            )
                        )}*/}

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
            <Modal active={modalVote} setActive={setModalVote}>
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
            </Modal>

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