const client = require('prom-client');
const express = require('express')
const mqtt = require('mqtt')
const app = express()
const Registry = client.Registry;
const register = new Registry();
client.collectDefaultMetrics({ register });
const port = process.env.SERVER_PORT | 3000
const mqttHost = process.env.MQTT_HOST
const mqttPort = process.env.MQTT_PORT | '1883'
const mqttUrl = "mqtt://" + mqttHost + ":" + mqttPort
console.log("Url mqtt: ", mqttUrl)
const clientMqtt = mqtt.connect(mqttUrl);
const messageCounter = new client.Counter({ name: "mqtt_count_message", help: "Number of message by topic", labelNames: ['topic'] })
register.registerMetric(messageCounter);

clientMqtt.on("connect", () => {
    console.log("Connected")
    clientMqtt.subscribe('#', function (err) {
        if (!err) {
            console.log("All message subscribe applied")
        }
    })

})

clientMqtt.on('message', function (topic, message) {
    // message is Buffer
    console.log(topic, message.toString())
    messageCounter.inc({ topic: topic }, 1)
})

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
    register.metrics().then((metrics) => {
        console.log("Retourne la value")
        res.send(metrics)
    })
})

app.listen(port, () => {
    console.log(`Metrics app listening on port ${port}`)
})