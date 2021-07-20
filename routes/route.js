const  mongoose = require("mongoose");
const express = require('express');
var Company = require("../models/company.js");
var Companyinfo = require("../models/companyinfo.js");
var db=mongoose.connection;
var ObjectId = require('mongoose').Types.ObjectId;
const passport=require('passport');
var router= express.Router();
var events = require('events');
var eventEmitter = new events.EventEmitter();
const nodemailer=require('nodemailer');
const mailer = require("@sendgrid/mail");
const cron = require('node-cron');

let alert = require('alert');  
const { Console } = require("console");
const company = require("../models/company.js");


 //current time
//homepage

router.get("/", function (req, res) { 
  var datetime = new Date();
console.log(datetime.toISOString().slice(0,10)); //current date
currentdate=datetime.toISOString().slice(0,10);

var d = Date(Date.now());

// Converting the number of millisecond 
// in date string
a = d.toString();

// Printing the current date                    
console.log( a.slice(16,24)) ;
a=a.slice(16,24).toString()
currenthr=a.slice(0,2).toString();
currentmin=a.slice(3,5).toString()

var ctime="8";
//var cmin="00";


    db.collection("Companyinfo").find({testdate:currentdate}).toArray(function(err, links){
        
      links.forEach(function(company1)
      {testdate=company1.testdate;
        id=company1._id.toString();
        console.log(company1._id);
var type=company1.type;
var company=company1.username;
if(type=="webinar")
{
var topic=company1.topic;
var time=company1.time;
}
        console.log(company1.testdate);
       
        console.log("date equal");
        db.collection("eventappliedstudent").findOne({eventid:id}, function(err, students) {
          if(!students)
          {console.log(err);
              req.flash("error","no students have been applied yet")
           return res.redirect("/home");
          }
          var appliedstudents=students.studentsapplied;
          console.log(appliedstudents);
          var studentinfo=[];
          f=0;
          appliedstudents.forEach(function(student){
          console.log(student);
          db.collection("student").findOne({username:student}, function(err, info) {
            console.log(info.email);
         email=info.email;
          studentinfo.push(info.email);
          
          console.log(studentinfo);
          mailer.setApiKey("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");

});

     //     });
         
          });
         
          
              });
        
      //  console.log(company1.regdate);

      });
    });

 console.log("equal");

 



console.log(currenthr);
console.log(currentmin);
    res.redirect("/home"); 
}); 

//homepage
router.get("/home", function (req, res) { 

  db.collection("notificationadmin").find({}).toArray(function(err,notifications){
  
if(err)
{
  console.log(err);
}
  console.log(notifications);
    res.render("home",{notifications:notifications}); 
  });
}); 
router.get("/loginadmin", function (req, res) { 
  res.render("loginadmin"); 
}); 
router.get("/admin", function (req, res) { 
  res.render("admin"); 
}); 

//registering student page

router.get("/registerstudent", function (req, res) { 
  res.render("registerstudent",{mes:" "}); 
}); 

//registering student db saving

