import React, { useEffect, useState } from 'react';
import axios from "axios";
import './Role.css'

function Roles() {

    const [roleId, setRoleId] = useState(1);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTermUsers, setSearchTermUsers] = useState('');
    const [userId, setUserId] = useState('');
    const [allUsers, setAllUsers] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRoles = await axios.get('/api/roles/');
                const rolesData = resRoles.data[0].get_roles;
                setRoles(rolesData);

                const resUsers = await axios.get('/api/user/');
                setUsers(resUsers.data);
                setAllUsers(resUsers.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleInputChangeUsers = (e) => {
        const termCities = e.target.value;

        if (termCities.length === 0) {
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

    const handleChange = (e) => {
        setRoleId(e.target.value)
    }

    const search = (e) => {
        const value = e.target.value;

        if (value.length === 0) {
            setUsers(allUsers)
        } else {
            setUsers(users.filter(user => {
                return user.user_name.toLowerCase().includes(value.toLowerCase());
            }));
        }
    };

    const addRole = async (id, role_id) => {
        const addRole = {
            user_id: userId || id,
            role_id: (role_id===undefined ? roleId  : role_id )

        }
        await axios.post('/api/roles/', addRole);
        setSearchTermUsers('')
        setUserId('')


    }


    return (
        <div className="ReportsButton">
            <div>
            <table className="skills-table">
                <thead>
                <tr className="skills-header">
                    <th>
                        <div><label>Имя сотрудника</label></div>
                        <div>
                        <input className="ModalInputUpdate" type="text" value={searchTermUsers} onChange={handleInputChangeUsers}/>

                        {filteredUsers.length > 0 && (
                            <div className='divInputRole1'>
                                {filteredUsers.slice(0,10).map((user, id) => (
                                    <div className='selectNameDiv' key={id}
                                         onClick={() => handleUserClickCities(user.user_name, user.id)}>
                                        {user.user_name}
                                    </div>
                                ))}
                            </div>
                        )}

                        </div>
                    </th>
                    <th>
                        <div><label>Роль</label></div>
                        <select className="ModalInputUpdate"
                                onChange={handleChange}>
                        {
                            roles.map((role, index) => (
                                <option key={index} value={role.id}>
                                    {role.name}
                                </option>
                            ))
                        }
                    </select>
                    </th>

                    <th>
                        <div><label>Поиск</label></div>
                        <input className="ModalInputUpdate" onChange={search}/>
                    </th>
                </tr>
                </thead>
            </table>
            </div>
            <div>
            <div style={{height: '30px',paddingLeft:'15px'}}>
                {
                    userId ?
                    <button onClick={addRole} className="AddRole">
                        Добавить
                    </button>
                    : ''
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
                    {users.map((user, id) => (
                        <tr className="skill-item" key={id}>
                            <td>
                                {user.user_name}
                            </td>
                            <td>
                                <select defaultValue={user.role_id} onChange={(e)=>addRole(user.id,e.target.value)} className="ModalInput">
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                            </td>
                        </tr>
                    ))
                    }
                    <tbody>
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
}

export default Roles;