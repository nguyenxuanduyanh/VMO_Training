const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const appRoute = require('./routes/app.route')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
require('dotenv').config()

const port = 3000;
const dbConfig_url = 'mongodb://localhost:27017/vmodev-test'
mongoose.connect(dbConfig_url, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });


app.use('/', appRoute)
app.listen(port, () => {
    console.log("Server is listening on port " + port)
})