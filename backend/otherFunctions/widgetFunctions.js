const db = require('../posgres');
const errorHandler = require('../utils/errorHandler')


module.exports.getElements = async function (containers, dataContainers) {
    containers.forEach((container) => {
        db.query("SELECT * FROM elements WHERE container_id = $1 ORDER BY id", [container.id], (err, elements) => {
            if (err) {
                errorHandler(elements, err)
            } else {
                if (dataContainers !== 0) {
                    dataContainers.forEach((container) => {
                        elements.rows.forEach((item, idx) => {
                            if (container.id == item.container_id) {
                                container.elements.push(item)
                                container.elements[idx].widgets = [];
                                return;
                            }
                        })
                    })
                }
                getWidgets(elements.rows)
            }
        })
    })
}

module.exports.createElementsForTypeOne = async function (container, res) {
    await db.query('INSERT INTO elements (container_id) VALUES ($1) RETURNING *', [container.rows[0].id],
        (err, elements) => {
            if (err) {
                errorHandler(elements, err)
            } else {
                elements.rows[0].widgets = []
                container.rows[0].elements = [elements.rows[0]]
                console.log(container.rows[0])
                return res.status(200).json([container.rows[0]]);
            }
        })
}

module.exports.createElementsForTypeTwo = async function (container, res) {
    const countElements = [1, 2]
    const returnElement = []
    container.rows[0].elements = []
    countElements.forEach(() => {
        db.query('INSERT INTO elements (container_id) VALUES ($1) RETURNING *', [container.rows[0].id],
            (err, elements) => {
                if (err) {
                    errorHandler(elements, err)
                } else {
                    elements.rows[0].widgets = []
                    container.rows[0].elements.push(elements.rows[0])
                }
            })
    })
    setTimeout(() => {
        returnElement.push(container.rows[0])
        return res.status(200).json(returnElement);
    }, 1000)
}

module.exports.createElementsForTypeThree = async function (container, res) {
    const countElements = [1, 2, 3]
    const returnElement = []
    container.rows[0].elements = []
    countElements.forEach(() => {
        db.query('INSERT INTO elements (container_id) VALUES ($1) RETURNING *', [container.rows[0].id],
            (err, elements) => {
                if (err) {
                    errorHandler(elements, err)
                } else {
                    elements.rows[0].widgets = []
                    container.rows[0].elements.push(elements.rows[0])
                }
            })
    })
    setTimeout(() => {
        returnElement.push(container.rows[0])
        return res.status(200).json(returnElement);
    }, 1000)
}

function getWidgets(elements) {
    elements.forEach((element) => {
        db.query("SELECT * FROM widgets WHERE element_id = $1 ORDER BY id", [element.id], (err, widgets) => {
            if (err) {
                errorHandler(widgets, err)
            } else {
                dataContainers.forEach((container) => {
                    container.elements.forEach((item, idx) => {
                        widgets.rows.forEach((widget) => {
                            if (item.id == widget.element_id) {
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