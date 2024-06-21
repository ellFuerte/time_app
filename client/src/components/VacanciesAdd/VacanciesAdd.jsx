import React, {useEffect, useRef, useState} from "react";

import './VacanciesAdd.css'
import axios from "axios";

function VacanciesAdd() {
    const localUser = JSON.parse(localStorage.getItem('user'))
    const [searchQuery, setSearchQuery] = useState('');
    const [deps, setDeps] = useState([])
    const [userId, setUserId] = useState([])
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [messageITC, setMessageITC] = useState('')
    const [isView, setIsView] = useState(false)
    const [vacancies, setVacancies] = useState([])
    const [status, setStatus] = useState([])
    const [company, setCompany] = useState([])
    const [checkVal, setCheckVal] = useState(false)
    const [users, setUsers] = useState([])
    const NameVacationRef=useRef()
    const TeamRef = useRef()
    const StatusRef = useRef()
    const CodeVacations = useRef()
    const Company = useRef()
    const Description = useRef()
    const CodeProject = useRef()
    const Grade = useRef()



    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };



    const changeVal = () => {
        setCheckVal(!checkVal)
    }
    useEffect(() => {
        const getDeps = async () => {
            const departament = await axios.get('/api/departments/')
            setDeps(departament.data)



            const statuses = await axios.get('/api/Vacations/?status=status')
            statuses.data.unshift(statuses.data.splice(statuses.data.findIndex(status => status.name === "Резерв"), 1)[0]);
            setStatus(statuses.data)


            const companies = await axios.get('/api/Vacations/?company=company')
            setCompany(companies.data)
            const user = await axios.get('/api/user')
            setUsers(user.data)

            const vacancies_function={
                departId: localUser.departmentId,
                user_id: localUser._id
            }
            const getVacancies = await axios.post('/api/Vacations_function/',vacancies_function)
            setVacancies(getVacancies.data)
        }


        getDeps()
    }, [])


    const handleUserClick = (userName,userId) => {
        setUserId(userId)
        setSearchTerm(userName)
        setFilteredUsers([])
    }

    const [searchTerm, setSearchTerm] = useState('');

    const [filteredUsers, setFilteredUsers] = useState([]);


    const handleInputChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = users.filter(user =>
            user.user_name && user.user_name.toLowerCase().includes(term.toLowerCase())
        );
        if (term === '') {
            setFilteredUsers([])
        } else {
            setFilteredUsers(filtered);
        }
    }



    const clickHandler = async () => {

        const codeVacation = CodeVacations.current.value.toLowerCase().trim();

        // Проверяем, есть ли уже вакансия с таким кодом
        const existingVacancy = vacancies.some(({ get_vacancies }) =>
            get_vacancies.some(({ vacancies }) =>
                vacancies.some(vacancy =>
                    vacancy.vacancy_code && vacancy.vacancy_code.toLowerCase() === codeVacation
                )
            )
        );

        if (existingVacancy) {
            setMessageITC('Такая ИТС уже существует');
            setError('');
            setMessage('');
            return;
        }

        let userNameToSend = '';
        if (searchTerm !== '') {
            userNameToSend = userId;
        }
        const Vacations = {
            namevacancies: NameVacationRef.current.value,
            description: Description.current.value,
            team_id: TeamRef.current.value,
            status_id: StatusRef.current.value,
            codeVacations: codeVacation.toUpperCase(),
            codeProject: CodeProject.current.value,
            company_id: Company.current.value,
            grade: Grade.current.value,
            is_checked: checkVal,
            userName: userNameToSend
        };

        if (
            NameVacationRef.current.value === '' ||
            Description.current.value === '' ||
            TeamRef.current.value === '' ||
            StatusRef.current.value === '' ||
            codeVacation === '' ||
            CodeProject.current.value === '' ||
            Grade.current.value === '' ||
            Company.current.value === ''
        ) {
            setError('Заполните поле');
            setIsView(true);
        } else {
            const res = await axios.post('/api/Vacations/', Vacations);
            if (res.status === 200) {
                setError('');
                setMessage('Вакансия добавлена');
                const vacancies_function={
                    departId: localUser.departmentId,
                    user_id: localUser._id
                }
                const getVacancies = await axios.post('/api/Vacations_function/',vacancies_function)
                setVacancies(getVacancies.data)
            }
        }
    };

    const clearInput = () => {
        Description.current.value = ''
        NameVacationRef.current.value=''
        CodeVacations.current.value=''
        CodeProject.current.value=''
        Grade.current.value=''
        setSearchTerm('')
        setFilteredUsers([])
        setSearchQuery('')
        setMessage('')
        setError('')
    }



    function handleClickSubmit() {
        setMessageITC('')
        setError('')
        setMessage('')
    }

    return (
        <>
            <br/>
            <div className="VacationsMainAdd">
                <h2 style={{textAlign:'center'}}>Добавить вакансию</h2>
                {
                    !error && isView && message && !messageITC &&
                    <div className='error'>Добавленно</div>
                }
                {
                    message && !error && !isView && !messageITC &&
                    <div className='error'>Добавленно</div>
                }
                {
                    error && isView && !messageITC &&
                    <div className='error'>Заполните все поля</div>
                }
                {
                    messageITC && !message &&
                    <div className='error'>{messageITC}</div>
                }
                <div>
                </div>
                <div>
                    <div className="InputLabelName">Наименование вакансии</div>
                    <input ref={NameVacationRef} type='text' placeholder='Наименование вакансии' className='InputVacation' onMouseDown={handleClickSubmit}/>
                </div>
                <div>
                    <div className="InputLabel">Описание вакансии</div>
                    <textarea ref={Description} placeholder='Описание вакансии' className='InputVacationAdd' onMouseDown={handleClickSubmit}/>
                </div>
                <div>
                    <div className="InputLabel">Подразделение</div>
                    <select ref={TeamRef} className='InputVacation' onMouseDown={handleClickSubmit}>
                        {deps.map((dep, name) => <option selected={dep.id === localUser.departmentId} key={name}
                                                         value={dep.id}>{dep.department_name}</option>)}
                    </select>
                </div>
                <div>
                    <div className="InputLabel">Статус</div>
                    <select ref={StatusRef} className='InputVacation' onMouseDown={handleClickSubmit}>
                        {status.map((status, id) => <option key={id} value={status.id}>{status.name}</option>)}
                    </select>
                </div>

                <div>
                    <div className="InputLabel">Код вакансии</div>
                    <input ref={CodeVacations}
                           value={searchQuery}
                           onChange={handleSearchChange}
                           type='text'
                           placeholder='Код вакансии'
                           className='InputVacation'
                           onMouseDown={handleClickSubmit}/>
                </div>



                <div className='inputDiv'>
                    <div className="InputLabel">Имя сотрудника</div>
                    <input
                        type='text'
                        placeholder='Имя сотрудника'
                        className='InputVacation'
                        value={searchTerm}
                        onChange={handleInputChange}
                        onMouseDown={handleClickSubmit}
                    />
                    <div className='divSelect'>
                        {filteredUsers.length > 0 && (
                            <div>
                                {filteredUsers.map((user, index) => (
                                    <div className='selectNameDiv' key={index} value={user.id} onClick={() => handleUserClick(user.user_name, user.id)}>
                                        {user.user_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="InputLabel">Компания</div>
                    <select ref={Company} className='InputVacation' onMouseDown={handleClickSubmit}>
                        <option value=''>Компания</option>
                        {company.map((company, name) => <option key={name} value={company.id}>{company.name}</option>)}
                    </select>

                </div>
                <div>
                    <div className="InputLabel">Код проекта</div>
                    <input ref={CodeProject} type='number' placeholder='Код проекта(текущий бюджет=0)' className='InputVacation' onMouseDown={handleClickSubmit}/>
                </div>
                <div>
                    <div className="InputLabel">Грейд</div>
                    <input ref={Grade} type='number' placeholder='Грейд' className='InputVacation' onMouseDown={handleClickSubmit}/>
                </div>
                <div style={{marginTop:'20px'}}>
                    <label style={{paddingRight:'10px'}}>Нужна вакансия после завершения проекта?</label>
                    <label htmlFor='Vacation'>
                        <input
                            type='radio'
                            value={true}
                            id='Vacation'
                            name='VacationTrue'
                            checked={!checkVal}
                            onChange={changeVal}
                        />Да</label>
                    <label htmlFor='Vacation1'>
                        <input
                            type='radio'
                            value={false}
                            id='Vacation'
                            name='VacationFalse'
                            checked={checkVal}
                            onChange={changeVal}
                        />Нет</label>
                </div>
                <div style={{textAlign:'center',paddingTop:"20px"}}>
                    <button className="filterButton" onClick={clickHandler}>Сохранить</button>
                    <button className="filterButton" onClick={clearInput}>Сбросить</button>
                    {/*<button className="filterButton" onClick={() => window.location.href = `/department/${depsId.depsId}`} >Выход</button>*/}
                </div>
            </div>
        </>
    )
}
export default VacanciesAdd