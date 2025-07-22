import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { pool } from "./db.js";


dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const secret = process.env.JWT_ACCESS_SECRET;

export default function generateToken(user, res){
    const token = jwt.sign(user, secret, {expiresIn:"7d"});
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure:false,
        sameSite:"Lax",
        maxAge: 1000 * 60 * 60 * 24,
    });
    return token;
}

export async function verifyToken(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ isValid: false, error: "No access token provided" });
    }

    const decoded = jwt.verify(accessToken, secret);

     // Fetch full user details from DB
    const result = await pool.query("SELECT id ,name, email, profile_pic, date_joined FROM users WHERE id = $1", [decoded.id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ isValid: false, error: "User not found" });
    }

    req.user = user; // Attach full user details

    next();

  } catch (error) {
    req.user = null;
    let errorMessage = "Invalid token";

    if (error.name === "TokenExpiredError") {
      errorMessage = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid token format";
    }

    return res.status(401).json({ isValid: false, error: errorMessage });
  }
}