const mongoose  = require('mongoose');

const Schema =  mongoose.Schema

const userCredentialsSchema =  new Schema({
    email:{
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


const usersCredentials = mongoose.model('usersCredentials', userCredentialsSchema);
module.exports = usersCredentials;