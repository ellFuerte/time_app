const Client = require('pg').Client
const client = new Client({
  user: 'postgres',         // Имя БД
  host: 'localhost',        // Имя хоста
  database: 'time_app',     // Название БД
  password: 'password',     // Пароль от БД
  port: 5432              // Порт сервера Postgresql(default:5423)
})



client.connect(async function(err) {
    if (err) {
      return console.error("Ошибка:" + err.message)
    } else {
      console.error("Подключение к серверу PostgreSQL успешно установлено")
    }
  })


module.exports = client
