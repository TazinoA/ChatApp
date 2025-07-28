import express from "express";
import { updateProfilePic, getContacts, getMessages} from "../controllers/api_controller.js"
const router = express.Router();

router.post("/update-profile", updateProfilePic);
router.get("/get-contacts", getContacts);
router.get("/get-messages/:receiverId", getMessages);

export default router;
