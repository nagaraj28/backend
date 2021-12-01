const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const wishlistSchema = new Schema({
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

const wishlist = mongoose.model("wishlist",wishlistSchema);
module.exports = wishlist;