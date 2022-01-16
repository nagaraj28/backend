const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    roomid:{
        type:Schema.Types.ObjectId,
        ref :'rooms',
        required:true
    },
        username:{
            type:Schema.Types.String,
            ref :'ecommerceUserProfile',
            required:true
        },
        text:{
            type:String
        },
        imageSrc:{
            type:String
        },
    },
    {
        timestamps:true
    });
const messages = mongoose.model("messages",messagesSchema);
module.exports = messages;