router.post("registerstudent", function (req, res) { 
  var username = req.body.username 
  var password = req.body.password 
  var type="student"//day1
  var mobile=req.body.mobile
  var name=req.body.name
  var email=req.body.email
  var gender = req.body.gender 
  var address = req.body.address 
  var twelth=req.body.twelth
  var tenth=req.body.tenth
  var department=req.body.department
  var cgpa=req.body.cgpa
  var yearofpass=req.body.yearofpass
  var currentyear=req.body.currentyear
  var skills=req.body.skills
  var link=req.body.resumelink
  var course=req.body.course
  if(req.body.history==null)
   history="no"
  else
   history="yes"

  var backlog=req.body.backlog

var student=
{
  username:username,mobile:mobile,name:name,email:email,
  gender:gender,address:address,twelth:twelth,tenth:tenth,department:department,
  cgpa:cgpa,yearofpass:yearofpass,currentyear:currentyear,skills:skills,resume:link,
  course:course,history:history,backlog:backlog

}
  Company.register({username:username,usertype:type},password, function (err, user) { //day1
    if (err) { 
        console.log(err); 
       
        req.flash("error","error: The user already exists");
        return res.render("registerstudent",{error:req.flash("error")}); 
    } 
    

    db.collection("student").insertOne(student);
   
            req.flash("success","sucessfully created account")
        res.render("loginstudent", {success:req.flash("success")}); 
     
}); 
});
router.get("/updatestudent/:id", function (req, res) { 
  studentid=req.params.id
  db.collection("student").findOne({username:studentid}, function(err, student) {
    if(err)
    {console.log(err);
    return  res.redirect("/home");
    }
    if(!student)
    {
     return   res.redirect("/profile/"+studentid);
    }
    if(student.gender=="male")
    res.render("updatestudent",{student:student,male:"checked",female:" "})
    else
    res.render("updatestudent",{student:student,male:" ",female:"checked"})
  });
  


});
router.post("/updatestudent", function (req, res) { 
  var username = req.body.username 
 
  var mobile=req.body.mobile
  var name=req.body.name
  var email=req.body.email
  var address = req.body.address
  var gender=req.body.gender
  var tenth= req.body.tenth
  var twelth=  req.body.twelth 
  var department=req.body.department
  var cgpa = req.body.cgpa
  var yearofpass = req.body.yearofpass
  var currentyear = req.body.currentyear
  var skills = req.body.skills 
  var link=req.body.resumelink 
  var course=req.body.course
  if(req.body.history==null)
  {
   history="no"
  }
  else
  {
   history="yes"
  }
  var backlog=req.body.backlog

     

  db.collection("student").updateOne({'username':username},{$set:{'course':course,'history':history,'backlog':backlog,'mobile':mobile,'name':name,'email':email,'address':address,'gender':gender,'tenth':tenth,'twelth':twelth,'department':department,'cgpa':cgpa,'yearofpass':yearofpass,'currentyear':currentyear,'skills':skills,resume:link}},function(err,result)
  {if(err)
      {
          console.log(err);
      }

  });
  req.flash("success","updated sucessfully ")
  res.redirect("/profile/"+username);
  
});



router.get("/registercompany", function (req, res) { 
  res.render("registercompany",{mes:" "}); 
}); 
router.post("/registercompany", function (req, res) { 
  var username = req.body.username 
  var password = req.body.password 
  var mobile=req.body.mobile

  var email=req.body.email
  var type=req.body.type
  var link= req.body.link
  var category=  req.body.category 
  var head=req.body.head
  var type1="company"//day1

      Company.register({username:username,usertype:type1},password, function (err, user) { //day1
      if (err) { 
          console.log(err); 
         
          req.flash("error","error: The user already exists");
          return res.render("registercompany",{error:req.flash("error")}); 
      } 
      
  
      db.collection("companyadditional").insertOne({username:username,mobile:mobile,name:username,email:email,type:type,link:link,category:category,headquaters:head});
    
              req.flash("success","sucessfully created account")
          res.render("logincompany",{
            success:req.flash("success")
          }); 
      
  }); 
  });
  


  router.get("/loginstudent", function (req, res) { 
    res.render("loginstudent"); 
  });
  router.get("/logincompany", function (req, res) { 
    res.render("logincompany"); 
  });


  
  router.post("/logincompany", passport.authenticate("local", { 
    //successRedirect: "/profile", 
    failureRedirect: "/logincompany"
}), function (req, res) { 

    var username=req.body.username;
    console.log(username);
    res.redirect("/profile/"+username);
   
  
});
router.post("/loginadmin", passport.authenticate("local", { 
  //successRedirect: "/profile", 
  failureRedirect: "/loginadmin"
}), function (req, res) { 

  var username=req.body.username;
  console.log(username);
  res.redirect("/profile/"+username);
 

});

router.post("/loginstudent", passport.authenticate("local", { 

  failureRedirect: "/loginstudent"
}), function (req, res) { 
  var username=req.body.username;
  console.log(username);
 
  res.redirect("/profile/"+username);
 
 
  
});

  router.get("/logout", function (req, res) { 
    req.logout(); 
    temp=1;
    res.redirect("/"); 
}); 
router.get("/check",isLoggedIn, function (req, res) {


});
  
function isLoggedIn(req, res, next) { 

    if (req.isAuthenticated()) return next(); 
    res.redirect("/loginstudent"); 
}
 


