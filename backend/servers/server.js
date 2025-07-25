import express from "express";
import authRouter from "../routes/auth_route.js"
import apiRouter from "../routes/api_route.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "../lib/utils.js";
import { app, io, server } from "./socket.js";

app.use(cors({
    origin: "http://localhost:3000",
    credentials:true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/api",verifyToken, apiRouter);


server.listen(5000, () => console.log("server running on port 5000"));