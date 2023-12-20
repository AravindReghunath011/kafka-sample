const express = require('express')
const kafka = require('kafka-node')
const app = express()
const mongoose = require('mongoose')
app.use(express.json())

console.log('anything')
const dbsAreRunning = async()=>{
    mongoose.connect(process.env.MONGO_URL)
    console.log('app2 is here')
    const User = new mongoose.model('user',{
        name:String,
        email:String,
        password:String
    })

    const client = new kafka.KafkaClient({kafkaHost:process.env.KAFKA_BOOTSTRAP_SERVERS})
const consumer = new kafka.Consumer(client,[{topic:process.env.KAFKA_TOPIC}],{
    autoCommit:false
})
consumer.on('message',async(message)=>{
    console.log(message)
    const user = await new User(JSON.parse(message.value))
    console.log(message,'message')
    console.log(user,'user')
    await user.save()
})
consumer.on('error',(err)=>{
    console.log(err,'error')
})
}

 

setTimeout(dbsAreRunning,10000)
app.listen(process.env.PORT)