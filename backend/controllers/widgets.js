const errorHandler = require('../utils/errorHandler')
const db = require('../posgres')
let dataContainers = []


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
                            //Сделать перебор контейнеров относящихся к данной странице, желательно сдесь сделать функцию
                            resultContainers.rows.forEach((container) => {
                                container.elements = []
                            })
                            dataContainers.push(...resultContainers.rows)
                            getElements(resultContainers.rows, res);
                        }
                    });
            }
        });
        setTimeout(() => {
            res.status(200).json({ data: dataContainers })
        }, 1000)   
    } catch (e) {
        errorHandler(res, e)
    }
}


function getElements(containers, res) {
    containers.forEach((container) => {
        db.query("SELECT * FROM elements WHERE container_id = $1 ORDER BY id", [container.id], (err, elements) => {
            if (err) {
                errorHandler(elements, err)
            } else {
                dataContainers.forEach((container) => {
                    elements.rows.forEach((item, idx) => {
                        if (container.id == item.container_id) {
                            container.elements.push(item)
                            container.elements[idx].widgets = [];
                            return;
                        }
                    })
                })
                getWidgets(elements.rows, res)
            }
        })
    })
}

function getWidgets(elements, res) {
    elements.forEach((element) => {
        db.query("SELECT * FROM widgets WHERE element_id = $1 ORDER BY id", [element.id], (err, widgets) => {
            if (err) {
                errorHandler(widgets, err)
            } else {
                dataContainers.forEach((container) => {
                    container.elements.forEach((item, idx) => {
                        widgets.rows.forEach((widget) => {
                            if(item.id == widget.element_id) {
                                container.elements[idx].widgets.push(widget)
                                return;
                            }
                        })
                    })
                })
            }
        })
    })
}


module.exports.getById = async function (req, res) {
    try {

    } catch (e) {
        errorHandler(res, e)
    }
}


