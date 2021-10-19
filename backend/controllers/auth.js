const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')
const db = require('../posgres')


module.exports.login = async function (req, res) {

    const { email, password } = req.body

    const candidate = db.query(
        `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
            if (err) {
                errorHandler(results, err)
            }


            if (result.rows.length == 0) {
                res.status(409).json({
                    message: 'Введите верные данные, такого email нет'
                })
            } else {

                const passwordResult = bcrypt.compareSync(password, result.rows[0].password)

                if (passwordResult) {

                    const token = jwt.sign({
                        email: result.rows[0].email,
                        userId: result.rows[0].id,
                        roles: result.rows[0].roles
                    }, keys.jwt, { expiresIn: 3600 })

                    res.status(200).json({
                        token: `Bearer ${token}`,
                        role: result.rows[0].roles,
                        id: result.rows[0].id
                    })
                }
                else {
                    //Пароли не совпали
                    res.status(401).json({
                        message: 'Пароли не совпадают. Попробуйте снова'
                    })
                }
            }
            //Обновление даты в таблице users
            db.query(
                `UPDATE users set date = $1 where id = $2 RETURNING *`, [new Date(), result.rows[0].id]
            )
        }
    )
}

module.exports.register = async function (req, res) {

    const { email, password } = req.body;

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)

    const user = await db.query(
        `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
            if (err) {
                errorHandler(results, err)
            }

            if (result.rows.length > 0) {
                res.status(409).json({
                    message: 'Такой email уже занят.'
                })
            } else {
                db.query(
                    `INSERT INTO users (email, password, date, roles)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *`, [email, hashPassword, new Date(), 'USER'], (err, result) => {
                    if (err) {
                        errorHandler(result, err)
                    } else {
                        db.query(
                            `INSERT INTO contacts (email, password, roles, date, user_id)
                            VALUES ($1, $2, $3, $4, $5)
                            RETURNING *`, [email, hashPassword, 'USER', new Date(), result.rows[0].id], (err, result2) => {
                            if (err) {
                                errorHandler(result2, err)
                            } else {
                                res.status(201).json({
                                    message: 'Успешная регистрация'
                                })
                                return;
                            }
                        }
                        )
                    }
                })
            }
        }
    )
}