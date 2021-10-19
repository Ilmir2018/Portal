const errorHandler = require('../utils/errorHandler')
const bcrypt = require('bcryptjs')
const db = require('../posgres')


module.exports.get = async function (req, res) {
    try {
        const contacts = await db.query("SELECT * FROM contacts ORDER BY id")
        res.status(200).json({ contacts: contacts.rows })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const contact = await db.query("SELECT * FROM contacts WHERE id = $1 ORDER BY id", [req.params.id])
        res.status(200).json(contact)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const { email, password, name, firm, phone } = req.body

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)

        const user = await db.query(
            'INSERT INTO users (email, password, date, roles) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, hashPassword, new Date(), 'USER'], (err, result) => {
                if (err) {
                    errorHandler(result, err)
                } else {
                    db.query(
                        `INSERT INTO contacts (email, password, roles, date, imagesrc, name, firm, phone, user_id)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [email, hashPassword, 'USER', new Date(),
                        req.file ? req.file.path : '', name, firm, phone, result.rows[0].id], (err, result2) => {
                            if (err) {
                                errorHandler(result2, err)
                            } else {
                                res.status(200).json({ result, result2 })
                                return;
                            }
                        }
                    )
                }
            }
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {

    try {
        const { email, password, name, firm, phone } = req.body

        const unit = await db.query(
            `SELECT * FROM contacts WHERE id = $1`, [req.params.id]
        )

        async function updateFunc(password) {
            const user = await db.query(`UPDATE contacts set email = $1, password = $2, name = $3, firm = $4,
     phone = $5, imagesrc = $6 where id = $7 RETURNING *`,
                [email, password, name, firm, req.body.phone ? phone : '', req.file ? req.file.path : '', req.params.id], (err, result) => {
                    if (err) {
                        errorHandler(result, err)
                    } else {
                        db.query(
                            `UPDATE users set email = $1, password = $2 where id = $3 RETURNING *`,
                            [email, password, result.rows[0].user_id], (err, result2) => {
                                if (err) {
                                    errorHandler(result2, err)
                                } else {
                                    res.status(200).json({ result, result2 })
                                    return;
                                }
                            }
                        )
                    }
                }
            )
        }

        if (password !== undefined) {
            const salt = bcrypt.genSaltSync(10)
            const hashPassword = bcrypt.hashSync(password, salt)
            updateFunc(hashPassword)
        } else {
            updateFunc(unit.rows[0].password)
        }

    } catch (e) {
        errorHandler(res, e)
    }
}



module.exports.delete = async function (req, res) {
    try {
        const id = req.params.id
        const menuItem = await db.query('DELETE FROM contacts where id = $1', [id], (err, result) => {
            if (err) {
                errorHandler(result, err)
            } else {
                // console.log(result)
                db.query(
                    `DELETE FROM users where id = $1`,
                    [req.query.user_id], (err, result2) => {
                        if (err) {
                            errorHandler(result2, err)
                        } else {
                            res.status(200).json({message: 'Контакт удалён'})
                            return;
                        }
                    }
                )
            }
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