router.get("/event/:name", function (req, res) {
   
  res.render("event",{tab1:"active",tab2:"fade",tab3:"fade",tab4:"fade",head1:"active",head2:" ",head3:" ",head4:" ",name:req.params.name}); 
});
router.get("/hiringplacement/:name", function (req, res) { 
  res.render("event",{tab1:"active",tab2:"fade",tab3:"fade",tab4:"fade",head1:"active",head2:" ",head3:" ",head4:" ",name:req.params.name}); 
});
router.get("/hiringintern/:name", function (req, res) { 
  res.render("event",{tab1:"fade",tab2:"active",tab3:"fade",tab4:"fade",head1:" ",head2:"active",head3:" ",head4:" ",name:req.params.name}); 
});
router.get("/webinar/:name", function (req, res) { 
  res.render("event",{tab1:"fade",tab2:"fade",tab3:"active",tab4:"fade",head2:" ",head1:" ",head3:"active",head4:" ",name:req.params.name}); 
});
router.get("/other/:name", function (req, res) { 
  res.render("event",{tab1:"fade",tab2:"fade",tab3:"fade",tab4:"active",head2:" ",head1:" ",head3:" ",head4:"active",name:req.params.name}); 
});

router.post("/hiring/:name", function (req, res) { 
  var name=req.params.name;
  console.log(name);
  
  link=req.body.link;
  
  console.log(link);
  
  companyinfo = new Companyinfo({
    name: name,
   link:link,
});


companyinfo.save();
res.redirect("/profile/"+name);
     
      
    
});
router.get("/profile/:name", function (req, res) { 

var type1;
Company.findOne({username:req.params.name}, function (err, user) { //day1
  if (err) { 
      console.log(err); 
     return res.redirect("/home");
  }
  if(!user)
  return res.redirect("/home");
  
    type1=user.usertype;
  
    console.log(user.usertype);
    console.log(type1);
    if(type1=="student")
{
  db.collection("student").findOne({username:req.params.name}, function(err, student) {
    if(err)
    {
      console.log(err);
      return res.redirect("/home");
    }
    if(!student)
    {
      console.log(err);
      return res.redirect("/home");
    }
    db.collection("studentsevents").findOne({rollno:req.params.name}, function(err, links){
      if(err)
      {
        console.log(err);
        return res.redirect("/home");
      }
      if(!links)
      {
      return  res.render("profilestudent",{student:student,links:[]}); 
      }
    
   
      res.render("profilestudent",{student:student,links:links.events});
    });
  });
}
else if(type1=="admin")
{
  res.redirect("/main/getnotification");
}
else{
db.collection("Companyinfo").find({username:req.params.name}).toArray( function(err, links){
    db.collection("companyadditional").findOne({username:req.params.name}, function(err, Company) {
      links.forEach(function(company1)
      {
        console.log(company1.username);
        console.log(company1.regdate);

      });
        res.render("companyprofile",{links:links,company:Company,disable:" "}); 
      });
       
       
  
    
      });
    }
  
});

});

router.get("/disable/:name", function (req, res) { 
var disable="disabled";
db.collection("Companyinfo").find({username:req.params.name}).toArray( function(err, links){
  db.collection("companyadditional").findOne({username:req.params.name}, function(err, Company) {
    links.forEach(function(company1)
    {
      console.log(company1.username);
      console.log(company1.regdate);

    });
      res.render("companyprofile",{links:links,company:Company,disable:"readonly"}); 
    });
     
     

  
    });

});



const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
router.get("/company", function (req, res) { 
  let noMatch = null;
        if (req.query.search) {
          const regex = new RegExp(escapeRegex(req.query.search), 'gi');
         db.collection("companyadditional").find({name: regex}).toArray( function(err, allcompany) {
            if (err) { console.log(err); }
            else {
              if (allcompany.length < 1) {
                noMatch = "No Company found, please try again.";
              }
              res.render("company", { companys: allcompany, noMatch: noMatch });  
            }
          });
        } else {
          db.collection("companyadditional").find({}).toArray( function(err, allcompany) {
            if (err) { console.log(err); }
            else {
              allcompany.forEach(function(company1)
              {
                console.log(company1.name);
              });
              var companys=[]
              console.log(allcompany.length);
              console.log(noMatch);
              for(var i=0; i<allcompany.length;i++) {
                companys.push(allcompany[i]);
             }
              res.render("company", { companys: companys, noMatch: noMatch });  
            }
          }); 
        }}); 


