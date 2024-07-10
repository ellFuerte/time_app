import React  from 'react';
import Modal from "../../Templates/Modal/Modal";
import axios from "axios";


function DeleteUser({modalActiveDelete,setModalActiveDelete,user}) {


    const handleDelete = async () => {

        const newPost = {
            userId: user.id,
            status: 4
        }

            await axios.post('/api/deluser/', newPost)
            window.location.href = `/profile/${user.id}`
    }

        return (
                <Modal active={modalActiveDelete} setActive={setModalActiveDelete}>
                    <h1>Изменение информации:</h1>
                    <hr/>
                        <h2>Пользователь будет удален</h2>
                        <button className="ModalButtonDelete" type="submit" onClick={handleDelete}>
                            Удалить
                        </button>
                </Modal>
        );

}

export default DeleteUser;