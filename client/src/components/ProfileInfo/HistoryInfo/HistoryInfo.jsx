import axios from 'axios'
import { useRef } from 'react'
import { useEffect, useState } from 'react'

import InfoPost from '../../InfoPost/InfoPost'
import Pagination from '../../Pagination/Pagination'
import VacationPost from '../../VacationPost/VacationPost'
import './HistoryInfo.css'
import Modal from '../../Templates/Modal/Modal'
import {useParams} from "react-router-dom";



export default function HistoryInfo() {
    const [posts, setPosts] = useState([])
    const [vacationPosts, setVacationPosts] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(30)

    const lastPostIndex = currentPage * postsPerPage
    const firstPostIndex = lastPostIndex - postsPerPage
    const currentlyPosts = posts.slice(firstPostIndex, lastPostIndex)


    const lastPostIndexVacations = currentPage * postsPerPage
    const firstPostIndexVacations = lastPostIndexVacations - postsPerPage
    const currentlyVacations = vacationPosts.slice(firstPostIndexVacations, lastPostIndexVacations)



    const historyStartWork = useRef(null)
    const historyEndWork = useRef(null)
    const [isFilter, setIsFilter] = useState(false)
    const [newPosts, setNewPosts] = useState([])
    const [error, setError] = useState('')
    const [modalError, setModalError] = useState('')
    const username=useParams()

    let localUser = !!username ? {_id:username.username,email:""} : JSON.parse(localStorage.getItem('user'))



    const [isJob, setIsJob] = useState(true)
    const [modalActive, setModalActive] = useState(false)
    const [modalName, setModalName] = useState(null)
    const modalComment = useRef()
    const vacationStart = useRef()
    const vacationEnd = useRef()

    // получение всех постов работы от послелнего к первому

    useEffect(() => {
        setIsFetching(true)

        fetchUserpost()
    }, [username])

    const fetchUserpost = async () => {
        const res = await axios.get('/api/post?type=1&id='+localUser._id)
        setPosts(res.data.sort((p1, p2) => {
            return new Date(p2.workstart) - new Date(p1.workstart)
        }))
        setIsFetching(false)
    }


    const paginate = pageNumber => setCurrentPage(pageNumber)

    // фильтер постов по дате
    const handleClick = async () => {
        const start = historyStartWork.current.value
        const end = historyEndWork.current.value
        if (start === "" || end === "" ) {
            setError('Введите дату')
        } else{
            if (start !== '' || end !== '') {
                setError('Выберите дату')}
            if (end< start) {
                setError('Конечная дата меньше начальной')}

            else{

                const filter = {
                    startdate: historyStartWork.current.value,
                    enddate: historyEndWork.current.value,
                    userId: localUser._id,
                    typework:isJob
                }
                setError('')

                const fill = async () => {
                    const res = await axios.post('/api/post/filter',filter)
                    console.log('res=',res.data)

                    setVacationPosts(res.data.sort((p1, p2) => {
                        return new Date(p2.workstart) - new Date(p1.workstart)
                    }))

                    setPosts(res.data.sort((p1, p2) => {
                        return new Date(p2.workstart) - new Date(p1.workstart)
                    }))

                    setError('')
                }
                fill()
            }}

        /*      let filterPosts = isJob
              ?  posts.filter(post => post.workdate.split('T')[0] >= start)
              : vacationPosts.filter(post => post.start.split('T')[0] >= start)
            if(end){
              filterPosts = isJob
                ? filterPosts.filter(post => post.workdate.split('T')[0] <= end)
                : filterPosts.filter(post => post.end.split('T')[0] <= end)
            }
            setNewPosts(filterPosts)*/

    }


    // сброс фильтра
    const handleClickCancel = async () =>{
        setError('')
        setIsFilter(false)
        historyStartWork.current.value = ''
        historyEndWork.current.value = ''
    }


    // получение всех постов об отпуске/больничном от послелнего к первому
    useEffect(() => {
        setIsFetching(true)

        fetchUservacation()
    }, [username])

    const fetchUservacation = async () => {
        const res = await axios.get('/api/vacation?id='+localUser._id)
        console.log('res=',res.data)
        setVacationPosts(res.data.sort((p1, p2) => {
            return new Date(p2.start) - new Date(p1.start)
        }))
        setIsFetching(false)
    }
    // добавление больничного
    const handleClickAdd = async (e) => {
        e.preventDefault()

        const currentDay = new Date()

        if(vacationStart.current.value === '' || vacationEnd.current.value === '' || modalName === null || modalComment.current.value === ''){
            setModalError('Вcе поля должны быть заполнены')
            return
        }

        if(new Date(vacationStart.current.value) > new Date(vacationEnd.current.value) && vacationEnd.current.value !== ''){
            setModalError('Вторая дата меньше первой')
            return
        }




        const vacation = {
            userId: localUser._id,
            status:modalName,
            comment: modalComment.current.value,
            start: new Date(vacationStart.current.value),
            end: new Date(vacationEnd.current.value)
        }

        try {
            await axios.post('/api/vacation/',vacation)
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    }

    // переход на страницу с больничным и обратно
    const handleWorkVacation = () => {
        if(isJob){
            fetchUservacation()}else {
            fetchUserpost()
        }
        setIsJob(!isJob)
        setError('')
        setIsFilter(false)
        historyStartWork.current.value = ''
        historyEndWork.current.value = ''
    }

    const handleName = e => {
        setModalName(e.target.value)
    }
    return (
        <div className='historyInfo'>
            <div className='historyInfoTop'>
                <span className='historyInfoTitle'>История</span>
                <span className='workVacation' onClick={handleWorkVacation}>
          {isJob ? <button className="filterButton" style={{width:'155px'}}>Отпуск/Больничный</button> : <button className="filterButton">Работа</button> }
        </span>

                {!isJob && (localUser || username === localUser._id)

                && <div className='addVacation' onClick={() => setModalActive(true)}><span>+</span></div>}
            </div>
            <hr/>
            {error && <div className='errorHistoryInfo'>{error}</div>}
            <div className='historyFilter'>
                <input
                    type='date'
                    placeholder="Начало работы"
                    className="ModalInput"
                    ref={historyStartWork}
                    style={{'marginRight': '10px'}}
                />
                —  <input
                type='date'
                placeholder="Конец работы"
                className="ModalInput"
                ref={historyEndWork}
                style={{'marginRight': '10px'}}
            />
                <button className="filterButton" onClick={handleClick}>Ок</button>
                <button className="filterButton" onClick={handleClickCancel}>Сбросить</button>
            </div>
            <hr/>
            <br/>
            {isJob
                ?
                <tr>
                    <td className="historyinfodate">Дата</td>
                    <td className="historyinfopost">Время начала</td>
                    <td className="historyinfopost">Время окончания</td>
                    <td className="historyinfopost">Длительность</td>
                    <td className="historyinfopost">Состояние здоровья</td>
                    <td className="historyinfocomment">Комментарий</td>
                </tr>
                :
                <tr>
                    <td className="historyinfopostdate">Начало</td>
                    <td className="historyinfopost">Конец</td>
                    <td className="historyinfopost">Длительность</td>
                    <td className="historyinfopost">Причина</td>
                    <td className="historycomment">Комментарий</td>
                </tr>
            }

            {isJob
                ? isFetching
                    ? <div className='isFatching'>Загрузка...</div>
                    : isFilter
                        ? newPosts.map((post, id) => <InfoPost key={id} post={post} username={username}/>)
                        : currentlyPosts.map((post, id) => <InfoPost key={id} post={post} username={username}/>)
                : isFetching
                    ? <div className='isFatching'>Загрузка...</div>
                    : isFilter
                        ? newPosts.map((post, id) => <VacationPost key={id} post={post} username={username}/>)
                        : currentlyVacations.map((post, id) => <VacationPost key={id} post={post}/>)
            }

            {isJob ?
                <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} currentPage={currentPage}/>:
                <Pagination postsPerPage={postsPerPage} totalPosts={vacationPosts.length} paginate={paginate} currentPage={currentPage}/>
            }

            <Modal active={modalActive} setActive={setModalActive}>
                <h1>Изменение информации:</h1>
                <hr/>
                {modalError && <div className='errorHistoryInfo'>{modalError}</div>}
                <form className="modalLoginBox" onSubmit={handleClickAdd}>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize: '20px', width:'60%', marginLeft:'20%'}}>
                        <label htmlFor='sickLeave'>
                            <input
                                type='radio'
                                value={3}
                                id='sickLeave'
                                name='sickLeave'
                                onChange={handleName}
                                checked={modalName === '3'}
                            />Больничный</label>
                        <label htmlFor='vacation'>
                            <input
                                type='radio'
                                value={5}
                                id='vacation'
                                name='vacation'
                                onChange={handleName}
                                checked={modalName === '5'}
                            />Отпуск</label>
                        <label htmlFor='time'>
                            <input
                                type='radio'
                                value={6}
                                id='other'
                                name='time'
                                onChange={handleName}
                                checked={modalName === '6'}
                            />Отгул</label>
                        <label htmlFor='anotherReason'>
                            <input
                                type='radio'
                                value={7}
                                id='anotherReason'
                                name='anotherReason'
                                onChange={handleName}
                                checked={modalName === '7'}
                            />Другая причина</label>

                    </div>
                    <div className='inputVacanciesDiv'>
                        <input
                            type='date'
                            placeholder="Начало работы"
                            className="ModalInputInfoVacancies"
                            ref={vacationStart}
                            style={{'marginRight': '10px'}}
                        />
                        —   <input
                        type='date'
                        placeholder="Конец работы"
                        className="ModalInputInfoVacancies"
                        ref={vacationEnd}
                        style={{'marginRight': '10px'}}
                    />
                    </div>
                    <input
                        placeholder="Комментарий"
                        className="ModalInputInfoVacanciesComment"
                        ref={modalComment}
                    />

                    <button className="ModalButton" type="submit" disabled={isFetching}>
                        Изменить
                    </button>
                </form>
            </Modal>
        </div>
    )
}
