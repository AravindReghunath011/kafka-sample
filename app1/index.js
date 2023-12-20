const express = require('express')
const kafka = require('kafka-node')
const app = express()
const mongoose = require('mongoose')
app.use(express.json())

const dbsAreRunning = async()=>{
    mongoose.connect(process.env.MONGO_URL)
    const User = new mongoose.model('user',{
        name:String,
        email:String,
        password:String
    })

const client = new kafka.KafkaClient({kafkaHost:process.env.KAFKA_BOOTSTRAP_SERVERS})
const producer = new kafka.Producer(client)
producer.on('ready',async()=>{
    app.post('/',async(req,res)=>{
        producer.send([{topic:process.env.KAFKA_TOPIC,messages:JSON.stringify(req.body)}],async(err,data)=>{
            if(err) console.log(err)
            else {
                console.log(data,'data')
                await User.create(req.body)
                res.send(req.body) 
            }
        })
    })
})
}

 

setTimeout(dbsAreRunning,10000)
app.listen(process.env.PORT)