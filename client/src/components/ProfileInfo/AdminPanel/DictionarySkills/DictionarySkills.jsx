import React from 'react';
import Modal from "../../../Templates/Modal/Modal";



function DictionarySkills({modalDictionarySkills,setModalDictionarySkills}) {
    const handleRole = async () => {

        setModalDictionarySkills(false)

    }
    return (
        <div>
            <Modal active={modalDictionarySkills} setActive={setModalDictionarySkills}>
                <h1>Справочник</h1>
                <hr/>
                <h2>Справочник</h2>
                <button className="ModalButtonDelete" type="submit" onClick={handleRole}>
                    Добавить
                </button>
            </Modal>
        </div>
    );

}

export default DictionarySkills;