import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Create } from '@material-ui/icons'
import ModalVacancies from "../../../Templates/ModalVacancies/ModalVacancies";

function DictionarySkills() {

    const [getSkills , setSkills] = useState([])
    const [getAllSkills,setAllSkills] = useState([])
    const [nameSkill,setNameSkill] = useState([])
    const [descriptionSkill,setDescriptionSkill] = useState([])
    const [modalVacations, setModalVacations] = useState(false)

    useEffect(() => {
        const Skills = async () => {
            try {
                const resSkills = await axios.get('/api/Skills/')
                if(resSkills.data[0].get_all_skills_json!==null) {
                    setSkills(resSkills.data[0].get_all_skills_json)
                    setAllSkills(resSkills.data[0].get_all_skills_json)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        Skills();
    }, []);



    const nameSkillValue = async (e) => {
        setNameSkill(e.target.value)
    }
    const DescriptionSkillValue = async (e) => {
        setDescriptionSkill(e.target.value)
    }

    const addSkills = async () => {
        const addSkills = {

        skill_name:nameSkill,
        skill_description:descriptionSkill

        }

        await axios.post('/api/Skills/', addSkills);
        const resSkills = await axios.get('/api/Skills/')
        setSkills(resSkills.data[0].get_all_skills_json)
    }

    const search = (e) => {
        const value = e.target.value;

        if (value.length === 0) {
            setSkills(getAllSkills)
        } else {
            setSkills(getSkills.filter(skills => {
                return skills.name.toLowerCase().includes(value.toLowerCase());
            }));
        }
    };


    return (
        <div className="ReportsButton">
            <div>
                <table className="skills-table">
                    <thead>
                    <tr className="skills-header">
                        <th>
                            <div><label>Добавить умение</label></div>
                            <div>
                                <input className="ModalInputUpdate" type="text" onChange={nameSkillValue}/>
                            </div>
                        </th>
                        <th>
                            <div><label>Описание</label></div>
                            <div>
                                <input className="ModalInputUpdate" type="text" onChange={DescriptionSkillValue}/>
                            </div>
                        </th>
                        <th>
                            <div><label>Поиск</label></div>
                            <input className="ModalInputUpdate" onChange={search}/>
                        </th>
                    </tr>
                    <div style={{height: '30px',paddingLeft:'15px'}}>
                    {
                        nameSkill.length>0 && descriptionSkill.length>0 ?

                            <button className="AddRole" onClick={addSkills}>
                                Добавить
                            </button>

                        :''
                    }
                    </div>
                    </thead>
                </table>
                <table className="skills-table">
                    <thead>
                    <tr className="skills-header">
                        <th>Умение</th>
                        <th>Описание</th>
                        <th>Редактирование</th>
                    </tr>
                    </thead>
                    {getSkills.map((skills, id) => (
                        <tr className="skill-item" key={id}>
                            <td>
                                {skills.name}
                            </td>
                            <td>
                                {skills.description}
                            </td>
                            <td>
                                <Create style={{cursor: 'pointer', fontSize: '16px', paddingLeft: '5px'}} onClick={()=>setModalVacations(true)}/>
                            </td>
                        </tr>
                    ))
                    }
                    <ModalVacancies active={modalVacations} setActive={setModalVacations}/>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DictionarySkills;