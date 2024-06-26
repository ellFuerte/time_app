import './AdminPanel.css'
import React, { useState } from "react";
import Role from "./Role/Role";
import DictionarySkills from "./DictionarySkills/DictionarySkills";

export default function  AdminPanel() {
    const [modalRole, setModalRole] = useState(false)
    const [modalDictionarySkills, setModalDictionarySkills] = useState(false)
       return (
               <div className="content">
                   <div className="main-content">
                       <div className='adminDiv'>
                           <div className="tiles-container">
                               <div className="tile">
                                   <button className='linkReports' onClick={() => setModalRole(true)}>Назначить роль</button>
                                   <Role modalRole={modalRole} setModalRole={setModalRole}/>
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
