import './AdminPanel.css'
import React from "react";
import { Link } from "react-router-dom";

export default function  AdminPanel() {

       return (
               <div className="content">
                   <div className="main-content">
                       <div className='adminDiv'>
                           <div className="tiles-container">
                               <div className="tile">
                                   <Link to='/Role' className='linkReports'>Назначить роль</Link>
                               </div>
                               <div className="tile">
                                   <Link to='/DictionarySkills' className='linkReports'>Справочник умений</Link>
                               </div>
                           </div>
                       </div>
                   </div>
           </div>
    )
}
