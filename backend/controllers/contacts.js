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

module.exports.getFields = async function (req, res) {
    try {
        const fields = await db.query("SELECT * FROM contacts_fields ORDER BY id")
        res.status(200).json({ fields: fields.rows })
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
                    console.log(req.file)
                    db.query(
                        `INSERT INTO contacts (email, password, roles, date, imagesrc, name, firm, phone, user_id)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [email, hashPassword, 'USER', new Date(),
                        req.file ? req.file.path : '', name, firm, phone, result.rows[0].id], (err, result2) => {
                            if (err) {
                                errorHandler(result2, err)
                            } else {
                                const menuItems = db.query(`SELECT id FROM menu;
                                `, (err, result3) => {
                                    if (err) {
                                        errorHandler(result, err)
                                    }
                                    //Обновление таблицы roles, добавление туда на каждую страницу возможности менять права
                                    result3.rows.forEach((item) => {
                                        db.query(
                                            `INSERT INTO roles (user_id, title_id, permissions)
                                            VALUES ($1, $2, $3) RETURNING *`, [result.rows[0].id, item.id, [true, false, false]],
                                            (err, result4) => {
                                                if (err) {
                                                    errorHandler(result4, err)
                                                }
                                            }
                                        )
                                    })
                                    res.status(200).json({ message: 'Контакт добавлен' })
                                    return;
                                })
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
        const data = req.body

        for (let cont in data) {
            if (cont != 'imagesrc') {
                if (cont == 'password') {
                    const salt = bcrypt.genSaltSync(10)
                    const hashPassword = bcrypt.hashSync(data[cont], salt)
                    const user = await db.query(`UPDATE contacts set ${cont} = $1 where id = ${req.params.id} RETURNING *`, [hashPassword],
                        (err, result) => {
                            if (err) {
                                errorHandler(result, err)
                            } else {
                                db.query(
                                    `UPDATE users set ${cont} = $1 where id = ${result.rows[0].user_id} RETURNING *`, [hashPassword],
                                    (err, result2) => {
                                        if (err) {
                                            errorHandler(result2, err)
                                        }
                                    }
                                )
                            }
                        })
                } else {
                    const user = await db.query(`UPDATE contacts set ${cont} = $1 where id = ${req.params.id} RETURNING *`, [data[cont]],
                        (err, result) => {
                            if (err) {
                                errorHandler(result, err)
                            } else {
                                if (cont == 'email' || cont == 'role') {
                                    db.query(
                                        `UPDATE users set ${cont} = $1 where id = ${result.rows[0].user_id} RETURNING *`, [data[cont]],
                                        (err, result2) => {
                                            if (err) {
                                                errorHandler(result2, err)
                                            }
                                        }
                                    )
                                }
                            }
                        })
                }
            }
        }
        //Загружаем другое изображение если оно меняется
        if (req.file) {
            const user = await db.query(`UPDATE contacts set imagesrc = $1 where id = ${req.params.id} RETURNING *`, [req.file ? req.file.path : ''])
        }
        res.status(200).json({ message: 'Контакт обновлён' })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateFields = async function (req, res) {
    try {
        //Функция будет отвечать либо за обновление видимых столбцов таблице либо за добавление нового столбца
        //в зависимости от того какое значение будет присылаться с фронта

        if (req.body[0] == true) {
            const fields = req.body[1]
            if (fields != null) {
                fields.forEach((item) => {
                    const changeFields = db.query('UPDATE contacts_fields SET field = $1, filter = $2 WHERE id = $3 RETURNING *',
                        [item.field, item.filter, item.id], (err, result) => {
                            if (err) {
                                errorHandler(result, err)
                            }
                        })
                })
                return res.status(200).json({ message: 'Данные обновлены!' })
            }
        } else {
            let field = req.body[2]
            if (field != null) {
                console.log(field)
                const addField = db.query(`ALTER TABLE contacts ADD ${field} CHARACTER VARYING(100) NULL;`, (err, result) => {
                    if (err) {
                        console.log(err)
                        errorHandler(result, err)
                        return res.status(200).json({ message: 'Что то пошло не так' })
                    } else {
                        db.query(`INSERT INTO contacts_fields (field, filter)
                        VALUES ($1, $2) RETURNING *`, [field, false],
                            (err, result2) => {
                                if (err) {
                                    errorHandler(result2, err)
                                }
                                return res.status(200).json({ message: 'Столбец добавлен!', id: result2.rows[0].id })
                            })
                    }
                })
            }
        }
    } catch (e) {
        errorHandler(res, e)
    }
}



module.exports.delete = async function (req, res) {
    try {
        const id = req.params.id
        const contact = await db.query('DELETE FROM contacts where id = $1', [id], (err, result) => {
            if (err) {
                errorHandler(result, err)
            } else {
                db.query(
                    //Удаляем данные из дтаблицы ролей для контакта
                    `DELETE FROM roles WHERE user_id = $1 RETURNING *`,
                    [req.query.user_id], (err, result2) => {
                        if (err) {
                            errorHandler(result2, err)
                        } else {
                            const roleItems = db.query(`DELETE FROM users where id = $1 
                            `, [req.query.user_id], (err, result3) => {
                                if (err) {
                                    errorHandler(result3, err)
                                }
                                else {
                                    res.status(200).json({ message: 'Контакт удалён' })
                                    return;
                                }
                            })

                        }
                    }
                )
            }
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.deleteFields = async function (req, res) {
    try {
        const field = await db.query(`ALTER TABLE contacts DROP COLUMN ${req.query.field}`, (err, result) => {
            if (err) {
                errorHandler(result, err)
                return res.status(200).json({ message: 'Что то пошло не так' })
            } else {
                db.query(`DELETE FROM contacts_fields WHERE id = $1 RETURNING *`, [req.params.id],
                    (err, result2) => {
                        if (err) {
                            errorHandler(result2, err)
                            return res.status(200).json({ message: 'Что то пошло не так' })
                        }
                    })
            }
        })
        res.status(200).json({ message: 'Столбец удалён' })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateField = async function (req, res) {
    try {
        const oldField = req.body[0]
        const newField = req.body[1]
        const field = await db.query(`ALTER TABLE contacts RENAME COLUMN ${oldField} TO ${newField}`, (err, result) => {
            if (err) {
                errorHandler(result, err)
                return res.status(200).json({ message: 'Что то пошло не так' })
            } else {
                db.query(`UPDATE contacts_fields SET field = $1 WHERE id = $2 RETURNING *`, [newField, req.params.id], (err, result2) => {
                    if (err) {
                        errorHandler(result2, err)
                        return res.status(200).json({ message: 'Что то пошло не так' })
                    }
                })
            }
        })
        res.status(200).json({ message: 'Столбец изменён' })
    } catch (e) {
        errorHandler(res, e)
    }
}

