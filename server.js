 
 const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app= express();

const port=process.env.PORT ||5000;

app.use(cors());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {useNewUrlParser: true}
    );

    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log("MongoDB database connection established successfully");
    })

    app.use(express.json());

    app.listen(port,()=>{
        console.log(`server running on port ${port}`);
    })

    const usersRouter = require('./routes/userscredentials');
    const userProfileRouter = require('./routes/userprofiledetails');
   const userPosts = require('./routes/userposts');


    app.use('/users', usersRouter);
   app.use('/userprofile',userProfileRouter);
   app.use('/user',userPosts);

