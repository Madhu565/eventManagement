require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const multer = require("multer");


var fs = require('fs');
var nodemailer=require('nodemailer');
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
/*=======================================================================
                            CREATE EVENT SCHEMA
========================================================================*/
const eventSchema = new mongoose.Schema({
    username:String,
    organizerName: String,
    eventName: String,
    description: String,
    location: String,
    tolalCapacity: Number,
    startDate: Number,
    startTime: String,
    endDate: Number,
    endTime: String,
    price:Number,
    city:String,
    image: 
    {
        data: Buffer,
        contentType: String
    },
    Booked:Number,
    BookedPer:Number,
    eventType:String

});

const Event = mongoose.model("Event", eventSchema);


/*=======================================================================
                            EVENT BOOKING SCHEMA
========================================================================*/

const audianceSchema = new mongoose.Schema({
    audiName: String,
    audiEmail:String,
    audiAge:Number,
    eventId:String,
    noOfTickets:Number, 
    audiPhNum:Number,  
    gender:String,     
});

const Audiance = mongoose.model("AudianceDetail", audianceSchema);


/*=======================================================================
                           REGISTER SCHEMA
========================================================================*/

const organiserSchema = new mongoose.Schema({
    username: String,
    name: String,
    email:String,
    password: String,
    role:String,
    audiPhNum:Number,  
    gender:String, 
    audiAge:Number ,
    prefEvent:String
});

organiserSchema.plugin(passportLocalMongoose);
const Organiser = mongoose.model("Organiser", organiserSchema);
passport.use(Organiser.createStrategy());
passport.serializeUser(Organiser.serializeUser());
passport.deserializeUser(Organiser.deserializeUser());


/*=======================================================================
                         COLLEGE EVENT SCHEMA
========================================================================*/
const collegeEventSchema = new mongoose.Schema({
    username: String,
    name: String,
    description: String,
    location: String,
    startDate: Number,
    startTime: String,
    endDate: Number,
    endTime: String,
    price:Number,
    collegeName: String,
    type: String,
    image: 
    {
        data: Buffer,
        contentType: String
    },
    Booked:Number,
    rules: String
});

const CollegeEvent = mongoose.model("CollegeEvent", collegeEventSchema);

/*=======================================================================
                         Functions
========================================================================*/
function dateToNumber(car){
    let str=[]
    for(let i = 0; i<car.length ; i++){
        if(car[i] == '-'){
            continue;
        }else{
            str.push(car[i]);
        }
    }
    let newStr = str.join('');
    let newNumber =  Number(newStr);
    return newNumber;
}
function handleError(e){
    console.log(e);
}
function numberToDate(nbr){
    let arr = []
   for(let i= 0; i<nbr.length ; i++){
       if(i == 3 || i == 5){
           arr.push(nbr[i]);
           arr.push("-");
       }else{
           arr.push(nbr[i]);
       }
   }
   return arr.join(''); 
}
function today(){
    let date = new Date;
    let day = (date.getDate())
    let month = (date.getMonth()+1)
    let year = (date.getFullYear())
    let exactDate = month <10 ? `${year}-0${month}-${day}` :`${year}-0${month}-${day}`
return exactDate;
}
/*=======================================================================
                         HOME ROUTE
========================================================================*/

app.get("/", (req,res)=>{
    let current = req.url;
    res.render("landing");
})


/*=======================================================================
                         ORGANISER ROUTE
========================================================================*/
app.get("/organiser", function(req, res){
    if (req.isAuthenticated()) {
        var name = req.user.name;
        var arr = [];
        Event.find({username:req.user.username},function(err,foundEvents) // getting the data from the database
        {
            if(err)console.log(err)
            else{
                var name = req.user.name;
                arr = foundEvents
                //res.render('organiser', {passedname: name,foundEvents})
            }


        }).then(()=>{
            CollegeEvent.find({username: req.user.username}, function(err, foundcolEvents){
                if(err){
                    handleError(err);
                } else{
                    res.render('organiser', {passedname: name, arr, foundcolEvents});
                }
            })

    })


        
    } else {
        res.redirect('/login');
    }
        Event.deleteMany({endDate: { $lte : dateToNumber(today())}},(err)=>{
            if(err) console.log(err);
        });
});


/*=======================================================================
                          EVENT IMAGE UPLOAD
========================================================================*/

var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now());
    }
});
 
