const client = require('../connect')
const bcrypt = require("bcrypt");



class userController {

    async Depart_name(req, res) {
        const {user} = req.body
        if (!user) {
            const depart = await client.query('SELECT id,department_name,parent_department,is_accessible from departments ORDER BY id')
            res.json(depart.rows)
        } else {
            const dep = await client.query('SELECT departments.department_name, cities.city_name,cities.timezone  FROM users INNER JOIN departments ON users.department_id = departments.id LEFT JOIN cities ON cities.id = users.city_id WHERE users.id = $1', [user])
            if (dep.rows.length === 0) {

            } else {
                res.json(dep.rows)
            }
        }
    }

    async department_tree_to_json(req, res) {
        const depart = await client.query('SELECT department_tree_to_json()::json')
        res.json(depart.rows)
    }

    async get_users_by_dep(req, res) {
        const {depsId}=req.body
        const depart = await client.query('SELECT get_users_by_dep($1)::json',[depsId])
        res.json(depart.rows)
    }

    async statusChild(req, res) {
        const {userId, ischeked} = req.body
        const depart = await client.query('UPDATE users SET see_child=$2 WHERE id=$1',[userId,ischeked])
        res.json(depart.rows)
    }


    async Register(req, res) {

        const {user_name,
            email,
            isadmin,
            department_id,
            phone_number,
            city_id,
            additionalContact,
            distributionGroup,
            link_vacancies,
            activityProfile,
            place_of_residence,
            grade,
            project,
            companyName} = req.body

        if(isadmin){

        }


        const user = await client.query('SELECT * FROM users WHERE email = $1', [email])

        if (/^\d*$/.test(link_vacancies)) {
            const update_status = await client.query('UPDATE vacancies SET status_id = 50 WHERE id = $1', [link_vacancies])
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            const vacanciesID = await client.query('SELECT id FROM users WHERE vacancy_id = $1', [link_vacancies])

            if(user.rowCount === 0 && vacanciesID.rowCount === 0){
                const newUser = await client.query('INSERT INTO users (user_name, password,email,isadmin,department_id,status,phone_number,city_id,additional_contact,distribution_group,activity_profile,place_of_residence,vacancy_id,role_id) values ($1, $2, $3, $4,$5,2,$6,$7,$8,$9,$10,$11,$12,1) RETURNING *', [user_name, hashedPassword, email, isadmin, department_id, phone_number, city_id, additionalContact, distributionGroup, activityProfile, place_of_residence, link_vacancies])
                res.json({ loggedIn: true, username: req.body.username });
            }
            else {
                res.json({loggedIn: false, status: "Username user taken", validpass: "nopass"});
            }

        } else {
            const ITC = await client.query('SELECT vacancy_code FROM vacancies WHERE vacancy_code = $1', [link_vacancies])
            if(ITC.rowCount>0){
                res.json({ITC:'THIS IS ALREADY EXISTS'});
            }else {
                if (user.rowCount === 0 && ITC.rowCount === 0) {
                    const addVacancies = await client.query('INSERT INTO vacancies (name,status_id, company_id, team_id, vacancy_code, project_id, is_required_after, grade, description) values(null,50,$1,$2,$3,$4,true,$5,null)', [companyName, department_id, link_vacancies, project, grade])
                    const vacanciesID = await client.query('SELECT id FROM vacancies WHERE vacancy_code = $1', [link_vacancies])
                    global.ITCID = vacanciesID.rows[0].id
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(req.body.password, salt)
                    const newUser = await client.query('INSERT INTO users (user_name, password,email,isadmin,department_id,status,phone_number,city_id,additional_contact,distribution_group,activity_profile,place_of_residence,vacancy_id) values ($1, $2, $3, $4,$5,2,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
                        [user_name, hashedPassword, email, isadmin, department_id, phone_number, city_id, additionalContact, distributionGroup, activityProfile, place_of_residence, global.ITCID])
                    res.json({loggedIn: true, username: req.body.username});
                } else {
                    res.json({loggedIn: false, status: "Username taken", validpass: "nopass"});
                }
            }
        }
    }

    async Login(req, res) {
        const {email, password} = req.body
        const user = await client.query('SELECT email, password, id, user_name, department_id, COALESCE(main_department, department_id) AS main_department, see_child, password, isadmin,status FROM users WHERE email = $1', [email])
        if (!user.rows.length) {
            res.sendStatus(401)
        } else {
            const success = await bcrypt.compare(password, user.rows[0].password)
            if (success) {
                res.json({
                    "main_department": user.rows[0].main_department,
                    "email": user.rows[0].email,
                    "_id": user.rows[0].id,
                    "username": user.rows[0].user_name,
                    "departmentId": user.rows[0].department_id,
                    "isAdmin": user.rows[0].isadmin,
                    "status": user.rows[0].status

                })
            } else {
                res.sendStatus(401)

            }
        }
    }

