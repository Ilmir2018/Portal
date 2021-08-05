const Contact = require('../models/Contact')
const User = require('../models/User')
const Role = require('../models/Role')
const errorHandler = require('../utils/errorHandler')
const iconv = require('iconv-lite')


module.exports.get = async function (req, res) {
    try {
        const query = {
            //Закоментировано чтобы выводились контакты для любых пользователей пока
            // user: req.user.id
        }

        if (req.query.phone) {
            query.phone = req.query.phone
        }

        if (req.query.name) {
            query.name = req.query.name
        }

        if (req.query.firm) {
            query.firm = req.query.firm 
        }

        if (req.query.email) {
            query.email = req.query.email
        }

        //Вывод контактов которые создал определённый юзер
        const contacts = await Contact
            .find(query)
            .skip(+req.query.offset)
            .limit(+req.query.limit)

        res.status(200).json(contacts)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const contact = await Contact.findById(req.params.id)
        res.status(200).json(contact)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    const contact = new Contact({
        name: req.body.name,
        firm: req.body.firm,
        email: req.body.email,
        phone: req.body.phone ? req.body.phone : '',
        user: req.user.id
    })
    try {
        await contact.save()
        res.status(201).json(contact)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    const updated = {
        name: req.body.name,
        email: req.body.email,
        firm: req.body.firm,
    }

    if (req.body.phone) {
        updated.phone = req.body.phone
    }


    try {
        const contact = await Contact.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updated },
            { new: true }
        )

        res.status(200).json(contact)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    try {
        await Contact.remove({ _id: req.params.id })
        res.status(200).json({
            message: 'Контакт удалён'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

