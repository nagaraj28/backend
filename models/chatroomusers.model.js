const mongoose  = require('mongoose');

const Schema =  mongoose.Schema

const chatRoomUsersSchema =  new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    }
});


const chatRoomUsers = mongoose.model('chatRoomUsers', chatRoomUsersSchema);
module.exports = chatRoomUsers;