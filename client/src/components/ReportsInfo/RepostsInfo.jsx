import './RepostsInfo.css'
import {Link} from "react-router-dom";

export default function RepostsInfo({posts}) {

    return (
        <>
        <tr className='info'>
            <td className='number'><Link to={`/profile/${posts.id}`} className='name'>{posts.user_name}</Link></td>
            <td className='infotablestart'>{posts.workstart}</td>
            <td className='infotableend'>{posts.workend}</td>
            <td className='RepostsLong'>{posts.worklong}</td>
            <td className='infotableComment'>{posts.comment}</td>
        </tr>
        </>
    )
}