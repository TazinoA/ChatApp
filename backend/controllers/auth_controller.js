import {pool} from "../db.js";
import bcrypt from "bcrypt";


async function signup(req, res){
//const{name, email, password} = req.body;
const email = 'afiemotazino3@gmail.com'
const name = "fego"
const password = "unhashed password"
const result = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);

if(result.rows.length === 0){
    try{
        const password_hash = await bcrypt.hash(password, 10)
        await pool.query(`INSERT INTO users(name, email, password_hash) VALUES('${name}', '${email}', '${password_hash}')`)
    }catch(e){
        res.send(`There was an error in signing you up: ${e}`)
    }
}else{
    //res.send("You are already signed up, go to the login page")
    console.log("You are already signed up, go to the login page")
}
}

async function login(req, res){

 //const{name, email, password} = req.body;

const email = 'afiemotazino1@gmail.com'
const password = "unhashed password"
const result = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);

if(result.rows.length >= 0){
    const password_hash = result.rows[0].password_hash;
    const isMatch = await bcrypt.compare(password, password_hash)
    console.log(isMatch);
}else{
    //res.send("You have not signed up, go to the signup page")
    console.log("You have not signed up, go to the signup page")
}
}

login(1,2)
export {signup, login};