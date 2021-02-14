require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const multer = require("multer");
//const LocalStrategy = require('passport-local').Strategy;


var path = require("path");
var Chart = require('chart.js');


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


/*=======================================================================
                            EVENT SCHEMA
========================================================================*/

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

/*=======================================================================
                            AUDIANCE SCHEMA
========================================================================*/
const audianceSchema = new mongoose.Schema({
    audiName: String,
    audiEmail:String,
    audiPhNum:Number,
    audiAge:Number,
    audiAddress:String,
    eventId:String
});

const Audiance = mongoose.model("AudianceDetail", audianceSchema);



//audiance.save();





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

app.get("/pictures", function(req, res){
    Event.find({ image: { $ne: null } }, function (err, foundEvents) {
        if (err) {
            console.log(err);
        } else {
            if (foundEvents) {
                res.render("pictures", {passedEvents: foundEvents});
                };
            }
        
    });
})

var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname));
    }
});
 
var upload = multer({ storage: Storage }).single('file');


app.post("/createEvent", upload, function(req,res){

    //var imageFile = req.file.filename;
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
    image: req.file.filename
    });
   // event.save();
    res.redirect("/organiser");

    event.save(function(err, doc){
        if(err){
            throw err;
        }
        else{
            res.redirect("/organiser");
        }
    });
})
/*=======================================================================
                         AUDIANCE ROUTE
========================================================================*/
app.get("/audianceDetails",function(req,res){
    res.render("audiDetailsInput");
})

app.post("/audianceDetails", function(req,res){
    console.log(req.body.AudiName)
    const audiance = new Audiance({
    audiName: req.body.Name,
    audiEmail:req.body.email,
    audiPhNum:req.body.ph_num,
    audiAge:req.body.age,
    audiAddress:req.body.address
});
audiance.save();
res.render("audiBookConfirm");
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
app.get("/users/register", (req,res)=>{
    res.render("createEvent");
})


/*=======================================================================
                         ANALYTICS ROUTE
=======================================================================*/
app.get("/analytics", function(req, res){
    res.render("analytics");
});

app.get("/cities/:city", (req,res)=>{
    const requestedCity = req.params.city;
    Event.find({city:requestedCity},(err,foundEvents)=>{
        if(err){
            console.log(err);
        }else{
            res.render("events",{foundEvents});
        }
    })
});


app.get("/cities/:city/:event/booking",(req,res)=>{
    const requestedCity = req.params.city;
    const requestedEvent = req.params.event;
    Event.find({city: requestedCity, eventName:requestedEvent},(err,foundEvent)=>{
        if(err){
            console.log(err);
        }else{
        }
    })

});


/*=======================================================================
                         REGISTER ROUTES
========================================================================*/
app.get("/userLoginRegister",function(req,res)
        {
    res.render('userLoginRegister');
    
});

app.get('/register', function (req, res) {
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

/*=======================================================================
                         USER LOGIN ROUTE
========================================================================*/



app.post('/register', function (req, res) {
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
                res.redirect('/register');
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

app.get("/login",(req,res)=>{
    console.log(req);
    res.render('login');
})

app.post('/login', function (req, res) {
    const organiser = new Organiser({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(organiser, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local', {failureRedirect: '/login'})(req, res, function () {
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