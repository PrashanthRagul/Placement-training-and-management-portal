var mongoose = require("mongoose");

// SCHEMA SETUP
var CompanySchema1 = new mongoose.Schema ({
    name: String,
    link: String,
});

module.exports = mongoose.model("Companyinfo", CompanySchema1,"Companyinfo");
