const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const cartSchema = new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:"ecommerceUserProfile",
    },
    cartproducts:[
        {
            productid:{
                type:Schema.Types.ObjectId,
                ref:"products",
                unique:true
            },
            quantity:{
                type:Number,
                required:true
            },
            "_id": false,
        }
    ]
});

const cart = mongoose.model("cart",cartSchema);
module.exports = cart;