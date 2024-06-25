import Staff from '../Staff/Staff'
import './Feed.css'
import React from "react";

export default function Feed() {
  return (

    <div className='feed'>
      <div>
          <h4 className='h1'>Сервис находится в тестовом режиме  ➜ <a className="a4" href="https://sfera.vtb.ru/knowledge/pages?id=110481" target="_blank">Нашли ошибку? Пиши в комментариях!</a></h4>
      </div>
      <div className="feedWrapper">

        <Staff/>
      </div>

        <div className="circle-container">
            <div className="circle">

            </div>
        </div>

    </div>
  )
}
