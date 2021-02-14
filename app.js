require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const multer = require("multer");
var path = require("path");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect(`mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.eyjhl.mongodb.net/projectDB`, { useUnifiedTopology: true, useNewUrlParser: true });

const eventSchema = new mongoose.Schema({
    organizerName: String,
    eventName: String,
    description: String,
    location: String,
    tolalCapacity: Number,
    startDate: String,
    startTime: String,
    endDate: String,
    endTime: String,
    price:Number,
    picture:String,
    city:String,
    image: String
});

const Event = mongoose.model("Event", eventSchema);

/*=======================================================================
                         ORGANISER SCHEMA
========================================================================*/

const organiserSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String
});

const Organiser = mongoose.model("Organiser", organiserSchema);

const organiser = new Organiser({
    username: "helloworld",
    password: "nice",
    name: "Squad"
});
//organiser.save();


/*=======================================================================
                         HOME ROUTE
========================================================================*/
app.get("/", (req,res)=>{
    res.render("home");
})


/*=======================================================================
                         ORGANISER ROUTE
========================================================================*/
app.get("/organiser", function(req, res){
    res.render("organiser");
});

app.get("/createEvent", function(req, res){
    res.render("createEvent");
});

app.post("/createEvent", function(req,res){
    const event = new Event({
    eventName: req.body.Name,
    description: req.body.description,
    location: req.body.location,
    tolalCapacity: req.body.capacity,
    startDate: req.body.startDate,
    startTime: req.body.startTime,
    endDate: req.body.endDate,
    endTime: req.body.endTime,
    price:req.body.price,
    city:req.body.city,
    //image: req.body.picture
    });

    event.save();
    res.redirect("/organiser");
})



app.listen(3000 , ()=>{
    console.log("server running at 3000")
})