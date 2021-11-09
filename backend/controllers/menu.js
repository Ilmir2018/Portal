const errorHandler = require('../utils/errorHandler')
const db = require('../posgres')


module.exports.get = async function (req, res) {
    try {
        const menus = await db.query("SELECT * FROM menu ORDER BY id")
        res.status(200).json(menus.rows)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {
        const { id, title, url } = req.body
        const menu = await db.query('UPDATE menu set title = $1, url = $2 where id = $3 RETURNING *',
            [title, url, id])
        res.status(200).json(menu.rows[0])
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const { title, url, parent_id } = req.body
        const newMenu = await db.query('INSERT INTO menu (title, url, parent_id) VALUES ($1, $2, $3) RETURNING *',
         [title, url, parent_id])
        res.status(200).json(newMenu.rows[0])
    } catch (e) {                             
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try {
        const id = req.params.id
        const menuItem = await db.query('DELETE FROM menu where id = $1', [id])
        res.status(200).json(menuItem.rows[0])
    } catch (e) {
        errorHandler(res, e)
    }
}