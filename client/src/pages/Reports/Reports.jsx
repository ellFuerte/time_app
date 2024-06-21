import React from 'react'
import Topbar from '../../components/Topbar/Topbar'
import {Link} from "react-router-dom";
import './Reports.css'



export default function Reports() {
    return (
        <>
            <Topbar/>
            <div className='Reports'>
                <div className="ReportsContainer">
                    <br/>
                    <Link to='/ReportsHistory' className='linkReports'>Отчет по истории</Link>
                    <br/>
                    <Link to='/ReportsNominations' className='linkReports'>Отчет по номинациям</Link>
            </div>
            </div>
        </>
    )
}
