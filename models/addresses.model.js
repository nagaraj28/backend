const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressesSchema = new Schema(
    {
        userid:{
            type:Schema.Types.ObjectId,
            ref:'ecommerceUserProfile',
        },
        street:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        zipcode:{
            type:String,
            required:true
        },
        phoneno:{
            type:Number,
            required:true
        }
    }
);


const addresses = mongoose.model("addresses",addressesSchema);

module.exports = addresses;
