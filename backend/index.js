const app = require('./app')

const port = process.env.PORT || 5000

const server = app.listen(port, () => console.log(`Server has been started ${port}`))

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:4200"]
    }
})

const texts = ['Beggin']

// io.on('connection', (soket) => {
//     console.log('new connaction made')

//     // soket.on("message", message => {
//     //     console.log("Message receved: " + message)
//     //     texts.push(JSON.parse(message))
//     //     io.emit("message", { type: "new-message", text: texts })
//     //     return;
//     // })

//     // io.emit("message", { type: "new-message", text: texts })

//     // io.emit("table", {type: "table", table: controller.get()})
// })

exports.soketServer = function () {
    return io;
};

// module.exports = io

// async function getTable(req, res) {
//     const contacts = await db.query("SELECT * FROM contacts ORDER BY id")
//     res.status(200).json({ contacts: contacts.rows })
// }