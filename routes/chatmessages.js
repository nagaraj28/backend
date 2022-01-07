const router = require('express').Router();
const messages = require("../models/rooms.model");

router.route().get("/:roomid",async(req,res)=>{
    try{
        const roomid = req.params.roomid;
        const messages = await messages.find({"_id":roomid});
        if(messages){
            res.status(200).json({
                status:"success",
                messages:messages
            });
        }else{
            throw err;
        }
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        });
    }
});

//post a message to room
router.route().post("/addmessages",async(req,res)=>{
    try{
        const roomid = req.body.roomid;
        const message = req.body.message;
        const username = req.body.username;
        const messages = await messages.create({
            roomid,
            username,
            message
        },(err,res)=>{
            if(err){
                res.status(400).json({
                    status:"fail",
                    message:err
                });
            }else{
                res.status(200).json({
                    status:"success",
                    messages:messages
                });
            }
        });
    }catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        });
    }
});