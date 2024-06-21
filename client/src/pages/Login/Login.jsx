import {useContext, useRef, useEffect,useState} from 'react';
import {CircularProgress} from '@material-ui/core'
import {Link} from 'react-router-dom'
import axios from "axios";
import  loginCall  from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext'
import './Login.css'


export default function Login() {

    const [errorMessage, setErrorMessage] = useState();
    const [serverError, setServerError] = useState(false);

    useEffect(async () => {
        axios.get('/api/user')
            .then(response => {
                if (!response) {
                    throw new Error('Сервер недоступен');
                }
            })
            .catch(error => {
                setServerError(true);
                setErrorMessage('Ошибка: ' + error.message);
            });
    }, []);


  const email = useRef()
  const password = useRef()

  const {isFetching, error, dispatch } = useContext(AuthContext)
  const handleClick = (e) => {
    e.preventDefault()
    loginCall({email:email.current.value.toUpperCase(), password:password.current.value}, dispatch)
  }

  return (
      <div className="login">
          {!errorMessage && error &&
              <div className='error'>
                  Неправильный логин или пароль
              </div>}

          {serverError &&
              <div className='error'>
                  Сервер недоступен
              </div>
          }



      <div className="loginWrapper">
        <div className="loginCenter">
          <form className="loginBox" onSubmit={handleClick}>
            <input 
              placeholder="Email"
              className="loginInput" 
              type='emailLogin'
              ref={email} 
              required
            />
            <input 
              placeholder="Password" 
              type='password' 
              className="loginInput" 
              ref={password} 
              required
              minLength='6'
            />
            <button  className="loginButton" type="submit" disabled={isFetching}>

              {isFetching ? <CircularProgress style={{color:'white'}}/> : 'Войти'}

            </button>

            {/* <span className="loginForgot">Забыли пароль?</span> */}
            <Link to='/register' style={{width:'167%'}}>
              <button className="loginRegisterButton" disabled={isFetching}>
                {isFetching ? <CircularProgress style={{color:'white'}}/> : 'Создать новый аккаунт'}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
