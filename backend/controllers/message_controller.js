import { pool } from "../lib/db.js";

async function sendMessage(req, res) {
  const { sender_id, receiver_id, content } = req.body;

  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ message: "Error: All fields required" });
  }

  try {
    await pool.query(
      `INSERT INTO messages (senderid, receiverid, content) VALUES ($1, $2, $3)`,
      [sender_id, receiver_id, content]
    );

    res.status(200).json({ message: "Successfully sent message" });
  } catch (e) {
    console.error("DB Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default sendMessage;
