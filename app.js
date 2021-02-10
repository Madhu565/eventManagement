const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/mainDB", { useUnifiedTopology: true, useNewUrlParser: true });

app.get("/", (req,res)=>{
    res.json({
        status: "ok"
    })
})

app.listen(3000 , ()=>{
    console.log("server running at 3000")
})