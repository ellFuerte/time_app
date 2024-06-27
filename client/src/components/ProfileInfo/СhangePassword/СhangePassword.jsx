import React, { useRef, useState } from 'react';
import Modal from "../../Templates/Modal/Modal";
import axios from "axios";


function ChangePassword({modalActivePass,setModalActivePass}) {
    const localUse = JSON.parse(localStorage.getItem('user'))
    const [er, setErr] = useState('')
    const modalOldPass = useRef()
    const modalNewPass = useRef()
    const modalNewPassAgain = useRef()

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (modalNewPass.current.value !== modalNewPassAgain.current.value) {
            setErr('Новые пароли не совпадают')
            return
        }
        const passwords = {
            userId: localUse._id,
            password: localUse.password,
            oldPassword: modalOldPass.current.value,
            newPassword: modalNewPass.current.value
        }
        try {
            await axios.put('/api/newPassword/', passwords)
            setModalActivePass(false)
            /*      localStorage.clear()
                  window.location.reload()
                  window.location.href = '/'*/
        } catch (er) {
            setErr('Старые пароли не совпадают')
        }
    }
    return (
        <Modal active={modalActivePass} setActive={setModalActivePass}>
            <h1>Изменение информации:</h1>
            <hr/>
            {er && <div className='modalError'>{er}</div>}
            <form className="modalLoginBox" onSubmit={handleChangePassword}>
                <input
                    placeholder="Старый пароль"
                    type='password'
                    className="inputChangePassword"
                    ref={modalOldPass}
                />
                <input
                    placeholder="Новый пароль"
                    type='password'
                    className="inputChangePassword"
                    ref={modalNewPass}
                    minLength='6'
                />
                <input
                    placeholder="Новый пароль ещё раз"
                    type='password'
                    className="inputChangePassword"
                    ref={modalNewPassAgain}
                    minLength='6'
                />
                <button className="ModalButtonChangePassword" type="submit" >
                    Изменить
                </button>
            </form>
        </Modal>
    );

}

export default ChangePassword;