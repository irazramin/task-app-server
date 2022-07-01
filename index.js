const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7il5e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    client.connect();
    const taskCollections = client.db('taskDB').collection('taskCollections');


    try {

        app.post('/task', async (req,res) =>{
            const task = req.body;
            const result = await  taskCollections.insertOne(task);
            res.send(result)
        });

        app.get('/task', async (req,res) =>{
            const query = {};
            const result = await  taskCollections.find(query).toArray();
            res.send(result);
        })

        app.put('/complete/:id', async  (req,res) =>{
            const completeTask = req.body;
            const id = req.params.id;
            const filter = {_id:ObjectId(id)};
            const option = {upsert:true}

            const updateDoc = {
                $set:completeTask,
            }

            const result = await taskCollections.updateOne(filter,updateDoc,option);
            res.send(result);
        });

        app.put('/task/:id', async (req,res) =>{
            const updatedTask = req.body;
            const id = req.params.id;
            const filter = {_id:ObjectId(id)};
            const option = {upsert: true};
            const updatedDoc = {
                $set:{
                    task:updatedTask.task,
                }
            }

            const result  = await taskCollections.updateOne(filter,updatedDoc,option);
            res.send(result);
        });

        app.delete('task/:id', async (req,res) =>{
            const id = req.params.id;
            const filter = {_id:ObjectId(id)};
            const result = await taskCollections.deleteOne(filter);
            res.send(result);
        })
    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () =>{
    console.log('App listening at ', port);
})