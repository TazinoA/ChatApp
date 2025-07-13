import { useContext } from "react";
import { login } from "../utils/auth_handler";
import AuthContext from "../utils/AuthContext";

function LoginPage(){
    const {loggedIn, setLoggedIn} = useContext(AuthContext);
    const user = {email: "afiemotazino3@gmail.com",password:"generichash"}
    return <>
    <div className = "">

    </div>
    {/* <h1>{loggedIn ? "logged in" : "logged out"} </h1> */}
    </>
}


export default LoginPage;