var upload = multer({ storage: Storage }).single('file');
/*=======================================================================
                         CREATE EVENT ROUTE
========================================================================*/

app.get("/createEvent", function(req, res){
    var username = req.user.username;
    console.log(username);
    res.render("createEvent", {username});
});

app.get("/pictures", function(req, res){
    Event.find({ image: { $ne: null } }, function (err, items) {
        if (err) {
            console.log(err);
        } else {
            if (items) {
                res.render("pictures", { items: items });
                };
            }
        
    });
})


app.post("/createEvent", upload, function(req,res){
    const event = new Event({
    username:req.body.username,
    eventName: req.body.Name,
    description: req.body.description,
    location: req.body.location,
    tolalCapacity: req.body.capacity,
    startDate: dateToNumber(req.body.startDate),
    startTime: req.body.startTime,
    endDate: dateToNumber(req.body.endDate),
    endTime: req.body.endTime,
    price:req.body.price,
    city:req.body.city,
    eventType:req.body.eventType,
    Booked:0,
    BookedPer:0,
    image: 
    {
        data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }
    });

    event.save(function(err, doc){
        if(err){
            throw err;
        }
        else{
            res.redirect("/organiser");
        }
    });
})

 app.post("/delete",function(req,res){
    var delid= req.body.id

   Event.deleteOne({_id:delid},function(err){
    if (err) console.log(err);
   });  

   CollegeEvent.deleteOne({_id:delid}, function(err){
       if(err){
           handleError(err);
       }
   });
   
   res.redirect('organiser');
})


/*=======================================================================
                         CREATE COLLEGE EVENT ROUTE
========================================================================*/

app.get("/collegeEventform", function(req, res){
    var username = req.user.username;
    res.render("collegeEventform", {username});
}) 

