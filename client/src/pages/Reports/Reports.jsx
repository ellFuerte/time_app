import React from 'react'
import {Link} from "react-router-dom";
import './Reports.css'




export default function Reports() {
    return (
        <>
                <div className="ReportsButton">
                    <Link to='/ReportsHistory' className='linkReports'>Отчет по истории</Link>
                    <br/>
                    <Link to='/ReportsNominations' className='linkReports'>Отчет по номинациям</Link>
            </div>
        </>
    )
}
