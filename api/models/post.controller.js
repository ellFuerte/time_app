const client = require("../connect");
const moment = require('moment');
const cron = require('node-cron');

cron.schedule('0 */4 * * *', async () => {
        const schedulePost = await client.query('CALL reset_workstart()')
        if (schedulePost) {
            console.log('процедура отработала')
        } else {
            console.log('процедура не отработала')
        }
        const scheduleUpdateStatus = await client.query('CALL update_user_status()')
        if (scheduleUpdateStatus) {
            console.log('Статусы обновленны')
        } else {
            console.log('Статусы не обновленны')
        }
    }
)


class PostController {

    async Typework_status(req,res) {
       const getTypework = await client.query('SELECT user_typework()')
        res.json(getTypework.rows[0])
    }


    //Добовление данных по кнопке начать
    async CreatePost(req, res) {
        const {userId, healthStart, workStart, commentStart, typework_id, status} = req.body
        const updateStatus = await client.query('UPDATE users SET status = $1 WHERE id = $2', [status, userId])
        const getStatus = await client.query('SELECT status FROM users WHERE id=$1', [userId])
        res.json({"status": getStatus.rows[0].status})
        const newPost = await client.query('INSERT INTO history (user_id,healthstart,workstart,commentstart,typework_id) values ($1, $2, $3, $4, $5 )', [userId, healthStart, workStart, commentStart, typework_id])
        res.json(newPost.rows[0])
    }


    //Добовление данных по кнопке закончить
    async Updatepost(req, res) {
        const {userId, status, workEnd, commentEnd, healthEnd, typework_id} = req.body
        const select = await client.query('SELECT id FROM history WHERE workend is null AND user_id=$1 AND typework_id=$2', [userId, typework_id])
        const ds = select.rows[0].id
        if (select) {
            const updateStatus = await client.query('UPDATE users SET status = $1 WHERE id = $2', [status, userId])
            const updatePost = await client.query('UPDATE history SET workend = $1, healthend = $2, commentend = $3 WHERE id=$4', [workEnd, healthEnd, commentEnd, ds])
            res.json(updatePost.rows[0])
        }
    }

    async filter(req, res) {
        const newdate = new Date()
        newdate.setDate(newdate.getDate() - 30)
        const setDate = new Date()
        setDate.setDate(setDate.getDate() + 1)
        let {userId, typework, startdate, enddate} = req.body
        if (startdate === enddate) {
            const endd = moment(startdate).add(1, 'days');
            const setEnd = endd.format('YYYY-MM-DD')
            enddate = setEnd
        }
        global.tp = 1
        const type = req.query.type
        if (typeof type != 'undefined') {
            typework = true
            global.tp = typework
        } else {
            global.tp = 1
        }
        if (!!typework) {
            global.tp = 1
            global.otg = 0
            global.otp = 0
            global.bol = 0
            global.other = 0
        } else {
            global.tp = 0
            global.otg = 6
            global.otp = 5
            global.bol = 3
            global.other = 7
        }
        if (typeof userId != 'undefined') {
            global.usId = userId
        } else {
            const id = req.query.id
            global.usId = id
        }
        if (typeof startdate != 'undefined') {
            global.sd = startdate
        } else {
            global.sd = newdate
        }
        if (typeof enddate != 'undefined') {
            const endd = moment(enddate).add(10, 'days')

            const setEnd = endd.format('YYYY-MM-DD')
            global.ed = setEnd
        } else {
            global.ed = setDate
        }
        const post = await client.query('SELECT TO_CHAR(workstart,\'DD.MM.YY\') AS workdate, TO_CHAR(workstart,\'HH24:MI\') AS workstart, TO_CHAR(workend,\'HH24:MI\') AS workend,TO_CHAR(workend,\'DD.MM.YY\') AS worked, TO_CHAR(workend-workstart,\'HH24:MI:SS\') AS worklong,TO_CHAR(workend-workstart,\'DD\') AS work, healthstart , healthend ,commentstart , commentend,typework_id FROM history WHERE typework_id in ($4,$5,$6,$7,$8) AND user_id = $1 AND workstart >= $2 AND workstart <= $3 ORDER BY id DESC,workdate DESC,workend DESC', [usId, sd, ed, tp, otg, otp, bol, other])
        res.json(post.rows)

    }