app.post("/collegeEvent",upload, function(req, res){
    const colEvent = new CollegeEvent({
        username: req.body.username,
        name: req.body.Name,
        description: req.body.description,
        location: req.body.location,
        startDate: dateToNumber(req.body.startDate),
        startTime:req.body.startingTime,
        endDate: dateToNumber(req.body.endDate),
        endTime:req.body.endTime ,
        price: req.body.price,
        collegeName: req.body.colName,
        rules: req.body.rules,
        type: req.body.type,
        image: 
        {
            data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    });
    
    colEvent.save(function(err, doc){
        if(err){
            console.log(err);
        } else {
            res.redirect("/createEvent");
        }
    });
});

app.get("/collegeEvents/:id",(req,res)=>{
    const requestedId = req.params.id;
    CollegeEvent.find({_id: requestedId} , (err,foundEvent)=>{
        res.render("collegeEvent",{foundEvent , startDate: numberToDate(String(foundEvent[0].startDate)), endDate: numberToDate(String(foundEvent[0].endDate))});
    });
})


/*=======================================================================
                         AUDIANCE ROUTE
========================================================================*/

  
// app.get("/cities/:city", (req,res)=>{
//     const requestedCity = req.params.city;
//     Event.find({city:requestedCity},(err,foundEvents)=>{
//         if(err){
//             console.log(err);
//         }else{
//             res.render("events",{foundEvents});
//         }
//     })
// });

app.get("/cities/:city/:eventId", (req,res)=> {
    const requestedEvent = req.params.eventId;
    const requestedCity = req.params.city;
   
    Event.find({city:requestedCity,_id:requestedEvent},(err,foundEvent)=>{
        if(err){
            console.log(err);
        }else{
            
            res.render("eventDetails",{foundEvent})
            
        }
    })
});


/*=======================================================================
                         ANALYTICS ROUTE
=======================================================================*/
app.get("/analytics/:id", function(req, res){
    const requestedId=req.params.id;
    let malecount = 0, femalecount = 0, childrenCount =0, teenagerCount=0, middleAgedCount =0, seniorCitizenCount=0 ,arr=[]; 
    Event.find({_id:requestedId},function(err,foundEvent){
        if(err){
            console.log(err);
        }
        else{
            arr  = foundEvent;
            
        }
    })
    .then(()=>{
        Audiance.find({eventId:requestedId}, function(err, foundAudience){
            if(err){
                console.log(err);
            }else{
                foundAudience.forEach(function(audience){
                    if(audience.gender === "Male"){
                        malecount = malecount+1;
                    } if(audience.gender === "Female") {
                        femalecount = femalecount + 1;
                    } if(audience.audiAge>=0 && audience.audiAge<=14){
                        childrenCount = childrenCount+1;
                    }if(audience.audiAge>14 && audience.audiAge<=24){
                        teenagerCount = teenagerCount+1;
                    }if(audience.audiAge>24 && audience.audiAge<=64){
                        middleAgedCount = middleAgedCount+1;
                    }if(audience.audiAge>64){
                        seniorCitizenCount = seniorCitizenCount+1;
                    }
                });
                res.render("analytics",{
                    passedAudience:foundAudience,
                    male: malecount, 
                    female: femalecount, 
                    children: childrenCount, 
                    teenager: teenagerCount,
                     middleAged: middleAgedCount, 
                    seniorCitizen: seniorCitizenCount,
                    booking:arr[0].Booked,
                    cap:arr[0].tolalCapacity
                });
            }
        })  
    });
});
/*=======================================================================
                         CITY
========================================================================*/
app.get("/cities/:city", (req,res)=>{
    if(req.isAuthenticated()){
    console.log(req.user)
    const requestedCity = req.params.city;
    Event.deleteMany({endDate: { $lte : dateToNumber(today())}},(err)=>{
        if(err) console.log(err);
    });
    Event.find({city:requestedCity},(err,foundEvents)=>{
        if(err){
            console.log(err);
        }else{
            res.render("events",{foundEvents});
        }
 
    })
}
else{
    res.redirect("/audiLogin")
}
});


app.get('/events',(req,res)=>{
    Event.find({},(err,foundEvents)=>{
        if(err){
            console.log(err);
        }else{
            res.json(foundEvents)
        }
    })
})


app.post("/audiDetailsInput",(req,res)=>{
 
    const audiance = new Audiance({
        audiName:req.body.name,
        eventId:req.body.id,
        noOfTickets:req.body.tickets,    
        audiEmail:req.body.audiEmail,
        audiAge:req.body.audiAge,
        audiPhNum:req.body.audiPhNum,  
        gender:req.body.gender    
       });
    audiance.save();  

    Event.findById(req.body.id, (err, event) => {
        if (err) {
            console.log('Error');
        }
    
        event.Booked = Number(event.Booked) + Number(req.body.tickets);
        event.BookedPer = ((Number(event.Booked))/event.tolalCapacity)*100;
        event.save((err, updatedevent) => {
            if (err) {
                console.log('Error');
            }
            else{
                console.log("success");
            }
        });
    });

    // res.render("audiBookConfirm", {audiName});

    res.json({
        tickets:req.body.tickets,
    })
    var transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD
        }
    });
    
    var mailOptions={
        from:process.env.EMAIL,
        to:req.body.audiEmail,
        subject:'Booking Confirmation',
        text:'Thanks for contacting GRAB MY SEAT'
    };
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent:'+info.response);
        }
    });
  

});


app.get("/cities/:city/:eventId/booking",(req,res)=>{
    var user =[];
    if(req.isAuthenticated()){
        // console.log(req.user)
    const requestedCity = req.params.city;
    const requestedEvent = req.params.eventId;
   user=req.user;

    Event.find({city: requestedCity, _id:requestedEvent},(err,foundEvent)=>{
     
        if(err){
            console.log(err);
        }else{
            var capacity = foundEvent[0].tolalCapacity;
            var booked = foundEvent[0].Booked; 
            var remain = (capacity-booked);
            res.render("audiDetailsInput",{foundEvent, user,remain});
        }
    })
    }
    else{
        res.redirect("/audiLogin")
    }
});

/*=======================================================================
                         AUDIANCE-REGISTER ROUTE
========================================================================*/

app.get("/audiregister",function(req,res){
    res.render("audiRegister");
});

app.post('/audiregister', function (req, res) {
    Organiser.register(
        {   
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            role:req.body.role,
            audiPhNum:req.body.audiPhNum,  
            gender:req.body.gender, 
            audiAge:req.body.audiAge,
            prefEvent:req.body.preferred
        },
            req.body.password,
            function (err, organiser) {
            if (err) {
                console.log(err);
                res.redirect('/audiregister');
            } else {
                passport.authenticate('local')(req, res, function () {
                    if(req.user.role=="AUDIENCE"){
                    res.redirect('/audiLanding');}
                    
                    var transporter=nodemailer.createTransport({
                        service:'gmail',
                        auth:{
                            user:process.env.EMAIL,
                            pass:process.env.EMAIL_PASSWORD
                        }
                    });
                    
                    var mailOptions={
                        from:process.env.EMAIL,
                        to:req.body.email,
                        subject:'Succesfully Registered to Grab My Seat',
                        text:'Thanks for registering in GRAB MY SEAT'
                    };
                    transporter.sendMail(mailOptions,function(error,info){
                        if(error){
                            console.log('error');
                        }
                        else{
                            console.log('Email sent:'+info.response);
                        }
                    });
                });
            }
        });
    });


