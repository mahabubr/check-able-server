require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// MIDDLE WERE
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Check Able Server Is Running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vlhy1ml.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const myTaskCollection = client.db('CheckAble').collection('MyTask')
        const myCompleteCollection = client.db('CheckAble').collection('CompleteTask')

        app.post('/my-task', async (req, res) => {
            const query = req.body
            const result = await myTaskCollection.insertOne(query)
            res.send(result)
        })

        app.get('/my-task', async (req, res) => {
            const query = {}
            const result = await myTaskCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/my-task/:id', async (req, res) => {
            const query = req.params.id
            const filter = { _id: ObjectId(query) }
            const result = await myTaskCollection.findOne(filter)
            res.send(result)
        })

        app.put('/my-task/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const data = req.body
            console.log(data);
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    text: data.name,
                    date: data.startDate
                }
            }
            const result = await myTaskCollection.updateOne(filter, updatedUser, option)
            res.send(result)
        })

        app.delete('/my-task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await myTaskCollection.deleteOne(query)
            res.send(result)
        })


        app.post('/complete-task', async (req, res) => {
            const query = req.body
            const result = await myCompleteCollection.insertOne(query)
            res.send(result)
        })

        app.get('/complete-task', async (req, res) => {
            const query = {}
            const result = await myCompleteCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/complete-task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await myCompleteCollection.deleteOne(query)
            res.send(result)
        })

    }
    catch (e) {
        console.log(e);
    }
}

run()


app.listen(port, () => {
    console.log(`Server Running On PORT = ${port}`);
})