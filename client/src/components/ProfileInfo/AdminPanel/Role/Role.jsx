import React, { useEffect, useState } from 'react';
import axios from "axios";
import Role from './Role.css'
function Roles() {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTermUsers, setSearchTermUsers] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRoles = await axios.get('/api/roles/');
                const rolesData = resRoles.data[0].get_roles;
                setRoles(rolesData);

                const resUsers = await axios.get('/api/user/');
                setUsers(resUsers.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleInputChangeUsers = (e) => {
        const termCities = e.target.value;

        if(termCities.length===0){
            setUserId('')
        }
        setSearchTermUsers(termCities);

        if (termCities === '') {
            setFilteredUsers([]);
            return;
        }

        const filtered = users.filter(user =>
            user.user_name && user.user_name.toLowerCase().includes(termCities.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleUserClickCities = (user_name, id) => {
            setSearchTermUsers(user_name)
            setFilteredUsers([])
            setUserId(id)
    }

    const addRole = () => {
    setUserId('')
    setSearchTermUsers('')
    }


    return (
        <div className="ReportsButton">
            <div style={{ display: 'flex', gap: '200px' }}>
                <div className='RoleWrapper'>
                    <label>Имя сотрудника</label>
                    <div className='inputRole'>
                        <input className="ModalInputUpdate" type="text"
                               value={searchTermUsers}
                               onChange={handleInputChangeUsers} />

                        {filteredUsers.length > 0 && (
                            <div className='divInputRole1'>
                                {filteredUsers.map((user, id) => (
                                    <div className='selectNameDiv' key={id} onClick={() => handleUserClickCities(user.user_name, user.id)}>
                                        {user.user_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label>Роль</label>
                    <select className="ModalInputUpdate">
                        {roles.map((role, index) => (
                            <option key={index} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ height: '30px'}}>
                {userId ?
                    <button onClick={addRole} className="AddRole">
                        Добавить
                    </button>
                    :''
                }
            </div>
            <div>
                <table className="skills-table">
                    <thead>
                    <tr className="skills-header">
                        <th>Имя</th>
                        <th>Роль</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tr className="skill-item">
                        <td>

                        </td>
                        <td>
                            <select>
                                <option>

                                </option>
                            </select>
                        </td>
                        <td><button className='SkillButton'>Удалить</button></td>
                    </tr>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Roles;