router.post('/changepass', (req, res) => {
  password=req.body.newpassword;
username=req.body.username;
console.log(password);
console.log(username);
  Company.findOneAndDelete({username:username}, (err, doc) => {
      if (!err) {  
        type=doc.usertype;
        console.log(doc.usertype);
        console.log(type);
        
        req.logout();
        Company.register({username:username,usertype:type}, 
        password, function (err, user) { 
    if (err) { 
        console.log(err); 
       
        return res.redirect("/home");
    } 
    
  else
  {
    req.flash("success","password changed successfully login again");
    res.render("loginstudent",{success:req.flash("success")}); 
  }
      
}); }
if(!doc)
{
    return res.redirect("/home");
}
      if (err) { console.log('Error in user Delete :' + JSON.stringify(err, undefined, 2)); }
  });
});
router.get("/update/:id", function (req, res) { 
  comname=req.params.id
  db.collection("companyadditional").findOne({username:comname}, function(err, company) {
    if(err)
    {console.log(err);
    return  res.redirect("/home");
    }
    if(!company)
    {
     return   res.redirect("/profile/"+comname);
    }
    if(company.type=="service")
    res.render("updatecompany",{company:company,service:"checked",product:" "})
    else
    res.render("updatecompany",{company:company,service:" ",product:"checked"})
   
  });
  


});
router.post("/update", function (req, res) { 

    
  var username = req.body.username 
 
  var mobile=req.body.mobile
  var name=req.body.username
  var email=req.body.email
 var type=req.body.type
  var link= req.body.link
  var category=req.body.category
 
  var head=req.body.head
  db.collection("companyadditional").updateOne({'username':username},{$set:{'mobile':mobile,'name':name,'email':email,'link':link,'headquaters':head,'type':type,'category':category,}},function(err,result)
  {if(err)
      {
          console.log(err);
      }
      req.flash("success","Updated successfully");
      res.redirect("/profile/"+username);
  });
 
  
}); 




router.get("/eventdisplay/:id/:name1", function (req, res) {
  if(!req.user)
   return res.redirect("/home");
console.log(req.params.id);
name1=req.params.name1;
console.log(name1);
if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
  db.collection("Companyinfo").findOne({_id:ObjectId(req.params.id)},function(err, display){

    if(err)
    {
      console.log(err);
     return  res.redirect("/home");

    }
    if(!display)
    {
     // console.log(err);
     req.flash("error","the event is deleted by the company")
 
     return res.redirect("/profile/"+name1);
  
  
    }
    console.log(req.user.usertype);
   

res.render("eventdisplay",{event:display});


  });

});

router.get("/eventdisplaystudent/:id/:name1", function (req, res) {
  if(!req.user)
   return res.redirect("/home");
console.log(req.params.id);
name1=req.params.name1;
console.log(name1);
if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
  db.collection("Companyinfo").findOne({_id:ObjectId(req.params.id)},function(err, display){

    if(err)
    {
      console.log(err);
     return  res.redirect("/home");

    }
    if(!display)
    {
     // console.log(err);
    
     req.flash("error","the event is deleted by the company")
 
     return res.render("deleteeventstudent",{id:req.params.id,error:req.flash.error})
  
  
    }
    console.log(req.user.usertype);
   

res.render("eventdisplaystudent",{event:display});


  });

});
router.post("/placement/:name", function (req, res) { 
  username=req.params.name;
    regdate=req.body.regdate;
    if(req.body.history!=null)
    history="yes"
    else
    history="no"
    if(req.body.arrear!=null)
    arrear="yes"
    else
    arrear="no"
  var info={
    type:"placement",
    username:username,
     regdate:regdate,
   dept:req.body.dept,
   dept1:req.body.dept1,
   cgpa:req.body.cgpa,
   ctc:req.body.CTC,
   role:req.body.role,
   testdate:req.body.testdate,
   nohistoryofarrears:history,
   nobacklogs:arrear,
   desc:req.body.desc
    
  }
  
  db.collection("Companyinfo").insertOne(info, function(err, result) {
    if(err)
    {
    return res.render("event");
    }
    else
    {
    req.flash("success","event added");
    res.redirect("/event/"+username);
    }
  });
  });
