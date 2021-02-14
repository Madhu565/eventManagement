require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt =require('bcrypt');
const multer = require("multer");
//const LocalStrategy = require('passport-local').Strategy;


var path = require("path");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.eyjhl.mongodb.net/projectDB`, { useUnifiedTopology: true, useNewUrlParser: true });

const eventSchema = new mongoose.Schema({
    username:String,
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
    name: String,
    email:String,
    password: String
    
});

organiserSchema.plugin(passportLocalMongoose);

const Organiser = mongoose.model("Organiser", organiserSchema);


passport.use(Organiser.createStrategy());

passport.serializeUser(Organiser.serializeUser());
passport.deserializeUser(Organiser.deserializeUser());

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
    res.render("landing");
})


/*=======================================================================
                         ORGANISER ROUTE
========================================================================*/
app.get("/organiser", function(req, res){
    if (req.isAuthenticated()) {
        var name = req.user.name;
        console.log(req.user);
        res.render('organiser', {passedname: name});
    } else {
        res.redirect('/users/login');
    }
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

   // event.save();
    res.redirect("/organiser");
})
/*=======================================================================
                         REGISTER ROUTES
========================================================================*/
app.get("/userLoginRegister", (req,res)=>{
    res.render('userLoginRegister');
})

app.get('/users/register', function (req, res) {
        
                res.render('register');

});
// app.post("/users/register", (req,res)=>{
//     const { name,email,password,password2 }=req.body;

    
//     let errors = [];
//     //checking required fields
//     if(!name || !email || !password || !password2) {
//         errors.push({ msg:'Please fill up all fields'});
//     }
//     //check password
//     if(password !== password2)
//     errors.push({msg: 'Please re-enter your password'});

//     // check pass length
//     if(password.length < 8){
//         errors.push({msg: 'Passwords should be at least 8 characters'});
//     }
    
//     if(errors.length>0)
//     {
//         res.render('register',{
//             errors,name,email,password,password2
//         });
//     }else{
//         //validation passed

//         Organiser.findOne({ email: email})
//         .then(organiser => {
//             if(organiser){
//                 //User exists
//                 errors.push({msg: 'Email is already registered'})
//                 res.render('register',{
//                     errors,name,email,password,password2
//                 });
//             }else{
//                 const newOrganiser = new Organiser({
//                     name,
//                     email,
//                     password
//                 });


//                 // Hash Password 
//                 bcrypt.genSalt(10, (err, salt) => 
//                 bcrypt.hash(newOrganiser.password,salt,(err,hash) =>{
//                     if(err) throw err;
//                     //set password to hash
//                     newOrganiser.password=hash;

//                     //save organiser
//                     newOrganiser.save()
//                     .then(organiser =>{
//                         res.redirect('/organiser');
//                     })
//                     .catch(err => console.log(err));
//                 }))
//             }
//         } );
//     }
// });

app.post('/users/register', function (req, res) {
    Organiser.register(
        {   
            username: req.body.username,
            name: req.body.name,
            email: req.body.email
            
        },
         req.body.password,

        function (err, organiser) {
            if (err) {
                console.log(err);
                res.redirect('/users/register');
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/organiser');
                });
            }
        }
    );
});

/*=======================================================================
                         ORGANIZER LOGIN
========================================================================*/

app.get("/users/login",(req,res)=>{
    res.render('login');
})

app.post('/users/login', function (req, res) {
    const organiser = new Organiser({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(organiser, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local', {failureRedirect: '/users/login'})(req, res, function () {
                res.redirect("/organiser")
            });
        }
    });
});

/*=======================================================================
                         LOGOUT
========================================================================*/
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


app.listen(3000 , ()=>{
    console.log("server running at 3000")
})