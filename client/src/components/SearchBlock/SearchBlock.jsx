import {Link} from 'react-router-dom'
import './SearchBlock.css'
import {useEffect, useState} from "react";
import axios from "axios";


const usersStatuses = {0: '', 1: 'start', 2: 'end', 3: 'sick_leave', 4: 'deleted' ,5: 'vacation', 6: 'time_off', 7: 'other'}
function findStatus(k){
    for(let i in usersStatuses){
        if(i == k){
            return usersStatuses[i]
        }
    }
}

export default function SearchBlock({user}) {
    const [nominations, setNominations] = useState([])
    const [admin, setAdmin] = useState()
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [dateStart, setDateStart] = useState()
    const [dateEnd, setDateEnd] = useState()

    const localUser = JSON.parse(localStorage.getItem('user'))

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

    // Проверка, если пользователь в отпуске или на больничном, то вывод даты начала и конца
    useEffect(() => {

        const fetchUser = async () => {
            const users = await axios.get('/api/user/' + user.id)
            const res = await axios.get('/api/vacation?id=' + user.id);
            const post = await axios.get('/api/post?type=1&id=' + user.id);
            setNominations(users.data.nomination_status)

            if (users.data.isadmin !== true) {
                setAdmin('');
            } else {
                setAdmin('*');
            }


            if (res.data.length === 0) {
                setDateStart('')
                setDateEnd('')
            } else {
                setDateStart(res.data[0].workdate)
                setDateEnd(res.data[0].worked)
            }



            if (post.data.length === 0) {
                setDate('')
                setTime('')
            } else {
                setDate(post.data[0].workdate)
                setTime(post.data[0].workend)
            }
        }

        if (user.status === 1 || user.status === 2 || user.status === 3
            || user.status === 5 || user.status === 6 || user.status === 7)
        {
            fetchUser()
        }

    }, [user.id])


    const images = {
        '1': { src: '../images/1.png', title: 'Тучка' },
        '2': { src: '../images/2.png', title: 'Аркадий Паровозов' },
        '3': { src: '../images/3.png', title: 'И так сойдет' },
        '4': { src: '../images/4.png', title: 'Портной' },
        '5': { src: '../images/5.png', title: 'Мама обезьянка' },
        '6': { src: '../images/6.png', title: 'Кот Матроскин' },
        '7': { src: '../images/7.png', title: 'Крот' },
        '8': { src: '../images/8.png', title: 'Птица говорун(голосуем только среди дежурных)' },
        '9': { src: '../images/9.png', title: 'Хома(Голосуем среди коллег из внедрения)' },
        '10': { src: '../images/10.png', title: 'Симка и нолик' }
    };


    return (
        <>
            <div className="searchBlockContainer">
                    <Link to={`/profile/${user.id}`} className='name'
                          onClick={() => window.location.href = `/profile/${user.id}`}>
                        <div className={'employee ' + (findStatus(user.status))}>
                            <div className="angry-grid">
                                <div id="item-0">
                                    <span className='searchName'>{user.user_name}{localUser.isAdmin ? admin:''}</span>
                                </div>
                                <div id="item-1">

                                    {user.status === 5 && <div className='vacationText'>Отпуск:{dateStart}-{dateEnd}</div>}
                                    {user.status === 6 && <div className='vacationText'>Отгул:{dateStart}-{dateEnd}</div>}
                                    {user.status === 7 && <div className='vacationText'>Другая причина:{dateStart}-{dateEnd}</div>}
                                    {user.status === 3 && <div className='vacationText'>Больничный:{dateStart}-{dateEnd}</div>}
                                    {user.status === 2 && <div className='vacationText'>{date} {time}</div>}

                                </div>
                                <div id="item-2">

                                    {Object.keys(images).map((key, id) => (
                                        (user.nomination_status === key || user.nomination_status === parseInt(key) || nominations===key || nominations===parseInt(key)) &&

                                        <img
                                            key={id}
                                            src={images[key].src}
                                            title={images[key].title}
                                            alt={`Image for ${key}`}
                                        />

                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
            </div>
        </>
    )
}


