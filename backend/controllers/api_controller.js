import { pool } from "../lib/db.js";

export async function updateProfilePic(req, res){
    const {profilePic} = req.body;
    const {id:userId} = req.user;

    try{
      await pool.query(`UPDATE users SET profile_pic = $1 WHERE id = $2`, [profilePic, userId]);
      res.status(200).json({message:"Successfully updated profile photo"});
    } catch(e){
      res.status(500).json({message:"Internal server error"});
    }
}


export async function getContacts(req, res) {
  const {id:userId} = req.user

  try{
    const result = await pool.query("SELECT id, name, profile_pic FROM users WHERE id != $1", [userId]);
    res.status(200).json({contacts:result.rows});
  }catch(e){
    res.status(500).json({message:"Internal server error"});
  }
}

export async function getMessages(req,res) {
  const {id:userId} = req.user
  const {receiverId} = req.params;

  if (!receiverId || isNaN(receiverId)) {
  return res.status(400).json({ message: "Invalid or missing field." });
  }

  try{
    const result = await pool.query(
  "SELECT * FROM messages WHERE (senderId = $1 AND receiverId = $2) OR (receiverId = $1 AND senderId = $2) ORDER BY timestamp ASC",
      [userId, receiverId]
    );
    res.status(200).json({messages:result.rows});
  }catch(e){
    res.status(500).json({message:"Internal server error"});
  }
}
