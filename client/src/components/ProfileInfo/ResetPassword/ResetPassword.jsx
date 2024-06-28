import React from 'react';
import Modal from "../../Templates/Modal/Modal";
import axios from "axios";


function ResetPassword({modalResetPassword,setModalResetPassword,username}) {
    const handleResetPassword = async () => {
        const resetPassword = {
            userId: username,
            newPassword: 'qwerty123'
        }
            await axios.put('/api/resetPassword/', resetPassword)
            setModalResetPassword(false)
    }

    return (
            <Modal active={modalResetPassword} setActive={setModalResetPassword}>
                <h1>Изменение информации:</h1>
                <hr/>
                    <h2>Новый пароль будет: qwerty123</h2>
                    <button className="ModalButtonRePasswordUser" type="submit" onClick={handleResetPassword}>
                        Сбросить
                    </button>
            </Modal>
    );

}

export default ResetPassword;