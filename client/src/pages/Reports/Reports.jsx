import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import './Reports.css'
import axios from "axios";




export default function Reports() {

    const localUser = JSON.parse(localStorage.getItem('user'));
    const [userRole, setUserRole] = useState(null);
    const [admin, setAdmin] = useState([]);
    const [accessData, setAccessData] = useState([]);



    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get('/api/user/' + localUser._id);
                const roleId = response.data.role_id;
                setUserRole(roleId);
                setAdmin(response.data.isadmin)

                // Запрашиваем разрешения только после того, как установили роль
                const res = await axios.get('/api/permission/' + roleId);

                setAccessData(res.data[0].get_permissions);


            } catch (error) {
                console.error('Error fetching user or permissions:', error);
            }
        };

        getUser();
    }, [localUser._id]);


    const hasAccess = (toolId) => {
        return accessData.some(item => item.tool_id === toolId && item.is_accessible);
    };

    return (
        <div className="ReportsButton">
            {userRole !== null && (
                <>
                    {admin ? (
                        <>
                            <Link to='/ReportsHistory' className='linkReports'>Отчет по истории</Link>
                            <br />
                            <Link to='/ReportsNominations' className='linkReports'>Отчет по номинациям</Link>
                        </>
                    ) : (
                        <>
                            {hasAccess(10) && (
                                <>
                                    <Link to='/ReportsHistory' className='linkReports'>Отчет по истории</Link>
                                    <br />
                                </>
                            )}
                            {hasAccess(11) && (
                                <Link to='/ReportsNominations' className='linkReports'>Отчет по номинациям</Link>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};
