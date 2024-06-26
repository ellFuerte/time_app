import React from 'react';
import Modal from "../../Templates/Modal/Modal";
import axios from "axios";


function FinishTime({modalFinishTime,setModalFinishTime,user,status}) {

        const ResetTime = async () => {
            if (status === 1) {
                const status = {
                    status: 2,
                    typework_id: 1,
                    userId: user,
                    healthEnd: '-',
                    commentEnd: '-',
                    workEnd: new Date(Date.now())
                }
                await axios.put("/api/post/", status)
            } else {
                alert("Пользователь не в работе")
        }
        setModalFinishTime(false)

    }
    return (
        <Modal active={modalFinishTime} setActive={setModalFinishTime}>
            <h1>Изменение информации:</h1>
            <hr/>
            <form className="modalLoginBox" onSubmit={ResetTime}>
                <h2>Вы хотите завершить отметку времени пользователя?</h2>
                <button className="ModalButtonDelete" type="submit">
                    Закончить
                </button>
            </form>
        </Modal>
    );
}

export default FinishTime;