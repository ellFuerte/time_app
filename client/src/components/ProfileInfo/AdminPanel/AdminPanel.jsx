import './AdminPanel.css'
import React, { useState } from "react";
import Role from "./Role/Role";
import DictionarySkills from "./DictionarySkills/DictionarySkills";
import { Link } from "react-router-dom";

export default function  AdminPanel() {

    const [modalDictionarySkills, setModalDictionarySkills] = useState(false)
       return (
               <div className="content">
                   <div className="main-content">
                       <div className='adminDiv'>
                           <div className="tiles-container">
                               <div className="tile">
                                   <Link to='/Role' className='linkReports'>Назначить роль</Link>
                               </div>
                               <div className="tile">
                                   <button className='linkReports' onClick={() => setModalDictionarySkills(true)}>Справочник</button>
                                   <DictionarySkills modalDictionarySkills={modalDictionarySkills} setModalDictionarySkills={setModalDictionarySkills}/>
                               </div>
                           </div>
                       </div>
                   </div>
           </div>
    )
}
