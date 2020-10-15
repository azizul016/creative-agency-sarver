const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xeryg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('services'))
app.use(fileUpload());

const port = 5000






const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("creativeAgency").collection("agency");
    const serviceCollection = client.db("creativeAgency").collection("service");
    const reviewCollection = client.db("creativeAgency").collection("review");
    const adminCollection = client.db("creativeAgency").collection("admin");
    console.log("db connection success");

    //post method for admin data;

    app.post('/addAdmin', (req, res) => {
        // const file = req.files.file;
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        const newImg = req.files.file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        }

        serviceCollection.insertOne({ title, description, image, price })
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })


    //post method for user data;

    app.post('/placeService', (req, res) => {
        const file = req.files.file;
        const image = req.body.image;
        const name = req.body.name;
        const email = req.body.email;
        const price = req.body.price;
        const service = req.body.service;
        const description = req.body.description;
        const newImg = req.files.file.data;
        const encImg = newImg.toString('base64');
        var img = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        }

        collection.insertOne({ name, email, price, service, description, image, img })
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })

    })

    //post method for review;
    app.post('/review', (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const designation = req.body.designation;
        const newImg = req.files.file.data;
        const encImg = newImg.toString('base64');
        var img = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        }
        // console.log(name, description, designation, img);
        reviewCollection.insertOne({ name, description, designation, img })
            .then(result => {
                console.log(result);
                res.send(result)
            })
    })

    //post method for set admin;
    app.post('/setAdmin', (req, res) => {
        const email = req.body.email;
        const pass = req.body.password;
        console.log(email);
        adminCollection.insertOne({ email, pass })
            .then(result => {
                console.log(result);
                res.send(result)
            })
    })



    //get method for review

    app.get('/seeReview', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/seeService', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/seeParticularService', (req, res) => {
        const newUser = req.query.email;
        collection.find({ email: newUser })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/seeAllService', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    // app.get('/orders', (req, res) => {
    //     ordersCollection.find({})
    //     .toArray((err, documents) => {
    //       res.send(documents)
    //     })
    //   })

    /////////////////////////////


    // app.post('/admin', (req, res) => {
    //     const email = req.body.email;
    //     adminCollection.find({ email: email })
    //         .toArray((err, collection) => {
    //             if (collection) {
    //                 res.send(collection)
    //             }
    //         })


    // })
    // app.get('/admin', (req, res) => {
    //     adminCollection.find({ email: req.query.email })
    //         .toArray((err, collection) => {
    //             res.send(collection)
    //         })
    // })


    app.get('/admin', (req, res) => {
        const email = req.query.email;
        console.log(email);

        adminCollection.find({ email })
            .toArray((err, collection) => {
                res.send(collection.length > 0)
            })

    })
    // adminCollection.find({ email })

    // .toArray((err, admin) => {
    //     if (email === admin[0].email) {
    //         return res.send(admin[0].email);
    //         // console.log("admin", documents[0].email);
    //     }

    // })


    // collection.find({ email })
    //     .toArray((err, user) => {
    //         // console.log(err, user);
    //         console.log(user[0].email);
    //         res.send(user[0].email)
    //     })

















});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
    console.log("Listening port 5000")
})


