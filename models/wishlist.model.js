const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const wishlistSchema = new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:"ecommerceUserProfile"
    },
    wishlistproducts:[
        {
            productid:{
                type:Schema.Types.ObjectId,
                ref:"products"
            },
            "_id": false,
        }
    ]
});

const wishlist = mongoose.model("wishlist",wishlistSchema);
module.exports = wishlist;