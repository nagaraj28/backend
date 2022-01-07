const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const ecommerceUserProfile = require('../models/ecommerceuserprofile.model');

const roomsSchema = new Schema(
    {
        users:[{
                type:Schema.Types.String,
                required:true,
                unique:true,
                ref :'ecommerceUserProfile',
        }],
        roomName:{
            type:Schema.Types.String,
            required:true,
        },
        roomHistory:[
            {
               user:{
               type:Schema.Types.String,
               ref :'ecommerceUserProfile',
               },
               action:{
                   type:Schema.Types.String
               },
               time : { type : Date, default: Date.now },
               timeStamps:true
            }
        ],
        admins:[
            {
                    type:Schema.Types.String,
                    ref :'ecommerceUserProfile',
                    unique:true,
                    required:true
            }
        ],
        blockedAccounts:[
            {
                    type:Schema.Types.String,
                    ref :'ecommerceUserProfile',
                    unique:true,
                    required:true
            }
        ]
    }
);

const rooms = mongoose.model("rooms",roomsSchema);
module.exports = rooms;