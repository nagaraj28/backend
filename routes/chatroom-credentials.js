const router = require('express').Router();
const chatRoomUsers = require(".././models/chatroomusers.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();


/* 
login to the site
*/
router.route('/login').post(async(req,res)=>{
    try{
    //   console.log(email);
      const email = req.body.email;
      const password = req.body.password;
      let userProfile = await chatRoomUsers.findOne({
                "email":email
            });
      if(userProfile){
        const isMatch = await bcrypt.compare(password, userProfile.password);
        if(isMatch){
            const token = jwt.sign({
                 userid: userProfile._id ,
                 username:userProfile.username
                }, process.env.JWT_SECRET);
                     res.status(200).json({
                         status:"success",
                         token
                     });
                 }
                 else{
                     res.status(200).json({
                        status:"fail",
                        errorMessage:"incorrect password,please enter valid credentials"
                     });
                 }
            }
            else{
                res.status(200).json({
                    status:"fail",
                    errorMessage:"email doesn't exist"
                });
            }
        }
        catch(err){
            console.log("error logging in ecommerce",err);
            res.status(404).json({
                        status:"fail",
                        errorMessage:err
                    });
        }
});

/* 
sign up into the site
*/

router.route('/signup').post(async(req,res)=>{
    try{
        const email = req.body.email;
        const passwordBody = req.body.password;
        const username  = req.body.username;
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(passwordBody, salt);
        const userNameExists = await chatRoomUsers.find({
            username:username
        });
        if(userNameExists.length>0){
            res.status(200).json({
                status:"fail",
                errorMessage:"username already exists"
            });
        }
        else{
            let userProfile = await chatRoomUsers.find({
                "email":email
            },
       {
        email:1,_id:0   
       }
            );
   if(userProfile.length<=0){
       const userCreated =new chatRoomUsers({
                       username,
                       email,
                       password
                   });
                   userCreated.save().then((user)=>{
                       res.status(200).json({
                           status:"success",
                           message:"registration Successful!"
                        })
                   }).catch(err=>{
                       res.status(200).json({
                           status:"fail",
                           message:"some error occured during registering,please try again!"
                       });
                   });
   }
   else{
       res.status(200).json({
           status:"fail",
           errorMessage:"email already exists!"
       });
   }
        }
   
    }
    catch(err){
        console.log("error signing up user in ecommerce",err);
        res.status(404).json({
                    status:"fail",
                    errorMessage:"error logging-in"
                });
    }
});



module.exports = router;