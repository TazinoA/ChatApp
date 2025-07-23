import express from "express";
import {signup, login, logout} from "../controllers/auth_controller.js"
import { verifyToken } from "../lib/utils.js";

const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout", logout);

router.post("/verify-token", verifyToken, (req, res) =>{
    res.status(200).json({isValid:true, user:req.user})
});

export default router;
