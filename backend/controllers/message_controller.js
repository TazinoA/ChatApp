import {pool} from "../lib/db.js";

async function sendMessage(req, res){
    const{sender_id, receiver_id, content} = req.body;
    if(!sender_id || !receiver_id || !content){
        res.status(400).json({message:"Error: All fields required"});
        return;
    }
    try{
        await pool.query(`INSERT INTO messages (senderid, receiverid, content) VALUES (${sender_id}, ${receiver_id}, '${content}')`);
        res.status(200).json({message:"Successfully sent message"})
    }catch(e){
        res.status(500).json({message: `Internal server error: ${e}`})
    }
}

export default sendMessage;