const router = require('express').Router();
const rooms = require(".././models/rooms.model");

router.route("/").get(async(req,res)=>{
    try{
        const roomsData =await rooms.find();
        if(!roomsData){
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
    createRoom.save().then((room)=>{
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
        const userRooms = await rooms.find({
            users:{
                $in:[username]
            }
        });
        if(userRooms){
            //join rooms
            // console.log(userRooms);
       try{
        const socket = req.app.get("socket");
        // userRooms.forEach((room)=>{
        //     socket.on(room._id,(messageReceived)=>{
        //         socket.emit("")
        //     })
        // })
        // console.log(roomIds);
       }
       catch(err){
        console.log("exeception in getting socket obj");
       }
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

module.exports = router;