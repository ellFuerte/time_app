import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

function Statistics () {
    const localUser = JSON.parse(localStorage.getItem('user'))
    const [countAll_users, setCountAll_users] = useState(0)
    const [countWorked_today, setCountWorked_today] = useState(0)
    const [countWorked_yesterday, setCountWorked_yesterday] = useState(0)
    const [countSickLeave_today, setCountSickLeave_today] = useState(0)
    const [countSick_yesterday, setCountSick_yesterday] = useState(0)
    const [countVacation_today, setCountVacation_today] = useState(0)
    const [countVacation_yesterday, setCountVacation_yesterday] = useState(0)
    const [typeworkColors, setTypeworkColors] = useState([]);
    useEffect(() => {
        const typework = async () => {
            const res = await axios.get('/api/typework_status/')
            setTypeworkColors(res.data.user_typework.map(item => item.color));
        }

        const get_statistics_all_users = async () => {
            const getUsers = {
                id: localUser._id
            }
            if (localUser.isAdmin === true) {
                const res = await axios.post('/api/get_statistics_all_users', getUsers)


                if(res.data[0]['get_statistics_all_users'][0]['all_users']===null){
                    res.data[0]['get_statistics_all_users'][0]['all_users']=0
                }else{
                    setCountAll_users(res.data[0]['get_statistics_all_users'][0]['all_users'].length)
                }

                if(res.data[0]['get_statistics_all_users'][0]['not_working_today']===null){
                    res.data[0]['get_statistics_all_users'][0]['not_working_today']=0
                }else{
                    setCountWorked_today(res.data[0]['get_statistics_all_users'][0]['not_working_today'].length)
                }

                if(res.data[0]['get_statistics_all_users'][0]['not_worked_yesterday']===null){
                    res.data[0]['get_statistics_all_users'][0]['not_worked_yesterday']=0
                }else{
                    setCountWorked_yesterday(res.data[0]['get_statistics_all_users'][0]['not_worked_yesterday'].length)
                }


                if(res.data[0]['get_statistics_all_users'][0]['sick_today']===null){
                    res.data[0]['get_statistics_all_users'][0]['sick_today']=0
                }else {
                    setCountSickLeave_today(res.data[0]['get_statistics_all_users'][0]['sick_today'].length)
                }


                if(res.data[0]['get_statistics_all_users'][0]['sick_yesterday']===null){
                    res.data[0]['get_statistics_all_users'][0]['sick_yesterday']=0
                }else{
                    setCountSick_yesterday(res.data[0]['get_statistics_all_users'][0]['sick_yesterday'].length)
                }

                if(res.data[0]['get_statistics_all_users'][0]['vacation_today']===null){
                    res.data[0]['get_statistics_all_users'][0]['vacation_today']=0
                }else{
                    setCountVacation_today(res.data[0]['get_statistics_all_users'][0]['vacation_today'].length)
                }

                if(res.data[0]['get_statistics_all_users'][0]['vacation_yesterday']===null){
                    res.data[0]['get_statistics_all_users'][0]['vacation_yesterday']=0
                }else{
                    setCountVacation_yesterday(res.data[0]['get_statistics_all_users'][0]['vacation_yesterday'].length)
                }
            }
        }
        typework()
        get_statistics_all_users()
}, [])

        return (
            <div className="topbarCenter">
                {localUser.isAdmin ?
                    <div className='statistics'>
                        <Link className="topbarLinkCount" style={{color: typeworkColors[0]}} onClick={() => window.location.href = `/all_users/`}
                              title="Всего сотрудников">{countAll_users}</Link> /

                        <Link className="topbarLinkCount" style={{color: typeworkColors[1]}} onClick={() => window.location.href = `/not_working_today/`}
                              title="Сегодня не работают">{countWorked_today}</Link> /

                        <Link className="topbarLinkCount" style={{color: typeworkColors[1]}} onClick={() => window.location.href = `/not_worked_yesterday/`}
                              title="Вчера не работали">{countWorked_yesterday}</Link> /

                        <Link className="topbarLinkCount" style={{color: typeworkColors[2]}} onClick={() => window.location.href = `/sick_today/`}
                              title="Сегодня болеют">{countSickLeave_today}</Link> /

                        <Link className="topbarLinkCount" style={{color: typeworkColors[2]}} onClick={() => window.location.href = `/sick_yesterday/`}
                              title="Вчера болели">{countSick_yesterday}</Link> /

                        <Link className="topbarLinkCount" style={{color: typeworkColors[5]}} onClick={() => window.location.href = `/vacation_today/`}
                              title="Сегодня в отпуске">{countVacation_today}</Link>/

                        <Link className="topbarLinkCount" style={{color: typeworkColors[5]}} onClick={() => window.location.href = `/vacation_yesterday/`}
                              title="Вчера в отпуске">{countVacation_yesterday}</Link>
                    </div> : ''
                }
            </div>
        )
}

export default Statistics;