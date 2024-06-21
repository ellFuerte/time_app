import React from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {useEffect, useState} from 'react'
import './Sidebar.css'
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css'


const Sidebar = () => {
    const [dep, setDep] = useState([])
    // загрузка всех департаментов

    useEffect(() => {

        const getDeps = async () => {
            const res = await axios.get('/api/department_tree_to_json/')
            if (res.data[0].department_tree_to_json.length === 0) {
                setDep([])
            } else {
                setDep(res.data)
            }
        }
        getDeps()
    }, [])


    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                {dep.length >= 1 ? <div className="tree">
                        <div className="treeWrapper">

                            {dep.map((node, i) => {

                                const label = <Link to={`/department/${node.department_tree_to_json.id}`}
                                                    className='level1'>

                                    <span className="node">{node.department_tree_to_json.Name}</span></Link>

                                return (

                                    <TreeView key={node.department_tree_to_json.Name + '|' + i} nodeLabel={label}
                                              defaultCollapsed={false}>
                                        {node.department_tree_to_json.Subclasses.map((departments) => (

                                            <TreeView nodeLabel={(
                                                <Link to={`/department/${departments.id}`} className='depsUser'
                                                      key={departments.id}>
                                                    <span className="node">{departments.Name}</span></Link>)}
                                                      key={departments.id} defaultCollapsed={true}>

                                                {!!departments.Subclasses && departments.Subclasses.map((departments1) => (
                                                    <TreeView nodeLabel={(

                                                        <Link to={`/department/${departments1.id}`} className='depsUser'
                                                              key={departments1.id}>

                                                            <span className="node">{departments1.Name}</span>

                                                        </Link>
                                                    )} key={departments1.id} defaultCollapsed={true}>

                                                        {!!departments1.Subclasses && departments1.Subclasses.map((departments2) => (

                                                            <Link to={`/department/${departments2.id}`} className='depsUser'
                                                                  key={departments2.id}>

                                                                <div
                                                                    style={{paddingBottom: '8px'}}>{departments2.Name}
                                                                </div>

                                                            </Link>
                                                        ))}
                                                    </TreeView>
                                                ))}
                                            </TreeView>
                                        ))}
                                    </TreeView>
                                );
                            })}
                        </div>
                    </div>
                    : ''
                }
            </div>
            <div>
            </div>
        </div>
    )
}
export default Sidebar;