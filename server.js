 const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
// const httpServer = require("http").createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(httpServer, {   allowEIO3: true // false by default
// });
const socketio = require("socket.io");
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

  
    
    //app.listen() not needed as httpServer created for socket.io works with other things.
    const server = app.listen(port,()=>{
        console.log(`server running on port ${port}`);
    })
    // httpServer.listen(port,()=>{
    //     console.log(`server running on port ${port}`);
    // });

    const usersRouter = require('./routes/userscredentials');
    const userProfileRouter = require('./routes/userprofiledetails');
    const userPosts = require('./routes/userposts');
    const products = require('./routes/products');
    const ecommerceUserProfile = require('./routes/ecommerceuserprofile')

    app.use('/users', usersRouter);
    app.use('/userprofile',userProfileRouter);
    app.use('/user',userPosts);
    app.use('/products',products);
    app.use('/ecommerceuser',ecommerceUserProfile);

        /* 
    socket connection logic

    */
   const io = socketio(server,{ 
         allowEIO3: true // false by default
    //
 });
    //can be accessed in route files.
    app.set("socket",io);
    io.on("connection",(socket)=>{
        console.log("user connected with socketID",socket.id);
        socket.on("disconnect",()=>{
            console.log("user disconnected");
        })
    });

    io.engine.on("connection_error", (err) => {
    //   console.log(err.req);      // the request object
    //   console.log(err.code);     // the error code, for example 1
    //   console.log(err.message);  // the error message, for example "Session ID unknown"
    //   console.log(err.context);  // some additional error context
    });

  
