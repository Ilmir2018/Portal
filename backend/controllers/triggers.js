const errorHandler = require('../utils/errorHandler')
const db = require('../posgres')
const reader = require('xlsx')
let triggers = require('../triggers')
const importData = require('../otherFunctions/importTable')
const cron = require('node-cron');


module.exports.get = async function (req, res) {
    try {
        const triggers = await db.query("SELECT * FROM triggers ORDER BY id")
        const data = await db.query("SELECT * FROM data ORDER BY id")
        res.status(200).json({ data: data.rows, triggers: triggers.rows })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const { table, frequency, importFile, list, countRows } = req.body
        console.log(req.body)
        //При добавлении триггера в таблицу он так же запускается на сервере, добавляясь в общую коллекцию map
        triggers.set(table, cron.schedule(frequency.frequency, function () {
            triggerUpdateDB(table, importFile, list, countRows)
        }));
        // triggerUpdateDB(table, frequency, importFile, list, countRows)
        const createTrigger = await db.query(`INSERT INTO triggers (table_search, source_location, update_frequency, list_name, row_count, decryption)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [table, importFile, frequency.frequency, list, countRows, frequency.decryption])
        return res.status(200).json("Успех!")
    } catch (e) {
        errorHandler(res, e)
    }
}

async function triggerUpdateDB(table, importFile, list, countRows) {
    //Очищаем имеющуюся таблицу
    console.log('Обновляем таблицу')
    const dropTable = await db.query(`DROP TABLE ${table};`)
    const file = reader.readFile(importFile, { type: 'binary' })
    let data = []
    const temp = reader.utils.sheet_to_json(file.Sheets[list], { header: 1 })

    temp.forEach((res) => {
        data.push(res)
    })

    let columns = data[countRows - 2]

    columns.unshift('id')

    data = data.splice(countRows - 1)

    let changedArr = []

    //Преобразуем массив избавляясь отпустых элементов <1 empty item> заменяя их на null
    data.forEach((item) => {
        let changedData = [...item];
        let newArr = []
        changedData.forEach((item) => {
            if (item == undefined) {
                newArr.push(null)
            } else {
                newArr.push(item)
            }
        })
        changedArr.push(newArr)
    })
    //Создание таблицы в бд
    importData.importTable(table, columns, changedArr)
}
