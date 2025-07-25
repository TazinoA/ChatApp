import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
    origin: "http://localhost:3000",
    credentials:true,
}
});

io.on("connection", (socket) => {
    socket.on("send-message", (message,room) =>{
        socket.to(room).emit("receive-message", message)
    })
});



export {io, app, server};