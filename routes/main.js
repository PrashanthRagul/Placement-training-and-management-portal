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


router.get("/appliedstudents/:id/:type/:name", function (req, res) {
    var type=req.params.type;
    var id=req.params.id;
    var comname=req.params.name;
    db.collection("eventappliedstudent").findOne({eventid:id,companyname:comname,type:type}, function(err, students) {
if(!students)
{console.log(err);
    req.flash("error","no students have been applied yet")
 return res.redirect('/eventdisplay/'+id+'/'+comname);
}
var appliedstudents=students.studentsapplied;
console.log(appliedstudents);
var studentinfo=[];
f=0;
appliedstudents.forEach(function(student){
console.log(student);
db.collection("student").findOne({username:student}, function(err, info) {
studentinfo.push(info);
if(studentinfo.length==appliedstudents.length)
res.render("appliedstudents",{type:type,infos:studentinfo});

});
});

    });

}); 
router.get("/apply/:id/:type/:name/:studentid", function (req, res) {
    var type=req.params.type;
    var id=req.params.id;
    var comname=req.params.name;
    var studentid=req.params.studentid;
    db.collection("student").findOne({username:studentid}, function(err, student) {
       if(err)
       {console.log(err);
       return  res.redirect("/home");
       }
       if(!student)
       {req.flash("error","company can't apply a event")
        return   res.redirect("/profile/"+studentid);
       }
        if(type=="webinar")
        {
      return  res.render('eventwebinar',{id:id,type:type,name:comname,student:student});
        }
         if(type=="placement" )
         {
             if(student.currentyear==4)
         return  res.render('eventplacement',{id:id,type:type,name:comname,student:student});
         else{
            req.flash("error","Only 4th yr students can apply")
            return res.redirect("/profile/"+studentid);
         }
         }
       

         if(type=="intern")
         {
            if(student.currentyear==3)
         return res.render('eventintern',{id:id,type:type,name:comname,student:student});
         else
         {
             req.flash("error","Only 3rd yr students can apply")
             return  res.redirect("/profile/"+studentid);
         }
         }
      
   
        });
   




}); 

router.post("/applyredirect/:studentid", function (req, res) {
    console.log("applyredirect");
var id=req.body.id;
var type=req.body.type;
var name=req.body.name;
var studentid=req.params.studentid;
console.log(id);
console.log(type);

/*db.students.update(
    { name: "joe" },
    { $push: { scores: { $each: [ 90, 92, 85 ] } } }
 )
 */
 db.collection("eventappliedstudent").findOne({eventid:id,companyname:name,type:type}, function(err, student) {


if(err)
{console.log(err);
 return res.redirect("/home");
}
 if(!student)
 
 {
    var info={
        eventid:id,
        companyname:name,
        type:type,
        studentsapplied:[studentid],
    }
    db.collection("eventappliedstudent").insertOne(info, function(err, result) {
        if(err)
        {
        return res.redirect("/home");
        }
      //  req.flash("success","applied");
        res.redirect("/main/profilestudent/"+id+"/"+type+"/"+name+"/"+studentid);
      
      
      });
 }
else{
db.collection("eventappliedstudent").updateOne(
    { eventid:id,
        companyname:name,
        type:type, },
    { $addToSet: {  studentsapplied:   studentid  } },function(err,result)
    {
if(err)
{console.log(err);
    req.flash("error","u have already applied");
return  res.redirect("/home");
}

//req.flash("success","applied");
res.redirect("/main/profilestudent/"+id+"/"+type+"/"+name+"/"+studentid);

    }
 );
}




 });



   


   });


   router.get("/profilestudent/:id/:type/:name/:studentid", function (req, res) {
    var type=req.params.type;
    var id=req.params.id;
    var comname=req.params.name;
    var studentid=req.params.studentid;

    db.collection("studentsevents").findOne({rollno:studentid}, function(err, student) {


        if(err)
        {console.log(err);
         return res.redirect("/home");
        }
         if(!student)
         {
    info={
rollno:studentid,
events:[{eventid:id,type:type,companyname:comname}]

    }

db.collection("studentsevents").insertOne(info, function(err, result) {

    if(err)
    {console.log(err)
    return res.redirect("/home");
    }
    req.flash("success","applied");
    res.redirect("/profile/"+studentid);
  

});
         }
         else{
            db.collection("studentsevents").updateOne(
                {rollno:studentid},
                { $addToSet: {  events:{eventid:id,type:type,companyname:comname}}},function(err,result)
                {
            if(err)
            {console.log(err);
                req.flash("error","u have already applied");
            return  res.redirect("/home");
            }
            
           
            
           if( result.modifiedCount>0)
                
                req.flash("success","applied");
                else
                req.flash("error","u have already applied");
                res.redirect("/profile/"+studentid);
            }
            );
        }

    

   });
});


router.get("/eventdelete/:id/:type/:name", function (req, res) {
    var type=req.params.type;
    var id=req.params.id;
    var comname=req.params.name;

    db.collection("Companyinfo").findOneAndDelete({_id: ObjectId(id)}, function(err, doc) {
    });
    req.flash("success","event deleted successfully")
    res.redirect("/profile/"+comname);
})
router.get("/student/eventdelete/:id/:name", function (req, res) {
    var type=req.params.type;
    var id=req.params.id;
    var studentid=req.params.name;
    /*db.demo541.update({ _id: ObjectId("5e8ca845ef4dcbee04fbbc11") },
...    { $pull: { 'software.services': "yahoo" }}
... ); */

    db.collection("studentsevents").updateOne({rollno: studentid}, {$pull:{events:{eventid:id}}},function(err, doc) {
    if(err)
    {
    console.log("error in event delete")
    return res.redirect("/home");
    }
    req.flash("success","event deleted successfully")
    res.redirect("/profile/"+studentid);
    
    });
    
})
router.post("/loginadmin", function (req, res) {

    var username=req.body.username;
    var password=req.body.password;
    db.collection("admin").findOne({username:username,password:password}, function(err, admin) {
if(err)
{console.log(err);
 return res.redirect("/home");
}
 if(!admin)
 return res.render("loginadmin");

 

 


    
});
});
router.get("/getnotification", function (req, res) {
    db.collection("notificationadmin").find({}).toArray(function(err,notifications){
  
        if(err)
        {
          console.log(err);
        }
          console.log(notifications);
            res.render("admin",{notifications:notifications}); 
          });
        }); 



router.post("/deletemsg", function (req, res) {
    
id=req.body.id;
console.log(id);
db.collection("notificationadmin").findOneAndDelete({_id: ObjectId(id)}, function(err, doc) {

    req.flash("success"," notification deleted successfully")
res.redirect("/main/getnotification");
});



});

router.post("/addmsg", function (req, res) {

    newmsg=req.body.newmsg;

    db.collection("notificationadmin").insertOne({msg:newmsg}, function(err, result) {
        req.flash("success"," notification inserted successfully")
        res.redirect("/main/getnotification");

    });




});


module.exports=router;