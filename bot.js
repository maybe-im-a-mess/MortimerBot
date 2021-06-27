'use strict'
var WebSocketClient = require('websocket').client

/**
 * Bot is a simple Websocket Chat Client
 */
class bot {

    /**
     * Constructor builds a client. It creates a websocket and connects to server.
     */
    constructor() {

        /** Connection to the websocket
         */
        this.client = new WebSocketClient()

        /**
         * Sets to true, when a websocket is connected.
         */
        this.connected = false

        /**
         * Is used, if the connection does not work.
         */
        this.client.on('connectFailed', function (error) {
            console.log('Connect Error: ' + error.toString())
        })

        /**
         * Client is connected to the server.
         */
        this.client.on('connect', function (connection) {
            this.con = connection
            console.log('WebSocket Client Connected')
            connection.on('error', function (error) {
                console.log('Connection Error: ' + error.toString())
            })

            /**
             * The client disconnects.
             */
            connection.on('close', function () {
                console.log('echo-protocol Connection Closed')
            })

            /**
             * Receives the message.
             */
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    var data = JSON.parse(message.utf8Data)
                    console.log('Received: ' + data.msg + ' ' + data.name)
                }
            })

            /**
             * For server to recognise.
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
     * To connect to the server.
     */
    connect() {
        this.client.connect('ws://localhost:8181/', 'chat')
        this.connected = true
    }

    /**
     * Processing of the message.
     * @param nachricht the bot has to react to.
     */
    async post(nachricht) {
        var request = require('request');
        var requestpromise = require('request-promise');
        var querystring = require('querystring');

        var endpointKey = "b0e625e8baa3485991cc4e513433925a";
        var endpoint = "mortimer-authoring.cognitiveservices.azure.com";
        var appId = "bd4daffe-1565-4382-968a-4d15f6a60752";
        nachricht = nachricht.toLowerCase()
        var utterance = nachricht;
        var queryParams = {
            "show-all-intents": true,
            "verbose": true,
            "query": utterance,
            "subscription-key": endpointKey
        }
        var URI = `https://${endpoint}/luis/prediction/v3.0/apps/${appId}/slots/production/predict?${querystring.stringify(queryParams)}`
        const antwort = await requestpromise(URI);
        var parsedAnswer = JSON.parse(antwort);
        var possibleIntent = parsedAnswer.prediction.topIntent

        var name = 'Mortimer'
        var intents = require('./answers.json')

        var fallbackAnswers = ['Ich habe dich nicht verstanden. Beginnen wir von vorne: Wo möchtest du wandern?', 'Entschuldigung, ich verstehe dich leider nicht.', 'Kannst du bitte deine Anfrage anders formulieren?', 'Was genau interessiert dich?']

        var inhalt = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];

        for (var j = 0; j < intents.answers.length; j++) {
            if (possibleIntent.includes(intents.answers[j].intent)) {
                inhalt = intents.answers[j].answer
            }
        }

        var msg = '{"type": "msg", "name": "' + name + '", "msg":"' + inhalt + '"}'
        console.log('Send: ' + msg)
        this.client.con.sendUTF(msg)
    }

}

module.exports = bot