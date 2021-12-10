const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const ordersSchema = new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:"ecommerceUserProfile",
    },
    orderedProducts:[
        {
            order:[
             {
                 productid:{
                    type:Schema.Types.ObjectId,
                    ref:"products",
                    required:true
                 },
                 deliveryCharge:{
                     type:Number,
                     required:true
                 },
                 displayName:{
                    type:String,
                    required:true
                 },
                 imageURL:{
                    type:String,
                    required:true
                 },
                 offerPrice:{
                    type:Number,
                    required:true
                 },
                 price:{
                    type:Number,
                    required:true
                 },
                 quantity:{
                    type:Number,
                    required:true
                 },
                 "_id": false,
             },
            ],
            addressDelivered:{
                name:String,
                street:String,
                city:String,
                state:String,
                zipcode:Number,
                phoneno:Number
            },
            time : { type : Date, default: Date.now },
        }
    ]
});

const orders = mongoose.model("orders",ordersSchema);
module.exports = orders;