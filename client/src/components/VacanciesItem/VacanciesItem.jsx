import "./VcanciesItem.css"
import moment from "moment";
import React, {useEffect, useRef, useState} from "react";
import {Link} from 'react-router-dom'
import axios from "axios";
import ModalVacancies from "../Templates/ModalVacancies/ModalVacancies";


const VacanciesItem =({department,vacancies,status})=> {
    const localUser = JSON.parse(localStorage.getItem('user'))

    const [selectDep, setSelectDep] = useState("")

    const [company, setCompany] = useState([])
    const [selectCompany, setSelectCompany] = useState([])


    const [selectItc, setSelectItc] = useState([])

    const [projectItem, setProjectItem] = useState([])

    const [message, setMessage] = useState("")


    const [plannedReleaseDate, setPlannedReleaseDate] = useState([])

    const [vacanciesId, setVacanciesId] = useState("")

    const [modalVacations, setModalVacations] = useState(false)

    const [inputValue, setInputValue] = useState("")

    const [old_user, setOld_user] = useState("")

    const [inputValueDescription, setInputValueDescription] = useState("")

    const [inputValueStatuses, setInputValueStatuses] = useState("")

    const [inputValueGrade, setInputValueGrade] = useState("")

    const [user_name, setUser_name] = useState('')

    const date = moment().format('YYYY-MM-DD');
    const [searchTerm, setSearchTerm] = useState('');
    const [userId, setUserId] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [users, setUsers] = useState([])

    const [selectedVacanciesName, setSelectedVacanciesName] = useState('');
    const [selectedVacanciesStatuses, setSelectedVacanciesStatuses] = useState('');
    const [selectedVacanciesDescription, setSelectedVacanciesDescription] = useState('');
    const [selectedVacanciesGrade, setSelectedVacanciesGrade] = useState('');

    const statusRef = useRef()
    const departRef = useRef()
    const companyRef = useRef()
    const ITCRef = useRef()
    const projectRef = useRef()
    const DateReleaseRef = useRef()

    const searchRef = useRef()

    const [startDate, setStartDate] = useState(''); // начальная дата фильтра
    const [endDate, setEndDate] = useState(''); // конечная дата фильтра

    const [deps, setDeps] = useState([])



    useEffect(() => {
        const Department = async () => {

            const departs = await axios.get('/api/departments/')
            setDeps(departs.data)
            const company = await axios.get('/api/Vacations/?company=company')
            setCompany(company.data)
            const user = await axios.get('/api/user')
            setUsers(user.data)

        }

        Department()
    }, [])



    const handleNameInputChange = (e) => {
        setInputValue(e.target.value);
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

    const selectValueStatus = () => {
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
    }



    const ChangeDataButton = async () => {

        const ChangeData = {
            namevacanciesId: vacanciesId,
            namevacancies: inputValue,
            description: inputValueDescription,
            grade: inputValueGrade,
            statuses: statusRef.current.value,
            users: userId,
            search: searchTerm,
            old_user: old_user,
            deps: selectDep,
            company_id: selectCompany,
            vacancy_code: selectItc,
            project_id: projectItem,
            planned_release_date:(plannedReleaseDate==='' ? null : plannedReleaseDate)
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


    const handleClick = (name, grade,id,description,status_id,user_name,user_id,department_id,company_id,vacancy_code,project_id,planned_release_date) => {
        if(localUser.isAdmin===true) {

            if(user_name===null){
                setUser_name([])
            }else {
                setUser_name(user_name)
            }

            setFilteredUsers([])
            setMessage([])
            setModalVacations(true);
            setVacanciesId(id)
            setSelectedVacanciesName(name);
            setInputValue(name); // Установка начального значения для name


            setSelectedVacanciesDescription(description)
            setInputValueDescription(description)

            setSelectedVacanciesGrade(grade);
            setInputValueGrade(grade); // Установка начального значения для grade

            setSelectedVacanciesStatuses(status_id)
            setInputValueStatuses(status_id)

            setOld_user(user_id)

            setSelectDep(department_id)

            setSelectCompany(company_id)

            setSelectItc(vacancy_code)

            setProjectItem(project_id)

            setPlannedReleaseDate(planned_release_date)
        }
    };

    const handleUserClick = (userName,userId) => {

        setUserId(userId)
        setSearchTerm(userName)
        setFilteredUsers([])

    }


    const getColorByStatusId = (statusId) => {
        switch (statusId) {
            case 20:
                return 'Reserve'; //  Резерв Установите Белый цвет для статуса 1
            case 30:
                return 'Selection'; // Подбор Установите желтый цвет для статуса 2
            case 50:
                return 'Securely'; // Обеспеченно Установите зелёный цвет для статуса 3
            case 10:
                return 'Liquidated'; // Ликвидированно Установите белый прозрачный цвет для статуса 4
            case 40:
                return 'Finalist'; //  Финалист Установите красный цвет для статуса 5

        }
    }



    return (
        <>
            <h2 className='departmentName'>{department}</h2>
            <div className="vacancies-container">
                {vacancies.map(vac => (
                    <div key={vac.id} className={"angry-grid1"+getColorByStatusId(vac.status_id)}
                         onClick={() => handleClick(vac.name, vac.grade,vac.id,vac.description,vac.status_id,
                             vac.user_name,vac.user_id,vac.department_id,vac.company_id,vac.vacancy_code,vac.project_id,vac.planned_release_date)}>

                        <div id="cssportal-grid">
                            <div id="div1"></div>
                            <div id="div2">{vac.user_name}</div>
                            <div id="div3">{date === vac.create_date ? 'NEW' : ''}</div>
                            <div id="div4"></div>
                            <div id="div5">{vac.name}</div>
                            <div id="div6"></div>
                            <div id="div7"></div>
                            <div id="div8">{vac.vacancy_code}</div>
                            <div id="div9"></div>
                            <div id="div10">Грейд: {vac.grade}</div>
                            <div id="div11">{vac.status_name}</div>
                            <div id="div12">Проект: {vac.project_id}</div>
                            <div id="div13">{vac.company_name}</div>
                        </div>
                    </div>




                ))}


                <ModalVacancies active={modalVacations} setActive={setModalVacations}>
                    <div className='MessageItemVacancies'>
                        <span >{message}</span>
                    </div>
                    <div>
                        <input type='text' className="ModalInputVacancies"
                               value={inputValue}
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
                                onChange={selectValueStatus}
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
                                    value={searchTerm || user_name}
                                    onChange={handleInputChange}
                                    className='InputVacanciesItem'
                                />

                                {old_user ?<Link className='ProfileLinkVacancies' style={{paddingLeft:'10px'}} to={`/profile/${old_user}`}>Перейти в профиль</Link>:''}


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
                                       value={plannedReleaseDate || ''}
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
                </ModalVacancies>
            </div>
        </>    )
}
export default VacanciesItem