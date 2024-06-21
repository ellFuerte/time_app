import {Link} from "react-router-dom";
import '../RepostInfoNominations/RepostInfoNominations.css'

export default function RepostsInfoNominations({posts}) {

    return (
        <>
            <tr className='info'>
                <td className='infotableend'><Link to={`/profile/${posts.user_id}`} className='name'>{posts.Кто}</Link></td>
                <td className='infotableend'>{posts.Номинант}</td>
                <td className='infotablestart'>{posts.nominations_name}</td>
                <td className='infotableend'>{posts.date}</td>
            </tr>
        </>
    )
}