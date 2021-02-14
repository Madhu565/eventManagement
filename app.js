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

const event = new Event({
    organizerName: "bppimt",
    eventName: "Tech Guru",
    description: "This is the annual tech fest of bppimt",
    location: "haldiram",
    tolalCapacity: "200",
    startDate: "20-2-21",
    startTime: "10 am",
    endDate: "25-2-21",
    endTime: "10pm",
    price:"400",
    picture:"",
    city:"kolkata"

});
//event.save();
app.get("/", (req,res)=>{
    res.json({
        status: "ok"
    })
})

app.listen(3000 , ()=>{
    console.log("server running at 3000")
})