/*=======================================================================
                            AUDIENCE LANDING
========================================================================*/

app.get("/audiLanding",function(req,res){
   
    if (req.isAuthenticated()){
        // var threshold = 15;
        var arr= [];
        var prefEvent=req.user.prefEvent;
        var audiName=req.user.name;
      
        Event.find({},function(err,topEvent){
            if(err){
                console.log(err);

            }else{
                arr = topEvent;  
                arr.sort(dynamicsort("BookedPer","desc"));
                 
            }
        })
        .then(()=>{
             
        Event.find({eventType:prefEvent},function(err,foundEvent){

            if(err){
                console.log(err);
            }
            else{
             
                res.render('audiLanding',{passedEvent:foundEvent,arr,audiName});
                
            }

        });
        });
       
        function dynamicsort(property,order) {
            var sort_order = 1;
            if(order === "desc"){
                sort_order = -1;
            }
            return function (a, b){
                // a should come before b in the sorted order
                if(a[property] < b[property]){
                        return -1 * sort_order;
                // a should come after b in the sorted order
                }else if(a[property] > b[property]){
                        return 1 * sort_order;
                // a and b are the same
                }else{
                        return 0 * sort_order;
                }
            }
        }
        

    }
    else{
        res.redirect("/audiLogin")
    }
    
});

/*=======================================================================
                        AUDIENCE LOGIN
========================================================================*/
app.get("/audiLogin",function(req,res){
    res.render("audiLogin")
});

app.post("/audiLogin", function(req,res){
    const organiser = new Organiser({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(organiser, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local', {failureRedirect: '/audiLogin'})(req, res, function () {
                if(req.user.role=="AUDIENCE"){
                res.redirect("/audiLanding");
            }
            });
        }
    });
});
/*=======================================================================
                         REGISTER ROUTES
========================================================================*/
app.get('/register', function (req, res) {
    res.render('register');
});
app.post('/register', function (req, res) {
    Organiser.register(
        {   
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            role:req.body.role
            
        },
         req.body.password,

        function (err, organiser) {
            if (err) {
                console.log(err);
                res.redirect('/register');
            } else {
                passport.authenticate('local')(req, res, function () {
                    if(req.user.role == "ORGANISER"){                 
                    res.redirect('/organiser'); }
                   
                    var transporter=nodemailer.createTransport({
                        service:'gmail',
                        auth:{
                            user:process.env.EMAIL,
                            pass:process.env.EMAIL_PASSWORD
                        }
                    });
                    
                    var mailOptions={
                        from:process.env.EMAIL,
                        to:req.body.email,
                        subject:'Succesfully Registered as an Organiser in Grab My Seat',
                        text:'Thanks for contacting GRAB MY SEAT'
                    };
                    transporter.sendMail(mailOptions,function(error,info){
                        if(error){
                            console.log('error');
                        }
                        else{
                            console.log('Email sent:'+info.response);
                        }
                    });
                });
            }
        }
    );
});

/*=======================================================================
                         ORGANIZER LOGIN
========================================================================*/
app.get("/login",(req,res)=>{
    res.render('login');
});

app.post('/login', function (req, res) {
    const organiser = new Organiser({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(organiser, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate('local', {failureRedirect: '/login'})(req, res, function () {
                if(req.user.role=="ORGANISER"){
                res.redirect("/organiser");
            }
            });
        }
});
});




/*=======================================================================
                         COLLEGE EVENTS
========================================================================*/
app.get("/collegeEvents", function(req, res){
    CollegeEvent.find({}, function(err, foundEvents){
        if(err){
            console.log(err);
        } else {
            res.render("collegeEvents", {foundEvents});
        }
    })
});

/*=======================================================================
                         LOGOUT
========================================================================*/
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/audilogout', function (req, res) {
    req.logout();
    res.redirect('/');
});
app.listen(3000 , ()=>{
    console.log("server running at 3000")
});


