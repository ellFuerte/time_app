import React, {useEffect, useRef, useState} from 'react';
import Modal from "../../Templates/Modal/Modal";
import './Skills.css'
import axios from "axios";
import {useParams} from "react-router-dom";

const Skills = ({ modalActiveSkills, setModalActiveSkills}) => {

    const skill = useRef()
    const username = useParams()
    const localUser = JSON.parse(localStorage.getItem('user'))
    const [searchTermSkills, setSearchTermSkills] = useState('');
    const [skillsAll, setAllSkills] = useState([])
    const [error, setError] = useState('')
    const [skillId, setSkillId] = useState([])
    const [userSkills, setUserSkills] = useState([])
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [selectedNumber2, setSelectedNumber2] = useState(null);


    useEffect(() => {
        const getSkills = async () => {
            const res = await axios.get('/api/user/' + username.username)
            const userId=res.data.id


            const getAllSkills = await axios.get('/api/Skills/')

            if(getAllSkills.data[0]['get_all_skills_json']===null){
                setAllSkills([])
            }else {
                setAllSkills(getAllSkills.data[0]['get_all_skills_json'])
            }

            const getUserSkills = await axios.get('/api/Skills/'+userId)

            if(getUserSkills.data[0]['get_user_skills_json']===null){
                setUserSkills([])
            }else {
                setUserSkills(getUserSkills.data[0]['get_user_skills_json'])

            }

        }
        getSkills()
    }, [])



    const handleClick = (number1) => {
            setSelectedNumber(number1)
        console.log(`You clicked number ${number1}`);
    };
    const handleClick2 = (number2) => {
        setSelectedNumber2(number2)
        console.log(`You clicked number ${number2}`);
    };


    const handleInputChangeSkills = (e) => {
        const termCities = e.target.value;
        setSearchTermSkills(termCities);
        const filtered = skillsAll.filter(skill =>
            skill.name && skill.name.toLowerCase().includes(termCities.toLowerCase())
        );
        if (termCities === '') {
            setFilteredSkills([])
        } else {
            setFilteredSkills(filtered);
        }
    }


    const handleSkillsClick = (id,name) => {
        setFilteredSkills([])
        setSkillId(id)
        setSearchTermSkills(name)
    }

    const ButtonAddSkills = async () => {
        setSelectedNumber(null)

        if (skillId.length === 0) {
            setError('Выберите умение')
        } else if (selectedNumber == null) {
            setError('Укажите уровень от 1 до 5')
        } else if (skillId.length === 0 && selectedNumber > 0) {
            setError('Выберите умение')
        } else {

            const addSkills = {
                user_id: username.username,
                skill_id: skillId,
                self_grade: selectedNumber
            }

            if(skillId.length>0 || selectedNumber !== null || skillId.length === 0 && selectedNumber > 0 )
            {
                setError('')
            }
            const getSkills = await axios.post('/api/Skills/', addSkills)

            const res = await axios.get('/api/user/' + username.username)
            const userId = res.data.id
            const getUserSkills = await axios.get('/api/Skills/' + userId)

            if (getUserSkills.data[0]['get_user_skills_json'] === null) {
                setUserSkills([])
            } else {
                setUserSkills(getUserSkills.data[0]['get_user_skills_json'])
            }
        }
    }

    const SkillDelete= async (e) => {
        const skill_id=e.target.value
        const not_active_skill = {
            is_active:false,
            skill_id:skill_id
        }
        const DeleteSkills = await axios.post('/api/Skills/',not_active_skill)
        const res = await axios.get('/api/user/' + username.username)
        const userId = res.data.id
        const getUserSkills = await axios.get('/api/Skills/' + userId)

        if (getUserSkills.data[0]['get_user_skills_json'] === null) {
            setUserSkills([])
        } else {
            setUserSkills(getUserSkills.data[0]['get_user_skills_json'])
        }
    }

    const changeGrade = async (event, id) => {
        const { name, value } = event.target;
        const changeGrade = {
            user_id: username.username,
            skill_id: id
        }
        if (name === 'gradeSelf' && value !== undefined) {
            changeGrade.newGradeSelf = value;
        } else if (name === 'gradeHead' && value !== undefined) {
            changeGrade.newGradeHead = value;
        }
        await axios.post('/api/Skills/', changeGrade);
    }




    return (

        <div>
            <Modal active={modalActiveSkills} setActive={setModalActiveSkills}>
                <h1>Навыки:</h1>
                <div className='error'>{error}</div>
                <br/>

                <div className='modalError'>

                </div>

                <hr/>
                <br/>
                <div className='flex'>
                    <div>
                        <div>
                            <label style={{fontWeight: "bold"}}>Выберите умение:</label>
                        </div>
                        <div>
                            <input
                                placeholder="Начните вводить умение"
                                ref={skill}
                                className="registerInput"
                                value={searchTermSkills}
                                onChange={handleInputChangeSkills}
                            />

                            <div>
                                {filteredSkills.length > 0 && (
                                    <div className='divSelectRegister'>
                                        {filteredSkills.map((skill, id) => (
                                            <div className='selectNameDiv' key={id} value={id} onClick={() => handleSkillsClick(skill.id,skill.name)}>
                                                {skill.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    <div style={{width: '50px'}}></div>

                    <div>
                        <div>
                            <label style={{fontWeight: "bold"}}>Оценка сотрудника:</label>
                        </div>
                        <div>
                            <div className='MainContainer'>
                                {[1, 2, 3, 4, 5].map((number1) => (
                                    <div className={`WrapperContainer ${selectedNumber === number1 ? 'selected' : ''}`}
                                        key={number1}
                                        onClick={() => handleClick(number1)}
                                    >
                                        {number1}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
{/*                    <div style={{width: '50px'}}></div>
                    <div>
                        <div>
                            <label style={{fontWeight: "bold"}}>Оценка руководителя:</label>
                        </div>
                        <div>
                            <div className='MainContainer'>
                                {[1, 2, 3, 4, 5].map((number2) => (
                                    <div className={`WrapperContainer ${selectedNumber2 === number2 ? 'selected' : ''}`}
                                         key={number2}
                                         onClick={() => handleClick2(number2)}
                                    >
                                        {number2}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>*/}

                </div>
                <br/>
                <button className="ModalButton" type="submit" onClick={ButtonAddSkills}>
                    Добавить умение
                </button>
                <br/>
                <br/>
                <div className='divreserve'>
                    <table className="skills-table">
                        <thead>
                        <tr className="skills-header">
                            <th>Навык</th>
                            <th>Оценка сотрудника</th>
                            <th>Оценка руководителя</th>
                            <th></th>

                        </tr>
                        </thead>
                        <tbody>
                        {userSkills.map((array, id) => (
                            <tr className="skill-item" key={id}>
                                <td>
                                    {array.name}
                                </td>
                                <td>

                                    <select
                                        name='gradeSelf'
                                        defaultValue={array.self_grade}
                                        onChange={(event) => changeGrade(event, array.id)}
                                    >
                                        {[1, 2, 3, 4, 5].map(number => (
                                            <option key={number} value={number}>{number}</option>
                                        ))}
                                    </select>
                               </td>
                                <td>
                                    <select
                                    name='gradeHead'
                                    defaultValue={array.head_grade}
                                    disabled={!localUser.isAdmin}
                                    onChange={(event) => changeGrade(event, array.id)}
                                >
                                    {array.head_grade === null && !localUser.isAdmin ? <option>Нет оценки</option> : ''}
                                    {array.head_grade === null ? <option>Нет оценки</option> : ''}
                                    {[1, 2, 3, 4, 5].map(number => (
                                        <option key={number} value={number}>{number}</option>
                                    ))}
                                </select>
                                </td>
                                <td><button value={array.id} className='SkillButton' onClick={SkillDelete}>Удалить</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <br/>
                <br/>
                <br/><br/>
            </Modal>
        </div>
    );
};

export default Skills;