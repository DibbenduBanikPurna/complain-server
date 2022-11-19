const express=require('express')
const cors=require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

const app=express()
app.use(express())
app.use(express.json())
app.use(cors())

//database uri connect
const uri = "mongodb+srv://purna:2470purna@cluster0.z2een.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db('mbstu-complain');
         const complainCollcetion = database.collection('complain');
         const replyCollcetion = database.collection('reply');
      const usersCollcetion = database.collection('user');
      const noticeCollection=database.collection('notices');
       
        //posting complain
        app.post('/complain', async (req, res) => {
            //const user = req.body;
           // console.log(req.body)
             const result = await complainCollcetion.insertOne(req.body)
             //console.log(result)
             res.json("complain recieved successfully")
        })
        //posting reply
        app.post('/reply',async(req,res)=>{
          //  console.log(req.body)
         const result = await replyCollcetion.insertOne(req.body)
            
          res.send(result)
        })

        //post notice
        app.post('/notice', async (req, res) => {
            //const user = req.body;
          //  console.log(req.body)
            //const data=req.body.noticeData;
            //const date=req.body.time
            //const time=req.body.tarikh
             const result = await noticeCollection.insertOne(req.body)
             //console.log(result)
             res.json("Notice posted successfully")
        })

        //get notice data
        app.get('/notice',async(req,res)=>{
            const  cursor=  noticeCollection.find({  }) 
            const result = await cursor.toArray()
            res.send(result)
        })

        //get single reply verify by email
        app.get('/reply/:email',async(req,res)=>{
            const  cursor=  replyCollcetion.find({ email:req.params.email }) 
            const result = await cursor.toArray()
            res.send(result)
        })

        //get all complain
        app.get('/complain', async(req,res)=>{
            const cursor = complainCollcetion.find({})
             const result = await cursor.toArray()
             res.send(result)
        })
        

        //get single complin by id
        app.get('/complain/:id',async(req,res)=>{
          const  result= await complainCollcetion.findOne({ _id: ObjectId(req.params.id) }) 
            
          res.send(result)
        })

        app.get('/complains/:email', async(req,res)=>{
            const cursor = complainCollcetion.find({email:req.params.email})
            const result = await cursor.toArray()
            res.send(result)
        })

        //post user data

         app.post('/user/admin', async (req, res) => {
             const user = req.body;
            // console.log(user)
            const result = await usersCollcetion.insertOne(user)
             console.log(result)
             res.json("result")
         })

         app.get('/admin',async(req,res)=>{
            const cursor = usersCollcetion.find({})
             const result = await cursor.toArray()
             res.send(result)
         })

       
      //complain update
    //   app.post('/users', async (req, res) => {
    //     const user = req.body;
    //     const filter = { email: user.email };
    //     const options = { upsert: true };
    //     const updateDoc = { $set:  req.body.done};
    //     const result = await complainCollcetion.updateOne(filter, updateDoc, options);
    //     // console.log(result)
    //     res.json(result)

    // })
       
     
    //update complain
    app.put('/com',async(req,res)=>{
        console.log(req.body)
        const filter = { email: req.body.email };
        const options = { upsert: true };
        const updateDoc = { $set:{done:"true"} };
        const result = await complainCollcetion.updateOne(filter, updateDoc, options);
        // console.log(result)
       // res.json(result)
        res.send("hi")
    })
      

     app.delete('/notice/:id',async(req,res)=>{
        const result = await noticeCollection.deleteOne({ _id: ObjectId(req.params.id) });
        res.send(result);
     })
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send("Welcome to dept complain website");
})



app.listen(5000,()=>{
    console.log("server is listenning");
})


