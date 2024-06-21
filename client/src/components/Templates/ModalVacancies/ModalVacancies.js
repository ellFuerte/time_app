import { Close } from '@material-ui/icons'
import './ModalVacancies.css'

function ModalVacancies({active, setActive, children}) {
  return (
    <div className={active ? 'modal1 active' : 'modal1'}>
      <div className={active ? 'modalContent1 active' : 'modalContent1'} onClick={(e) => e.stopPropagation()}>
        <div className='closeModal1'><span onClick={() => setActive(false)}><Close/></span></div>
        {children}
      </div>
    </div>
  )
}
export default ModalVacancies