const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const ecommerceUserProfile = require('../models/ecommerceuserprofile.model');

const roomsSchema = new Schema(
    {
        users:[{
            userid:{
                type:Schema.Types.ObjectId,
                ref :'ecommerceUserProfile',
                unique:true,
                required:true
            }
        }],
        roomHistory:[
            {
               user:{
                type:Schema.Types.ObjectId,
                ref :'ecommerceUserProfile',
               },
               action:{
                   type:Schema.Types.String
               },
               time : { type : Date, default: Date.now }
            }
        ],
        admins:[
            {
                userid:{
                    type:Schema.Types.ObjectId,
                    ref :'ecommerceUserProfile',
                    unique:true,
                    required:true
                }
            }
        ],
        blockedAccounts:[
            {
                userid:{
                    type:Schema.Types.ObjectId,
                    ref :'ecommerceUserProfile',
                    unique:true,
                    required:true
                }
            }
        ]
    }
);
const rooms = mongoose.model("rooms",roomsSchema);
module.exports = rooms;