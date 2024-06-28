import React, { useEffect, useState } from 'react';
import Modal from "../../Templates/Modal/Modal";
import axios from "axios";
import './VoteNominations.css'

function VoteNominations({modalActiveVote,setModalActiveVote,username}) {
    const [searchTermCities, setSearchTermCities] = useState('');
    const localUse = JSON.parse(localStorage.getItem('user'))
    const [er, setErr] = useState('')
    const [vote, setVote] = useState([])
    const [inputValues, setInputValues] = useState('');
    const [selectedInputIndex, setSelectedInputIndex] = useState(null);
    const [userVote, setUserVote] = useState([])
    const [filteredCities, setFilteredCities] = useState([]);
    const [votearray, setVotearray] = useState([])


    useEffect(() => {
    const fetchVote = async () => {
        const res = await axios.get('/api/vote/')
        setVote(res.data)
        const user = await axios.get('/api/user/')
        const sort = user.data.sort((a, b) => a.user_name.localeCompare(b.user_name))
        const mass = sort.filter(element => element.id !== username.username && element.status !== 4)
        setUserVote(mass)
    }
        fetchVote()
    }, [])



    const handleInputChangeUsers = (e, id) => {
        const index = id + 1
        const {value} = e.target;
        setInputValues(prev => ({...prev, [index]: value}));
        setSelectedInputIndex(index);

        const termCities = e.target.value;
        setSearchTermCities(termCities);
        const filtered = userVote.filter(city =>
            city.user_name && city.user_name.toLowerCase().includes(termCities.toLowerCase())
        );
        if (termCities === '') {
            setFilteredCities([])
        } else {
            setFilteredCities(filtered);
        }
    }

    const clickVote = (e, id, user_name) => {
        setFilteredCities([])
        console.log('index=', id, user_name)
        setInputValues(prev => ({...prev, [selectedInputIndex]: user_name}));
        e.preventDefault();
        const data = id.toString();
        const arr = data.split("_");
        if (arr[0] === '' || arr[1] === '') {
            return;
        } else {
            const str = arr[1].toString();
            const str1 = arr[0].toString();

            const existingIndex = votearray.findIndex(item => item.split("_")[0] === str1);
            if (existingIndex !== -1) {
                const newArray = [...votearray];
                newArray[existingIndex] = data;
                console.log('Массив с обновленным элементом:', newArray);
                setVotearray(newArray);
                return;
            }
        }

        const votearr = [...votearray];
        votearr.push(data);

        const newArray = votearr.filter(element => element !== "");
        console.log('newArray=', newArray);
        setVotearray(newArray);

    };

    const button = () => {
        if (votearray.length === 0) {
            setErr('Выберите участников номинации')
        } else {
            votearray.forEach(async (vote) => {


                    const arr = vote.split("_")

                    const voteUser = {
                        user_id: localUse._id,
                        vote_for_user: arr[1],
                        nominations_id: arr[0]
                    }
                    await axios.post('/api/vote/', voteUser)
                }
            )
            setModalActiveVote(false)
        }
    }

    return (
        <Modal active={modalActiveVote} setActive={setModalActiveVote}>
            <h1>Номинации:</h1>
            {er && <div className='modalError'>{er}</div>}
            <hr/>
            <div className='div'>
                <div>
                    {
                        vote.map((vote, id) =>

                            <label key={id} htmlFor={vote.id}>
                                <h3 className='inputVote'>{vote.nominations_name}</h3>
                                {vote.description}
                            </label>
                        )}
                </div>
                <div className='di'>
                    {vote.map((vote, id) => (
                        <div key={id + 1} style={{position: 'relative'}}>
                            <input
                                onChange={(e) => handleInputChangeUsers(e, id)}
                                value={inputValues[id + 1] || ''}
                                className='select'
                            />
                            {selectedInputIndex === id + 1 && filteredCities.length > 0 && (
                                <div className='divVoteNomination'>
                                    {filteredCities.map((city, cityId) => (
                                        <div
                                            className='selectNameDiv'
                                            key={cityId}
                                            onClick={(e) => clickVote(e, selectedInputIndex + "_" + city.id, city.user_name)}>
                                            {city.user_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
            <button className="button" type="submit" onClick={button}>Проголосовать</button>
        </Modal>
    );

}

export default VoteNominations;