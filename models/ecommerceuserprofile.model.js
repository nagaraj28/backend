const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ecommerceUserProfileSchema = new Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    }
})

const ecommerceUserProfile = mongoose.model("ecommerceuserprofile",ecommerceUserProfileSchema);
module.exports = ecommerceUserProfile;