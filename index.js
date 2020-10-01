const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvtch.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
//midleWare
app.use(cors());
app.use(bodyParser.json());
const port = 5000;


//Rout
app.get('/', (req, res) => {
    res.send("Hello This 'Site' is Working");
})





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emajohanStore").collection("products");
    const ordersCollection = client.db("emajohanStore").collection("orders");


    //Create
    app.post("/addProduct", (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            res.send(result.insertedCount);
            console.log(result.insertedCount);
        })
    })

    //Ride
    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })


    //single Product
    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })


    //product details
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys }})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    //Order Man Details
    app.post("/addOrder", (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
   
});











// app.get('/', (req, res) => {
//     res.send('Hello World! iam the author of this website. this site name is Ema Johan siple')
// })
app.listen(process.env.PORT || port)