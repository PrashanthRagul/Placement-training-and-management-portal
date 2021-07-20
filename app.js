


const express = require("express");
const  mongoose = require("mongoose");
const   passport = require("passport");
const   bodyParser = require("body-parser");
const   LocalStrategy = require("passport-local");
const webPush = require('web-push');
const path=require("path");
const User = require('./models/company');
const   passportLocalMongoose =require("passport-local-mongoose");
var flash=require("connect-flash");
var app = express();

var routes = require('./routes/route');
var main=require('./routes/main');

app.use(express.static(__dirname + "/public")); 
app.set("view engine", "ejs");
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({ 
    secret: "Rusty is a dog", 
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true);


mongoose.connect('mongodb://localhost:27017/CompanyDemo', (err) => {
    if (!err)
        console.log('MongoDB connection succeeded.');
    else
        console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
});
var db=mongoose.connection;

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
  
    next();
});


  
app.use('/', routes);
app.use('/main',main);

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());


/*var datetime1 = new Date();
console.log(datetime1);*/

var port = process.env.PORT || 3000; 
app.listen(port, function (req,res) { 
    console.log("Server Has Started!"+port); 
}); 


