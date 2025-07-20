import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const secret = process.env.JWT_ACCESS_SECRET;

export default function generateToken(user, res){
    const token = jwt.sign(user, secret, {expiresIn:"7d"});
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure:false,
        sameSite:"None",
        maxAge: 1000 * 60 * 60 * 24,
    });
    return token;
}

export function verifyToken(req, res, next) {
  //console.log(req.cookies)
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ isValid: false, error: "No access token provided" });
    }

    const decoded = jwt.verify(accessToken, secret);
    req.user = decoded;  // attach user info to request object

    next();  // allow next handler to run

  } catch (error) {
    let errorMessage = "Invalid token";

    if (error.name === "TokenExpiredError") {
      errorMessage = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid token format";
    }

    return res.status(401).json({ isValid: false, error: errorMessage });
  }
}