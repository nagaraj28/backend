const router = require('express').Router();
const rooms = require(".././models/rooms.model");
const messageNotification = require("../models/messagenotification.model");

router.route("/").get(async(req,res)=>{
    try{
        const roomsData =await rooms.find();
        if(roomsData&&roomsData.length>=0){
            res.status(200).json({
                status:"success",
                data:roomsData
            });
        }
        else{
           throw err;
        }
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            err:err
        });
    }
});

/* 
create new room
*/
router.route("/createroom").post(async(req,res)=>{
    try{
        const roomName = req.body.roomName;
        const username = req.body.username;
        const roomHistory = [{
            user:username,
            action:"created"
        }];
        const admins = [
                username
        ];
        const blockedAccounts = [];
        const createRoom = await new rooms({
        users:admins,
        roomName,
        roomHistory,
        admins,
        blockedAccounts
    });        
    createRoom.save().then(async(room)=>{
        const addRoomToNotificationDB = await messageNotification.updateOne({
            username:username
        },{
            $addToSet:{
                notifications:{
                    roomid:room._id,
                    roomName,
                    messagecount:0,
                    lastmessage:""
                }
            }
        },{
            upsert:true
        });
        if(!addRoomToNotificationDB){
            throw addRoomToNotificationDB;
        }
        res.status(200).json({
            status:"success",
            message:"room created Successfully!"
         });
    }).catch(err=>{
        console.log(err);
        res.status(200).json({
            status:"fail",
            message:"some error occured during creation,please try again!"
        });
    });
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:"some error occured during creation,please try again!"
        });
    }
});

//delete room

/*
fetch rooms  of users
*/

router.route("/rooms/:username").get(async(req,res)=>{
    try{
        const username = req.params.username;
        const userRooms = await messageNotification.aggregate( 
             [ { $match: {
            username : username
        }},
        
        // Expand the scores array into a stream of documents
        { $unwind: '$notifications' },

        // Sort in descending order
        {
            $sort: {
            'notifications.updatedAt': -1
        }
    },
    {$project:{
        "notifications":1,"_id":0
    }}
    ]);
        // console.log(userRooms);
        if(userRooms){
            res.status(200).json({
                status:"success",
                data:userRooms
            });
        }
        else{
            throw err;
        }
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        });
    }
});

//join into room

router.route("/rooms/adduser").post(async(req,res)=>{
    try{
        const roomid = req.body.roomid;
        const username = req.body.username;
        const userRooms = await rooms.findOneAndUpdate({
            _id:roomid
        },{
            $push:{
                users:username
            },
            $push:{
                roomHistory:{
                    user:username,
                    action:"joined"
                }
            }
        });
        if(userRooms){
            req.status(200).json({
                status:"success",
                data:userRooms
            });
        }
        else{
            throw err;
        }
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        });
    }
});


/*
send notifications to users
*/
router.route("/notify").post(async(req,res)=>{
    try{ 
     const roomid = req.body.roomid;
     const text = req.body.text;
     const imageSrc = req.body.imageSrc;
     const lastmessage = text.length>0?text:imageSrc.length>0?"+**@print&picture&icon@**+":"";
    //  console.log(roomid);
     const roomMembers = await rooms.findOne({"_id":roomid},{users:1,_id:0});
    //  console.log(roomMembers);
     if(roomMembers){
         const addToNotification = await messageNotification.updateMany({
             username:{
                 $in:roomMembers.users
             },
             "notifications.roomid":roomid
         },{
            $inc:{
                "notifications.$.messagecount":1
            },
            $set:{
             "notifications.$.lastmessage":lastmessage,
             "notifications.$.updatedAt":new Date()
            }
         });
         if(addToNotification){
             res.status(200).json({
                 status:"success",
                 message:"notifications updated..."
             });
         }else{
             throw err;
         }
     }else{
         throw err;
     }
     }catch(err){
         res.status(400).json({
             status:"fail",
             message:"something went wrong,please try again..."
         });
     }
 });

router.route("/clearroomnotification").delete(async(req,res)=>{
    try{
    const {roomid,username} = req.body;
    // console.log(req.body);
    const clearRoomNotification = await messageNotification.updateOne({
        username:username,
        "notifications.roomid":roomid
    },{
        "notifications.$.messagecount":0,
    });
    if(clearRoomNotification){
        res.status(200).json({
            status:"success",
            message:"notification cleared for opened room"
        });
    }
    else{
        throw clearRoomNotification;
    }
}catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    });
}                   
});
 

module.exports = router;