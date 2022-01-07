const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    username:{
        type:Schema.Types.String,
        ref :'ecommerceUserProfile',
        required:true
    },
    roomid:{
        type:Schema.Types.ObjectId,
        ref :'ecommerceUserProfile',
        required:true
    },
    message:[{
        text:{
            type:String
        },
        imageSrc:{
            type:String
        }
    }]
});
const messages = mongoose.model("messages",messagesSchema);
module.exports = messages;
