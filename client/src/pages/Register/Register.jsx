import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {Link,useHistory} from 'react-router-dom'
import { HelpOutline } from '@material-ui/icons'

import "./Register.css";
import Modal from "../../components/Templates/Modal/Modal";

export default function Register() {
  const email = useRef()
  const password = useRef()
  const passwordAgain = useRef()
  const username = useRef()
  const firstname = useRef()
  const department = useRef()
  const history = useHistory();
  const telephone = useRef()
  const city = useRef()
  const additional_contact = useRef()
  const distribution_group = useRef()
  const link_vacancies = useRef()
  const activity_profile=useRef()
  const place_of_residence=useRef()
  const companyName=useRef()
  const [active, setActive] = useState(false)

  const [grade, setGrade] = useState([]);

  const [project, setProject] = useState([])

  const [options, setOptions] = useState([]);

  const [company, setCompany] = useState([])

  const [error, setError] = useState('')


  const [cities, setCities] = useState([])

  const [inputValue, setInputValue] = useState('');

  const [checkVal, setCheckVal] = useState(false)
  const [vacancies, setVacancies] = useState([])

  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);



  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermCities, setSearchTermCities] = useState('');


  const [vacanciesId, setVacanciesId] = useState([])
  const [citiesId, setCitiesId] = useState([])





  const handleUserClick = (vacancy_code,id) => {
    setVacanciesId(id)
    setSearchTerm(vacancy_code)
    setFilteredVacancies([])
  }

  const handleUserClickCities = (city_name,id) => {
    setCitiesId(id)
    setSearchTermCities(city_name)
    setFilteredCities([])
  }

  const handleInputChangeVacancies = (e) => {
    const term = e.target.value;
    if(searchTerm.length===0) {
      setVacanciesId([])
    }else{
    }
    setSearchTerm(term);
    const filtered = vacancies.filter(vac =>
        vac.vacancy_code && vac.vacancy_code.toLowerCase().includes(term.toLowerCase())
    );
    if (term === '') {
      setFilteredVacancies([])
    } else {
      setFilteredVacancies(filtered);
    }
  }


  const handleInputChangeCities = (e) => {
    const termCities = e.target.value;
    setSearchTermCities(termCities);
    const filtered = cities.filter(city =>
        city.city_name && city.city_name.toLowerCase().includes(termCities.toLowerCase())
    );
    if (termCities === '') {
      setFilteredCities([])
    } else {
      setFilteredCities(filtered);
    }
  }



  const changeVal = () => {
    setCheckVal(!checkVal)
  }

  useEffect(() => {

      const getDeps = async () => {
        const company = await axios.get('/api/Vacations/?company=company')

        setCompany(company.data)

        const getVacancies = await axios.get('/api/Vacations/')
        setVacancies(getVacancies.data)


        const city =  await axios.get('/api/Cities/')
        setCities(city.data)

        const res = await axios.get('/api/department_tree_to_json/');
        const data = res.data[0]['department_tree_to_json'];
        const extractedOptions = extractOptions(data);
        setOptions(extractedOptions);

      }

      const extractOptions = (node) => {
        let optionsList = [{ id: node.id, name: node.Name }];
        if (node.Subclasses && node.Subclasses.length > 0) {
          node.Subclasses.forEach(subclass => {
            optionsList = optionsList.concat(extractOptions(subclass));
          });
        }
        return optionsList;
      };
    getDeps()
  }, [])


  const onChangeGrade = (e) => {

    if (/^\d*$/.test(e.target.value)) {
      setGrade(e.target.value);
    }

  }
  const onChangeProject = (e) => {
    if (/^\d*$/.test(e.target.value)) {
      setProject(e.target.value);
    }
  }


  const handleClick = async (e) => {
    e.preventDefault();

    // Проверка формата ссылки на вакансию
    const regex = /^ИТС-[\d\W]+$/;
    if (!regex.test(searchTerm)) {
      setError('Пожалуйста, введите значение в формате ИТС-XX-XXХ-ХХХXXXX');
      return;
    }

    // Проверка паролей
    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity('Пароли не совпадают');
      setError('Пароли не совпадают')
      return;
    }

    // Проверка заполнения поля отдела
    if (department.current.value === '') {
      setError('Не все поля заполнены');
      return;
    }

    // Проверка остальных полей и отправка данных на бэкэнд
    const name = firstname.current.value + ' ' + username.current.value;
    if (companyName.current.value === '') {
      setError('Не все поля заполнены');
      return;
    }

    const user = {
      user_name: name,
      email: email.current.value.toUpperCase(),
      department_id: department.current.value,
      password: password.current.value,
      isadmin: checkVal,
      phone_number: telephone.current.value,
      link_vacancies: (vacanciesId.length !== 0 ? vacanciesId : searchTerm.trim().toUpperCase()),
      city_id: (citiesId.length === 0 ? null : citiesId),
      additionalContact: additional_contact.current.value,
      distributionGroup: distribution_group.current.value,
      activityProfile: activity_profile.current.value,
      place_of_residence: place_of_residence.current.value,
      companyName: companyName.current.value,
      grade: grade,
      project: project
    };
    console.log('log=',user)
    try {
      const res = await axios.post('/api/Register/', user);
      if (res.data.status === "Username user taken") {
        setError("Пользователь закреплен за выбранной ИТС");
      } else {
        if (res.data.status === "Username taken") {
          setError("Такой email уже существует");
        } else if (res.data.noITC === "noITC") {
          setError("Пользователь с данной ИТС уже существует");
        }
      else if (res.data.ITC === "THIS IS ALREADY EXISTS") {
        setError("Такая ИТС Уже существует")}

        else {
          await axios.post('/api/Register/', user);
          history.push('/login');
        }
      }
    } catch (error) {
      setError('Ошибка при регистрации');
    }
  };

  const formatPhoneNumber = (value) => {
    // Убираем все символы, кроме цифр
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('7')) {
      cleaned = cleaned.slice(1); // Удаляем ведущую 7, если она уже присутствует после +
    }
    // Ограничиваем длину очищенного значения до 10 цифр (XXX-XXX-XX-XX без кода страны)
    cleaned = cleaned.slice(0, 10);
    // Разделяем на части, добавляя дефисы
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (match) {
      return '+7 ' + [match[1], match[2], match[3], match[4]].filter(Boolean).join('-');
    }
    return '+7 ' + cleaned;
  };




  function handleSubmit(e) {
    if (e.target.value === '') {
      setError('Email должен содержать формат домена VTB')
    }
    if (e.target.value.length > 0) {
      setError('')
    }
  }


  function handleClickSubmit() {
    setError('')
    if(inputValue.length<=3)
    {
      setInputValue('')
  }else{
      }
  }


  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length < 1) {
      setInputValue('')
    } else {
      const formattedValue = formatPhoneNumber(value);
      setInputValue(formattedValue);
    }
  }





  return (

      <div className="register">
{/*        <div className="registerWrapper">
            <form className="registerBox" onSubmit={handleClick}>
              {error &&
              <div className='errorRegister'>
                {error}
              </div>
              }
              <input
                  placeholder="Имя"
                  required ref={username}
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
              />
              <input
                  placeholder="Фамилия"
                  required ref={firstname}
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
              />
              <input
                  placeholder="Телефон"
                  type='text'
                  required
                  ref={telephone}
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
                  onChange={handleChange}
                  value={inputValue}
              />
              <div className="inputContainer">
              <input
                  placeholder="Город"
                  ref={city}
                  className="registerInput"
                  value={searchTermCities}
                  onChange={handleInputChangeCities}
                  onMouseDown={handleClickSubmit}
              />
                {filteredCities.length > 0 && (
                    <div className="dropdown">
                      {filteredCities.slice(0, 10).map((city, id) => (
                          <div className='selectNameDiv' key={id} value={city.id} onClick={() => handleUserClickCities(city.city_name, city.id)}>
                            {city.city_name}
                          </div>
                      ))}
                    </div>
                )}
              </div>
              <input
                  placeholder="Адрес фактического проживания"
                  type='text'
                  required ref={place_of_residence}
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
              />
              <input
                  placeholder="Доп контакт(Номер телефона,ФИО,статус человека)"
                  type='text'
                  required ref={additional_contact}
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
              />
              <input
                  placeholder="Группа рассылки"
                  required ref={distribution_group}
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
              />
              <div className="inputContainer">
                <input
                    placeholder="Ссылка на вакансию"
                    required
                    ref={link_vacancies}
                    className="registerInput"
                    value={searchTerm}
                    onChange={handleInputChangeVacancies}
                    onMouseDown={handleClickSubmit}
                />
                {filteredVacancies.length > 0 && (
                    <div className="dropdown">
                      {filteredVacancies.map((vac, id) => (
                          <div
                              className="selectNameDiv"
                              key={id}
                              value={id}
                              onClick={() => handleUserClick(vac.vacancy_code, vac.id)}
                          >
                            {vac.vacancy_code}
                          </div>
                      ))}
                    </div>
                )}
              </div>
              <input
                  placeholder="Профиль деятельности"
                  required ref={activity_profile}
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
              />
              <input
                  placeholder="Грейд"
                  type='text'
                  required
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
                  onChange={onChangeGrade}
                  value={grade}
              />
              <select ref={companyName} className='selectDeps' >
                <option value=''>Выберите компанию</option>
                {company.map((company, name) => <option key={name} value={company.id}>{company.name}</option>)}
              </select>
              <input
                  placeholder="Код проекта(Нет проекта=0)"
                  type='text'
                  required
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
                  onChange={onChangeProject}
                  value={project}
              />
              <input
                  placeholder="Email в формате IvanoIA@vtb.ru"
                  type='email'
                  required ref={email}
                  className="registerInput"
                  onMouseDown={handleSubmit}
                  onInput={handleSubmit}
              />
              <select
                  ref={department}
                  className='selectDeps'
              >
                <option value=''>Выберите подразделение</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                ))}
              </select>
            <div>
              Начальник отдела?
              <label htmlFor='trueAdmin'>
              <input
                type='radio'
                value={true}
                name='trueAdmin'
                checked={checkVal}
                onChange={changeVal}
                onMouseDown={handleClickSubmit}
              />Да</label>
              <label htmlFor='falseAdmin'>
              <input
                type='radio'
                value={false}
                name='falseAdmin'
                checked={!checkVal}
                onChange={changeVal}
                onMouseDown={handleClickSubmit}
              />Нет</label>
            </div>
            <input
              placeholder="Пароль"
              type='password'
              required ref={password}
              className="registerInput"
              minLength='6'
              onMouseDown={handleClickSubmit}
            />
            <input
              placeholder="Пароль ещё раз"
              type='password'
              required ref={passwordAgain}
              className="registerInput"
              minLength='6'
              onMouseDown={handleClickSubmit}
            />
              <div style={{width:'100%'}}>
            <button className="registerButton" type='submit'>Зарегистрироваться</button>
              </div>
              <div style={{width:'100%'}}>
            <Link to='/login'>
              <button className="registerLoginButton">Войти в аккаунт</button>
            </Link>
              </div>
          </form>


      </div>*/}



      <div className='registerBox'>
       <table border="0" className='tableRegister'>
         {error &&
         <div className='errorRegister'>
           {error}
         </div>
         }
          <thead>
          </thead>
          <tbody>
          <tr>
            <td><input
                placeholder="Имя"
                required ref={username}
                className="registerInput"
                onMouseDown={handleClickSubmit}
            />
            </td>
            <td></td>
          </tr>
          <tr>
            <td><input
                placeholder="Фамилия"
                required ref={firstname}
                className="registerInput"
                onMouseDown={handleClickSubmit}
            />
            </td>
            <td></td>
          </tr>
          <tr>
            <td><input
                placeholder="Телефон"
                type='text'
                required
                ref={telephone}
                className="registerInput"
                onMouseDown={handleClickSubmit}
                onChange={handleChange}
                value={inputValue}
            />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div className="inputContainer">
                <input
                    placeholder="Город"
                    ref={city}
                    className="registerInput"
                    value={searchTermCities}
                    onChange={handleInputChangeCities}
                    onMouseDown={handleClickSubmit}
                />
                {filteredCities.length > 0 && (
                    <div className="dropdown">
                      {filteredCities.slice(0, 10).map((city, id) => (
                          <div className='selectNameDiv' key={id} value={city.id} onClick={() => handleUserClickCities(city.city_name, city.id)}>
                            {city.city_name}
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </td>
            <td></td>
          </tr>
          <tr>
            <td><input
                placeholder="Адрес фактического проживания"
                type='text'
                required ref={place_of_residence}
                className="registerInput"
                onMouseDown={handleClickSubmit}
            />
            </td>
            <td></td>
          </tr>
          <tr>
            <td><input
                placeholder="Доп контакт(Номер телефона,ФИО,статус человека)"
                type='text'
                required ref={additional_contact}
                className="registerInput"
                onMouseDown={handleClickSubmit}
            /></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <input
                  placeholder="Группа рассылки"
                  required ref={distribution_group}
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
              />
            </td>
            <td><HelpOutline onClick={()=>setActive(true)} style={{cursor:'pointer'}}/></td>
          </tr>
          <tr>
            <td>
              <div className="inputContainer">
                <input
                    placeholder="Ссылка на вакансию"
                    required
                    ref={link_vacancies}
                    className="registerInput"
                    value={searchTerm}
                    onChange={handleInputChangeVacancies}
                    onMouseDown={handleClickSubmit}
                />
                {filteredVacancies.length > 0 && (
                    <div className="dropdown">
                      {filteredVacancies.map((vac, id) => (
                          <div
                              className="selectNameDiv"
                              key={id}
                              value={id}
                              onClick={() => handleUserClick(vac.vacancy_code, vac.id)}
                          >
                            {vac.vacancy_code}
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </td>
            <td><HelpOutline onClick={()=>setActive(true)} style={{cursor:'pointer'}}/></td>
                <Modal active={active} setActive={setActive}>
                  <div>
                    <center>Информацию можно получить у своего руководителя</center>
                  </div>
                </Modal>
          </tr>
          <tr>
            <td>
              <input
                placeholder="Профиль деятельности"
                required ref={activity_profile}
                className="registerInput"
                onMouseDown={handleClickSubmit}
            />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <input
                  placeholder="Грейд"
                  type='text'
                  required
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
                  onChange={onChangeGrade}
                  value={grade}
              />
            </td>
            <td></td>
          </tr>
           <tr>
            <td>
              <select ref={companyName} className='selectDeps' >
                <option value=''>Выберите компанию</option>
                {company.map((company, name) => <option key={name} value={company.id}>{company.name}</option>)}
              </select>
            </td>
            <td></td>
          </tr>
            <tr>
            <td>
              <input
                  placeholder="Код проекта(Нет проекта=0)"
                  type='text'
                  required
                  className="registerInput"
                  onMouseDown={handleClickSubmit}
                  onChange={onChangeProject}
                  value={project}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <input
                  placeholder="Email в формате IvanoIA@vtb.ru"
                  type='email'
                  required ref={email}
                  className="registerInput"
                  onMouseDown={handleSubmit}
                  onInput={handleSubmit}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td style={{ width: '100%' }}>
              <select
                  ref={department}
                  className='selectDeps'
              >
                <option value=''>Выберите подразделение</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                ))}
              </select>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div>
                Начальник отдела?
                <label htmlFor='trueAdmin'>
                  <input
                      type='radio'
                      value={true}
                      name='trueAdmin'
                      checked={checkVal}
                      onChange={changeVal}
                      onMouseDown={handleClickSubmit}
                  />Да</label>
                <label htmlFor='falseAdmin'>
                  <input
                      type='radio'
                      value={false}
                      name='falseAdmin'
                      checked={!checkVal}
                      onChange={changeVal}
                      onMouseDown={handleClickSubmit}
                  />Нет</label>
              </div>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <input
                  placeholder="Пароль"
                  type='password'
                  required ref={password}
                  className="registerInput"
                  minLength='6'
                  onMouseDown={handleClickSubmit}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <input
                  placeholder="Пароль ещё раз"
                  type='password'
                  required ref={passwordAgain}
                  className="registerInput"
                  minLength='6'
                  onMouseDown={handleClickSubmit}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div style={{width:'100%'}}>
                <button className="registerButton" type='submit' onClick={handleClick}>Зарегистрироваться</button>
              </div>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div style={{width:'100%'}}>
                <Link to='/login'>
                  <button className="registerLoginButton">Войти в аккаунт</button>
                </Link>
              </div>
            </td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}