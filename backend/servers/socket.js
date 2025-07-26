import express from "express";
import http from "http";
import {Server} from "socket.io";
import { v4 as uuidv4 } from 'uuid';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("disconnect", () =>{
        console.log("disconnected")
    });

    socket.on("send-message", (msg) =>{
        io.emit("receive-message", {...msg, id: uuidv4()})
    })
})

export {io, app, server};