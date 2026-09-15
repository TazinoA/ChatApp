import express from "express";
import authRouter from "../routes/auth_route.js";
import apiRouter from "../routes/api_route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../lib/utils.js";
import { app, server } from "./socket.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;
const __dirname = path.resolve();
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? true : [clientUrl, "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

app.use("/auth", authRouter);
app.use("/api", verifyToken, apiRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
