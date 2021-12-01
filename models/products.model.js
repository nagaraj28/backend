const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productsSchema = new Schema(
    {
    displayName:{
        type:String,
        required:true
    },
    shortDescription:{
        type:String,
    },
    longDescription:{
        type:String,
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
    },
    deliveryCharge:{
        type:Number,
    },
    offerPrice:{
        type:Number,
    },
    brand:{
        type:String,
        required:true
    },
    avgRating:{
        type:Number,
    },
    imageURL:{
        type:String,
    },
    reviews:[]
    }
);

const products = mongoose.model("products",productsSchema);
module.exports = products;