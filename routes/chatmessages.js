const router = require('express').Router();
const messages = require(".././models/messages.model");


router.route("/:roomid").get(async(req,res)=>{
    try{
        const roomid = req.params.roomid;
        const fetchedMessages = await messages.find({"roomid":roomid});
        if(messages){
            res.status(200).json({
                status:"success",
                messages:fetchedMessages
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
router.route("/addmessages").post(async(req,res)=>{
    try{
        const roomid = req.body.roomid;
        const text = req.body.text;
        const username = req.body.username;
        const imageSrc = req.body.imageSrc;
        const insertMessages = await messages.create({
            roomid,
            username,
            text,
            imageSrc
        },(err,result)=>{
            // console.log(err,result);
            if(err){
                console.log("error",err);
               throw err;
            }else{
                res.status(200).json({
                    status:"success",
                    messages:result
                });
            }
        });
    }catch(err){
        response.status(404).json({
            status:"fail",
            message:err
        });
    }
});


module.exports = router;