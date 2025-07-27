import express from "express";
import {sendMessage, updateProfilePic, getContacts, getMessages} from "../controllers/api_controller.js"
const router = express.Router();

router.post("/send-message", sendMessage);
router.post("/update-profile", updateProfilePic);
router.get("/get-contacts", getContacts);
router.get("/get-messages/:receiverId", getMessages);

export default router;
