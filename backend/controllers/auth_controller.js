import {pool} from "../lib/db.js";
import bcrypt from "bcrypt";
import generateToken from "../lib/utils.js";


async function signup(req, res){
const{name, email, password} = req.body;
let result = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
if(result.rows.length === 0){
    try{
        const password_hash = await bcrypt.hash(password, 10)
        await pool.query(`INSERT INTO users(name, email, password_hash) VALUES('${name}', '${email}', '${password_hash}')`)
        result = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
        const user = {
            id:result.rows[0].id
        };
        const token = generateToken(user,res);
        res.status(200).json({access_token: token});
    }catch(e){
        res.status(500).json({message: `There was an error signing you up: ${e}`})
    }
}else{
    res.status(300).json({message: "You are already signed up, go to the login page"})
}
}

async function login(req, res){
const{email, password} = req.body;
const result = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);

if(result.rows.length > 0){
    const password_hash = result.rows[0].password_hash;
    const isMatch = await bcrypt.compare(password, password_hash);

    if(isMatch){
        const user = {
            id:result.rows[0].id
        };
        const token = generateToken(user,res);
        res.status(200).json({access_token: token});
    }else{
        res.status(300).json({message: "You entered the wrong password"})
    }
}else{
    res.status(300).json({message: "You have not signed up, go to the signup page"})
    console.log("You have not signed up, go to the signup page")
}
}
export {signup, login};