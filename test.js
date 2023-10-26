const express = require('express')
const mqtt = require('mqtt')
const app = express()
const port = process.env.SERVER_PORT | 3001
const mqttHost = process.env.MQTT_HOST | 'localhost'
const mqttPort = process.env.MQTT_PORT | '1883'
const mqttUrl = "mqtt://" + "localhost"
console.log("Url mqtt: ", mqttUrl)
const clientMqtt = mqtt.connect(mqttUrl);

clientMqtt.on("connect", () => {
    console.log("Connected")
})


setInterval(() => {
    console.log("Publishing message .. ")
    clientMqtt.publish("tp", "coucou")
}, 3000)
setInterval(() => {
    console.log("Publishing message .. ")
    clientMqtt.publish("other", "coucou")
}, 3000)

clientMqtt.on('error', function (err) {
    console.log('Error: ' + err)
    if (err.code == 'ENOTFOUND') {
        console.log(
            'Network error, make sure you have an active internet connection'
        )
    }
})

clientMqtt.on('close', function () {
    console.log('Connection closed by client')
})

clientMqtt.on('reconnect', function () {
    console.log('Client trying a reconnection')
})

clientMqtt.on('offline', function () {
    console.log('Client is currently offline')
})


app.get('/', (req, res) => {
    register.metrics().then(res.send)
})

app.listen(port, () => {
    console.log(`Metrics app listening on port ${port}`)
})