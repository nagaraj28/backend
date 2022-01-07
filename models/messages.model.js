const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    userid:{
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
