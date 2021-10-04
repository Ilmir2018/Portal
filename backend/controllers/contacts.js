const Contact = require('../models/Contact')
const User = require('../models/User')
const Menu = require('../models/Menu')
const Role = require('../models/Role')
const errorHandler = require('../utils/errorHandler')

const bcrypt = require('bcryptjs')


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

        // const query2 = {

        // }

        // if (req.query.title) {
        //     query2.title = req.query.title
        // }

        // if (req.query.url) {
        //     query2.url = req.query.url
        // }

        // if (req.query.subtitle) {
        //     query2.subtitle = req.query.subtitle
        // }

        //Вывод контактов которые создал определённый юзер
        const contacts = await Contact
            .find(query)
            .skip(+req.query.offset)
            .limit(+req.query.limit)

        // const menu = await Menu
        //     .find(query2)

        res.status(200).json({
            contacts: contacts
            // , menu: menu
        })
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
    const userRole = await Role.findOne({ value: "USER" })

    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password

    console.log(password)

    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(password, salt),
        date: new Date(),
        roles: [userRole.value]
    })

    const contact = new Contact({
        name: req.body.name,
        firm: req.body.firm,
        email: req.body.email,
        password: bcrypt.hashSync(password, salt),
        phone: req.body.phone ? req.body.phone : '',
        user: user.id,
        roles: [userRole.value],
        imageSrc: req.file ? req.file.path : ''
    })


    try {
        await user.save()
        await contact.save()
        res.status(201).json(contact)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    const updatedContact = {
        name: req.body.name,
        email: req.body.email,
        firm: req.body.firm,
    }

    const updatedUser = {}

    if (req.body.phone) {
        updatedContact.phone = req.body.phone
    }

    
    if (req.body.password) {
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        console.log(password)
        updatedUser.password = bcrypt.hashSync(password, salt)
    }

    if (req.file) {
        updatedContact.imageSrc = req.file.path
    }

    try {
        const contact = await Contact.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updatedContact },
            { new: true }
        )

        const user = await User.findOneAndUpdate(
            { _id: contact.user },
            { $set: updatedUser },
            { new: true }
        )

        res.status(200).json({contact, user})
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

