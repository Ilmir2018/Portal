const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Contact = require('../models/Contact')
const Role = require('../models/Role')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')


module.exports.login = async function (req, res) {
    const candidate = await User.findOne({ email: req.body.email })

    //Настоящее время
    const updated = {
        date: new Date()
    }

    if (candidate) {
        //Проверка пароля, пользователь есть.
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            //Генерация токена, пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id,
                roles: candidate.roles
            }, keys.jwt, { expiresIn: 3600 })

            //Обновление даты последнего посещения
            const contact = await Contact.findOneAndUpdate(
                { user: candidate._id },
                { $set: updated },
                { new: true }
            )
            
            //Передаём в ответе на авторизацию, токен и роль пользователя
            res.status(200).json({
                token: `Bearer ${token}`,
                role: candidate.roles
            })
        } else {
            //Пароли не совпали
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова'
            })
        }
    } else {
        //Пользователя нет, ошибка.
        res.status(404).json({
            message: 'Пользователь с таки email не найден.'
        })
    }
}

module.exports.register = async function (req, res) {

    const candidate = await User.findOne({ email: req.body.email })

    if (candidate) {
        //Пользователь существует, отдаём ошибку
        res.status(409).json({
            message: 'Такой email уже занят.'
        })
    } else {
        //Создать пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password

        const userRole = await Role.findOne({ value: "ADMIN" })
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
            roles: [userRole.value]
        })

        //Создаём так же новый контакт при регистрации
        const contact = new Contact({
            name: req.body.name = "Введите данные",
            firm: req.body.firm = "Введите данные",
            email: req.body.email,
            phone: req.body.phone = "Введите данные",
            user: user.id,
            roles: [userRole.value]
        })

        try {
            await user.save()
            await contact.save()
            res.status(201).json(user)
        } catch (e) {
            //Обработать ошибку
            errorHandler(res, e)
        }

    }
}