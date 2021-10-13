const router = require('express').Router();
const userProfileDetails = require('../models/userprofiledetails.model');
const mongoose = require('mongoose');
const Schema =  mongoose.Schema;


/*
get all the users profile data
*/

router.route('/').get((req,res)=>{
    userProfileDetails.find().then(userProfiles=>{
      res.send(userProfiles);
    }).catch(err=>res.status(400).json("error fetching all users profiles"+err))
});

/*
get user details by userid
*/
router.route('/byuserid/:userid').get((req,res)=>{
  //const userid = req.body.userid;
 /// let userid;
 console.log("hello",req.params.userid)
 userProfileDetails.findOne({userid:req.params.userid}).then((err,user)=>{
  //  console.log(req.params.id);
  if(!err)
    res.send(user);
    else
    res.send(err);
          // console.log("error",err);
   //  console.log("user",user);
    // res.send(user);
      });
});

/*
get user details by username
*/
router.route('/:username').get((req,res)=>{
    //const userid = req.body.userid;
   /// let userid;
   userProfileDetails.findOne({username:req.params.username}).then((err,user)=>{
    //  console.log(req.params.id);
    if(!err)
      res.send(user);
      else
      res.send(err);
            // console.log("error",err);
     //  console.log("user",user);
      // res.send(user);
        });
});

/*
get user details by userid
*/
router.route('/:userid').get((req,res)=>{
  //const userid = req.body.userid;
 /// let userid;
 console.log("hello",req.params.userid)
 userProfileDetails.findOne({userid:req.params.userid}).then((err,user)=>{
  //  console.log(req.params.id);   
  if(!err)
    res.send(user);
    else
    res.send(err);
          // console.log("error",err);
   //  console.log("user",user);
    // res.send(user);
      });
});


/*
update user profile details
*/


router.route('/profileupdate').post((req,res)=>{
  const userid=req.body.userid;
  console.log()
  const  profileDataToUpdate ={"$set":{
     username : req.body.username,
     fullname : req.body.fullname,
     bio : req.body.bio,
     link : req.body.link,
     avatar : req.body.avatar,
  }
};
    userProfileDetails.findOneAndUpdate({userid:userid},profileDataToUpdate,{ "new": true, "upsert": true }).then(()=>{res.json("profile updated to list")})
    .catch(err => res.status(400).json('error while adding followerid into userid table ' + err));
});
/*
add follower
*/
router.route('/follow').post((req,res)=>{
   const userid=req.body.userid;
   const followerid = req.body.followerid;
   /*
   add  followerid into user follower's array
   */
  console.log(userid);
  console.log(followerid);
  userProfileDetails.findOneAndUpdate({userid:userid},{"$addToSet":{
    "following":followerid
  }},{ "new": true, "upsert": true }).then(()=>{res.json("follower added to list")})
  .catch(err => res.status(400).json('error while adding followerid into userid table ' + err));

  /*
   add userid into follower's following  array
   */
  userProfileDetails.findOneAndUpdate({userid:followerid},{"$addToSet":{
    "followers":userid
  }},{ "new": true, "upsert": true }).then(()=>{
    //res.json("user added to following list")
    console.log("user added to following list...")
  })
  .catch(err => res.status(400).json('Error: ' + err));
  res.send({followerid});

});

/*
unfollow

*/
router.route('/unfollow').post((req,res)=>{
  const userid=req.body.userid;
  const followerid = req.body.followerid;
  /*
  remove  followerid into user follower's array
  */
 userProfileDetails.findOneAndUpdate({userid:userid},{"$pull":{
   "following":followerid
 }},{ "new": true, "upsert": true }).then(()=>{res.json("follower remove from list")})
 .catch(err => res.status(400).json('error while removing followerid from userid table ' + err));

 /*
  remove userid into follower's following  array
  */
 userProfileDetails.findOneAndUpdate({userid:followerid},{"$pull":{
   "followers":userid
 }},{ "new": true, "upsert": true }).then(()=>{
   /*res.json("user removed from following list")*/
  })
 .catch(err => res.status(400).json('Error: ' + err));
});

/*
fetch following  userDetails list

*/

router.route('/following/:userid').get((req,res)=>{
  try{
  userProfileDetails.findOne({userid:req.params.userid},(err,user)=>{
      if(!err){
      //  console.log(user.following);
     // const followingData = user.following;
     // console.log(followingData);
      
      const followingTimes =  user.following.map(eachFollowing => {
         return eachFollowing.getTimestamp();
      });
      console.log(followingTimes);
        userProfileDetails.find({
          userid:{
              $in:user.following
          } 
         },(err,alltheusers)=>{
           if(err)
           throw err;
         //  console.log(alltheposts);
          res.send({
            followingData:alltheusers,
            timesArray:followingTimes
          });
      }
         )
      }
      else
      throw err;
  })
}catch(err){
  console.log(err);
}
})

/*
fetch followers  userDetails list

*/

router.route('/followers/:userid').get((req,res)=>{
  try{
  userProfileDetails.findOne({userid:req.params.userid},(err,user)=>{
      if(!err){
      //  console.log(user.following);
     // const followingData = user.following;
     // console.log(followingData);
      
      const followersTimes =  user.followers.map(eachFollowing => {
         return eachFollowing.getTimestamp();
      });
      console.log(followersTimes);
        userProfileDetails.find({
          userid:{
              $in:user.followers
          } 
         },(err,alltheusers)=>{
           if(err)
           throw err;
         //  console.log(alltheposts);
          res.send({
            followersData:alltheusers,
            timesArray:followersTimes
          });
      }
         )
      }
      else
      throw err;
  })
}catch(err){
  console.log(err);
}
})




module.exports = router;