import React from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import {useEffect, useState} from 'react'
import './Sidebar.css'
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css'



const Sidebar = () => {
    const username = useParams()



    const [dep, setDep] = useState([]);
    const [openPath, setOpenPath] = useState([]);
    const localUse = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const findPathToNode = (tree, id) => {
            let path = [];
            const findNode = (node, id, currentPath) => {
                if (node.id === id) {
                    path = [...currentPath, node.id];
                    return true;
                }
                if (node.Subclasses && node.Subclasses.length > 0) {
                    for (let subclass of node.Subclasses) {
                        if (findNode(subclass, id, [...currentPath, node.id])) {
                            return true;
                        }
                    }
                }
                return false;
            };
            for (let node of tree) {
                if (findNode(node.department_tree_to_json, id, [])) {
                    break;
                }
            }
            return path;
        };

        const getDeps = async () => {
            const res = await axios.get('/api/department_tree_to_json/');


/*            if(~document.location.href.indexOf('/profile/')){
                const res = await axios.get('/api/user/' + username.username)
                setUser(res.data)

            }*/


            if (res.data[0].department_tree_to_json.length === 0) {
                setDep([]);
            } else {
                setDep(res.data);
                const path = findPathToNode(res.data, parseInt(localUse.departmentId)); // переменная для развертывания департамента
                console.log('Path to node:', path); // Отладочный вывод
                setOpenPath(path);
            }
        };
        getDeps();
    }, []);

    const isNodeOpen = (id) => openPath.includes(id);

    const toggleNode = (id) => {
        if (isNodeOpen(id)) {
            setOpenPath(openPath.filter(nodeId => nodeId !== id));
        } else {
            setOpenPath([...openPath, id]);
        }
    };

    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                {dep.length >= 1 ? (
                    <div className="tree">
                        <div className="treeWrapper">
                            {dep.map((node, i) => (
                                <TreeView
                                    nodeLabel={(
                                        <Link to={`/department/${node.department_tree_to_json.id}`} className='level1'>
                                            <span className="node">{node.department_tree_to_json.Name}</span>
                                        </Link>
                                    )}
                                    key={node.department_tree_to_json.Name + '|' + i}
                                    collapsed={!isNodeOpen(node.department_tree_to_json.id)}
                                    onClick={() => toggleNode(node.department_tree_to_json.id)}
                                >
                                    {node.department_tree_to_json.Subclasses.map((departments) => (
                                        <TreeView
                                            nodeLabel={(
                                                <Link to={`/department/${departments.id}`} className='depsUser' key={departments.id}>
                                                    <span className="node">{departments.Name}</span>
                                                </Link>
                                            )}
                                            key={departments.id}
                                            collapsed={!isNodeOpen(departments.id)}
                                            onClick={() => toggleNode(departments.id)}
                                        >
                                            {!!departments.Subclasses && departments.Subclasses.map((departments1) => (
                                                <TreeView
                                                    nodeLabel={(
                                                        <Link to={`/department/${departments1.id}`} className='depsUser' key={departments1.id}>
                                                            <span className="node">{departments1.Name}</span>
                                                        </Link>
                                                    )}
                                                    key={departments1.id}
                                                    collapsed={!isNodeOpen(departments1.id)}
                                                    onClick={() => toggleNode(departments1.id)}
                                                >
                                                    {!!departments1.Subclasses && departments1.Subclasses.map((departments2) => (
                                                        <Link to={`/department/${departments2.id}`} className='depsUser' key={departments2.id}>
                                                            <div style={{ paddingBottom: '8px' }}>{departments2.Name}</div>
                                                        </Link>
                                                    ))}
                                                </TreeView>
                                            ))}
                                        </TreeView>
                                    ))}
                                </TreeView>
                            ))}
                        </div>
                    </div>
                ) : ''}
            </div>
        </div>
    );
};

export default Sidebar;