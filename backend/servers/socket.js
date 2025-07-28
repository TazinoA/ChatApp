import express from "express";
import http from "http";
import {Server} from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { pool } from "../lib/db.js";

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
        socket.userId = userId;
        console.log(`User ${userId} registered with socket ${socket.id}`);
        console.log(userSocketMap);
    });

   socket.on("send-message", async (msg) =>{
        const { senderid, receiverid, content } = msg;
        const messageId = uuidv4();

        
        try {
            await pool.query(
                `INSERT INTO messages (senderid, receiverid, content) VALUES ($1, $2, $3)`,
                [senderid, receiverid, content]
            );

            const receiverSocketId = userSocketMap[receiverid];
            const senderSocketId = userSocketMap[senderid];

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", { ...msg, id: messageId });
            }
            if (senderSocketId) {
                io.to(senderSocketId).emit("receive-message", { ...msg, id: messageId });
            }

        } catch (e) {
            console.error("Failed to save or send message", e);
        }
    });

    socket.on("disconnect", () => {
        const userId = socket.userId;
        if (userId) {
            delete userSocketMap[userId];
        }
    });
});


export {io, app, server};