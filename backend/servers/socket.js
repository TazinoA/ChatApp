import express from "express";
import http from "http";
import {Server} from "socket.io";
import { v4 as uuidv4 } from 'uuid';

const app = express();

const server = http.createServer(app);

//online users
const userSocketMap = {}

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("register", (userId) => {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} registered with socket ${socket.id}`);
        console.log(userSocketMap);
    });

    socket.on("send-message", (msg) =>{
        const receiverId = msg.receiverid;
        const room = userSocketMap[receiverId];

        if(room){
            io.to(room).emit("receive-message", {...msg, id: uuidv4()});
        }else{
            socket.emit("receive-message", {...msg, id: uuidv4()})
        }
    });

    socket.on("disconnect", () =>{
        console.log("disconnected")
    });
});


export {io, app, server};