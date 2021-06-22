// Packages we need
var bot = require('./bot.js')
var express = require('express')
var app = express()

// Use a static website
app.use(express.static('public'))

// Use static resources
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/images', express.static(__dirname + '/public/images'))

// Start express server
var server = app.listen(8081, function () {
    var port = server.address().port
    console.log('Server started at http://localhost:%s', port)
})

// Use the websockets
var WSS = require('websocket').server,
    http = require('http')
var server = http.createServer()
server.listen(8181)

//Create a bot that still cannot connect with the socket server
var myBot = new bot()

// Create a server
var wss = new WSS({
    httpServer: server,
    autoAcceptConnections: false
})
var connections = {}

// Use this to connect client socket with the server
wss.on('request', function (request) {
    var connection = request.accept('chat', request.origin)

    connection.on('message', function (message) {
        var name = ''

        for (var key in connections) {
            if (connection === connections[key]) {
                name = key
            }
        }

        var data = JSON.parse(message.utf8Data)
        var msg = 'leer'

        // Variables to save the last message and the sender
        var uname
        var utype
        var umsg

        switch (data.type) {
            case 'join':
                // Add client to the list
                connections[data.name] = connection
                msg = '{"type": "join", "names": ["' + Object.keys(connections).join('","') + '"]}'
                if (myBot.connected === false) {
                    myBot.connect()
                }

                break
            case 'msg':
                // Create a message in JSON with the type, sender and content
                msg = '{"type": "msg", "name": "' + name + '", "msg":"' + data.msg + '"}'
                utype = 'msg'
                uname = name
                umsg = data.msg
                break
        }

        // Send all data to connected sockets
        for (var key in connections) {
            if (connections[key] && connections[key].send) {
                connections[key].send(msg)
            }
        }

        // Send the data of the user for the bot to answer
        if (uname !== 'Mortimer' && utype === 'msg') {
            var test = myBot.post(umsg)
        }
    })
})
