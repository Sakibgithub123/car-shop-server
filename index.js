const express = require('express');
const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion,ObjectId  } = require('mongodb');
const uri = "mongodb+srv://sakibbangla49:RpbxvjBwZCo3wARI@cluster0.olvofey.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("carDB");
    const carCollection = database.collection("car");
    const cartCollection = database.collection("cartData");
 
   

    app.post('/addproducts', async(req,res)=>{
        const product = req.body;
        console.log(product)
        const result = await carCollection.insertOne(product);
        res.send(result);
    })
    app.post('/addcarts', async(req,res)=>{
        const product = req.body;
        console.log(product)
        const result = await cartCollection.insertOne(product);
        res.send(result);
    })
    app.put('/addproducts/:id', async(req,res)=>{
        const id=req.params.id;
        const filter={_id: new ObjectId(id)}
        const options={upsert:true}
        const updateCar=req.body
        const car={
            $set:{
                name:updateCar.name,
                brand_name:updateCar.brand_name,
                price:updateCar.price,
                short_description:updateCar.short_description,
                rating:updateCar.rating,
                image:updateCar.image
            }
        }
        const result= await carCollection.updateOne(filter,car,options)
        res.send(result);
    })
    app.get('/addproducts', async(req,res)=>{
        const cursor=carCollection.find();
        const result= await cursor.toArray();
        res.send(result)

    }) 
    app.get('/addcarts', async(req,res)=>{
        const cursor=cartCollection.find();
        const result= await cursor.toArray();
        console.log(result)
        res.send(result)

    }) 
    app.get('/addproducts/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        console.log(query)
        const result= await carCollection.findOne(query)
        res.send(result);
    })
    app.get('/addproducts/:brand_name', async(req,res)=>{
        const brand_name=req.params.brand_name;
        const query={brand_name: new ObjectId(brand_name)}
        console.log(query)
        const cursor= carCollection.find(query)
        const result= await cursor.toArray();
        res.send(result);
    })
    app.delete('/addproducts/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        console.log(query)
        const result= await carCollection.deleteOne(query)
        res.send(result);
    })

   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send(' server is running')
})

app.listen(port, () => {
    console.log(` Server is running on port: ${port}`)
})