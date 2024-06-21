import Topbar from "../../components/Topbar/Topbar";
import React, {useMemo, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import RepostsInfo from "../../components/ReportsInfo/RepostsInfo";
import Pagination from "../../components/Pagination/Pagination";
import '../ReportsHistory/ReportsHistory.css'
export default function ReportsHistory() {
    const [sortConfig, setSortConfig] = useState({ key: 'user_name', direction: 'ascending' });
    const [sortConfig1, setSortConfig1] = useState({ key: 'workstart', direction: 'ascending' });
    const [sortConfig2, setSortConfig2] = useState({ key: 'workend', direction: 'ascending' });
    const [sortConfig3, setSortConfig3] = useState({ key: 'worklong', direction: 'ascending' });
    const [sortConfig4, setSortConfig4] = useState({ key: 'comment', direction: 'ascending' });

    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(30)

    const lastPostIndex = currentPage * postsPerPage
    const firstPostIndex = lastPostIndex - postsPerPage

    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState('')
    const historyStartWork = useRef(null)
    const historyEndWork = useRef(null)
    const [isFilter, setIsFilter] = useState(false)
    const [posts, setPosts] = useState([])
    const currentlyPosts = posts.slice(firstPostIndex, lastPostIndex)
    const username = useParams()


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const paginate = pageNumber => setCurrentPage(pageNumber)


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
                    startdate: historyStartWork.current.value,
                    enddate: historyEndWork.current.value,
                }
                setError('')

                const fill = async () => {
                    const res = await axios.post('/api/post/Reports', filter)
                    setPosts(res.data)
                    setError('')
                    setIsOpen(true)
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
                sortConfig3.key === key && sortConfig3.direction === 'ascending' ||
                sortConfig4.key === key && sortConfig4.direction === 'ascending'
            ) {
                direction = 'descending';
            }
            setSortConfig({ key, direction });
            setSortConfig1({ key, direction });
            setSortConfig2({ key, direction });
            setSortConfig3({ key, direction });
            setSortConfig4({ key, direction });
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
                return 0;
            });
        }
        return sortablePosts;
    }, [posts, sortConfig]);

    const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <>
            <Topbar/>
            <div className='Reports'>
                <div className="ReportsContainer">
                    <h2 className='ReportsMainText'>Отчет по истории</h2>
                    {error && <div className='errorHistoryInfo'>{error}</div>}
                    <hr/>
                    <br/>
                    <div style={{display:'flex'}}>
                        <div >
                    <input
                        type='date'
                        placeholder="Начало работы"
                        className="ModalInput"
                        ref={historyStartWork}
                        style={{'marginRight': '10px'}}
                    /></div>
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
                    <br/>
                    <hr/>
                    <br/>
                    <tr>
                        <td className="historyinfoNumber" onClick={() => requestSort('user_name')}>
                            ФИО {sortConfig.key === 'user_name' && (
                            <span className='user_name'>{sortConfig.direction === 'ascending' ? '▼' : '▲'}</span>
                        )}
                        </td>
                        <td className="historyinfoNumber" onClick={() => requestSort('workstart')}>
                            Начало {sortConfig1.key === 'workstart' && (
                            <span className='workstart'>{sortConfig1.direction === 'ascending' ? '▼' : '▲'}</span>
                        )}
                        </td>
                        <td className="historyinfoNumber" onClick={() => requestSort('workend')}>
                            Конец {sortConfig2.key === 'workend' && (
                            <span className="workend">{sortConfig2.direction === 'ascending' ? '▼' : '▲'}</span>
                        )}
                        </td>
                        <td className="historyinfoNumber" onClick={() => requestSort('worklong')}>
                            Длительность {sortConfig3.key === 'worklong' && (
                            <span className="worklong">{sortConfig3.direction === 'ascending' ? '▼' : '▲'}</span>
                        )}
                        </td>
                        <td className="historyinfoNumber" onClick={() => requestSort('comment')}>
                            Комментарий {sortConfig4.key === 'comment' && (
                            <span className="comment">{sortConfig4.direction === 'ascending' ? '▼' : '▲'}</span>
                        )}
                        </td>
                    </tr>
                    {
                        currentPosts.map((posts, id) => <RepostsInfo key={id} posts={posts} username={username}/>)
                    }

                    <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}
                                currentPage={currentPage}/>

                </div>
            </div>
        </>
    )
}