import express from "express";
import router from "./routes/auth_route.js"
const app = express();


app.use("/auth", router);

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(3000);