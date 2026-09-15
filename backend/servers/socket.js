import express from "express";
import http from "http";
import { Server } from "socket.io";
import { pool } from "../lib/db.js";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const secret = process.env.JWT_ACCESS_SECRET || "default_jwt_secret_change_in_production";
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const app = express();
const server = http.createServer(app);

// Store user socket IDs: userId -> Set<socketId>
const userSocketMap = new Map();

export function getOnlineUserIds() {
  return Array.from(userSocketMap.keys()).map((id) => Number(id));
}

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? true : [clientUrl, "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
});

// Socket middleware for JWT authentication
io.use(async (socket, next) => {
  try {
    const rawCookies = socket.handshake.headers.cookie;
    let token = null;

    if (rawCookies) {
      const parsed = cookie.parse(rawCookies);
      token = parsed.accessToken;
    }

    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, secret);
    socket.userId = Number(decoded.id);
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;

  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, new Set());
  }
  userSocketMap.get(userId).add(socket.id);

  // Emit online users as array of user IDs
  io.emit("getOnlineUsers", getOnlineUserIds());

  socket.on("send-message", async (msg) => {
    try {
      const senderid = socket.userId;
      let { receiverid, content } = msg;

      receiverid = Number(receiverid);
      if (!receiverid || isNaN(receiverid)) {
        return socket.emit("error-message", { message: "Invalid receiver ID" });
      }

      if (typeof content !== "string" || !content.trim()) {
        return socket.emit("error-message", { message: "Message content cannot be empty" });
      }

      if (content.length > 5000) {
        return socket.emit("error-message", { message: "Message exceeds maximum length of 5000 characters" });
      }

      // Verify recipient exists
      const recipientCheck = await pool.query("SELECT id FROM users WHERE id = $1", [receiverid]);
      if (recipientCheck.rows.length === 0) {
        return socket.emit("error-message", { message: "Recipient user does not exist" });
      }

      // Insert message into database
      const insertResult = await pool.query(
        `INSERT INTO messages (senderid, receiverid, content) VALUES ($1, $2, $3) RETURNING id, senderid, receiverid, content, timestamp`,
        [senderid, receiverid, content.trim()]
      );

      const savedMessage = insertResult.rows[0];

      // Broadcast saved message to recipient sockets
      const receiverSockets = userSocketMap.get(receiverid);
      if (receiverSockets) {
        for (const sockId of receiverSockets) {
          io.to(sockId).emit("receive-message", savedMessage);
        }
      }

      // Emit directly to current socket if not in map for any reason
      socket.emit("receive-message", savedMessage);

      // Broadcast saved message to sender sockets (for sync across multiple tabs/devices)
      const senderSockets = userSocketMap.get(senderid);
      if (senderSockets) {
        for (const sockId of senderSockets) {
          io.to(sockId).emit("receive-message", savedMessage);
        }
      }
    } catch (e) {
      console.error("Failed to save or send message:", e);
      socket.emit("error-message", { message: "Failed to process message" });
    }
  });

  socket.on("disconnect", () => {
    const userSockets = userSocketMap.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        userSocketMap.delete(userId);
      }
    }
    io.emit("getOnlineUsers", getOnlineUserIds());
  });
});

export { io, app, server };
