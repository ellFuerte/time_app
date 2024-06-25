import './AdminPanel.css'
import Topbar from '../Topbar/Topbar'
import Sidebar from "../Sidebar/Sidebar";
import {Link} from "react-router-dom";
import React from "react";


export default function  AdminPanel() {

       return (
               <div className="content">

                   <div className="main-content">
                       <div className='adminDiv'>
                           <div className="tiles-container">
                               <div className="tile">
                                  <Link to='/' className='linkReports'>Вакансии</Link>
                               </div>
                               <div className="tile">
                                   <Link to='/' className='linkReports'>Назначить роль</Link>
                               </div>
                               <div className="tile">
                                   <Link to='/' className='linkReports'>Справочник</Link>
                               </div>
                           </div>
                       </div>
                   </div>
           </div>
    )
}