router.post("/intern/:name", function (req, res) { 
  username=req.params.name;
    regdate=req.body.regdate;
    ppo=req.body.internppo;
    console.log(ppo);
    if(ppo!=null)
    ppooffer="offered"
    else
    ppooffer="notoffered"
    if(req.body.history!=null)
    history="yes"
    else
    history="no"
    if(req.body.arrear!=null)
    arrear="yes"
    else
    arrear="no"
  var info={
    type:"intern",
    username:username,
     regdate:regdate,
   dept:req.body.dept,
   dept1:req.body.dept1,
   cgpa:req.body.cgpa,
   
   role:req.body.role,
   testdate:req.body.testdate,
   
   stipend:req.body.stipend,
   months:req.body.months,
   startdate:req.body.startdate,
   lastdate:req.body.lastdate,
   ppooffer:ppooffer,
   desc:req.body.desc,
   nohistoryofarrears:history,
 nobacklogs:arrear,
    
  }
  
  db.collection("Companyinfo").insertOne(info, function(err, result) {
    if(err)
    {
    return res.render("event");
    }
    else
    {
      
    req.flash("success","event added");
    res.redirect("/event/"+username);
    }
  
  
  });
  
  });
  router.post("/webinar/:name", function (req, res) {
    username=req.params.name;
    var info={
      type:"webinar",
      username:username,
       
     topic:req.body.topic,
     testdate:req.body.date,
     time:req.body.time,
     
     desc:req.body.desc,
    }
    db.collection("Companyinfo").insertOne(info, function(err, result) {
      if(err)
      {
      return res.render("event");
      }
      else
      {
        mailer.setApiKey("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");
   
      req.flash("success","event added");
      res.redirect("/event/"+username);
      }
    
    
    });
  });
  router.post("/other/:name", function (req, res) {
    username=req.params.name;
    var info={
      type:"other",
      username:username,
      desc:req.body.desc,
    }
    db.collection("Companyinfo").insertOne(info, function(err, result) {
      if(err)
      {
      return res.render("event");
      }
      else
      {
        
      req.flash("success","event added");
      res.redirect("/event/"+username);
      }
    
    
    });

  });

  
 
router.get("/questions", function (req, res) { 
        
    let user=req.user.username;
    console.log("fghfdjhg"+user);
   
console.log(user);

   res.redirect("/questions/"+user);
    
})



router.get("/questions/:user",function (req, res) {
var username=req.params.user;

console.log(username);
console.log("queey"+req.query.search)

    //let device_list=[{"question":"aaaa"},{"question":"bbb"}];
        // const collection=db.collection();
if (req.query.search) {
  const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          const regex = new RegExp(escapeRegex(req.query.search), 'gi');
         db.collection("qanda").find({question: regex}).toArray( function(err, device_list) {
            if (err) { console.log(err); }
            else {
              if (device_list.length < 1) {
                noMatch = "No question found, please try again.";
              }
              res.render("questions", { "questions": device_list,"user":username});  
            }
          });
        } else {
           
        db.collection("qanda").find({}).toArray((err, device_list) => {
           
            console.log("found00");
            res.render("questions", { "questions": device_list,"user":username});

        });
        }
//res.render("questions", { "questions": device_list });
    });





router.get("/add_qanda", function (req, res) { 
    
    res.render("add_qanda"); 
}); 

