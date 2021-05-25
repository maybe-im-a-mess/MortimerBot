'use strict'

var WebSocketClient = require('websocket').client

/**
 * bot ist ein einfacher Websocket Chat Client
 */

class bot {

    /**
     * Konstruktor baut den client auf. Er erstellt einen Websocket und verbindet sich zum Server
     * Bitte beachten Sie, dass die Server IP hardcodiert ist. Sie müssen sie umsetzten
     */
    constructor() {

        /** Die Websocketverbindung
         */
        this.client = new WebSocketClient()
        /**
         * Wenn der Websocket verbunden ist, dann setzten wir ihn auf true
         */
        this.connected = false

        /**
         * Wenn die Verbindung nicht zustande kommt, dann läuft der Aufruf hier hinein
         */
        this.client.on('connectFailed', function (error) {
            console.log('Connect Error: ' + error.toString())
        })

        /**
         * Wenn der Client sich mit dem Server verbindet sind wir hier
         */
        this.client.on('connect', function (connection) {
            this.con = connection
            console.log('WebSocket Client Connected')
            connection.on('error', function (error) {
                console.log('Connection Error: ' + error.toString())
            })

            /**
             * Es kann immer sein, dass sich der Client disconnected
             * (typischer Weise, wenn der Server nicht mehr da ist)
             */
            connection.on('close', function () {
                console.log('echo-protocol Connection Closed')
            })

            /**
             *    Hier ist der Kern, wenn immmer eine Nachricht empfangen wird, kommt hier die
             *    Nachricht an.
             */
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    var data = JSON.parse(message.utf8Data)
                    console.log('Received: ' + data.msg + ' ' + data.name)
                }
            })

            /**
             * Hier senden wir unsere Kennung damit der Server uns erkennt.
             * Wir formatieren die Kennung als JSON
             */
            function joinGesp() {
                if (connection.connected) {
                    connection.sendUTF('{"type": "join", "name":"Mortimer"}')
                }
            }

            joinGesp()
        })
    }

    /**
     * Methode um sich mit dem Server zu verbinden. Achtung wir nutzen localhost
     *
     */
    connect() {
        this.client.connect('ws://localhost:8181/', 'chat')
        this.connected = true
    }

    /**
     * Hier muss ihre Verarbeitungslogik integriert werden.
     * Diese Funktion wird automatisch im Server aufgerufen, wenn etwas ankommt, das wir
     * nicht geschrieben haben
     * @param nachricht auf die der bot reagieren soll
     */
    post(nachricht) {
        var name = 'Mortimer'
        var intents = require('./answers.json')
        var inhalt = 'Ich habe Sie nicht verstanden. Beginnen wir von vorne: Möchten Sie gerne im Ausland oder innerhalb von Deutschland wandern?'
        nachricht = nachricht.toLowerCase()
        for (var j = 0; j < intents.answers.length; j++) {
            if (nachricht.includes(intents.answers[j].intent)) {
                inhalt = intents.answers[j].answer
            }
        }
        /*
         * Verarbeitung
        */
        var msg = '{"type": "msg", "name": "' + name + '", "msg":"' + inhalt + '"}'
        console.log('Send: ' + msg)
        this.client.con.sendUTF(msg)
    }

}

module.exports = bot
