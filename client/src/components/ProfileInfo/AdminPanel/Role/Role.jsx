import React from 'react';
import Modal from "../../../Templates/Modal/Modal";


function Role({modalRole,setModalRole}) {
    const handleRole = async () => {

        setModalRole(false)

    }
    return (
        <div>
            <Modal active={modalRole} setActive={setModalRole}>
                <h1>Назначить роль</h1>
                <hr/>
                    <h2>Назначить роль</h2>
                    <button className="ModalButtonDelete" type="submit" onClick={handleRole}>
                        Назначить роль
                    </button>
            </Modal>
        </div>
    );

}

export default Role;