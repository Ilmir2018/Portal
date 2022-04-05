const errorHandler = require('../utils/errorHandler')
const db = require('../posgres')


module.exports.get = async function (req, res) {
    try {
        const menus = await db.query("SELECT * FROM menu ORDER BY level")
        res.status(200).json(menus.rows)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getPermissions = async function (req, res) {
    const permissions = await db.query(`SELECT contacts.user_id, contacts.email, contacts.name, contacts.firm,
     roles.permissions from contacts JOIN roles ON contacts.user_id = roles.user_id AND roles.title_id = ${req.query.itemId};`)
    res.status(200).json(permissions.rows)

}

module.exports.update = async function (req, res) {
    try {
        const { id, title, url } = req.body
        const menu = await db.query('UPDATE menu set title = $1, url = $2 where id = $3 RETURNING *',
            [title, url, id])
        res.status(200).json(menu.rows[0])
    } catch (e) {
        console.log(e)
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const { title, url, parent_id, level } = req.body
        const newMenu = await db.query('INSERT INTO menu (title, url, parent_id, level) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, url, parent_id, level], (err, result) => {
                if (err) {
                    errorHandler(result, err)
                } else {
                    const users = db.query(`SELECT id FROM users;
                `, (err, result2) => {
                        if (err) {
                            errorHandler(result2, err)
                        }
                        else {
                            //Обновление таблицы roles, добавление туда на каждую страницу возможности менять права
                            result2.rows.forEach((item) => {
                                db.query(
                                    `INSERT INTO roles (user_id, title_id, permissions)
                                    VALUES ($1, $2, $3) RETURNING *`, [item.id, result.rows[0].id, [true, false, false]],
                                    (err, result3) => {
                                        if (err) {
                                            // console.log(result3)
                                            errorHandler(result3, err)
                                        } else {
                                            console.log('Успешно')
                                        }
                                    }
                                )
                            });
                        }
                    })
                    console.log(result.rows[0])
                    res.status(200).json(result.rows[0])
                }
            })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try {
        //Получаем строку
        let mystr = req.query.arrayItems
        //Превращаем её в масси в с разделителем в виде запятой
        let arr = mystr.split(',');
        console.log(arr)
        arr.forEach((item) => {
            //Удаляем сначала записи из таблицы ролей для контакта
            const roleItems = db.query('DELETE FROM roles WHERE title_id = $1 RETURNING *', [item], (err, result) => {
                if (err) {
                    errorHandler(result, err)
                    console.log('err roles', err)
                } else {
                    //Затем удаляем сами пункты меню
                    const menuItem = db.query(`DELETE FROM menu WHERE id = $1 RETURNING *
                `, [item], (err, result2) => {
                        if (err) {
                            errorHandler(result2, err)
                            console.log('err menu', err)
                        }
                        else {
                            console.log(result2.rows)
                        }
                    })
                }
            })
        })
        res.status(200).json('Удалено успешно')
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.modal = async function (req, res) {
    try {
        const title_id = req.body[0], contacts = req.body[1]
        if (contacts != null) {
            contacts.forEach((item) => {
                const permissions = db.query('UPDATE roles set permissions = $1 WHERE title_id = $2 and user_id = $3 RETURNING *',
                    [item.permissions, title_id, item.user_id], (err, result) => {
                        if (err) {
                            errorHandler(result, err)
                        }
                    })
            })
            return res.status(200).json({ message: 'Права контактов изменены!' })
        }
        return res.status(200).json({ message: 'Котакты не выбраны' })
    } catch (e) {
        errorHandler(res, e)
    }
}


/**
 * Функция для изменения порядка расположения пунктов меню
 */
module.exports.changeStructure = async function (req, res) {
    try {
        const elements = req.body[0], parent_id = req.body[1], change = req.body[2]
        if (req.body[2]) {
            elements.forEach((item, idx) => {
                const structureChange = db.query('UPDATE menu set parent_id = $1, level = $2 where id = $3 RETURNING *',
                    [parent_id, idx, item.id], (err, result) => {
                        if (err) {
                            console.log(err)
                            errorHandler(result, err)
                        }
                    })
            })
        } else {
            elements.forEach((item, idx) => {
                const structureChange = db.query('UPDATE menu set level = $1 where id = $2 RETURNING *',
                    [item.level, item.id], (err, result) => {
                        if (err) {
                            console.log(err)
                            errorHandler(result, err)
                        }
                    })
            })
        }

        return res.status(200).json({ message: 'Порядок меню изменён' })
    } catch (e) {
        errorHandler(res, e)
    }
}