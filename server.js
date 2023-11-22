const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

const port = 3000

app.set('view engine', 'ejs')
// serve files from the public directory
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log('joined room', roomId, userId)
        
        // https://socket.io/docs/v3/rooms/
        socket.join(roomId)
        // had to drop broadcast here because it was causing an error
        //socket.to(roomId).broadcast.emit('user-connected', userId)
        // TypeError: Cannot read properties of undefined (reading 'emit')
        socket.to(roomId).emit('user-connected', userId)


        //socket.on('disconnect', () => {
            //console.log('disconnected')
            //socket.to(roomId).broadcast.emit('user-disconnected', userId)
        //})
    })
})


server.listen(port)
