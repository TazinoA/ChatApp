import express from "express";
import authRouter from "../routes/auth_route.js"
import messageRouter from "../routes/message_route.js"
const app = express();

app.use(express.json())
app.use("/auth", authRouter);
app.use("/api", messageRouter);

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(3000);