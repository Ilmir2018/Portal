const jsonwebtoken = require('jsonwebtoken')
const { jwt } = require('../config/keys.dev')

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            const { roles: userRoles } = jsonwebtoken.verify(token, jwt)

            if (!token) {
                return res.status(403).json({ message: "Пользователь не авторизован" })
            }

            let hasRole = false
            
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })
            if (!hasRole) {
                return res.status(403).json({ message: "У вас нет доступа" })
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: "Пользователь не авторизован" })
        }
    }
}