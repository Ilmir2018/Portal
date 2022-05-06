const app = require('./app')
// const reader = require('xlsx')
// const cron = require('node-cron');

const port = process.env.PORT || 5000

const server = app.listen(port, () => console.log(`Server has been started ${port}`))

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:4200"]
    }
})

io.on('connection', (soket) => {
    console.log('new connaction made')
    soket.on("table", table => {
        io.emit("table", { type: "table", table: JSON.parse(table) })
    })
    // io.soketServer().emit("table", { type: "table", table: contacts.rows })
    soket.on('disconnect', function () {
        console.log('user disconnected');
    });
})

// exports.soketServer = function () {
//     return io;
// };

// console.log(file)

// const file = reader.readFile(`C:/Users/asu-KiyametdinovIH/Downloads/main.xlsx`)

// const sheets = file.SheetNames

// // cron.schedule('1 * * * * *', function () {
// //     console.log(sheets)
// // });