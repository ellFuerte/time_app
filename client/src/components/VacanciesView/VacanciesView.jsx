import React, {useEffect,useState} from 'react'
import Pagination from "../Pagination/Pagination";
import ModalVacancies from "../Templates/ModalVacancies/ModalVacancies"
import axios from "axios";
import './VacanciesView.css'
import VacanciesItem from "../VacanciesItem/VacanciesItem";
import Topbar from "../Topbar/Topbar";
import Sidebar from "../Sidebar/Sidebar";
import VacanciesAdd from "../VacanciesAdd/VacanciesAdd";


function VacanciesView(departId) {
    const localUser = JSON.parse(localStorage.getItem('user'))
    const [vacancies, setVacancies] = useState([])
    const [isAddingVacancies, setIsAddingVacancies] = useState(false)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState([])
    const [company, setCompany] = useState([])
    const [projectIds, setProjectIds] = useState([]);
    const [filteredVacancies, setFilteredVacancies] = useState([]);
    const [activeFilters, setActiveFilters] = useState({

        company: [],
        status: [],
        project: [],
        department: null,
        startDate: null,
        endDate: null

    });


    useEffect(() => {


        const VacanciesView = async () => {

            const statuses = await axios.get('/api/Vacations/?status=status')
            const companies = await axios.get('/api/Vacations/?company=company')
            setCompany(companies.data)
            setStatus(statuses.data)

            const vacancies_function = {
                departId: localUser.departmentId,
                user_id: localUser._id
            }

            const getVacancies = await axios.post('/api/Vacations_function/', vacancies_function)
            setVacancies(getVacancies.data[0].get_vacancies);
            const fetchedVacancies = getVacancies.data[0].get_vacancies;
            const uniqueProjectIds = new Set();

            fetchedVacancies.forEach(department => {
                department.vacancies.forEach(vacancy => {
                    if (vacancy.project_id !== undefined && vacancy.project_id !== null) {
                        uniqueProjectIds.add(vacancy.project_id);
                    }
                });
            });
            const sortedProjectIds = Array.from(uniqueProjectIds).sort((a, b) => a - b);
            const sortedUniqueProjectIds = new Set(sortedProjectIds);
            setProjectIds(sortedUniqueProjectIds);

        }
        VacanciesView()
    }, [departId])


    useEffect(() => {
        applyFilters(activeFilters);
    }, [vacancies, activeFilters]);

    const clickAdd = () => {
        setIsAddingVacancies(true)
    }

    const clickBackButton = () => {
        setIsAddingVacancies(false)
    }

    const handleClickFilter = (type, value) => {
        setActiveFilters(prevFilters => {
            let newFilters;
            if (type === 'status') {
                newFilters = {
                    ...prevFilters,
                    status: prevFilters.status.includes(value)
                        ? prevFilters.status.filter(status => status !== value)
                        : [...prevFilters.status, value]
                };
            } else if (type === 'company') {
                newFilters = {
                    ...prevFilters,
                    company: prevFilters.company.includes(value)
                        ? prevFilters.company.filter(company => company !== value)
                        : [...prevFilters.company, value]
                };
            } else if (type === 'department') {
                newFilters = {
                    ...prevFilters,
                    department: prevFilters.department === value ? null : value
                };
            } else if (type === 'project') {
                newFilters = {
                    ...prevFilters,
                    project: prevFilters.project.includes(value)
                        ? prevFilters.project.filter(project => project !== value)
                        : [value]
                };
            }
            return newFilters;
        });
    };

    const handleDateChange = (type, value) => {
        if (type === 'startDate') {
            setStartDate(value);
        } else if (type === 'endDate') {
            setEndDate(value);
        }
    };


    const applyFilters = (filters) => {
        let filtered = vacancies;

        if (filtered) {
            if (filters.department) {
                filtered = filtered.filter(department => department.department_id === parseInt(filters.department));
            }

            if (filters.company.length > 0) {
                filtered = filtered.filter(department =>
                    department.vacancies.some(vacancy => filters.company.includes(vacancy.company_name))
                ).map(department => ({
                    ...department,
                    vacancies: department.vacancies.filter(vacancy => filters.company.includes(vacancy.company_name))
                }));
            }

            if (filters.status.length > 0) {
                filtered = filtered.filter(department =>
                    department.vacancies.some(vacancy => filters.status.includes(vacancy.status_name))
                ).map(department => ({
                    ...department,
                    vacancies: department.vacancies.filter(vacancy => filters.status.includes(vacancy.status_name))
                }));
            }

            if (filters.project.length > 0) {
                console.log('Filtering by project:', filters.project);
                filtered = filtered.filter(department =>
                    department.vacancies.some(vacancy => filters.project.includes(String(vacancy.project_id)))
                ).map(department => ({
                    ...department,
                    vacancies: department.vacancies.filter(vacancy => filters.project.includes(String(vacancy.project_id)))
                }));
                console.log('Filtered by project:', filtered);
            }

            if (filters.startDate || filters.endDate) {
                filtered = filtered.map(department => ({
                    ...department,
                    vacancies: department.vacancies.filter(vacancy => {
                        const vacancyDate = new Date(vacancy.create_date);
                        const startDate = filters.startDate ? new Date(filters.startDate) : null;
                        const endDate = filters.endDate ? new Date(filters.endDate) : null;
                        return (!startDate || vacancyDate >= startDate) && (!endDate || vacancyDate <= endDate);
                    })
                })).filter(department => department.vacancies.length > 0);
            }
        }

        setFilteredVacancies(filtered);
    };


    const handleCombinedFilter = () => {
        setActiveFilters(prevFilters => {
            const newFilters = {
                ...prevFilters,
                startDate: startDate || null,
                endDate: endDate || null
            };
            applyFilters(newFilters);
            return newFilters;
        });
    };

    const reset = () => {
        setActiveFilters({
            company: [],
            status: [],
            project:[],
            department: null,
            startDate: null,
            endDate: null
        });
        setStartDate('');
        setEndDate('');
        setFilteredVacancies(vacancies);
    };


    const getColorByStatusId = (statusId) => {
        switch (Number(statusId)) {
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
            <Topbar/>
            <div className="mainContainer">
                <Sidebar/>
                <div className='Vacations'>
                    {isAddingVacancies ?
                        <button className='btnStaff' onClick={clickBackButton}>Назад</button>:''
                    }
                    {isAddingVacancies ? (
                        <VacanciesAdd/>
                    ) : (
                        <>
                            <div className="VacationsContainerTop">

                                <div>
                                    <button className='btnStaff' onClick={() => window.location.href = `/department/${localUser.departmentId}`}>Назад</button>
                                    <button className='btnStaff' onClick={clickAdd}>Добавить вакансию</button>
                                </div>
                                <div style={{padding:'20px'}}>
                                <h2>Вакансии</h2>
                                <div>
                                    <input
                                        type='date'
                                        placeholder="Выберите дату"
                                        className="ModalInput"
                                        style={{marginRight: '10px'}}
                                        value={startDate}
                                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                                    />
                                    —
                                    <input
                                        type='date'
                                        placeholder="Выберите дату"
                                        className="ModalInput"
                                        style={{marginRight: '10px'}}
                                        value={endDate}
                                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                                    />
                                    <button className="filterButton" onClick={handleCombinedFilter}>Поиск</button>
                                    <button className="filterButton" onClick={reset}>Сбросить</button>
                                </div>
                                <br/>
                                <div>
                                    <div style={{display:'flex'}}>
                                        <div>
                                            <select
                                                className="ModalInputUpdateSelect"
                                                onChange={(e) => handleClickFilter('department', e.target.value)}
                                            >
                                                {vacancies.map((dep, index) => (
                                                    <option
                                                        key={index}
                                                        value={dep.department_id}
                                                    >
                                                        {dep.department}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{paddingLeft:'20px',paddingTop:'5px'}}>Проект:</div>
                                       <div>
                                               <select
                                                   className='ModalInputUpdateSelect'
                                                   onChange={(e) => handleClickFilter('project', e.target.value)}

                                               >
                                                   {projectIds.map((projectId, id) => (
                                                       <option
                                                           key={id}
                                                           value={projectId}
                                                       >
                                                           {projectId}
                                                       </option>
                                                   ))}

                                               </select>


                                        </div>

                                    </div>
                                </div>
                                <br/>
                                    <div>
                                        {company.map((company, id) => (
                                            <button
                                                key={id}
                                                className='filtersButton'
                                                onClick={() => handleClickFilter('company', company.name)}
                                                style={{
                                                    boxShadow: activeFilters.company.includes(company.name) ? "0 0 1px rgba(0,0,0,.5) inset, 0 2px 3px rgba(0,0,0,.5) inset, 0 1px 1px rgba(255,255,255,.1)" : "",
                                                    background: activeFilters.company.includes(company.name) ? 'gray' : '#1775ee',
                                                    opacity: activeFilters.company.includes(company.name) ? '1' : ''
                                                }}
                                            >
                                                {company.name}
                                            </button>
                                        ))}
                                    </div>
                                    <br/>
                                    <div>
                                        {status.map((status, id) => (
                                            <button
                                                key={id}
                                                className={'filtersButton' + getColorByStatusId(status.id)}
                                                onClick={() => handleClickFilter('status', status.name)}
                                                style={{
                                                    boxShadow: activeFilters.status.includes(status.name) ? "0 0 1px rgba(0,0,0,.5) inset, 0 2px 3px rgba(0,0,0,.5) inset, 0 1px 1px rgba(255,255,255,.1)" : "",
                                                    background: activeFilters.status.includes(status.name) ? 'gray' : '',
                                                    opacity: activeFilters.status.includes(status.name) ? '1' : ''
                                                }}
                                            >
                                                {status.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {
                                filteredVacancies.map(vac => (
                                    <div className='VacationsContainer' key={vac.id}>
                                        <VacanciesItem vac={vac} key={vac.department} status={status}
                                                       department={vac.department} vacancies={vac.vacancies}/>
                                    </div>
                                ))

                            }


                            {/*                               {
                                   filteredData.map(vac => (
                                        <div className='VacationsContainer' key={vac.id}>
                                            <VacanciesItem vac={vac} key={vac.department} status={status} department={vac.department} vacancies={vac.vacancies}/>
                                        </div>
                                    ))

                                }*/}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default VacanciesView