import express from "express";
import authRouter from "../routes/auth_route.js"
import messageRouter from "../routes/message_route.js"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true,
}));
app.use("/auth", authRouter);
app.use("/api", messageRouter);

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(5000, () => console.log("server running on port 5000"));