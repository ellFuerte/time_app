import { Close } from '@material-ui/icons'
import './ModalVacancies.css'


function ModalVacancies({active, setActive, children,setShowHistory,setTriggers}) {

    const close = () => {
        setActive(false)

        if(setShowHistory===undefined && setTriggers===undefined){

        }else{
            setShowHistory(true)
            setTriggers([])
        }

    }

  return (
    <div className={active ? 'modal1 active' : 'modal1'}>
      <div className={active ? 'modalContent1 active' : 'modalContent1'} onClick={(e) => e.stopPropagation()}>
        <div className='closeModal1'><span onClick={close}><Close/></span></div>
        {children}
      </div>
    </div>
  )
}
export default ModalVacancies