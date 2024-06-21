import './MessagePost.css'
import {Link} from "react-router-dom";

const MessagePost =({user})=> {
    return (
        <>
        <Link to={`/`} className='LinkMessage'> <div className='messageContent'>{user.user_name}</div></Link>
        </>
    )
}

export default MessagePost;