    async Addvacation(req, res) {
        const {userId, status, end, start, comment} = req.body;

        const currentDate = moment().format('YYYY-MM-DD');
        const startDate = moment(start).format('YYYY-MM-DD');

        const user = await client.query('SELECT status FROM users WHERE id = $1', [userId]);

        let newStatus = status;
        if (currentDate !== startDate && user.rows[0]['status'] !== 1) {
            const user = await client.query('SELECT status FROM users WHERE id = $1', [userId]);
            newStatus = user.rows[0].status;
            await client.query('UPDATE users SET status = $1 WHERE id = $2', [newStatus, userId]);
        }

        if (user.rows[0]['status'] === 2 ||
            user.rows[0]['status'] === 3 ||
            user.rows[0]['status'] === 5 ||
            user.rows[0]['status'] === 6 ||
            user.rows[0]['status'] === 7) {
            await client.query('UPDATE users SET status = $1 WHERE id = $2', [newStatus, userId]);
        }


        const post = await client.query('INSERT INTO history (user_id, typework_id, workstart, workend, commentstart) VALUES ($1, $2, $3, $4, $5)', [userId, status, start, end, comment]);

        res.json(post.rows);
    }

    async Reports(req, res) {
        const {startdate, enddate} = req.body
        const endd = moment(startdate).add(1, 'days');
        const setEnd = endd.format('YYYY-MM-DD')
        if (startdate === enddate) {
            global.start = startdate
            global.end = setEnd
        } else {
            global.start = startdate
            const enddd = moment(enddate).add(1, 'days');
            global.end = enddd
        }
        if (startdate && enddate) {
            const reportsHistory = await client.query('SELECT ROW_NUMBER() OVER(order by workstart DESC,user_name DESC), users.id, (history.commentstart || \'\n\n\' || history.commentend) AS comment,users.user_name, TO_CHAR(history.workstart,\'DD.MM.YY  HH24:MI\') AS workstart, TO_CHAR(history.workend,\'DD.MM.YY  HH24:MI\') AS workend, history.typework_id, TO_CHAR(workend-workstart,\'HH24:MI\') AS worklong FROM users INNER JOIN history ON users.id=history.user_id WHERE typework_id in (1,2) AND ((workstart>=$1 AND workstart<=$2) OR (workend>=$1 AND workend<=$2))', [start, end])
            res.json(reportsHistory.rows)
        }
        const {startDateNomination, endDateNomination} = req.body
        if (startDateNomination && endDateNomination) {
            const reportsNominations = await client.query('SELECT user_id, s.user_name as Кто, users.user_name AS Номинант,nominations.nominations_name, TO_CHAR(nominations_history.createdate,\'DD-MM-YYYY\') AS date FROM nominations_history INNER JOIN nominations ON nominations_history.nominations_id=nominations.id INNER JOIN users ON users.id=nominations_history.vote_for_user JOIN users s ON s.id=nominations_history.user_id WHERE nominations_history.createdate>=$1 AND nominations_history.createdate<=$2', [startDateNomination, setEnd])
            res.json(reportsNominations.rows)
        }
    }

    async Vote(req, res) {
        const {user_id} = req.body
        if (user_id) {
            const {vote_for_user, nominations_id} = req.body
            const vote = await client.query('INSERT INTO nominations_history (user_id,vote_for_user,nominations_id) values($1,$2,$3)', [user_id, vote_for_user, nominations_id])
            res.json(vote.rows)
        } else {
            const vote = await client.query('SELECT * FROM nominations order by id')
            res.json(vote.rows)
        }
        const {userId, id_nomination} = req.body
        if (userId && id_nomination || id_nomination === null) {
            const nomination = await client.query('UPDATE users SET nomination_status = $1 WHERE id = $2', [id_nomination, userId])
        }
    }


