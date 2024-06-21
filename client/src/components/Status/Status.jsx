import {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import {CircularProgress} from '@material-ui/core'
import Modal from '../Templates/Modal/Modal'
import './Status.css'

const moment = require('moment');
const usersStatuses = {
  0: '',
  1: 'start',
  2: 'end',
  3: 'sick_leave',
  4: 'deleted',
  5: 'vacation',
  6: 'time_off',
  7: 'other'
}

function findStatus(k) {
  for (let i in usersStatuses) {
    if (i == k) {
      return usersStatuses[i]
    }
  }
}

export default function Status() {
  const localUser = JSON.parse(localStorage.getItem('user'))

  const [places, setplaces] = useState([])
  const [office, setoffice] = useState([])
  const [workplace, setworkplace] = useState([])
  const [place, setPlace] = useState([])
  const [err, setErr] = useState('')
  const [user, setUser] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState('')
  const [modalActive, setModalActive] = useState(false)
  const [modalActiveReserve, setModalActiveReserve] = useState(false)
  const [modalName, setModalName] = useState()
  const modalComment = useRef()
  const PlaceRef = useRef()
  const DataTime = useRef()
  const Offices = useRef()


  // получение данных пользователя о работе
  useEffect(() => {


    const fetchUser = async () => {

      const res = await axios.get('/api/user/' + localUser._id)
      setUser(res.data)

      const work = await axios.get('/api/workplace_logs_get/' + localUser._id)
      const filter = work.data.filter(element => element.is_canceled !== true)
      setworkplace(filter)

      const offices = await axios.get('/api/office_get/')
      const officesMap = offices.data.map(element => element.location)
      setoffice(officesMap)


      const date = moment().format('YYYY-MM-DD')
      if (DataTime.current) {
        DataTime.current.value = date;
      }

      if (
          !Offices.current || Offices.current.value === '' ||
          !PlaceRef.current || PlaceRef.current.value === '' ||
          !DataTime.current || DataTime.current.value === ''
      ) {
        const off = 1;

        const add = {
          date: date,
          office: off
        };

        const places = await axios.post('/api/workplaces/', add);
        setplaces(places.data);
      }
      if (Offices.current) {
        if (Offices.current.value === null) {
          Offices.current.value = '';
        } else {

          const add = {
            date: date,
            office: Offices.current.value
          };

          const places = await axios.post('/api/workplaces/', add)
          setplaces(places.data)
        }
        if (places && places.length > 0) {
          const placeMap = places.map(element => element.location_res);
          setPlace(placeMap);
        } else {
          setPlace([]); // Установите пустой массив, если нет данных
        }
      }
    }
    fetchUser()
  }, [localUser._id])

  // начало работы.
  const handlerStart = async (e) => {
    e.preventDefault()
    if (+modalName === 0 && modalComment.current.value === '') {
      setError('Заполните комментарий')
      return
    }
    if (+modalName !== 0 && +modalName !== 1) {
      setError('Заполните состояние здоровья')
    } else {
      setIsFetching(true)

      const newPost = {
        userId: localUser._id,
        typework_id: 1,
        status: 1,
        healthStart: +modalName,
        commentStart: modalComment.current.value || '-',
        workStart: new Date(Date.now())
      }
      try {
        const res = await axios.post("/api/post/", newPost)
        /*await axios.post("/api/status/")*/
        /*await axios.put('/api/user/'+user._id, {status:1, userId: user._id})*/
        localStorage.setItem('user', JSON.stringify({...localUser, status: 1}))
        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    }
  }


  // конец работы
  const handlerEnd = async (e) => {
    e.preventDefault();

    if (+modalName === 0 && modalComment.current.value === '') {
      setError('Заполните комментарий');
      return;
    }

    if (+modalName !== 0 && +modalName !== 1) {
      setError('Заполните состояние здоровья');
    } else {
      setIsFetching(true);

      try {
        const res = await axios.get('/api/vacation?id=' + localUser._id);
        const date = moment().format('DD.MM.YY')
        let newstatus;

        if (res.data.length > 0 && date >= res.data[0]['workdate'] && date <= res.data[0]['worked']) {
          newstatus = res.data[0]['typework_id']
        } else {
          newstatus = 2
        }

        const newPost = {
          userId: localUser._id,
          typework_id: 1,
          status: newstatus,
          healthEnd: +modalName,
          commentEnd: modalComment.current.value || '-',
          workEnd: new Date(Date.now())
        };

        await axios.put("/api/post/", newPost);
        /*await axios.put('/api/user/'+user._id, {status:2, userId: user._id})*/
        localStorage.setItem('user', JSON.stringify({...localUser, status: 2}));
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }


  const handleName = e => {
    setModalName(e.target.value)
  }

  const clickReserve = async () => {
    setErr('')
    if (PlaceRef.current.value === '' || DataTime.current.value === '') {

    } else {
      const space = PlaceRef.current.value.toString()
      const wp_id = space.split('(')
      const ww = wp_id[0].split("^")
      if (wp_id[1]) {
        setErr('Место занято')
      } else {
        const reservePlace = {
          user_id: localUser._id,
          wp_id: ww[0],
          office: Offices.current.value,
          booking_date: DataTime.current.value,
          is_canceled: false
        }
        await axios.post("/api/workplace_logs/", reservePlace)
      }
      const add = {
        date: DataTime.current.value,
        office: Offices.current.value
      }
      const places = await axios.post('/api/workplaces/', add)
      setplaces(places.data)
    }
    const work = await axios.get('/api/workplace_logs_get/' + localUser._id)
    const filter = work.data.filter(element => element.is_canceled !== true)
    setworkplace(filter)

  }


  const DataClick = async () => {
    const date = moment().format('YYYY-MM-DD');
    if (DataTime.current.value < date) {
      DataTime.current.value = date
      setErr('Не актуальная дата')
    } else {
      setErr('')
    }
    const add = {
      date: DataTime.current.value,
      office: Offices.current.value
    }
    const places = await axios.post('/api/workplaces/', add)
    setplaces(places.data)
  }

  const clickOffice = async () => {

    setErr('')
    const date = moment().format('YYYY-MM-DD');
    if (DataTime.current.value === '') {
      DataTime.current.value = date
    } else {
      const add = {
        date: DataTime.current.value,
        office: Offices.current.value
      }
      const places = await axios.post('/api/workplaces/', add)
      setplaces(places.data)
      const placeMap = places.data.map(element => element.location_res)
      setPlace(placeMap)
    }
  }

  const clickPlace = async () => {
    setErr('')
    if (DataTime.current.value === '' || PlaceRef.current.value === '') {
    } else {
      const add = {
        date: DataTime.current.value,
        office: Offices.current.value
      }
      const places = await axios.post('/api/workplaces/', add)
      setplaces(places.data)
      const placeMap = places.data.map(element => element.location_res)
      setPlace(placeMap)
    }
  }


  const clearPlace = async () => {
    setErr('')

    const date = moment().format('YYYY-MM-DD');

    const is_canceled = {
      user_id: localUser._id,
      canceled: true,
      date: date
    }

    await axios.post('/api/workplace_logs_clear/', is_canceled)
    const work = await axios.get('/api/workplace_logs_get/' + localUser._id)

    const filter = work.data.filter(element => element.is_canceled !== true)
    setworkplace(filter)

    const add = {
      date: DataTime.current.value,
      office: Offices.current.value
    }
    const places = await axios.post('/api/workplaces/', add)
    setplaces(places.data)
    const placeMap = places.data.map(element => element.location_res)
    setPlace(placeMap)

  }

  const deletePlace = async (e) => {
    setErr('')
    e.preventDefault()

    const is_canceled = {
      user_id: localUser._id,
      id: e.target.value,
      canceled: true
    }

    await axios.post('/api/workplace_logs_post/', is_canceled)
    const work = await axios.get('/api/workplace_logs_get/' + localUser._id)
    const filter = work.data.filter(element => element.is_canceled !== true)
    const add = {
      date: DataTime.current.value,
      office: Offices.current.value
    }
    const places = await axios.post('/api/workplaces/', add)
    setplaces(places.data)
    setworkplace(filter)
  }



  return (
      <>
        <table border="0">
          <tr>
            <td>
              <button type='submit' onClick={() => setModalActive(true)}
                      className={'statusBtn ' + (findStatus(user.status))}>
                {isFetching
                    ? <CircularProgress style={{color: 'white', size: '20px', width: '20px', height: '20px'}}/>
                    : user.status !== 1
                        ? 'Начать'
                        : 'Закончить'
                }
              </button>
            </td>
            <td>
              <button type='submit' onClick={() => setModalActiveReserve(true)} className='statusBtn'>
                <h5>Зарезервировать место</h5>
              </button>
            </td>
          </tr>
        </table>

        <Modal active={modalActive} setActive={setModalActive}>
          <h1>Изменение информации:</h1>
          <hr/>
          {error && <div className='modalError'>{error}</div>}
          <form className="modalLoginBox" onSubmit={user.status === 1 ? handlerEnd : handlerStart}>
            <div className='statusCheckbox'>
              <label htmlFor='sickLeave'>
                <input
                    type='radio'
                    value={1}
                    id='sickLeave'
                    name='sickLeave'
                    onChange={handleName}
                    checked={+modalName === 1}
                />Здоров</label>
              <label htmlFor='vacation'>
                <input
                    type='radio'
                    value={0}
                    id='vacation'
                    name='vacation'
                    onChange={handleName}
                    checked={+modalName === 0}
                />Болен</label>
            </div>
            <input
                placeholder="Комментарий"
                className="ModalInputStatus"
                ref={modalComment}
            />
            <button className="ModalButton" type="submit" disabled={isFetching}>
              {user.status !== 1
                  ? 'Начать'
                  : 'Закончить'
              }
            </button>
          </form>
        </Modal>
        <Modal active={modalActiveReserve} setActive={setModalActiveReserve}>
          <h1 style={{textAlign: 'center'}}>Зарезервировать рабочее место</h1>

          <br/>
          {err &&
          <div className='modalError'>
            {err}
          </div>
          }
          <hr/>
          <br/>
          <div className='flex'>
            <div>
              <label style={{fontWeight: "bold"}}>Дата: </label><input
                type='date'
                className="ModalInputDate"
                ref={DataTime}
                onChange={DataClick}
            />
            </div>

            <div style={{width: '50px'}}></div>

            <div><label style={{fontWeight: "bold"}}>Офис: </label>

              <select ref={Offices} onClick={clickOffice} className='selectwork'>

                {office.map((work, id) => <option key={id} title={work} value={id + 1}>{work}</option>)}

              </select>
            </div>

            <div style={{width: '50px'}}></div>

            <div><label style={{fontWeight: "bold"}}>Место: </label>

              <select ref={PlaceRef} onClick={clickPlace} className='selectwork'>

                {places.map((work, id) => <option key={id} title={work.workplace_id}
                                                  value={work.workplace_id + "^" + work.location_res}>{work.location_res}</option>)}

              </select>
            </div>
          </div>
          <br/>
          <button className="ModalButton" onClick={clickReserve} type="submit" disabled={isFetching}>
            Зарезервировать место
          </button>
          <br/>
          <br/>
          <hr/>

          <div className='divreserve'>
            {workplace.map((array, id) =>
                <div className='place'>Дата: {array.booking_date} Место: {array.place} Офис:{array.location}
                  <button className='placeButton' key={id} value={array.id} onClick={deletePlace}>Снять резерв</button>
                </div>)}
          </div>
          <br/>
          <br/>
          <button onClick={clearPlace} className="ModalButton">Отменить все места</button>
          <br/><br/>
        </Modal>
      </>
  )
}