// Handling user signup 
router.post("/add_qanda", function (req, res) { 
    var question = req.body.question
    var answer = req.body.answer 
    

  //db.qanda.insertOne({"question":"eeee","answer":[{"ans":"ooojjjj","upvote":["ram"],"downvote":["raj"]}]});


    db.collection("qanda").insertOne({question:question,answer:[{ans:answer,upvote:[],downvote:[]}]},function(err,result)
    {if(err)
        {
            console.log(err);
        }
      
    });
    let user=req.user.username;
    req.flash("success","question added");
    //redirect to question plus userID
    res.redirect("/questions/"+user);
     
    });





    router.get("/add_answer", function (req, res) { 
        console.log("add answer");
        res.render("add_answer"); 
    }); 
    
    // Handling user signup 
    router.post("/add_answer", function (req, res) { 
        var question = req.body.question
        var answer = req.body.answer 
        var user = req.body.user
    //    db.qanda.update({question:"What is DDL"},{$push:{"answer":{ans:"ssss",upvote:[],downvote:[]}}});

    
        db.collection("qanda").update({'question':question},{$push:{'answer':{'ans':answer,upvote:[],downvote:[]}}},function(err,result)
        {if(err)
            {
                console.log(err);
            }
          
        });
        var q=question+";"+user;
        res.redirect("/more_info/"+q);
         
        });
    






    router.post("/moreinfo", function (req, res) { 

        var q=req.body.question;
       // res.redirect("/updateuser/"+username);
       res.redirect("/more_info/"+q);
        
    })

    router.get("/more_info/:q",function (req, res) { 

       
        var q=req.params.q;
        var pos = q.indexOf(";");
var question=q.substring(0,pos);
var user=q.substring(pos+1,q.length);
        console.log(q);
        console.log(question);
        console.log(user);
         db.collection("qanda").find({question:question}).toArray((err, device_list) => {
            console.log("found");
            console.log(question);
            res.render("moreinfo", { "questions": device_list,"username":user});

        });
    
        
    });
   



    router.post("/upvotes", function (req, res) { 

        var q=req.body.upvotes;
        var qn=req.body.qn;
        console.log("1."+qn);
        console.log("2."+q);
       // res.redirect("/updateuser/"+username);
       res.redirect("/upvotes/"+q+"/"+qn);
        
    })

    router.get("/upvotes/:q/:qn",function (req, res) { 
        var q=req.params.q;
        var qn=req.params.qn;
        console.log("abinaya"+qn
        );
        var pos = q.indexOf(";");
        var answ=q.substring(0,pos);
        var user=q.substring(pos+1,q.length);
                console.log(q);
                console.log(answ);
                console.log(user);
                //db.qanda.find({answer:{$elemMatch:{ans:"Data Definition Languag"}}});               
                var index=-1;
                    var c=0;
                    var question;
                db.collection("qanda").find({"answer":{$elemMatch:{"ans":answ}}}).toArray((err, device_list) => {
                    console.log("found");
                    console.log(device_list);
                    
                   for(var k=0;k<device_list.length;k++){
                       question=device_list[k].question;
                    for(var i=0;i<device_list[k].answer.length;i++)
                    {
                         if(index==-1&&device_list[k].answer[i].ans==answ)
                         {  console.log("hloooooooooo.")
                             index=i;
                             console.log(index);
                         }
                         if(device_list[k].answer[i].ans==answ){
                         for(var j=0;j<device_list[k].answer[i].upvote.length;j++)
                         {   
                             if(device_list[k].answer[i].upvote[j]==user)
                             {
                                 c++;
                             }
                             console.log(device_list[k].answer[i].upvote[j]);
                         }
                         for(var j=0;j<device_list[k].answer[i].downvote.length;j++)
                         {   
                             if(device_list[k].answer[i].downvote[j]==user)
                             {
                              console.log("indexkjfvhjfk1 "+index);
                             console.log("yyyyyyyyyyyyyyyyy");
                                //db.qanda.update({question:"What is DDL"},{$pull:{"answer.0.upvote":{ $in:["ram"]}}});
                               // if(index==0) 
                               var query = "answer."+index+".downvote"
                               var querystring=query.toString();
                               console.log(querystring);
                                db.collection("qanda").updateOne({"question":question,"answer.ans":answ},{$pull:{"answer.$.downvote":{$in:[user]}}});
                               // else if(index==1)  
                               // db.collection("qanda").updateOne({"question":question},{$pull:{"answer.1.downvote":{$in:[user]}}});
                                    
                                 
                              //  else if(index==2)  
                              //  db.collection("qanda").updateOne({"question":question},{$pull:{"answer.3.downvote":{$in:[user]}}});

                                c=0;break;

                             }
                         }

                        }
                    }
                }
               
                  //  res.render("moreinfo", { "questions": device_list,"username":user});
                  console.log(c);
                  console.log(index);
                  var query1= 'answer.'+index+'.upvote'
                  var querystring1=query1.toString();
                //  console.log(querystring1);
                  if(c==0)
                  {   var n = index.toString();
                       var s="answer."+n+".upvote";
                       var val=s.toString();
console.log("indexkjfvhjfk2 "+index);
                       console.log(val);
                     // db.qanda.update({question:"What is DDL"},{$push:{"answer.0.upvote":"rakesh"}});
                   //  if(index==0)  ;
                  
                      db.collection("qanda").updateOne({"question":question,"answer.ans":answ},{$push:{"answer.$.upvote":user}});
                    //  else if(index==1)  
                    //  db.collection("qanda").updateOne({"question":question},{$push:{"answer.1.upvote":user}}); 
                    //  else if(index==2)  
                    //  db.collection("qanda").updateOne({"question":question},{$push:{"answer.2.upvote":user}});
                     // else if(index==3)  
                     // db.collection("qanda").updateOne({"question":question},{$push:{"answer.3.upvote":user}});
                      res.redirect("/more_info/"+qn);
                  }
                  else 
                  {req.flash("error","You have already upvoted");
                    res.redirect("/more_info/"+qn);
                  }
                });
                
                
    });


    router.post("/downvotes", function (req, res) { 

        var q=req.body.downvotes;
        console.log(q);
        var qn=req.body.qn;
       res.redirect("/downvotes/"+q+"/"+qn);
        
    })

    router.get("/downvotes/:q/:qn",function (req, res) { 
        var q=req.params.q;
        var qn=req.params.qn;
        var pos = q.indexOf(";");
        var answ=q.substring(0,pos);
        var user=q.substring(pos+1,q.length);
                console.log(q);
                console.log(answ);
                console.log(user);
                //db.qanda.find({answer:{$elemMatch:{ans:"Data Definition Languag"}}});               
                var index=-1;
                    var c=0;
                    var question;
                db.collection("qanda").find({"answer":{$elemMatch:{"ans":answ}}}).toArray((err, device_list) => {
                    console.log("found");
                    console.log(device_list);
                    
                   for(var k=0;k<device_list.length;k++){
                       question=device_list[k].question;
                    for(var i=0;i<device_list[k].answer.length;i++)
                    {
                         if(index==-1&&device_list[k].answer[i].ans==answ)
                         {  console.log("hloooooooooo.")
                             index=i;
                             console.log(index);
                         }
                         if(device_list[k].answer[i].ans==answ){
                         for(var j=0;j<device_list[k].answer[i].downvote.length;j++)
                         {   
                             if(device_list[k].answer[i].downvote[j]==user)
                             {
                                 c++;
                             }
                             console.log(device_list[k].answer[i].downvote[j]);
                         }
                         for(var j=0;j<device_list[k].answer[i].upvote.length;j++)
                         {   
                             if(device_list[k].answer[i].upvote[j]==user)
                             {
                             console.log("yyyyyyyyyyyyyyyyy");
                                //db.qanda.update({question:"What is DDL"},{$pull:{"answer.0.upvote":{ $in:["ram"]}}});
                              //  if(index==0)  
                                db.collection("qanda").updateOne({"question":question,"answer.ans":answ},{$pull:{"answer.$.upvote":{$in:[user]}}});
                              //  else if(index==1)  
                              //  db.collection("qanda").updateOne({"question":question},{$pull:{"answer.1.upvote":{$in:[user]}}});
                                    
                                 
                              //  else if(index==2)  
                              //  db.collection("qanda").updateOne({"question":question},{$pull:{"answer.3.upvote":{$in:[user]}}});

                                c=0;break;

                             }
                         }

                        }
                    }
                }
               
                  //  res.render("moreinfo", { "questions": device_list,"username":user});
                  console.log(c);
                  console.log(index);
                  if(c==0)
                  {   var n = index.toString();
                       var s="answer."+n+".downvote";
                       var val=s.toString();

                       console.log(val);
                     // db.qanda.update({question:"What is DDL"},{$push:{"answer.0.upvote":"rakesh"}});
                   //  if(index==0)  
                      db.collection("qanda").updateOne({"question":question,"answer.ans":answ},{$push:{"answer.$.downvote":user}});
                     // else if(index==1)  
                     // db.collection("qanda").updateOne({"question":question},{$push:{"answer.1.downvote":user}}); 
                     // else if(index==2)  
                     // db.collection("qanda").updateOne({"question":question},{$push:{"answer.2.downvote":user}});
                     // else if(index==3)  
                     // db.collection("qanda").updateOne({"question":question},{$push:{"answer.3.downvote":user}});
                      res.redirect("/more_info/"+qn);
                  }
                  else 
                  {req.flash("error","You have already downvoted");
                    res.redirect("/more_info/"+qn);
                  }
                });
            }); 








    router.get("/departments",function (req, res) {

      db.collection("tutorials").find({}).toArray((err, device_list) => {
                 
          console.log("found00");
          res.render("departments", { "departments": device_list });
      
      });
      
      //res.render("questions", { "questions": device_list });
      });
      
  
  
      router.post("/subjects", function (req, res) { 
        
        let department=req.body.dept;
        console.log(department);
        
       // res.redirect("/updateuser/"+username);
       res.redirect("/subjects/"+department);
        
    })
    
  
    router.get("/subjects/:department",function (req, res) { 
      var department=req.params.department;
      console.log(department);
     // db.tutorials.find({"deptname": "IT"});
     db.collection("tutorials").find({deptname:department}).toArray((err, device_list) => {
         
          console.log("found");
          console.log(department);
          res.render("subjects", { "departments": device_list });
  
      });
  
      
  });
  
  
  
  router.post("/tut_questions", function (req, res) { 
        
    let question=req.body.dept;
    
   res.redirect("/tut_questions/"+question);
    
})

