import express from "express";
import authRouter from "../routes/auth_route.js"
import apiRouter from "../routes/api_route.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "../lib/utils.js";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials:true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/api",verifyToken, apiRouter);

app.post("/auth/verify-token", verifyToken, (req, res) =>{
    res.status(200).json({isValid:true, user:req.user})
});

app.post("/auth/logout", (req, res) => {
    res.clearCookie("accessToken",{
        httpOnly: true,
        secure:false,
        sameSite:"Lax",
    });
    return res.status(200).json({message: "Logged out successfully"})
})

app.listen(5000, () => console.log("server running on port 5000"));