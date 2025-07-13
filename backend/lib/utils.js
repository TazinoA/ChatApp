import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios"

dotenv.config({path:"../.env"});

export default function generateToken(user, res){
    const token = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {expiresIn:"7d"});
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure:true,
        sameSite:"Lax",
    });
    return token;
}

export function verifyToken(req, res) {
    try {
        const accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            return res.status(401).json({ 
                isValid: false, 
                error: 'No access token provided' 
            });
        }
        
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        
        res.json({ 
            isValid: true, 
            user: decoded 
        });
        
    } catch (error) {
        let errorMessage = 'Invalid token';
        
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token expired';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token format';
        }
        
        res.status(401).json({ 
            isValid: false, 
            error: errorMessage 
        });
    }
}

export const api = axios.create({
    withCredentials:true,
    baseURL: process.env.API_BASE_URL
})