router.get("/tut_questions/:questions",function (req, res) { 
    var questions=req.params.questions;
    console.log(questions);
    console.log("^");
    
     
  db.collection("tutorials").find({subname:questions}).toArray((err, device) => {
       
    console.log("found");
    console.log(questions);
  
  res.render("tut_questions", { "departments": device});
  });
});
//prashant tut:
router.get("/topics",function (req, res) {

  db.collection("coding").find({}).toArray((err, device_list) => {
             
      console.log("found00");
      res.render("topics", { "topics": device_list });
  
  });
  
  //res.render("questions", { "questions": device_list });
  });
  
  
router.post("/coding_questions", function (req, res) { 

  let topic=req.body.topic;
  console.log(topic);
 res.redirect("/coding_questions/"+topic);
  
})

router.get("/coding_questions/:topic",function (req, res) { 
  var topic=req.params.topic;
  console.log(topic);
 // db.tutorials.find({"deptname": "IT"});
 db.collection("coding").find({topic:topic}).toArray((err, device_list) => {
     
      console.log("found");
      console.log(topic);
      res.render("coding_questions", { "topic": device_list });

  });
});




router.post("/coding_qanda", function (req, res) { 

  let question=req.body.question;
  console.log(question);

 res.redirect("/coding_qanda/"+question);
  
});

