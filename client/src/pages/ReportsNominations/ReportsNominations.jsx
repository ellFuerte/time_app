import Topbar from '../../components/Topbar/Topbar'
import '../ReportsNominations/ReportsNominations.css'
import React, {useRef, useState,useMemo} from "react";
import {useParams} from "react-router-dom";
import { CSVLink } from 'react-csv';
import axios from "axios";
import RepostInfoNominations from "../../components/RepostInfoNominations/RepostInfoNominations";
import Pagination from "../../components/Pagination/Pagination";


export default function ReportsNominations() {
    const [sortConfig, setSortConfig] = useState({ key: 'Кто', direction: 'ascending' });
    const [sortConfig1, setSortConfig1] = useState({ key: 'Номинант', direction: 'ascending' });
    const [sortConfig2, setSortConfig2] = useState({ key: 'nominations_name', direction: 'ascending' });
    const [sortConfig3, setSortConfig3] = useState({ key: 'date', direction: 'ascending' });


    const [error, setError] = useState('')
    const historyStartWork = useRef(null)
    const historyEndWork = useRef(null)
    const [isFilter, setIsFilter] = useState(false)
    const [posts, setPosts] = useState([])
    const [isOpen, setisOpen] = useState(false)
    const username = useParams()




    const handleClick = async () => {
        const start = historyStartWork.current.value
        const end = historyEndWork.current.value
        if (start === "" || end === "") {
            setError('Введите дату')
        } else {
            if (start !== '' || end !== '') {
                setError('Выберите дату')
            }
            if (end < start) {
                setError('Конечная дата меньше начальной')
            } else {

                const filter = {
                    startDateNomination: historyStartWork.current.value,
                    endDateNomination: historyEndWork.current.value,
                }
                setError('')

                const fill = async () => {
                    const res = await axios.post('/api/post/Reports', filter)
                    setPosts(res.data)
                    setError('')
                }
                fill()
            }
        }
    }
    const handleClickCancel = async () => {
        setError('')
        setIsFilter(false)
        historyStartWork.current.value = ''
        historyEndWork.current.value = ''
    }


    const requestSort = (key) => {
        if (historyStartWork.current.value !== '' && historyEndWork.current.value !== '') {
            let direction = 'ascending';
            if (sortConfig.key === key && sortConfig.direction === 'ascending' ||
                sortConfig1.key === key && sortConfig1.direction === 'ascending' ||
                sortConfig2.key === key && sortConfig2.direction === 'ascending' ||
                sortConfig3.key === key && sortConfig3.direction === 'ascending'
            ) {
                direction = 'descending';
            }
            setSortConfig({ key, direction });
            setSortConfig1({ key, direction });
            setSortConfig2({ key, direction });
            setSortConfig3({ key, direction });
        }
    }



    const sortedPosts = useMemo(() => {
        const sortablePosts = [...posts];
        if (sortConfig !== null) {
            sortablePosts.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                setisOpen(true)
                return 0;
            });
        }

        return sortablePosts;
    }, [posts, sortConfig]);



    return (
        <>
            <div className='Reports'>
                <div className="ReportsContainer">
                    <h2 className='ReportsMainText'>Отчет по номинациям</h2>
                    {error && <div className='errorHistoryInfo'>{error}</div>}
                    <hr/>
                    <br/>
                    <div style={{display:'flex'}}>
                        <div>
                    <input
                        type='date'
                        placeholder="Начало работы"
                        className="ModalInput"
                        ref={historyStartWork}
                        style={{'marginRight': '10px'}}
                    />
                        </div>
                        <div>
                            —  <input
                        type='date'
                        placeholder="Конец работы"
                        className="ModalInput"
                        ref={historyEndWork}
                        style={{'marginRight': '10px'}}
                    />
                        </div>
                    <div>
                    <button className="historyButton" onClick={handleClick}>Найти</button>
                    </div>
                        <div>
                        <button className="historyButton" onClick={handleClickCancel}>Сбросить</button>
                    </div>
                    </div>
                    <div>

                    </div>
                    {isOpen && <div>
                        <CSVLink data={posts} filename={"nominations.csv"}>Download CSV</CSVLink>
                    </div>
                    }
                    <br/>
                    <hr/>
                    <br/>
                    <tr>
                        <td className="historyinfoNumber" onClick={() => requestSort('Кто')}>
                            Кто голосовал {sortConfig.key === 'Кто' && (
                            <span className="column">{sortConfig.direction === 'ascending' ? '▼' : '▲'}</span>
                        )}
                        </td>
                        <td className="historyinfoNumber" onClick={() => requestSort('Номинант')}>
                            Номинировал {sortConfig1.key === 'Номинант' && (
                            <span className="column1">{sortConfig1.direction === 'ascending' ? '▼' : '▲'}</span>
                        )}
                        </td>
                        <td className="historyinfoNumber" onClick={() => requestSort('nominations_name')}>
                            Имя номинации {sortConfig2.key === 'nominations_name' && (
                            <span className="column2">{sortConfig2.direction === 'ascending' ? '▼' : '▲'}</span>
                        )}
                        </td>
                        <td className="historyinfoNumber" onClick={() => requestSort('date')}>
                            Дата голосования {sortConfig3.key === 'date' && (
                            <span className="column3">{sortConfig3.direction === 'ascending' ? '▼' : '▲'}</span>
                        )}
                        </td>
                    </tr>

                    {
                        sortedPosts.map((posts, id) => <RepostInfoNominations key={id} posts={posts} username={username}/>)
                    }


{/*{                   <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}
                                currentPage={currentPage}/>}*/}

                </div>
            </div>
        </>
    )
}