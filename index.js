var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var path = require('path')

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'index.html'));
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
            sendTextMessage(sender,"The sender is: " + sender)
        }
    }
    res.sendStatus(200)
})

app.get('/', function (req, res) {
	var username = req.param("user");
	var message = req.param("message");
    sendTextMessage(username, message);
    console.log('running on port')
    res.send("")
})

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
var token = "CAAD6rRCtrZAoBAJlHoSv5Bwno5vqd6zEV3Hq9wTTh1CZB9PMm9SSyZBT1xINjZAZBa5VfN3kxNnkUdUCXGKdxWJHrxjVkQlrHZCeZCfeYZBVCoPU9pNgihhGjxVUZAf92HXkVnobo7UYJtpERL5kHLVGoH6hBzGhG1FLeTMTPDV21QaWYCEsgbv6lLp8sxGJLyCgZD"