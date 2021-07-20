var mongoose = require("mongoose");

// SCHEMA SETUP
var Schema = mongoose.Schema; 

var passportLocalMongoose = require('passport-local-mongoose');
var CompanySchema = new mongoose.Schema ({
    username : {type: String}, 
   usertype:{type:String},
    password : {type: String}, 
   
});
CompanySchema.plugin(passportLocalMongoose,{
    
}); 

module.exports = mongoose.model("Company", CompanySchema,"Company");
