import express from "express";
import authRouter from "../routes/auth_route.js"
import apiRouter from "../routes/api_route.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "../lib/utils.js";
import {io, app, server} from "./socket.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:3000",
    credentials:true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/api",verifyToken, apiRouter);

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(port);


