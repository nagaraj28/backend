 const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const socketio = require("socket.io");
const messageNotification = require("./models/messagenotification.model");

// const httpServer = require("http").createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(httpServer, {   allowEIO3: true // false by default
// });

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
    const ecommerceUserProfile = require('./routes/ecommerceuserprofile');
    const chatRooms = require('./routes/chatrooms');
    const chatMessages = require('./routes/chatmessages');
    const chatRoomUsers = require('./routes/chatroom-credentials');


    app.use('/users', usersRouter);
    app.use('/userprofile',userProfileRouter);
    app.use('/user',userPosts);
    app.use('/products',products);
    app.use('/ecommerceuser',ecommerceUserProfile);
    app.use('/chat',chatRooms);
    app.use("/messages",chatMessages);
    app.use("/chatroomuser",chatRoomUsers);

        /* 
    socket connection logic

    */
   const io = socketio(server,{ 
         allowEIO3: true,
          // false by default
          cors: {
            origin: ["http://localhost:3000","http://localhost:3001","https://crypto-rooms.netlify.app"],
            methods: ["GET", "POST"]
          }
 });
    io.on("connection",(socket)=>{
        //can be accessed in route files.
    app.set("socket",socket);
    app.set("io",io);
        console.log("user connected...");
        socket.on("incoming-chat",(message)=>{
            // console.log(message);
            // console.log(message);
            io.emit(message.roomid,message);
        });
        socket.on("disconnect",()=>{
            console.log("user disconnected");
        });
        
    });
    

    io.engine.on("connection_error", (err) => {
    //   console.log(err.req);      // the request object
    //   console.log(err.code);     // the error code, for example 1
    //   console.log(err.message);  // the error message, for example "Session ID unknown"
    //   console.log(err.context);  // some additional error context
    });

    /* 
    notify change updates
    */
    const messageNotificationStream = messageNotification.watch();
    messageNotificationStream.on("change",(next)=>{
            io.emit("notify",true);
    });


  
