require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

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
    city:String
});



const Event = mongoose.model("Event", eventSchema);

app.get("/", (req,res)=>{
    res.render("landing");
});

app.get("/events", (req,res)=>{
    Event.find({},(err,foundEvents)=>{
        if(err){
            console.log(err);
        }else{
            res.render("events",{foundEvents});
        }
    })
});

app.get("/:city", (req,res)=>{
    const requestedCity = req.params.city;
    Event.find({city:requestedCity},(err,foundEvents)=>{
        if(err){
            console.log(err);
        }else{
            res.render("events",{foundEvents});
        }
    })
});

app.get("/:city/:event", (req,res)=> {
    const requestedEvent = req.params.event;
    res.json({
        status: "ok",
    })
})

app.listen(3000 , ()=>{
    console.log("server running at 3000")
})