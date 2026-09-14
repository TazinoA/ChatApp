import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { pool } from "./db.js";

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const secret = process.env.JWT_ACCESS_SECRET || "default_jwt_secret_change_in_production";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export default function generateToken(user, res) {
  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "7d" });
  if (res && res.cookie) {
    res.cookie("accessToken", token, COOKIE_OPTIONS);
  }
  return token;
}

export async function verifyToken(req, res, next) {
  try {
    let accessToken = req.cookies ? req.cookies.accessToken : null;

    if (!accessToken && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        accessToken = parts[1];
      }
    }

    if (!accessToken) {
      return res.status(401).json({ isValid: false, error: "No access token provided" });
    }

    const decoded = jwt.verify(accessToken, secret);

    const result = await pool.query(
      "SELECT id, name, email, profile_pic, date_joined FROM users WHERE id = $1",
      [decoded.id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ isValid: false, error: "User not found" });
    }

    req.user = user;
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
