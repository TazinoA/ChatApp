import express from "express";
import {sendMessage, updateProfilePic} from "../controllers/api_controller.js"
const router = express.Router();

router.post("/message", sendMessage);
router.post("/update-profile", updateProfilePic)

export default router;
