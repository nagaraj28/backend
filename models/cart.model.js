const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const cartSchema = new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:"ecommerceUserProfile"
    },
    cartproducts:[
        {
            product:{
                type:Schema.Types.ObjectId,
                ref:"products"
            }
        }
    ]
});

const cart = mongoose.model("cart",cartSchema);
module.exports = cart;