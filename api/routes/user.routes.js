const router = require('express').Router()
const userController = require('../models/user.controller')


router.get('/departments', userController.Depart_name)
router.post('/departments', userController.Depart_name)
router.post('/statusChild', userController.statusChild)
router.post('/get_users_by_dep', userController.get_users_by_dep)
router.get('/department_tree_to_json', userController.department_tree_to_json)
router.post('/Register' , userController.Register) // Регистрация пользователя
router.post('/login', userController.Login)      // Авторизация
router.get('/user/:id' , userController.getoneUser) // Вывод конкретного пользователя
router.get('/user' , userController.getUser) // Вывод всех пользователей
router.put('/user' , userController.getupdateUser)
router.put('/deluser' , userController.delUser) // Удаление пользователя по статусу
router.put('/resetPassword' , userController.resetPassword)
router.put('/newPassword' , userController.newPassword)
router.post('/get_statistics_all_users' , userController.get_statistics_all_users)



/*router.post('/get_users_by_users', userController.get_users_by_users)*/
/*router.post('/get_statistics' , userController.get_statistics)*/
/*router.delete('/user/:id' , userController.getdeleteUser) // Удаление пользователя c БД */


module.exports = router



