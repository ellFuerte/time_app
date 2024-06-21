import {useEffect,useState,useRef} from 'react'
import axios from 'axios'
import Employee from '../Employee/Employee'
import './Staff.css'
import {Link, useParams} from 'react-router-dom'
import Modal from '../Templates/Modal/Modal'



export default function Staff() {
    const [checked, setChecked] = useState(false)

    const [statisticsWork, setStatisticsWork] = useState([])
    const [users, setUsers] = useState([])
    const [UsersDep, setUsersDeps] = useState([])
    const [user, setUser] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isJob, setIsJob] = useState(true)
    const [modalMain, setModalMain] = useState(false)
    const localUser = JSON.parse(localStorage.getItem('user'))
    const departId = useParams().username;


    useEffect(() => {

        //Вывод статистики для админов
        const get_statistics_all_users = async () => {

            if (localUser.isAdmin === true) {
                const getUsers = {
                    id: localUser._id
                }
                const res = await axios.post('/api/get_statistics_all_users', getUsers)
                const all = res.data[0].get_statistics_all_users[0]['all_users'].sort((a, b) => a.user_name.localeCompare(b.user_name))

                let all_users = filterUsersFoo(all)

                if (res.data[0].get_statistics_all_users[0]['all_users'] === null && !!~document.location.href.indexOf('/all_users/')) {
                    alert('Нет не одного пользователя в работе')
                }
                if (res.data[0].get_statistics_all_users[0]['not_working_today'] === null && !!~document.location.href.indexOf('/not_working_today/')) {
                    alert('Сегодня все в работе')
                    window.location.href = `/department/${localUser.departmentId}`
                }
                if (res.data[0].get_statistics_all_users[0]['not_worked_yesterday'] === null && !!~document.location.href.indexOf('/not_worked_yesterday/')) {
                    alert('Вчера все работали')
                    window.location.href = `/department/${localUser.departmentId}`
                }
                if (res.data[0].get_statistics_all_users[0]['sick_today'] === null && !!~document.location.href.indexOf('/sick_today/')) {
                    alert('Нет болеющих сегодня')
                    window.location.href = `/department/${localUser.departmentId}`
                }
                if (res.data[0].get_statistics_all_users[0]['sick_yesterday'] === null && !!~document.location.href.indexOf('/sick_yesterday')) {
                    alert('Вчера не было сотрудников на больничном')
                    window.location.href = `/department/${localUser.main_department}`
                }
                if (res.data[0].get_statistics_all_users[0]['vacation_today'] === null && !!~document.location.href.indexOf('/vacation_today')) {
                    alert('На сегодня нет сотрудников в отпуске')
                    window.location.href = `/department/${localUser.main_department}`
                }
                if (res.data[0].get_statistics_all_users[0]['vacation_yesterday'] === null && !!~document.location.href.indexOf('/vacation_yesterday')) {
                    alert('Вчера не было сотрудников в отпуске')
                    window.location.href = `/department/${localUser.main_department}`
                }
                if (!!~document.location.href.indexOf('/all_users/')) {
                    setIsJob(isJob)
                    setStatisticsWork(all_users)
                }
                if (!!~document.location.href.indexOf('/not_working_today/')) {
                    if (res.data[0].get_statistics_all_users[0]['not_working_today'] === null) {

                    } else {
                        setIsJob(isJob)
                        const sort = res.data[0].get_statistics_all_users[0]['not_working_today'].sort((a, b) => a.user_name.localeCompare(b.user_name))
                        setStatisticsWork(filterUsersFoo(sort))
                    }
                }

                if (!!~document.location.href.indexOf('/not_worked_yesterday/')) {
                    if (res.data[0].get_statistics_all_users[0]['not_worked_yesterday'] === null) {

                    } else {
                        setIsJob(isJob)
                        const sort = res.data[0].get_statistics_all_users[0]['not_worked_yesterday'].sort((a, b) => a.user_name.localeCompare(b.user_name))
                        setStatisticsWork(filterUsersFoo(sort))
                    }
                }

                if (!!~document.location.href.indexOf('/sick_today/')) {
                    if (res.data[0].get_statistics_all_users[0]['sick_today'] === null) {

                    } else {
                        setIsJob(isJob)
                        const sort = res.data[0].get_statistics_all_users[0]['sick_today'].sort((a, b) => a.user_name.localeCompare(b.user_name))
                        setStatisticsWork(filterUsersFoo(sort))
                    }
                }

                if (!!~document.location.href.indexOf('/sick_yesterday/')) {
                    if (res.data[0].get_statistics_all_users[0]['sick_yesterday'] === null) {

                    } else {
                        setIsJob(isJob)
                        const sort = res.data[0].get_statistics_all_users[0]['sick_yesterday'].sort((a, b) => a.user_name.localeCompare(b.user_name))
                        setStatisticsWork(filterUsersFoo(sort))
                    }
                }

                if (!!~document.location.href.indexOf('/vacation_today/')) {
                    if (res.data[0].get_statistics_all_users[0]['vacation_today'] === null) {

                    } else {
                        setIsJob(isJob)
                        const sort = res.data[0].get_statistics_all_users[0]['vacation_today'].sort((a, b) => a.user_name.localeCompare(b.user_name))
                        setStatisticsWork(filterUsersFoo(sort))
                    }
                }

                if (!!~document.location.href.indexOf('/vacation_yesterday/')) {
                    if (res.data[0].get_statistics_all_users[0]['vacation_yesterday'] === null) {

                    } else {
                        setIsJob(isJob)
                        const sort = res.data[0].get_statistics_all_users[0]['vacation_yesterday'].sort((a, b) => a.user_name.localeCompare(b.user_name))
                        setStatisticsWork(filterUsersFoo(sort))
                    }
                }
            }
        }


        // функция показывает нажата ли галочка показать дочернии
        const statusChild = async () => {
            const user = await axios.get('/api/user/' + localUser._id)
            setChecked(user.data.see_child)
            setUser(user.data)
        }

        const fetchUsers = async () => {
            const res = await axios.get('/api/user');
            res.data.sort((a, b) => a.user_name.localeCompare(b.user_name));
            const filteredUsers = filterUsersFoo(res.data);
            return filteredUsers.filter(user => user.department_id === departId);
        };

        const getUsersByDepIsCheckedTrue = async () => {
            const info = { depsId: departId };
            const res = await axios.post('/api/get_users_by_dep/', info);
            const depUsers = res.data[0].get_users_by_dep;
            if (depUsers === null) {
                return [];
            } else {
                const sortedUsers = depUsers.sort((a, b) => a.user_name.localeCompare(b.user_name));
                const filteredUsers = filterUsersFoo(sortedUsers);
                return filteredUsers;
            }
        };

        const combineUsers = async () => {
            try {
                const users = await fetchUsers();
                let combinedArray = [];

                if (checked && user.main_department===departId) {
                    setIsJob(false)
                    const us = await getUsersByDepIsCheckedTrue();
                    combinedArray = combinedArray.concat(us);
                } else {
                    combinedArray = users;
                }

                setUsers(combinedArray);
            } catch (error) {
                console.error('Ошибка при объединении пользователей:', error);
            }
        };

        // Вызов функции combineUsers для получения и объединения пользователей
        combineUsers();


        setIsJob(true)

        if(departId){
            setUsersDeps([])
        }
        get_statistics_all_users()
        statusChild()


    }, [departId,user.main_department])




    //Сортировка пользователей по статусам
    function filterUsersFoo(users) {
        return users.filter(user => user.status === 1)
            .concat(users.filter(user => user.status === 2))
            .concat(users.filter(user => user.status === 3))
            .concat(users.filter(user => user.status !== 1 && user.status !== 2 && user.status !== 3 && user.status !== 4))
            .concat(users.filter(user => user.status === 4))
    }


    const clickcheckbox = async () => {
        setChecked(!checked)
        const info = {
            userId: localUser._id,
            ischeked: !checked
        };
        await axios.post('/api/statusChild/', info);

    }

    const handleModalClick = async () => {
        const add = {
            id: localUser._id,
            depsId: departId
        }
        const res = await axios.put('/api/user', add)
        setModalMain(false)
    }



    const get_users_by_depIsOpen = async () => {

        if (isJob) {
            const info = {
                depsId: departId
            }
            const res = await axios.post('/api/get_users_by_dep/', info)
            const dep_users = res.data[0]['get_users_by_dep']
            if (dep_users !== null) {
                dep_users.sort((a, b) => a.user_name.localeCompare(b.user_name))
                let filterUsers = filterUsersFoo(dep_users)
                setUsersDeps(filterUsers)
                setUsers([])
                setIsJob(!isJob)
                setIsOpen(true)
            }
        }
    }


    return (

        <div className='staff'>
            <>
                {departId && (
                    <>
                        {isJob ?
                            <button onClick={get_users_by_depIsOpen} className="btnStaff" style={{ width: '155px' }}>
                                Показать дочерние
                            </button>
                            :
                            <button onClick={() => window.location.href = `/department/${departId}`} className="btnStaff" disabled={checked && user.main_department === departId}>
                                Скрыть дочерние
                            </button>
                        }
                        <button onClick={() => setModalMain(true)} className='btnStaff' style={{ float: 'right' }}>Сделать главной</button>
                        {localUser.isAdmin ? <Link to={`/VacanciesView/`}><button className="btnStaff">Показать вакансии</button></Link> : ''}
                    </>
                )}
            </>


            <div className="employeeWrapper">

                {
                    users.map((user, id) => <Employee key={id} user={user} />)
                }

                {isOpen ?
                    UsersDep.map((user, id) => <Employee key={id} user={user} />)
                    :''

                }

                {!departId
                    ? statisticsWork.map((user, id) => <Employee key={id} user={user} />)
                    :''

                }
            </div>
            <Modal active={modalMain} setActive={setModalMain}>
                <h1>Изменение информации:</h1>
                <hr/>
                <form className="modalLoginBox">
                    <label>
                        <input
                            type='checkbox'
                            onChange={clickcheckbox}
                            checked={checked}
                        />
                        Добавить дочерние</label>
                    <button className="ModalButtonDepartment" type="submit" onClick={handleModalClick}>
                        Сделать главным департаментом
                    </button>
                </form>
            </Modal>
        </div>
    )
}