router.get("/coding_qanda/:question",function (req, res) { 
  var question=req.params.question;
  console.log(question);
 // db.tutorials.find({"deptname": "IT"});


//db.coding.find({"qanda.short_ques":"Jump Game"},{"qanda":{"$elemMatch":{"short_ques" : "Jump Game"}}}); 
 
db.collection("coding").find({"qanda.short_ques":question}).toArray((err, device) => {
     
  console.log("found");
  console.log(question);

res.render("coding_qanda", { "questions": device,"topic":question});
});
});


//add coding questions

 

// Handling user signup 
router.post("/add_coding_qanda", function (req, res) { 
  var question = req.body.question
  var answer = req.body.answer 
  var short = req.body.short
  var topic = req.body.topic 
  var refer = req.body.refer 
  db.collection("coding").findOne({'topic':topic},function(err,questions)
  {
if(err)
 res.redirect("/home");
 if(!questions)
 db.collection("coding").insertOne({'topic':topic,'qanda':[{'short_ques':short,'question':question,'answer':answer,'refer':refer}]})
 else

 {
  db.collection("coding").updateOne({'topic':topic},{ $push:{'qanda':{'short_ques':short,'question':question,'answer':answer,'refer':refer}}},function(err,result)
  {if(err)
      {
          console.log(err);
      }
    
  });
 }
  });
 
 

 req.flash("success","Question Succesfully added")
  res.redirect("/main/getnotification"); 
  });
  router.post("/add_tutorials_qanda", function (req, res) { 
    var question = req.body.question
    var answer = req.body.answer 
    var dept = req.body.dept
    var subject = req.body.subject 
    
   
    db.collection("tutorials").insertOne({'deptname':dept,'subname':subject,'questions':question,'answer':answer},function(err,result)
    {if(err)
        {
            console.log(err);
        }
      
    });

   
    req.flash("success","tutorials Succesfully added")
  res.redirect("/main/getnotification"); 
    });


module.exports=router;