    async workplaces(req, res) {
        const {date, office} = req.body
        const workplaces = await client.query('SELECT * FROM get_workplace_status($1,$2)', [date, office])
        res.json(workplaces.rows)

    }

    async workplace_logs(req, res) {
        const {user_id, wp_id, booking_date, is_canceled, office} = req.body
        const workplace_logs = await client.query('INSERT INTO workplace_logs (user_id,wp_id,booking_date,is_canceled,off_id) values($1,$2,$3,$4,$5)', [user_id, wp_id, booking_date, is_canceled, office])
        res.json(workplace_logs.rows)
    }

    async workplace_logs_get(req, res) {
        const id = req.params.id
        const workplace_logs_get = await client.query('SELECT wp_id, location, workplace_logs.id, place, is_canceled, TO_CHAR(booking_date,\'DD.MM.YY\') AS booking_date FROM workplace_logs INNER JOIN workplaces ON workplaces.id=workplace_logs.wp_id INNER JOIN offices ON offices.id=workplace_logs.off_id WHERE user_id=$1 AND booking_date >= CURRENT_DATE ', [id])
        res.json(workplace_logs_get.rows)
    }

    async office_get(req, res) {
        const office_get = await client.query('SELECT * FROM select_office_function()')
        res.json(office_get.rows)
    }

    async workplace_logs_clear(req, res) {
        const {user_id, canceled, date} = req.body
        const workplace_logs_delete = await client.query('UPDATE workplace_logs SET is_canceled=$2 where user_id = $1 AND booking_date<=$3', [user_id, canceled, date])
        res.json(workplace_logs_delete.rows)
    }

    /*    async workplace_logs_delete(req, res) {
            const id = req.params.id
            const workplace_logs_delete = await client.query('DELETE FROM workplace_logs where id = $1', [id])
            res.json(workplace_logs_delete.rows)
        }*/

    async workplace_logs_post(req, res) {
        const {canceled, id, user_id} = req.body
        const workplace_logs_post = await client.query('UPDATE workplace_logs SET is_canceled = $1 WHERE id = $2', [canceled, id])
        const select = await client.query('SELECT id, user_id, wp_id, is_canceled FROM workplace_logs WHERE user_id = $1', [user_id])
        res.json(select.rows)
    }

    async Vacancies_get(req, res) {
        const status = req.query.status;
        const company = req.query.company;
        const project = req.query.project;

        if (company) {
            const getVacation = await client.query('SELECT * FROM companies');
            res.json(getVacation.rows);
        } else {
            if (!status && !project) {
                const getVacation = await client.query('SELECT id, name, status_id, company_id, team_id, vacancy_code, project_id, is_required_after, grade, description, TO_CHAR(create_date,\'YYYY-MM-DD\') AS create_date FROM vacancies');
                res.json(getVacation.rows);
            } else if (status) {
                const getVacation = await client.query('SELECT * FROM statuses');
                res.json(getVacation.rows);
            } else if (project) {
                const getVacation = await client.query('SELECT DISTINCT project_id FROM vacancies');
                res.json(getVacation.rows);
            }
        }
    }

