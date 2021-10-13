const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:'userCredentials',
    },
    caption:{
        type:String,
    },
    postimg:{
        type:String,
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
        ref:'userCredentials',
        }
     ],
    comments:[{
        commentbyUser:{
            type:Schema.Types.ObjectId,
            ref:'userCredentials',
        },
        commentBody:{
            type:String,
        }
    }],
},{
    timestamps:true,
})





const posts = mongoose.model('posts',postSchema);

module.exports = posts;
