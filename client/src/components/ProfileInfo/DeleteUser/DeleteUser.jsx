import React from 'react';
import Modal from "../../Templates/Modal/Modal";
import axios from "axios";


function DeleteUser({modalActiveDelete,setModalActiveDelete,username,user}) {
    const handleDelete = async (e) => {
        e.preventDefault()

        const newPost = {
            userId: username.username,
            healthEnd: 1,
            status: 4
        }
        try {
            await axios.put('/api/deluser/', newPost)

            setModalActiveDelete(false)
            window.location.href = `/profile/${user.id}`
        } catch (error) {
            console.log(error);
        }
    }
        return (
            <div>
                <Modal active={modalActiveDelete} setActive={setModalActiveDelete}>
                    <h1>Изменение информации:</h1>
                    <hr/>
                    <form className="modalLoginBox" onSubmit={handleDelete}>
                        <h2>Пользователь будет удален</h2>
                        <button className="ModalButtonDelete" type="submit">
                            Удалить
                        </button>
                    </form>
                </Modal>
            </div>
        );

}

export default DeleteUser;