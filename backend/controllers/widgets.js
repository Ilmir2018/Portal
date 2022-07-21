const errorHandler = require('../utils/errorHandler')
const db = require('../posgres')
const widgetFunctions = require('../otherFunctions/widgetFunctions')


module.exports.get = async function (req, res) {
    try {
        const pageName = req.query.pageName;
        dataContainers = [];
        await db.query("SELECT id FROM menu WHERE url = $1 ORDER BY id", [pageName], (err, pageId) => {
            if (err) {
                errorHandler(pageId, err)
            } else {
                db.query("SELECT * FROM containers WHERE page_id = $1 ORDER BY id", [pageId.rows[0].id],
                    (err, resultContainers) => {
                        if (err) {
                            errorHandler(result, err)
                        } else {
                            resultContainers.rows.forEach((container) => {
                                container.elements = []
                            })

                            if (resultContainers.rows.length !== 0) {
                                dataContainers.push(...resultContainers.rows)
                                widgetFunctions.getElements(resultContainers.rows, dataContainers);

                                setTimeout(() => {
                                    res.status(200).json(dataContainers)
                                }, 1000)
                            } else {
                                res.status(200).json([[]])
                            }
                        }
                    });
            }
        });
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.createContainerAndElements = async function (req, res) {
    try {
        const { page_id, type } = req.body;
        await db.query('INSERT INTO containers (page_id, type) VALUES ($1, $2) RETURNING *', [page_id, type],
            (err, container) => {
                if (err) {
                    errorHandler(container, err)
                } else {
                    if (container.rows[0].type === 'one') {
                        widgetFunctions.createElementsForTypeOne(container, res)
                    } else if (container.rows[0].type === 'two') {
                        widgetFunctions.createElementsForTypeTwo(container, res)
                    } else if (container.rows[0].type === 'three') {
                        widgetFunctions.createElementsForTypeThree(container, res)
                    }
                }
            });

    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.deleteElementAndWidgets = async function (req, res) {
    try {
        const { element } = req.body;
        await db.query('DELETE FROM elements where id = $1', [element.id], (err, result) => {
            if (err) {
                errorHandler(result, err)
            } else {
                db.query("SELECT * FROM containers WHERE id = $1 ORDER BY id", [element.container_id],
                    (err, resultCont) => {
                        if (err) {
                            errorHandler(resultCont, err)
                        } else {
                            let type;
                            if (resultCont.rows[0].type === 'three') {
                                db.query('UPDATE containers SET type = $1 WHERE id = $2 RETURNING *', ['two', element.container_id])
                                type = 'two';
                            } else if (resultCont.rows[0].type === 'two') {
                                db.query('UPDATE containers SET type = $1 WHERE id = $2 RETURNING *', ['one', element.container_id])
                                type = 'one'
                            } else if (resultCont.rows[0].type === 'one') {
                                db.query('UPDATE containers SET type = $1 WHERE id = $2 RETURNING *', [null, element.container_id])
                                type = 'null'
                            }
                            if (element.widgets.length !== 0) {
                                element.widgets.forEach((widget) => {
                                    db.query(`DROP TABLE ${'widget_' + widget.id};`)
                                })
                            }
                            res.status(200).json(type)
                        }
                    })
            }
        })
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.deleteContainer = async function (req, res) {
    try {
        const { container } = req.body;
        await db.query('DELETE FROM containers where id = $1', [container.id], (err, result) => {
            if (err) {
                errorHandler(resultCont, err)
            } else {
                container.elements.forEach((element) => {
                    if (element.widgets.length !== 0) {
                        element.widgets.forEach((widget) => {
                            if (widget.id !== null) {
                                db.query(`DROP TABLE ${'widget_' + widget.id};`)
                            }
                        })
                    }
                })
            }
        })
        res.status(200).json(container)
    } catch (e) {
        errorHandler(res, e)
    }
}

/**
 * В дальнейшем нужно будет переделать функицю в зависимости от типа виджета
 */
module.exports.getWidget = async function (req, res) {
    try {
        const data = await db.query(`SELECT * FROM ${'widget_' + req.params.id}`)
        res.status(200).json({ data: data.rows, fields: data.fields, tableName: 'widget_' + req.params.id })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.createNewWidget = async function (req, res) {
    try {
        const { dataWidget } = req.body;
        await db.query('INSERT INTO widgets (element_id, type) VALUES ($1, $2) RETURNING *',
            [dataWidget.elementId, dataWidget.widgetType], (err, result) => {
                if (err) {
                    errorHandler(result, err)
                } else {
                    const tableName = "widget_" + String(result.rows[0].id);
                    db.query(`CREATE TABLE IF NOT EXISTS ${tableName}()`,
                        (err, result2) => {
                            if (err) {
                                errorHandler(result2, err)
                            } else {
                                dataWidget.columns.forEach((column) => {
                                    let type;
                                    if (column == 'id') {
                                        type = `integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 )`
                                    } else {
                                        type = 'text NULL'
                                    }
                                    db.query(`ALTER TABLE ${tableName}
                                        ADD "${column}" ${type}`, (err, result) => {
                                        if (err) {
                                            console.log('err1', err)
                                            errorHandler(result, err)
                                        }
                                    })
                                })
                                setTimeout(() => {
                                    dataWidget.rows.forEach((row, index) => {
                                        let resultColumns = dataWidget.columns.map((item) => {
                                            return '"' + item + '"';
                                        })
                                        let resultRow = Object.values(row).map((item) => {
                                            return `'${item}'`;
                                        })
                                        db.query(`INSERT INTO ${tableName} (${resultColumns.join(', ')}) VALUES ('${index + 1}', ${resultRow.join(', ')}) RETURNING *`,
                                            (err, result) => {
                                                if (err) {
                                                    console.log(err)
                                                    errorHandler(result, err)
                                                }
                                            })
                                    })
                                }, 1000)
                                return res.status(200).json(dataWidget)
                            }
                        })
                }
            })
    } catch (e) {
        errorHandler(res, e)
    }
}




