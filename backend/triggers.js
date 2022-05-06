const db = require('./posgres')
const cron = require('node-cron');
const reader = require('xlsx')
const importData = require('./otherFunctions/importTable')

let map = new Map();

setTimeout(() => {
    returnTriggers()
}, 1000)


//При удалении триггера из таблицы мы останавливаем его в системе, 
//при добавлении нового мы заполняем глобальный мап
// map.get('one').stop();
// map.get('two').stop();


async function returnTriggers() {
    //Организуем массив триггеров которые запускаются сразу при запуске системы
    const triggers = await db.query("SELECT * FROM triggers ORDER BY id")
    if (triggers.rows.length !== 0) {
        triggers.rows.forEach((item) => {
            map.set(item.table_search, cron.schedule(item.update_frequency, function () {
                console.log(item)
                triggerUpdateDB(item.table_search, item.source_location, item.list_name, item.row_count)
            }));
        })
    }
}

async function triggerUpdateDB(table, importFile, list, countRows) {
    //Очищаем имеющуюся таблицу
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


module.exports = map