    async getUser(req, res) {
        const users = await client.query('SELECT nomination_status, user_name,email,department_id,isadmin,id,admin_department_id,status,main_department,see_child FROM users')
        res.json(users.rows)
    }

    async getoneUser(req, res) {
        const id = req.params.id
            const user = await client.query('SELECT users.planned_release_date,users.nomination_status, users.user_name,users.email,users.department_id,COALESCE(users.main_department, users.department_id) AS main_department,users.isadmin,users.id,users.admin_department_id,users.status,users.see_child,users.phone_number,users.additional_contact,users.distribution_group,users.activity_profile,users.city_id,users.place_of_residence,users.role_id, vacancies.vacancy_code,vacancies.id as vacancy_id,vacancies.grade,vacancies.description,vacancies.status_id as vacancies_status_id,vacancies.company_id,vacancies.name as vacancies_name,vacancies.project_id,vacancies.team_id as vacancies_department_id FROM users LEFT JOIN vacancies ON users.vacancy_id = vacancies.id WHERE users.id = $1', [id])
            res.json(user.rows[0])
    }

    async getupdateUser(req, res) {
        const {depsId, id,phone_number,additional_contact,distribution_group,activity_profile,_id,city_id,cityPlaceChange} = req.body
        if (depsId) {
            const deps = await client.query('UPDATE users set main_department=$2 where id = $1 RETURNING *', [id, depsId])
            res.json(deps.rows[0])
        } else {
            const {_id, username, email, departmentId} = req.body

            if (email.length === 0) {
                res.json({email: 'no email'})
            } else {
                const em = await client.query('SELECT email,id FROM users WHERE email=$1', [email])
                if (em.rowCount === 0) {
                    const users = await client.query('UPDATE users set user_name = $1, email=$2, department_id=$4 where id = $3 RETURNING *', [username, email, _id, departmentId])
                    res.json(users.rows[0])
                } else {
                    const users = await client.query('UPDATE users set user_name = $1, department_id=$3 where id = $2 RETURNING *', [username, _id, departmentId])
                    res.json({password: "change name"})
                }
            }

            if (city_id.length === 0) {

            } else {
                const city = await client.query('UPDATE users SET city_id=$1 WHERE id = $2', [city_id, _id])
            }

            if (city_id === "")
            {
                const city_null = await client.query('UPDATE users SET city_id=null WHERE id = $1', [_id])
            }
                const phone = await client.query('UPDATE users SET phone_number=$1 WHERE id = $2', [phone_number, _id])

                const additionalContact = await client.query('UPDATE users SET additional_contact=$1 WHERE id = $2', [additional_contact, _id])

                const distributionGroup = await client.query('UPDATE users SET distribution_group=$1 WHERE id = $2', [distribution_group, _id])

                const activityProfile = await client.query('UPDATE users SET activity_profile=$1 WHERE id = $2', [activity_profile, _id])

                const placeChangePlace = await client.query('UPDATE users SET place_of_residence=$1 WHERE id = $2', [cityPlaceChange, _id])

        }
    }

    async delUser(req, res) {
        const {userId,status} = req.body
        const users = await client.query('UPDATE users set status=$1 where id = $2 RETURNING *', [status, userId ])
        res.json(users.rows[0])
    }

    async resetPassword(req, res) {
        const {newPassword, userId} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        const users = await client.query('UPDATE users set password=$1 where id = $2 RETURNING *', [hashedPassword, userId])
        res.json({password: "reset password"})
    }

    async newPassword(req, res) {
        const {newPassword, userId, oldPassword} = req.body
        const user = await client.query('SELECT email, password, id, user_name, department_id, isadmin,status FROM users WHERE id = $1', [userId])
        const success = await bcrypt.compare(oldPassword, user.rows[0].password)
        if (success) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            const users = await client.query('UPDATE users set password=$1 where id = $2 RETURNING *', [hashedPassword, userId])
            res.json({password: "change password"})
        } else {
            res.sendStatus(401)
        }
    }

    async get_statistics_all_users(req,res){
        const {id}=req.body
        const count = await client.query('SELECT get_statistics_all_users($1)::json',[id])
        res.json(count.rows)
    }
    async get_Roles(req,res){
        const roles = await client.query('SELECT get_roles()')
        res.json(roles.rows)
    }
}

module.exports = new userController()

