const Menu = require('../models/Menu')
const errorHandler = require('../utils/errorHandler')


module.exports.get = async function (req, res) {
    try {
        const query2 = {

        }

        if (req.query.title) {
            query2.title = req.query.title
        }

        if (req.query.url) {
            query2.url = req.query.url
        }

        if (req.query.subtitle) {
            query2.subtitle = req.query.subtitle
        }

        //Вывод контактов которые создал определённый юзер

        const menu = await Menu
            .find(query2)

        res.status(200).json(menu)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    const updated = {
        title: req.body.title,
        url: req.body.url,
        subtitle: req.body.subtitle
    }
    console.log(req.body)
    try {
        const menu = await Menu.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updated },
            { new: true }
        )
        
        res.status(200).json(menu)
    } catch (e) {
        errorHandler(res, e)
    }
}