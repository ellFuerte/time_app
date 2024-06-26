import React, { useEffect, useState } from 'react';
import Modal from "../../Templates/Modal/Modal";
import axios from "axios";


function AddNomination({modalVote,setModalVote,username}) {

    const [checkedItems, setCheckedItems] = useState({});
    const [check, setCheck] = useState();
    const [er, setErr] = useState('')
    const [user, setUser] = useState([])
    const [vote, setVote] = useState([])


    useEffect(() => {
        const fetchVote = async () => {
            const rez = await axios.get('/api/vote/')
            const res = await axios.get('/api/user/' + username.username)
            setUser(res.data)
            setVote(rez.data)

        }

        fetchVote()

    }, [])




    const secureButton = async () => {

        const res = await axios.get('/api/user/' + username.username)

        const addNomination = {
            userId: username.username,
            id_nomination: check
        }

        if (check === undefined) {
            setErr('Выберите номинацию')
        } else {
            await axios.post('/api/vote/', addNomination)
            setModalVote(false)
            window.location.reload()
        }
    }


    const clearSecureButton = async () => {
        const res = await axios.get('/api/user/' + username.username)
        const addNomination = {
            userId: username.username,
            id_nomination: null
        }

        await axios.post('/api/vote/', addNomination)
        setModalVote(false)
        window.location.reload()

    }



    const inputClick = (event, voteId) => {
        const {id, checked} = event.target
        if (checked) {
            setCheckedItems(checked)
        } else {
            setCheckedItems(null)
        }
        setCheck(event.target.value)

        setCheckedItems(prevState => ({
            ...prevState,
            [id]: checked,
        }))

        setUser(prevState => ({
                ...prevState,
                nomination_status: checked ? voteId : null
            }
        ))
    }



    return (

        <Modal active={modalVote} setActive={setModalVote}>
            <h1>Закрепить номинацию:</h1>
            {er && <div className='modalError'>{er}</div>}
            <hr/>
            <div>
                <div className='voteContainer'>
                    {vote.map((vote, id) => (
                        <div key={id} className="voteItem">
                            <label key={id} htmlFor={vote.id} className="inputVote">

                                <input
                                    type='checkbox'
                                    id={vote.id}
                                    value={vote.id}
                                    onChange={(e) => inputClick(e, vote.id)}
                                    checked={user.nomination_status === vote.id}
                                />

                                {vote.nominations_name}{' '}

                                <img src={`../images/${vote.id}.png`} alt={`Image for ${vote.nominations_name}`} className='images'/>

                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <button className="button" type="submit"  onClick={secureButton}>Закрепить</button>
            <button className="button" type="submit"  onClick={clearSecureButton}>Снять номинацию</button>
        </Modal>
    );

}

export default AddNomination;