    async Vacancies_post(req, res) {
        const {
            namevacancies,
            team_id,
            status_id,
            codeVacations,
            codeProject,
            company_id,
            description,
            grade,
            is_checked,
            userName
        } = req.body

        if (userName === '') {
            const postVacation = await client.query('INSERT INTO vacancies (name,status_id,company_id,team_id,vacancy_code,project_id,is_required_after,grade,description) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                [namevacancies, status_id, company_id, team_id, codeVacations, codeProject, is_checked, grade, description])
            res.json(postVacation.rows)
        } else {
            const postVacation = await client.query('INSERT INTO vacancies (name,status_id,company_id,team_id,vacancy_code,project_id,is_required_after,grade,description) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                [namevacancies, status_id, company_id, team_id, codeVacations, codeProject, is_checked, grade, description])
            const vacincies_id = await client.query('SELECT id FROM vacancies ORDER BY create_date DESC LIMIT 1')
            const update_vacanciy_id = await client.query('UPDATE users SET vacancy_id = $1 WHERE id = $2', [vacincies_id.rows[0].id, userName])
            res.json(postVacation.rows)
        }
    }

    async Vacancies_update(req, res) {

        const {
            namevacancies,
            description,
            grade,
            namevacanciesId,
            statuses,
            users,
            old_user,
            deps,
            company_id,
            vacancy_code,
            project_id,
            search,
            planned_release_date
        } = req.body

        if (users === null) {
            const postVacation = await client.query('UPDATE vacancies SET name = $1,description=$2,grade=$3,status_id=$4,team_id=$6,company_id=$7,vacancy_code=$8,project_id=$9 WHERE id = $5', [namevacancies, description, grade, statuses, namevacanciesId, deps, company_id, vacancy_code, project_id])
            res.json(postVacation.rows)
        } else {

            if (users.length > 1) {

                const update_status = await client.query('SELECT vacancy_id FROM users WHERE id=$1', [users])
                const update = await client.query('UPDATE vacancies SET status_id = 30 WHERE id = $1', [update_status.rows[0]['vacancy_id']])

            }

            if (search === null || users.length > 0) {
                const update_vacanciy_null = await client.query('UPDATE users SET vacancy_id = null WHERE id = $1', [old_user])

            }

            if (users.length > 0) {
                const update_vacanciy_null = await client.query('UPDATE users SET vacancy_id = null WHERE id = $1', [old_user])
                const update_vacanciy_id = await client.query('UPDATE users SET vacancy_id = $1 WHERE id = $2', [namevacanciesId, users])

            }

            if (old_user === null) {

                const update_user_null = await client.query('UPDATE users SET vacancy_id = null WHERE id = $1', [old_user])

            }

            if (search === null && users.length > 0) {
                const update_vacanciy_null = await client.query('UPDATE users SET vacancy_id = null WHERE id = $1', [old_user])
                const update_vacanciy_id = await client.query('UPDATE users SET vacancy_id = $1 WHERE id = $2', [namevacanciesId, users])
            }

            if (users.length === 0 && old_user > 0 || planned_release_date || planned_release_date === null) {
                const update = await client.query('UPDATE users SET planned_release_date = $1 WHERE id = $2', [planned_release_date, old_user])
            }
            if (old_user === null && users.length > 0 || planned_release_date || planned_release_date === null) {
                const update = await client.query('UPDATE users SET planned_release_date = $1 WHERE id = $2', [planned_release_date, users])
            }

            const postVacation = await client.query('UPDATE vacancies SET name = $1,description=$2,grade=$3,status_id=$4,team_id=$6,company_id=$7,vacancy_code=$8,project_id=$9 WHERE id = $5', [namevacancies, description, grade, statuses, namevacanciesId, deps, company_id, vacancy_code, project_id])


            res.json(postVacation.rows)
        }
    }

    async Vacancies_get_function(req, res) {
        const {departId, user_id} = req.body
        const postVacation = await client.query('SELECT get_vacancies($1, $2)', [departId, user_id])
        res.json(postVacation.rows)
    }

    async Cities_get(req, res) {
        const postVacation = await client.query('SELECT * FROM cities')
        res.json(postVacation.rows)
    }

    async Skills(req, res) {
        try {
            const id = req.params.id;
            let getSkills;
            // Проверка на наличие id в параметрах запроса
            if (id) {
                getSkills = await client.query('SELECT get_user_skills_json($1)', [id]);
                res.json(getSkills.rows);
                return; // Возвращаем результат и завершаем функцию
            }
            // Параметры для добавления навыка
            const {user_id, skill_id, self_grade, head_grade, is_active,newGradeSelf,newGradeHead} = req.body;
                await client.query('SELECT add_user_skill($1, $2, $3, $4, $5,$6,$7)', [user_id, skill_id, self_grade, head_grade, is_active, newGradeSelf,newGradeHead]);
            getSkills = await client.query('SELECT get_all_skills_json()');
            res.json(getSkills.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}
module.exports = new PostController()
