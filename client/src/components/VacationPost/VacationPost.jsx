import './VacationPost.css'

export default function VacationPost({post}) {


  return (
      <tr>

        <td className="vacationpost">{post.workdate}</td>
        <td className="vacationpost">{post.worked}</td>
        <td className="vacationpost">{post.work.replace(/(^|\s)0/g, "$1")}</td>
        <td className="vacationpost">{post.typework_id === '5' ? 'Отпуск' :post.typework_id === '3' ? 'Больничный' :post.typework_id === '7' ? 'Другая причина':post.typework_id === '6' ? 'Отгул':''}</td>
        <td className="vacationpostComment">{post.commentstart}</td>

      </tr>
  )
}



