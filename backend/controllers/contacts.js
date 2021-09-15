const Contact = require('../models/Contact')
const User = require('../models/User')
const Menu = require('../models/Menu')
const Submenu = require('../models/Submenu')
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

        // const menuItem = new Menu(
        //     {
        //         _id: 1,
        //         parentId: 0,
        //         title: 'Настройки2',
        //         url: '/settings',
        //         subtitle: [
        //             new Menu({
        //                 _id: 2,
        //                 parentId: 1,
        //                 title: "Пользователи",
        //                 url: '/contacts',
        //                 subtitle: []
        //             }),
        //             new Menu({
        //                 _id: 3,
        //                 parentId: 1,
        //                 title: "Пользователи",
        //                 url: '/contacts',
        //                 subtitle: []
        //             })
        //         ]
        //     })

        // const menuItem = new Menu(
        //     {
        //         title: 'Профиль',
        //         url: '/profile',
        //         subtitle: []
        //     })

        // const menuItem = new Menu(
        //     {
        //         title: 'Меню',
        //         url: '/menu',
        //         subtitle: []
        //     })

        // const menuItem = new Menu(
        //     {
        //         title: 'Test',
        //         url: '/test',
        //         subtitle: [
        //             {
        //                 title: "Первый уровень",
        //                 url: '/test/first',
        //                 subtitle: [
        //                     {
        //                         title: "Второй уровень",
        //                         url: '/test/first/second',
        //                         subtitle: [
        //                             {
        //                                 title: "Третий уровень 1",
        //                                 url: '/test/first/second/theed1',
        //                                 subtitle: []
        //                             },
        //                             {
        //                                 title: "Третий уровень 2",
        //                                 url: '/test/first/second/theed2',
        //                                 subtitle: []
        //                             },
        //                             {
        //                                 title: "Третий уровень 3",
        //                                 url: '/test/first/second/theed3',
        //                                 subtitle: []
        //                             }
        //                         ]
        //                     }
        //                 ]
        //             }
        //         ]
        //     })

        // menuItem.save()

        // const updated = {
        //     subtitle: [
        //         {
        //             title: "Первый уровень",
        //             url: '/first',
        //             subtitle: [
        //                 {
        //                     title: "Второй уровень",
        //                     url: '/second',
        //                     subtitle: [
        //                         {
        //                             title: "Третий уровень",
        //                             url: '/theed',
        //                             subtitle: null
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // }

        // const menuUdate = await Menu.findOneAndUpdate(
        //     { _id: "61140f3cb673373d44fcd1a9" },
        //     { $set: updated },
        //     { new: true }
        // )

        //Вывод контактов которые создал определённый юзер
        const contacts = await Contact
            .find(query)
            .skip(+req.query.offset)
            .limit(+req.query.limit)

        const menu = await Menu
            .find(query2)

        res.status(200).json({
            contacts: contacts, menu: menu
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

