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
    placeName: String,
    hostings:Number,
    id: String 
});

const Event = mongoose.model("Event", eventSchema);

const event = new Event({
    placeName: "kolkata",
    hostings:"300",
    id: "01"
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