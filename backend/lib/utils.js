import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function generateToken(user, res){
    const token = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {expiresIn:"7d"});
    res.cookie("token", token, {httpOnly: true});
    return token;
}

export default generateToken;