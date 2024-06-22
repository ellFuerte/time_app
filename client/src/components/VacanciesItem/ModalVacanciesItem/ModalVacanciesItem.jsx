import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import moment from "moment";

const ModalVacanciesItem =({allDateUser})=> {


    useEffect(() => {
        if (allDateUser) {
            setInputValueVacanciesName(allDateUser.vacancies_name)
            setInputValueGrade(allDateUser.grade)
            setSelectDep(allDateUser.vacancies_department_id)
            setInputValueDescription(allDateUser.description)
            setInputValueStatuses(allDateUser.vacancies_status_id)
            setSelectCompany(allDateUser.company_id)
            setSelectItc(allDateUser.vacancy_code)
            setProjectItem(allDateUser.project_id)
            setVacanciesId(allDateUser.vacancy_id)
            setOld_user(allDateUser.id)


            if(allDateUser.planned_release_date!==null)
            {
                const date = moment(allDateUser.planned_release_date).format('YYYY-MM-DD')
                setPlannedReleaseDate(date)
            }
        } else {
            console.log('allDateUser или allDateUser.vacancies_name не определен');
        }


    }, [allDateUser]);



    const [status, setStatus] = useState([])
    const [selectDep, setSelectDep] = useState("")

    const [company, setCompany] = useState([])
    const [selectCompany, setSelectCompany] = useState([])


    const [selectItc, setSelectItc] = useState([])

    const [projectItem, setProjectItem] = useState([])

    const [message, setMessage] = useState("")


    const [plannedReleaseDate, setPlannedReleaseDate] = useState([])

    const [vacanciesId, setVacanciesId] = useState("")

    const [inputValueVacanciesName, setInputValueVacanciesName] = useState('')

    const [old_user, setOld_user] = useState("")

    const [inputValueDescription, setInputValueDescription] = useState("")

    const [inputValueStatuses, setInputValueStatuses] = useState("")

    const [inputValueGrade, setInputValueGrade] = useState("")

    const [user_name, setUser_name] = useState('')

    const [searchTerm, setSearchTerm] = useState('');
    const [userId, setUserId] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [users, setUsers] = useState([])


    const statusRef = useRef()
    const departRef = useRef()
    const companyRef = useRef()
    const ITCRef = useRef()
    const projectRef = useRef()
    const DateReleaseRef = useRef()

    useEffect(() => {
        const Department = async () => {
            const statuses = await axios.get('/api/Vacations/?status=status')
            setStatus(statuses.data)
            const departs = await axios.get('/api/departments/')
            setDeps(departs.data)
            const company = await axios.get('/api/Vacations/?company=company')
            setCompany(company.data)
            const user = await axios.get('/api/user')
            setUsers(user.data)

        }

        Department()
    }, [])
    const [deps, setDeps] = useState([])

    const handleNameInputChange = (e) => {
        setInputValueVacanciesName(e.target.value)
    }


    // Обработчик изменения значения для поля ввода с grade
    const handleDescriptionInputChange = (e) => {
        setInputValueDescription(e.target.value);
    }

    const handleGradeInputChange = (e) => {
        // Проверяем, является ли введенное значение числом (включая пустое значение)
        if (/^\d*$/.test(e.target.value)) {
            setInputValueGrade(e.target.value);
        }
    };


    const selectValue = () => {
        setInputValueStatuses(statusRef.current.value)
    }

    const selectDeps = () => {
        setSelectDep(departRef.current.value)
    }

    const companySelect = () => {
        setSelectCompany(companyRef.current.value)
    }

    const SelectITC = () => {
        setSelectItc(ITCRef.current.value)
    }

    const Project = (e) => {
        if (/^\d*$/.test(e.target.value)) {
            setProjectItem(e.target.value);
        }
    }

    const DataCurrent = () => {
        setPlannedReleaseDate(DateReleaseRef.current.value)
        console.log('DateReleaseRef.current.valu=',DateReleaseRef.current.value)


    }

    const ChangeDataButton = async () => {

        const ChangeData = {
            namevacanciesId: vacanciesId,
            namevacancies: inputValueVacanciesName,
            description: inputValueDescription,
            grade: inputValueGrade,
            statuses: statusRef.current.value,
            users: (userId.length===0 ? old_user : userId),
            search: userId,
            old_user: old_user,
            deps: selectDep,
            company_id: selectCompany,
            vacancy_code: selectItc,
            project_id: projectItem,
            planned_release_date:DateReleaseRef.current.value.length===0 ? null :DateReleaseRef.current.value
        }

        if (statusRef.current.value === '3' && old_user===null && userId.length<1) {
            setMessage('Сотрудник не назначен')
        }


        else {
            const res = await axios.put('/api/Vacations/', ChangeData)
            setMessage('Сохранено')
            window.location.reload()
        }
    }
    const handleInputChange = (e) => {
        const term = e.target.value;
        if(term==='') {
            setSearchTerm(null)
        }
        else {
            setSearchTerm(term);
        }
        const filtered = users.filter(user =>
            user.user_name && user.user_name.toLowerCase().includes(term.toLowerCase())
        )

        if (term === '') {
            setUser_name('')
        } else {
            setFilteredUsers(filtered); // всегда устанавливаем filteredUsers
        }
    }



    const handleUserClick = (userName,userId) => {

        setUserId(userId)
        console.log('old=',userId)
        setSearchTerm(userName)
        setFilteredUsers([])

    }



        return (
            <div>
                <div className='MessageItemVacancies'>
                    <span >{message}</span>
                </div>
                <div>
                    <input type='text' className="ModalInputVacancies"
                           value={inputValueVacanciesName}
                           onChange={handleNameInputChange}
                    />
                </div>
                <div>
                    <textarea className='textDescription'
                              value={inputValueDescription}
                              onChange={handleDescriptionInputChange}
                    />
                </div>
                <div>
                    <span>Подразделение:</span><br/>
                    <select ref={departRef}
                            value={selectDep}
                            onChange={selectDeps}
                            className='InputVacanciesItemDeps'>
                        {deps.map((dep, name) => <option key={name}
                                                         value={dep.id}>{dep.department_name}</option>)}
                    </select>
                </div>

                <div>
                    <span>Статус:</span><br/>
                    <select ref={statusRef}
                            value={inputValueStatuses}
                            onChange={selectValue}
                            className='InputVacanciesItemSelect'>
                        {status.map((status, name) => <option key={name}
                                                              value={status.id}>{status.name}</option>)}
                    </select>
                </div>

                <div>
                    <span>Грейд:</span><br/>
                    <input type='text'
                           value={inputValueGrade}
                           onChange={handleGradeInputChange}
                           placeholder='Грейд'
                           className='InputVacanciesItem'
                    />
                </div>
                <div>
                    <span>Компания:</span><br/>
                    <select ref={companyRef}
                            value={selectCompany}
                            onChange={companySelect}
                            className='InputVacanciesItemSelect'>
                        {company.map((company, name) => <option key={name} value={company.id}>{company.name}</option>)}
                    </select>
                </div>

                <div className="container">
                    <div>

                        <span>Имя сотрудника:</span><br/>
                        <div className='inputDiv'>
                            <input
                                type='text'
                                placeholder='Имя сотрудника'
                                value={searchTerm || (allDateUser && allDateUser.user_name)}
                                onChange={handleInputChange}
                                className='InputVacanciesItem'
                            />

                            {filteredUsers.length > 0 && (
                                <div className="userListContainer">
                                    {filteredUsers.map((user, index) => (
                                        <div className='selectNameDiv' key={index} value={user.id}
                                             onClick={() => handleUserClick(user.user_name, user.id)}>
                                            {user.user_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <span>Дата выхода:</span><br/>
                            <input type='date'
                                   ref={DateReleaseRef}
                                   placeholder='ИТС'
                                   className='InputVacanciesItem'
                                   value={plannedReleaseDate}
                                   onChange={DataCurrent}
                            />
                        </div>
                        <div>
                            <span>ИТС:</span><br/>
                            <input type='text'
                                   ref={ITCRef}
                                   value={selectItc}
                                   onChange={SelectITC}
                                   placeholder='ИТС'
                                   className='InputVacanciesItem'
                            />
                        </div>
                        <div>
                            <span>Проект:</span><br/>
                            <input type='text'
                                   ref={projectRef}
                                   value={projectItem}
                                   onChange={Project}
                                   placeholder='Проект(Нет проекта=0)'
                                   className='InputVacanciesItem'
                            />
                        </div>
                    </div>
                    <br/>
                    <div className='divHistory'>
                        История
                    </div>
                    <br/>
                    <div>
                        <button className="ModalButton" type="submit" onClick={ChangeDataButton}>
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        );

}

export default ModalVacanciesItem;