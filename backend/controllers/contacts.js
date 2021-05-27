const Contact = require('../models/Contact')
const errorHandler = require('../utils/errorHandler')


module.exports.get = async function(req, res) {
   try {
       const query = {
           user: req.user.id
       }

       if(req.query.filter) {
           query.filter = +req.query.filter
       }
       //Вывод контактов которые создал определённый юзер
       const contacts = await Contact
       .find({user: req.user.id})
       .sort({date: -1})
       .skip(+req.query.offset)
       .limit(+req.query.limit)

       res.status(200).json(contacts)
   } catch(e) {
       errorHandler(res, e)
   }
}

module.exports.create = async function(req, res) {
    const contact = new Contact({
        name: req.body.name,
        tab_num: req.body.tab_num,
        position: req.body.position ? req.body.position : '',
        division: req.body.division ? req.body.division : '',
        city: req.body.city ? req.body.city : '',
        firm: req.body.firm,
        email: req.body.email,
        phone: req.body.phone ? req.body.phone : '',
        status: req.body.status,
        user: req.user.id
    })
    try {
        await contact.save()
        res.status(201).json(contact)
    } catch(e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function(req, res) {
    const updated = {
        name: req.body.name,
        tab_num: req.body.tab_num,
        email: req.body.email,
        status: req.body.status
    }
    if(req.body.position) {
        updated.position = req.body.position
    }
    if(req.body.division) {
        updated.division = req.body.division
    }
    if(req.body.city) {
        updated.city = req.body.city
    }
    if(req.body.phone) {
        updated.phone = req.body.phone
    }
    try {
        const contact = await Contact.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(contact)
    } catch(e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function(req, res) {
    try {
        await Contact.remove({_id: req.params.id})
        res.status(200).json({
            message: 'Контакт удалён'
        })
    } catch(e) {
        errorHandler(res, e)
    }
}

