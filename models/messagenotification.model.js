const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageNotificationSchema = new Schema({
        username:{
            type:Schema.Types.String,
            ref :'ecommerceUserProfile',
            required:true
        },
        notifications:[
           { 
               roomid:{
                type:Schema.Types.ObjectId,
                ref :'ecommerceUserProfile',
                required:true,
            },
            roomName:{
                type:Schema.Types.String,
                ref:"rooms",
                required:true
                },
            messagecount:{
                type:Schema.Types.Number,
                required:true
            },
            lastmessage:{
            type:Schema.Types.String
            },
                updatedAt : { 
                    type : Schema.Types.Date, 
                    default: Date.now,
            },
        }
        ],
}
);
const messageNotification = mongoose.model("messagenotification",messageNotificationSchema);
module.exports = messageNotification;