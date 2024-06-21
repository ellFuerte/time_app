import { Close } from '@material-ui/icons'
import './Modal.css'

 function Modal({active, setActive, children}) {
  return (
    <div className={active ? 'modal active' : 'modal'} >
      <div className={active ? 'modalContent active' : 'modalContent'} onClick={(e) => e.stopPropagation()}>
        <div className='closeModal'><span onClick={() => setActive(false)}><Close/></span></div>
        {children}
      </div>
    </div>
  )
}
export default Modal