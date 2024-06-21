import './InfoPost.css'

export default function InfoPost({post}) {


  return (
      <tr className='info'>
          <td className='infopostdate'>{post.workdate}</td>
          <td className='infotable'>{post.workstart}</td>
          <td className='infotable'>{post.workend}</td>
          <td className='infotable'>{post.worklong}</td>
          <td className='infotable'>{post.healthstart === '0'? 'Болен' : 'Здоров'}<br/><br/>{post.healthend === '1' || post.healthend === '-' ? 'Здоров' : post.healthend === '0' ? 'Болен' : ''}</td>
          <td className='infoComment'>{post.commentstart}<br/><br/>{post.commentend}</td>
      </tr>



  )
}


