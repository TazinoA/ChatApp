import { useState,useContext } from "react";
import { login, signUp } from "../utils/auth_handler";
import AuthContext from "../utils/AuthContext";

function LoginPage(){
    const {loggedIn, setLoggedIn} = useContext(AuthContext);
    const user = {
        email: "afiemotazino3@gmail.com",
        password:"generichash"
    }
    return <>
    <button onClick = {() => login(user)}>{loggedIn ? "log out" : "log in"}</button>
    <h1>{loggedIn ? "logged in" : "logged out"} </h1>
    </>
}


export default LoginPage;