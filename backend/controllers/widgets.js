const errorHandler = require('../utils/errorHandler')
const db = require('../posgres')
const widgetFunctions = require('../otherFunctions/widgetFunctions')


module.exports.get = async function (req, res) {
    try {
        const pageName = req.query.pageName;
        dataContainers = [];
        await db.query("SELECT id FROM pages WHERE title = $1 ORDER BY id", [pageName], (err, pageId) => {
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
        const element_id = req.params.id, container_id = req.query.container_id;
        await db.query('DELETE FROM elements where id = $1', [element_id], (err, result) => {
            if (err) {
                errorHandler(result, err)
            } else {
                const container = db.query("SELECT * FROM containers WHERE id = $1 ORDER BY id", [container_id],
                    (err, resultCont) => {
                        if (err) {
                            errorHandler(resultCont, err)
                        } else {
                            let type;
                            if (resultCont.rows[0].type === 'three') {
                                db.query('UPDATE containers SET type = $1 WHERE id = $2 RETURNING *', ['two', container_id])
                                type = 'two';
                            } else if (resultCont.rows[0].type === 'two') {
                                db.query('UPDATE containers SET type = $1 WHERE id = $2 RETURNING *', ['one', container_id])
                                type = 'one'
                            } else if (resultCont.rows[0].type === 'one') {
                                db.query('UPDATE containers SET type = $1 WHERE id = $2 RETURNING *', [null, container_id])
                                type = 'null'
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
        const container_id = req.params.id
        await db.query('DELETE FROM containers where id = $1', [container_id])
        res.status(200).json(container_id)
    } catch (e) {
        errorHandler(res, e)
    }
}




