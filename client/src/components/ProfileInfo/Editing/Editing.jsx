import React, { useEffect, useRef, useState } from 'react';
import Modal from "../../Templates/Modal/Modal";
import axios from "axios";
import { useParams } from "react-router-dom";

function Editing({modalActive,setModalActive}) {
    const username = useParams()

    const [error, setError] = useState('')

    const [selectedValue, setSelectedValue] = useState('');

    const [cityName, setCityName] = useState([])

    const [user, setUser] = useState([])

    const [nameValue, setNameValue] = useState("");


    const [email, setEmail] = useState([])
    const [emailChange, setEmailChange] = useState([])


    const [phone, setPhone] = useState([])
    const [phoneChange, setPhoneChange] = useState([])


    const [additional_contact, setAdditional_Contact] = useState([])
    const [additional_contact_change, setAdditional_Contact_Change] = useState([])


    const [distribution_group, setDistribution_Group] = useState([])
    const [distribution_group_change, setDistribution_Group_Change] = useState([])


    const [activity_profile, setActivity_Profile] = useState([])
    const [activity_profile_change, setActivity_Profile_Change] = useState([])

    const [CityPlace, setCityPlace] = useState([])
    const [CityPlace_Change, setCityPlace_Change] = useState([])


    const [surnameValue, setSurnameValue] = useState([])


    const [options, setOptions] = useState([]);


    const localUse = JSON.parse(localStorage.getItem('user'))

    const modalDep = useRef()
    const phoneNumber = useRef()
    const additionalContact = useRef()
    const distributionGroup = useRef()
    const activityProfile = useRef()
    const modalCity = useRef()
    const modalCityPlace = useRef()


    const [citiesId, setCitiesId] = useState([])
    const [searchTermCities, setSearchTermCities] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [cities, setCities] = useState([])


    const handleUserClickCities = (city_name, id) => {
        setCitiesId(id)
        setSearchTermCities(city_name)
        setFilteredCities([])
    }


    const handleInputChangeCities = (e) => {
        const termCities = e.target.value;
        setSearchTermCities(termCities);

        if (termCities === '') {
            setCitiesId('');
            setFilteredCities([]);
            setCityName('');
            return;
        }

        const filtered = cities.filter(city =>
            city.city_name && city.city_name.toLowerCase().includes(termCities.toLowerCase())
        );
        setFilteredCities(filtered);
    }



    useEffect(() => {

        const getNameAndSurname = () => {
            if (user.user_name) {
                const [name, surname] = user.user_name.split(" ");
                setSurnameValue(surname || "");
                setNameValue(name);
            }
        }

        const getDeps = async () => {

            const res = await axios.get('/api/department_tree_to_json/');
            const data = res.data[0]['department_tree_to_json'];
            const extractedOptions = extractOptions(data);
            setOptions(extractedOptions);
            setSelectedValue(user.department_id);
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

        const getNameDeps = async () => {
            const deps = {
                user: username.username
            }
            const res = await axios.post('/api/departments/', deps)
            setCityName(res.data[0]['city_name'])
        }

        const fetchUser = async () => {
            const res = await axios.get('/api/user/' + username.username)
            setUser(res.data)


            const city = await axios.get('/api/Cities/')
            setCities(city.data)
        }
        // Номинации

        if (user && user.email && email) {
            setEmail(user.email);
        }
        if (user && user.phone_number && phone) {
            setPhone(user.phone_number);
        }

        if (user && user.additional_contact && additional_contact) {
            setAdditional_Contact(user.additional_contact);
        }

        if (user && user.distribution_group && distribution_group) {
            setDistribution_Group(user.distribution_group);
        }
        if (user && user.activity_profile && activity_profile) {
            setActivity_Profile(user.activity_profile);
        }
        if (user && user.place_of_residence && CityPlace) {
            setCityPlace(user.place_of_residence);
        }

        getNameAndSurname();
        fetchUser()
        getDeps()
        getNameDeps()
    }, [
        user.user_name,
        user.email,
        user.phone_number,
        user.additional_contact,
        user.distribution_group,
        user.activity_profile,
        user.place_of_residence,
        username.username
    ])

    const handleEmailChange = (e) => {

        if (e.target.value) {
            setEmail('')
            setEmailChange(e.target.value)
        }
        if (e.target.value === '') {
            setEmail('')
            setEmailChange('')
        }

    }
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
    const handlePhoneChange = (e) => {
        if (e.target.value) {
            setPhone('')
            setPhoneChange(e.target.value)
        }
        if (e.target.value === '') {
            setPhone('')
            setPhoneChange('')
        }
        const value = e.target.value;
        if (value.length < 1) {
            setPhoneChange('')
        } else {
            const formattedValue = formatPhoneNumber(value);
            setPhoneChange(formattedValue);
        }
    }

    const additional_Contact = (e) => {
        if (e.target.value) {
            setAdditional_Contact('')
            setAdditional_Contact_Change(e.target.value)
        }
        if (e.target.value === '') {
            setAdditional_Contact('')
            setAdditional_Contact_Change('')
        }
    }

    const distribution_Group = (e) => {
        if (e.target.value) {
            setDistribution_Group('')
            setDistribution_Group_Change(e.target.value)
        }
        if (e.target.value === '') {
            setDistribution_Group('')
            setDistribution_Group_Change('')
        }
    }

    const activity_Profile = (e) => {
        if (e.target.value) {
            setActivity_Profile('')
            setActivity_Profile_Change(e.target.value)
        }
        if (e.target.value === '') {
            setActivity_Profile('')
            setActivity_Profile_Change('')
        }
    }

    const cityPlace = (e) => {
        if (e.target.value) {
            setCityPlace('')
            setCityPlace_Change(e.target.value)
        }
        if (e.target.value === '') {
            setCityPlace('')
            setCityPlace_Change('')
        }
    }

    const handleNameChange = (e) => {
        setNameValue(e.target.value);
    }

    const handleSurnameChange = (e) => {
        setSurnameValue(e.target.value)
    }


    // изменение данных пользователя
    const handleClick = async (e) => {

        const name = user.user_name
        const part = name.split(' ')
        e.preventDefault()
        const newInfo = {
            departmentId: modalDep.current.value || user.department_id,
            email: (email ? email : emailChange.toUpperCase()),
            username: nameValue + ' ' + surnameValue,
            _id: user.id,
            isAdmin: user.isadmin,
            see_child: user.see_child,
            status: user.status,
            main_department: user.main_department,
            phone_number: (phoneNumber.current.value === '' ? '' : phoneNumber.current.value),
            additional_contact: additionalContact.current.value,
            distribution_group: distributionGroup.current.value,
            activity_profile: activityProfile.current.value,
            city_id: citiesId,
            cityPlaceChange:modalCityPlace.current.value
        }

        if (localUse._id !== username.username) {
            const newInfo2 = {
                departmentId: modalDep.current.value || user.department_id,
                email: (email ? email : emailChange.toUpperCase()),
                username: nameValue + ' ' + surnameValue,
                phone_number: (phoneNumber.current.value === '' ? '' : phoneNumber.current.value),
                additional_contact: additionalContact.current.value,
                distribution_group: distributionGroup.current.value,
                activity_profile: activityProfile.current.value,
                city_id: citiesId,
                _id: user.id,
                cityPlaceChange:modalCityPlace.current.value
            }

            await axios.put('/api/user/', newInfo2)
            window.location.reload()
        } else {
            await axios.put('/api/user/', newInfo)
            delete newInfo.phone_number
            delete newInfo.additional_contact
            delete newInfo.distribution_group
            delete newInfo.activity_profile
            delete newInfo.city_id
            delete newInfo.cityPlaceChange
            localStorage.setItem('user', JSON.stringify({...newInfo}))
            setModalActive(false)
            window.location.reload()
        }
    }

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    };


    return (


                <Modal active={modalActive} setActive={setModalActive}>
                    <h1>Изменение информации:</h1>
                    <hr/>
                    {error && <div className='modalError'>{error}</div>}
                    <form className="modalLoginBox" onSubmit={handleClick}>
                        <div>
                            <input
                                placeholder="Фамилия"
                                className="ModalInputUpdate"
                                onChange={handleNameChange}
                                value={nameValue}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Имя"
                                className="ModalInputUpdate"
                                onChange={handleSurnameChange}
                                value={surnameValue}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Email"
                                type="email"
                                className="ModalInputUpdate"
                                onChange={handleEmailChange}
                                value={email || emailChange}
                                minLength={6}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Телефон"
                                type='text'
                                className="ModalInputUpdate"
                                ref={phoneNumber}
                                onChange={handlePhoneChange}
                                value={phone || phoneChange}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Доп контакт(Номер телефона,ФИО,статус человека)"
                                type='text'
                                className="ModalInputUpdate"
                                ref={additionalContact}
                                onChange={additional_Contact}
                                value={additional_contact || additional_contact_change}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Группа рассылки"
                                type='text'
                                className="ModalInputUpdate"
                                ref={distributionGroup}
                                onChange={distribution_Group}
                                value={distribution_group || distribution_group_change}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Профиль деятельности"
                                type='text'
                                className="ModalInputUpdate"
                                ref={activityProfile}
                                onChange={activity_Profile}
                                value={activity_profile || activity_profile_change}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Город"
                                type='text'
                                className="ModalInputUpdate"
                                ref={modalCity}
                                value={searchTermCities || cityName}
                                onChange={handleInputChangeCities}
                            />
                            <div>
                                {filteredCities.length > 0 && (
                                    <div className='divSelectRegister'>
                                        {filteredCities.map((city, id) => (
                                            <div className='selectNameDiv' key={id} value={city.id}
                                                 onClick={() => handleUserClickCities(city.city_name, city.id)}>
                                                {city.city_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <input
                                    placeholder="Адрес фактического проживания"
                                    type='text'
                                    className="ModalInputUpdate"
                                    ref={modalCityPlace}
                                    onChange={cityPlace}
                                    value={CityPlace || CityPlace_Change}
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={selectedValue} // Привязываем значение к selectedValue
                                onChange={handleChange}
                                ref={modalDep}
                                className="ModalInputUpdateSelect"
                            >
                                {options.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="ModalButton" type="submit">
                            Изменить
                        </button>
                    </form>
                </Modal>

        )
}

export default Editing;