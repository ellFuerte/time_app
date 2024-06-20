const router = require('express').Router()
const postController = require('../models/post.controller')

router.post('/post', postController.CreatePost) //Начать
router.put('/post', postController.Updatepost) //Закончит
router.post('/vacation', postController.Addvacation)
router.get('/post' , postController.filter)
router.get('/vacation', postController.filter)
router.post('/post/filter', postController.filter)
router.post('/post/Reports', postController.Reports)
router.get('/vote' , postController.Vote)
router.post('/vote' , postController.Vote)
router.post('/workplaces' , postController.workplaces)
router.get('/workplaces' , postController.workplaces)
router.post('/workplace_logs' , postController.workplace_logs)
router.get('/workplace_logs_get/:id' , postController.workplace_logs_get)
router.post('/workplace_logs_post/' , postController.workplace_logs_post)
router.post('/workplace_logs_clear/' , postController.workplace_logs_clear)
router.get('/office_get/' , postController.office_get)


router.post('/Vacations_function/' , postController.Vacancies_get_function)


router.get('/Vacations/' , postController.Vacancies_get)
router.get('/Cities/' , postController.Cities_get)


router.get('/Skills/' , postController.Skills)
router.get('/Skills/:id' , postController.Skills)
router.post('/Skills/' , postController.Skills)


router.put('/Vacations/' , postController.Vacancies_update)
router.post('/Vacations/' , postController.Vacancies_post)


module.exports = router