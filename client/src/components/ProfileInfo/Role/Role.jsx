import React, { useEffect, useState } from 'react';
import Modal from "../../Templates/Modal/Modal";
import axios from "axios";
import './Role.css'

function Role({ modalActiveRole, setModalActiveRole, username }) {
    const [roles, setRoles] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRoles = await axios.get('/api/roles/');
                const rolesData = resRoles.data[0].get_roles;
                setRoles(rolesData);

                const res = await axios.get('/api/user/' + username.username);
                const userData = res.data;

                // Установка начального состояния checkedItems на основе user.role_id
                setCheckedItems({
                    [userData.role_id]: true
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [username]);

    const inputClickRole = async (event) => {
        const { id, checked } = event.target;

        console.log('id =', id);
        console.log('username =', username.username);

        // Обновление состояния checkedItems для выбора только одного флажка
        setCheckedItems({
            [id]: checked
        });

        const addRole = {
            user_id: username.username,
            role_id: id
        };

        await axios.post('/api/roles/', addRole);
    };

    return (
        <Modal active={modalActiveRole} setActive={setModalActiveRole}>
            <h1>Назначить роль:</h1>
            <hr />
            <div>
                <div className='voteContainer'>
                    {roles.map((role, id) => (
                        <div key={id} className="voteItem">
                            <label key={id} className="inputVote">
                                <input
                                    type='checkbox'
                                    id={role.id}
                                    value={role.id}
                                    checked={!!checkedItems[role.id]}
                                    onChange={(e) => inputClickRole(e, role.id)}
                                />
                                {role.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}

export default Role;